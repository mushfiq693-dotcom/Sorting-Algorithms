-- ============================================================================
-- Rollback Migration 003: Functions & Triggers
-- Description: Safely drops user provisioning trigger and timestamp functions.
-- ============================================================================

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

DROP TRIGGER IF EXISTS trigger_profiles_updated_at ON public.profiles;
DROP TRIGGER IF EXISTS trigger_beta_access_updated_at ON public.beta_access;
DROP TRIGGER IF EXISTS trigger_user_progress_updated_at ON public.user_progress;
DROP TRIGGER IF EXISTS trigger_bug_reports_updated_at ON public.bug_reports;

DROP FUNCTION IF EXISTS public.handle_updated_at();
