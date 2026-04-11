import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PredictionModule from '../PredictionModule';
import LocationPickerMap from '../LocationPickerMap';

const IntelligenceView = ({ onPredict, predictionResult, isLoading }) => {
  const [pickedCoords, setPickedCoords] = useState(null);

  const handleLocationPick = (lat, lon) => {
    setPickedCoords({ lat, lon });
  };

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
          <header style={{ marginBottom: '48px', textAlign: 'left' }}>
            <span className="serif italic" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Workstation / Core_v4.2</span>
            <h1 className="serif" style={{ fontSize: '2.4rem', marginTop: '12px' }}>Risk Assessment</h1>
          </header>

          <PredictionModule 
            onPredict={onPredict}
            predictionResult={predictionResult}
            isLoading={isLoading}
            externalCoords={pickedCoords}
          />
        </div>

        {/* TELEMETRY FOOTER */}
        <div style={{ marginTop: 'auto', width: '100%', maxWidth: '600px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: 0.5 }}>
            <div className="glass-pill" style={{ padding: '8px 16px', background: 'transparent' }}>
              <span className="dot" style={{ background: '#0a0', width: 6, height: 6 }}></span>
              <span className="serif sm" style={{ fontSize: '0.6rem' }}>XGBOOST_SYNC: OK</span>
            </div>
            <span className="serif sm" style={{ fontSize: '0.6rem' }}>DATASET: USGS_2015_2024</span>
        </div>
      </div>
    </div>
  );
};

export default IntelligenceView;
