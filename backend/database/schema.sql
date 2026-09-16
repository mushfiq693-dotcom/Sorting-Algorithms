-- ============================================================================
-- ALGOHUB BETA DATABASE SCHEMA (MASTER REFERENCE)
-- PostgreSQL / Supabase Schema Definition
-- Includes: Tables, Constraints, Indexes, RLS Policies, Functions, & Triggers
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. TABLES & CONSTRAINTS
-- ----------------------------------------------------------------------------

-- Profiles Table (1-to-1 extension of Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  department TEXT DEFAULT 'CSE',
  student_id TEXT,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'faculty', 'mentor', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON public.profiles(created_at DESC);

-- Beta Access Control Table
CREATE TABLE IF NOT EXISTS public.beta_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'suspended')),
  approved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  approved_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_beta_access_user_id ON public.beta_access(user_id);
CREATE INDEX IF NOT EXISTS idx_beta_access_status ON public.beta_access(status);
CREATE INDEX IF NOT EXISTS idx_beta_access_user_status ON public.beta_access(user_id, status);
CREATE INDEX IF NOT EXISTS idx_beta_access_approved_by ON public.beta_access(approved_by);

-- Mentor Applications Table
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
CREATE INDEX IF NOT EXISTS idx_mentor_apps_user_status ON public.mentor_applications(user_id, status);
CREATE INDEX IF NOT EXISTS idx_mentor_apps_reviewed_by ON public.mentor_applications(reviewed_by);
CREATE INDEX IF NOT EXISTS idx_mentor_apps_created_at ON public.mentor_applications(created_at DESC);

-- Notices Table (Broadcast messages sent by mentors/admins)
CREATE TABLE IF NOT EXISTS public.notices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  target_filter TEXT DEFAULT 'all',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_notices_sender_id ON public.notices(sender_id);
CREATE INDEX IF NOT EXISTS idx_notices_created_at ON public.notices(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notices_target_created ON public.notices(target_filter, created_at DESC);

-- Notice Reads Table (Tracks per-user read/unread state)
CREATE TABLE IF NOT EXISTS public.notice_reads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notice_id UUID NOT NULL REFERENCES public.notices(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  read_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT uq_notice_user UNIQUE (notice_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_notice_reads_user_id ON public.notice_reads(user_id);
CREATE INDEX IF NOT EXISTS idx_notice_reads_notice_id ON public.notice_reads(notice_id);
CREATE INDEX IF NOT EXISTS idx_notice_reads_user_read ON public.notice_reads(user_id, read_at DESC);

-- User Progress & Telemetry Table (Cloud sync for localStorage & Adaptive Dashboard)
CREATE TABLE IF NOT EXISTS public.user_progress (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  completed_steps JSONB NOT NULL DEFAULT '[]'::jsonb,
  completed_docs JSONB NOT NULL DEFAULT '[]'::jsonb,
  quiz_scores JSONB NOT NULL DEFAULT '{}'::jsonb,
  topic_scores JSONB NOT NULL DEFAULT '{}'::jsonb,
  activity_history JSONB NOT NULL DEFAULT '[]'::jsonb,
  last_active_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_user_progress_last_active ON public.user_progress(last_active_at DESC);

-- Feedback Submissions Table
CREATE TABLE IF NOT EXISTS public.feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  category TEXT NOT NULL DEFAULT 'general' CHECK (category IN ('general', 'visualizer', 'debugger', 'courseware', 'suggestion')),
  rating INT CHECK (rating BETWEEN 1 AND 5),
  message TEXT NOT NULL,
  page_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_feedback_user_id ON public.feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON public.feedback(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feedback_category ON public.feedback(category);
CREATE INDEX IF NOT EXISTS idx_feedback_user_created ON public.feedback(user_id, created_at DESC);

-- Bug Reports Table
CREATE TABLE IF NOT EXISTS public.bug_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  algorithm_id TEXT,
  page_url TEXT NOT NULL,
  steps_to_reproduce TEXT NOT NULL,
  expected_behavior TEXT,
  actual_behavior TEXT,
  browser_info TEXT,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'closed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_bug_reports_user_id ON public.bug_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_bug_reports_status ON public.bug_reports(status);
CREATE INDEX IF NOT EXISTS idx_bug_reports_created_at ON public.bug_reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bug_reports_status_created ON public.bug_reports(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bug_reports_algo_status ON public.bug_reports(algorithm_id, status);

-- Course Materials Table (Lipschutz & Seymour 4th Ed courseware)
CREATE TABLE IF NOT EXISTS public.course_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  book_reference TEXT,
  topic_tag TEXT,
  content_type TEXT NOT NULL CHECK (content_type IN ('topic', 'problem', 'algorithm')),
  problem_statement TEXT,
  explanation_or_solution TEXT NOT NULL,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  assigned_date DATE,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_course_materials_topic_tag ON public.course_materials(topic_tag);
CREATE INDEX IF NOT EXISTS idx_course_materials_content_type ON public.course_materials(content_type);
CREATE INDEX IF NOT EXISTS idx_course_materials_created_at ON public.course_materials(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_course_materials_created_by ON public.course_materials(created_by);
CREATE INDEX IF NOT EXISTS idx_course_materials_assigned_date ON public.course_materials(assigned_date DESC);
CREATE INDEX IF NOT EXISTS idx_course_materials_type_tag ON public.course_materials(content_type, topic_tag);

-- ----------------------------------------------------------------------------
-- 2. ROW LEVEL SECURITY (RLS) POLICIES
-- ----------------------------------------------------------------------------

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.beta_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentor_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notice_reads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bug_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_materials ENABLE ROW LEVEL SECURITY;

-- Helper function: Is Admin Check
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Helper function: Is Mentor Check
CREATE OR REPLACE FUNCTION public.is_mentor()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('mentor', 'admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Profiles Policies
CREATE POLICY "profiles_select_own_or_staff"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_mentor() OR public.is_admin());

CREATE POLICY "profiles_update_own_fields"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id AND (
      role = (SELECT role FROM public.profiles WHERE id = auth.uid()) OR public.is_admin()
    )
  );

CREATE POLICY "profiles_update_admin"
  ON public.profiles FOR UPDATE
  USING (public.is_admin());

-- Beta Access Policies
CREATE POLICY "beta_access_select_own_or_admin"
  ON public.beta_access FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "beta_access_insert_own_pending"
  ON public.beta_access FOR INSERT
  WITH CHECK (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "beta_access_insert_admin"
  ON public.beta_access FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "beta_access_update_own_pending"
  ON public.beta_access FOR UPDATE
  USING (auth.uid() = user_id AND status = 'pending')
  WITH CHECK (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "beta_access_update_admin"
  ON public.beta_access FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "beta_access_delete_admin"
  ON public.beta_access FOR DELETE
  USING (public.is_admin());

-- Mentor Applications Policies
CREATE POLICY "mentor_apps_select_own_or_admin"
  ON public.mentor_applications FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "mentor_apps_insert_own"
  ON public.mentor_applications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "mentor_apps_update_admin"
  ON public.mentor_applications FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- User Progress Policies
CREATE POLICY "user_progress_select_own_or_mentor"
  ON public.user_progress FOR SELECT
  USING (auth.uid() = user_id OR public.is_mentor() OR public.is_admin());

CREATE POLICY "user_progress_update_own"
  ON public.user_progress FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_progress_insert_own"
  ON public.user_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Notices Policies
CREATE POLICY "notices_select_authenticated"
  ON public.notices FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "notices_insert_mentor_or_admin"
  ON public.notices FOR INSERT
  WITH CHECK (public.is_mentor() OR public.is_admin());

-- Notice Reads Policies
CREATE POLICY "notice_reads_select_own"
  ON public.notice_reads FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "notice_reads_insert_own"
  ON public.notice_reads FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "notice_reads_update_own"
  ON public.notice_reads FOR UPDATE
  USING (auth.uid() = user_id)
-- Feedback Policies
CREATE POLICY "feedback_insert_authenticated"
  ON public.feedback FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "feedback_select_own_or_admin"
  ON public.feedback FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

-- Bug Reports Policies
CREATE POLICY "bug_reports_insert_authenticated"
  ON public.bug_reports FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "bug_reports_select_own_or_admin"
  ON public.bug_reports FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "bug_reports_update_admin"
  ON public.bug_reports FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Course Materials Policies
CREATE OR REPLACE FUNCTION public.is_beta_approved()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.beta_access
    WHERE user_id = auth.uid() AND status = 'approved'
  ) OR public.is_admin();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE POLICY "course_materials_select_approved"
  ON public.course_materials FOR SELECT
  USING (public.is_beta_approved() OR public.is_admin());

CREATE POLICY "course_materials_insert_admin"
  ON public.course_materials FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "course_materials_update_admin"
  ON public.course_materials FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "course_materials_delete_admin"
  ON public.course_materials FOR DELETE
  USING (public.is_admin());

-- ----------------------------------------------------------------------------
-- 3. FUNCTIONS & TRIGGERS
-- ----------------------------------------------------------------------------

-- Updated_at Trigger Function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS trigger_profiles_updated_at ON public.profiles;
CREATE TRIGGER trigger_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_beta_access_updated_at ON public.beta_access;
CREATE TRIGGER trigger_beta_access_updated_at
  BEFORE UPDATE ON public.beta_access
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_user_progress_updated_at ON public.user_progress;
CREATE TRIGGER trigger_user_progress_updated_at
  BEFORE UPDATE ON public.user_progress
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_bug_reports_updated_at ON public.bug_reports;
CREATE TRIGGER trigger_bug_reports_updated_at
  BEFORE UPDATE ON public.bug_reports
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_course_materials_updated_at ON public.course_materials;
CREATE TRIGGER trigger_course_materials_updated_at
  BEFORE UPDATE ON public.course_materials
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Automatic User Provisioning Trigger Function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_full_name TEXT;
  v_department TEXT;
  v_student_id TEXT;
  v_avatar_url TEXT;
BEGIN
  v_full_name := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name',
    ''
  );
  v_department := COALESCE(NEW.raw_user_meta_data->>'department', 'General');
  v_student_id := COALESCE(NEW.raw_user_meta_data->>'student_id', '');
  v_avatar_url := COALESCE(
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'picture',
    ''
  );

  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    department,
    student_id,
    avatar_url,
    role
  ) VALUES (
    NEW.id,
    NEW.email,
    v_full_name,
    v_department,
    v_student_id,
    v_avatar_url,
    'student'
  ) ON CONFLICT (id) DO UPDATE SET
    full_name = CASE WHEN profiles.full_name IS NULL OR profiles.full_name = '' THEN EXCLUDED.full_name ELSE profiles.full_name END,
    avatar_url = CASE WHEN profiles.avatar_url IS NULL OR profiles.avatar_url = '' THEN EXCLUDED.avatar_url ELSE profiles.avatar_url END;

  INSERT INTO public.user_progress (
    user_id,
    completed_steps,
    completed_docs,
    quiz_scores
  ) VALUES (
    NEW.id,
    '[]'::jsonb,
    '[]'::jsonb,
    '{}'::jsonb
  ) ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
