-- ============================================================================
-- MIGRATION 005 ROLLBACK: MENTOR ROLE, MENTOR APPLICATIONS & NOTIFICATIONS
-- ============================================================================

DROP POLICY IF EXISTS "notice_reads_update_own" ON public.notice_reads;
DROP POLICY IF EXISTS "notice_reads_insert_own" ON public.notice_reads;
DROP POLICY IF EXISTS "notice_reads_select_own" ON public.notice_reads;
DROP TABLE IF EXISTS public.notice_reads CASCADE;

DROP POLICY IF EXISTS "notices_insert_mentor_or_admin" ON public.notices;
DROP POLICY IF EXISTS "notices_select_authenticated" ON public.notices;
DROP TABLE IF EXISTS public.notices CASCADE;

DROP POLICY IF EXISTS "mentor_apps_update_admin" ON public.mentor_applications;
DROP POLICY IF EXISTS "mentor_apps_insert_own" ON public.mentor_applications;
DROP POLICY IF EXISTS "mentor_apps_select_own_or_admin" ON public.mentor_applications;
DROP TRIGGER IF EXISTS trigger_mentor_apps_updated_at ON public.mentor_applications;
DROP TABLE IF EXISTS public.mentor_applications CASCADE;

DROP FUNCTION IF EXISTS public.is_mentor();

-- Revert profiles and user_progress RLS policies
DROP POLICY IF EXISTS "profiles_select_own_or_staff" ON public.profiles;
CREATE POLICY "profiles_select_own_or_admin"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "user_progress_select_own_or_mentor" ON public.user_progress;
CREATE POLICY "user_progress_select_own"
  ON public.user_progress FOR SELECT
  USING (auth.uid() = user_id);

ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check 
  CHECK (role IN ('student', 'faculty', 'admin'));
