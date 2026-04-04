"use client";

import { CheckCircle, Clock, AlertTriangle, XCircle, CloudRain, Thermometer, Wind, Droplets, Wifi } from "lucide-react";
import { Claim } from "@/lib/api";

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string; icon: React.ElementType }> = {
  green: { label: "Auto Approved", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", icon: CheckCircle },
  approved: { label: "Approved", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", icon: CheckCircle },
  amber: { label: "Under Review", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", icon: Clock },
  red: { label: "Flagged", color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20", icon: AlertTriangle },
  rejected: { label: "Rejected", color: "text-slate-400", bg: "bg-slate-800", border: "border-slate-700", icon: XCircle },
};

const TRIGGER_ICONS: Record<string, React.ElementType> = {
  heavy_rain: CloudRain,
  extreme_heat: Thermometer,
  severe_aqi: Wind,
  flood: Droplets,
  platform_outage: Wifi,
};

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateStr));
}

function TrustBar({ score }: { score: number }) {
  const pct = Math.round(score * 100);
  const color = score > 0.7 ? "bg-emerald-500" : score >= 0.4 ? "bg-amber-500" : "bg-rose-500";
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-slate-500">Trust Score</span>
        <span className="text-xs font-bold text-slate-300">{pct}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

interface Props {
  claims: Claim[];
}

export default function ClaimTracker({ claims }: Props) {
  if (claims.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <CheckCircle className="h-10 w-10 text-slate-600 mb-3" />
        <p className="text-slate-400 font-medium">No claims yet</p>
        <p className="text-sm text-slate-600 mt-1">Claims are auto-created when triggers affect your zone.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {claims.map((claim) => {
        const s = STATUS_CONFIG[claim.status] || STATUS_CONFIG.amber;
        const StatusIcon = s.icon;
        const TriggerIcon = TRIGGER_ICONS[claim.trigger_type || ""] || CloudRain;

        return (
          <div
            key={claim.id}
            className={`rounded-xl border p-4 transition-all ${s.bg} ${s.border}`}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-slate-800 p-2">
                  <TriggerIcon className="h-4 w-4 text-slate-400" />
                </div>
                <div>
                  <p className="font-medium text-white capitalize">
                    {(claim.trigger_type || "trigger").replace(/_/g, " ")}
                  </p>
                  <p className="text-xs text-slate-500">{claim.zone || "Unknown zone"} · {formatDate(claim.created_at)}</p>
                </div>
              </div>
              <span className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold border ${s.bg} ${s.border} ${s.color}`}>
                <StatusIcon className="h-3 w-3" />
                {s.label}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-3">
              <TrustBar score={claim.trust_score} />
              <div className="text-right">
                <p className="text-xs text-slate-500">Payout</p>
                <p className={`font-bold ${(Number(claim.estimated_payout) || 0) > 0 ? "text-emerald-400" : "text-slate-500"}`}>
                  {(Number(claim.estimated_payout) || 0) > 0 
                    ? `₹${Number(claim.estimated_payout).toLocaleString()}` 
                    : "Pending"}
                </p>
              </div>
            </div>

            {claim.status === "amber" && (
              <p className="text-xs text-amber-400/80 bg-amber-500/5 rounded-lg px-3 py-2 border border-amber-500/10">
                Under automated recheck — expected within 30 minutes
              </p>
            )}
            {claim.status === "red" && (
              <p className="text-xs text-rose-400/80 bg-rose-500/5 rounded-lg px-3 py-2 border border-rose-500/10">
                Flagged for manual review due to signal inconsistency
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
