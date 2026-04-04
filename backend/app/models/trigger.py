from sqlalchemy import Column, Integer, String, Boolean, DateTime, JSON, Text
from sqlalchemy.sql import func
from app.database import Base

class TriggerEvent(Base):
    __tablename__ = "trigger_events"

    id           = Column(Integer, primary_key=True, index=True)
    trigger_type = Column(String(50), nullable=False, index=True)
    zone         = Column(String(100), nullable=False, index=True)
    severity     = Column(String(20), nullable=False)          # low | medium | high
    started_at   = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    ended_at     = Column(DateTime(timezone=True), nullable=True)
    is_active    = Column(Boolean, default=True, nullable=False, index=True)
    raw_data     = Column(JSON, nullable=True)                 # full API payload / mock data

    def __repr__(self):
        return f"<TriggerEvent {self.trigger_type} | {self.zone} | {self.severity}>"
