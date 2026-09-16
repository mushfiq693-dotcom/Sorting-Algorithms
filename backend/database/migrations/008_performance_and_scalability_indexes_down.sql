-- ============================================================================
-- MIGRATION 008 ROLLBACK: DROP PERFORMANCE INDEXES
-- ============================================================================

DROP INDEX IF EXISTS public.idx_profiles_created_at;
DROP INDEX IF EXISTS public.idx_beta_access_user_status;
DROP INDEX IF EXISTS public.idx_beta_access_approved_by;
DROP INDEX IF EXISTS public.idx_mentor_apps_user_status;
DROP INDEX IF EXISTS public.idx_mentor_apps_reviewed_by;
DROP INDEX IF EXISTS public.idx_mentor_apps_created_at;
DROP INDEX IF EXISTS public.idx_notices_target_created;
DROP INDEX IF EXISTS public.idx_notice_reads_notice_id;
DROP INDEX IF EXISTS public.idx_notice_reads_user_read;
DROP INDEX IF EXISTS public.idx_user_progress_last_active;
DROP INDEX IF EXISTS public.idx_feedback_category;
DROP INDEX IF EXISTS public.idx_feedback_user_created;
DROP INDEX IF EXISTS public.idx_bug_reports_status_created;
DROP INDEX IF EXISTS public.idx_bug_reports_algo_status;
DROP INDEX IF EXISTS public.idx_course_materials_created_by;
DROP INDEX IF EXISTS public.idx_course_materials_assigned_date;
DROP INDEX IF EXISTS public.idx_course_materials_type_tag;
