from flask import Flask, jsonify, request
from flask_cors import CORS
import joblib
import pandas as pd
import numpy as np
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)

# --- SYSTEM INITIALIZATION ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ARTIFACTS = {
    'model': os.path.join(BASE_DIR, 'models', 'seismo_xgb_model.joblib'),
    'scaler': os.path.join(BASE_DIR, 'models', 'coords_scaler.joblib'),
    'le': os.path.join(BASE_DIR, 'models', 'label_encoder.joblib')
}
PROCESSED_DATA_PATH = os.path.abspath(os.path.join(BASE_DIR, '..', 'data', 'processed_seismic_data.csv'))

STATE = {'loaded': False}
app.zone_severity_map = {}

def load_system():
    try:
        app.model = joblib.load(ARTIFACTS['model'])
        app.scaler = joblib.load(ARTIFACTS['scaler'])
        app.le = joblib.load(ARTIFACTS['le'])
        
        # Load zone severity data for feature engineering
        if os.path.exists(PROCESSED_DATA_PATH):
            df_hist = pd.read_csv(PROCESSED_DATA_PATH)
            app.zone_severity_map = df_hist.groupby('zone')['mag'].max().to_dict()
            app.historical_data = df_hist
        
        STATE['loaded'] = True
        print(f"[SUCCESS] Core v4.3 Online. Loaded from {BASE_DIR}")
    except Exception as e:
        print(f"[CRITICAL] Loading Failed: {e}")

load_system()

@app.route('/')
def index():
    return jsonify({
        "status": "online",
        "system": "SeismoSense Intelligence Core",
        "version": "4.3.2",
        "endpoints": ["/api/predict", "/api/historical_dataset"]
    })

@app.route('/api/predict', methods=['POST'])
def predict_hazard():
    if not STATE['loaded']:
        return jsonify({"status": "error", "message": "Intelligence Core Offline."})
    
    data = request.json
    try:
        lat = float(data['lat'])
        lon = float(data['lon'])
        depth = float(data['depth'])
        now = datetime.now()
        
        # --- ENHANCED FEATURE ENGINEERING (v4.3) ---
        # 1. TSL Calibration
        df_hist = app.historical_data
        df_hist['time'] = pd.to_datetime(df_hist['time'])
        tsl = (now - df_hist['time'].max()).total_seconds() / 3600
        
        # 2. Zone & Severity lookup (Nearest-Neighbor Spatial Context)
        distances = np.sqrt((df_hist['lat'] - lat)**2 + (df_hist['lon'] - lon)**2)
        nearest_idx = distances.idxmin()
        zone = int(df_hist.iloc[nearest_idx]['zone'])
        zone_severity = app.zone_severity_map.get(zone, 4.5) # Default to low if unknown

        # Feature Vector: [lat, lon, depth, hour, month, day_of_week, tsl, zone, zone_severity]
        features = [lat, lon, depth, now.hour, now.month, now.weekday(), tsl, zone, zone_severity]
        input_df = pd.DataFrame([features], columns=['lat', 'lon', 'depth', 'hour', 'month', 'day_of_week', 'tsl', 'zone', 'zone_severity'])
        
        # --- PROBABILISTIC INFERENCE ---
        probs = app.model.predict_proba(input_df)[0]
        class_probs = dict(zip(app.le.classes_, probs))
        
        # Determine the winner
        hazard_class = app.le.classes_[np.argmax(probs)]
        confidence = np.max(probs)
        
        # --- SCIENTIFIC ACCURACY (v4.3.2) ---
        # 1. Exponential Depth Decay: Hazard potential drops exponentially with depth.
        # Constant of 120km: at 120km risk is 36%, at 600km risk is <1%.
        depth_decay = np.exp(-depth / 120.0)
        
        # 2. Risk Score math:
        high_risk_prob = class_probs.get('HIGH', 0.0)
        med_risk_prob = class_probs.get('MEDIUM', 0.0)
        severity_factor = (zone_severity / 10)
        
        # Base score from regional probability + historical severity
        base_score = (high_risk_prob * 8.0 + med_risk_prob * 4.0 + severity_factor * 2.0)
        risk_score = base_score * depth_decay
        risk_score = min(max(risk_score, 0.5), 10.0)
        
        # 3. Physical Safety Ceiling (v4.3.2 GATE)
        # Deep events (300km+) are physically incapable of surface hazard.
        if depth >= 300:
            threat_level = "NOMINAL"
            final_hazard = "LOW"
            risk_score = min(risk_score, 2.5) # Force low score for deep quakes
        else:
            threat_level = "CRITICAL" if risk_score >= 6.8 else ("ELEVATED" if risk_score > 4.5 else "NOMINAL")
            final_hazard = "HIGH" if risk_score >= 6.5 or (high_risk_prob > 0.4 and depth < 50) else hazard_class

        return jsonify({
            "status": "success",
            "prediction": str(final_hazard),
            "confidence": f"{float(confidence)*100:.1f}%",
            "risk_score": round(float(risk_score), 2),
            "threat_level": str(threat_level),
            "context": {
                "tsl_hours": round(float(tsl), 1),
                "estimated_zone": int(zone),
                "historical_severity": float(zone_severity),
                "high_risk_prob": round(float(high_risk_prob), 3)
            },
            "timestamp": now.strftime("%Y-%m-%d %H:%M:%S")
        })
        
    except Exception as e:
        return jsonify({"status": "error", "message": f"Intelligence CORE Processing Fault: {str(e)}"})

@app.route('/api/historical_dataset')
def get_historical_dataset():
    if not os.path.exists(PROCESSED_DATA_PATH):
        return jsonify({"status": "error", "message": "Dataset not found"})
    df = pd.read_csv(PROCESSED_DATA_PATH).replace({np.nan: None})
    return jsonify({"status": "success", "data": df.to_dict(orient='records')})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
