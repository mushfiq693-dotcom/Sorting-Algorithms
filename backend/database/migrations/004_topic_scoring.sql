-- ============================================================================
-- MIGRATION 004: TOPIC SCORING & ADAPTIVE PROGRESS EXTENSION
-- ============================================================================
-- Extends public.user_progress with per-topic scores and activity history

ALTER TABLE public.user_progress
  ADD COLUMN IF NOT EXISTS topic_scores JSONB NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS activity_history JSONB NOT NULL DEFAULT '[]'::jsonb;

-- Comment on columns for schema documentation
COMMENT ON COLUMN public.user_progress.topic_scores IS 'Per-algorithm metrics: quiz_best_score, bug_hunt_best_score, docs_completion, prediction_best_score, computed_topic_score';
COMMENT ON COLUMN public.user_progress.activity_history IS 'Chronological list of recent scored attempts (capped at 15 items)';
