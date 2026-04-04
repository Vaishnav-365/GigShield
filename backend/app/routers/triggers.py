from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import Optional

from app.database import get_db
from app.models.trigger import TriggerEvent
from app.schemas.trigger import TriggerEventOut, TriggerListResponse

router = APIRouter(prefix="/api/triggers", tags=["triggers"])


@router.get("/active", response_model=TriggerListResponse)
def get_active_triggers(
    zone         : Optional[str] = Query(None, description="Filter by zone name"),
    trigger_type : Optional[str] = Query(None, description="heavy_rain | extreme_heat | severe_aqi | flood | platform_outage"),
    db           : Session = Depends(get_db),
):
    """
    Returns all currently active trigger events.
    Person 4 (Claims) polls this to know which policies to evaluate.
    """
    q = db.query(TriggerEvent).filter(TriggerEvent.is_active == True)
    if zone:
        q = q.filter(TriggerEvent.zone == zone)
    if trigger_type:
        q = q.filter(TriggerEvent.trigger_type == trigger_type)

    events = q.order_by(desc(TriggerEvent.started_at)).all()
    return {"count": len(events), "events": events}


@router.get("/history", response_model=TriggerListResponse)
def get_trigger_history(
    zone         : Optional[str] = Query(None),
    trigger_type : Optional[str] = Query(None),
    limit        : int           = Query(50, ge=1, le=500),
    db           : Session = Depends(get_db),
):
    """
    Returns recent trigger history (active + resolved) for the dashboard and P4.
    """
    q = db.query(TriggerEvent)
    if zone:
        q = q.filter(TriggerEvent.zone == zone)
    if trigger_type:
        q = q.filter(TriggerEvent.trigger_type == trigger_type)

    events = q.order_by(desc(TriggerEvent.started_at)).limit(limit).all()
    return {"count": len(events), "events": events}
