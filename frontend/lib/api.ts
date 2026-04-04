const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("gigshield_token");
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };
  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(err.detail || "Request failed");
  }
  return res.json();
}

// ─── AUTH ──────────────────────────────────────────────────────────────────

export interface RegisterPayload {
  full_name: string;
  email: string;
  phone: string;
  password: string;
  work_zones: string[];
  shift_start_hour: number;
  shift_end_hour: number;
  avg_weekly_hours: number;
  avg_hourly_earnings: number;
  platform: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface UserProfile {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  work_zones: string[];
  shift_start_hour: number;
  shift_end_hour: number;
  avg_weekly_hours: number;
  avg_hourly_earnings: number;
  platform: string;
  is_admin: boolean;
}

export const authApi = {
  register: (data: RegisterPayload) =>
    request<AuthResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  login: (data: LoginPayload) =>
    request<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  me: () => request<UserProfile>("/api/auth/me"),
  updateProfile: (data: Partial<RegisterPayload>) =>
    request<UserProfile>("/api/auth/me/profile", {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
};

// ─── PREMIUM & PLANS ───────────────────────────────────────────────────────

export interface PremiumCalculation {
  base_premium: number;
  zone_risk_load: number;
  shift_risk_load: number;
  coverage_multiplier: number;
  safe_profile_discount: number;
  weekly_premium: number;
  recommended_plan: string;
}

export interface Plan {
  id: string;
  name: string;
  weekly_premium: number;
  protected_hours: number;
  payout_cap: number;
  covered_triggers: string[];
  description: string;
}

export interface Policy {
  id: number;
  worker_id: number;
  plan: string;
  status: string;
  zone: string;
  activated_at: string;
  expires_at: string;
}

export const premiumApi = {
  calculate: (worker_id: number) =>
    request<PremiumCalculation>(`/api/premium/calculate?worker_id=${worker_id}`),
  plans: () => request<Plan[]>("/api/plans"),
  activatePolicy: (plan: string) =>
    request<Policy>("/api/policies/activate", {
      method: "POST",
      body: JSON.stringify({ plan }),
    }),
  myPolicy: () => request<Policy | null>("/api/policies/me"),
};

// ─── TRIGGERS ─────────────────────────────────────────────────────────────

export interface TriggerEvent {
  id: number;
  trigger_type: string;
  zone: string;
  severity: string;
  started_at: string;
  ended_at: string | null;
  is_active: boolean;
  raw_data: Record<string, unknown>;
}

export const triggerApi = {
  active: () => request<TriggerEvent[]>("/api/triggers/active"),
  history: () => request<TriggerEvent[]>("/api/triggers/history"),
};

// ─── CLAIMS ───────────────────────────────────────────────────────────────

export interface Claim {
  id: number;
  worker_id: number;
  trigger_id: number;
  trust_score: number;
  status: "green" | "amber" | "red" | "approved" | "rejected";
  payout_amount: number;
  created_at: string;
  updated_at: string;
  trigger_type?: string;
  zone?: string;
}

export const claimApi = {
  list: () => request<Claim[]>("/api/claims"),
  get: (id: number) => request<Claim>(`/api/claims/${id}`),
  updateStatus: (id: number, status: string) =>
    request<Claim>(`/api/claims/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
};

// ─── MOCK DATA (used when backend is not ready) ──────────────────────────

export const MOCK_PLANS: Plan[] = [
  {
    id: "lite",
    name: "Lite",
    weekly_premium: 49,
    protected_hours: 15,
    payout_cap: 750,
    covered_triggers: ["Heavy Rain", "Extreme Heat", "Platform Outage"],
    description: "Essential protection for occasional gig workers.",
  },
  {
    id: "smart",
    name: "Smart",
    weekly_premium: 99,
    protected_hours: 30,
    payout_cap: 1500,
    covered_triggers: ["Heavy Rain", "Extreme Heat", "Severe AQI", "Platform Outage", "Flood"],
    description: "Balanced coverage for regular delivery workers. Most popular.",
  },
  {
    id: "pro",
    name: "Pro",
    weekly_premium: 179,
    protected_hours: 50,
    payout_cap: 3000,
    covered_triggers: ["Heavy Rain", "Extreme Heat", "Severe AQI", "Platform Outage", "Flood", "Curfew"],
    description: "Maximum protection for full-time delivery professionals.",
  },
];

export const MOCK_TRIGGERS: TriggerEvent[] = [
  {
    id: 1,
    trigger_type: "heavy_rain",
    zone: "Zone A",
    severity: "HIGH",
    started_at: new Date(Date.now() - 3600000).toISOString(),
    ended_at: null,
    is_active: true,
    raw_data: { rainfall_mm: 52, threshold_mm: 30 },
  },
  {
    id: 2,
    trigger_type: "platform_outage",
    zone: "Zone B",
    severity: "MEDIUM",
    started_at: new Date(Date.now() - 7200000).toISOString(),
    ended_at: null,
    is_active: true,
    raw_data: { order_drop_pct: 78 },
  },
  {
    id: 3,
    trigger_type: "extreme_heat",
    zone: "Zone A",
    severity: "MEDIUM",
    started_at: new Date(Date.now() - 86400000).toISOString(),
    ended_at: new Date(Date.now() - 72000000).toISOString(),
    is_active: false,
    raw_data: { heat_index: 41.2 },
  },
];

export const MOCK_CLAIMS: Claim[] = [
  {
    id: 1,
    worker_id: 1,
    trigger_id: 1,
    trust_score: 0.91,
    status: "approved",
    payout_amount: 420,
    created_at: new Date(Date.now() - 3500000).toISOString(),
    updated_at: new Date(Date.now() - 3400000).toISOString(),
    trigger_type: "heavy_rain",
    zone: "Zone A",
  },
  {
    id: 2,
    worker_id: 1,
    trigger_id: 2,
    trust_score: 0.55,
    status: "amber",
    payout_amount: 0,
    created_at: new Date(Date.now() - 7000000).toISOString(),
    updated_at: new Date(Date.now() - 6900000).toISOString(),
    trigger_type: "platform_outage",
    zone: "Zone B",
  },
];

export const MOCK_PREMIUM: PremiumCalculation = {
  base_premium: 60,
  zone_risk_load: 15,
  shift_risk_load: 12,
  coverage_multiplier: 20,
  safe_profile_discount: 8,
  weekly_premium: 99,
  recommended_plan: "smart",
};
