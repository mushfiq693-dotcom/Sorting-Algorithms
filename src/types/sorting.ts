export type SortOperation =
  | { type: "compare"; indices: number[]; description?: string; snapshot?: Record<string, any> }
  | { type: "swap"; indices: [number, number]; description?: string; snapshot?: Record<string, any> }
  | { type: "overwrite"; index: number; value: number; description?: string; snapshot?: Record<string, any> }
  | { type: "pivot"; index: number; description?: string; snapshot?: Record<string, any> }
  | { type: "range"; left: number; right: number; description?: string; snapshot?: Record<string, any> }
  | { type: "merge-start"; left: number; mid: number; right: number; description?: string; snapshot?: Record<string, any> }
  | { type: "merge-compare"; leftIndex: number; rightIndex: number; description?: string; snapshot?: Record<string, any> }
  | { type: "sorted"; indices: number[]; description?: string; snapshot?: Record<string, any> }
  | { type: "call-enter"; fn: string; args: number[]; description?: string; snapshot?: Record<string, any> }
  | { type: "call-exit"; fn: string; description?: string; snapshot?: Record<string, any> };

export type SortingAlgorithmId =
  | "bubble"
  | "selection"
  | "insertion"
  | "merge"
  | "quick";

export type DataStructureId = "stack" | "queue";

export type AlgorithmId = SortingAlgorithmId | DataStructureId;

export interface AlgorithmComplexity {
  best: string;
  average: string;
  worst: string;
  space: string;
  stable?: boolean;
  inPlace?: boolean;
  spaceNote?: string;
  operations?: {
    name: string;
    time: string;
    space: string;
    description: string;
  }[];
}

export interface AlgorithmMetadata {
  id: AlgorithmId;
  name: string;
  category?: "sorting" | "data-structure";
  shortDescription: string;
  description: string;
  complexity: AlgorithmComplexity;
  cppCode: string;
  highlightLine?: (operation: SortOperation) => number | null;
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

export interface CallStackFrame {
  id: string;
  fn: string;
  args: number[];
  label: string;
}
