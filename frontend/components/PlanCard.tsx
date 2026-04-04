"use client";

import { Check, Star, Zap } from "lucide-react";
import { Plan } from "@/lib/api";

interface Props {
  plan: Plan;
  recommended?: boolean;
  currentPlan?: string;
  onActivate?: (planId: string) => void;
  loading?: boolean;
}

const PLAN_STYLES: Record<string, { accent: string; ring: string; badge: string; glow: string }> = {
  lite: {
    accent: "text-slate-300",
    ring: "border-slate-700 hover:border-slate-500",
    badge: "bg-slate-700 text-slate-300",
    glow: "",
  },
  smart: {
    accent: "text-sky-400",
    ring: "border-sky-500/40 hover:border-sky-500",
    badge: "bg-sky-500/20 text-sky-400 border border-sky-500/30",
    glow: "shadow-sky-500/10 shadow-2xl",
  },
  pro: {
    accent: "text-amber-400",
    ring: "border-amber-500/40 hover:border-amber-500",
    badge: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
    glow: "",
  },
};

export default function PlanCard({ plan, recommended, currentPlan, onActivate, loading }: Props) {
  const s = PLAN_STYLES[plan.name.toLowerCase()] || PLAN_STYLES.lite;
  const isActive = currentPlan === plan.name.toLowerCase();

  return (
    <div
      className={`relative flex flex-col rounded-2xl border bg-slate-900 p-6 transition-all duration-200 ${s.ring} ${s.glow}`}
    >
      {recommended && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${s.badge}`}>
            <Star className="h-3 w-3 fill-current" /> Recommended
          </span>
        </div>
      )}

      <div className="mb-4">
        <h3 className={`font-display text-xl font-bold capitalize ${s.accent}`}>{plan.name}</h3>
        <p className="mt-1 text-sm text-slate-400">{plan.description}</p>
      </div>

      <div className="mb-6">
        <div className="flex items-baseline gap-1">
          <span className="font-display text-4xl font-bold text-white">₹{plan.weekly_premium}</span>
          <span className="text-slate-400 text-sm">/week</span>
        </div>
        <div className="mt-2 flex gap-4 text-sm text-slate-400">
          <span>
            <span className="text-white font-medium">{plan.protected_hours}h</span> protected
          </span>
          <span>
            Up to <span className="text-white font-medium">₹{plan.max_payout?.toLocaleString()}</span> payout
          </span>
        </div>
      </div>

      <ul className="mb-6 space-y-2 flex-1">
        {plan.covered_triggers.map((trigger) => (
          <li key={trigger} className="flex items-center gap-2 text-sm text-slate-300">
            <Check className={`h-4 w-4 flex-shrink-0 ${s.accent}`} />
            {trigger}
          </li>
        ))}
      </ul>

      {isActive ? (
        <div className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 py-3 text-sm font-semibold text-emerald-400">
          <Zap className="h-4 w-4" />
          Currently Active
        </div>
      ) : (
        <button
          onClick={() => onActivate?.(plan.name.toLowerCase())}
          disabled={loading}
          className={`w-full rounded-xl py-3 text-sm font-semibold transition-all ${
            recommended
              ? "bg-sky-500 text-white hover:bg-sky-400 shadow-lg shadow-sky-500/20 disabled:opacity-60"
              : "border border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white disabled:opacity-60"
          }`}
        >
          {loading ? "Activating…" : `Activate ${plan.name}`}
        </button>
      )}
    </div>
  );
}
