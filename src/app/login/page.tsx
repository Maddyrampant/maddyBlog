"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useTranslation, useI18n } from "@/i18n/provider";

export default function LoginPage() {
  const router = useRouter();
  const t = useTranslation();
  const { dir } = useI18n();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || data.message || "Invalid credentials");
      }
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally { setLoading(false); }
  }, [email, password, router]);

  return (
    <div className="min-h-screen flex admin-body" dir={dir}>
      <div className="hidden lg:flex lg:w-1/2 gradient-primary items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 text-white max-w-md">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center mb-6">
            <span className="text-2xl font-bold">M</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">{t("app.name")}</h1>
          <p className="text-lg text-white/80 leading-relaxed">
            Manage your blog, create content, and engage with your audience. Everything you need in one place.
          </p>
          <div className="mt-8 flex items-center gap-4 text-sm text-white/60">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-white/20 border-2 border-white/10" />
              ))}
            </div>
            <span>Trusted by creators worldwide</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8 lg:hidden">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center text-white font-bold text-lg mx-auto mb-3">M</div>
            <h1 className="text-2xl font-bold">{t("app.name")}</h1>
            <p className="text-sm text-zinc-500 mt-1">{t("app.tagline")}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="text-center hidden lg:block mb-6">
              <h1 className="text-2xl font-bold">{t("app.name")}</h1>
              <p className="text-sm text-zinc-500 mt-1">Sign in to your admin account</p>
            </div>

            {error && (
              <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 rounded-lg px-4 py-3 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1.5">Email or Username</label>
              <input id="email" type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@maddyblog.com" autoComplete="username" className="admin-input" required />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1.5">Password</label>
              <div className="relative">
                <input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" autoComplete="current-password" className="admin-input pr-10" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <div className="text-right mt-1">
                <Link href="/forgot-password" className="text-xs text-theme-primary hover:underline">Forgot password?</Link>
              </div>
            </div>

            <button type="submit" disabled={loading} className="admin-btn admin-btn-primary w-full justify-center py-2.5">
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  Signing in...
                </div>
              ) : (
                <div className="flex items-center gap-2"><LogIn size={16} /> Sign in</div>
              )}
            </button>

            <p className="text-center text-sm text-zinc-500">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="font-medium text-theme-primary hover:underline">Register</Link>
            </p>
          </form>

          <p className="text-center mt-6">
            <Link href="/" className="text-sm text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
              &larr; {t("common.backToHome")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
