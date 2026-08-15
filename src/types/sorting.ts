export type SortOperation =
  | { type: "compare"; indices: number[]; description?: string }
  | { type: "swap"; indices: [number, number]; description?: string }
  | { type: "overwrite"; index: number; value: number; description?: string }
  | { type: "pivot"; index: number; description?: string }
  | { type: "range"; left: number; right: number; description?: string }
  | { type: "merge-start"; left: number; mid: number; right: number; description?: string }
  | { type: "merge-compare"; leftIndex: number; rightIndex: number; description?: string }
  | { type: "sorted"; indices: number[]; description?: string };

export type AlgorithmId =
  | "bubble"
  | "selection"
  | "insertion"
  | "merge"
  | "quick";

export interface AlgorithmComplexity {
  best: string;
  average: string;
  worst: string;
  space: string;
  stable: boolean;
  inPlace: boolean;
  spaceNote?: string;
}

export interface AlgorithmMetadata {
  id: AlgorithmId;
  name: string;
  shortDescription: string;
  description: string;
  complexity: AlgorithmComplexity;
  cppCode: string;
  highlightLine: (operation: SortOperation) => number | null;
}

export interface VisualizerState {
  array: number[];
  originalArray: number[];
  comparingIndices: number[];
  swappingIndices: number[];
  sortedIndices: number[];
  overwritingIndex: number | null;
  pivotIndex: number | null;
  activeRange: [number, number] | null;
  currentLineNumber: number | null;
  explanation: string;
  comparisonsCount: number;
  swapsCount: number;
}
