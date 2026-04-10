import React from 'react';
import { motion } from 'framer-motion';

const ResearchView = () => {
  const features = [
    {
      id: "TSL",
      name: "Time Since Last",
      desc: "Measures the temporal gap between seismic pulses. Our research shows that 'quiescence'—the silence between quakes—is a primary indicator of pressure accumulation.",
      importance: "0.42"
    },
    {
      id: "ZONE",
      name: "Spatial Cluster (DBSCAN)",
      desc: "Using Density-Based Spatial Clustering of Applications with Noise (DBSCAN), we identify persistent seismic 'neighborhoods'. The zone ID correlates strongly with local plate interface dynamics.",
      importance: "0.28"
    },
    {
      id: "TEMP",
      name: "Temporal Cycles",
      desc: "Analyzing 'hour' and 'day_of_week' captures subtle variations in sensor sensitivity and tidal/environmental noise patterns that refine model precision.",
      importance: "0.15"
    },
    {
      id: "GEO",
      name: "3D Coordinates",
      desc: "Depth, Latitude, and Longitude form the spatial anchor. The model evaluates risk gradients specifically across subduction trenches and transform boundaries.",
      importance: "0.15"
    }
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
