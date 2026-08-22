/**
 * AlgoHub Adaptive Scoring & Topic Mastery Engine
 *
 * Implements exact weighted topic scoring formulas, readiness thresholds,
 * activity score calculation, and adaptive learning recommendations.
 */

import { AlgorithmId } from "@/types/sorting";
import { TopicMetrics, TopicScoresRecord, ActivityHistoryItem } from "../../backend/database/types/database.types";

export interface OrderedTopicItem {
  id: AlgorithmId;
  name: string;
  category: "sorting" | "data-structure";
}

export const ORDERED_SORTING_ALGORITHMS: OrderedTopicItem[] = [
  { id: "bubble", name: "Bubble Sort", category: "sorting" },
  { id: "selection", name: "Selection Sort", category: "sorting" },
  { id: "insertion", name: "Insertion Sort", category: "sorting" },
  { id: "merge", name: "Merge Sort", category: "sorting" },
  { id: "quick", name: "Quick Sort", category: "sorting" },
];

export const ORDERED_DATA_STRUCTURES: OrderedTopicItem[] = [
  { id: "stack", name: "Stack", category: "data-structure" },
  { id: "queue", name: "Queue", category: "data-structure" },
];

// Backwards compatibility list
export const ORDERED_ALGORITHMS = ORDERED_SORTING_ALGORITHMS;

export const ORDERED_TOPICS: OrderedTopicItem[] = [
  ...ORDERED_SORTING_ALGORITHMS,
  ...ORDERED_DATA_STRUCTURES,
];

export const ALGORITHM_NAME_MAP: Record<AlgorithmId, string> = {
  bubble: "Bubble Sort",
  selection: "Selection Sort",
  insertion: "Insertion Sort",
  merge: "Merge Sort",
  quick: "Quick Sort",
  stack: "Stack",
  queue: "Queue",
};

/**
 * Relevant documentation slugs mapped to each algorithm for calculating docs_completion
 */
export const ALGORITHM_DOCS_MAP: Record<AlgorithmId, string[]> = {
  bubble: ["bubble-sort", "proof-on2-bubble-insertion"],
  selection: ["selection-sort"],
  insertion: ["insertion-sort", "proof-on2-bubble-insertion"],
  merge: ["merge-sort", "what-is-recursion", "why-merge-is-always-nlogn"],
  quick: ["quick-sort", "why-quicksort-degrades"],
  stack: ["stack-data-structure"],
  queue: ["queue-data-structure"],
};

export const TOPIC_DOCS_MAP = ALGORITHM_DOCS_MAP;

/**
 * Weights for the Topic Score Formula
 * Sum = 0.40 + 0.30 + 0.20 + 0.10 = 1.00 (100%)
 */
export const SCORING_WEIGHTS = {
  QUIZ: 0.4,
  BUG_HUNT: 0.3,
  DOCS: 0.2,
  PREDICTION: 0.1,
} as const;

/**
 * Calculates the weighted topic score for an algorithm.
 * If a component is unattempted, its value is 0 (not excluded).
 *
 * Formula:
 * computed_topic_score =
 *   (quiz_best_score × 0.40) +
 *   (bug_hunt_best_score × 0.30) +
 *   (docs_completion × 0.20) +
 *   (prediction_best_score × 0.10)
 */
export function calculateTopicScore(metrics?: Partial<TopicMetrics> | null): number {
  if (!metrics) return 0;

  const quiz = metrics.quiz_best_score || 0;
  const bugHunt = metrics.bug_hunt_best_score || 0;
  const docs = metrics.docs_completion || 0;
  const prediction = metrics.prediction_best_score || 0;

  const rawScore =
    quiz * SCORING_WEIGHTS.QUIZ +
    bugHunt * SCORING_WEIGHTS.BUG_HUNT +
    docs * SCORING_WEIGHTS.DOCS +
    prediction * SCORING_WEIGHTS.PREDICTION;

  return Math.round(rawScore);
}

/**
 * Computes Bug Hunt numeric score starting at 100 with deduction penalties.
 * -15 per hint used, -10 per wrong attempt. Floored at 0.
 */
export function calculateBugHuntScore(hintsUsed: number, wrongAttempts: number): number {
  const penalty = hintsUsed * 15 + wrongAttempts * 10;
  return Math.max(0, 100 - penalty);
}

/**
 * Calculates docs completion percentage for a given algorithm based on completed slugs.
 */
export function calculateDocsCompletion(algorithmId: AlgorithmId, completedDocs: string[]): number {
  const relevantDocs = ALGORITHM_DOCS_MAP[algorithmId] || [];
  if (relevantDocs.length === 0) return 100;

  const completedCount = relevantDocs.filter((slug) => completedDocs.includes(slug)).length;
  return Math.min(100, Math.round((completedCount / relevantDocs.length) * 100));
}

export interface AdaptiveGuidance {
  status: "weak" | "progressing" | "ready" | "completed";
  message: string;
  currentTopicId: AlgorithmId;
  currentTopicName: string;
  nextTopicId: AlgorithmId | null;
  nextTopicName: string | null;
  score: number;
}

/**
 * Adaptive Readiness Guidance based on Topic Score:
 * - score < 60: "Your [Topic] fundamentals are weak — review before moving on."
 * - 60 <= score <= 85: "You're making progress on [Topic] — a bit more practice will help."
 * - score > 85: "You're ready for [Next Topic]!"
 */
export function getAdaptiveGuidance(
  currentTopicId: AlgorithmId,
  score: number
): AdaptiveGuidance {
  const currentTopicName = ALGORITHM_NAME_MAP[currentTopicId] || currentTopicId;

  const currentIndex = ORDERED_TOPICS.findIndex((a) => a.id === currentTopicId);
  const nextAlgo = currentIndex >= 0 && currentIndex < ORDERED_TOPICS.length - 1
    ? ORDERED_TOPICS[currentIndex + 1]
    : null;

  if (score < 60) {
    return {
      status: "weak",
      message: `Your ${currentTopicName} fundamentals are weak — review before moving on.`,
      currentTopicId,
      currentTopicName,
      nextTopicId: nextAlgo ? nextAlgo.id : null,
      nextTopicName: nextAlgo ? nextAlgo.name : null,
      score,
    };
  }

  if (score <= 85) {
    return {
      status: "progressing",
      message: `You're making progress on ${currentTopicName} — a bit more practice will help.`,
      currentTopicId,
      currentTopicName,
      nextTopicId: nextAlgo ? nextAlgo.id : null,
      nextTopicName: nextAlgo ? nextAlgo.name : null,
      score,
    };
  }

  // score > 85
  if (nextAlgo) {
    return {
      status: "ready",
      message: `You're ready for ${nextAlgo.name}!`,
      currentTopicId,
      currentTopicName,
      nextTopicId: nextAlgo.id,
      nextTopicName: nextAlgo.name,
      score,
    };
  }

  // Last Topic completed with > 85%
  return {
    status: "completed",
    message: "You've mastered the core curriculum topics!",
    currentTopicId,
    currentTopicName,
    nextTopicId: null,
    nextTopicName: null,
    score,
  };
}

/**
 * Calculates overall progress across all topics as a simple average of computed_topic_scores.
 */
export function calculateOverallProgress(topicScores: Partial<TopicScoresRecord> = {}): {
  overallScore: number;
  masteredCount: number;
  activeTopic: AlgorithmId;
  sortingScore: number;
  dataStructuresScore: number;
} {
  let totalScore = 0;
  let masteredCount = 0;
  let activeTopic: AlgorithmId = "bubble";
  let foundActive = false;

  let sortingTotal = 0;
  let dsTotal = 0;

  for (const { id, category } of ORDERED_TOPICS) {
    const metrics = topicScores[id];
    const score = metrics?.computed_topic_score ?? calculateTopicScore(metrics);
    totalScore += score;

    if (category === "sorting") {
      sortingTotal += score;
    } else {
      dsTotal += score;
    }

    if (score >= 85) {
      masteredCount += 1;
    } else if (!foundActive) {
      activeTopic = id;
      foundActive = true;
    }
  }

  if (!foundActive) {
    activeTopic = "queue";
  }

  const overallScore = Math.round(totalScore / ORDERED_TOPICS.length);
  const sortingScore = Math.round(sortingTotal / ORDERED_SORTING_ALGORITHMS.length);
  const dataStructuresScore = Math.round(dsTotal / ORDERED_DATA_STRUCTURES.length);

  return {
    overallScore,
    masteredCount,
    activeTopic,
    sortingScore,
    dataStructuresScore,
  };
}
