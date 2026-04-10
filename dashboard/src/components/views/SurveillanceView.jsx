import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion } from 'framer-motion';

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
          
          // Calculate distribution stats
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
    fillColor: risk > 7 ? '#ff3333' : risk > 4 ? '#ff9900' : '#00aa00',
    color: '#fff',
    weight: 0.5,
    opacity: 0.9,
    fillOpacity: 0.6,
    radius: risk > 7 ? 8 : risk > 4 ? 6 : 4
  });

  const filteredPoints = historicalPoints
    .filter(p => showNominal || p.risk_score > 4)
    .slice(0, 800);

  return (
    <div className="full-screen-canvas">
      {/* MAP CORE */}
      <MapContainer 
        center={[20, 0]} 
        zoom={2} 
        style={{ height: '100%', width: '100%', background: '#f5f5f7' }}
        zoomControl={false}
      >
        {/* CLEANER VOYAGER TILES */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{y}/{x}{r}.png"
          attribution='&copy; OpenStreetMap &copy; CARTO'
        />
        
        {/* TECTONIC LINES */}
        {faultData && (
          <GeoJSON 
            data={faultData} 
            style={{ color: '#ffb380', weight: 1.5, opacity: 0.3, dashArray: '5, 10' }}
          />
        )}

        {/* DATA NODES */}
        {filteredPoints.map((p, i) => (
          <CircleMarker 
            key={i} 
            center={[p.lat, p.lon]} 
            {...getMarkerStyle(p.risk_score)}
          >
            <Popup className="tactical-popup">
              <div className="serif">
                <strong>{p.place || 'Seismic Event'}</strong><br/>
                Intensity: {p.mag}M<br/>
                Risk: {p.risk_score.toFixed(2)}/10
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>

      {/* INTERFACE OVERLAY */}
      <div className="interface-overlay">
        <div className="top-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <motion.div 
            initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
            className="overlay-panel"
            style={{ backdropFilter: 'blur(20px)', background: 'rgba(255,255,255,0.9)', width: '320px' }}
          >
            <h2 className="serif" style={{ fontSize: '1.4rem' }}>Surveillance</h2>
            <p className="text-muted" style={{ fontSize: '0.75rem', marginBottom: '20px' }}>Global Hazard Intelligence</p>
            
            <div className="distribution-telemetry">
              <label style={{ fontSize: '0.6rem', letterSpacing: '0.1em', fontWeight: 700, marginBottom: '8px', display: 'block' }}>DISTRIBUTION</label>
              <div style={{ display: 'flex', height: '4px', borderRadius: '2px', overflow: 'hidden', background: '#eee' }}>
                <div style={{ width: `${(stats.severe / historicalPoints.length) * 100}%`, background: '#ff3333' }}></div>
                <div style={{ width: `${(stats.moderate / historicalPoints.length) * 100}%`, background: '#ff9900' }}></div>
                <div style={{ width: `${(stats.nominal / historicalPoints.length) * 100}%`, background: '#00aa00' }}></div>
              </div>
              
              <div style={{ marginTop: '12px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                <div className="stat-pill">
                  <span style={{ fontSize: '1rem', fontWeight: 700, color: '#ff3333' }}>{stats.severe}</span>
                  <label style={{ fontSize: '0.5rem', display: 'block', opacity: 0.5 }}>SEVERE</label>
                </div>
                <div className="stat-pill">
                  <span style={{ fontSize: '1rem', fontWeight: 700, color: '#ff9900' }}>{stats.moderate}</span>
                  <label style={{ fontSize: '0.5rem', display: 'block', opacity: 0.5 }}>MODERATE</label>
                </div>
                <div className="stat-pill">
                  <span style={{ fontSize: '1rem', fontWeight: 700, color: '#00aa00' }}>{stats.nominal}</span>
                  <label style={{ fontSize: '0.5rem', display: 'block', opacity: 0.5 }}>NOMINAL</label>
                </div>
              </div>
            </div>

            <div className="divider-minimal" style={{ margin: '20px 0' }}></div>

            <div className="control-set">
              <button 
                className={`pill sm ${showNominal ? 'active' : ''}`}
                onClick={() => setShowNominal(!showNominal)}
                style={{ fontSize: '0.65rem', padding: '8px 16px' }}
              >
                {showNominal ? "Hide Nominal Data" : "Show Nominal Data"}
              </button>
            </div>
          </motion.div>

          <div className="glass-pill" style={{ opacity: 0.7 }}>
            <span className="serif" style={{ fontSize: '0.7rem', letterSpacing: '0.1em' }}>DESK STATUS: STABLE</span>
          </div>
        </div>

        <div className="bottom-row" style={{ display: 'flex', justifyContent: 'center' }}>
          <div className="glass-pill" style={{ padding: '10px 20px', fontSize: '0.7rem' }}>
            <div className="legend-item" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#ff3333' }}></div>
              <span className="serif sm">SEVERE</span>
            </div>
            <div className="legend-item" style={{ margin: '0 15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#ff9900' }}></div>
              <span className="serif sm">MODERATE</span>
            </div>
            <div className="legend-item" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#00aa00' }}></div>
              <span className="serif sm">NOMINAL</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurveillanceView;
