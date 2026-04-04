"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, Eye, EyeOff } from "lucide-react";
import { authApi } from "@/lib/api";
import { saveToken } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await authApi.login({ email, password });
      saveToken(res.access_token);
      router.push("/dashboard");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute bottom-0 left-1/4 h-[400px] w-[400px] bg-sky-600/8 blur-[100px] rounded-full" />
      </div>

      <div className="relative w-full max-w-sm animate-slide-up">
        <div className="mb-8 text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500 shadow-lg shadow-sky-500/30 mb-4">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <h1 className="font-display text-3xl font-bold text-white">Welcome back</h1>
          <p className="mt-2 text-slate-400">Sign in to your GigShield account</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKey}
              placeholder="you@email.com"
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder:text-slate-500 focus:border-sky-500 transition-colors"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium text-slate-300">Password</label>
            </div>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Your password"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 pr-11 text-white placeholder:text-slate-500 focus:border-sky-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-400">
              {error}
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={loading || !email || !password}
            className="w-full rounded-xl bg-sky-500 py-3 text-sm font-semibold text-white hover:bg-sky-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-sky-500/20 mt-2"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>

          {/* Demo shortcut for hackathon judges */}
          <div className="border-t border-slate-800 pt-4">
            <p className="text-xs text-slate-500 text-center mb-2">Quick demo access</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => { setEmail("worker@demo.com"); setPassword("demo123"); }}
                className="rounded-lg border border-slate-700 py-2 text-xs text-slate-400 hover:text-white hover:border-slate-500 transition-colors"
              >
                Worker Demo
              </button>
              <button
                onClick={() => { setEmail("admin@demo.com"); setPassword("demo123"); }}
                className="rounded-lg border border-slate-700 py-2 text-xs text-slate-400 hover:text-white hover:border-slate-500 transition-colors"
              >
                Admin Demo
              </button>
            </div>
          </div>
        </div>

        <p className="mt-5 text-center text-sm text-slate-500">
          New to GigShield?{" "}
          <Link href="/register" className="text-sky-400 hover:text-sky-300 font-medium">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
