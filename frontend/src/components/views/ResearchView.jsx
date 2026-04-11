import React from 'react';
import { motion } from 'framer-motion';

const ResearchView = () => {
  const features = [
    {
      id: "ZONE",
      name: "Spatial Zone (DBSCAN)",
      desc: "Using Density-Based Spatial Clustering (DBSCAN), we identify localized seismic 'neighborhoods'. This is the model's most critical feature, as tectonic stress is highly region-specific.",
      importance: "0.45"
    },
    {
      id: "TSL",
      name: "Time Since Last",
      desc: "Measures the temporal gap between seismic pulses. Our research shows that 'quiescence'—the silence between quakes—is a primary indicator of pressure accumulation.",
      importance: "0.18"
    },
    {
      id: "DEPTH",
      name: "Lithospheric Depth",
      desc: "The vertical coordinate of the event. Subduction zone quakes behave differently at varying depths (0-700km), directly impacting the surface hazard potential.",
      importance: "0.12"
    },
    {
      id: "GEO",
      name: "Spatial Coordinates",
      desc: "Latitude and Longitude form the spatial anchor. The model evaluates risk gradients specifically across subduction trenches and transform boundaries.",
      importance: "0.25"
    }
  ];

  const metrics = [
    { label: "ULTIMATE ACCURACY", value: "98.17%", color: "#080" },
    { label: "F1 STABILITY SCORE", value: "0.9726", color: "#080" },
    { label: "TRAINING RECORDS", value: "72,508", color: "var(--text-charcoal)" }
  ];

  return (
    <div className="full-screen-canvas" style={{ overflowY: 'auto', padding: '100px 40px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="display-large serif">Technical Analysis</h1>
          <p className="subtitle serif italic mt-lg" style={{ fontSize: '1.4rem', color: 'var(--text-muted)', maxWidth: '600px' }}>
            "Deconstructing the SeismoSense Intelligence Core: Feature Engineering for Global Resilience."
          </p>
        </motion.div>

        {/* METRICS HUD */}
        <div className="metrics-hud mt-xl" style={{ display: 'flex', gap: '30px', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '40px' }}>
          {metrics.map((m, i) => (
            <motion.div 
              key={m.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="metric-pill"
            >
              <label style={{ fontSize: '0.6rem', letterSpacing: '0.2em', opacity: 0.5, fontWeight: 800 }}>{m.label}</label>
              <div className="serif" style={{ fontSize: '2.5rem', color: m.color }}>{m.value}</div>
            </motion.div>
          ))}
        </div>

        <div className="feature-grid mt-xl" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
          {features.map((f, i) => (
            <motion.div 
              key={f.id} 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="research-card"
              style={{ background: '#fff', padding: '40px', border: '1px solid rgba(0,0,0,0.05)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span className="serif italic" style={{ fontSize: '0.8rem', letterSpacing: '0.2em', opacity: 0.4 }}>FEATURE_ID: {f.id}</span>
                <div style={{ textAlign: 'right' }}>
                  <label style={{ fontSize: '0.6rem', fontWeight: 800 }}>IMPORTANCE</label>
                  <div className="serif" style={{ fontSize: '1.2rem' }}>{f.importance}</div>
                </div>
              </div>
              <h3 className="serif mt-md" style={{ fontSize: '1.8rem' }}>{f.name}</h3>
              <p className="mt-lg text-muted" style={{ lineHeight: '1.6' }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="notebook-context mt-xl" style={{ padding: '60px', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
          <h4 className="serif">Methodology Note</h4>
          <p className="mt-md text-muted" style={{ maxWidth: '800px' }}>
            The SeismoSense model utilizes an XGBoost (Extreme Gradient Boosting) classifier. Training involves 72,508 records from 2015-2024, achieving an Ultimate Metric Stability of 98.17% accuracy. Zoning is performed via DBSCAN clustering of scaled spatial coordinates.
          </p>
        </div>
      </div>

      <style jsx="true">{`
        .research-card:hover { border-color: var(--text-charcoal); }
      `}</style>
    </div>
  );
};

export default ResearchView;
