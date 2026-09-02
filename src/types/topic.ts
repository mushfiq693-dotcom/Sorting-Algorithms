import { SortOperation } from "./sorting";

export type TopicCategory = "sorting" | "searching" | "data-structure" | "complexity";

export type SortingAlgorithmId =
  | "bubble"
  | "selection"
  | "insertion"
  | "merge"
  | "quick";

export type SearchingAlgorithmId = "linear-search" | "binary-search";

export type DataStructureId = "stack" | "queue" | "linked-list";

export type ComplexityTopicId = "time-complexity" | "space-complexity";

export type TopicId =
  | SortingAlgorithmId
  | SearchingAlgorithmId
  | DataStructureId
  | ComplexityTopicId;

// Backwards compatibility alias
export type AlgorithmId = TopicId;

export interface TopicComplexity {
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

export type StackOperation =
  | { type: "push"; value: number; index: number; description: string }
  | { type: "pop"; value: number; index: number; description: string }
  | { type: "peek"; value: number; index: number; description: string }
  | { type: "underflow"; description: string }
  | { type: "overflow"; value: number; description: string }
  | { type: "clear"; description: string };

export type QueueOperation =
  | { type: "enqueue"; value: number; index: number; description: string }
  | { type: "dequeue"; value: number; index: number; description: string }
  | { type: "front"; value: number; index: number; description: string }
  | { type: "underflow"; description: string }
  | { type: "overflow"; value: number; description: string }
  | { type: "clear"; description: string };

export type LinkedListOperation =
  | { type: "insert-head"; value: number; description: string }
  | { type: "insert-tail"; value: number; description: string }
  | { type: "delete"; value: number; found: boolean; description: string }
  | { type: "search"; value: number; found: boolean; steps: number[]; description: string }
  | { type: "clear"; description: string };

export interface TopicMetadata {
  id: TopicId;
  name: string;
  category: TopicCategory;
  shortDescription: string;
  description: string;
  complexity: TopicComplexity;
  cppCode: string;
  highlightLine?: (operation: any) => number | null;
}
