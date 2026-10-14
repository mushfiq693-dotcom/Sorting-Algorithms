"use client";

import React, { useState } from "react";
import { MessageSquare, Bug, Sparkles, ShieldCheck, ExternalLink } from "lucide-react";
import { FeedbackModal } from "@/components/feedback/FeedbackModal";
import { BugReportModal } from "@/components/feedback/BugReportModal";
import { LINKS } from "@/config/links";

export function BetaBanner() {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isBugReportOpen, setIsBugReportOpen] = useState(false);

  return (
    <>
      <section className="py-20 sm:py-28 relative overflow-hidden bg-background transition-colors">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Community Feedback Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/40 bg-card/80 text-primary text-xs font-sans font-semibold uppercase tracking-wider mb-5 shadow-xs backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>AlgoHub Community & Feedback</span>
          </div>

          {/* Heading */}
          <h2 className="font-sans text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15]">
            Help shape the future of{" "}
            <span className="text-[#B08422] dark:text-[#D4B872]">
              AlgoHub.
            </span>
          </h2>

          {/* Description */}
          <p className="mt-4 sm:mt-5 font-sans font-normal text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            AlgoHub is built for{" "}
            <strong className="text-foreground font-semibold">learners, developers, and educators worldwide</strong>
            . Explore the platform, try the interactive visualizers, and let us know what features or topics you&apos;d love to see next.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 sm:mt-10 flex flex-wrap justify-center items-center gap-3 sm:gap-4">
            <button
              onClick={() => setIsFeedbackOpen(true)}
              className="btn-brass inline-flex items-center gap-2 rounded px-6 sm:px-7 py-3 sm:py-3.5 text-xs sm:text-sm font-sans font-semibold tracking-[0.08em] shadow-brass hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Give Feedback & Ideas</span>
            </button>

            <button
              onClick={() => setIsBugReportOpen(true)}
              className="btn-secondary-brass inline-flex items-center gap-2 rounded px-6 sm:px-7 py-3 sm:py-3.5 text-xs sm:text-sm font-sans font-semibold tracking-[0.08em] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Bug className="h-4 w-4" />
              <span>Report an Issue</span>
            </button>
          </div>

          {/* Trust Badges & Google Form Link */}
          <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-6 font-sans text-xs font-medium text-muted-foreground">
            <span className="flex items-center gap-1.5 text-primary font-semibold">
              <ShieldCheck className="h-4 w-4" />
              <span>PostgreSQL RLS & Cloud Encrypted</span>
            </span>
            <span className="text-border hidden sm:inline">•</span>
            <a
              href={LINKS.GOOGLE_FEEDBACK_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-foreground hover:text-primary transition-colors font-medium"
            >
              <span>Official Google Feedback Form</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </section>

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
