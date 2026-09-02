"use client";

import { useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { AlgorithmId } from "@/types/sorting";
import {
  TopicMetrics,
  TopicScoresRecord,
  ActivityHistoryItem,
} from "../../backend/database/types/database.types";
import {
  calculateTopicScore,
  calculateDocsCompletion,
  ORDERED_ALGORITHMS,
  ALGORITHM_DOCS_MAP,
} from "@/lib/scoring";

import { fastCache } from "@/lib/cache";

export const STEPS_KEY = "sortviz_completed_steps";
export const DOCS_KEY = "sortviz_docs_completed";
export const TOPIC_SCORES_KEY = "sortviz_topic_scores";
export const ACTIVITY_HISTORY_KEY = "sortviz_activity_history";

/**
 * useProgressSync Hook
 *
 * Automatically keeps client-side localStorage in sync with PostgreSQL `user_progress`.
 * Handles bidirectional synchronization for completed steps, completed docs,
 * per-algorithm topic scores (weighted formulas), and activity attempt logs.
 */
export function useProgressSync() {
  const supabase = createClient();

  // Initial Sync from PostgreSQL to LocalStorage on mount/login
  useEffect(() => {
    async function syncDown() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        const user = session?.user;
        if (!user) return;

        // Throttle syncDown to once per 2 minutes per session to prevent repeated network hits
        const lastSync = fastCache.get<boolean>(`last_sync_${user.id}`);
        if (lastSync) return;
        fastCache.set(`last_sync_${user.id}`, true, 120);

        const { data: progress } = await (supabase.from("user_progress") as any)
          .select("completed_steps, completed_docs, quiz_scores, topic_scores, activity_history")
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

          // 3. Merge Topic Scores
          const localTopicScores: TopicScoresRecord = JSON.parse(
            localStorage.getItem(TOPIC_SCORES_KEY) || "{}"
          );
          const remoteTopicScores: TopicScoresRecord = progress.topic_scores || {};
          const mergedTopicScores: TopicScoresRecord = { ...remoteTopicScores };

          // Merge local best scores into remote if local had higher
          for (const { id } of ORDERED_ALGORITHMS) {
            const localM = localTopicScores[id];
            const remoteM = mergedTopicScores[id];

            if (localM) {
              const quiz_best = Math.max(localM.quiz_best_score || 0, remoteM?.quiz_best_score || 0);
              const bug_hunt_best = Math.max(localM.bug_hunt_best_score || 0, remoteM?.bug_hunt_best_score || 0);
              const docs_comp = calculateDocsCompletion(id, mergedDocs);
              const prediction_best = Math.max(localM.prediction_best_score || 0, remoteM?.prediction_best_score || 0);

              const computed = calculateTopicScore({
                quiz_best_score: quiz_best,
                bug_hunt_best_score: bug_hunt_best,
                docs_completion: docs_comp,
                prediction_best_score: prediction_best,
              });

              mergedTopicScores[id] = {
                quiz_best_score: quiz_best,
                bug_hunt_best_score: bug_hunt_best,
                docs_completion: docs_comp,
                prediction_best_score: prediction_best,
                computed_topic_score: computed,
                last_activity_at: localM.last_activity_at || remoteM?.last_activity_at || new Date().toISOString(),
              };
            } else if (remoteM) {
              // Recalculate docs completion based on latest merged docs
              remoteM.docs_completion = calculateDocsCompletion(id, mergedDocs);
              remoteM.computed_topic_score = calculateTopicScore(remoteM);
            }
          }
          localStorage.setItem(TOPIC_SCORES_KEY, JSON.stringify(mergedTopicScores));

          // 4. Merge Activity History
          const localHistory: ActivityHistoryItem[] = JSON.parse(
            localStorage.getItem(ACTIVITY_HISTORY_KEY) || "[]"
          );
          const remoteHistory: ActivityHistoryItem[] = Array.isArray(progress.activity_history)
            ? progress.activity_history
            : [];
          
          const historyMap = new Map<string, ActivityHistoryItem>();
          [...remoteHistory, ...localHistory].forEach((item) => {
            if (item && item.id) historyMap.set(item.id, item);
          });
          const mergedHistory = Array.from(historyMap.values())
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, 15);
          localStorage.setItem(ACTIVITY_HISTORY_KEY, JSON.stringify(mergedHistory));

          // 5. Update cloud record if state differed
          await (supabase.from("user_progress") as any).upsert({
            user_id: user.id,
            completed_steps: mergedSteps,
            completed_docs: mergedDocs,
            topic_scores: mergedTopicScores,
            activity_history: mergedHistory,
            last_active_at: new Date().toISOString(),
          });
        }
      } catch (err) {
        console.error("Failed to sync progress from cloud:", err);
      }
    }

    syncDown();
  }, [supabase]);

  // Record and sync an activity score attempt (Quiz, Bug Hunt, Prediction)
  const syncActivityScore = useCallback(
    async (
      algorithmId: AlgorithmId,
      activityType: "quiz" | "bug_hunt" | "prediction" | "docs",
      score: number,
      title: string
    ) => {
      try {
        const roundedScore = Math.max(0, Math.min(100, Math.round(score)));

        // 1. Update Topic Scores in LocalStorage
        const currentScores: TopicScoresRecord = JSON.parse(
          localStorage.getItem(TOPIC_SCORES_KEY) || "{}"
        );
        const currentDocs: string[] = JSON.parse(
          localStorage.getItem(DOCS_KEY) || "[]"
        );

        const existing: TopicMetrics = currentScores[algorithmId] || {
          quiz_best_score: 0,
          bug_hunt_best_score: 0,
          docs_completion: calculateDocsCompletion(algorithmId, currentDocs),
          prediction_best_score: 0,
          computed_topic_score: 0,
          last_activity_at: new Date().toISOString(),
        };

        if (activityType === "quiz") {
          existing.quiz_best_score = Math.max(existing.quiz_best_score, roundedScore);
        } else if (activityType === "bug_hunt") {
          existing.bug_hunt_best_score = Math.max(existing.bug_hunt_best_score, roundedScore);
        } else if (activityType === "prediction") {
          existing.prediction_best_score = Math.max(existing.prediction_best_score, roundedScore);
        } else if (activityType === "docs") {
          existing.docs_completion = Math.max(existing.docs_completion, roundedScore);
        }

        existing.computed_topic_score = calculateTopicScore(existing);
        existing.last_activity_at = new Date().toISOString();

        currentScores[algorithmId] = existing;
        localStorage.setItem(TOPIC_SCORES_KEY, JSON.stringify(currentScores));

        // 2. Prepend to Activity History (capped at 15)
        const currentHistory: ActivityHistoryItem[] = JSON.parse(
          localStorage.getItem(ACTIVITY_HISTORY_KEY) || "[]"
        );
        const newHistoryItem: ActivityHistoryItem = {
          id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          algorithmId,
          activityType,
          title,
          score: roundedScore,
          timestamp: new Date().toISOString(),
        };
        const updatedHistory = [newHistoryItem, ...currentHistory].slice(0, 15);
        localStorage.setItem(ACTIVITY_HISTORY_KEY, JSON.stringify(updatedHistory));

        // 3. Push to Supabase user_progress
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          await (supabase.from("user_progress") as any).upsert({
            user_id: user.id,
            topic_scores: currentScores,
            activity_history: updatedHistory,
            last_active_at: new Date().toISOString(),
          });
        }
      } catch (err) {
        console.error("Failed to sync activity score to cloud:", err);
      }
    },
    [supabase]
  );

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

          // Also recompute docs_completion for any affected algorithms
          const currentScores: TopicScoresRecord = JSON.parse(
            localStorage.getItem(TOPIC_SCORES_KEY) || "{}"
          );

          for (const [algoId, docList] of Object.entries(ALGORITHM_DOCS_MAP)) {
            if (docList.includes(slug)) {
              const algorithmId = algoId as AlgorithmId;
              const existing: TopicMetrics = currentScores[algorithmId] || {
                quiz_best_score: 0,
                bug_hunt_best_score: 0,
                docs_completion: 0,
                prediction_best_score: 0,
                computed_topic_score: 0,
                last_activity_at: new Date().toISOString(),
              };

              existing.docs_completion = calculateDocsCompletion(algorithmId, updated);
              existing.computed_topic_score = calculateTopicScore(existing);
              existing.last_activity_at = new Date().toISOString();
              currentScores[algorithmId] = existing;
            }
          }
          localStorage.setItem(TOPIC_SCORES_KEY, JSON.stringify(currentScores));

          const {
            data: { user },
          } = await supabase.auth.getUser();

          if (user) {
            await (supabase.from("user_progress") as any).upsert({
              user_id: user.id,
              completed_docs: updated,
              topic_scores: currentScores,
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

  return { syncStep, syncDoc, syncActivityScore };
}
