-- ============================================================================
-- MIGRATION 004 ROLLBACK: TOPIC SCORING & ADAPTIVE PROGRESS EXTENSION
-- ============================================================================

ALTER TABLE public.user_progress
  DROP COLUMN IF EXISTS topic_scores,
  DROP COLUMN IF EXISTS activity_history;
