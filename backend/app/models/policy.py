from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.database import Base
import datetime

class Policy(Base):
    __tablename__ = "policies"

    id = Column(Integer, primary_key=True, index=True)
    worker_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    plan = Column(String, nullable=False)          # "lite", "smart", "pro"
    zone = Column(String, nullable=False)
    shift = Column(String, nullable=False)
    weekly_premium = Column(Float, nullable=False)
    protected_hours = Column(Integer, nullable=False)
    max_payout = Column(Float, nullable=False)
    status = Column(String, default="active")      # "active", "expired", "cancelled"
    start_date = Column(DateTime, default=datetime.datetime.utcnow)
    end_date = Column(DateTime)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    worker = relationship("User", back_populates="policies")
    premium_logs = relationship("PremiumLog", back_populates="policy")


class PremiumLog(Base):
    __tablename__ = "premium_logs"

    id = Column(Integer, primary_key=True, index=True)
    policy_id = Column(Integer, ForeignKey("policies.id"), nullable=True)
    worker_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    zone = Column(String)
    shift = Column(String)
    base_premium = Column(Float)
    zone_risk_load = Column(Float)
    shift_risk_load = Column(Float)
    coverage_multiplier = Column(Float)
    safe_profile_discount = Column(Float)
    final_premium = Column(Float)
    plan = Column(String)
    breakdown = Column(JSON)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    policy = relationship("Policy", back_populates="premium_logs")