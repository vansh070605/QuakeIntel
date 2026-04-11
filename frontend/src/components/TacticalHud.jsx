import React, { useState } from 'react';
import { Activity, Shield, Crosshair, Settings, Radio, AlertTriangle } from 'lucide-react';

const TacticalHud = ({ onScanInitiated, isScanning, predictionResult }) => {
  const [inputs, setInputs] = useState({ lat: '', lon: '', depth: '10' });

  const handleInput = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const triggerScan = () => {
    onScanInitiated(inputs.lat, inputs.lon, inputs.depth);
  };

  return (
    <div className="glass-panel" style={{ 
      gridArea: 'hud-left', 
      display: 'flex', 
      flexDirection: 'column', 
      padding: '24px', 
      height: '100%',
      zIndex: 20
    }}>
      <header style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div className="record-dot"></div>
          <h1 style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '2px', color: '#fff' }}>SEISMOSENSE</h1>
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--neon-green)' }}>
          LINKED_CORE: v4.2 GOLD // ENCRYPTION: SECURE
        </div>
      </header>

      <div style={{ flexGrow: 1 }}>
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '0.6rem', color: 'var(--neon-cyan)', marginBottom: '12px', letterSpacing: '1px' }}>OPERATIONAL_MODE</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button className={`tactical-btn ${!predictionResult ? 'active' : ''}`}>
              <Activity size={14} /> HISTORICAL_SURVEILLANCE
            </button>
            <button className={`tactical-btn ${predictionResult ? 'active' : ''}`}>
              <Shield size={14} /> PREDICTIVE_ANALYSIS
            </button>
          </div>
        </div>

        <div style={{ padding: '20px', border: '1px solid var(--border-cyan)', background: 'rgba(6, 182, 212, 0.03)' }}>
          <h3 style={{ fontSize: '0.6rem', color: 'var(--neon-cyan)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Crosshair size={12} /> TARGET_ACQUISITION
          </h3>
          
          <div className="input-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div className="input-group">
              <label>LATITUDE_X</label>
              <input type="number" name="lat" value={inputs.lat} onChange={handleInput} placeholder="35.6" />
            </div>
            <div className="input-group">
              <label>LONGITUDE_Y</label>
              <input type="number" name="lon" value={inputs.lon} onChange={handleInput} placeholder="139.6" />
            </div>
          </div>

          <div className="input-group" style={{ marginBottom: '20px' }}>
            <label>DEPTH_VECTOR (KM)</label>
            <input type="number" name="depth" value={inputs.depth} onChange={handleInput} placeholder="10.0" />
          </div>

          <button className="scan-trigger" onClick={triggerScan} disabled={isScanning}>
            {isScanning ? 'SCANNING_IN_PROGRESS...' : 'INITIATE_CRUSTAL_SCAN'}
          </button>
        </div>

        {/* --- LIVE INTEL REPORT --- */}
        {predictionResult && (
          <div style={{ 
            marginTop: '20px', 
            padding: '16px', 
            border: '1px solid var(--neon-cyan)', 
            background: 'rgba(6, 182, 212, 0.1)',
            animation: 'fadeIn 0.5s ease'
          }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.6rem', color: 'var(--neon-cyan)' }}>INTEL_REPORT</span>
                <span style={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.4)' }}>{predictionResult.timestamp}</span>
             </div>
             <h2 style={{ fontSize: '1.4rem', color: '#fff', margin: '4px 0' }}>{predictionResult.prediction}</h2>
             <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--neon-amber)' }}>RISK: {predictionResult.risk_score}</span>
                <span style={{ fontSize: '0.6rem', background: 'var(--neon-red)', color: '#fff', padding: '1px 4px' }}>{predictionResult.threat_level}</span>
             </div>
             <div style={{ marginTop: '10px', fontSize: '0.55rem', opacity: 0.6 }}>CONFIDENCE: {predictionResult.confidence}</div>
          </div>
        )}
      </div>

      <footer style={{ marginTop: '20px', borderTop: '1px solid var(--border-dim)', paddingTop: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.3)' }}>HUB_PROTOCOL_S01</span>
          <Settings size={12} color="rgba(255,255,255,0.3)" />
        </div>
      </footer>
    </div>
  );
};

export default TacticalHud;
