-- ============================================================================
-- Migration 009: Fix Beta Access Admin RLS Policies
-- Description: Ensures administrators have full INSERT, UPDATE, SELECT, and DELETE
--              permissions on public.beta_access table so they can approve, reject,
--              or manually grant course access without triggering RLS violations.
-- Safety: Additive & Corrective / Safe
-- ============================================================================

-- 1. Drop existing conflicting/redundant beta_access policies
DROP POLICY IF EXISTS "beta_access_select_own_or_admin" ON public.beta_access;
DROP POLICY IF EXISTS "beta_access_insert_own" ON public.beta_access;
DROP POLICY IF EXISTS "beta_access_insert_own_pending" ON public.beta_access;
DROP POLICY IF EXISTS "beta_access_insert_admin" ON public.beta_access;
DROP POLICY IF EXISTS "beta_access_update_own_pending" ON public.beta_access;
DROP POLICY IF EXISTS "beta_access_update_own_or_admin" ON public.beta_access;
DROP POLICY IF EXISTS "beta_access_update_admin_only" ON public.beta_access;
DROP POLICY IF EXISTS "beta_access_update_admin" ON public.beta_access;
DROP POLICY IF EXISTS "beta_access_delete_admin" ON public.beta_access;
DROP POLICY IF EXISTS "beta_access_admin_all" ON public.beta_access;

-- 2. Ensure RLS is active on beta_access
ALTER TABLE public.beta_access ENABLE ROW LEVEL SECURITY;

-- 3. SELECT: Users can view their own status, Admins can view all records
CREATE POLICY "beta_access_select_own_or_admin"
  ON public.beta_access FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

-- 4. INSERT: Students can request access for themselves (pending), Admins can insert any record
CREATE POLICY "beta_access_insert_own_pending"
  ON public.beta_access FOR INSERT
  WITH CHECK (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "beta_access_insert_admin"
  ON public.beta_access FOR INSERT
  WITH CHECK (public.is_admin());

-- 5. UPDATE: Students can update their own pending request, Admins can update any status
CREATE POLICY "beta_access_update_own_pending"
  ON public.beta_access FOR UPDATE
  USING (auth.uid() = user_id AND status = 'pending')
  WITH CHECK (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "beta_access_update_admin"
  ON public.beta_access FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 6. DELETE: Admins can delete access records
CREATE POLICY "beta_access_delete_admin"
  ON public.beta_access FOR DELETE
  USING (public.is_admin());
