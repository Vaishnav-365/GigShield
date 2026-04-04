"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Shield, LayoutDashboard, FileText, Zap, Settings, LogOut, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { isLoggedIn, logout, getCurrentUser } from "@/lib/auth";
import { UserProfile } from "@/lib/api";

const workerLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/plans", label: "Plans", icon: Shield },
  { href: "/claims", label: "Claims", icon: FileText },
];

const adminLinks = [
  { href: "/admin", label: "Admin", icon: Settings },
];

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoggedIn()) {
      getCurrentUser().then(setUser);
    }
  }, [pathname]);

  const links = [...workerLinks, ...(user?.is_admin ? adminLinks : [])];

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const isAuth = isLoggedIn();

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href={isAuth ? "/dashboard" : "/"} className="flex items-center gap-2.5 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500 shadow-lg shadow-sky-500/30 group-hover:bg-sky-400 transition-colors">
              <Shield className="h-4.5 w-4.5 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-display text-lg font-bold tracking-tight text-white">
              Gig<span className="text-sky-400">Shield</span>
            </span>
          </Link>

          {/* Desktop links */}
          {isAuth && (
            <div className="hidden md:flex items-center gap-1">
              {links.map(({ href, label, icon: Icon }) => {
                const active = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                      active
                        ? "bg-sky-500/15 text-sky-400"
                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </Link>
                );
              })}
            </div>
          )}

          {/* Right side */}
          <div className="flex items-center gap-3">
            {isAuth ? (
              <>
                <div className="hidden md:flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-xs text-slate-400">Signed in as</p>
                    <p className="text-sm font-medium text-white truncate max-w-[140px]">
                      {user?.full_name || user?.email || "Worker"}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-400 hover:text-white hover:border-slate-500 transition-all"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
                <button
                  onClick={() => setOpen(!open)}
                  className="md:hidden rounded-lg p-2 text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                >
                  {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="rounded-lg px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-medium text-white hover:bg-sky-400 transition-colors shadow-lg shadow-sky-500/20"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && isAuth && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950 px-4 py-3 space-y-1">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                  active ? "bg-sky-500/15 text-sky-400" : "text-slate-400 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-rose-400 hover:text-rose-300 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
