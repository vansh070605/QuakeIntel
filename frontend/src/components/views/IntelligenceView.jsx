import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PredictionModule from '../PredictionModule';
import LocationPickerMap from '../LocationPickerMap';

const IntelligenceView = ({ onPredict, predictionResult, isLoading }) => {
  const [pickedCoords, setPickedCoords] = useState(null);
  const [activeHazard, setActiveHazard] = useState('SEISMIC');

  const handleLocationPick = (lat, lon) => {
    setPickedCoords({ lat, lon });
  };

  const hazards = [
    { id: 'SEISMIC', label: 'Seismic', icon: '⛰️' },
    { id: 'TSUNAMI', label: 'Tsunami', icon: '🌊' },
    { id: 'VULNERABILITY', label: 'Vulnerability', icon: '🏛️' }
  ];

  return (
    <div className="full-screen-canvas" style={{ display: 'flex', background: 'var(--bg-cream)' }}>
      {/* LEFT: INTERACTIVE MAP WORKSTATION */}
      <div style={{ flex: 1.2, position: 'relative', padding: '40px 0 40px 40px' }}>
        <LocationPickerMap 
          pickedCoords={pickedCoords} 
          onLocationPick={handleLocationPick} 
        />
      </div>

      {/* RIGHT: ANALYSIS DESK */}
      <div style={{ flex: 1, padding: '40px', overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: '100%', maxWidth: '600px' }}>
          <header style={{ marginBottom: '32px', textAlign: 'left' }}>
            <span className="serif italic" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Workstation / Core_v4.3</span>
            <h1 className="serif" style={{ fontSize: '2.4rem', marginTop: '12px' }}>Risk Assessment</h1>
          </header>

          {/* HAZARD TABS */}
          <div className="hazard-tabs" style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
            {hazards.map(h => (
              <button 
                key={h.id}
                onClick={() => setActiveHazard(h.id)}
                className={`hazard-tab ${activeHazard === h.id ? 'active' : ''}`}
              >
                <span style={{ fontSize: '0.9rem' }}>{h.icon}</span>
                <span className="serif sm">{h.label}</span>
              </button>
            ))}
          </div>

          <PredictionModule 
            onPredict={(lat, lon, depth) => onPredict(lat, lon, depth, activeHazard)}
            predictionResult={predictionResult}
            isLoading={isLoading}
            externalCoords={pickedCoords}
            activeHazard={activeHazard}
          />
        </div>

        {/* TELEMETRY FOOTER */}
        <div style={{ marginTop: 'auto', width: '100%', maxWidth: '600px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: 0.5 }}>
            <div className="glass-pill" style={{ padding: '8px 16px', background: 'transparent' }}>
              <span className="dot" style={{ background: '#0a0', width: 6, height: 6 }}></span>
              <span className="serif sm" style={{ fontSize: '0.6rem' }}>SYNTHESIS_MODE: {activeHazard}</span>
            </div>
            <span className="serif sm" style={{ fontSize: '0.6rem' }}>DATASET: USGS_2015_2024</span>
        </div>
      </div>

      <style jsx="true">{`
        .hazard-tabs {
          border-bottom: 1px solid rgba(0,0,0,0.05);
          padding-bottom: 12px;
        }
        .hazard-tab {
          background: none;
          border: 1px solid transparent;
          padding: 8px 16px;
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          opacity: 0.4;
          transition: all 0.2s;
          border-radius: 4px;
        }
        .hazard-tab.active {
          opacity: 1;
          background: #fff;
          border-color: rgba(0,0,0,0.05);
          box-shadow: 0 2px 4px rgba(0,0,0,0.02);
        }
        .hazard-tab .sm { font-size: 0.65rem; text-transform: uppercase; font-weight: 800; letter-spacing: 0.1em; }
        .hazard-tab:hover { opacity: 0.8; }
      `}</style>
    </div>
  );
};

export default IntelligenceView;
