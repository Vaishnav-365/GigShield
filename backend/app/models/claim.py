from sqlalchemy import Column, String, Float, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base
import datetime
import uuid

class Claim(Base):
    __tablename__ = "claims"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    worker_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    policy_id = Column(UUID(as_uuid=True), ForeignKey("policies.id"), nullable=True)
    trigger_type = Column(String, nullable=False)
    zone = Column(String, nullable=False)
    lost_hours = Column(Float, default=0.0)
    estimated_payout = Column(Float, default=0.0)
    trust_score = Column(Float, default=0.5)
    trust_path = Column(String, default="amber")
    status = Column(String, default="pending")
    fraud_signals = Column(JSON, default={})
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    reviewed_at = Column(DateTime, nullable=True)
    worker = relationship("User", back_populates="claims")
    payout = relationship("Payout", back_populates="claim", uselist=False)

class Payout(Base):
    __tablename__ = "payouts"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    claim_id = Column(UUID(as_uuid=True), ForeignKey("claims.id"), nullable=False)
    worker_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    amount = Column(Float, nullable=False)
    status = Column(String, default="processing")
    payment_ref = Column(String, nullable=True)
    paid_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    claim = relationship("Claim", back_populates="payout")