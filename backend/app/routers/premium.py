from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.policy import PremiumCalculateRequest, PremiumCalculateResponse
from app.services.premium_service import calculate_premium, PLAN_CONFIG
from app.routers.auth import get_current_user_dep

router = APIRouter(prefix="/api/premium", tags=["Premium"])

@router.get("/calculate", response_model=None)
def get_premium(
    zone: str,
    shift: str,
    weather_history_risk: float = 0.5,
    plan: str = "smart",
    current_user: User = Depends(get_current_user_dep),
    db: Session = Depends(get_db)
):
    if plan not in PLAN_CONFIG:
        raise HTTPException(status_code=400, detail="Plan must be lite, smart, or pro")
    if not (0.0 <= weather_history_risk <= 1.0):
        raise HTTPException(status_code=400, detail="weather_history_risk must be between 0.0 and 1.0")
    result = calculate_premium(
        zone=zone,
        shift=shift,
        weather_history_risk=weather_history_risk,
        avg_weekly_hours=current_user.avg_weekly_hours or 30.0,
        plan=plan
    )
    return result