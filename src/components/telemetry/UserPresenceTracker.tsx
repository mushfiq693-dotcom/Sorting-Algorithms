"use client";

import React, { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// Global in-memory presence state shared across the application in the client runtime
let globalPresenceState: Record<string, any> = {};

export function getGlobalPresenceState(): Record<string, any> {
  return globalPresenceState;
}

export function parsePresenceMap(
  state: Record<string, any>
): Map<string, { page?: string; online_at?: string }> {
  const newMap = new Map<string, { page?: string; online_at?: string }>();
  if (!state || typeof state !== "object") return newMap;

  Object.values(state).forEach((presences: any) => {
    if (Array.isArray(presences)) {
      presences.forEach((p: any) => {
        if (p?.user_id) {
          newMap.set(p.user_id, {
            page: p.page,
            online_at: p.online_at,
          });
        }
      });
    }
  });

  return newMap;
}

export function UserPresenceTracker() {
  const pathname = usePathname();
  const supabase = createClient();
  const channelRef = useRef<any>(null);
  const currentUserIdRef = useRef<string | null>(null);
  const lastHeartbeatRef = useRef<number>(0);

  // Send activity heartbeat to database to update user_progress.last_active_at
  const sendHeartbeat = async (userId: string) => {
    const now = Date.now();
    // Throttle heartbeats to at most once every 30 seconds
    if (now - lastHeartbeatRef.current < 30000) return;
    lastHeartbeatRef.current = now;

    try {
      await (supabase.from("user_progress") as any)
        .update({ last_active_at: new Date().toISOString() })
        .eq("user_id", userId);
    } catch {
      // Non-blocking telemetry
    }
  };

  const dispatchPresenceUpdate = (state: Record<string, any>) => {
    globalPresenceState = state;
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("algohub:presence-sync", { detail: state })
      );
    }
  };

  useEffect(() => {
    let isMounted = true;

    async function initPresence() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const user = session?.user;
      if (!user) return;

      currentUserIdRef.current = user.id;

      // Initial heartbeat
      sendHeartbeat(user.id);

      // Join Realtime presence channel safely
      if (!channelRef.current) {
        const channel = supabase.channel("algohub-live-users", {
          config: {
            presence: {
              key: user.id,
            },
          },
        });

        channel
          .on("presence", { event: "sync" }, () => {
            if (isMounted) {
              dispatchPresenceUpdate(channel.presenceState());
            }
          })
          .on("presence", { event: "join" }, () => {
            if (isMounted) {
              dispatchPresenceUpdate(channel.presenceState());
            }
          })
          .on("presence", { event: "leave" }, () => {
            if (isMounted) {
              dispatchPresenceUpdate(channel.presenceState());
            }
          })
          .subscribe(async (status) => {
            if (status === "SUBSCRIBED" && isMounted) {
              await channel.track({
                user_id: user.id,
                email: user.email,
                page: window.location.pathname,
                online_at: new Date().toISOString(),
              });
              dispatchPresenceUpdate(channel.presenceState());
            }
          });

        channelRef.current = channel;
      }
    }

    initPresence();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        currentUserIdRef.current = session.user.id;
        initPresence();
      } else {
        currentUserIdRef.current = null;
        if (channelRef.current) {
          supabase.removeChannel(channelRef.current);
          channelRef.current = null;
          dispatchPresenceUpdate({});
        }
      }
    });

    // Periodic heartbeat every 45 seconds while tab is active
    const interval = setInterval(() => {
      if (currentUserIdRef.current && document.visibilityState === "visible") {
        sendHeartbeat(currentUserIdRef.current);
        if (channelRef.current) {
          channelRef.current.track({
            user_id: currentUserIdRef.current,
            page: window.location.pathname,
            online_at: new Date().toISOString(),
          });
        }
      }
    }, 45000);

    // Heartbeat on visibility change (user returns to tab)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && currentUserIdRef.current) {
        sendHeartbeat(currentUserIdRef.current);
        if (channelRef.current) {
          channelRef.current.track({
            user_id: currentUserIdRef.current,
            page: window.location.pathname,
            online_at: new Date().toISOString(),
          });
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      isMounted = false;
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      subscription.unsubscribe();
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [supabase]);

  // Update tracked page on route navigation
  useEffect(() => {
    if (channelRef.current && currentUserIdRef.current) {
      channelRef.current.track({
        user_id: currentUserIdRef.current,
        page: pathname,
        online_at: new Date().toISOString(),
      });
      sendHeartbeat(currentUserIdRef.current);
    }
  }, [pathname]);

  return null;
}
