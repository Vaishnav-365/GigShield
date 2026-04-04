"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Info, Zap } from "lucide-react";
import { isLoggedIn, getCurrentUser } from "@/lib/auth";
import {
  Plan, PremiumCalculation, Policy,
  premiumApi, MOCK_PLANS, MOCK_PREMIUM,
} from "@/lib/api";
import { UserProfile } from "@/lib/api";
import PlanCard from "@/components/PlanCard";

function PremiumBreakdown({ calc }: { calc: PremiumCalculation }) {
  const rows = [
    { label: "Base Premium", value: calc.base_premium, sign: "+" },
    { label: "Zone Risk Load", value: calc.zone_risk_load, sign: "+" },
    { label: "Shift Risk Load", value: calc.shift_risk_load, sign: "+" },
    { label: "Coverage Multiplier", value: calc.coverage_multiplier, sign: "+" },
    { label: "Safe Profile Discount", value: calc.safe_profile_discount, sign: "−" },
  ];
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Info className="h-4 w-4 text-sky-400" />
        <h3 className="font-semibold text-white">Your Personalised Premium Breakdown</h3>
      </div>
      <div className="space-y-2">
        {rows.map(({ label, value, sign }) => (
          <div key={label} className="flex items-center justify-between text-sm">
            <span className="text-slate-400">{label}</span>
            <span className={sign === "−" ? "text-emerald-400" : "text-slate-300"}>
              {sign} ₹{value}
            </span>
          </div>
        ))}
        <div className="border-t border-slate-800 pt-2 mt-2 flex items-center justify-between">
          <span className="font-bold text-white">Weekly Premium (Smart)</span>
          <span className="font-display text-xl font-bold text-sky-400">₹{calc.weekly_premium}</span>
        </div>
      </div>
      <p className="mt-3 text-xs text-slate-500">
        Recommended plan:{" "}
        <span className="text-sky-400 font-medium capitalize">{calc.recommended_plan}</span>
      </p>
    </div>
  );
}

export default function PlansPage() {
  const router = useRouter();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [premium, setPremium] = useState<PremiumCalculation | null>(null);
  const [currentPolicy, setCurrentPolicy] = useState<Policy | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activating, setActivating] = useState<string | null>(null);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!isLoggedIn()) { router.push("/login"); return; }
    Promise.all([
      getCurrentUser(),
      premiumApi.plans().catch(() => MOCK_PLANS),
      premiumApi.myPolicy().catch(() => null),
    ]).then(([u, p, pol]) => {
      setUser(u);
      setPlans(p);
      setCurrentPolicy(pol);
      if (u) {
        premiumApi.calculate(u.id).catch(() => MOCK_PREMIUM).then(setPremium);
      } else {
        setPremium(MOCK_PREMIUM);
      }
    }).finally(() => setLoading(false));
  }, []);

  const handleActivate = async (planId: string) => {
    setActivating(planId);
    try {
      const pol = await premiumApi.activatePolicy(planId);
      setCurrentPolicy(pol);
      setSuccess(`${planId.charAt(0).toUpperCase() + planId.slice(1)} plan activated! You're covered this week.`);
    } catch {
      // Simulate success for demo
      setCurrentPolicy({
        id: 1,
        worker_id: user?.id || 1,
        plan: planId,
        status: "active",
        zone: user?.work_zones?.[0] || "Zone A",
        activated_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 7 * 86400000).toISOString(),
      });
      setSuccess(`${planId.charAt(0).toUpperCase() + planId.slice(1)} plan activated! You're covered this week.`);
    } finally {
      setActivating(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-8 w-8 rounded-full border-2 border-sky-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 animate-fade-in">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-4 py-1.5 text-sm text-sky-400 mb-4">
          <Zap className="h-3.5 w-3.5" />
          Weekly Income Protection
        </div>
        <h1 className="font-display text-4xl font-bold text-white">Choose Your Plan</h1>
        <p className="mt-3 text-slate-400 max-w-md mx-auto">
          Each plan covers a full week. Auto-renew or change anytime. Claims are processed automatically.
        </p>
      </div>

      {success && (
        <div className="mb-6 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-4 flex items-center gap-3">
          <Zap className="h-5 w-5 text-emerald-400 flex-shrink-0" />
          <p className="text-sm font-medium text-emerald-400">{success}</p>
        </div>
      )}

      {premium && <PremiumBreakdown calc={premium} />}

      <div className="grid sm:grid-cols-3 gap-5">
        {(plans.length > 0 ? plans : MOCK_PLANS).map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            recommended={plan.id === (premium?.recommended_plan || "smart")}
            currentPlan={currentPolicy?.plan?.toLowerCase()}
            onActivate={handleActivate}
            loading={activating === plan.id}
          />
        ))}
      </div>

      <p className="mt-8 text-center text-sm text-slate-500">
        All plans auto-expire after 7 days. No hidden fees. Payouts are in ₹ to your registered account.
      </p>
    </div>
  );
}
