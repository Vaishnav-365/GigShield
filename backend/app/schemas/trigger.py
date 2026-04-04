from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Any

class TriggerEventBase(BaseModel):
    trigger_type : str
    zone         : str
    severity     : str
    raw_data     : Optional[Any] = None

class TriggerEventCreate(TriggerEventBase):
    pass

class TriggerEventOut(TriggerEventBase):
    id         : int
    started_at : datetime
    ended_at   : Optional[datetime] = None
    is_active  : bool

    class Config:
        from_attributes = True

class TriggerListResponse(BaseModel):
    count  : int
    events : list[TriggerEventOut]
