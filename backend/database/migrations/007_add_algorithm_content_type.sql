-- ============================================================================
-- MIGRATION 007: ADD 'algorithm' TO course_materials content_type CHECK
-- Description: Updates the CHECK constraint on course_materials.content_type
--              to allow 'algorithm' alongside 'topic' and 'problem'.
-- ============================================================================

ALTER TABLE public.course_materials
  DROP CONSTRAINT IF EXISTS course_materials_content_type_check;

ALTER TABLE public.course_materials
  ADD CONSTRAINT course_materials_content_type_check
  CHECK (content_type IN ('topic', 'problem', 'algorithm'));
