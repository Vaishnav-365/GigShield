from sqlalchemy.orm import Session
from app.models.claim import Claim
from app.models.user import User
import datetime

def calculate_gigscore(worker_id, db: Session) -> dict:
    now = datetime.datetime.utcnow()
    thirty_days_ago = now - datetime.timedelta(days=30)

    all_claims = db.query(Claim).filter(
        Claim.worker_id == worker_id
    ).all()

    recent_claims = [c for c in all_claims if c.created_at >= thirty_days_ago]

    approved = [c for c in all_claims if c.status in ("approved", "green")]
    flagged = [c for c in all_claims if c.status == "flagged" or c.status == "red"]
    pending = [c for c in all_claims if c.status == "amber"]

    score = 50.0

    # Positive signals
    score += len(approved) * 8
    score += min(len(all_claims), 10) * 2

    # Negative signals
    score -= len(flagged) * 15
    score -= len(pending) * 2

    # Bonus for clean recent history
    recent_flags = [c for c in recent_claims if c.status in ("flagged", "red")]
    if len(recent_claims) > 0 and len(recent_flags) == 0:
        score += 10

    # Clamp between 0 and 100
    score = round(max(0.0, min(100.0, score)), 1)

    # Calculate premium discount
    if score >= 80:
        discount_pct = 15
        tier = "Platinum"
        tier_color = "amber"
    elif score >= 60:
        discount_pct = 8
        tier = "Gold"
        tier_color = "yellow"
    elif score >= 40:
        discount_pct = 3
        tier = "Silver"
        tier_color = "slate"
    else:
        discount_pct = 0
        tier = "Bronze"
        tier_color = "orange"

    return {
        "score": score,
        "tier": tier,
        "tier_color": tier_color,
        "discount_pct": discount_pct,
        "total_claims": len(all_claims),
        "approved_claims": len(approved),
        "flagged_claims": len(flagged),
        "breakdown": {
            "base": 50,
            "approved_bonus": min(len(approved) * 8, 40),
            "history_bonus": min(len(all_claims) * 2, 20),
            "flag_penalty": len(flagged) * 15,
            "clean_recent_bonus": 10 if len(recent_claims) > 0 and len(recent_flags) == 0 else 0,
        }
    }

def update_gigscore(worker_id, db: Session):
    result = calculate_gigscore(worker_id, db)
    worker = db.query(User).filter(User.id == worker_id).first()
    if worker:
        worker.gigscore = result["score"]
        db.commit()
    return result