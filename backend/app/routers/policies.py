from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import datetime
from app.database import get_db
from app.models.user import User
from app.models.policy import Policy, PremiumLog
from app.schemas.policy import PolicyActivateRequest, PolicyResponse, PlanDetail
from app.services.premium_service import calculate_premium, PLAN_CONFIG
from app.routers.auth import get_current_user_dep

router = APIRouter(prefix="/api/policies", tags=["Policies"])

@router.get("/plans")
def get_all_plans():
    plans = []
    for name, config in PLAN_CONFIG.items():
        plans.append({
            "name": name,
            "protected_hours": config["protected_hours"],
            "max_payout": config["max_payout"],
            "covered_triggers": config["covered_triggers"],
            "description": config["description"],
        })
    return plans

@router.post("/activate", response_model=None)
def activate_policy(
    req: PolicyActivateRequest,
    current_user: User = Depends(get_current_user_dep),
    db: Session = Depends(get_db)
):
    if req.plan not in PLAN_CONFIG:
        raise HTTPException(status_code=400, detail="Plan must be lite, smart, or pro")

    existing = db.query(Policy).filter(
        Policy.worker_id == current_user.id,
        Policy.status == "active"
    ).first()
    if existing:
        existing.status = "cancelled"
        db.commit()

    result = calculate_premium(
        zone=req.zone,
        shift=req.shift,
        weather_history_risk=req.weather_history_risk,
        avg_weekly_hours=current_user.avg_weekly_hours or 30.0,
        plan=req.plan
    )

    now = datetime.datetime.utcnow()
    policy = Policy(
        worker_id=current_user.id,
        plan=req.plan,
        zone=req.zone,
        shift=req.shift,
        weekly_premium=result["weekly_premium"],
        protected_hours=result["protected_hours"],
        max_payout=result["max_payout"],
        status="active",
        start_date=now,
        end_date=now + datetime.timedelta(days=7),
    )
    db.add(policy)
    db.flush()

    log = PremiumLog(
        policy_id=policy.id,
        worker_id=current_user.id,
        zone=req.zone,
        shift=req.shift,
        plan=req.plan,
        breakdown=result["breakdown"],
        **result["breakdown"]
    )
    db.add(log)
    db.commit()
    db.refresh(policy)
    return policy

@router.get("/me", response_model=None)
def my_policy(
    current_user: User = Depends(get_current_user_dep),
    db: Session = Depends(get_db)
):
    policy = db.query(Policy).filter(
        Policy.worker_id == current_user.id,
        Policy.status == "active"
    ).first()
    if not policy:
        raise HTTPException(status_code=404, detail="No active policy found")
    return policy