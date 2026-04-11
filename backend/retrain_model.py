import os, joblib
import pandas as pd
import numpy as np
from sklearn.cluster import DBSCAN
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.utils.class_weight import compute_sample_weight
from xgboost import XGBClassifier

print("--- SeismoSense Intelligence Core v4.3 Recalibration ---")

# 1. Loading & Initial Cleansing
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.abspath(os.path.join(BASE_DIR, '..', 'data', 'raw', 'EarthquakeData (2015-2024).csv'))

if not os.path.exists(DATA_FILE):
    print(f"[FATAL] Data not found at {DATA_FILE}")
    sys.exit(1)

df = pd.read_csv(DATA_FILE)
df = df.rename(columns={'latitude': 'lat', 'longitude': 'lon', 'magnitude': 'mag', 'depth_km': 'depth'})
df.columns = [c.lower() for c in df.columns]
df['time'] = pd.to_datetime(df['time'])
df = df[df['type'] == 'earthquake'].dropna(subset=['lat', 'lon', 'mag', 'depth']).sort_values('time')

# 2. Enhanced Feature Engineering
# Spatial Clustering (Same as v4.2 but we'll use it for severity features)
scaler = StandardScaler()
coords_scaled = scaler.fit_transform(df[['lat', 'lon']])
df['zone'] = DBSCAN(eps=0.15, min_samples=25).fit_predict(coords_scaled)

# NEW: Zone Severity (Max Magnitude in this cluster)
# This gives the model a hint that a zone IS capable of high quakes even if one hasn't happened recently.
zone_max_mag = df.groupby('zone')['mag'].max().to_dict()
df['zone_severity'] = df['zone'].map(zone_max_mag)

# Temporal Features
df['hour'] = df['time'].dt.hour
df['month'] = df['time'].dt.month
df['day_of_week'] = df['time'].dt.dayofweek
df['tsl'] = df['time'].diff().dt.total_seconds().fillna(0) / 3600

# 3. Aggressive Labeling (Sensitivity Calibration)
def classify_hazard(m):
    if m < 4.5: return 'LOW'
    if m < 5.4: return 'MEDIUM' # Lowered threshold from 6.0 to 5.4 to capture more "Danger" nodes
    return 'HIGH'

df['hazard_label'] = df['mag'].apply(classify_hazard)
le = LabelEncoder()
df['target'] = le.fit_transform(df['hazard_label'])

# 4. Class Imbalance Solution (Weighted Training)
features = ['lat', 'lon', 'depth', 'hour', 'month', 'day_of_week', 'tsl', 'zone', 'zone_severity']
X, y = df[features], df['target']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.15, random_state=42, stratify=y)

# Critical Fix: Force high penalty for misclassifying HIGH risk
sample_weights = compute_sample_weight(class_weight='balanced', y=y_train)

# 5. Training
num_classes = len(le.classes_)
model = XGBClassifier(
    objective='multi:softprob',
    num_class=num_classes, # Explicitly set to fix XGBoostError
    n_estimators=150,
    learning_rate=0.08,
    max_depth=6,
    random_state=42,
    eval_metric='mlogloss'
)

print(f"Retraining Model with {num_classes} classes: {le.classes_}")
model.fit(X_train, y_train, sample_weight=sample_weights)

from sklearn.metrics import accuracy_score, classification_report

# 6. Saving Artifacts
joblib.dump(model, os.path.join(BASE_DIR, 'models', 'seismo_xgb_model.joblib'))
joblib.dump(scaler, os.path.join(BASE_DIR, 'models', 'coords_scaler.joblib'))
joblib.dump(le, os.path.join(BASE_DIR, 'models', 'label_encoder.joblib'))

# Update processed dataset for mapping
df['norm_mag'] = df['mag'] / 10
df['norm_depth'] = 1 - (df['depth'] / 700)
df['risk_score'] = (0.4 * df['norm_mag'] + 0.3 * (df['zone_severity']/10) + 0.3 * df['norm_depth']) * 10

PROCESSED_OUT = os.path.abspath(os.path.join(BASE_DIR, '..', 'data', 'processed_seismic_data.csv'))
df.to_csv(PROCESSED_OUT, index=False)

# 7. Verification Results
y_pred = model.predict(X_test)
acc = accuracy_score(y_test, y_pred)
print(f"Core v4.3 Deployed. Accuracy: {acc*100:.2f}%")
print("\nClassification Report (v4.3):")
print(classification_report(y_test, y_pred, target_names=le.classes_))
