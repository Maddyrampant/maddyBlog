"use client";

import { useState, useCallback, use } from "react";
import Link from "next/link";
import { Eye, EyeOff, KeyRound, CheckCircle } from "lucide-react";

export default function ResetPasswordPage(props: { searchParams: Promise<{ token?: string }> }) {
  const searchParams = use(props.searchParams);
  const token = searchParams.token;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!password || !confirmPassword) { setError("Please fill in all fields."); return; }
    if (password !== confirmPassword) { setError("Passwords do not match."); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Reset failed");
      }
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally { setLoading(false); }
  }, [token, password, confirmPassword]);

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 admin-body">
        <div className="w-full max-w-sm text-center">
          <h1 className="text-2xl font-bold mb-2">Invalid link</h1>
          <p className="text-sm text-zinc-500 mb-6">This password reset link is invalid or has expired.</p>
          <Link href="/forgot-password" className="text-sm text-theme-primary hover:underline">Request a new link</Link>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 admin-body">
        <div className="w-full max-w-sm text-center">
          <div className="w-14 h-14 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="text-green-600 dark:text-green-400" size={28} />
          </div>
          <h1 className="text-2xl font-bold mb-2">Password reset</h1>
          <p className="text-sm text-zinc-500 mb-6">Your password has been updated successfully.</p>
          <Link href="/login" className="admin-btn admin-btn-primary inline-flex items-center gap-2 px-6 py-2.5">
            <KeyRound size={16} /> Sign in with new password
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 admin-body">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center text-white font-bold text-lg mx-auto mb-3">M</div>
          <h1 className="text-2xl font-bold">Set new password</h1>
          <p className="text-sm text-zinc-500 mt-1">Enter your new password below.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 rounded-lg px-4 py-3">{error}</div>
          )}

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1.5">New Password</label>
            <div className="relative">
              <input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" autoComplete="new-password" className="admin-input pr-10" required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1.5">Confirm Password</label>
            <input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repeat your password" autoComplete="new-password" className="admin-input" required />
          </div>

          <button type="submit" disabled={loading} className="admin-btn admin-btn-primary w-full justify-center py-2.5">
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                Resetting...
              </div>
            ) : (
              <div className="flex items-center gap-2"><KeyRound size={16} /> Reset password</div>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
