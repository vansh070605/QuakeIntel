import React, { useState, useEffect } from 'react';
import { Zap, Activity, Database, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

const MlMonitor = ({ predictionResult }) => {
  const [featureStream, setFeatureStream] = useState([
    { label: 'LATITUDE', val: '20.0000', delta: '+0.000' },
    { label: 'LONGITUDE', val: '0.0000', delta: '-0.000' },
    { label: 'CRUST_DEPTH', val: '10.0', delta: '+0.0' },
    { label: 'TEMPORAL_HOUR', val: '18', delta: '0' },
    { label: 'MONTH_CYCLE', val: '04', delta: '0' },
    { label: 'DOW_INDEX', val: '04', delta: '0' },
    { label: 'LAG_TSL', val: '24.0', delta: '+0.1' },
    { label: 'SPATIAL_ZONE', val: '-1', delta: 'N/A' },
  ]);

  // Update stream when a real prediction arrives
  useEffect(() => {
    if (predictionResult) {
       // Note: In a real enterprise app, these would come from the API
       // Here we simulate the values updating to match the intent
       setFeatureStream(prev => prev.map(f => ({
         ...f,
         delta: (Math.random() * 0.01).toFixed(3)
       })));
    }
  }, [predictionResult]);

  return (
    <div className="glass-panel" style={{ 
      gridArea: 'ml-panel', 
      padding: '20px', 
      borderLeft: '1px solid var(--border-amber)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Zap size={14} color="var(--neon-amber)" />
          <h2 style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '1px' }}>ML_CORE_SYNCHRONIZED</h2>
        </div>
        <div style={{ fontSize: '0.6rem', background: 'rgba(245, 158, 11, 0.1)', color: 'var(--neon-amber)', padding: '2px 6px', border: '1px solid var(--border-amber)' }}>
          v4.2_GOLD
        </div>
      </header>

      <section style={{ flexGrow: 1 }}>
        <h3 style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.4)', marginBottom: '16px', fontFamily: 'var(--font-mono)' }}>8-FEATURE_VECTOR_STREAM</h3>
        
        <div className="vector-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {featureStream.map((f, i) => (
            <div key={i} className="vector-card" style={{ 
              padding: '10px', 
              background: 'rgba(0,0,0,0.3)', 
              border: '1px solid var(--border-dim)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ fontSize: '0.5rem', color: 'var(--neon-amber)', marginBottom: '4px' }}>{f.label}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 700 }}>{f.val}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--neon-green)' }}>{f.delta}</span>
              </div>
              <motion.div 
                initial={{ width: '0%' }}
                animate={{ width: `${Math.random() * 60 + 40}%` }}
                transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
                style={{ height: '1px', background: 'var(--neon-amber)', marginTop: '6px', opacity: 0.3 }}
              />
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginTop: '20px', padding: '15px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-dim)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Cpu size={12} color="var(--neon-cyan)" />
            <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.6)' }}>CONFIDENCE_INDEX</span>
          </div>
          <span style={{ fontSize: '0.65rem', color: 'var(--neon-cyan)', fontFamily: 'var(--font-mono)' }}>
            {predictionResult ? predictionResult.confidence : '98.2%'}
          </span>
        </div>
        <div style={{ height: '3px', background: 'rgba(255,255,255,0.05)', borderRadius: '1px', overflow: 'hidden' }}>
          <motion.div 
            animate={predictionResult ? { width: predictionResult.confidence } : { x: ['-100%', '100%'] }}
            transition={predictionResult ? { duration: 1 } : { duration: 2, repeat: Infinity, ease: 'linear' }}
            style={{ 
                width: predictionResult ? predictionResult.confidence : '40%', 
                height: '100%', 
                background: 'var(--neon-cyan)', 
                boxShadow: '0 0 10px var(--neon-cyan)' 
            }}
          />
        </div>
      </section>
    </div>
  );
};

export default MlMonitor;
