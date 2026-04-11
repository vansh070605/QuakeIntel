import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion } from 'framer-motion';
import './SurveillanceView.css'; // Isolated Styles

const SurveillanceView = () => {
  const [historicalPoints, setHistoricalPoints] = useState([]);
  const [faultData, setFaultData] = useState(null);
  const [stats, setStats] = useState({ severe: 0, moderate: 0, nominal: 0 });
  const [showNominal, setShowNominal] = useState(false);

  useEffect(() => {
    // Fetch pre-calculated historical risk points
    fetch('http://127.0.0.1:5000/api/historical_dataset')
      .then(res => res.json())
      .then(result => {
        if (result.status === 'success') {
          setHistoricalPoints(result.data);
          
          const d = result.data;
          const severe = d.filter(p => p.risk_score > 7).length;
          const moderate = d.filter(p => p.risk_score > 4 && p.risk_score <= 7).length;
          const nominal = d.length - (severe + moderate);
          setStats({ severe, moderate, nominal });
        }
      })
      .catch(err => console.error("Dataset Fetch Fault:", err));

    // Fetch tectonic fault lines
    fetch('https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json')
      .then(res => res.json())
      .then(data => setFaultData(data));
  }, []);

  const getMarkerStyle = (risk) => ({
    fillColor: risk > 7 ? '#dc2626' : risk > 4 ? '#f97316' : '#22c55e',
    color: '#ffffff',
    weight: 1,
    opacity: 1,
    fillOpacity: 0.7,
    radius: risk > 7 ? 7 : risk > 4 ? 5 : 3
  });

  const filteredPoints = historicalPoints
    .filter(p => showNominal || p.risk_score > 4)
    .slice(0, 1000);

  return (
    <div className="surveillance-container">
      {/* MAP ENGINE: LIGHT THEMED */}
      <MapContainer 
        center={[20, 0]} 
        zoom={2} 
        minZoom={2}
        maxZoom={12}
        zoomControl={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; CARTO'
        />
        
        {/* TECTONIC LINES */}
        {faultData && (
          <GeoJSON 
            data={faultData} 
            style={{ color: '#94a3b8', weight: 1.5, opacity: 0.4, dashArray: '4, 12' }}
          />
        )}

        {/* SEISMIC DATA NODES */}
        {filteredPoints.map((p, i) => (
          <CircleMarker 
            key={i} 
            center={[p.lat, p.lon]} 
            {...getMarkerStyle(p.risk_score)}
          >
            <Popup className="professional-popup">
              <div style={{ fontFamily: 'var(--font-sans)', padding: '4px' }}>
                <strong style={{ fontSize: '0.9rem', color: '#334155' }}>{p.place || 'Seismic Event'}</strong>
                <div style={{ marginTop: '8px', fontSize: '0.8rem', color: '#64748b' }}>
                  Magnitude: <span style={{ fontWeight: 600, color: '#1e293b' }}>{p.mag}M</span><br/>
                  Risk Index: <span style={{ fontWeight: 600, color: p.risk_score > 7 ? '#dc2626' : '#f97316' }}>{p.risk_score.toFixed(2)}/10</span>
                </div>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>

      {/* FLOATING CONTROL PANEL */}
      <div className="overlay-container">
        <motion.div 
          initial={{ y: -22, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }}
          className="floating-panel"
        >
          <div className="panel-header">
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1e293b', fontFamily: 'var(--font-sans)' }}>Global Surveillance</h2>
            <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px', fontFamily: 'var(--font-sans)' }}>Operational Hazard Registry</p>
          </div>
          
          <div className="divider-sm"></div>

          <div className="telemetry-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', fontWeight: 700, color: '#94a3b8', marginBottom: '8px' }}>
              <span>DISTRIBUTION</span>
              <span>{historicalPoints.length} NODES</span>
            </div>
            
            <div className="mega-bar">
              <div style={{ width: `${(stats.severe / (historicalPoints.length || 1)) * 100}%`, background: '#dc2626' }}></div>
              <div style={{ width: `${(stats.moderate / (historicalPoints.length || 1)) * 100}%`, background: '#f97316' }}></div>
              <div style={{ width: `${(stats.nominal / (historicalPoints.length || 1)) * 100}%`, background: '#22c55e' }}></div>
            </div>
            
            <div className="stat-grid-sm">
              <div className="stat-item">
                <span style={{ color: '#dc2626' }}>{stats.severe}</span>
                <label>SEVERE</label>
              </div>
              <div className="stat-item">
                <span style={{ color: '#f97316' }}>{stats.moderate}</span>
                <label>MODERATE</label>
              </div>
              <div className="stat-item">
                <span style={{ color: '#22c55e' }}>{stats.nominal}</span>
                <label>NOMINAL</label>
              </div>
            </div>
          </div>

          <div className="divider-sm"></div>

          <div className="control-group">
             <button 
                className={`toggle-pill ${showNominal ? 'active' : ''}`}
                onClick={() => setShowNominal(!showNominal)}
             >
               {showNominal ? "Focus High Risk" : "Scan Nominal Data"}
             </button>
          </div>
        </motion.div>
      </div>

      {/* MAP LEGEND */}
      <div className="bottom-legend">
        <div className="legend-card">
          <div className="legend-entry"><span className="dot" style={{ background: '#dc2626' }}></span> SEVERE</div>
          <div className="legend-entry"><span className="dot" style={{ background: '#f97316' }}></span> MODERATE</div>
          <div className="legend-entry"><span className="dot" style={{ background: '#22c55e' }}></span> NOMINAL</div>
        </div>
      </div>
    </div>
  );
};

export default SurveillanceView;
