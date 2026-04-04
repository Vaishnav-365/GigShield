"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Shield, Zap, AlertTriangle, ChevronRight,
  CheckCircle, Clock, IndianRupee, Users
} from "lucide-react";
import { getCurrentUser, isLoggedIn } from "@/lib/auth";
import {
  UserProfile, Policy, TriggerEvent, Claim,
  premiumApi, triggerApi, claimApi,
  MOCK_TRIGGERS, MOCK_CLAIMS
} from "@/lib/api";
import TriggerBadge from "@/components/TriggerBadge";
import ClaimTracker from "@/components/ClaimTracker";
import { gigscoreApi, GigScore } from "@/lib/api";
import GigScoreCard from "@/components/GigScoreCard";
import { zoneReportApi, ZoneReport } from "@/lib/api";
import PeerValidationBadge from "@/components/PeerValidationBadge";

function StatCard({
  label, value, sub, icon: Icon, color,
}: {
  label: string; value: string; sub?: string; icon: React.ElementType; color: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <div className="flex items-start justify-between mb-3">
        <div className={`rounded-xl p-2.5 ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="font-display text-2xl font-bold text-white">{value}</p>
      <p className="text-sm text-slate-400 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-slate-600 mt-1">{sub}</p>}
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [triggers, setTriggers] = useState<TriggerEvent[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [gigscore, setGigscore] = useState<GigScore | null>(null);
  const [zoneReports, setZoneReports] = useState<ZoneReport[]>([]);

  useEffect(() => {
    setMounted(true);
    if (!isLoggedIn()) { router.push("/login"); return; }
    Promise.all([
      getCurrentUser(),
      premiumApi.myPolicy().catch(() => null),
      triggerApi.active().catch(() => MOCK_TRIGGERS.filter(t => t.is_active)).then(data => Array.isArray(data) ? data : (data as any).events || []),
      claimApi.list().catch(() => MOCK_CLAIMS),
      gigscoreApi.get().catch(() => null),
    ]).then(([u, p, t, c, g]) => {
      setUser(u);
      setPolicy(p);
      setTriggers(t);
      // Fetch peer validation for active triggers in worker's zones
      const workerZones = u?.work_zones || [];
      const activeTriggerList = Array.isArray(t) ? t.filter((tr: any) => tr.is_active) : [];
      const uniqueCombinations = activeTriggerList
        .filter((tr: any) => workerZones.some((z: string) => z === tr.zone))
        .slice(0, 3);

      Promise.all(
        uniqueCombinations.map((tr: any) =>
          zoneReportApi.get(tr.zone, tr.trigger_type).catch(() => null)
        )
      ).then(reports => {
        setZoneReports(reports.filter(Boolean) as ZoneReport[]);
      });
      setClaims(c);
      setGigscore(g);
    }).finally(() => setLoading(false));
  }, []);

  if (!mounted || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-sky-500 border-t-transparent animate-spin" />
          <p className="text-slate-500 text-sm">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  const totalPayout = claims
  .filter(c => c.status === "approved" || c.status === "green")
  .reduce((s, c) => s + (Number(c.estimated_payout) || 0), 0);

  const activeClaims = claims.filter(c => c.status === "amber" || c.status === "pending").length;
  const myZoneTriggers = (Array.isArray(triggers) ? triggers : []).filter(t =>
    user?.work_zones?.some(z => z === t.zone) && t.is_active
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-white">
          Hello, {user?.full_name?.split(" ")[0] || "Worker"}
        </h1>
        <p className="mt-1 text-slate-400">
          {user?.platform && `${user.platform} · `}
          {user?.work_zones?.join(", ")}
        </p>
      </div>

      {/* Active Alert Banner */}
      {myZoneTriggers.length > 0 && (
        <div className="mb-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 flex items-start gap-4">
          <div className="rounded-xl bg-amber-500/20 p-2.5">
            <AlertTriangle className="h-5 w-5 text-amber-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-amber-400">
              {myZoneTriggers.length} active trigger{myZoneTriggers.length > 1 ? "s" : ""} in your zone
            </p>
            <p className="text-sm text-amber-400/70 mt-0.5">
              {myZoneTriggers.map(t => t.trigger_type.replace(/_/g, " ")).join(", ")} —
              {policy ? " claims may be auto-initiated" : " activate a plan to get covered"}
            </p>
          </div>
          {!policy && (
            <Link
              href="/plans"
              className="flex-shrink-0 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-bold text-slate-900 hover:bg-amber-400 transition-colors"
            >
              Get covered
            </Link>
          )}
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Policy Status"
          value={policy ? `${policy.plan} Plan` : "No Plan"}
          sub={policy ? `Active until ${new Date(policy.end_date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}` : "Browse plans →"}
          icon={Shield}
          color="bg-sky-500/15 text-sky-400"
        />
        <StatCard
          label="Total Payout"
          value={`₹${isNaN(totalPayout) ? 0 : totalPayout.toLocaleString()}`}
          sub="This week"
          icon={IndianRupee}
          color="bg-emerald-500/15 text-emerald-400"
        />
        <StatCard
          label="Active Claims"
          value={String(activeClaims)}
          sub="Under review"
          icon={Clock}
          color="bg-amber-500/15 text-amber-400"
        />
        <StatCard
          label="Active Triggers"
          value={String((Array.isArray(triggers) ? triggers : []).filter(t => t.is_active).length)}
          sub="In monitored zones"
          icon={Zap}
          color="bg-rose-500/15 text-rose-400"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Policy Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-lg font-bold text-white">Your Coverage</h2>
            <Link href="/plans" className="text-sm text-sky-400 hover:text-sky-300 flex items-center gap-1">
              {policy ? "Change plan" : "View plans"} <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          {policy ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
                  <Shield className="h-7 w-7 text-sky-400" />
                </div>
                <div>
                  <p className="font-display text-xl font-bold text-white capitalize">{policy.plan} Plan</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-sm text-emerald-400 font-medium">Active</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Zone", value: policy.zone },
                  { label: "Status", value: policy.status },
                  { label: "Start", value: new Date(policy.start_date).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) },
                  { label: "Expires", value: new Date(policy.end_date).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-xl bg-slate-800 px-4 py-3">
                    <p className="text-xs text-slate-500">{label}</p>
                    <p className="font-medium text-white mt-0.5 capitalize">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Shield className="h-10 w-10 text-slate-700 mb-3" />
              <p className="text-slate-400 font-medium">No active plan</p>
              <p className="text-sm text-slate-600 mt-1 mb-4">Activate a weekly plan to get income protection</p>
              <Link
                href="/plans"
                className="rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-sky-400 transition-colors"
              >
                View Plans
              </Link>
            </div>
          )}
        </div>

        {/* Active Triggers */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-lg font-bold text-white">Active Triggers</h2>
            <span className="rounded-full bg-slate-800 px-2.5 py-1 text-xs text-slate-400">
              {triggers.filter(t => t.is_active).length} active
            </span>
          </div>
          {(Array.isArray(triggers) ? triggers : []).filter(t => t.is_active).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <CheckCircle className="h-10 w-10 text-slate-700 mb-3" />
              <p className="text-slate-400">All clear — no active disruptions</p>
            </div>
          ) : (
            <div className="space-y-3">
              {(Array.isArray(triggers) ? triggers : []).filter(t => t.is_active).slice(0, 3).map(t => (
                <TriggerBadge key={t.id} trigger={t} />
              ))}
            </div>
          )}
        </div>

        {/* Peer Validation */}
        {zoneReports.length > 0 && (
          <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-4 w-4 text-sky-400" />
              <h2 className="font-display text-lg font-bold text-white">Community Reports</h2>
              <span className="rounded-full bg-slate-800 px-2.5 py-1 text-xs text-slate-400">
                {zoneReports.length} active
              </span>
            </div>
            <div className="space-y-3">
              {zoneReports.map((report, i) => (
                <PeerValidationBadge key={i} report={report} />
              ))}
            </div>
          </div>
        )}

        {/* GigScore */}
        {gigscore && (
          <div className="lg:col-span-2">
            <GigScoreCard score={gigscore} />
          </div>
        )}

        {/* Recent Claims */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-lg font-bold text-white">Recent Claims</h2>
            <Link href="/claims" className="text-sm text-sky-400 hover:text-sky-300 flex items-center gap-1">
              View all <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <ClaimTracker claims={claims.slice(0, 3)} />
        </div>
      </div>
    </div>
  );
}