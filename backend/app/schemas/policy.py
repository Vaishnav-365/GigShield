from pydantic import BaseModel
from typing import List, Optional
import datetime

# --- Premium ---

class PremiumCalculateRequest(BaseModel):
    zone: str
    shift: str                    # "morning", "afternoon", "evening", "night"
    weather_history_risk: float   # 0.0 to 1.0
    plan: str                     # "lite", "smart", "pro"

class PremiumBreakdown(BaseModel):
    base_premium: float
    zone_risk_load: float
    shift_risk_load: float
    coverage_multiplier: float
    safe_profile_discount: float
    final_premium: float

class PremiumCalculateResponse(BaseModel):
    plan: str
    weekly_premium: float
    protected_hours: int
    max_payout: float
    covered_triggers: List[str]
    breakdown: PremiumBreakdown

# --- Plans ---

class PlanDetail(BaseModel):
    name: str
    weekly_premium_estimate: float
    protected_hours: int
    max_payout: float
    covered_triggers: List[str]
    description: str

# --- Policy ---

class PolicyActivateRequest(BaseModel):
    plan: str
    zone: Optional[str] = "Zone A"
    shift: Optional[str] = "evening"
    weather_history_risk: float = 0.5

class PolicyResponse(BaseModel):
    id: int
    worker_id: int
    plan: str
    zone: str
    shift: str
    weekly_premium: float
    protected_hours: int
    max_payout: float
    status: str
    start_date: datetime.datetime
    end_date: datetime.datetime

    class Config:
        from_attributes = True