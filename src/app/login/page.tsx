"use client";

// =============================================================================
// Login Page — Google OAuth + Email Magic Link
// Uses Supabase auth for both sign-in methods
// =============================================================================

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  // Track form state: idle, loading, magic-link-sent, or error
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "magic-link-sent" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // --- Google OAuth sign-in ---
  const handleGoogleLogin = async () => {
    setStatus("loading");
    setErrorMessage("");

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });

      // If signInWithOAuth returns an error (rare — usually redirects)
      if (error) {
        setErrorMessage(error.message);
        setStatus("error");
      }
    } catch (err) {
      setErrorMessage("Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  // --- Email magic link sign-in ---
  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    // Basic email validation
    if (!email || !email.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      setStatus("error");
      return;
    }

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });

      if (error) {
        setErrorMessage(error.message);
        setStatus("error");
      } else {
        // Success — tell user to check their inbox
        setStatus("magic-link-sent");
      }
    } catch (err) {
      setErrorMessage("Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  return (
    <main className="section-light min-h-screen pt-24">
      <div className="container-narrow flex items-center justify-center py-16 md:py-24">
        {/* Card container — centered, max width for a clean login form */}
        <div className="card w-full max-w-md p-10 md:p-14">

          {/* ── Header ── */}
          <div className="text-center mb-10">
            <p className="heading-label mb-3">Your Account</p>
            <h1 className="heading-section text-3xl md:text-4xl text-primary">
              Sign In
            </h1>
            <div className="section-divider" />
          </div>

          {/* ── Success state: magic link sent ── */}
          {status === "magic-link-sent" ? (
            <div className="text-center py-8">
              {/* Checkmark icon */}
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center border border-accent/30 bg-accent/10">
                <svg
                  className="h-8 w-8 text-accent"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>
              <h2 className="heading-section text-xl text-primary mb-3">
                Check Your Email
              </h2>
              <p className="font-body text-sm text-muted leading-relaxed mb-6">
                We sent a login link to <strong className="text-primary">{email}</strong>.
                <br />Click the link in your inbox to sign in.
              </p>
              {/* Let user try again if they didn't get the email */}
              <button
                onClick={() => {
                  setStatus("idle");
                  setEmail("");
                }}
                className="font-body text-xs font-medium tracking-[0.15em] uppercase text-accent hover:text-primary transition-colors duration-300"
              >
                Try a different email
              </button>
            </div>
          ) : (
            <>
              {/* ── Error message ── */}
              {status === "error" && errorMessage && (
                <div className="mb-6 border border-red-200 bg-red-50 px-4 py-3">
                  <p className="font-body text-sm text-red-700">{errorMessage}</p>
                </div>
              )}

              {/* ── Google sign-in button ── */}
              <button
                onClick={handleGoogleLogin}
                disabled={status === "loading"}
                className="w-full inline-flex items-center justify-center gap-3 px-6 py-4
                           font-body text-sm font-medium tracking-[0.1em]
                           bg-white text-primary border border-black/10
                           transition-all duration-300 ease-in-out
                           hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:-translate-y-[1px]
                           disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {/* Google "G" logo */}
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continue with Google
              </button>

              {/* ── "or" divider ── */}
              <div className="flex items-center gap-4 my-8">
                <div className="flex-1 h-[1px] bg-black/10" />
                <span className="font-body text-xs font-medium tracking-[0.15em] uppercase text-muted">
                  or
                </span>
                <div className="flex-1 h-[1px] bg-black/10" />
              </div>

              {/* ── Magic link email form ── */}
              <form onSubmit={handleMagicLink} className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block font-body text-xs font-medium tracking-[0.1em] uppercase text-muted mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    disabled={status === "loading"}
                    className="w-full disabled:opacity-50"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary disabled:hover:text-white"
                >
                  {status === "loading" ? (
                    <span className="flex items-center gap-2">
                      {/* Simple loading spinner */}
                      <svg
                        className="h-4 w-4 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    "Send Magic Link"
                  )}
                </button>
              </form>

              {/* ── Helper text ── */}
              <p className="font-body text-xs text-muted text-center mt-6 leading-relaxed">
                No password needed — we&apos;ll email you a secure login link.
              </p>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
