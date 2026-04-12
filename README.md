<div align="center">

![QUAKEINTEL Banner](frontend/src/assets/quakeintel_hero_branding_1775971579821.png)

# QUAKEINTEL: PROJECT SEISMOSENSE v4.3.5
### Universal Seismic Synthesis & Global Hazard Intelligence

[![Python 3.12+](https://img.shields.io/badge/Python-3.12%2B-blue?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![React 19](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL-black?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![XGBoost](https://img.shields.io/badge/XGBoost-Models-orange?style=for-the-badge&logo=xgboost&logoColor=white)](https://xgboost.ai/)
[![Vite](https://img.shields.io/badge/Vite-Fast-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

</div>

---

## 🏛️ Executive Abstract
**QuakeIntel** is a high-fidelity intelligence platform engineered for synchronous planetary monitoring and probabilistic hazard forecasting. It bridges the gap between raw lithospheric telemetry and actionable geospatial intelligence. Utilizing an **XGBoost Ensemble Core**, the system synthesizes 72,000+ historical data points into a real-time risk grid, accounting for spatial clustering, temporal quiescence, and atmospheric surge potential.

> [!IMPORTANT]
> **SYNTHESIS_REPORT v4.3**: The core now supports multi-modal hazard assessment, allowing analysts to differentiate between **Tectonic Shift**, **Tsunami Surge**, and **Infrastructure Vulnerability** with specialized scoring heuristics.

---

## 🧠 Intelligence Core: Theoretical Framework

The QuakeIntel engine does not merely "predict"—it reconstructs history to identify future instabilities.

### 1. Multi-Hazard Synthesis Matrix
The system employs a branching logic gate to assess different threat categories:
- **Tectonic Shift**: Standard magnitude-probabilistic risk assessment.
- **Tsunami Surge**: Specialized coastal assessment weighting magnitude against shallow-water hypocenters ($Depth < 50km$).
- **Structure Loss**: Infrastructure-focused scoring using regional historical intensity and urban density proxies.

### 2. Physical Safety & Decay Logic
To maintain scientific integrity, the model implements physical safety ceilings:
- **Exponential Depth Decay**: Hazard potential follows the dissipation formula $E = e^{-depth / 120}$, ensuring deep-earth activity is accurately reflected as low-surface threat.
- **Hypocenter Gate**: Any seismic event originating at depths of $300km+$ is automatically classified as **NOMINAL**, regardless of raw magnitude.

---

## 🛰️ Operational Workstations

### 💠 Simulation Lab (Volumetric 3D)
A high-fidelity **Three.js** tectonic reconstruction.
- **Realistic Globe**: High-res satellite imagery with topology bump mapping and emissive night-light maps.
- **Volumetric Mapping**: Seismic nodes are mapped in 3D space according to their actual Z-axis (depth/mantle coordinate).
- **Synchronous Rotation**: Data points are pinned to geographical coordinates, rotating in 1:1 sync with the planetary surface.

### 💠 Intelligence Desk (Risk Synthesis)
The primary analytical workstation for targeted inquiry.
- **Location Targeter**: Interactive Leaflet workstation for precise coordinate acquisition.
- **Synthesis Engine**: Dual-pane interface providing "Confidential Reports" on the three hazard tiers.

### 💠 Global Surveillance
Live monitoring workstation rendering the 2015-2024 seismic archive. It provides immediate visual density analysis (DBSCAN) across tectonic plate boundaries.

---

## 📊 Performance & Methodology

### Data Pipeline Architecture
```mermaid
graph TD
    A[Raw Seismic Registry] --> B[DBSCAN Spatial Clustering]
    B --> C[Temporal Quiescence Analysis]
    C --> D[XGBoost Ensemble Core]
    D --> E{Multi-Hazard Synthesis}
    E -->|SEISMIC| F[Tectonic Shift Report]
    E -->|TSUNAMI| G[Surge Risk Report]
    E -->|INFRA| H[Vulnerability Report]
```

### Core Metrics (v4.3.5)
| Metric | Value | Status |
| :--- | :--- | :--- |
| **Ultimate Accuracy** | 98.17% | ![Stable](https://img.shields.io/badge/Stability-98.17%25-green) |
| **F1-Score (Stabilized)** | 0.9726 | ![Optimized](https://img.shields.io/badge/F1-0.9726-blue) |
| **Training Records** | 72,508 | ![Dataset](https://img.shields.io/badge/Dataset-USGS-orange) |
| **Sensing Latency** | < 120ms | ![Speed](https://img.shields.io/badge/Latency-Minimal-brightgreen) |

---

## 🛠️ Deployment Protocols

### 1. Core Initialization (Backend)
```powershell
# From root directory
python backend/server.py
```
*Port 5000: Initializing Global Intelligence Gateway...*

### 2. Interface Activation (Frontend)
```powershell
cd frontend
npm install
npm run dev
```
*Localhost 5173: Accessing SeismoSense Magazine Workstation.*

---

## 📂 Project Archive Structure
```text
QUAKEINTEL/
├── backend/            # Python Flask Core & ML Artifacts
├── frontend/           # React 19 Design System & Three.js Canvas
├── data/               # Processed CSV registries (72k records)
└── research/           # Engineering Notebooks (XGBoost Training)
```

---
<div align="center">
  <p className="serif italic">"Building structural resilience through digital surveillance."</p>
</div>
