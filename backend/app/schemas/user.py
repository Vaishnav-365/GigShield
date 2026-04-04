from pydantic import BaseModel, EmailStr
from typing import Optional, List
import uuid

class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    phone: str
    password: str
    work_zones: Optional[List[str]] = []
    shift_start_hour: Optional[int] = None
    shift_end_hour: Optional[int] = None
    avg_weekly_hours: Optional[float] = None
    avg_hourly_earnings: Optional[float] = None
    platform: Optional[str] = None

class UserProfileUpdate(BaseModel):
    work_zones: Optional[List[str]] = None
    shift_start_hour: Optional[int] = None
    shift_end_hour: Optional[int] = None
    avg_weekly_hours: Optional[float] = None
    avg_hourly_earnings: Optional[float] = None
    platform: Optional[str] = None

class UserOut(BaseModel):
    id: uuid.UUID
    full_name: str
    email: EmailStr
    phone: str
    work_zones: Optional[List[str]]
    shift_start_hour: Optional[int]
    shift_end_hour: Optional[int]
    avg_weekly_hours: Optional[float]
    avg_hourly_earnings: Optional[float]
    platform: Optional[str]
    is_admin: bool

    class Config:
        from_attributes = True