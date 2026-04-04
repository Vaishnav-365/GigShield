import Link from "next/link";
import { Shield, Zap, CheckCircle, CloudRain, Thermometer, Wind, ArrowRight } from "lucide-react";

const features = [
  { icon: Shield, title: "Weekly Plans", desc: "Lite, Smart, or Pro — activate each week based on your schedule." },
  { icon: Zap, title: "Auto Claims", desc: "Triggers fire automatically. No forms, no calls, no hassle." },
  { icon: CheckCircle, title: "Instant Payouts", desc: "High-trust claims get approved and paid within minutes." },
  { icon: CloudRain, title: "Weather Triggers", desc: "Rain, heat, flood — we monitor so you don't have to." },
  { icon: Wind, title: "AQI Protection", desc: "Unhealthy air quality days are covered automatically." },
  { icon: Thermometer, title: "AI Fraud Guard", desc: "Multi-signal trust scoring keeps the system fair for everyone." },
];

export default function HomePage() {
  return (
    <div className="relative">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-[-80px] h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-sky-700/20 blur-[140px]" />
      </div>

      {/* HERO */}
      <section className="mx-auto max-w-4xl px-6 pt-20 pb-16 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-sky-500/40 bg-sky-500/10 px-4 py-1.5 text-sm font-medium text-sky-400">
          <Zap className="h-3.5 w-3.5" />
          Parametric Insurance · Zero Paperwork · Auto Payouts
        </div>

        <h1 className="mb-5 text-5xl font-extrabold leading-tight tracking-tight text-white sm:text-6xl">
          Income Protection<br />
          <span className="text-sky-400">Built for Delivery Workers</span>
        </h1>

        <p className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-slate-400">
          GigShield AI detects disruptions in your zone — heavy rain, outages, extreme heat — and
          automatically validates and processes your payout. Weekly premiums, zero admin.
        </p>

        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/register"
            className="flex items-center gap-2 rounded-xl bg-sky-500 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-sky-500/30 transition hover:bg-sky-400 active:scale-95"
          >
            Get Protected This Week
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/login"
            className="rounded-xl border border-slate-600 px-8 py-3.5 text-base font-medium text-slate-300 transition hover:border-slate-400 hover:text-white active:scale-95"
          >
            Sign In
          </Link>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-sm text-slate-500">
          <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-emerald-500" /> Plans from ₹49/week</span>
          <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-emerald-500" /> Cancel anytime</span>
          <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-emerald-500" /> Auto claims, no forms</span>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 transition hover:border-slate-600"
            >
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-sky-500/20 bg-sky-500/10">
                <Icon className="h-5 w-5 text-sky-400" />
              </div>
              <h3 className="mb-2 text-base font-bold text-white">{title}</h3>
              <p className="text-sm leading-relaxed text-slate-400">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA STRIP */}
      <section className="border-t border-slate-800 bg-slate-900/60 py-20 text-center">
        <p className="mb-2 text-3xl font-extrabold text-white">Ready to protect your income?</p>
        <p className="mb-8 text-slate-400">Plans start at ₹49/week. Cancel anytime.</p>
        <Link
          href="/register"
          className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-8 py-3.5 font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-400 active:scale-95"
        >
          Register Now <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  );
}
