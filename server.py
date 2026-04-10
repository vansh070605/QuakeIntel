from flask import Flask, render_template, jsonify, request
from flask_cors import CORS
import joblib
import pandas as pd
import numpy as np
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)

# --- SYSTEM INITIALIZATION ---
ARTIFACTS = {
    'model': 'seismo_xgb_model.joblib',
    'scaler': 'coords_scaler.joblib',
    'le': 'label_encoder.joblib'
}

STATE = {'loaded': False}

def load_system():
    try:
        app.model = joblib.load(ARTIFACTS['model'])
        app.scaler = joblib.load(ARTIFACTS['scaler'])
        app.le = joblib.load(ARTIFACTS['le'])
        STATE['loaded'] = True
        print("[SUCCESS] SeismoSense Intelligence Core Loaded.")
    except Exception as e:
        print(f"[CRITICAL] Loading Failed: {e}. Check if SeismoSense_Complete.ipynb was run.")

load_system()

@app.route('/')
def index():
    return jsonify({
        "status": "online",
        "system": "SeismoSense Intelligence Core",
        "version": "4.2.0",
        "endpoints": ["/api/predict", "/api/historical_dataset"]
    })

@app.route('/api/seismic-data')
def get_historical_data():
    """Serves a compressed GeoJSON of processed seismic records."""
    if not os.path.exists('processed_seismic_data.csv'):
        return jsonify({"type": "FeatureCollection", "features": []})
    
    df = pd.read_csv('processed_seismic_data.csv')
    features = []
    for _, row in df.iterrows():
        features.append({
            "type": "Feature",
            "geometry": {"type": "Point", "coordinates": [row['lon'], row['lat']]},
            "properties": {
                "mag": row['mag'],
                "depth": row['depth'],
                "risk": round(row.get('risk_score', 0), 2),
                "place": row.get('place', 'Seismic Zone'),
                "time": str(row['time'])
            }
        })
    return jsonify({"type": "FeatureCollection", "features": features})

@app.route('/api/predict', methods=['POST'])
def predict_hazard():
    """Real-time coordination of classification and risk scoring."""
    if not STATE['loaded']:
        return jsonify({"status": "error", "message": "Intelligence Core Offline."})
    
    data = request.json
    try:
        lat = float(data['lat'])
        lon = float(data['lon'])
        depth = float(data['depth'])
        
        # --- FEATURE ENGINEERING (DYNAMIC CONTEXT) ---
        now = datetime.now()
        
        # 1. Calculate TSL (Time Since Last) relative to our dataset
        tsl = 24.0 # Default
        if os.path.exists('processed_seismic_data.csv'):
            df_hist = pd.read_csv('processed_seismic_data.csv')
            df_hist['time'] = pd.to_datetime(df_hist['time'])
            latest_time = df_hist['time'].max()
            tsl = (now - latest_time).total_seconds() / 3600
        
        # 2. Estimate Zone (DBSCAN fallback)
        # Find the nearest known point in our processed data and use its zone
        zone = -1
        if os.path.exists('processed_seismic_data.csv'):
            df_hist = pd.read_csv('processed_seismic_data.csv')
            # Simple Euclidean distance for zone estimation
            distances = np.sqrt((df_hist['lat'] - lat)**2 + (df_hist['lon'] - lon)**2)
            nearest_idx = distances.idxmin()
            zone = int(df_hist.iloc[nearest_idx]['zone'])

        # Prepare Feature Vector: [lat, lon, depth, hour, month, day_of_week, tsl, zone]
        features = [lat, lon, depth, now.hour, now.month, now.weekday(), tsl, zone]
        input_df = pd.DataFrame([features], columns=['lat', 'lon', 'depth', 'hour', 'month', 'day_of_week', 'tsl', 'zone'])
        
        # --- ML INFERENCE ---
        # 1. Classification
        pred_idx = app.model.predict(input_df)[0]
        hazard_class = app.le.inverse_transform([pred_idx])[0]
        confidence = np.max(app.model.predict_proba(input_df)[0])
        
        # 2. Risk Score Synthesis (Mapping back to notebook logic)
        # Result = (0.5 * norm_mag + 0.3 * norm_depth + 0.2 * 0.5) * 10
        # For norm_mag, we use proxies based on hazard class: LOW=0.3, MED=0.6, HIGH=0.9
        mag_proxy = 0.3 if hazard_class == 'LOW' else (0.6 if hazard_class == 'MEDIUM' else 0.9)
        depth_norm = 1 - (min(depth, 700) / 700)
        risk_score = (0.5 * mag_proxy + 0.3 * depth_norm + 0.2 * 0.5) * 10
        
        return jsonify({
            "status": "success",
            "prediction": hazard_class,
            "confidence": f"{confidence*100:.1f}%",
            "risk_score": round(risk_score, 2),
            "threat_level": "CRITICAL" if risk_score > 7.5 else ("ELEVATED" if risk_score > 4.5 else "NOMINAL"),
            "context": {
                "tsl_hours": round(tsl, 1),
                "estimated_zone": zone
            },
            "timestamp": now.strftime("%Y-%m-%d %H:%M:%S")
        })
        
    except Exception as e:
        return jsonify({"status": "error", "message": f"Processing Fault: {str(e)}"})

@app.route('/api/historical_dataset')
def get_historical_dataset():
    if not os.path.exists('processed_seismic_data.csv'):
        return jsonify({"status": "error", "message": "Dataset not found"})
    
    df = pd.read_csv('processed_seismic_data.csv')
    # Replace NaN with None for valid JSON serialization
    df_clean = df.replace({np.nan: None})
    return jsonify({
        "status": "success",
        "data": df_clean.to_dict(orient='records')
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)
