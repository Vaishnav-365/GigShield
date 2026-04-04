"use client";

import { CloudRain, Thermometer, Wind, Droplets, Wifi, AlertTriangle } from "lucide-react";
import { TriggerEvent } from "@/lib/api";

const TRIGGER_CONFIG: Record<
  string,
  { label: string; icon: React.ElementType; color: string; bg: string; dot: string }
> = {
  heavy_rain: {
    label: "Heavy Rain",
    icon: CloudRain,
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
    dot: "bg-blue-400",
  },
  extreme_heat: {
    label: "Extreme Heat",
    icon: Thermometer,
    color: "text-orange-400",
    bg: "bg-orange-500/10 border-orange-500/20",
    dot: "bg-orange-400",
  },
  severe_aqi: {
    label: "Severe AQI",
    icon: Wind,
    color: "text-purple-400",
    bg: "bg-purple-500/10 border-purple-500/20",
    dot: "bg-purple-400",
  },
  flood: {
    label: "Flood",
    icon: Droplets,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10 border-cyan-500/20",
    dot: "bg-cyan-400",
  },
  platform_outage: {
    label: "Platform Outage",
    icon: Wifi,
    color: "text-rose-400",
    bg: "bg-rose-500/10 border-rose-500/20",
    dot: "bg-rose-400",
  },
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

interface Props {
  trigger: TriggerEvent;
  compact?: boolean;
}

export default function TriggerBadge({ trigger, compact = false }: Props) {
  const cfg = TRIGGER_CONFIG[trigger.trigger_type] || {
    label: trigger.trigger_type,
    icon: AlertTriangle,
    color: "text-slate-400",
    bg: "bg-slate-800 border-slate-700",
    dot: "bg-slate-400",
  };
  const Icon = cfg.icon;

  if (compact) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${cfg.bg} ${cfg.color}`}
      >
        <Icon className="h-3 w-3" />
        {cfg.label}
      </span>
    );
  }

  return (
    <div className={`rounded-xl border p-4 ${cfg.bg} transition-all hover:scale-[1.01]`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`rounded-lg p-2 ${cfg.bg}`}>
            <Icon className={`h-5 w-5 ${cfg.color}`} />
          </div>
          <div>
            <p className={`font-semibold ${cfg.color}`}>{cfg.label}</p>
            <p className="text-xs text-slate-400 mt-0.5">{trigger.zone}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          {trigger.is_active && (
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-xs font-medium text-emerald-400">
              <span className={`h-1.5 w-1.5 rounded-full animate-pulse ${cfg.dot}`} />
              Active
            </span>
          )}
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-bold uppercase tracking-wide ${
              trigger.severity === "HIGH"
                ? "bg-rose-500/20 text-rose-400"
                : trigger.severity === "MEDIUM"
                ? "bg-amber-500/20 text-amber-400"
                : "bg-slate-700 text-slate-400"
            }`}
          >
            {trigger.severity}
          </span>
        </div>
      </div>
      <p className="mt-3 text-xs text-slate-500">
        Started {timeAgo(trigger.started_at)}
        {trigger.ended_at && ` · Ended ${timeAgo(trigger.ended_at)}`}
      </p>
    </div>
  );
}
