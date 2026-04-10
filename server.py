from flask import Flask, render_template, jsonify, request
import joblib
import pandas as pd
import numpy as np
import os
from datetime import datetime

app = Flask(__name__)

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
    return render_template('index.html')

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
        
        now = datetime.now()
        
        # Prepare Feature Vector: [lat, lon, depth, hour, month, dow, tsl, zone]
        # 'tsl' is simulated at 24h, 'zone' is defaulted to -1 (generic crustal activity)
        features = [lat, lon, depth, now.hour, now.month, now.weekday(), 24.0, -1]
        input_df = pd.DataFrame([features], columns=['lat', 'lon', 'depth', 'hour', 'month', 'day_of_week', 'tsl', 'zone'])
        
        # 1. Classification
        pred_idx = app.model.predict(input_df)[0]
        hazard_class = app.le.inverse_transform([pred_idx])[0]
        confidence = np.max(app.model.predict_proba(input_df)[0])
        
        # 2. Risk Score Synthesis
        # Risk = 0.5*MagScale + 0.3*DepthImpact + 0.2*DensityProxy
        mag_proxy = 0.4 if hazard_class == 'LOW' else (0.7 if hazard_class == 'MEDIUM' else 0.95)
        depth_norm = 1 - (min(depth, 700) / 700)
        risk_score = (0.5 * mag_proxy + 0.3 * depth_norm + 0.2 * 0.5) * 10
        
        return jsonify({
            "status": "success",
            "prediction": hazard_class,
            "confidence": f"{confidence*100:.1f}%",
            "risk_score": round(risk_score, 2),
            "threat_level": "LEVEL 3" if risk_score > 7.5 else ("LEVEL 2" if risk_score > 4.5 else "LEVEL 1"),
            "timestamp": now.strftime("%Y-%m-%d %H:%M:%S")
        })
        
    except Exception as e:
        return jsonify({"status": "error", "message": f"Processing Fault: {str(e)}"})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
