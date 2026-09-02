"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
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
  Home,
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

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match. Please ensure both fields are identical.");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;

      setSuccessMsg("Password successfully updated! Redirecting to AlgoHub...");

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
      <div className="w-full max-w-md p-8 rounded-2xl border border-border bg-card/90 text-center space-y-4 shadow-2xl">
        <Loader2 className="h-6 w-6 animate-spin text-primary mx-auto" />
        <p className="text-xs font-sans text-muted-foreground">Verifying secure recovery link...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md space-y-6 relative z-10">
      {/* Header Badge */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/40 bg-card text-primary font-sans text-xs uppercase tracking-wider font-semibold">
          <KeyRound className="h-3.5 w-3.5" />
          <span>Account Security</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground font-heading">
          Reset Your <span className="italic font-semibold text-primary dark:text-[#D4B872]">Password</span>
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground font-sans">
          Enter a new, secure password for your AlgoHub account.
        </p>
      </div>

      {/* Main Glassmorphic Reset Card */}
      <div className="rounded-2xl border border-border bg-card/90 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-5 corner-flourish transition-all">
        {/* Error Banner */}
        {errorMsg && (
          <div className="p-3.5 rounded-lg border border-destructive/50 bg-destructive/10 text-destructive text-xs flex items-start gap-2.5 animate-in fade-in">
            <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
            <p className="leading-relaxed font-sans">{errorMsg}</p>
          </div>
        )}

        {/* Success Banner */}
        {successMsg && (
          <div className="p-3.5 rounded-lg border border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs flex items-start gap-2.5 animate-in fade-in">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
            <p className="leading-relaxed font-sans">{successMsg}</p>
          </div>
        )}

        {hasValidSession ? (
          <form onSubmit={handleUpdatePassword} className="space-y-4 font-sans">
            {/* New Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-foreground">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="w-full rounded border border-border bg-background/80 pl-10 pr-10 py-2.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-colors font-sans"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-2.5 p-0.5 text-muted-foreground hover:text-foreground transition-colors"
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
              <label className="block text-xs font-semibold text-foreground">
                Confirm New Password
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full rounded border border-border bg-background/80 pl-10 pr-4 py-2.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-colors font-sans"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !!successMsg}
              className="btn-brass w-full inline-flex items-center justify-center gap-2 rounded px-7 py-3 text-xs sm:text-sm font-sans font-semibold tracking-[0.08em] shadow-brass hover:scale-[1.01] active:scale-[0.98] transition-all text-primary-foreground cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Updating Password...</span>
                </>
              ) : (
                <>
                  <span>Save New Password & Sign In</span>
                  <ArrowRight className="h-4 w-4 ml-0.5" />
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="pt-2 text-center space-y-3">
            <Link
              href="/auth/login"
              className="btn-brass w-full inline-flex items-center justify-center gap-2 rounded px-7 py-3 text-xs sm:text-sm font-sans font-semibold tracking-[0.08em] shadow-brass hover:scale-[1.01] active:scale-[0.98] transition-all text-primary-foreground cursor-pointer"
            >
              <span>Return to Sign In</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-between px-2 text-xs font-sans text-muted-foreground">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 hover:text-primary transition-colors"
        >
          <Home className="h-3.5 w-3.5 text-primary" />
          <span>Back to AlgoHub</span>
        </Link>
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
          <span>Encrypted Session</span>
        </span>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground flex items-center justify-center p-4 sm:p-6 antialiased selection:bg-[#C9A962]/35 selection:text-[#1C1714] transition-colors duration-200 overflow-hidden font-sans">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[140px]" />
        <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      {/* Top Navbar items */}
      <div className="absolute top-4 left-4 sm:left-8 z-50">
        <Link href="/" className="flex items-center gap-2 group text-foreground hover:text-primary transition-colors">
          <span className="font-heading text-lg sm:text-xl font-bold tracking-tight">AlgoHub</span>
        </Link>
      </div>
      <div className="absolute top-4 right-4 sm:right-8 z-50">
        <ThemeToggle />
      </div>

      <Suspense
        fallback={
          <div className="p-8 text-center text-muted-foreground font-sans text-xs">
            <Loader2 className="h-6 w-6 animate-spin text-primary mx-auto mb-2" />
            Loading Reset Password Portal...
          </div>
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
