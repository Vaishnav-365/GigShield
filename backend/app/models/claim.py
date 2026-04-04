from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.database import Base
import datetime

class Claim(Base):
    __tablename__ = "claims"

    id = Column(Integer, primary_key=True, index=True)
    worker_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    policy_id = Column(Integer, ForeignKey("policies.id"), nullable=True)
    trigger_type = Column(String, nullable=False)
    zone = Column(String, nullable=False)
    lost_hours = Column(Float, default=0.0)
    estimated_payout = Column(Float, default=0.0)
    trust_score = Column(Float, default=0.5)
    trust_path = Column(String, default="amber")   # "green", "amber", "red"
    status = Column(String, default="pending")     # "pending", "approved", "flagged", "rejected"
    fraud_signals = Column(JSON, default={})
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    reviewed_at = Column(DateTime, nullable=True)

    worker = relationship("User", back_populates="claims")
    payout = relationship("Payout", back_populates="claim", uselist=False)


class Payout(Base):
    __tablename__ = "payouts"

    id = Column(Integer, primary_key=True, index=True)
    claim_id = Column(Integer, ForeignKey("claims.id"), nullable=False)
    worker_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    amount = Column(Float, nullable=False)
    status = Column(String, default="processing")  # "processing", "paid", "failed"
    payment_ref = Column(String, nullable=True)
    paid_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    claim = relationship("Claim", back_populates="payout")