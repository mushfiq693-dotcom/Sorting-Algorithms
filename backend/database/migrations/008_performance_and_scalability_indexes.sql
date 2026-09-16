-- ============================================================================
-- MIGRATION 008: PERFORMANCE & HIGH-CONCURRENCY SCALABILITY INDEXES
-- Description: Adds high-selectivity composite indexes, foreign-key indexes,
--              and sorting indexes across all tables to support thousands of
--              concurrent queries with sub-millisecond execution times.
-- ============================================================================

-- 1. Profiles Table
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON public.profiles(created_at DESC);

-- 2. Beta Access Table
CREATE INDEX IF NOT EXISTS idx_beta_access_user_status ON public.beta_access(user_id, status);
CREATE INDEX IF NOT EXISTS idx_beta_access_approved_by ON public.beta_access(approved_by);

-- 3. Mentor Applications Table
CREATE INDEX IF NOT EXISTS idx_mentor_apps_user_status ON public.mentor_applications(user_id, status);
CREATE INDEX IF NOT EXISTS idx_mentor_apps_reviewed_by ON public.mentor_applications(reviewed_by);
CREATE INDEX IF NOT EXISTS idx_mentor_apps_created_at ON public.mentor_applications(created_at DESC);

-- 4. Notices Table
CREATE INDEX IF NOT EXISTS idx_notices_target_created ON public.notices(target_filter, created_at DESC);

-- 5. Notice Reads Table
CREATE INDEX IF NOT EXISTS idx_notice_reads_notice_id ON public.notice_reads(notice_id);
CREATE INDEX IF NOT EXISTS idx_notice_reads_user_read ON public.notice_reads(user_id, read_at DESC);

-- 6. User Progress & Telemetry Table
CREATE INDEX IF NOT EXISTS idx_user_progress_last_active ON public.user_progress(last_active_at DESC);

-- 7. Feedback Submissions Table
CREATE INDEX IF NOT EXISTS idx_feedback_category ON public.feedback(category);
CREATE INDEX IF NOT EXISTS idx_feedback_user_created ON public.feedback(user_id, created_at DESC);

-- 8. Bug Reports Table
CREATE INDEX IF NOT EXISTS idx_bug_reports_status_created ON public.bug_reports(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bug_reports_algo_status ON public.bug_reports(algorithm_id, status);

-- 9. Course Materials Table
CREATE INDEX IF NOT EXISTS idx_course_materials_created_by ON public.course_materials(created_by);
CREATE INDEX IF NOT EXISTS idx_course_materials_assigned_date ON public.course_materials(assigned_date DESC);
CREATE INDEX IF NOT EXISTS idx_course_materials_type_tag ON public.course_materials(content_type, topic_tag);
