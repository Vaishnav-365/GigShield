"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Zap, AlertTriangle, CheckCircle, Clock, TrendingUp,
  Users, IndianRupee, ShieldAlert, RefreshCw
} from "lucide-react";
import { isLoggedIn, getCurrentUser } from "@/lib/auth";
import {
  TriggerEvent, Claim,
  triggerApi, claimApi,
  MOCK_TRIGGERS, MOCK_CLAIMS,
} from "@/lib/api";
import TriggerBadge from "@/components/TriggerBadge";

const STATUS_STYLES: Record<string, string> = {
  green: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  approved: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  red: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  rejected: "bg-slate-800 text-slate-400 border-slate-700",
};

const STATUS_LABELS: Record<string, string> = {
  green: "Auto Approved",
  approved: "Approved",
  amber: "Under Review",
  red: "Flagged",
  rejected: "Rejected",
};

function formatDate(d: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
  }).format(new Date(d));
}

export default function AdminPage() {
  const router = useRouter();
  const [triggers, setTriggers] = useState<TriggerEvent[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingClaim, setUpdatingClaim] = useState<string | null>(null);

  const load = async (showRefresh = false) => {
  if (showRefresh) setRefreshing(true);
  try {
    const [t, c] = await Promise.all([
      triggerApi.history().catch(() => MOCK_TRIGGERS),
      claimApi.listAll().catch(() => claimApi.list()).catch(() => MOCK_CLAIMS),
    ]);
    setTriggers(Array.isArray(t) ? t : (t as any).events || []);
    setClaims(Array.isArray(c) ? c : []);
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
};

  useEffect(() => {
    setMounted(true);
    if (!isLoggedIn()) { router.push("/login"); return; }
    getCurrentUser().then(u => {
      if (!u?.is_admin) {
        router.push("/dashboard");
      }
    });
    load();
  }, []);

  if (!mounted || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-8 w-8 rounded-full border-2 border-sky-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  const handleStatusChange = async (claimId: string, status: string) => {
    setUpdatingClaim(claimId);
    try {
      const updated = await claimApi.updateStatus(claimId, status);
      setClaims(prev => prev.map(c => c.id === claimId ? updated : c));
    } catch {
      setClaims(prev => prev.map(c => c.id === claimId ? { ...c, status: status as Claim["status"] } : c));
    } finally {
      setUpdatingClaim(null);
    }
  };

  const safeTriggers = Array.isArray(triggers) ? triggers : [];
  const safeClaims = Array.isArray(claims) ? claims : [];

  const totalPayout = safeClaims
    .filter(c => c.status === "approved" || c.status === "green")
    .reduce((s, c) => s + (Number(c.estimated_payout) || 0), 0);

  const fraudFlags = safeClaims.filter(c => c.status === "red").length;
  const pendingReview = safeClaims.filter(c => c.status === "amber").length;
  const activeTriggers = safeTriggers.filter(t => t.is_active).length;
  const approvedClaims = safeClaims.filter(c => c.status === "green" || c.status === "approved");

  const stats = [
    { label: "Active Triggers", value: String(activeTriggers), icon: Zap, color: "bg-sky-500/15 text-sky-400" },
    { label: "Total Claims", value: String(safeClaims.length), icon: Users, color: "bg-slate-800 text-slate-300" },
    { label: "Fraud Flags", value: String(fraudFlags), icon: ShieldAlert, color: "bg-rose-500/15 text-rose-400" },
    { label: "Pending Review", value: String(pendingReview), icon: Clock, color: "bg-amber-500/15 text-amber-400" },
    { label: "Total Payout", value: `₹${totalPayout.toLocaleString()}`, icon: IndianRupee, color: "bg-emerald-500/15 text-emerald-400" },
    { label: "Auto Approved", value: String(approvedClaims.length), icon: CheckCircle, color: "bg-emerald-500/15 text-emerald-400" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-400 mb-2">
            <ShieldAlert className="h-3 w-3" /> Admin Console
          </div>
          <h1 className="font-display text-3xl font-bold text-white">Operations Dashboard</h1>
          <p className="mt-1 text-slate-400">Real-time trigger events, claim volume, and fraud analytics</p>
        </div>
        <button
          onClick={() => load(true)}
          disabled={refreshing}
          className="flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-2.5 text-sm text-slate-400 hover:text-white hover:border-slate-500 transition-all"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
            <div className={`inline-flex rounded-xl p-2 mb-3 ${color}`}>
              <Icon className="h-4 w-4" />
            </div>
            <p className="font-display text-2xl font-bold text-white">{value}</p>
            <p className="text-xs text-slate-500 mt-0.5 leading-tight">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Trigger Events */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="font-display text-lg font-bold text-white mb-5">
            Trigger Events
            <span className="ml-2 rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-400 font-normal">
              {safeTriggers.length} total
            </span>
          </h2>
          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {safeTriggers.map(t => (
              <TriggerBadge key={t.id} trigger={t} />
            ))}
          </div>
        </div>

        {/* Claims Review Queue */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="font-display text-lg font-bold text-white mb-5">
            Claims Review Queue
            <span className="ml-2 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/20 px-2 py-0.5 text-xs font-normal">
              {pendingReview} pending
            </span>
          </h2>
          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {safeClaims.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-8">No claims yet</p>
            ) : (
              safeClaims.map(claim => (
                <div
                  key={claim.id}
                  className={`rounded-xl border p-4 ${STATUS_STYLES[claim.status] || STATUS_STYLES.amber}`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <p className="text-sm font-semibold text-white capitalize">
                        {(claim.trigger_type || "trigger").replace(/_/g, " ")} — {claim.zone || "Unknown zone"}
                      </p>
                      <p className="text-xs text-slate-500">{formatDate(claim.created_at)}</p>
                    </div>
                    <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold flex-shrink-0 ${STATUS_STYLES[claim.status]}`}>
                      {STATUS_LABELS[claim.status] || claim.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-400 mb-3">
                    <span>Trust: <strong className={claim.trust_score > 0.7 ? "text-emerald-400" : claim.trust_score >= 0.4 ? "text-amber-400" : "text-rose-400"}>
                      {Math.round(claim.trust_score * 100)}%
                    </strong></span>
                    <span>Payout: <strong className="text-white">
                      {(Number(claim.estimated_payout) || 0) > 0 ? `₹${Number(claim.estimated_payout).toLocaleString()}` : "Pending"}
                    </strong></span>
                  </div>

                  <div className="h-1 w-full rounded-full bg-slate-800 mb-3">
                    <div
                      className={`h-full rounded-full ${claim.trust_score > 0.7 ? "bg-emerald-500" : claim.trust_score >= 0.4 ? "bg-amber-500" : "bg-rose-500"}`}
                      style={{ width: `${claim.trust_score * 100}%` }}
                    />
                  </div>

                  {(claim.status === "amber" || claim.status === "red") && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStatusChange(claim.id, "approved")}
                        disabled={updatingClaim === claim.id}
                        className="flex-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 py-1.5 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/20 transition-colors disabled:opacity-50"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatusChange(claim.id, "rejected")}
                        disabled={updatingClaim === claim.id}
                        className="flex-1 rounded-lg bg-rose-500/10 border border-rose-500/20 py-1.5 text-xs font-semibold text-rose-400 hover:bg-rose-500/20 transition-colors disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Payout Analytics */}
      <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="font-display text-lg font-bold text-white mb-5 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-sky-400" />
          Payout Analytics
        </h2>
        <div className="grid sm:grid-cols-4 gap-4">
          {[
            {
              label: "Avg Trust Score",
              value: safeClaims.length ? `${Math.round(safeClaims.reduce((s, c) => s + c.trust_score, 0) / safeClaims.length * 100)}%` : "—"
            },
            {
              label: "Auto-Approval Rate",
              value: safeClaims.length ? `${Math.round(approvedClaims.length / safeClaims.length * 100)}%` : "—"
            },
            {
              label: "Fraud Flag Rate",
              value: safeClaims.length ? `${Math.round(fraudFlags / safeClaims.length * 100)}%` : "—"
            },
            {
              label: "Avg Payout",
              value: approvedClaims.length ? `₹${Math.round(totalPayout / approvedClaims.length)}` : "—"
            },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-xl bg-slate-800 p-4">
              <p className="font-display text-2xl font-bold text-white">{value}</p>
              <p className="text-xs text-slate-500 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}