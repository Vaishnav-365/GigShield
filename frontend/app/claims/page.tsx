"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw, FileText } from "lucide-react";
import { isLoggedIn } from "@/lib/auth";
import { Claim, claimApi, MOCK_CLAIMS } from "@/lib/api";
import ClaimTracker from "@/components/ClaimTracker";

const STATUS_TABS = [
  { key: "all", label: "All" },
  { key: "approved", label: "Approved" },
  { key: "amber", label: "Under Review" },
  { key: "red", label: "Flagged" },
];

export default function ClaimsPage() {
  const router = useRouter();
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [tab, setTab] = useState("all");

  const loadClaims = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    try {
      const data = await claimApi.list();
      setClaims(data);
    } catch {
      setClaims(MOCK_CLAIMS);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (!isLoggedIn()) { router.push("/login"); return; }
    loadClaims();
    const interval = setInterval(() => loadClaims(), 30000);
    return () => clearInterval(interval);
  }, []);

  const filtered = tab === "all"
    ? claims
    : claims.filter(c => {
        if (tab === "approved") return c.status === "approved" || c.status === "green";
        return c.status === tab;
      });

  const stats = {
    total: claims.length,
    approved: claims.filter(c => c.status === "approved" || c.status === "green").length,
    pending: claims.filter(c => c.status === "amber").length,
    totalPayout: claims
      .filter(c => c.status === "approved" || c.status === "green")
      .reduce((s, c) => s + c.payout_amount, 0),
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-8 w-8 rounded-full border-2 border-sky-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Claims</h1>
          <p className="mt-1 text-slate-400">Auto-initiated when triggers affect your zone</p>
        </div>
        <button
          onClick={() => loadClaims(true)}
          disabled={refreshing}
          className="flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-2.5 text-sm text-slate-400 hover:text-white hover:border-slate-500 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Claims", value: stats.total },
          { label: "Approved", value: stats.approved },
          { label: "Total Payout", value: `₹${stats.totalPayout.toLocaleString()}` },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-xl border border-slate-800 bg-slate-900 p-4 text-center">
            <p className="font-display text-xl font-bold text-white">{value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Claim process explanation */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 mb-6">
        <div className="flex items-start gap-3">
          <FileText className="h-4 w-4 text-sky-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-white">Zero-touch claim process</p>
            <p className="text-xs text-slate-400 mt-1">
              When a parametric trigger fires in your insured zone during your shift hours, a claim is
              automatically created and evaluated. High-trust claims are approved instantly.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl border border-slate-800 bg-slate-900 p-1 mb-6">
        {STATUS_TABS.map(({ key, label }) => {
          const count = key === "all"
            ? claims.length
            : key === "approved"
            ? stats.approved
            : claims.filter(c => c.status === key).length;
          return (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                tab === key
                  ? "bg-sky-500/15 text-sky-400"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {label}
              {count > 0 && (
                <span className="ml-1.5 rounded-full bg-slate-800 px-1.5 py-0.5 text-xs">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <ClaimTracker claims={filtered} />
    </div>
  );
}
