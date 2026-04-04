import numpy as np
from sklearn.ensemble import GradientBoostingRegressor
import joblib, os

# --- Risk tables ---

ZONE_RISK = {
    "zone a": 0.8,
    "zone b": 0.55,
    "zone c": 0.2,    # safe zone — gets discount
    "zone d": 0.7,
    "zone e": 0.4,
}

SHIFT_RISK = {
    "morning":   0.3,
    "afternoon": 0.5,
    "evening":   0.8,   # peak rain hours
    "night":     0.6,
}

PLAN_CONFIG = {
    "lite": {
        "coverage_multiplier": 0.7,
        "protected_hours": 10,
        "max_payout": 500.0,
        "base_weekly_premium": 49,
        "covered_triggers": ["heavy_rain", "flood"],
        "description": "Basic protection for light workers"
    },
    "smart": {
        "coverage_multiplier": 1.0,
        "protected_hours": 20,
        "max_payout": 1200.0,
        "base_weekly_premium": 99,
        "covered_triggers": ["heavy_rain", "flood", "extreme_heat", "bad_aqi"],
        "description": "Balanced protection — recommended for most workers"
    },
    "pro": {
        "coverage_multiplier": 1.4,
        "protected_hours": 35,
        "max_payout": 2500.0,
        "base_weekly_premium": 179,
        "covered_triggers": ["heavy_rain", "flood", "extreme_heat", "bad_aqi", "platform_outage"],
        "description": "Full protection including platform outages"
    },
}

MODEL_PATH = os.path.join(os.path.dirname(__file__), "premium_model.pkl")


def _train_and_save():
    """Train a simple GBR model on synthetic data and save it."""
    np.random.seed(42)
    n = 1000
    zone_risks        = np.random.uniform(0.1, 1.0, n)
    shift_risks       = np.random.uniform(0.1, 1.0, n)
    weather_risks     = np.random.uniform(0.0, 1.0, n)
    avg_weekly_hours  = np.random.uniform(20, 60, n)

    # Ground truth premium formula
    premium = (
        30
        + zone_risks       * 20
        + shift_risks      * 15
        + weather_risks    * 10
        + avg_weekly_hours * 0.3
        + np.random.normal(0, 2, n)
    )

    X = np.column_stack([zone_risks, shift_risks, weather_risks, avg_weekly_hours])
    model = GradientBoostingRegressor(n_estimators=100, max_depth=3, random_state=42)
    model.fit(X, premium)
    joblib.dump(model, MODEL_PATH)
    return model


def _load_model():
    if not os.path.exists(MODEL_PATH):
        return _train_and_save()
    return joblib.load(MODEL_PATH)


def calculate_premium(
    zone: str,
    shift: str,
    weather_history_risk: float,
    avg_weekly_hours: float,
    plan: str
) -> dict:
    """
    Weekly Premium = Base Premium
                   + Zone Risk Load
                   + Shift Risk Load
                   + Coverage Multiplier effect
                   - Safe Profile Discount
    """
    model = _load_model()

    zone_key  = zone.lower().strip()
    shift_key = shift.lower().strip()

    zone_risk  = ZONE_RISK.get(zone_key, 0.5)
    shift_risk = SHIFT_RISK.get(shift_key, 0.5)

    # ML model predicts base premium
    X = np.array([[zone_risk, shift_risk, weather_history_risk, avg_weekly_hours]])
    base_premium = float(model.predict(X)[0])

    # Component breakdown (matches README formula)
    zone_risk_load       = round(zone_risk * 20, 2)
    shift_risk_load      = round(shift_risk * 15, 2)
    coverage_multiplier  = PLAN_CONFIG[plan]["coverage_multiplier"]
    safe_profile_discount = 2.0 if zone_risk < 0.3 else 0.0

    final_premium = (
        (base_premium + zone_risk_load + shift_risk_load)
        * coverage_multiplier
        - safe_profile_discount
    )
    final_premium = round(max(final_premium, 10.0), 2)

    return {
        "plan": plan,
        "weekly_premium": final_premium,
        "protected_hours": PLAN_CONFIG[plan]["protected_hours"],
        "max_payout": PLAN_CONFIG[plan]["max_payout"],
        "covered_triggers": PLAN_CONFIG[plan]["covered_triggers"],
        "breakdown": {
            "base_premium":          round(base_premium, 2),
            "zone_risk_load":        zone_risk_load,
            "shift_risk_load":       shift_risk_load,
            "coverage_multiplier":   coverage_multiplier,
            "safe_profile_discount": safe_profile_discount,
            "final_premium":         final_premium,
        }
    }