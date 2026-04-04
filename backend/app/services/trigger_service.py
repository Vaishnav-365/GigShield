"""
Trigger Monitoring Service — GigShield AI
Polls weather, AQI, and mock platform signals every 5 minutes.
Falls back to realistic mock data if API keys are absent.
"""

import os
import random
import logging
from datetime import datetime, timezone
from typing import Optional

import httpx
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.trigger import TriggerEvent

logger = logging.getLogger("gigshield.triggers")

# ---------------------------------------------------------------------------
# Config — pulled from environment, graceful fallback to None
# ---------------------------------------------------------------------------
OWM_API_KEY  = os.getenv("OWM_API_KEY")   # OpenWeatherMap
WAQI_TOKEN   = os.getenv("WAQI_TOKEN")    # World Air Quality Index

# Zones to monitor — these must match the zone strings stored in User.work_zones
# In production these would be fetched from the DB; hard-code for now so the
# poller works without any users registered yet.
MONITORED_ZONES: list[dict] = [
    {"zone": "Zone A", "lat": 12.9716, "lon": 77.5946, "city": "Bangalore Central"},
    {"zone": "Zone B", "lat": 13.0358, "lon": 77.5970, "city": "Bangalore North"},
    {"zone": "Zone C", "lat": 19.0760, "lon": 72.8777, "city": "Mumbai West"},
    {"zone": "Zone D", "lat": 28.6139, "lon": 77.2090, "city": "Delhi NCR"},
]

# ---------------------------------------------------------------------------
# Thresholds
# ---------------------------------------------------------------------------
RAIN_MM_MEDIUM  = 15.0   # mm/hr
RAIN_MM_HIGH    = 40.0

HEAT_C_MEDIUM   = 38.0   # °C
HEAT_C_HIGH     = 42.0

AQI_MEDIUM      = 150
AQI_HIGH        = 200

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _severity_from_value(value: float, medium_thresh: float, high_thresh: float) -> str:
    if value >= high_thresh:
        return "high"
    if value >= medium_thresh:
        return "medium"
    return "low"


def _write_event(
    db: Session,
    trigger_type: str,
    zone: str,
    severity: str,
    raw_data: dict,
) -> TriggerEvent:
    """
    Insert a new TriggerEvent row and deactivate any previous active event
    of the same type in the same zone (so history stays clean).
    """
    # Close the previous open event for this type+zone if it exists
    db.query(TriggerEvent).filter(
        TriggerEvent.trigger_type == trigger_type,
        TriggerEvent.zone == zone,
        TriggerEvent.is_active == True,
    ).update({"is_active": False, "ended_at": datetime.now(timezone.utc)})

    event = TriggerEvent(
        trigger_type=trigger_type,
        zone=zone,
        severity=severity,
        started_at=datetime.now(timezone.utc),
        is_active=True,
        raw_data=raw_data,
    )
    db.add(event)
    db.commit()
    db.refresh(event)
    logger.info("Trigger fired: %s | %s | %s", trigger_type, zone, severity)
    return event


def _resolve_stale_events(db: Session, trigger_type: str, zones_that_fired: list[str]):
    """
    For zones where the trigger did NOT fire this round, close any previously
    open events so is_active stays accurate.
    """
    db.query(TriggerEvent).filter(
        TriggerEvent.trigger_type == trigger_type,
        TriggerEvent.is_active == True,
        TriggerEvent.zone.notin_(zones_that_fired),
    ).update({"is_active": False, "ended_at": datetime.now(timezone.utc)})
    db.commit()


# ---------------------------------------------------------------------------
# Trigger 1 — Heavy Rain
# ---------------------------------------------------------------------------

async def _fetch_rain_real(lat: float, lon: float) -> Optional[float]:
    """Returns mm/hr from OWM current weather, or None on failure."""
    try:
        async with httpx.AsyncClient(timeout=8) as client:
            r = await client.get(
                "https://api.openweathermap.org/data/2.5/weather",
                params={"lat": lat, "lon": lon, "appid": OWM_API_KEY, "units": "metric"},
            )
            r.raise_for_status()
            data = r.json()
            return float(data.get("rain", {}).get("1h", 0.0))
    except Exception as e:
        logger.warning("OWM rain fetch failed: %s", e)
        return None


def _mock_rain(zone: str) -> float:
    """
    Deterministic-ish mock so the demo always shows some variety.
    Zone A fires heavily to guarantee visible triggers.
    """
    if zone == "Zone A":
        return random.choice([0, 0, 12, 22, 45, 55])
    return random.choice([0, 0, 0, 8, 18, 35])


async def check_heavy_rain(db: Session):
    zones_fired = []
    for z in MONITORED_ZONES:
        if OWM_API_KEY:
            mm = await _fetch_rain_real(z["lat"], z["lon"])
            if mm is None:
                mm = _mock_rain(z["zone"])
        else:
            mm = _mock_rain(z["zone"])

        if mm >= RAIN_MM_MEDIUM:
            severity = _severity_from_value(mm, RAIN_MM_MEDIUM, RAIN_MM_HIGH)
            _write_event(db, "heavy_rain", z["zone"], severity, {
                "rain_mm_per_hour": mm,
                "city": z["city"],
                "source": "owm" if OWM_API_KEY else "mock",
            })
            zones_fired.append(z["zone"])

    _resolve_stale_events(db, "heavy_rain", zones_fired)


# ---------------------------------------------------------------------------
# Trigger 2 — Extreme Heat / Heat Index
# ---------------------------------------------------------------------------

async def _fetch_heat_real(lat: float, lon: float) -> Optional[dict]:
    try:
        async with httpx.AsyncClient(timeout=8) as client:
            r = await client.get(
                "https://api.openweathermap.org/data/2.5/weather",
                params={"lat": lat, "lon": lon, "appid": OWM_API_KEY, "units": "metric"},
            )
            r.raise_for_status()
            d = r.json()
            return {
                "temp_c": d["main"]["temp"],
                "feels_like_c": d["main"]["feels_like"],
                "humidity": d["main"]["humidity"],
            }
    except Exception as e:
        logger.warning("OWM heat fetch failed: %s", e)
        return None


def _mock_heat(zone: str) -> dict:
    base = {"Zone C": 40, "Zone D": 41}.get(zone, 33)
    temp = base + random.uniform(-2, 3)
    return {
        "temp_c": round(temp, 1),
        "feels_like_c": round(temp + random.uniform(1, 4), 1),
        "humidity": random.randint(30, 70),
    }


async def check_extreme_heat(db: Session):
    zones_fired = []
    for z in MONITORED_ZONES:
        if OWM_API_KEY:
            data = await _fetch_heat_real(z["lat"], z["lon"])
            if data is None:
                data = _mock_heat(z["zone"])
        else:
            data = _mock_heat(z["zone"])

        # Use feels_like as the trigger value — more relevant for workers
        feels_like = data["feels_like_c"]
        if feels_like >= HEAT_C_MEDIUM:
            severity = _severity_from_value(feels_like, HEAT_C_MEDIUM, HEAT_C_HIGH)
            _write_event(db, "extreme_heat", z["zone"], severity, {
                **data,
                "city": z["city"],
                "source": "owm" if OWM_API_KEY else "mock",
            })
            zones_fired.append(z["zone"])

    _resolve_stale_events(db, "extreme_heat", zones_fired)


# ---------------------------------------------------------------------------
# Trigger 3 — Severe AQI
# ---------------------------------------------------------------------------

async def _fetch_aqi_real(lat: float, lon: float) -> Optional[float]:
    try:
        async with httpx.AsyncClient(timeout=8) as client:
            r = await client.get(
                f"https://api.waqi.info/feed/geo:{lat};{lon}/",
                params={"token": WAQI_TOKEN},
            )
            r.raise_for_status()
            d = r.json()
            if d.get("status") == "ok":
                return float(d["data"]["aqi"])
        return None
    except Exception as e:
        logger.warning("WAQI fetch failed: %s", e)
        return None


def _mock_aqi(zone: str) -> float:
    if zone == "Zone D":   # Delhi — always high
        return random.choice([160, 180, 210, 240, 175])
    return random.choice([60, 80, 100, 155, 190, 70])


async def check_severe_aqi(db: Session):
    zones_fired = []
    for z in MONITORED_ZONES:
        if WAQI_TOKEN:
            aqi = await _fetch_aqi_real(z["lat"], z["lon"])
            if aqi is None:
                aqi = _mock_aqi(z["zone"])
        else:
            aqi = _mock_aqi(z["zone"])

        if aqi >= AQI_MEDIUM:
            severity = _severity_from_value(aqi, AQI_MEDIUM, AQI_HIGH)
            _write_event(db, "severe_aqi", z["zone"], severity, {
                "aqi": aqi,
                "city": z["city"],
                "source": "waqi" if WAQI_TOKEN else "mock",
            })
            zones_fired.append(z["zone"])

    _resolve_stale_events(db, "severe_aqi", zones_fired)


# ---------------------------------------------------------------------------
# Trigger 4 — Flood / Waterlogging (mock)
# ---------------------------------------------------------------------------

FLOOD_PRONE_ZONES = {"Zone C", "Zone B"}   # coastal / low-lying

def _mock_flood(zone: str) -> Optional[dict]:
    """
    Simulates a government flood-alert feed.
    Flood-prone zones fire more often; all zones have a small chance.
    """
    chance = 0.35 if zone in FLOOD_PRONE_ZONES else 0.08
    if random.random() < chance:
        level_cm = random.randint(15, 80)
        return {
            "water_level_cm": level_cm,
            "alert_source": "mock_ndrf_feed",
            "road_closures": random.randint(1, 5),
        }
    return None


async def check_flood(db: Session):
    zones_fired = []
    for z in MONITORED_ZONES:
        data = _mock_flood(z["zone"])
        if data:
            level = data["water_level_cm"]
            severity = "high" if level > 50 else "medium" if level > 25 else "low"
            _write_event(db, "flood", z["zone"], severity, {
                **data,
                "city": z["city"],
            })
            zones_fired.append(z["zone"])

    _resolve_stale_events(db, "flood", zones_fired)


# ---------------------------------------------------------------------------
# Trigger 5 — Platform Outage / Order Collapse (mock)
# ---------------------------------------------------------------------------

# Tracks simulated order rates per zone to detect a sudden drop
_last_order_rate: dict[str, float] = {}


def _mock_platform_outage(zone: str) -> Optional[dict]:
    """
    Simulates an order-rate telemetry feed.
    Randomly drops one zone's order rate by >60% to trigger an outage event.
    """
    normal_rate = random.uniform(40, 80)   # orders/hr baseline
    if zone not in _last_order_rate:
        _last_order_rate[zone] = normal_rate
        return None

    previous = _last_order_rate[zone]
    # 12% chance of a sudden collapse in any zone
    if random.random() < 0.12:
        current = previous * random.uniform(0.05, 0.35)   # 65–95 % drop
    else:
        current = previous * random.uniform(0.85, 1.15)   # normal fluctuation

    _last_order_rate[zone] = current
    drop_pct = (previous - current) / previous * 100

    if drop_pct >= 60:
        return {
            "previous_orders_per_hr": round(previous, 1),
            "current_orders_per_hr": round(current, 1),
            "drop_percent": round(drop_pct, 1),
            "platform": "mock_aggregator",
        }
    return None


async def check_platform_outage(db: Session):
    zones_fired = []
    for z in MONITORED_ZONES:
        data = _mock_platform_outage(z["zone"])
        if data:
            drop = data["drop_percent"]
            severity = "high" if drop >= 80 else "medium"
            _write_event(db, "platform_outage", z["zone"], severity, {
                **data,
                "city": z["city"],
            })
            zones_fired.append(z["zone"])

    _resolve_stale_events(db, "platform_outage", zones_fired)


# ---------------------------------------------------------------------------
# Master poll function — called by the scheduler
# ---------------------------------------------------------------------------

async def run_all_triggers():
    """Run every trigger check against every zone. Called every 5 minutes."""
    logger.info("=== Trigger poll started at %s ===", datetime.now(timezone.utc).isoformat())
    db: Session = SessionLocal()
    try:
        await check_heavy_rain(db)
        await check_extreme_heat(db)
        await check_severe_aqi(db)
        await check_flood(db)
        await check_platform_outage(db)
        logger.info("=== Trigger poll complete ===")
    except Exception as e:
        logger.exception("Trigger poll crashed: %s", e)
        db.rollback()
    finally:
        db.close()
