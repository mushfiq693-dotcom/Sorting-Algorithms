/**
 * AlgoHub — Backtracking Algorithmic Engine
 * Pure deterministic state machine supporting:
 * 1. N-Queens: Place N queens on an N×N board so no two attack each other
 *    (same column, same diagonal). Classic constraint-satisfaction backtracking.
 * 2. Subsets: Generate all subsets of a set via include/exclude decision tree.
 *
 * Each operation records a discrete animation frame capturing the recursion tree
 * state: current decision point, active placements, conflict detection, and
 * the undo/backtrack step that restores prior state.
 */

export type BacktrackingMode = "n-queens" | "subsets";
export type SubsetValue = string | number;

export interface SubsetsCallFrame {
  index: number;
  element: SubsetValue;
  decision: "include" | "exclude" | "pending";
}

export interface BacktrackStep {
  stepIndex: number;
  mode: BacktrackingMode;
  // N-Queens state
  boardSize?: number;
  board?: number[][]; // 1 = queen, 0 = empty
  queens?: [number, number][]; // placed queen positions [row, col]
  row?: number; // current row being processed
  col?: number; // current column being tried
  conflictCells?: [number, number][]; // board cells conflicting with trial placement
  validColumns?: number[]; // columns in current row that pass the constraint check
  // Subsets state
  subset?: SubsetValue[]; // current include/exclude accumulation
  index?: number; // current element index being decided
  choice?: "include" | "exclude" | "backtrack" | "start" | "leaf";
  element?: SubsetValue;
  callStack?: SubsetsCallFrame[];
  decisionPath?: ("include" | "exclude")[];
  nodeId?: string;
  allDiscoveredSubsets?: SubsetValue[][];
  totalExpectedSubsets?: number;
  // Status lifecycle
  status:
    | "idle"
    | "placing"
    | "valid"
    | "conflict"
    | "backtracking"
    | "solved"
    | "no-solution";
  explanation: string;
  invariantNote: string;
}

export interface BacktrackingPreset {
  id: string;
  name: string;
  mode: BacktrackingMode;
  boardSize?: number;
  set?: SubsetValue[];
  description: string;
}

export const BACKTRACKING_PRESETS: BacktrackingPreset[] = [
  {
    id: "n-queens-4",
    name: "N-Queens (4×4)",
    mode: "n-queens",
    boardSize: 4,
    description: "Place 4 queens so no two share a column or diagonal. The smallest solvable non-trivial board.",
  },
  {
    id: "n-queens-8",
    name: "N-Queens (8×8)",
    mode: "n-queens",
    boardSize: 8,
    description: "Classic 8-Queens challenge. 92 distinct solutions exist; backtracking finds the first in O(N!) worst case.",
  },
  {
    id: "subsets-abc",
    name: "Subsets {A, B, C}",
    mode: "subsets",
    set: ["A", "B", "C"],
    description: "Include/exclude decision tree generating all 2³ = 8 subsets via depth-first backtracking.",
  },
];

/**
 * Check whether placing a queen at (row, col) conflicts with already-placed queens.
 * Conflicts occur on the same column or either diagonal.
 */
function queenConflicts(
  queens: [number, number][],
  row: number,
  col: number
): [number, number][] {
  const conflicts: [number, number][] = [];
  for (const [qr, qc] of queens) {
    if (qc === col) conflicts.push([qr, qc]); // same column
    else if (Math.abs(qr - row) === Math.abs(qc - col)) conflicts.push([qr, qc]); // same diagonal
  }
  return conflicts;
}

export class BacktrackingEngine {
  /**
   * Mode 1: N-Queens Constraint Satisfaction
   *
   * Algorithm:
   *   1. Process rows top to bottom (row = 0 ... n-1).
   *   2. For the current row, try each column left to right.
   *   3. If (row, col) is valid (no column/diagonal conflict), place the queen
   *      and recurse to the next row.
   *   4. If a row has no valid column, backtrack: remove the last-placed queen
   *      and resume searching from its next column.
   *   5. When row == n, a complete valid placement is found (solved).
   *   6. If backtracking exhausts row 0 with no options, no solution exists.
   *
   * Complexity:
   *   Time: O(N!) worst case (each row tries up to N columns, pruned by constraints)
   *   Space: O(N) recursion stack + O(N²) board
   */
  public static generateNQueensSteps(n: number = 4): BacktrackStep[] {
    const steps: BacktrackStep[] = [];
    const board: number[][] = Array.from({ length: n }, () => Array(n).fill(0));
    const queens: [number, number][] = [];
    let stepIndex = 0;
    let solved = false;

    const emit = (
      status: BacktrackStep["status"],
      row: number | null,
      col: number | null,
      explanation: string,
      invariantNote: string,
      conflictCells: [number, number][] = [],
      validColumns: number[] = []
    ): void => {
      steps.push({
        stepIndex: stepIndex++,
        mode: "n-queens",
        boardSize: n,
        board: board.map((r) => [...r]),
        queens: [...queens],
        row: row ?? undefined,
        col: col ?? undefined,
        conflictCells: conflictCells.length > 0 ? conflictCells : undefined,
        validColumns:
          validColumns.length > 0 ? validColumns : undefined,
        status,
        explanation,
        invariantNote,
      });
    };

    const tryRow = (r: number): boolean => {
      // Base case: all rows filled -> solved
      if (r === n) {
        solved = true;
        emit("solved", null, null, `✅ All ${n} queens placed successfully! No column or diagonal conflicts remain.`, "Backtracking complete: every row has exactly one queen in a non-attacking column.", undefined, []);
        return true;
      }

      // Announce entering this row
      emit("placing", r, null, `🔍 Processing Row ${r}. Trying columns 0 → ${n - 1} left to right for a non-attacking queen position.`, "Row-by-row placement invariant: each row gets exactly one queen; earlier rows are already fixed and conflict-free.", undefined, []);

      let foundValid = false;

      for (let c = 0; c < n; c++) {
        const conflicts = queenConflicts(queens, r, c);
        const isValid = conflicts.length === 0;

        // Compute which columns remain valid candidates in this row (for the invariant panel)
        const remainingValid: number[] = [];
        for (let cc = c; cc < n; cc++) {
          if (queenConflicts(queens, r, cc).length === 0) remainingValid.push(cc);
        }

        if (isValid) {
          // Place the queen
          board[r][c] = 1;
          queens.push([r, c]);

          emit("valid", r, c, `✅ Row ${r}, Column ${c}: No column or diagonal conflict with existing queens. Placing queen at (${r}, ${c}).`, "Validity invariant: new queen must not share a column or diagonal (|Δrow| == |Δcol|) with any previously placed queen.", [], remainingValid);

          // Recurse to next row
          const deeper = tryRow(r + 1);
          if (deeper) return true;

          // Backtrack: the deeper recursion failed, undo this placement
          board[r][c] = 0;
          queens.pop();

          emit("backtracking", r, c, `↩️ Backtracking from (${r}, ${c}): deeper rows had no valid placement. Removing queen and trying next column in row ${r}.`, "Backtrack invariant: when a placement leads to a dead end, undo the last choice (remove queen) and resume the search from the next untried column.", [], remainingValid);
        } else {
          // Conflict at this column
          emit("conflict", r, c, `❌ Row ${r}, Column ${c}: Queen at (${r}, ${c}) conflicts with existing queen(s). Skipping this column.`, "Conflict rule: a placement is invalid if it shares a column or either diagonal (|Δrow| === |Δcol|) with any placed queen.", conflicts, remainingValid);
        }
        foundValid = foundValid || isValid;
      }

      // No column in this row worked -> signal failure to parent row to backtrack
      emit("backtracking", r, null, `🚫 Row ${r}: no valid column found. All ${n} columns exhausted. Triggering backtrack to row ${r - 1}.`, "Exhaustion invariant: if every column in the current row conflicts, the previous row's placement must be revised.", [], []);
      return false;
    };

    tryRow(0);

    if (!solved) {
      emit("no-solution", null, null, `❌ No valid placement exists for ${n} queens on this ${n}×${n} board under backtracking constraints.`, "Termination invariant: backtracking returns false when row 0 exhausts all columns without finding a complete solution.", [], []);
    }

    return steps;
  }

  /**
   * Mode 2: Subsets via Include/Exclude Decision Tree
   *
   * Algorithm:
   *   1. Start with an empty subset at index 0.
   *   2. At each element, branch: INCLUDE it, or EXCLUDE it.
   *   3. Recurse to the next index for each branch.
   *   4. When index == set.length, record the current subset as a complete solution.
   *   5. Backtrack by removing the last included element before trying the exclude branch.
   *
   * Complexity:
   *   Time: O(2^n) — binary decision at each of n elements
   *   Space: O(n) recursion stack + O(n) subset buffer
   */
  public static generateSubsetsSteps(set: SubsetValue[] = ["A", "B", "C"]): BacktrackStep[] {
    const steps: BacktrackStep[] = [];
    const subset: SubsetValue[] = [];
    const allDiscoveredSubsets: SubsetValue[][] = [];
    const callStack: SubsetsCallFrame[] = [];
    const totalExpectedSubsets = Math.pow(2, set.length);
    let stepIndex = 0;

    const emit = (
      status: BacktrackStep["status"],
      idx: number | undefined,
      choice: BacktrackStep["choice"],
      element: SubsetValue | undefined,
      explanation: string,
      invariantNote: string,
      nodeId: string,
      decisionPath: ("include" | "exclude")[]
    ): void => {
      steps.push({
        stepIndex: stepIndex++,
        mode: "subsets",
        subset: [...subset],
        index: idx,
        choice,
        element,
        callStack: callStack.map((f) => ({ ...f })),
        decisionPath: [...decisionPath],
        nodeId,
        allDiscoveredSubsets: allDiscoveredSubsets.map((s) => [...s]),
        totalExpectedSubsets,
        status,
        explanation,
        invariantNote,
      });
    };

    // Step 0: Initial State
    emit(
      "idle",
      0,
      "start",
      set[0],
      `🌱 Starting Subsets generator for {${set.join(", ")}}. Power set will contain 2^${set.length} = ${totalExpectedSubsets} subsets.`,
      "Initial State Invariant: Decision tree begins at root node with empty subset ∅ and recursion depth 0.",
      "root",
      []
    );

    const decide = (i: number, path: ("include" | "exclude")[]): void => {
      // Base case: all elements decided -> record complete subset
      if (i === set.length) {
        allDiscoveredSubsets.push([...subset]);
        const subsetLabel = subset.length > 0 ? `{${subset.join(", ")}}` : "∅";
        const leafNodeId = path.length > 0 ? "node-" + path.join("-") : "root";
        emit(
          "solved",
          undefined,
          "leaf",
          undefined,
          `🎯 Leaf reached: Discovered subset #${allDiscoveredSubsets.length} → ${subsetLabel} (${subset.length} elements).`,
          "Leaf invariant: when every element has an include/exclude decision, record accumulated subset to power set.",
          leafNodeId,
          path
        );
        return;
      }

      const val = set[i];

      // Branch 1: INCLUDE the current element
      callStack.push({ index: i, element: val, decision: "include" });
      subset.push(val);
      const incPath = [...path, "include" as const];
      const incNodeId = "node-" + incPath.join("-");

      emit(
        "placing",
        i,
        "include",
        val,
        `🌿 Level ${i} ('${val}'): DECISION — INCLUDE '${val}' in subset. Running subset: [${subset.join(", ")}].`,
        "Include invariant: push element onto subset stack and descend depth-first along left tree branch.",
        incNodeId,
        incPath
      );

      decide(i + 1, incPath);

      // Backtrack from INCLUDE:
      subset.pop();
      callStack[callStack.length - 1].decision = "pending";
      const backtrackNodeId = path.length > 0 ? "node-" + path.join("-") : "root";
      emit(
        "backtracking",
        i,
        "backtrack",
        val,
        `↩️ Level ${i}: BACKTRACK from INCLUDE '${val}'. Popped '${val}'. Restored subset to [${subset.join(", ") || "∅"}]. Preparing to explore EXCLUDE branch.`,
        "Backtrack invariant: undo the choice (pop element) so sibling branch starts with pristine parent state.",
        backtrackNodeId,
        path
      );

      // Branch 2: EXCLUDE the current element
      callStack[callStack.length - 1].decision = "exclude";
      const excPath = [...path, "exclude" as const];
      const excNodeId = "node-" + excPath.join("-");

      emit(
        "placing",
        i,
        "exclude",
        val,
        `🍂 Level ${i} ('${val}'): DECISION — EXCLUDE '${val}' from subset. Running subset: [${subset.join(", ") || "∅"}].`,
        "Exclude invariant: skip element without modifying subset stack, descend depth-first along right tree branch.",
        excNodeId,
        excPath
      );

      decide(i + 1, excPath);

      // Backtrack from EXCLUDE:
      callStack.pop();
      const returnNodeId = path.length > 1 ? "node-" + path.slice(0, -1).join("-") : path.length === 1 ? "root" : "root";
      emit(
        "backtracking",
        i,
        "backtrack",
        val,
        `↩️ Level ${i}: Finished both INCLUDE and EXCLUDE subtrees for '${val}'. Popping call stack frame and returning up.`,
        "Call Stack Invariant: when all descendant choices at depth i are complete, frame is popped from recursion stack.",
        returnNodeId,
        path.slice(0, -1)
      );
    };

    decide(0, []);

    // Final Completion Step
    emit(
      "solved",
      undefined,
      "leaf",
      undefined,
      `🎉 Backtracking Complete! All ${totalExpectedSubsets} subsets of {${set.join(", ")}} successfully generated.`,
      `Power Set Invariant: Explored all 2^${set.length} binary leaf paths depth-first in O(2ⁿ) time. Recursion stack returned to 0.`,
      "root",
      []
    );

    return steps;
  }

  /**
   * Factory: generate steps for the requested mode & preset.
   */
  public static generateSteps(preset: BacktrackingPreset): BacktrackStep[] {
    if (preset.mode === "n-queens") {
      return this.generateNQueensSteps(preset.boardSize ?? 4);
    }
    return this.generateSubsetsSteps(preset.set ?? ["A", "B", "C"]);
  }
}
