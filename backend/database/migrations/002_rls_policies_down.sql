-- ============================================================================
-- Rollback Migration 002: RLS Policies
-- Description: Drops RLS policies and disables RLS on all tables.
-- ============================================================================

DROP POLICY IF EXISTS "profiles_select_own_or_admin" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own_fields" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_admin" ON public.profiles;

DROP POLICY IF EXISTS "beta_access_select_own_or_admin" ON public.beta_access;
DROP POLICY IF EXISTS "beta_access_update_admin_only" ON public.beta_access;

DROP POLICY IF EXISTS "user_progress_select_own" ON public.user_progress;
DROP POLICY IF EXISTS "user_progress_update_own" ON public.user_progress;
DROP POLICY IF EXISTS "user_progress_insert_own" ON public.user_progress;

DROP POLICY IF EXISTS "feedback_insert_authenticated" ON public.feedback;
DROP POLICY IF EXISTS "feedback_select_own_or_admin" ON public.feedback;

DROP POLICY IF EXISTS "bug_reports_insert_authenticated" ON public.bug_reports;
DROP POLICY IF EXISTS "bug_reports_select_own_or_admin" ON public.bug_reports;
DROP POLICY IF EXISTS "bug_reports_update_admin" ON public.bug_reports;

DROP FUNCTION IF EXISTS public.is_admin();

ALTER TABLE IF EXISTS public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.beta_access DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.user_progress DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.feedback DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.bug_reports DISABLE ROW LEVEL SECURITY;
