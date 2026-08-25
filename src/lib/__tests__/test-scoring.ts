/**
 * Unit Test Suite for AlgoHub Adaptive Scoring & Topic Mastery Engine
 */

import {
  calculateTopicScore,
  calculateBugHuntScore,
  getAdaptiveGuidance,
  calculateOverallProgress,
  calculateDocsCompletion,
} from "../scoring";

function assertEqual(actual: any, expected: any, testName: string) {
  if (actual === expected) {
    console.log(`  ✓ PASSED: ${testName} (actual: ${actual})`);
  } else {
    console.error(`  ✗ FAILED: ${testName} (expected: ${expected}, got: ${actual})`);
    process.exit(1);
  }
}

console.log("================================================================================");
console.log("             ALGOHUB ADAPTIVE SCORING & FORMULA VERIFICATION                    ");
console.log("================================================================================\n");

// -----------------------------------------------------------------------------
// 1. EXACT FORMULA VERIFICATION (PROMPT SECTION 8 TEST CASE)
// -----------------------------------------------------------------------------
console.log("1. Exact Weighted Topic Score Calculations:");

// Test Case from Section 8: Quiz=90, Bug Hunt=70, Docs=100, Prediction=50 => 82
const promptTestCase = calculateTopicScore({
  quiz_best_score: 90,
  bug_hunt_best_score: 70,
  docs_completion: 100,
  prediction_best_score: 50,
  computed_topic_score: 0,
  last_activity_at: new Date().toISOString(),
});
assertEqual(promptTestCase, 82, "Section 8 Test: 90*0.4 + 70*0.3 + 100*0.2 + 50*0.1 = 82");

// Partial completion: only quiz (score 90), others 0 => 90 * 0.40 = 36
const onlyQuizCase = calculateTopicScore({
  quiz_best_score: 90,
  bug_hunt_best_score: 0,
  docs_completion: 0,
  prediction_best_score: 0,
  computed_topic_score: 0,
  last_activity_at: new Date().toISOString(),
});
assertEqual(onlyQuizCase, 36, "Partial unattempted components: Quiz=90, others=0 => 36");

// Brand new student: all 0
const emptyCase = calculateTopicScore({});
assertEqual(emptyCase, 0, "Zero progress: all unattempted => 0");

// -----------------------------------------------------------------------------
// 2. BUG HUNT SCORING DEDUCTION VERIFICATION
// -----------------------------------------------------------------------------
console.log("\n2. Bug Hunt Deduction & Penalty Floor Verification:");

assertEqual(calculateBugHuntScore(0, 0), 100, "Clean Bug Hunt: 0 hints, 0 wrong attempts => 100");
assertEqual(calculateBugHuntScore(1, 0), 85, "1 Hint (-15), 0 wrong attempts => 85");
assertEqual(calculateBugHuntScore(0, 1), 90, "0 Hints, 1 wrong attempt (-10) => 90");
assertEqual(calculateBugHuntScore(1, 1), 75, "1 Hint (-15), 1 wrong attempt (-10) => 75");
assertEqual(calculateBugHuntScore(4, 5), 0, "Heavy penalties: 4 hints (-60) + 5 wrong (-50) => floored at 0 (not -10)");

// -----------------------------------------------------------------------------
// 3. ADAPTIVE GUIDANCE THRESHOLD VERIFICATION
// -----------------------------------------------------------------------------
console.log("\n3. Adaptive Guidance Messaging Verification:");

// Bubble Sort < 60
const weakBubble = getAdaptiveGuidance("bubble", 55);
assertEqual(
  weakBubble.message,
  "Your Bubble Sort fundamentals are weak — review before moving on.",
  "Bubble Sort score 55 (< 60) gives weak fundamentals guidance"
);

// Bubble Sort 60 <= score <= 85
const progressingBubble = getAdaptiveGuidance("bubble", 72);
assertEqual(
  progressingBubble.message,
  "You're making progress on Bubble Sort — a bit more practice will help.",
  "Bubble Sort score 72 (60-85) gives progressing guidance"
);

// Bubble Sort > 85
const readySelection = getAdaptiveGuidance("bubble", 88);
assertEqual(
  readySelection.message,
  "You're ready for Selection Sort!",
  "Bubble Sort score 88 (> 85) names next topic (Selection Sort)"
);
assertEqual(readySelection.nextTopicName, "Selection Sort", "Next topic name is Selection Sort");

// Merge Sort > 85
const readyQuick = getAdaptiveGuidance("merge", 90);
assertEqual(
  readyQuick.message,
  "You're ready for Quick Sort!",
  "Merge Sort score 90 (> 85) names next topic (Quick Sort)"
);

// Quick Sort > 85 names next topic (Stack)
const readyStack = getAdaptiveGuidance("quick", 92);
assertEqual(
  readyStack.message,
  "You're ready for Stack!",
  "Quick Sort score 92 (> 85) names next topic (Stack)"
);

// Space Complexity (Final Topic) > 85
const completedCurriculum = getAdaptiveGuidance("space-complexity", 95);
assertEqual(
  completedCurriculum.message,
  "You've mastered the core curriculum topics!",
  "Space Complexity score 95 (> 85) displays final curriculum mastery message"
);

// -----------------------------------------------------------------------------
// 4. OVERALL PROGRESS & DOCS COMPLETION
// -----------------------------------------------------------------------------
console.log("\n4. Overall Progress Aggregation & Docs Completion:");

const mockTopicScores = {
  bubble: {
    quiz_best_score: 90,
    bug_hunt_best_score: 70,
    docs_completion: 100,
    prediction_best_score: 50,
    computed_topic_score: 82,
    last_activity_at: new Date().toISOString(),
  },
  selection: {
    quiz_best_score: 100,
    bug_hunt_best_score: 100,
    docs_completion: 100,
    prediction_best_score: 100,
    computed_topic_score: 100,
    last_activity_at: new Date().toISOString(),
  },
  insertion: {
    quiz_best_score: 0,
    bug_hunt_best_score: 0,
    docs_completion: 0,
    prediction_best_score: 0,
    computed_topic_score: 0,
    last_activity_at: new Date().toISOString(),
  },
  merge: {
    quiz_best_score: 0,
    bug_hunt_best_score: 0,
    docs_completion: 0,
    prediction_best_score: 0,
    computed_topic_score: 0,
    last_activity_at: new Date().toISOString(),
  },
  quick: {
    quiz_best_score: 0,
    bug_hunt_best_score: 0,
    docs_completion: 0,
    prediction_best_score: 0,
    computed_topic_score: 0,
    last_activity_at: new Date().toISOString(),
  },
  stack: {
    quiz_best_score: 0,
    bug_hunt_best_score: 0,
    docs_completion: 0,
    prediction_best_score: 0,
    computed_topic_score: 0,
    last_activity_at: new Date().toISOString(),
  },
  queue: {
    quiz_best_score: 0,
    bug_hunt_best_score: 0,
    docs_completion: 0,
    prediction_best_score: 0,
    computed_topic_score: 0,
    last_activity_at: new Date().toISOString(),
  },
  "time-complexity": {
    quiz_best_score: 0,
    bug_hunt_best_score: 0,
    docs_completion: 0,
    prediction_best_score: 0,
    computed_topic_score: 0,
    last_activity_at: new Date().toISOString(),
  },
  "space-complexity": {
    quiz_best_score: 0,
    bug_hunt_best_score: 0,
    docs_completion: 0,
    prediction_best_score: 0,
    computed_topic_score: 0,
    last_activity_at: new Date().toISOString(),
  },
};

const overall = calculateOverallProgress(mockTopicScores as any);
// (82 + 100 + 0 + 0 + 0 + 0 + 0 + 0 + 0) / 9 = 182 / 9 = 20.22 => rounded 20
assertEqual(overall.overallScore, 20, "Overall score average across 9 topics is 20%");
assertEqual(overall.masteredCount, 1, "Mastered count is 1 (Selection Sort >= 85)");
assertEqual(overall.activeTopic, "bubble", "Active topic is bubble (< 85)");

// Docs completion for bubble (has 2 docs: bubble-sort, proof-on2-bubble-insertion)
assertEqual(calculateDocsCompletion("bubble", ["bubble-sort"]), 50, "1 of 2 docs completed = 50%");
assertEqual(
  calculateDocsCompletion("bubble", ["bubble-sort", "proof-on2-bubble-insertion"]),
  100,
  "2 of 2 docs completed = 100%"
);

console.log("\n================================================================================");
console.log("  ALL SCORING & GUIDANCE ENGINE TESTS PASSED (100% MATHEMATICAL PRECISION)      ");
console.log("================================================================================\n");
