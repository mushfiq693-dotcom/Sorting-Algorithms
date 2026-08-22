/**
 * TypeScript Type Definitions for AlgoHub PostgreSQL Database
 *
 * Strongly-typed representation of Supabase public schema tables, views,
 * functions, and domain entities.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "student" | "faculty" | "mentor" | "admin";
export type BetaStatus = "pending" | "approved" | "rejected" | "suspended";
export type MentorAppStatus = "pending" | "approved" | "rejected";
export type FeedbackCategory = "general" | "visualizer" | "debugger" | "courseware" | "suggestion";
export type BugReportStatus = "open" | "investigating" | "resolved" | "closed";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string; // UUID references auth.users(id)
          email: string;
          full_name: string | null;
          department: string | null;
          student_id: string | null;
          role: UserRole;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          department?: string | null;
          student_id?: string | null;
          role?: UserRole;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          department?: string | null;
          student_id?: string | null;
          role?: UserRole;
          created_at?: string;
          updated_at?: string;
        };
      };
      beta_access: {
        Row: {
          id: string;
          user_id: string;
          status: BetaStatus;
          approved_by: string | null;
          approved_at: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          status?: BetaStatus;
          approved_by?: string | null;
          approved_at?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          status?: BetaStatus;
          approved_by?: string | null;
          approved_at?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      mentor_applications: {
        Row: {
          id: string;
          user_id: string;
          reason: string;
          status: MentorAppStatus;
          reviewed_by: string | null;
          reviewed_at: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          reason: string;
          status?: MentorAppStatus;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          reason?: string;
          status?: MentorAppStatus;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      notices: {
        Row: {
          id: string;
          sender_id: string;
          title: string;
          message: string;
          target_filter: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          sender_id: string;
          title: string;
          message: string;
          target_filter?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          sender_id?: string;
          title?: string;
          message?: string;
          target_filter?: string | null;
          created_at?: string;
        };
      };
      notice_reads: {
        Row: {
          id: string;
          notice_id: string;
          user_id: string;
          read_at: string;
        };
        Insert: {
          id?: string;
          notice_id: string;
          user_id: string;
          read_at?: string;
        };
        Update: {
          id?: string;
          notice_id?: string;
          user_id?: string;
          read_at?: string;
        };
      };
      user_progress: {
        Row: {
          user_id: string;
          completed_steps: Json; // string[] of algorithm steps e.g. ["bubble", "quick"]
          completed_docs: Json; // string[] of completed doc slugs
          quiz_scores: Json; // Record<string, number>
          topic_scores: Json; // Record<string, TopicMetrics>
          activity_history: Json; // ActivityHistoryItem[]
          last_active_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          completed_steps?: Json;
          completed_docs?: Json;
          quiz_scores?: Json;
          topic_scores?: Json;
          activity_history?: Json;
          last_active_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          completed_steps?: Json;
          completed_docs?: Json;
          quiz_scores?: Json;
          topic_scores?: Json;
          activity_history?: Json;
          last_active_at?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      feedback: {
        Row: {
          id: string;
          user_id: string;
          category: FeedbackCategory;
          rating: number | null;
          message: string;
          page_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          category?: FeedbackCategory;
          rating?: number | null;
          message: string;
          page_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          category?: FeedbackCategory;
          rating?: number | null;
          message?: string;
          page_url?: string | null;
          created_at?: string;
        };
      };
      bug_reports: {
        Row: {
          id: string;
          user_id: string;
          algorithm_id: string | null;
          page_url: string;
          steps_to_reproduce: string;
          expected_behavior: string | null;
          actual_behavior: string | null;
          browser_info: string | null;
          status: BugReportStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          algorithm_id?: string | null;
          page_url: string;
          steps_to_reproduce: string;
          expected_behavior?: string | null;
          actual_behavior?: string | null;
          browser_info?: string | null;
          status?: BugReportStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          algorithm_id?: string | null;
          page_url?: string;
          steps_to_reproduce?: string;
          expected_behavior?: string | null;
          actual_behavior?: string | null;
          browser_info?: string | null;
          status?: BugReportStatus;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      is_mentor: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
    Enums: {
      user_role: UserRole;
      beta_status: BetaStatus;
      mentor_app_status: MentorAppStatus;
      feedback_category: FeedbackCategory;
      bug_report_status: BugReportStatus;
    };
  };
}

// Convenient Model Aliases
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

export type BetaAccess = Database["public"]["Tables"]["beta_access"]["Row"];
export type BetaAccessInsert = Database["public"]["Tables"]["beta_access"]["Insert"];
export type BetaAccessUpdate = Database["public"]["Tables"]["beta_access"]["Update"];

export type MentorApplication = Database["public"]["Tables"]["mentor_applications"]["Row"];
export type MentorApplicationInsert = Database["public"]["Tables"]["mentor_applications"]["Insert"];
export type MentorApplicationUpdate = Database["public"]["Tables"]["mentor_applications"]["Update"];

export type Notice = Database["public"]["Tables"]["notices"]["Row"];
export type NoticeInsert = Database["public"]["Tables"]["notices"]["Insert"];
export type NoticeUpdate = Database["public"]["Tables"]["notices"]["Update"];

export type NoticeRead = Database["public"]["Tables"]["notice_reads"]["Row"];
export type NoticeReadInsert = Database["public"]["Tables"]["notice_reads"]["Insert"];

export type UserProgress = Database["public"]["Tables"]["user_progress"]["Row"];
export type UserProgressInsert = Database["public"]["Tables"]["user_progress"]["Insert"];
export type UserProgressUpdate = Database["public"]["Tables"]["user_progress"]["Update"];

export type Feedback = Database["public"]["Tables"]["feedback"]["Row"];
export type FeedbackInsert = Database["public"]["Tables"]["feedback"]["Insert"];

export type BugReport = Database["public"]["Tables"]["bug_reports"]["Row"];
export type BugReportInsert = Database["public"]["Tables"]["bug_reports"]["Insert"];
export type BugReportUpdate = Database["public"]["Tables"]["bug_reports"]["Update"];

// Topic Scoring & Adaptive Guidance Domain Types
export interface TopicMetrics {
  quiz_best_score: number; // 0-100 (best attempt)
  bug_hunt_best_score: number; // 0-100 (best attempt)
  docs_completion: number; // 0-100 (docs visited / total docs)
  prediction_best_score: number; // 0-100 (best attempt)
  computed_topic_score: number; // 0-100 (weighted aggregate)
  last_activity_at: string;
}

export type TopicScoresRecord = Record<string, TopicMetrics>;

export interface ActivityHistoryItem {
  id: string;
  algorithmId: string;
  activityType: "quiz" | "bug_hunt" | "prediction" | "docs";
  title: string;
  score: number;
  timestamp: string;
}
