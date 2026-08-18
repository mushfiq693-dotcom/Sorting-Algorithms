-- ============================================================================
-- Rollback Migration 001: Initial Schema
-- Description: Safely drops bug_reports, feedback, user_progress, beta_access,
--              and profiles tables in reverse dependency order.
-- Safety: Destructive (Drops tables and associated data)
-- ============================================================================

DROP TABLE IF EXISTS public.bug_reports CASCADE;
DROP TABLE IF EXISTS public.feedback CASCADE;
DROP TABLE IF EXISTS public.user_progress CASCADE;
DROP TABLE IF EXISTS public.beta_access CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
