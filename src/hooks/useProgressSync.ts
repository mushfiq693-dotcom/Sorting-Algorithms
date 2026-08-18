"use client";

import { useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

const STEPS_KEY = "sortviz_completed_steps";
const DOCS_KEY = "sortviz_docs_completed";

/**
 * useProgressSync Hook
 *
 * Automatically keeps client-side localStorage in sync with PostgreSQL `user_progress`.
 * Pulls cloud progress on authentication and pushes progress updates seamlessly in the background.
 */
export function useProgressSync() {
  const supabase = createClient();

  // Initial Sync from PostgreSQL to LocalStorage on mount/login
  useEffect(() => {
    async function syncDown() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        const { data: progress } = await (supabase.from("user_progress") as any)
          .select("completed_steps, completed_docs, quiz_scores")
          .eq("user_id", user.id)
          .single();

        if (progress) {
          // 1. Merge Steps
          const localSteps: string[] = JSON.parse(localStorage.getItem(STEPS_KEY) || "[]");
          const remoteSteps: string[] = Array.isArray(progress.completed_steps)
            ? progress.completed_steps
            : [];
          const mergedSteps = Array.from(new Set([...localSteps, ...remoteSteps]));
          localStorage.setItem(STEPS_KEY, JSON.stringify(mergedSteps));

          // 2. Merge Docs
          const localDocs: string[] = JSON.parse(localStorage.getItem(DOCS_KEY) || "[]");
          const remoteDocs: string[] = Array.isArray(progress.completed_docs)
            ? progress.completed_docs
            : [];
          const mergedDocs = Array.from(new Set([...localDocs, ...remoteDocs]));
          localStorage.setItem(DOCS_KEY, JSON.stringify(mergedDocs));

          // 3. Update cloud record if local had un-synced items
          if (
            mergedSteps.length > remoteSteps.length ||
            mergedDocs.length > remoteDocs.length
          ) {
            await (supabase.from("user_progress") as any).upsert({
              user_id: user.id,
              completed_steps: mergedSteps,
              completed_docs: mergedDocs,
              last_active_at: new Date().toISOString(),
            });
          }
        }
      } catch (err) {
        console.error("Failed to sync progress from cloud:", err);
      }
    }

    syncDown();
  }, [supabase]);

  // Mark a curriculum step completed (e.g. "bubble-practice")
  const syncStep = useCallback(
    async (stepId: string) => {
      try {
        const localSteps: string[] = JSON.parse(localStorage.getItem(STEPS_KEY) || "[]");
        if (!localSteps.includes(stepId)) {
          const updated = [...localSteps, stepId];
          localStorage.setItem(STEPS_KEY, JSON.stringify(updated));

          const {
            data: { user },
          } = await supabase.auth.getUser();

          if (user) {
            await (supabase.from("user_progress") as any).upsert({
              user_id: user.id,
              completed_steps: updated,
              last_active_at: new Date().toISOString(),
            });
          }
        }
      } catch (err) {
        console.error("Failed to sync step to cloud:", err);
      }
    },
    [supabase]
  );

  // Mark a lesson/doc completed (e.g. "bubble-sort")
  const syncDoc = useCallback(
    async (slug: string) => {
      try {
        const localDocs: string[] = JSON.parse(localStorage.getItem(DOCS_KEY) || "[]");
        if (!localDocs.includes(slug)) {
          const updated = [...localDocs, slug];
          localStorage.setItem(DOCS_KEY, JSON.stringify(updated));

          const {
            data: { user },
          } = await supabase.auth.getUser();

          if (user) {
            await (supabase.from("user_progress") as any).upsert({
              user_id: user.id,
              completed_docs: updated,
              last_active_at: new Date().toISOString(),
            });
          }
        }
      } catch (err) {
        console.error("Failed to sync doc to cloud:", err);
      }
    },
    [supabase]
  );

  return { syncStep, syncDoc };
}
