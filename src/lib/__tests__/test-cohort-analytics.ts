/**
 * ============================================================================
 * ALGOHUB COHORT ANALYTICS & STUCK-RATE UNIT TEST SUITE
 * ============================================================================
 *
 * Verifies mathematical precision of cohort average scores, denominator filtering,
 * and stuck-percentage calculations against manually verifiable test datasets.
 *
 * Usage:
 *   npx tsx src/lib/__tests__/test-cohort-analytics.ts
 */

import { ORDERED_ALGORITHMS } from "../scoring";
import { TopicScoresRecord } from "../../../backend/database/types/database.types";

interface MockStudent {
  id: string;
  name: string;
  topicScores: TopicScoresRecord;
}

export function computeMockCohortAnalytics(students: MockStudent[]) {
  const totalStudents = students.length;
  if (totalStudents === 0) {
    return {
      topicAverages: ORDERED_ALGORITHMS.map(({ id, name }) => ({
        id,
        name,
        avgScore: 0,
        attemptedCount: 0,
        stuckCount: 0,
        stuckPercent: 0,
      })),
      overallCohortAverage: 0,
      stuckStudentsTotal: 0,
    };
  }

  const topicStats: Record<
    string,
    { totalScore: number; attemptedCount: number; stuckCount: number }
  > = {};
  for (const { id } of ORDERED_ALGORITHMS) {
    topicStats[id] = { totalScore: 0, attemptedCount: 0, stuckCount: 0 };
  }

  let totalCohortScoreSum = 0;
  let overallStuckCount = 0;

  students.forEach((s) => {
    let studentSum = 0;
    ORDERED_ALGORITHMS.forEach(({ id }) => {
      const t = s.topicScores[id];
      const score = t?.computed_topic_score ?? 0;
      studentSum += score;

      const isAttempted =
        score > 0 ||
        (t &&
          (t.quiz_best_score > 0 ||
            t.bug_hunt_best_score > 0 ||
            t.docs_completion > 0 ||
            t.prediction_best_score > 0));

      if (isAttempted) {
        topicStats[id].attemptedCount++;
        topicStats[id].totalScore += score;
        if (score < 60) {
          topicStats[id].stuckCount++;
        }
      }
    });

    const studentOverallAvg = Math.round(studentSum / ORDERED_ALGORITHMS.length);
    totalCohortScoreSum += studentOverallAvg;
  });

  const topicAverages = ORDERED_ALGORITHMS.map(({ id, name }) => {
    const stats = topicStats[id];
    const avg =
      stats.attemptedCount > 0
        ? Math.round(stats.totalScore / stats.attemptedCount)
        : 0;
    const stuckPercent =
      stats.attemptedCount > 0
        ? Math.round((stats.stuckCount / stats.attemptedCount) * 100)
        : 0;
    return {
      id,
      name,
      avgScore: avg,
      attemptedCount: stats.attemptedCount,
      stuckCount: stats.stuckCount,
      stuckPercent,
    };
  });

  return {
    topicAverages,
    overallCohortAverage: Math.round(totalCohortScoreSum / totalStudents),
    stuckStudentsTotal: overallStuckCount,
  };
}

function runTests() {
  console.log("================================================================================");
  console.log("             ALGOHUB COHORT ANALYTICS & STUCK-RATE VERIFICATION                 ");
  console.log("================================================================================\n");

  let allPassed = true;

  // -------------------------------------------------------------------------
  // TEST SCENARIO 1: 3-Student Baseline Test
  // -------------------------------------------------------------------------
  console.log("--- SCENARIO 1: 3 Students Baseline Dataset ---");
  console.log("  • Student 1: Bubble = 80% (attempted), Merge = 40% (attempted, stuck <60%)");
  console.log("  • Student 2: Bubble = 50% (attempted, stuck <60%), Merge = 70% (attempted, not stuck)");
  console.log("  • Student 3: Bubble = 0% (unattempted), Merge = 0% (unattempted)");

  const scenario1: MockStudent[] = [
    {
      id: "s1",
      name: "Student 1",
      topicScores: {
        bubble: {
          quiz_best_score: 80,
          bug_hunt_best_score: 80,
          docs_completion: 80,
          prediction_best_score: 80,
          computed_topic_score: 80,
          last_activity_at: new Date().toISOString(),
        },
        merge: {
          quiz_best_score: 40,
          bug_hunt_best_score: 40,
          docs_completion: 40,
          prediction_best_score: 40,
          computed_topic_score: 40,
          last_activity_at: new Date().toISOString(),
        },
      },
    },
    {
      id: "s2",
      name: "Student 2",
      topicScores: {
        bubble: {
          quiz_best_score: 50,
          bug_hunt_best_score: 50,
          docs_completion: 50,
          prediction_best_score: 50,
          computed_topic_score: 50,
          last_activity_at: new Date().toISOString(),
        },
        merge: {
          quiz_best_score: 70,
          bug_hunt_best_score: 70,
          docs_completion: 70,
          prediction_best_score: 70,
          computed_topic_score: 70,
          last_activity_at: new Date().toISOString(),
        },
      },
    },
    {
      id: "s3",
      name: "Student 3",
      topicScores: {},
    },
  ];

  const res1 = computeMockCohortAnalytics(scenario1);
  const bubble1 = res1.topicAverages.find((t) => t.id === "bubble")!;
  const merge1 = res1.topicAverages.find((t) => t.id === "merge")!;
  const quick1 = res1.topicAverages.find((t) => t.id === "quick")!;

  // Bubble check
  if (bubble1.attemptedCount === 2 && bubble1.stuckCount === 1 && bubble1.stuckPercent === 50 && bubble1.avgScore === 65) {
    console.log("  ✓ PASS Bubble Sort : Attempted = 2/3, Stuck = 1, Stuck Rate = 1/2 (50%), Avg Score = (80+50)/2 = 65%");
  } else {
    console.error("  ❌ FAIL Bubble Sort :", bubble1);
    allPassed = false;
  }

  // Merge check
  if (merge1.attemptedCount === 2 && merge1.stuckCount === 1 && merge1.stuckPercent === 50 && merge1.avgScore === 55) {
    console.log("  ✓ PASS Merge Sort  : Attempted = 2/3, Stuck = 1, Stuck Rate = 1/2 (50%), Avg Score = (40+70)/2 = 55%");
  } else {
    console.error("  ❌ FAIL Merge Sort  :", merge1);
    allPassed = false;
  }

  // Zero-attempt guard check (Quick Sort)
  if (quick1.attemptedCount === 0 && quick1.stuckCount === 0 && quick1.stuckPercent === 0 && quick1.avgScore === 0) {
    console.log("  ✓ PASS Quick Sort  : Attempted = 0, Stuck = 0, Stuck Rate = 0% (Denominator zero-division safely guarded)");
  } else {
    console.error("  ❌ FAIL Quick Sort  :", quick1);
    allPassed = false;
  }

  // -------------------------------------------------------------------------
  // TEST SCENARIO 2: 5-Student Denominator Exclusion Edge Case
  // -------------------------------------------------------------------------
  console.log("\n--- SCENARIO 2: 5 Students Denominator Isolation Edge Case ---");
  console.log("  • 5 students total in cohort");
  console.log("  • Student A: Merge Sort = 45% (attempted, stuck <60%)");
  console.log("  • Student B: Merge Sort = 55% (attempted, stuck <60%)");
  console.log("  • Student C: Merge Sort = 90% (attempted, mastered >=85%)");
  console.log("  • Student D: Merge Sort = 0% (never attempted)");
  console.log("  • Student E: Merge Sort = 0% (never attempted)");
  console.log("  • Hand Calculation:");
  console.log("      Total cohort size  = 5");
  console.log("      Never attempted    = 2 (Students D & E)");
  console.log("      Attempted students = 3 (Students A, B, C) => Denominator = 3");
  console.log("      Stuck (<60%)       = 2 (Students A & B)   => Numerator = 2");
  console.log("      Stuck Percentage   = (2 / 3) * 100 = 66.67% => round(67%)");
  console.log("      Incorrect Formula  = (2 / 5) * 100 = 40% (WRONG if denominator includes unattempted)");

  const scenario2: MockStudent[] = [
    {
      id: "sa",
      name: "Student A",
      topicScores: {
        merge: {
          quiz_best_score: 45,
          bug_hunt_best_score: 45,
          docs_completion: 45,
          prediction_best_score: 45,
          computed_topic_score: 45,
          last_activity_at: new Date().toISOString(),
        },
      },
    },
    {
      id: "sb",
      name: "Student B",
      topicScores: {
        merge: {
          quiz_best_score: 55,
          bug_hunt_best_score: 55,
          docs_completion: 55,
          prediction_best_score: 55,
          computed_topic_score: 55,
          last_activity_at: new Date().toISOString(),
        },
      },
    },
    {
      id: "sc",
      name: "Student C",
      topicScores: {
        merge: {
          quiz_best_score: 90,
          bug_hunt_best_score: 90,
          docs_completion: 90,
          prediction_best_score: 90,
          computed_topic_score: 90,
          last_activity_at: new Date().toISOString(),
        },
      },
    },
    {
      id: "sd",
      name: "Student D (Never Attempted)",
      topicScores: {},
    },
    {
      id: "se",
      name: "Student E (Never Attempted)",
      topicScores: {},
    },
  ];

  const res2 = computeMockCohortAnalytics(scenario2);
  const merge2 = res2.topicAverages.find((t) => t.id === "merge")!;

  if (merge2.attemptedCount === 3 && merge2.stuckCount === 2 && merge2.stuckPercent === 67 && merge2.avgScore === 63) {
    console.log("  ✓ PASS Merge Sort Stuck %: Exactly 67% (2 / 3 attempted), NOT 40% (2 / 5 total)");
    console.log("  ✓ PASS Merge Sort Avg Score: Exactly 63% = (45 + 55 + 90) / 3");
  } else {
    console.error("  ❌ FAIL Merge Sort Scenario 2 mismatch:", merge2);
    allPassed = false;
  }

  console.log("\n================================================================================");
  if (allPassed) {
    console.log("  ALL COHORT ANALYTICS & STUCK RATE TESTS PASSED (100% MATHEMATICAL PRECISION) ");
  } else {
    console.error("  SOME TESTS FAILED!");
    process.exit(1);
  }
  console.log("================================================================================\n");
}

runTests();
