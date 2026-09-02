-- Rollback migration 007
ALTER TABLE public.course_materials
  DROP CONSTRAINT IF EXISTS course_materials_content_type_check;

ALTER TABLE public.course_materials
  ADD CONSTRAINT course_materials_content_type_check
  CHECK (content_type IN ('topic', 'problem'));
