"use client";

import { Shield, TrendingUp, Award } from "lucide-react";
import { GigScore } from "@/lib/api";

const TIER_STYLES: Record<string, { ring: string; glow: string; badge: string; bar: string }> = {
  Platinum: {
    ring: "border-amber-500/40",
    glow: "shadow-amber-500/10 shadow-xl",
    badge: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    bar: "bg-amber-400",
  },
  Gold: {
    ring: "border-yellow-500/40",
    glow: "shadow-yellow-500/10 shadow-xl",
    badge: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    bar: "bg-yellow-400",
  },
  Silver: {
    ring: "border-slate-400/40",
    glow: "",
    badge: "bg-slate-700 text-slate-300 border-slate-600",
    bar: "bg-slate-400",
  },
  Bronze: {
    ring: "border-orange-500/40",
    glow: "",
    badge: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    bar: "bg-orange-400",
  },
};

export default function GigScoreCard({ score }: { score: GigScore }) {
  const s = TIER_STYLES[score.tier] || TIER_STYLES.Silver;
  const pct = score.score;

  return (
    <div className={`rounded-2xl border bg-slate-900 p-6 transition-all ${s.ring} ${s.glow}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Award className="h-4 w-4 text-slate-400" />
            <p className="text-sm text-slate-400 font-medium">GigScore</p>
          </div>
          <p className="font-display text-5xl font-bold text-white">
            {score.score}
            <span className="text-2xl text-slate-500">/100</span>
          </p>
        </div>
        <span className={`rounded-full border px-3 py-1 text-xs font-bold ${s.badge}`}>
          {score.tier}
        </span>
      </div>

      {/* Score bar */}
      <div className="h-2 w-full rounded-full bg-slate-800 mb-4 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${s.bar}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Discount badge */}
      {score.discount_pct > 0 && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-2.5 mb-4">
          <TrendingUp className="h-4 w-4 text-emerald-400 flex-shrink-0" />
          <p className="text-sm text-emerald-400 font-medium">
            You earn a <strong>{score.discount_pct}% premium discount</strong> for your clean claim history
          </p>
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total Claims", value: score.total_claims },
          { label: "Approved", value: score.approved_claims },
          { label: "Flagged", value: score.flagged_claims },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-xl bg-slate-800 p-3 text-center">
            <p className="font-bold text-white text-lg">{value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Breakdown */}
      <div className="mt-4 space-y-1.5">
        <p className="text-xs text-slate-500 font-medium mb-2">Score breakdown</p>
        {[
          { label: "Base score", value: `+${score.breakdown.base}`, color: "text-slate-400" },
          { label: "Approved claims bonus", value: `+${score.breakdown.approved_bonus}`, color: "text-emerald-400" },
          { label: "History bonus", value: `+${score.breakdown.history_bonus}`, color: "text-emerald-400" },
          { label: "Clean recent history", value: `+${score.breakdown.clean_recent_bonus}`, color: "text-emerald-400" },
          { label: "Flag penalty", value: `-${score.breakdown.flag_penalty}`, color: score.breakdown.flag_penalty > 0 ? "text-rose-400" : "text-slate-600" },
        ].map(({ label, value, color }) => (
          <div key={label} className="flex items-center justify-between text-xs">
            <span className="text-slate-500">{label}</span>
            <span className={`font-medium ${color}`}>{value}</span>
          </div>
        ))}
      </div>

      <div className="mt-3 pt-3 border-t border-slate-800">
        <p className="text-xs text-slate-600">
          Score updates automatically after each claim. Higher score = lower premium.
        </p>
      </div>
    </div>
  );
}