from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.claim import Claim
from app.models.user import User
from app.schemas.claim import ClaimResponse, ClaimStatusUpdate
from app.services.claim_service import process_trigger
from app.routers.auth import get_current_user_dep

router = APIRouter(prefix="/api/claims", tags=["Claims"])

@router.get("/", response_model=None)
def get_my_claims(
    current_user: User = Depends(get_current_user_dep),
    db: Session = Depends(get_db)
):
    claims = db.query(Claim).filter(
        Claim.worker_id == current_user.id
    ).order_by(Claim.created_at.desc()).all()
    return claims

@router.get("/{claim_id}", response_model=None)
def get_claim(
    claim_id: str,
    current_user: User = Depends(get_current_user_dep),
    db: Session = Depends(get_db)
):
    claim = db.query(Claim).filter(Claim.id == claim_id).first()
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")
    if claim.worker_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your claim")
    return claim

@router.patch("/{claim_id}/status")
def update_claim_status(
    claim_id: str,
    update: ClaimStatusUpdate,
    current_user: User = Depends(get_current_user_dep),
    db: Session = Depends(get_db)
):
    if not current_user.email.endswith("@admin.com"):
        raise HTTPException(status_code=403, detail="Admin only")
    claim = db.query(Claim).filter(Claim.id == claim_id).first()
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")
    claim.status = update.status
    db.commit()
    return {"message": f"Claim {claim_id} updated to {update.status}"}

@router.post("/simulate-trigger")
def simulate_trigger(
    zone: str,
    trigger_type: str,
    duration_hours: float = 2.0,
    current_user: User = Depends(get_current_user_dep),
    db: Session = Depends(get_db)
):
    claims = process_trigger(zone, trigger_type, duration_hours, db)
    return {
        "message": f"{len(claims)} claims created",
        "claims": [
            {
                "claim_id": str(c.id),
                "worker_id": str(c.worker_id),
                "trust_path": c.trust_path,
                "status": c.status,
                "payout": c.estimated_payout
            }
            for c in claims
        ]
    }

@router.get("/admin/all", response_model=None)
def get_all_claims(
    current_user: User = Depends(get_current_user_dep),
    db: Session = Depends(get_db)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin only")
    claims = db.query(Claim).order_by(Claim.created_at.desc()).all()
    return claims

@router.get("/public/zone-report", response_model=None)
def zone_report(
    zone: str,
    trigger_type: str,
    db: Session = Depends(get_db)
):
    from datetime import datetime, timedelta
    cutoff = datetime.utcnow() - timedelta(hours=24)
    
    count = db.query(Claim).filter(
        Claim.zone == zone,
        Claim.trigger_type == trigger_type,
        Claim.created_at >= cutoff,
        Claim.status.in_(["approved", "green", "amber", "pending"])
    ).count()

    affected_zones = db.query(Claim.zone).filter(
        Claim.trigger_type == trigger_type,
        Claim.created_at >= cutoff,
        Claim.status.in_(["approved", "green", "amber", "pending"])
    ).distinct().count()

    return {
        "zone": zone,
        "trigger_type": trigger_type,
        "workers_affected": count,
        "zones_affected": affected_zones,
        "severity": "high" if count >= 5 else "medium" if count >= 2 else "low"
    }