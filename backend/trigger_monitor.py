import requests

ZONE_COORDS = {
    "zone_a": {"lat": 19.076, "lon": 72.877},
    "zone_b": {"lat": 19.120, "lon": 72.900},
    "zone_c": {"lat": 19.050, "lon": 72.850},
}

def check_rain(lat, lon):
    try:
        url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=rain"
        data = requests.get(url).json()
        rain_mm = data["current"]["rain"]
        return rain_mm > 5.0, rain_mm
    except:
        return False, 0

def check_heat(lat, lon):
    try:
        url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=apparent_temperature"
        data = requests.get(url).json()
        feels_like = data["current"]["apparent_temperature"]
        return feels_like > 42, feels_like
    except:
        return False, 0

def check_aqi(city="Mumbai"):
    try:
        url = f"https://api.openaq.org/v2/latest?city={city}&parameter=pm25&limit=1"
        data = requests.get(url).json()
        if data["results"]:
            aqi = data["results"][0]["measurements"][0]["value"]
            return aqi > 150, aqi
        return False, 0
    except:
        return False, 0

def check_flood(zone, rain_active):
    flood_prone = ["zone_a"]
    return rain_active and zone in flood_prone

def check_platform_outage():
    import random
    return random.random() < 0.1

def run_checks(zone="zone_a"):
    coords = ZONE_COORDS.get(zone, {"lat": 19.076, "lon": 72.877})
    lat, lon = coords["lat"], coords["lon"]

    rain, rain_val = check_rain(lat, lon)
    heat, heat_val = check_heat(lat, lon)
    aqi_bad, aqi_val = check_aqi()
    flood = check_flood(zone, rain)
    outage = check_platform_outage()

    triggers = []
    if rain:   triggers.append("heavy_rain")
    if flood:  triggers.append("flood")
    if heat:   triggers.append("extreme_heat")
    if aqi_bad: triggers.append("bad_aqi")
    if outage: triggers.append("platform_outage")

    return {
        "zone": zone,
        "triggers_fired": triggers,
        "readings": {
            "rain_mm": rain_val,
            "feels_like_celsius": heat_val,
            "aqi_pm25": aqi_val,
        }
    }

if __name__ == "__main__":
    result = run_checks("zone_a")
    print(result)