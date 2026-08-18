"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  Code2,
  Lock,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Eye,
  EyeOff,
  KeyRound,
  ShieldCheck,
} from "lucide-react";

function ResetPasswordForm() {
  const router = useRouter();
  const supabase = createClient();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [hasValidSession, setHasValidSession] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Verify that the user has an active session from the password recovery link
  useEffect(() => {
    async function checkResetSession() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          setHasValidSession(true);
        } else {
          setHasValidSession(false);
          setErrorMsg("Password recovery link is invalid or has expired. Please request a new one.");
        }
      } catch (err) {
        setHasValidSession(false);
        setErrorMsg("Failed to verify recovery session. Please try again.");
      } finally {
        setIsCheckingSession(false);
      }
    }

    checkResetSession();
  }, [supabase]);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const cleanPassword = password.trim();
    const cleanConfirm = confirmPassword.trim();

    if (cleanPassword.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      setIsLoading(false);
      return;
    }

    if (cleanPassword !== cleanConfirm) {
      setErrorMsg("Passwords do not match. Please re-type carefully.");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: cleanPassword,
      });

      if (error) throw error;

      setSuccessMsg("Password updated successfully! Redirecting...");

      // Check beta access status to route them to their proper destination
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setTimeout(async () => {
        if (user) {
          const { data: betaAccess } = await (supabase.from("beta_access") as any)
            .select("status")
            .eq("user_id", user.id)
            .single();

          const status = betaAccess?.status || "pending";
          if (status === "approved") {
            router.push("/learn");
          } else {
            router.push(`/auth/${status}`);
          }
        } else {
          router.push("/auth/login");
        }
        router.refresh();
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to update password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingSession) {
    return (
      <div className="w-full max-w-md p-8 rounded-2xl border border-rose-500/25 bg-[#0e0509]/95 text-center space-y-4">
        <Loader2 className="h-6 w-6 animate-spin text-rose-400 mx-auto" />
        <p className="text-xs font-mono text-slate-300">Verifying secure recovery link...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Header Badge */}
      <div className="text-center space-y-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-rose-500/30 bg-rose-500/10 text-rose-300 font-mono text-xs font-semibold hover:bg-rose-500/20 transition-colors"
        >
          <Code2 className="h-3.5 w-3.5 text-rose-400" />
          <span>AlgoHub • Account Security</span>
        </Link>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-sans tracking-tight">
          Reset Your Password
        </h1>
        <p className="text-xs sm:text-sm text-slate-300">
          Enter a new, secure password for your GSTU CSE student account.
        </p>
      </div>

      {/* Main Glassmorphic Reset Card */}
      <div className="rounded-2xl border border-rose-500/25 bg-[#0e0509]/95 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl shadow-rose-950/40 space-y-5">
        {/* Error Banner */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl border border-rose-500/50 bg-rose-500/15 text-rose-200 text-xs flex items-start gap-2.5 animate-in fade-in">
            <AlertCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{errorMsg}</p>
          </div>
        )}

        {/* Success Banner */}
        {successMsg && (
          <div className="p-3.5 rounded-xl border border-emerald-500/50 bg-emerald-500/15 text-emerald-200 text-xs flex items-start gap-2.5 animate-in fade-in">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{successMsg}</p>
          </div>
        )}

        {hasValidSession ? (
          <form onSubmit={handleUpdatePassword} className="space-y-4 font-sans">
            {/* New Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="w-full rounded-xl border border-rose-950/70 bg-[#060204] pl-10 pr-10 py-2.5 text-xs sm:text-sm text-slate-100 placeholder:text-slate-600 focus:border-rose-500 focus:outline-none transition-colors font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-2.5 p-0.5 text-slate-400 hover:text-slate-200 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Confirm New Password
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full rounded-xl border border-rose-950/70 bg-[#060204] pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder:text-slate-600 focus:border-rose-500 focus:outline-none transition-colors font-mono"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !!successMsg}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 px-5 py-3 text-xs sm:text-sm font-bold text-white shadow-lg shadow-rose-600/30 hover:brightness-110 transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Updating Password...</span>
                </>
              ) : (
                <>
                  <span>Save New Password & Sign In</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="pt-2 text-center space-y-3">
            <Link
              href="/auth/login"
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 px-5 py-3 text-xs sm:text-sm font-bold text-white shadow-lg shadow-rose-600/30 hover:brightness-110 transition-all cursor-pointer"
            >
              <span>Return to Sign In</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#070b12] px-4 py-12 selection:bg-rose-500/30 selection:text-rose-200">
      <Suspense
        fallback={
          <div className="p-8 text-center text-slate-400 font-mono text-xs">
            Loading Reset Password Portal...
          </div>
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
