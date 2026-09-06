"use client";

import React, { useState } from "react";
import { MessageSquare, Bug, X } from "lucide-react";
import { FeedbackModal } from "./FeedbackModal";
import { BugReportModal } from "./BugReportModal";

export function FeedbackWidget() {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isBugReportOpen, setIsBugReportOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      {/* Floating Bottom Action Trigger */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2 font-sans select-none">
        {/* Expanded Options */}
        {isExpanded && (
          <div className="flex flex-col items-end gap-2 animate-in fade-in slide-in-from-bottom-2">
            {/* Feedback Button */}
            <button
              onClick={() => {
                setIsFeedbackOpen(true);
                setIsExpanded(false);
              }}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-card border border-cyan-500/40 text-cyan-700 dark:text-cyan-300 text-xs font-semibold shadow-xl hover:bg-cyan-500/10 transition-all active:scale-95 cursor-pointer"
            >
              <MessageSquare className="h-3.5 w-3.5 text-cyan-500" />
              <span>Give Feedback & Ideas</span>
            </button>

            {/* Bug Report Button */}
            <button
              onClick={() => {
                setIsBugReportOpen(true);
                setIsExpanded(false);
              }}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-card border border-rose-500/40 text-rose-700 dark:text-rose-300 text-xs font-semibold shadow-xl hover:bg-rose-500/10 transition-all active:scale-95 cursor-pointer"
            >
              <Bug className="h-3.5 w-3.5 text-rose-500" />
              <span>Report an Issue</span>
            </button>
          </div>
        )}

        {/* Main Floating Trigger Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white text-xs font-bold shadow-2xl shadow-rose-600/30 hover:brightness-110 active:scale-95 transition-all cursor-pointer border border-white/10"
          aria-label="Open Feedback and Issue Reporting"
        >
          {isExpanded ? (
            <X className="h-4 w-4" />
          ) : (
            <>
              <MessageSquare className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Feedback</span>
            </>
          )}
        </button>
      </div>

      {/* Modals */}
      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />

      <BugReportModal
        isOpen={isBugReportOpen}
        onClose={() => setIsBugReportOpen(false)}
      />
    </>
  );
}
