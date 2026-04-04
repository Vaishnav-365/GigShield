"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, Eye, EyeOff, Plus, X, ChevronRight } from "lucide-react";
import { authApi, RegisterPayload } from "@/lib/api";
import { saveToken } from "@/lib/auth";

const ZONES = ["Zone A", "Zone B", "Zone C", "Zone D", "Zone E"];
const PLATFORMS = ["Swiggy", "Zomato", "Blinkit", "BigBasket", "Zepto", "Dunzo", "Other"];

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<RegisterPayload>({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    work_zones: [],
    shift_start_hour: 18,
    shift_end_hour: 22,
    avg_weekly_hours: 30,
    avg_hourly_earnings: 120,
    platform: "",
  });

  const set = (k: keyof RegisterPayload, v: unknown) =>
    setForm((f) => ({ ...f, [k]: v }));

  const toggleZone = (z: string) => {
    set(
      "work_zones",
      form.work_zones.includes(z)
        ? form.work_zones.filter((x) => x !== z)
        : [...form.work_zones, z]
    );
  };

  const hourLabel = (h: number) => {
    const suffix = h < 12 ? "AM" : "PM";
    const display = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${display}:00 ${suffix}`;
  };

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await authApi.register(form);
      saveToken(res.access_token);
      router.push("/plans");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const step1Valid =
    form.full_name.trim() &&
    form.email.includes("@") &&
    form.phone.length >= 10 &&
    form.password.length >= 6;

  const step2Valid = form.work_zones.length > 0 && form.platform;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 h-[400px] w-[400px] bg-sky-600/8 blur-[100px] rounded-full" />
      </div>

      <div className="relative w-full max-w-md animate-slide-up">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500 shadow-lg shadow-sky-500/30 mb-4">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <h1 className="font-display text-3xl font-bold text-white">Create Account</h1>
          <p className="mt-2 text-slate-400">Start protecting your income in minutes</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div
                className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                  s <= step ? "bg-sky-500" : "bg-slate-800"
                }`}
              />
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-500 text-center mb-6">
          Step {step} of 3 —{" "}
          {step === 1
            ? "Basic Info"
            : step === 2
            ? "Work Profile"
            : "Earnings & Hours"}
        </p>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Name</label>
                <input
                  value={form.full_name}
                  onChange={(e) => set("full_name", e.target.value)}
                  placeholder="Arjun Kumar"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder:text-slate-500 focus:border-sky-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  placeholder="arjun@email.com"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder:text-slate-500 focus:border-sky-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Phone Number</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  placeholder="+91 9876543210"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder:text-slate-500 focus:border-sky-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => set("password", e.target.value)}
                    placeholder="Min 6 characters"
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
            </div>
          )}

          {/* Step 2: Work Profile */}
          {step === 2 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Delivery Platform</label>
                <div className="grid grid-cols-2 gap-2">
                  {PLATFORMS.map((p) => (
                    <button
                      key={p}
                      onClick={() => set("platform", p)}
                      className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition-all ${
                        form.platform === p
                          ? "border-sky-500 bg-sky-500/10 text-sky-400"
                          : "border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Work Zones{" "}
                  <span className="text-slate-500 font-normal">(select all that apply)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {ZONES.map((z) => (
                    <button
                      key={z}
                      onClick={() => toggleZone(z)}
                      className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-all ${
                        form.work_zones.includes(z)
                          ? "border-sky-500 bg-sky-500/10 text-sky-400"
                          : "border-slate-700 text-slate-400 hover:border-slate-500"
                      }`}
                    >
                      {form.work_zones.includes(z) ? (
                        <X className="h-3 w-3" />
                      ) : (
                        <Plus className="h-3 w-3" />
                      )}
                      {z}
                    </button>
                  ))}
                </div>
                {form.work_zones.length > 0 && (
                  <p className="mt-2 text-xs text-sky-400">
                    Selected: {form.work_zones.join(", ")}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Earnings & Hours */}
          {step === 3 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Shift Start — <span className="text-sky-400">{hourLabel(form.shift_start_hour)}</span>
                </label>
                <input
                  type="range"
                  min={0}
                  max={23}
                  value={form.shift_start_hour}
                  onChange={(e) => set("shift_start_hour", Number(e.target.value))}
                  className="w-full accent-sky-500"
                />
                <div className="flex justify-between text-xs text-slate-600 mt-1">
                  <span>12 AM</span><span>12 PM</span><span>11 PM</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Shift End — <span className="text-sky-400">{hourLabel(form.shift_end_hour)}</span>
                </label>
                <input
                  type="range"
                  min={0}
                  max={23}
                  value={form.shift_end_hour}
                  onChange={(e) => set("shift_end_hour", Number(e.target.value))}
                  className="w-full accent-sky-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Avg Weekly Hours —{" "}
                  <span className="text-sky-400">{form.avg_weekly_hours}h</span>
                </label>
                <input
                  type="range"
                  min={5}
                  max={70}
                  value={form.avg_weekly_hours}
                  onChange={(e) => set("avg_weekly_hours", Number(e.target.value))}
                  className="w-full accent-sky-500"
                />
                <div className="flex justify-between text-xs text-slate-600 mt-1">
                  <span>5h</span><span>35h</span><span>70h</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Avg Hourly Earnings (₹)
                </label>
                <input
                  type="number"
                  value={form.avg_hourly_earnings}
                  onChange={(e) => set("avg_hourly_earnings", Number(e.target.value))}
                  min={50}
                  max={500}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white focus:border-sky-500 transition-colors"
                />
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-400">
              {error}
            </div>
          )}

          {/* Navigation */}
          <div className="mt-6 flex gap-3">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="flex-1 rounded-xl border border-slate-700 py-3 text-sm font-medium text-slate-300 hover:border-slate-500 hover:text-white transition-all"
              >
                Back
              </button>
            )}
            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={step === 1 ? !step1Valid : !step2Valid}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-sky-500 py-3 text-sm font-semibold text-white hover:bg-sky-400 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-sky-500/20"
              >
                Continue <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 rounded-xl bg-sky-500 py-3 text-sm font-semibold text-white hover:bg-sky-400 transition-all disabled:opacity-60 shadow-lg shadow-sky-500/20"
              >
                {loading ? "Creating account…" : "Create Account & Continue"}
              </button>
            )}
          </div>
        </div>

        <p className="mt-5 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link href="/login" className="text-sky-400 hover:text-sky-300 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
