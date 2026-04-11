import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PredictionModule = ({ onPredict, predictionResult, isLoading, externalCoords }) => {
  const [formData, setFormData] = useState({ lat: '', lon: '', depth: '10' });

  // Sync with map click
  useEffect(() => {
    if (externalCoords) {
      setFormData(prev => ({ 
        ...prev, 
        lat: externalCoords.lat, 
        lon: externalCoords.lon 
      }));
    }
  }, [externalCoords]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.lat && formData.lon && formData.depth) {
      onPredict(formData.lat, formData.lon, formData.depth);
    }
  };

  return (
    <div className="prediction-module">
      <div className="module-canvas">
        <form onSubmit={handleSubmit} className="inquiry-form" style={{ maxWidth: '100%' }}>
          <div className="input-group">
            <label className="serif">Latitude</label>
            <input 
              type="number" 
              step="0.0001" 
              placeholder="Pick on map or enter"
              value={formData.lat}
              onChange={(e) => setFormData({...formData, lat: e.target.value})}
              required
            />
          </div>
          <div className="input-group">
            <label className="serif">Longitude</label>
            <input 
              type="number" 
              step="0.0001" 
              placeholder="Pick on map or enter"
              value={formData.lon}
              onChange={(e) => setFormData({...formData, lon: e.target.value})}
              required
            />
          </div>
          <div className="input-group">
            <label className="serif">Depth (km)</label>
            <input 
              type="number" 
              step="0.1" 
              placeholder="e.g. 10.0"
              value={formData.depth}
              onChange={(e) => setFormData({...formData, depth: e.target.value})}
              required
            />
          </div>

          <button type="submit" className="pill mt-lg" disabled={isLoading} style={{ width: '100%', padding: '16px' }}>
            {isLoading ? "Analyzing..." : "Execute Analysis"}
          </button>
        </form>

        <AnimatePresence>
          {predictionResult && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="results-report"
              style={{ width: '100%', maxWidth: '100%', marginTop: '24px' }}
            >
              <div className="report-header">
                <span className="serif">CONFIDENTIAL REPORT</span>
                <span className="report-id">SCAN_READY</span>
              </div>
              
              <div className="report-content">
                <div className="result-row">
                  <span className="label">HAZARD POTENTIAL</span>
                  <span className={`value serif ${predictionResult.prediction.toLowerCase()}`} style={{ fontWeight: 800 }}>
                    {predictionResult.prediction}
                  </span>
                </div>
                <div className="result-row">
                  <span className="label">SYNTHETIC RISK SCORE</span>
                  <span className="value" style={{ fontFamily: 'var(--font-sans)', fontWeight: 700 }}>{predictionResult.risk_score}/10</span>
                </div>
                <div className="result-row">
                    <span className="label">THREAT_LEVEL</span>
                    <span style={{ fontSize: '0.8rem', background: '#000', color: '#fff', padding: '2px 8px', borderRadius: '4px' }}>
                      {predictionResult.threat_level}
                    </span>
                </div>
              </div>

              <div className="report-footer">
                <p>Synced with Core v4.3.1</p>
                <p>Timestamp: {predictionResult.timestamp}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx="true">{`
        .prediction-module { width: 100%; }
        .module-canvas { display: flex; flex-direction: column; width: 100%; }
        .inquiry-form { background: #fff; padding: 32px; border-radius: 8px; border: 1px solid rgba(0,0,0,0.05); box-shadow: 0 4px 6px -1px rgba(0,0,0,0.01); }
        .input-group { display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px; }
        .input-group label { font-size: 0.65rem; text-transform: uppercase; color: var(--text-muted); font-weight: 700; }
        .input-group input { border: none; border-bottom: 1px solid rgba(0,0,0,0.1); padding: 8px 0; font-size: 1rem; outline: none; }
        .input-group input:focus { border-bottom-color: #000; }
        .results-report { background: #fff; padding: 32px; border-radius: 8px; border: 1px solid rgba(0,0,0,0.05); border-left: 4px solid #000; }
        .result-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
        .result-row .label { font-size: 0.7rem; font-weight: 700; color: var(--text-muted); }
        .report-header { font-size: 0.6rem; letter-spacing: 0.1em; color: var(--text-muted); margin-bottom: 24px; border-bottom: 1px solid rgba(0,0,0,0.05); padding-bottom: 12px; }
        .report-content .value.high { color: #dc2626; }
        .report-content .value.medium { color: #f97316; }
        .report-content .value.low { color: #22c55e; }
        .report-footer { margin-top: 32px; font-size: 0.6rem; color: #94a3b8; }
      `}</style>
    </div>
  );
};

export default PredictionModule;
