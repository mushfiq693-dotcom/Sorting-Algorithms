"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { AlgorithmId } from "@/types/sorting";

export const FREE_TOPICS: AlgorithmId[] = ["bubble", "selection", "insertion"];

export interface AccessControlState {
  isLoaded: boolean;
  user: any | null;
  role: "student" | "mentor" | "admin" | null;
  isPremium: boolean;
  isAdmin: boolean;
  isMentor: boolean;
  isPending: boolean;
  betaStatus: string;
  isCourseApproved: boolean;
  isCoursePending: boolean;
  isCourseRejected: boolean;
  isCourseSuspended: boolean;
  isTopicLocked: (topicId: AlgorithmId) => boolean;
  requestPremiumAccess: (reason?: string) => Promise<{ success: boolean; error?: string }>;
  requestCourseAccess: (reason?: string) => Promise<{ success: boolean; error?: string }>;
  refreshAccess: () => Promise<void>;
  showUnlockModal: boolean;
  lockedTopicForModal: AlgorithmId | string | null;
  openUnlockModal: (topicId?: AlgorithmId | string) => void;
  closeUnlockModal: () => void;
}

export function useAccessControl(): AccessControlState {
  const supabase = createClient();

  const [isLoaded, setIsLoaded] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [role, setRole] = useState<"student" | "mentor" | "admin" | null>(null);
  const [betaStatus, setBetaStatus] = useState<string>("free");
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [lockedTopicForModal, setLockedTopicForModal] = useState<AlgorithmId | string | null>(null);

  const loadAccess = useCallback(async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const currentUser = session?.user || null;
      setUser(currentUser);

      if (currentUser) {
        // Fetch profile role
        const { data: profile } = await (supabase.from("profiles") as any)
          .select("role")
          .eq("id", currentUser.id)
          .single();

        const userRole = profile?.role || "student";
        setRole(userRole);

        // Fetch beta_access record to determine access status
        const { data: accessRecord } = await (supabase.from("beta_access") as any)
          .select("status")
          .eq("user_id", currentUser.id)
          .maybeSingle();

        setBetaStatus(accessRecord?.status || "free");
      } else {
        setRole(null);
        setBetaStatus("free");
      }
    } catch (err) {
      console.error("Failed to load access control state:", err);
    } finally {
      setIsLoaded(true);
    }
  }, [supabase]);

  useEffect(() => {
    loadAccess();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user);
        const { data: profile } = await (supabase.from("profiles") as any)
          .select("role")
          .eq("id", session.user.id)
          .single();
        setRole(profile?.role || "student");

        const { data: accessRecord } = await (supabase.from("beta_access") as any)
          .select("status")
          .eq("user_id", session.user.id)
          .maybeSingle();
        setBetaStatus(accessRecord?.status || "free");
      } else {
        setUser(null);
        setRole(null);
        setBetaStatus("free");
      }
      setIsLoaded(true);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, loadAccess]);

  const isAdmin = role === "admin";
  const isMentor = role === "mentor";
  // General features (visualizers, matrix, practice, docs) are free for all
  const isPremium = true;
  
  // Course Materials Access Logic
  const isCourseApproved = isAdmin || isMentor || betaStatus === "approved";
  const isCoursePending = betaStatus === "pending";
  const isCourseRejected = betaStatus === "rejected";
  const isCourseSuspended = betaStatus === "suspended";
  const isPending = isCoursePending;

  const isTopicLocked = useCallback(
    (_topicId: AlgorithmId): boolean => {
      // General algorithms and topics are 100% free and unlocked for everyone
      return false;
    },
    []
  );

  const requestCourseAccess = useCallback(
    async (reason: string = "Course Material Access Request"): Promise<{ success: boolean; error?: string }> => {
      if (!user) {
        return { success: false, error: "You must be signed in to request course access." };
      }

      try {
        // Upsert into beta_access table with pending status
        const { error } = await (supabase.from("beta_access") as any).upsert(
          {
            user_id: user.id,
            status: "pending",
            notes: reason,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" }
        );

        if (error) throw error;

        setBetaStatus("pending");
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message || "Failed to submit request." };
      }
    },
    [supabase, user]
  );

  const requestPremiumAccess = useCallback(
    async (reason: string = "Requested from app"): Promise<{ success: boolean; error?: string }> => {
      return requestCourseAccess(reason);
    },
    [requestCourseAccess]
  );

  const openUnlockModal = useCallback((topicId?: AlgorithmId | string) => {
    setLockedTopicForModal(topicId || null);
    setShowUnlockModal(true);
  }, []);

  const closeUnlockModal = useCallback(() => {
    setShowUnlockModal(false);
  }, []);

  return {
    isLoaded,
    user,
    role,
    isPremium,
    isAdmin,
    isMentor,
    isPending,
    betaStatus,
    isCourseApproved,
    isCoursePending,
    isCourseRejected,
    isCourseSuspended,
    isTopicLocked,
    requestPremiumAccess,
    requestCourseAccess,
    refreshAccess: loadAccess,
    showUnlockModal,
    lockedTopicForModal,
    openUnlockModal,
    closeUnlockModal,
  };
}
