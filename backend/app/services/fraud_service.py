from sqlalchemy.orm import Session
from app.models.claim import Claim
import datetime

def calculate_trust_score(
    worker_id: int,
    zone: str,
    trigger_type: str,
    trigger_hour: int,
    shift_start: int,
    shift_end: int,
    worker_zones: list,
    db: Session
) -> dict:
    score = 1.0
    signals = {}

    # Signal 1 — shift consistency
    # Was the trigger during their normal working hours?
    if shift_start <= trigger_hour <= shift_end:
        signals["shift_match"] = True
    else:
        signals["shift_match"] = False
        score -= 0.25

    # Signal 2 — zone match
    # Did the trigger happen in one of their registered zones?
    worker_zones_lower = [z.lower().strip() for z in worker_zones]
    if zone.lower().strip() in worker_zones_lower:
        signals["zone_match"] = True
    else:
        signals["zone_match"] = False
        score -= 0.3

    # Signal 3 — claim frequency (last 7 days)
    # Too many claims in a short time = suspicious
    week_ago = datetime.datetime.utcnow() - datetime.timedelta(days=7)
    recent_claims = db.query(Claim).filter(
        Claim.worker_id == worker_id,
        Claim.created_at >= week_ago
    ).count()

    signals["recent_claim_count"] = recent_claims
    if recent_claims >= 5:
        score -= 0.3
        signals["high_frequency"] = True
    elif recent_claims >= 3:
        score -= 0.1
        signals["high_frequency"] = False
    else:
        signals["high_frequency"] = False

    # Signal 4 — suspicious timing
    # Claims filed exactly at trigger start = bot-like
    signals["suspicious_timing"] = False
    last_claim = db.query(Claim).filter(
        Claim.worker_id == worker_id
    ).order_by(Claim.created_at.desc()).first()

    if last_claim:
        seconds_since_last = (
            datetime.datetime.utcnow() - last_claim.created_at
        ).total_seconds()
        if seconds_since_last < 60:
            score -= 0.2
            signals["suspicious_timing"] = True

    # Signal 5 — previous fraud flags
    flagged_count = db.query(Claim).filter(
        Claim.worker_id == worker_id,
        Claim.status == "flagged"
    ).count()
    signals["previous_flags"] = flagged_count
    if flagged_count >= 2:
        score -= 0.2

    # Clamp score between 0 and 1
    score = round(max(0.0, min(1.0, score)), 3)

    # Decide path
    if score > 0.7:
        path = "green"
    elif score >= 0.4:
        path = "amber"
    else:
        path = "red"

    return {
        "trust_score": score,
        "trust_path": path,
        "fraud_signals": signals
    }