-- ============================================================================
-- Migration 002: Row Level Security (RLS) Policies
-- Description: Enables RLS on all public tables and configures least-privilege
--              access control rules. Prevents privilege escalation and unauthorized access.
-- Safety: Additive / Safe (Applies RLS security constraints)
-- ============================================================================

-- 1. Enable RLS across all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.beta_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bug_reports ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current authenticated user is an administrator
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ============================================================================
-- 2. PROFILES POLICIES
-- ============================================================================

-- SELECT: Users can view their own profile; Admins can view all profiles
CREATE POLICY "profiles_select_own_or_admin"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

-- UPDATE: Users can update their own personal info, but CANNOT modify role
CREATE POLICY "profiles_update_own_fields"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id AND (
      role = (SELECT role FROM public.profiles WHERE id = auth.uid()) OR public.is_admin()
    )
  );

-- Admin can update any profile
CREATE POLICY "profiles_update_admin"
  ON public.profiles FOR UPDATE
  USING (public.is_admin());

-- ============================================================================
-- 3. BETA ACCESS POLICIES
-- ============================================================================

-- SELECT: Users can view their own beta access status; Admins can view all
CREATE POLICY "beta_access_select_own_or_admin"
  ON public.beta_access FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

-- UPDATE: ONLY Admins can modify status (approve, reject, suspend)
CREATE POLICY "beta_access_update_admin_only"
  ON public.beta_access FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================================
-- 4. USER PROGRESS POLICIES
-- ============================================================================

-- SELECT & UPDATE: Users can view and update only their own progress
CREATE POLICY "user_progress_select_own"
  ON public.user_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "user_progress_update_own"
  ON public.user_progress FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_progress_insert_own"
  ON public.user_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- 5. FEEDBACK POLICIES
-- ============================================================================

-- INSERT: Authenticated users can submit feedback
CREATE POLICY "feedback_insert_authenticated"
  ON public.feedback FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- SELECT: Users can view their own feedback; Admins can view all feedback
CREATE POLICY "feedback_select_own_or_admin"
  ON public.feedback FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

-- ============================================================================
-- 6. BUG REPORTS POLICIES
-- ============================================================================

-- INSERT: Authenticated users can submit bug reports
CREATE POLICY "bug_reports_insert_authenticated"
  ON public.bug_reports FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- SELECT: Users can view their own bug reports; Admins can view all bug reports
CREATE POLICY "bug_reports_select_own_or_admin"
  ON public.bug_reports FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

-- UPDATE: Admins can update bug report status (e.g. open -> investigating -> resolved)
CREATE POLICY "bug_reports_update_admin"
  ON public.bug_reports FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
