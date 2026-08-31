export type CourseMaterialContentType = "topic" | "problem";
export type CourseMaterialDifficulty = "easy" | "medium" | "hard";

export interface CourseMaterial {
  id: string;
  title: string;
  book_reference: string | null;
  topic_tag: string | null;
  content_type: CourseMaterialContentType;
  problem_statement: string | null;
  explanation_or_solution: string;
  difficulty: CourseMaterialDifficulty | null;
  assigned_date: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}
