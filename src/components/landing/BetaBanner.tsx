"use client";

import React, { useState } from "react";
import { MessageSquare, Bug, GraduationCap, ShieldCheck, ExternalLink, Award } from "lucide-react";
import { FeedbackModal } from "@/components/feedback/FeedbackModal";
import { BugReportModal } from "@/components/feedback/BugReportModal";
import { LINKS } from "@/config/links";

export function BetaBanner() {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isBugReportOpen, setIsBugReportOpen] = useState(false);

  return (
    <>
      <section className="py-16 sm:py-24 border-b border-border relative overflow-hidden bg-background transition-colors">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Certificate Style Frame with Brass Corner Flourishes */}
          <div className="relative rounded bg-card border border-border p-8 sm:p-12 text-center ornate-frame shadow-2xl">
            {/* Wax Seal Badge Floating at Top-Right */}
            <div className="absolute -top-5 right-6 sm:right-10 h-10 w-10 sm:h-12 sm:w-12 rounded-full wax-seal flex items-center justify-center text-white shadow-wax-seal select-none">
              <Award className="h-5 w-5 sm:h-6 sm:w-6 text-[#D4B872]" />
            </div>

            {/* University Department Beta Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/40 bg-background text-primary text-xs font-sans font-semibold uppercase tracking-wider mb-6 shadow-sm">
              <GraduationCap className="h-4 w-4" />
              <span>GSTU CSE Department Restricted Beta</span>
            </div>

            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-tight">
              Help shape the next version of AlgoHub.
            </h2>

            <p className="mt-4 font-sans font-normal text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              AlgoHub is currently in early restricted beta for <strong className="text-foreground font-semibold">GSTU CSE students and faculty</strong>. Explore the platform, try the learning experience, and tell us what should be better.
            </p>

            {/* Primary & Secondary Action CTAs */}
            <div className="mt-8 flex flex-wrap justify-center items-center gap-4">
              <button
                onClick={() => setIsFeedbackOpen(true)}
                className="btn-brass inline-flex items-center gap-2 rounded px-6 py-3 text-xs font-sans font-semibold tracking-[0.08em] shadow-brass active:scale-95 cursor-pointer"
              >
                <MessageSquare className="h-4 w-4" />
                <span>Give Beta Feedback</span>
              </button>

              <button
                onClick={() => setIsBugReportOpen(true)}
                className="btn-secondary-brass inline-flex items-center gap-2 rounded px-6 py-3 text-xs font-sans font-semibold tracking-[0.08em] active:scale-95 cursor-pointer"
              >
                <Bug className="h-4 w-4" />
                <span>Report an Issue</span>
              </button>
            </div>

            {/* Department Notice & Credentials */}
            <div className="mt-8 pt-6 border-t border-border flex flex-wrap items-center justify-center gap-6 font-sans text-[11px] font-semibold tracking-wide text-muted-foreground">
              <span className="flex items-center gap-1.5 text-primary">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>PostgreSQL RLS Protected</span>
              </span>
              <span>•</span>
              <a
                href={LINKS.GOOGLE_FEEDBACK_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-foreground hover:text-primary transition-colors"
              >
                <span>Official Google Feedback Form</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
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
