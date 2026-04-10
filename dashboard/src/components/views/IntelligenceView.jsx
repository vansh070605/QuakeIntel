import React from 'react';
import { motion } from 'framer-motion';
import PredictionModule from '../PredictionModule';

const IntelligenceView = ({ onPredict, predictionResult, isLoading }) => {
  return (
    <div className="full-screen-canvas" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* BACKGROUND VIGNETTE */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'radial-gradient(circle at center, transparent 0%, rgba(29,29,31,0.03) 100%)', pointerEvents: 'none' }}></div>

      {/* CENTER DESK */}
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }}
        className="prediction-desk-center"
        style={{ width: '100%', maxWidth: '1200px', zIndex: 10, padding: '0 40px' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span className="serif italic" style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>Intelligence Desk / Model_v4.2</span>
          <h1 className="display-large serif mt-md">The Risk Assessment</h1>
        </div>

        <PredictionModule 
          onPredict={onPredict}
          predictionResult={predictionResult}
          isLoading={isLoading}
        />
      </motion.div>

      {/* TELEMETRY OVERLAYS */}
      <div className="interface-overlay">
        <div className="top-row" style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div className="glass-pill">
            <span className="dot" style={{ background: '#080', width: 8, height: 8 }}></span>
            <span className="serif sm">XGBOOST_CORE: OPERATIONAL</span>
          </div>
        </div>

        <div className="bottom-row" style={{ display: 'flex', justifyContent: 'flex-start' }}>
          <div className="overlay-panel" style={{ maxWidth: '300px', background: 'transparent', border: 'none' }}>
            <label className="serif italic" style={{ fontSize: '0.7rem', opacity: 0.5 }}>Desk Notes</label>
            <p className="mt-md" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Predictions are synthesized across 8 spatial and temporal features. Consult the Analysis Lab for feature importance breakdown.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntelligenceView;
