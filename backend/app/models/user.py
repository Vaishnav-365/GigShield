import uuid
from sqlalchemy import Column, String, Float, Integer, Boolean, DateTime, ARRAY
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    phone = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Worker profile fields — stored here for simplicity
    # Zones: list of zone names e.g. ["Zone A", "Zone B"]
    work_zones = Column(ARRAY(String), nullable=True)
    # Shift start/end as hour integers, e.g. 18 and 22 for 6pm-10pm
    shift_start_hour = Column(Integer, nullable=True)
    shift_end_hour = Column(Integer, nullable=True)
    # Average weekly active hours
    avg_weekly_hours = Column(Float, nullable=True)
    # Average hourly earnings in INR
    avg_hourly_earnings = Column(Float, nullable=True)
    # Platform they deliver for
    platform = Column(String, nullable=True)