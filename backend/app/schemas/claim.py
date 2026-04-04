from pydantic import BaseModel
from typing import Optional, Dict, Any
import datetime

class ClaimResponse(BaseModel):
    id: int
    worker_id: int
    policy_id: Optional[int]
    trigger_type: str
    zone: str
    lost_hours: float
    estimated_payout: float
    trust_score: float
    trust_path: str
    status: str
    fraud_signals: Optional[Dict[str, Any]]
    created_at: datetime.datetime

    class Config:
        from_attributes = True

class ClaimStatusUpdate(BaseModel):
    status: str   # "approved", "rejected", "flagged"

class PayoutResponse(BaseModel):
    id: int
    claim_id: int
    worker_id: int
    amount: float
    status: str
    payment_ref: Optional[str]
    paid_at: Optional[datetime.datetime]

    class Config:
        from_attributes = True