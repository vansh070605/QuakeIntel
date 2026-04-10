import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PredictionModule = ({ onPredict, predictionResult, isLoading }) => {
  const [formData, setFormData] = useState({ lat: '', lon: '', depth: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.lat && formData.lon && formData.depth) {
      onPredict(formData.lat, formData.lon, formData.depth);
    }
  };

  return (
    <div className="prediction-module">
      <h3 className="module-title serif">Intelligence Inquiry</h3>
      <p className="module-subtitle">Execute a formal risk assessment for specific geological coordinates.</p>

      <div className="module-canvas">
        <form onSubmit={handleSubmit} className="inquiry-form">
          <div className="input-group">
            <label className="serif">Latitude</label>
            <input 
              type="number" 
              step="0.0001" 
              placeholder="e.g. 35.6895"
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
              placeholder="e.g. 139.6917"
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

          <button type="submit" className="pill mt-xl" disabled={isLoading}>
            {isLoading ? "Analyzing..." : "Execute Analysis"}
          </button>
        </form>

        <AnimatePresence>
          {predictionResult && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="results-report"
            >
              <div className="report-header">
                <span className="serif">CONFIDENTIAL REPORT</span>
                <span className="report-id">#ID-{Math.floor(Math.random()*10000)}</span>
              </div>
              
              <div className="report-content">
                <div className="result-row">
                  <span className="label">HAZARD POTENTIAL</span>
                  <span className={`value serif ${predictionResult.prediction.toLowerCase()}`}>
                    {predictionResult.prediction}
                  </span>
                </div>
                <div className="result-row">
                  <span className="label">MODEL CONFIDENCE</span>
                  <span className="value">{predictionResult.confidence}</span>
                </div>
                <div className="result-row">
                  <span className="label">SYNTHETIC RISK SCORE</span>
                  <span className="value">{predictionResult.risk_score}/10</span>
                </div>
                <div className="result-row">
                  <span className="label">THREAT LEVEL</span>
                  <span className="value bold">{predictionResult.threat_level}</span>
                </div>
              </div>

              <div className="report-footer">
                <p>Analysis synchronized with XGBoost Tectonic Core v4.2</p>
                <p>Timestamp: {predictionResult.timestamp}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx="true">{`
        .prediction-module {
          padding: 40px 0;
          width: 100%;
          margin: 0 auto;
        }
        .module-title {
          font-size: 2.2rem;
          margin-bottom: 12px;
          text-align: center;
        }
        .module-subtitle {
          font-size: 1rem;
          color: var(--text-muted);
          margin-bottom: 48px;
          line-height: 1.6;
          text-align: center;
          max-width: 450px;
          margin-left: auto;
          margin-right: auto;
        }
        .module-canvas {
          display: flex;
          gap: 40px;
          align-items: flex-start;
          justify-content: center;
          width: 100%;
        }
        .inquiry-form {
          flex: 1;
          max-width: 500px;
          display: flex;
          flex-direction: column;
          gap: 24px;
          background: #fff;
          padding: 40px;
          border: 1px solid rgba(29, 29, 31, 0.05);
        }
        .input-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .input-group label {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--text-muted);
          font-weight: 700;
        }
        .input-group input {
          background: transparent;
          border: none;
          border-bottom: 1px solid rgba(29, 29, 31, 0.1);
          padding: 12px 0;
          font-family: var(--font-sans);
          font-size: 1.1rem;
          outline: none;
          transition: border-color 0.2s ease;
        }
        .input-group input:focus {
          border-bottom-color: var(--text-charcoal);
        }
        
        .results-report {
          flex: 1;
          max-width: 500px;
          background-color: #fff;
          border: 1px solid rgba(29, 29, 31, 0.08);
          padding: 40px;
          box-shadow: 0 15px 45px rgba(0,0,0,0.03);
          border-left: 4px solid var(--text-charcoal);
        }
        .report-header {
          display: flex;
          justify-content: space-between;
          font-size: 0.7rem;
          letter-spacing: 0.2em;
          color: var(--text-muted);
          border-bottom: 1px solid rgba(29, 29, 31, 0.05);
          padding-bottom: 16px;
          margin-bottom: 32px;
        }
        .report-content {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .result-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .result-row .label {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-muted);
          letter-spacing: 0.05em;
        }
        .result-row .value {
          font-size: 1.3rem;
        }
        .result-row .value.high { color: #d00; }
        .result-row .value.medium { color: #d80; }
        .result-row .value.low { color: #080; }
        .result-row .value.bold { font-weight: 800; }
        
        .report-footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px dashed rgba(29, 29, 31, 0.1);
          font-size: 0.65rem;
          color: var(--text-muted);
          line-height: 1.5;
        }

        @media (max-width: 1000px) {
          .module-canvas {
            flex-direction: column;
            align-items: center;
          }
          .inquiry-form, .results-report {
            width: 100%;
            max-width: 600px;
          }
        }
      `}</style>
    </div>
  );
};

export default PredictionModule;
