from sqlalchemy.orm import Session
from app.models.claim import Claim, Payout
from app.models.policy import Policy
from app.models.user import User
from app.services.fraud_service import calculate_trust_score
import datetime, uuid

PAYOUT_RATE = {
    "lite":  40.0,   # ₹ per lost hour
    "smart": 55.0,
    "pro":   70.0,
}

def process_trigger(
    zone: str,
    trigger_type: str,
    duration_hours: float,
    db: Session
) -> list:
    """
    Called when a trigger fires.
    Finds all active policies in that zone,
    checks shift overlap, runs fraud scoring,
    creates claims and payouts automatically.
    """
    now = datetime.datetime.utcnow()
    trigger_hour = now.hour
    results = []

    # Find all active policies in the affected zone
    active_policies = db.query(Policy).filter(
        Policy.status == "active",
        Policy.zone == zone,
        Policy.end_date >= now
    ).all()

    for policy in active_policies:
        worker = db.query(User).filter(User.id == policy.worker_id).first()
        if not worker:
            continue

        # Check if trigger overlaps with worker's shift
        shift_start = worker.shift_start_hour or 0
        shift_end = worker.shift_end_hour or 23

        shift_active = shift_start <= trigger_hour <= shift_end
        if not shift_active:
            continue   # trigger didn't happen during their shift, skip

        # Calculate lost hours (overlap between trigger and shift)
        lost_hours = min(duration_hours, shift_end - shift_start)
        lost_hours = round(max(0.5, lost_hours), 2)

        # Estimate payout
        rate = PAYOUT_RATE.get(policy.plan, 50.0)
        estimated_payout = round(lost_hours * rate, 2)

        # Run fraud/trust scoring
        fraud_result = calculate_trust_score(
            worker_id=worker.id,
            zone=zone,
            trigger_type=trigger_type,
            trigger_hour=trigger_hour,
            shift_start=shift_start,
            shift_end=shift_end,
            worker_zones=worker.work_zones or [],
            db=db
        )

        # Create the claim
        claim = Claim(
            worker_id=worker.id,
            policy_id=policy.id,
            trigger_type=trigger_type,
            zone=zone,
            lost_hours=lost_hours,
            estimated_payout=estimated_payout,
            trust_score=fraud_result["trust_score"],
            trust_path=fraud_result["trust_path"],
            fraud_signals=fraud_result["fraud_signals"],
            status="pending"
        )
        db.add(claim)
        db.flush()   # get claim.id

        # Route based on trust path
        if fraud_result["trust_path"] == "green":
            claim.status = "approved"
            _create_payout(claim, db)

        elif fraud_result["trust_path"] == "amber":
            claim.status = "pending"   # held for recheck

        else:  # red
            claim.status = "flagged"

        db.commit()
        db.refresh(claim)
        results.append(claim)

    return results


def _create_payout(claim: Claim, db: Session):
    """Create a mock payout for an approved claim."""
    payout = Payout(
        claim_id=claim.id,
        worker_id=claim.worker_id,
        amount=claim.estimated_payout,
        status="processing",
        payment_ref=f"PAY-{uuid.uuid4().hex[:8].upper()}",
        paid_at=datetime.datetime.utcnow()
    )
    db.add(payout)
    payout.status = "paid"   # mock: instantly paid