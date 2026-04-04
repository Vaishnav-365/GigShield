from pydantic import BaseModel
from typing import Optional, Dict, Any
import datetime
import uuid

class ClaimResponse(BaseModel):
    id: uuid.UUID
    worker_id: uuid.UUID
    policy_id: Optional[uuid.UUID]
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
    status: str

class PayoutResponse(BaseModel):
    id: uuid.UUID
    claim_id: uuid.UUID
    worker_id: uuid.UUID
    amount: float
    status: str
    payment_ref: Optional[str]
    paid_at: Optional[datetime.datetime]

    class Config:
        from_attributes = True