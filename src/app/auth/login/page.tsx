"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import {
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
} from "lucide-react";

import { validateGenuineEmail } from "@/lib/validation/emailValidator";

// Reversible Feature Flag: Magic Link is disabled to preserve email quotas
const MAGIC_LINK_ENABLED = false;

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
        fill="#EA4335"
      />
    </svg>
  );
}

function formatAuthErrorMessage(error: any, isSignUp: boolean = false): string {
  if (!error) return "An unexpected error occurred. Please try again.";
  const msg = (error.message || String(error)).toLowerCase();

  if (
    msg.includes("invalid login credentials") ||
    msg.includes("invalid_credentials") ||
    msg.includes("invalid username or password")
  ) {
    return "Invalid email or password. Please check your credentials and try again.";
  }
  if (
    msg.includes("user already registered") ||
    msg.includes("already registered") ||
    msg.includes("already exists")
  ) {
    return "An account with this email address already exists. Please switch to Sign In.";
  }
  if (msg.includes("email not confirmed")) {
    return "Please confirm your email address via the link sent to your inbox, or continue with Google.";
  }
  if (msg.includes("password should be at least") || msg.includes("password is too short")) {
    return "Password must be at least 6 characters long.";
  }
  if (msg.includes("rate limit") || msg.includes("over_email_send_rate_limit")) {
    return "Too many attempts in a short time. Please wait a minute and try again.";
  }
  if (msg.includes("database error") || msg.includes("saving new user")) {
    return isSignUp
      ? "Unable to create account right now. Please try again or use Continue with Google."
      : "Database connection issue. Please try again shortly.";
  }
  if (msg.includes("invalid email") || msg.includes("unable to validate email")) {
    return "Please enter a valid email address.";
  }

  return error.message || "Authentication failed. Please verify your credentials.";
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextRoute = searchParams.get("next") || "/";
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
  const [department, setDepartment] = useState("");
  const [studentId, setStudentId] = useState("");

  // State
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(
    urlError === "auth_callback_failed" ? "Authentication link expired or invalid. Please try again." : null
  );
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const supabase = createClient();

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextRoute)}`,
          queryParams: {
            access_type: "offline",
            prompt: "select_account",
          },
        },
      });

      if (error) throw error;
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to initiate Google Sign-In. Please try again.");
      setIsGoogleLoading(false);
    }
  };

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

        // Check user role and account status
        if (data.user) {
          const { data: userProfile } = await (supabase.from("profiles") as any)
            .select("role")
            .eq("id", data.user.id)
            .single();

          // Admin users go straight to Admin Panel
          if (userProfile?.role === "admin") {
            router.push("/admin/moderation");
            router.refresh();
            return;
          }

          // Check if user is suspended
          const { data: betaAccess } = await (supabase.from("beta_access") as any)
            .select("status")
            .eq("user_id", data.user.id)
            .maybeSingle();

          if (betaAccess?.status === "suspended") {
            router.push("/auth/suspended");
            return;
          }

          // Users enter the platform immediately
          router.push(nextRoute);
          router.refresh();
        }
      }
    } catch (err: any) {
      setErrorMsg(formatAuthErrorMessage(err, false));
    } finally {
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
      setErrorMsg(validation.error || "Please enter a valid personal or work email.");
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
            department: department.trim() || "General",
            student_id: studentId.trim() || "",
          },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextRoute)}`,
        },
      });

      if (error) throw error;

      if (data.user) {
        // If user already exists without error or if confirmation sent
        if (data.user.identities && data.user.identities.length === 0) {
          setErrorMsg("An account with this email address already exists. Please switch to Sign In.");
        } else {
          setEmailVerificationSent(cleanEmail);
        }
      }
    } catch (err: any) {
      setErrorMsg(formatAuthErrorMessage(err, true));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6 relative z-10">
      {/* Header Badge & Title */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/40 bg-card text-primary text-xs font-sans font-semibold uppercase tracking-wider backdrop-blur-md shadow-sm">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span>Interactive Algorithm Learning Platform</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground leading-[1.2] font-heading">
          {mode === "signin" ? (
            <>
              Sign In to{" "}
              <span className="italic font-semibold text-[#B08422] dark:text-[#D4B872]">
                AlgoHub.
              </span>
            </>
          ) : (
            <>
              Join the{" "}
              <span className="italic font-semibold text-[#B08422] dark:text-[#D4B872]">
                Learning Community.
              </span>
            </>
          )}
        </h1>

        <p className="text-xs sm:text-sm text-muted-foreground font-sans font-medium max-w-sm mx-auto leading-relaxed">
          {mode === "signin"
            ? "Enter your credentials or continue with Google to access interactive algorithm studios & learning modules."
            : "Create your account to start visualizing, debugging, and mastering algorithms."}
        </p>
      </div>

      {/* Main Glassmorphic Auth Card */}
      <div className="rounded-2xl border border-border bg-card/90 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-5 corner-flourish transition-all">
        {emailVerificationSent ? (
          <div className="text-center py-4 space-y-5 animate-in fade-in zoom-in-95">
            <div className="h-16 w-16 mx-auto rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center shadow-brass text-primary">
              <Mail className="h-8 w-8 text-primary" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-foreground font-heading">
                Verify Your Email Address
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground font-sans leading-relaxed max-w-sm mx-auto">
                We sent a secure verification link to:
              </p>
              <div className="inline-block px-3.5 py-1.5 rounded-lg bg-primary/10 border border-primary/30 text-primary font-mono text-xs font-bold">
                {emailVerificationSent}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-secondary/50 border border-border text-left text-xs text-muted-foreground space-y-2 font-sans">
              <div className="font-semibold text-foreground flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                <span>Next Steps:</span>
              </div>
              <ol className="list-decimal list-inside space-y-1 text-muted-foreground font-sans">
                <li>Open your email inbox (and check spam if needed).</li>
                <li>Click the confirmation link to verify your identity.</li>
                <li>You will be automatically logged in and ready to learn!</li>
              </ol>
            </div>

            <button
              onClick={() => {
                setEmailVerificationSent(null);
                setMode("signin");
                setEmail(emailVerificationSent);
              }}
              className="btn-brass w-full inline-flex items-center justify-center gap-2 rounded px-7 py-3 text-xs sm:text-sm font-sans font-semibold tracking-[0.08em] shadow-brass hover:scale-[1.01] active:scale-[0.98] transition-all text-primary-foreground cursor-pointer"
            >
              <span>Already Verified? Go to Sign In</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <>
            {/* Mode Switcher Tabs */}
            <div className="grid grid-cols-2 gap-1 p-1 rounded-lg bg-secondary/60 border border-border font-sans text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  setMode("signin");
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className={`py-2 rounded transition-all cursor-pointer tracking-wide ${
                  mode === "signin"
                    ? "bg-card text-primary border border-primary/40 shadow-sm font-bold"
                    : "text-muted-foreground hover:text-foreground hover:bg-card/50"
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
                className={`py-2 rounded transition-all cursor-pointer tracking-wide ${
                  mode === "signup"
                    ? "bg-card text-primary border border-primary/40 shadow-sm font-bold"
                    : "text-muted-foreground hover:text-foreground hover:bg-card/50"
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Error Alert Banner */}
            {errorMsg && (
              <div className="p-3.5 rounded-lg border border-destructive/50 bg-destructive/10 text-destructive text-xs flex items-start gap-2.5 animate-in fade-in">
                <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                <p className="leading-relaxed font-sans">{errorMsg}</p>
              </div>
            )}

            {/* Success Alert Banner */}
            {successMsg && (
              <div className="p-3.5 rounded-lg border border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs flex items-start gap-2.5 animate-in fade-in">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <p className="leading-relaxed font-sans">{successMsg}</p>
              </div>
            )}

            {/* Continue with Google OAuth Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading || isLoading}
              className="w-full inline-flex items-center justify-center gap-3 py-2.5 px-4 rounded-lg border border-border bg-background/90 hover:bg-secondary/70 text-foreground text-xs sm:text-sm font-sans font-semibold tracking-wide shadow-sm hover:border-primary/50 transition-all cursor-pointer disabled:opacity-50 active:scale-[0.99]"
            >
              {isGoogleLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span>Connecting to Google...</span>
                </>
              ) : (
                <>
                  <GoogleIcon />
                  <span>Continue with Google</span>
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative flex items-center justify-center py-1">
              <div className="w-full border-t border-border" />
              <span className="absolute bg-card px-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider font-mono">
                or with email
              </span>
            </div>

            {/* Form Elements */}
            {mode === "signin" ? (
              <form onSubmit={handleSignIn} className="space-y-4">
                {/* Auth Method Toggle (Only shown if MAGIC_LINK_ENABLED is true) */}
                {MAGIC_LINK_ENABLED && (
                  <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground px-1">
                    <span>Sign-in method:</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setAuthMethod("password")}
                        className={`hover:underline ${authMethod === "password" ? "text-primary font-bold" : ""}`}
                      >
                        Password
                      </button>
                      <span>•</span>
                      <button
                        type="button"
                        onClick={() => setAuthMethod("magiclink")}
                        className={`hover:underline ${authMethod === "magiclink" ? "text-primary font-bold" : ""}`}
                      >
                        Magic Link
                      </button>
                    </div>
                  </div>
                )}

                {/* Email Field */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-foreground font-sans">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full rounded border border-border bg-background/80 pl-10 pr-4 py-2.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-colors font-sans"
                    />
                  </div>
                </div>

                {/* Password Field */}
                {authMethod === "password" && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-semibold text-foreground font-sans">
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
                        className="text-[11px] text-primary hover:underline font-semibold font-sans transition-colors cursor-pointer"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
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
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-brass w-full inline-flex items-center justify-center gap-2 rounded px-7 py-3 text-xs sm:text-sm font-sans font-semibold tracking-[0.08em] shadow-brass hover:scale-[1.01] active:scale-[0.98] transition-all text-primary-foreground cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Signing In...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="h-4 w-4 ml-0.5" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleSignUp} className="space-y-3.5">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-foreground font-sans">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your Name"
                      className="w-full rounded border border-border bg-background/80 pl-10 pr-4 py-2.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-colors font-sans"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-foreground font-sans">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full rounded border border-border bg-background/80 pl-10 pr-4 py-2.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-colors font-sans"
                    />
                  </div>
                </div>

                {/* Optional Organization / University & Role Grid */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-foreground font-sans">
                      Institution / Org <span className="text-[10px] text-muted-foreground font-normal">(Optional)</span>
                    </label>
                    <div className="relative">
                      <GraduationCap className="absolute left-3 top-3 h-3.5 w-3.5 text-muted-foreground" />
                      <input
                        type="text"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        placeholder="e.g. University / Company"
                        className="w-full rounded border border-border bg-background/80 pl-9 pr-3 py-2.5 text-xs text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-colors font-sans"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-foreground font-sans">
                      Roll / ID <span className="text-[10px] text-muted-foreground font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      placeholder="e.g. 2024001"
                      className="w-full rounded border border-border bg-background/80 px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-colors font-sans"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-foreground font-sans">
                    Create Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 6 characters"
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

                {/* Submit Request Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-brass w-full inline-flex items-center justify-center gap-2 rounded px-7 py-3 text-xs sm:text-sm font-sans font-semibold tracking-[0.08em] shadow-brass hover:scale-[1.01] active:scale-[0.98] transition-all text-primary-foreground cursor-pointer disabled:opacity-50 pt-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      <span>Create Account</span>
                      <ArrowRight className="h-4 w-4 ml-0.5" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div
            className="relative w-full max-w-md rounded-2xl border border-primary/40 bg-card p-6 sm:p-7 text-foreground shadow-2xl backdrop-blur-2xl space-y-5 corner-flourish animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => {
                setShowForgotPassword(false);
                setForgotError(null);
                setForgotSuccess(null);
              }}
              className="absolute right-4 top-4 p-1.5 rounded-lg bg-secondary/80 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Header */}
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/40 bg-card text-primary font-sans text-xs uppercase tracking-wider font-semibold">
                <KeyRound className="h-3 w-3 text-primary" />
                <span>Account Recovery</span>
              </div>
              <h2 className="text-2xl font-semibold text-foreground font-heading mt-2">
                Forgot Your Password?
              </h2>
              <p className="text-xs text-muted-foreground font-sans leading-relaxed">
                Enter your registered email address. We will send you a secure link to set a new password.
              </p>
            </div>

            {/* Error Alert */}
            {forgotError && (
              <div className="p-3 rounded-lg border border-destructive/50 bg-destructive/10 text-destructive text-xs flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                <p className="leading-relaxed font-sans">{forgotError}</p>
              </div>
            )}

            {/* Success Alert */}
            {forgotSuccess ? (
              <div className="space-y-4 py-2 text-center animate-in fade-in">
                <div className="p-4 rounded-xl border border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <p className="leading-relaxed text-left font-sans">{forgotSuccess}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setForgotSuccess(null);
                  }}
                  className="btn-brass w-full inline-flex items-center justify-center gap-2 rounded px-7 py-2.5 text-xs sm:text-sm font-sans font-semibold tracking-[0.08em] shadow-brass hover:scale-[1.01] active:scale-[0.98] transition-all text-primary-foreground cursor-pointer"
                >
                  <span>Back to Sign In</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-foreground font-sans">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full rounded border border-border bg-background/80 pl-10 pr-4 py-2.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-colors font-sans"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="btn-brass w-full inline-flex items-center justify-center gap-2 rounded px-7 py-2.5 text-xs sm:text-sm font-sans font-semibold tracking-[0.08em] shadow-brass hover:scale-[1.01] active:scale-[0.98] transition-all text-primary-foreground cursor-pointer disabled:opacity-50"
                >
                  {forgotLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Sending Recovery Link...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Password Reset Email</span>
                      <ArrowRight className="h-4 w-4 ml-0.5" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

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
          <span>Enterprise Security & RLS Protected</span>
        </span>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground flex items-center justify-center p-4 sm:p-6 antialiased selection:bg-[#C9A962]/35 selection:text-[#1C1714] transition-colors duration-200 overflow-hidden font-sans">
      {/* Ambient background glow matching landing page atmosphere */}
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
          <div className="flex items-center justify-center p-12 text-muted-foreground text-xs font-sans">
            <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
            Loading authentication portal...
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
