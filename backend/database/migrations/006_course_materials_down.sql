-- ============================================================================
-- MIGRATION 006 DOWN: REVERT COURSE MATERIALS
-- ============================================================================

DROP TRIGGER IF EXISTS trigger_course_materials_updated_at ON public.course_materials;
DROP POLICY IF EXISTS "course_materials_delete_admin" ON public.course_materials;
DROP POLICY IF EXISTS "course_materials_update_admin" ON public.course_materials;
DROP POLICY IF EXISTS "course_materials_insert_admin" ON public.course_materials;
DROP POLICY IF EXISTS "course_materials_select_approved" ON public.course_materials;
DROP FUNCTION IF EXISTS public.is_beta_approved();
DROP TABLE IF EXISTS public.course_materials CASCADE;
