"use client";

import React, { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { LINKS } from "@/config/links";
import {
  MessageSquare,
  Star,
  ExternalLink,
  Send,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
} from "lucide-react";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FeedbackCategory = "general" | "visualizer" | "debugger" | "courseware" | "suggestion";

export function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const supabase = createClient();

  const [category, setCategory] = useState<FeedbackCategory>("general");
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setErrorMsg("Please write your feedback before submitting.");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setErrorMsg("You must be signed in to submit feedback directly. Or use the Google Form below.");
        setIsLoading(false);
        return;
      }

      const { error } = await (supabase.from("feedback") as any).insert({
        user_id: user.id,
        category,
        rating,
        message: message.trim(),
        page_url: typeof window !== "undefined" ? window.location.pathname : null,
      });

      if (error) throw error;

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setMessage("");
        onClose();
      }, 2000);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to submit feedback. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
      <div
        className="relative w-full max-w-lg rounded-2xl border border-cyan-500/30 bg-[#0c050b]/98 p-6 sm:p-7 text-white shadow-2xl shadow-cyan-950/40 backdrop-blur-2xl space-y-5 animate-in zoom-in-95"
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 font-mono text-[11px] font-semibold">
            <Sparkles className="h-3 w-3 text-cyan-400" />
            <span>GSTU CSE Beta Feedback</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white font-sans">
            Help Shape AlgoHub
          </h2>
          <p className="text-xs text-slate-300">
            Tell us about your learning experience, what you love, or what we can improve.
          </p>
        </div>

        {isSuccess ? (
          <div className="py-10 text-center space-y-3 animate-in fade-in">
            <div className="mx-auto h-12 w-12 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-white">Thank You for Your Feedback!</h3>
            <p className="text-xs text-slate-300">
              Your insights have been saved directly to our beta development tracker.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Category Selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300 font-sans">
                Topic Category
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 text-[11px] font-mono">
                {(
                  [
                    { id: "general", label: "General" },
                    { id: "visualizer", label: "Visualizer" },
                    { id: "debugger", label: "Debugger" },
                    { id: "courseware", label: "Docs" },
                    { id: "suggestion", label: "Idea" },
                  ] as const
                ).map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`py-1.5 px-2 rounded-lg border transition-all text-center ${
                      category === cat.id
                        ? "border-cyan-500/60 bg-cyan-500/20 text-cyan-300 font-bold"
                        : "border-slate-800 bg-[#060204] text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Star Rating */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300 font-sans">
                Overall Experience Rating
              </label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`h-5 w-5 ${
                        (hoverRating !== null ? hoverRating >= star : rating >= star)
                          ? "text-amber-400 fill-amber-400"
                          : "text-slate-600"
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs text-slate-400 font-mono ml-2">
                  {rating}/5 Stars
                </span>
              </div>
            </div>

            {/* Message Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300 font-sans">
                Your Feedback & Thoughts
              </label>
              <textarea
                required
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="What did you like about the algorithms? Any features you want added?"
                className="w-full rounded-xl border border-rose-950/70 bg-[#060204] p-3 text-xs sm:text-sm text-slate-100 placeholder:text-slate-600 focus:border-cyan-500 focus:outline-none transition-colors resize-none"
              />
            </div>

            {/* Error Alert */}
            {errorMsg && (
              <div className="p-3 rounded-xl border border-rose-500/50 bg-rose-500/15 text-rose-200 text-xs flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                <p>{errorMsg}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
              {/* Direct Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-cyan-500/25 hover:brightness-110 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Submit Feedback</span>
                  </>
                )}
              </button>

              {/* Google Form Link Button */}
              <a
                href={LINKS.GOOGLE_FEEDBACK_FORM_URL}
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
