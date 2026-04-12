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
        hazard_type = data.get('hazard_type', 'SEISMIC').upper()
        now = datetime.now()
        
        # --- ENHANCED FEATURE ENGINEERING ---
        df_hist = app.historical_data
        df_hist['time'] = pd.to_datetime(df_hist['time'])
        tsl = (now - df_hist['time'].max()).total_seconds() / 3600
        
        distances = np.sqrt((df_hist['lat'] - lat)**2 + (df_hist['lon'] - lon)**2)
        nearest_idx = distances.idxmin()
        zone = int(df_hist.iloc[nearest_idx]['zone'])
        zone_severity = app.zone_severity_map.get(zone, 4.5)

        features = [lat, lon, depth, now.hour, now.month, now.weekday(), tsl, zone, zone_severity]
        input_df = pd.DataFrame([features], columns=['lat', 'lon', 'depth', 'hour', 'month', 'day_of_week', 'tsl', 'zone', 'zone_severity'])
        
        # Probabilistic Base
        probs = app.model.predict_proba(input_df)[0]
        class_probs = dict(zip(app.le.classes_, probs))
        high_risk_prob = class_probs.get('HIGH', 0.0)
        med_risk_prob = class_probs.get('MEDIUM', 0.0)
        
        # --- MULTI-HAZARD SCORING MATRIX ---
        depth_decay = np.exp(-depth / 120.0)
        base_risk = (high_risk_prob * 8.0 + med_risk_prob * 4.0 + (zone_severity / 10) * 2.0)
        
        if hazard_type == 'TSUNAMI':
            # Tsunami specific: requires high magnitude, shallow depth, and usually coastal
            # Depth < 50km is critical for tsunamis
            tsunami_multiplier = 1.5 if depth < 50 else (0.1 if depth > 100 else 0.5)
            # Higher weight on 'HIGH' probability (which correlates with high magnitude)
            risk_score = (high_risk_prob * 12.0 + (zone_severity / 10) * 3.0) * tsunami_multiplier
            hazard_label = "SURGE_RISK"
        elif hazard_type == 'VULNERABILITY':
            # Infrastructure focus: heavily weighted by spatial severity (urban density proxy)
            risk_score = (high_risk_prob * 5.0 + med_risk_prob * 3.0 + (zone_severity / 10) * 5.0) * depth_decay
            hazard_label = "STRUCTURE_LOSS"
        else: # SEISMIC
            risk_score = base_risk * depth_decay
            hazard_label = "TECTONIC_SHIFT"

        # Normalize 0.5 - 10.0
        risk_score = min(max(risk_score, 0.5), 10.0)
        
        # Physical Safety Ceiling
        if depth >= 300 and hazard_type != 'TSUNAMI': # Tsunamis are always surface-impact
            threat_level = "NOMINAL"
            final_hazard = "LOW"
            risk_score = min(risk_score, 2.5)
        else:
            threat_level = "CRITICAL" if risk_score >= 6.8 else ("ELEVATED" if risk_score > 4.5 else "NOMINAL")
            final_hazard = "HIGH" if risk_score >= 6.5 else ("MEDIUM" if risk_score > 4.0 else "LOW")

        return jsonify({
            "status": "success",
            "prediction": str(final_hazard),
            "hazard_label": hazard_label,
            "hazard_type": hazard_type,
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
