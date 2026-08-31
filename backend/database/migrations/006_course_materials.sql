-- ============================================================================
-- MIGRATION 006: COURSE MATERIALS SCHEMA & RLS POLICIES
-- Description: Adds course_materials table for teacher-assigned topics and problems
--              from Lipschutz & Seymour "Data Structures" (4th Ed).
-- ============================================================================

-- 1. Create course_materials table
CREATE TABLE IF NOT EXISTS public.course_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  book_reference TEXT,
  topic_tag TEXT,
  content_type TEXT NOT NULL CHECK (content_type IN ('topic', 'problem')),
  problem_statement TEXT,
  explanation_or_solution TEXT NOT NULL,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  assigned_date DATE,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Indexes for efficient filtering and listing
CREATE INDEX IF NOT EXISTS idx_course_materials_topic_tag ON public.course_materials(topic_tag);
CREATE INDEX IF NOT EXISTS idx_course_materials_content_type ON public.course_materials(content_type);
CREATE INDEX IF NOT EXISTS idx_course_materials_created_at ON public.course_materials(created_at DESC);

-- 3. Trigger for updated_at
DROP TRIGGER IF EXISTS trigger_course_materials_updated_at ON public.course_materials;
CREATE TRIGGER trigger_course_materials_updated_at
  BEFORE UPDATE ON public.course_materials
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.course_materials ENABLE ROW LEVEL SECURITY;

-- 5. Helper Function: Check if user has approved beta access
CREATE OR REPLACE FUNCTION public.is_beta_approved()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.beta_access
    WHERE user_id = auth.uid() AND status = 'approved'
  ) OR public.is_admin();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 6. RLS Policies:
-- SELECT: Any approved beta user (student, mentor, admin) or admin can read course materials
DROP POLICY IF EXISTS "course_materials_select_approved" ON public.course_materials;
CREATE POLICY "course_materials_select_approved"
  ON public.course_materials FOR SELECT
  USING (public.is_beta_approved() OR public.is_admin());

-- INSERT: Admin only
DROP POLICY IF EXISTS "course_materials_insert_admin" ON public.course_materials;
CREATE POLICY "course_materials_insert_admin"
  ON public.course_materials FOR INSERT
  WITH CHECK (public.is_admin());

-- UPDATE: Admin only
DROP POLICY IF EXISTS "course_materials_update_admin" ON public.course_materials;
CREATE POLICY "course_materials_update_admin"
  ON public.course_materials FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- DELETE: Admin only
DROP POLICY IF EXISTS "course_materials_delete_admin" ON public.course_materials;
CREATE POLICY "course_materials_delete_admin"
  ON public.course_materials FOR DELETE
  USING (public.is_admin());
