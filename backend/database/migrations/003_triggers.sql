-- ============================================================================
-- Migration 003: Database Functions & Security Definer Triggers
-- Description: Creates automated user lifecycle triggers. When a user signs up
--              via Supabase Auth, securely initializes profile, pending beta_access,
--              and user_progress without trusting client payload.
-- Safety: Additive / Safe
-- ============================================================================

-- 1. Automatic Timestamp Updater Function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Attach updated_at triggers to mutable tables
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

-- 2. New User Provisioning Security Definer Trigger Function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_full_name TEXT;
  v_department TEXT;
  v_student_id TEXT;
BEGIN
  -- Extract optional metadata provided at signup (sanitizing and defaulting)
  v_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', '');
  v_department := COALESCE(NEW.raw_user_meta_data->>'department', 'CSE');
  v_student_id := COALESCE(NEW.raw_user_meta_data->>'student_id', '');

  -- 1. Create Profile (Always defaults role to 'student')
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    department,
    student_id,
    role
  ) VALUES (
    NEW.id,
    NEW.email,
    v_full_name,
    v_department,
    v_student_id,
    'student' -- Explicit hardcoded default: client cannot elevate to admin during signup
  ) ON CONFLICT (id) DO NOTHING;

  -- 2. Create Beta Access Entry (Always defaults status to 'pending')
  INSERT INTO public.beta_access (
    user_id,
    status
  ) VALUES (
    NEW.id,
    'pending' -- Explicit hardcoded default: requires manual admin approval
  ) ON CONFLICT (user_id) DO NOTHING;

  -- 3. Initialize Empty User Progress State
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

-- Attach trigger to auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
