-- ============================================================================
-- MIGRATION 005: MENTOR ROLE, MENTOR APPLICATIONS & NOTIFICATIONS
-- Description: Adds 'mentor' role, mentor applications queue, notices and notice_reads tables
-- ============================================================================

-- 1. Update profiles.role constraint to allow 'mentor'
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check 
  CHECK (role IN ('student', 'faculty', 'mentor', 'admin'));

-- 2. Mentor Applications Table
CREATE TABLE IF NOT EXISTS public.mentor_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_mentor_apps_user_id ON public.mentor_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_mentor_apps_status ON public.mentor_applications(status);

-- 3. Notices Table (Broadcast messages sent by mentors/admins)
CREATE TABLE IF NOT EXISTS public.notices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  target_filter TEXT DEFAULT 'all', -- 'all', 'weak_bubble', 'weak_selection', 'weak_insertion', 'weak_merge', 'weak_quick'
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_notices_sender_id ON public.notices(sender_id);
CREATE INDEX IF NOT EXISTS idx_notices_created_at ON public.notices(created_at DESC);

-- 4. Notice Reads Table (Tracks per-user read/unread state)
CREATE TABLE IF NOT EXISTS public.notice_reads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notice_id UUID NOT NULL REFERENCES public.notices(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  read_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT uq_notice_user UNIQUE (notice_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_notice_reads_user_id ON public.notice_reads(user_id);

-- 5. Updated_at Trigger on mentor_applications
DROP TRIGGER IF EXISTS trigger_mentor_apps_updated_at ON public.mentor_applications;
CREATE TRIGGER trigger_mentor_apps_updated_at
  BEFORE UPDATE ON public.mentor_applications
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 6. Helper Function: Is Mentor Check (Returns true if user is mentor or admin)
CREATE OR REPLACE FUNCTION public.is_mentor()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('mentor', 'admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 7. Enable RLS on new tables
ALTER TABLE public.mentor_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notice_reads ENABLE ROW LEVEL SECURITY;

-- 8. RLS Policies for mentor_applications
DROP POLICY IF EXISTS "mentor_apps_select_own_or_admin" ON public.mentor_applications;
CREATE POLICY "mentor_apps_select_own_or_admin"
  ON public.mentor_applications FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "mentor_apps_insert_own" ON public.mentor_applications;
CREATE POLICY "mentor_apps_insert_own"
  ON public.mentor_applications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "mentor_apps_update_admin" ON public.mentor_applications;
CREATE POLICY "mentor_apps_update_admin"
  ON public.mentor_applications FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 9. RLS Policies for user_progress (Allow Mentors & Admins to view all users' progress)
DROP POLICY IF EXISTS "user_progress_select_own" ON public.user_progress;
DROP POLICY IF EXISTS "user_progress_select_own_or_mentor" ON public.user_progress;
CREATE POLICY "user_progress_select_own_or_mentor"
  ON public.user_progress FOR SELECT
  USING (auth.uid() = user_id OR public.is_mentor() OR public.is_admin());

-- 10. RLS Policies for profiles (Allow Mentors to view student list for tracking)
DROP POLICY IF EXISTS "profiles_select_own_or_admin" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_own_or_staff" ON public.profiles;
CREATE POLICY "profiles_select_own_or_staff"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_mentor() OR public.is_admin());

-- 11. RLS Policies for notices
DROP POLICY IF EXISTS "notices_select_authenticated" ON public.notices;
CREATE POLICY "notices_select_authenticated"
  ON public.notices FOR SELECT
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "notices_insert_mentor_or_admin" ON public.notices;
CREATE POLICY "notices_insert_mentor_or_admin"
  ON public.notices FOR INSERT
  WITH CHECK (public.is_mentor() OR public.is_admin());

-- 12. RLS Policies for notice_reads
DROP POLICY IF EXISTS "notice_reads_select_own" ON public.notice_reads;
CREATE POLICY "notice_reads_select_own"
  ON public.notice_reads FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "notice_reads_insert_own" ON public.notice_reads;
CREATE POLICY "notice_reads_insert_own"
  ON public.notice_reads FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "notice_reads_update_own" ON public.notice_reads;
CREATE POLICY "notice_reads_update_own"
  ON public.notice_reads FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
