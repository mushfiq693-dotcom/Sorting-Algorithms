"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import {
  Code2,
  Lock,
  Mail,
  User,
  GraduationCap,
  Sparkles,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Home,
  ShieldCheck,
  Eye,
  EyeOff,
  KeyRound,
  X,
  Zap,
} from "lucide-react";

import { validateGenuineEmail } from "@/lib/validation/emailValidator";

// Reversible Feature Flag: Magic Link is disabled for beta launch to preserve email quotas
const MAGIC_LINK_ENABLED = false;

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextRoute = searchParams.get("next") || "/learn";
  const urlError = searchParams.get("error");

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [authMethod, setAuthMethod] = useState<"password" | "magiclink">("password");
  const [showPassword, setShowPassword] = useState(false);
  const [emailVerificationSent, setEmailVerificationSent] = useState<string | null>(null);

  // Forgot Password Modal State
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState<string | null>(null);
  const [forgotSuccess, setForgotSuccess] = useState<string | null>(null);

  // Form Fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [department, setDepartment] = useState("CSE");
  const [studentId, setStudentId] = useState("");

  // State
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(
    urlError === "auth_callback_failed" ? "Authentication link expired or invalid. Please try again." : null
  );
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const supabase = createClient();

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotError(null);
    setForgotSuccess(null);

    const cleanEmail = forgotEmail.trim().toLowerCase();
    const validation = validateGenuineEmail(cleanEmail);
    if (!validation.isValid) {
      setForgotError(validation.error || "Please enter a valid email address.");
      setForgotLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: `${window.location.origin}/auth/callback?next=/auth/reset-password`,
      });
      if (error) throw error;
      setForgotSuccess("Password reset link sent! Please check your email inbox.");
    } catch (err: any) {
      setForgotError(err.message || "Failed to send reset link. Please try again.");
    } finally {
      setForgotLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    const validation = validateGenuineEmail(cleanEmail);
    if (!validation.isValid) {
      setErrorMsg(validation.error || "Invalid email address.");
      setIsLoading(false);
      return;
    }

    try {
      if (authMethod === "magiclink") {
        const { error } = await supabase.auth.signInWithOtp({
          email: cleanEmail,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextRoute)}`,
          },
        });
        if (error) throw error;
        setSuccessMsg("Magic sign-in link sent! Please check your email inbox.");
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: cleanPassword,
        });
        if (error) throw error;

        // Check beta access status
        if (data.user) {
          const { data: betaAccess } = await (supabase.from("beta_access") as any)
            .select("status")
            .eq("user_id", data.user.id)
            .single();

          const status = betaAccess?.status || "pending";
          if (status === "approved") {
            router.push(nextRoute);
            router.refresh();
          } else {
            router.push(`/auth/${status}`);
          }
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to sign in. Please verify your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoSignIn = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg("Authenticating recruiter demo session...");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: "demo@algohub.dev",
        password: "DemoUser2026!",
      });
      if (error) throw error;

      if (data.user) {
        setSuccessMsg("✓ Verified recruiter demo access granted! Redirecting...");
        router.push(nextRoute);
        router.refresh();
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to start demo session. You can also explore public visualizers directly.");
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    // 1. Genuine Email Domain & Typo Validation
    const validation = validateGenuineEmail(cleanEmail);
    if (!validation.isValid) {
      setErrorMsg(validation.error || "Please enter a valid personal or university email.");
      setIsLoading(false);
      return;
    }

    if (cleanPassword.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password: cleanPassword,
        options: {
          data: {
            full_name: fullName.trim(),
            department: department || "CSE",
            student_id: studentId.trim(),
          },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/auth/pending`,
        },
      });

      if (error) throw error;

      if (data.user) {
        // If email confirmation is required by Supabase
        if (data.user.identities && data.user.identities.length === 0) {
          setErrorMsg("An account with this email address already exists. Please Sign In.");
        } else {
          setEmailVerificationSent(cleanEmail);
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Header Badge */}
      <div className="text-center space-y-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-rose-500/30 bg-rose-500/10 text-rose-300 font-mono text-xs font-semibold hover:bg-rose-500/20 transition-colors"
        >
          <Code2 className="h-3.5 w-3.5 text-rose-400" />
          <span>AlgoHub • GSTU CSE Restricted Beta</span>
        </Link>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-sans tracking-tight">
          {mode === "signin" ? "Sign in to AlgoHub" : "Request Beta Access"}
        </h1>
        <p className="text-xs sm:text-sm text-slate-300">
          {mode === "signin"
            ? "Enter your credentials to access interactive algorithm modules."
            : "Register with your student/faculty email for departmental review."}
        </p>
      </div>

      {/* Recruiter & Quick Evaluation Fast-Track Card */}
      <div className="rounded-2xl border border-cyan-500/35 bg-gradient-to-b from-cyan-950/50 via-[#071322]/90 to-[#040a14]/98 p-4 sm:p-5 backdrop-blur-xl shadow-xl shadow-cyan-950/50 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-bold text-cyan-300 font-mono tracking-tight">
              👔 Recruiter & Evaluation Fast-Track
            </span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-bold">
            1-Click Demo
          </span>
        </div>

        <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
          Evaluating this project for a job/internship? Bypass university beta registration with pre-approved demo credentials.
        </p>

        <div className="flex flex-col sm:flex-row gap-2 pt-1">
          <button
            type="button"
            onClick={handleDemoSignIn}
            disabled={isLoading}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-cyan-500/25 hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
          >
            <Zap className="h-3.5 w-3.5 fill-white" />
            <span>1-Click Recruiter Demo Access</span>
          </button>

          <Link
            href="/learn"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/10 transition-all text-center"
          >
            <span>Public Sandbox &rarr;</span>
          </Link>
        </div>

        <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between pt-1.5 border-t border-white/[0.08]">
          <span>Email: <strong className="text-slate-300">demo@algohub.dev</strong></span>
          <span>Pass: <strong className="text-slate-300">DemoUser2026!</strong></span>
        </div>
      </div>

      {/* Main Glassmorphic Auth Card */}
      <div className="rounded-2xl border border-rose-500/25 bg-[#0e0509]/95 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl shadow-rose-950/40 space-y-5">
        {emailVerificationSent ? (
          <div className="text-center py-4 space-y-5 animate-in fade-in zoom-in-95">
            <div className="h-16 w-16 mx-auto rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-600 flex items-center justify-center shadow-xl shadow-rose-600/30">
              <Mail className="h-8 w-8 text-white" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-white font-sans">
                Verify Your Email Address
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-sm mx-auto">
                We sent a secure verification link to:
              </p>
              <div className="inline-block px-3 py-1 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 font-mono text-xs font-bold">
                {emailVerificationSent}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#060204] border border-rose-950/60 text-left text-xs text-slate-300 space-y-2">
              <div className="font-semibold text-white flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>Next Steps:</span>
              </div>
              <ol className="list-decimal list-inside space-y-1 text-slate-400 font-sans">
                <li>Open your email inbox (and check spam if needed).</li>
                <li>Click the confirmation link to verify your identity.</li>
                <li>Your request will immediately move to GSTU departmental review!</li>
              </ol>
            </div>

            <button
              onClick={() => {
                setEmailVerificationSent(null);
                setMode("signin");
                setEmail(emailVerificationSent);
              }}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 px-5 py-3 text-xs sm:text-sm font-bold text-white shadow-lg shadow-rose-600/30 hover:brightness-110 transition-all cursor-pointer"
            >
              <span>Already Verified? Go to Sign In</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <>
            {/* Mode Switcher Tabs */}
            <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-[#060204] border border-rose-950/60 font-sans text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  setMode("signin");
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className={`py-2 rounded-lg transition-all cursor-pointer ${
                  mode === "signin"
                    ? "bg-rose-600/20 text-rose-300 border border-rose-500/30 shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("signup");
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className={`py-2 rounded-lg transition-all cursor-pointer ${
                  mode === "signup"
                    ? "bg-rose-600/20 text-rose-300 border border-rose-500/30 shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Join Beta (Register)
              </button>
            </div>

            {/* Error Alert Banner */}
            {errorMsg && (
              <div className="p-3.5 rounded-xl border border-rose-500/50 bg-rose-500/15 text-rose-200 text-xs flex items-start gap-2.5 animate-in fade-in">
                <AlertCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                <p className="leading-relaxed">{errorMsg}</p>
              </div>
            )}

            {/* Success Alert Banner */}
            {successMsg && (
          <div className="p-3.5 rounded-xl border border-emerald-500/50 bg-emerald-500/15 text-emerald-200 text-xs flex items-start gap-2.5 animate-in fade-in">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{successMsg}</p>
          </div>
        )}

        {/* Form Elements */}
        {mode === "signin" ? (
          <form onSubmit={handleSignIn} className="space-y-4">
            {/* Auth Method Toggle (Only shown if MAGIC_LINK_ENABLED is true) */}
            {MAGIC_LINK_ENABLED && (
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 px-1">
                <span>Sign-in method:</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAuthMethod("password")}
                    className={`hover:underline ${authMethod === "password" ? "text-rose-400 font-bold" : ""}`}
                  >
                    Password
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => setAuthMethod("magiclink")}
                    className={`hover:underline ${authMethod === "magiclink" ? "text-rose-400 font-bold" : ""}`}
                  >
                    Magic Link
                  </button>
                </div>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300 font-sans">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@gstu.ac.bd"
                  className="w-full rounded-xl border border-rose-950/70 bg-[#060204] pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder:text-slate-600 focus:border-rose-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Password Field */}
            {authMethod === "password" && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-slate-300 font-sans">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotEmail(email);
                      setForgotError(null);
                      setForgotSuccess(null);
                      setShowForgotPassword(true);
                    }}
                    className="text-[11px] text-rose-400 hover:text-rose-300 hover:underline font-semibold font-sans transition-colors cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-rose-950/70 bg-[#060204] pl-10 pr-10 py-2.5 text-xs sm:text-sm text-slate-100 placeholder:text-slate-600 focus:border-rose-500 focus:outline-none transition-colors"
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
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 px-5 py-3 text-xs sm:text-sm font-bold text-white shadow-lg shadow-rose-600/30 hover:brightness-110 transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignUp} className="space-y-3.5">
            {/* Full Name */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-300 font-sans">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Mushfiqur Rahman"
                  className="w-full rounded-xl border border-rose-950/70 bg-[#060204] pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder:text-slate-600 focus:border-rose-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-300 font-sans">
                Institutional / University Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@gstu.ac.bd"
                  className="w-full rounded-xl border border-rose-950/70 bg-[#060204] pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder:text-slate-600 focus:border-rose-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Department & Student ID Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-300 font-sans">
                  Department
                </label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-3 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="CSE"
                    className="w-full rounded-xl border border-rose-950/70 bg-[#060204] pl-9 pr-3 py-2.5 text-xs text-slate-100 focus:border-rose-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-300 font-sans">
                  Student/Roll ID
                </label>
                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="e.g. 2021001"
                  className="w-full rounded-xl border border-rose-950/70 bg-[#060204] px-3.5 py-2.5 text-xs text-slate-100 focus:border-rose-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-300 font-sans">
                Create Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full rounded-xl border border-rose-950/70 bg-[#060204] pl-10 pr-10 py-2.5 text-xs sm:text-sm text-slate-100 placeholder:text-slate-600 focus:border-rose-500 focus:outline-none transition-colors"
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

            {/* Submit Request Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 px-5 py-3 text-xs sm:text-sm font-bold text-white shadow-lg shadow-rose-600/30 hover:brightness-110 transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer pt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Submitting Request...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Submit Beta Request</span>
                </>
              )}
            </button>
          </form>
        )}
          </>
        )}
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
          <div
            className="relative w-full max-w-md rounded-2xl border border-rose-500/30 bg-[#0c050b]/98 p-6 sm:p-7 text-white shadow-2xl shadow-rose-950/50 backdrop-blur-2xl space-y-5 animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => {
                setShowForgotPassword(false);
                setForgotError(null);
                setForgotSuccess(null);
              }}
              className="absolute right-4 top-4 p-1.5 rounded-xl bg-secondary/60 text-slate-400 hover:text-white hover:bg-secondary transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Header */}
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-rose-500/30 bg-rose-500/10 text-rose-300 font-mono text-[11px] font-semibold">
                <KeyRound className="h-3 w-3 text-rose-400" />
                <span>Account Recovery</span>
              </div>
              <h2 className="text-xl font-bold text-white font-sans">
                Forgot Your Password?
              </h2>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                Enter your registered student email address. We will send you a secure link to set a new password.
              </p>
            </div>

            {/* Error Alert */}
            {forgotError && (
              <div className="p-3 rounded-xl border border-rose-500/50 bg-rose-500/15 text-rose-200 text-xs flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                <p className="leading-relaxed">{forgotError}</p>
              </div>
            )}

            {/* Success Alert */}
            {forgotSuccess ? (
              <div className="space-y-4 py-2 text-center animate-in fade-in">
                <div className="p-4 rounded-xl border border-emerald-500/50 bg-emerald-500/15 text-emerald-200 text-xs flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="leading-relaxed text-left">{forgotSuccess}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setForgotSuccess(null);
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-rose-600/30 hover:brightness-110 transition-all cursor-pointer"
                >
                  <span>Back to Sign In</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300 font-sans">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="student@gstu.ac.bd"
                      className="w-full rounded-xl border border-rose-950/70 bg-[#060204] pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder:text-slate-600 focus:border-rose-500 focus:outline-none transition-colors font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-rose-600/30 hover:brightness-110 transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                >
                  {forgotLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Sending Recovery Link...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Password Reset Email</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Footer Navigation */}
      <div className="flex items-center justify-between px-2 text-xs font-sans text-slate-400">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
        >
          <Home className="h-3.5 w-3.5" />
          <span>Back to AlgoHub</span>
        </Link>
        <span className="flex items-center gap-1 text-slate-400">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          <span>Departmental RLS Protected</span>
        </span>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="relative min-h-screen bg-[#060305] flex items-center justify-center p-4 sm:p-6 antialiased selection:bg-rose-500/30 selection:text-rose-200">
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <Suspense
        fallback={
          <div className="flex items-center justify-center p-12 text-slate-400 text-xs">
            <Loader2 className="h-6 w-6 animate-spin text-rose-500 mr-2" />
            Loading authentication portal...
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
