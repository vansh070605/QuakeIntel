# QuakeIntel: Global Seismic Intelligence System (v4.3.2)

**QuakeIntel** is a high-fidelity intelligence platform designed for real-time seismic monitoring, hazard prediction, and tectonic simulation. It leverages advanced machine learning (XGBoost) and interactive GIS visualization to provide actionable insights into global earthquake threats.

---

## 🏛️ System Architecture

The project is organized into a modular, industrial-standard directory structure:

*   **`/backend`**: Flask-based API gateway and Intelligence Core.
    *   **`/backend/models`**: Specialized ML artifacts (`.joblib`) including scalers and encoders.
*   **`/frontend`**: React 19 interface leveraging the "Magazine" design system.
*   **`/data`**: Centralized storage for raw datasets and processed feature registries.
*   **`/research`**: Engineering notebooks and model training experiments.

---

## 🧠 Intelligence Core (v4.3.2 Precision Upgrade)

The heart of QuakeIntel is a probabilistic inference engine calibrated for scientific accuracy.

### Key Features:
- **Exponential Depth Decay**: Hazard potential is automatically penalized using an exponential decay model ($e^{-depth/120}$) to reflect physical energy dissipation.
- **Physical Safety Ceiling**: A hard logic gate identifies any event deeper than **300km** as **NOMINAL**, regardless of regional risk probability.
- **Zone Severity Integration**: The model cross-references live coordinates with a nearest-neighbor historical database to factor in a region's "Seisemic Memory."

---

## 🛰️ Operational Workstations

### 1. Global Surveillance Desk
Live GIS mapping of over **70,000 seismic nodes** using professional light-themed map tiles. It features intelligent filtering for High, Medium, and Nominal risk events.

### 2. Intelligence Workstation (Risk Assessment)
A dual-pane environment allowing users to pick coordinates directly on an interactive map. The "Dossier" generator provides a comprehensive risk assessment with probabilistic confidence scores.

### 3. Simulation Lab
A 3D WebGL (Three.js) tectonic reconstruction. It visualizes seismic events in 3D space, mapping them accurately to the Earth's crust and mantle based on precise depth metrics.

---

## 🛠️ Technology Stack

| Layer | Environment | Key Libraries |
| :--- | :--- | :--- |
| **Backend** | Python 3.12+ | `Flask`, `XGBoost`, `Scikit-learn`, `Pandas`, `Joblib` |
| **Frontend** | Node / React 19 | `Vite`, `Three.js (Fiber/Drei)`, `React-Leaflet`, `Framer Motion` |
| **Data** | CSV / JSON | `DBSCAN Clustering`, `Z-score Normalization` |

---

## 🚀 Getting Started

### 1. Launch the Intelligence Core
```powershell
# From the root directory
python backend/server.py
```
*Accessible at `http://127.0.0.1:5000`*

### 2. Launch the Interface
```powershell
cd frontend
npm install
npm run dev
```
*Accessible at `http://localhost:5173`*

---

## 📡 API Reference

- `POST /api/predict`: Returns a probabilistic hazard assessment for `{lat, lon, depth}`.
- `GET /api/historical_dataset`: Streams the full 70k+ node registry for GIS mapping.
- `GET /`: Heartbeat and Core Versioning information.

---
*Developed as part of the advanced agentic coding initiative.*
