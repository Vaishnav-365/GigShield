"use client";

import { Users, AlertTriangle, TrendingUp } from "lucide-react";
import { ZoneReport } from "@/lib/api";

const SEVERITY_STYLES = {
  high: {
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
    text: "text-rose-400",
    icon: "text-rose-400",
    label: "High Impact",
  },
  medium: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    text: "text-amber-400",
    icon: "text-amber-400",
    label: "Moderate Impact",
  },
  low: {
    bg: "bg-sky-500/10",
    border: "border-sky-500/20",
    text: "text-sky-400",
    icon: "text-sky-400",
    label: "Low Impact",
  },
};

export default function PeerValidationBadge({ report }: { report: ZoneReport }) {
  const s = SEVERITY_STYLES[report.severity as keyof typeof SEVERITY_STYLES] || SEVERITY_STYLES.low;

  if (report.workers_affected === 0) return null;

  return (
    <div className={`rounded-xl border p-4 ${s.bg} ${s.border}`}>
      <div className="flex items-start gap-3">
        <div className={`rounded-lg p-2 ${s.bg} border ${s.border}`}>
          <Users className={`h-4 w-4 ${s.icon}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className={`text-sm font-semibold ${s.text}`}>
              Community Report — {report.zone}
            </p>
            <span className={`rounded-full px-2 py-0.5 text-xs font-bold border ${s.bg} ${s.border} ${s.text}`}>
              {s.label}
            </span>
          </div>
          <p className="text-xs text-slate-400">
            <strong className="text-white">{report.workers_affected} worker{report.workers_affected !== 1 ? "s" : ""}</strong> in your zone reported income disruption from{" "}
            <strong className="text-white">{report.trigger_type.replace(/_/g, " ")}</strong> in the last 24 hours.
          </p>
          {report.zones_affected > 1 && (
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              Affecting {report.zones_affected} zones citywide
            </p>
          )}
        </div>
        <AlertTriangle className={`h-4 w-4 flex-shrink-0 ${s.icon}`} />
      </div>
    </div>
  );
}