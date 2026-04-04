import numpy as np
from sklearn.ensemble import GradientBoostingRegressor
import joblib
import os

ZONE_RISK = {
    "zone_a": 0.8,
    "zone_b": 0.4,
    "zone_c": 0.2,
}

SHIFT_RISK = {
    "morning": 0.3,
    "afternoon": 0.5,
    "evening": 0.8,
    "night": 0.6,
}

PLAN_MULTIPLIERS = {
    "lite": 0.7,
    "smart": 1.0,
    "pro": 1.4,
}

def train_and_save():
    np.random.seed(42)
    n = 500
    zone_risks = np.random.uniform(0.1, 1.0, n)
    shift_risks = np.random.uniform(0.1, 1.0, n)
    weather_risk = np.random.uniform(0.0, 1.0, n)
    avg_weekly_hours = np.random.uniform(20, 60, n)

    premium = (
        30
        + zone_risks * 20
        + shift_risks * 15
        + weather_risk * 10
        + avg_weekly_hours * 0.3
        + np.random.normal(0, 2, n)
    )

    X = np.column_stack([zone_risks, shift_risks, weather_risk, avg_weekly_hours])
    model = GradientBoostingRegressor(n_estimators=100, max_depth=3)
    model.fit(X, y=premium)

    model_path = os.path.join(os.path.dirname(__file__), "premium_model.pkl")
    joblib.dump(model, model_path)
    print("Model trained and saved.")

def calculate_premium(zone: str, shift: str, weather_history_risk: float,
                       avg_weekly_hours: float, plan: str) -> dict:
    model_path = os.path.join(os.path.dirname(__file__), "premium_model.pkl")
    if not os.path.exists(model_path):
        train_and_save()
    model = joblib.load(model_path)

    zone_risk = ZONE_RISK.get(zone, 0.5)
    shift_risk = SHIFT_RISK.get(shift, 0.5)

    X = np.array([[zone_risk, shift_risk, weather_history_risk, avg_weekly_hours]])
    base_premium = float(model.predict(X)[0])

    final_premium = base_premium * PLAN_MULTIPLIERS[plan]
    discount = 2.0 if zone_risk < 0.3 else 0.0
    final_premium -= discount

    return {
        "base_premium": round(base_premium, 2),
        "plan": plan,
        "safe_zone_discount": discount,
        "final_premium": round(max(final_premium, 10), 2),
    }

if __name__ == "__main__":
    train_and_save()