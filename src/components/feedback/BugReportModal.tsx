"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { LINKS } from "@/config/links";
import {
  Bug,
  Send,
  ExternalLink,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  AlertTriangle,
} from "lucide-react";

interface BugReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  algorithmId?: string;
}

export function BugReportModal({ isOpen, onClose, algorithmId }: BugReportModalProps) {
  const supabase = createClient();

  const [algoName, setAlgoName] = useState<string>(algorithmId || "");
  const [steps, setSteps] = useState<string>("");
  const [expected, setExpected] = useState<string>("");
  const [actual, setActual] = useState<string>("");
  const [browserInfo, setBrowserInfo] = useState<string>("");
  const [pageUrl, setPageUrl] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPageUrl(window.location.href);
      setBrowserInfo(navigator.userAgent);
    }
  }, [isOpen]);

  useEffect(() => {
    if (algorithmId) {
      setAlgoName(algorithmId);
    }
  }, [algorithmId]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!steps.trim()) {
      setErrorMsg("Please describe the steps to reproduce the bug.");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setErrorMsg("You must be signed in to submit a bug report directly. Or use the Google Form below.");
        setIsLoading(false);
        return;
      }

      const { error } = await (supabase.from("bug_reports") as any).insert({
        user_id: user.id,
        algorithm_id: algoName.trim() || null,
        page_url: pageUrl || window.location.pathname,
        steps_to_reproduce: steps.trim(),
        expected_behavior: expected.trim() || null,
        actual_behavior: actual.trim() || null,
        browser_info: browserInfo || null,
        status: "open",
      });

      if (error) throw error;

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setSteps("");
        setExpected("");
        setActual("");
        onClose();
      }, 2000);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to submit bug report. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
      <div
        className="relative w-full max-w-lg rounded-2xl border border-rose-500/30 bg-[#0c050b]/98 p-6 sm:p-7 text-white shadow-2xl shadow-rose-950/40 backdrop-blur-2xl space-y-4 animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-xl bg-secondary/60 text-slate-400 hover:text-white hover:bg-secondary transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-rose-500/30 bg-rose-500/10 text-rose-300 font-mono text-[11px] font-semibold">
            <Bug className="h-3 w-3 text-rose-400" />
            <span>Bug Diagnostics & Issue Report</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white font-sans">
            Report an Issue / Bug
          </h2>
          <p className="text-xs text-slate-300">
            Help us fix rendering glitches, logic discrepancies, or worker execution issues.
          </p>
        </div>

        {isSuccess ? (
          <div className="py-10 text-center space-y-3 animate-in fade-in">
            <div className="mx-auto h-12 w-12 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-white">Bug Report Logged!</h3>
            <p className="text-xs text-slate-300">
              Our engineering team has received the diagnostic trace and will investigate.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 font-sans">
            {/* Algorithm / Component Name */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-300">
                Algorithm / Component (Optional)
              </label>
              <input
                type="text"
                value={algoName}
                onChange={(e) => setAlgoName(e.target.value)}
                placeholder="e.g. Quick Sort / Visualizer Step Button / C++ Code Tab"
                className="w-full rounded-xl border border-rose-950/70 bg-[#060204] px-3 py-2 text-xs text-slate-100 placeholder:text-slate-600 focus:border-rose-500 focus:outline-none transition-colors"
              />
            </div>

            {/* Steps to Reproduce */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-300">
                Steps to Reproduce <span className="text-rose-400">*</span>
              </label>
              <textarea
                required
                rows={2}
                value={steps}
                onChange={(e) => setSteps(e.target.value)}
                placeholder="1. Clicked custom array. 2. Entered [5, 2, 8]. 3. Pressed play."
                className="w-full rounded-xl border border-rose-950/70 bg-[#060204] p-2.5 text-xs text-slate-100 placeholder:text-slate-600 focus:border-rose-500 focus:outline-none transition-colors resize-none"
              />
            </div>

            {/* Expected vs Actual Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-300">
                  Expected Behavior
                </label>
                <input
                  type="text"
                  value={expected}
                  onChange={(e) => setExpected(e.target.value)}
                  placeholder="Should highlight pivot bar"
                  className="w-full rounded-xl border border-rose-950/70 bg-[#060204] px-3 py-2 text-xs text-slate-100 placeholder:text-slate-600 focus:border-rose-500 focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-300">
                  Actual Behavior
                </label>
                <input
                  type="text"
                  value={actual}
                  onChange={(e) => setActual(e.target.value)}
                  placeholder="Bar froze or showed NaN"
                  className="w-full rounded-xl border border-rose-950/70 bg-[#060204] px-3 py-2 text-xs text-slate-100 placeholder:text-slate-600 focus:border-rose-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Error Alert */}
            {errorMsg && (
              <div className="p-2.5 rounded-xl border border-rose-500/50 bg-rose-500/15 text-rose-200 text-xs flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                <p>{errorMsg}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-rose-600/25 hover:brightness-110 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Logging Bug...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Submit Bug Report</span>
                  </>
                )}
              </button>

              <a
                href={LINKS.GOOGLE_BUG_REPORT_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-[#160812] px-4 py-2.5 text-xs font-semibold text-slate-200 hover:text-white hover:border-slate-500 transition-all"
              >
                <span>Google Form</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
