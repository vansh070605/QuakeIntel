import React from 'react';
import { motion } from 'framer-motion';

const DossierView = () => {
  const features = [
    {
      id: "ZONE",
      name: "Spatial Zone (DBSCAN)",
      desc: "Density-Based Spatial Clustering identifies localized seismic neighborhoods. Critical for region-specific stress modeling.",
      importance: "0.45"
    },
    {
      id: "TSL",
      name: "Time Since Last",
      desc: "Measures temporal gaps between pulses. Quiescence is a primary indicator of pressure accumulation.",
      importance: "0.18"
    },
    {
      id: "DEPTH",
      name: "Lithospheric Depth",
      desc: "The vertical coordinate. Subduction zone quakes behave differently at varying depths (0-700km).",
      importance: "0.12"
    },
    {
      id: "GEO",
      name: "Spatial Anchor",
      desc: "Latitude and Longitude evaluate risk gradients across subduction trenches and transform boundaries.",
      importance: "0.25"
    }
  ];

  const metrics = [
    { label: "ULTIMATE ACCURACY", value: "98.17%", color: "#080" },
    { label: "F1 STABILITY", value: "0.9726", color: "#080" },
    { label: "TRAINING RECORDS", value: "72,508", color: "var(--text-charcoal)" }
  ];

  return (
    <div className="full-screen-canvas" style={{ overflowY: 'auto', padding: '100px 40px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        {/* SECTION 1: NARRATIVE HERO */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <span className="serif italic" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', letterSpacing: '0.3em' }}>INTERNAL_SYSTEM_DOSSIER_v4.3</span>
          <h1 className="display-large serif mt-md" style={{ fontSize: '3.5rem' }}>Seismic Sovereignty</h1>
          
          <div className="mt-xl" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '80px', alignItems: 'start' }}>
            <div className="dossier-narrative">
              <section className="problem-statement">
                <label style={{ fontSize: '0.6rem', fontWeight: 800, opacity: 0.5 }}>PROBLEM_STATEMENT</label>
                <p className="mt-md" style={{ fontSize: '1.2rem', lineHeight: '1.6', color: 'var(--text-charcoal)' }}>
                  Increasing global seismic volatility requires low-latency, high-precision hazard modeling. Conventional geophysical methods often fail to capture the multi-dimensional complexity of plate interface dynamics in real-time.
                </p>
              </section>

              <section className="the-solution mt-xl">
                <label style={{ fontSize: '0.6rem', fontWeight: 800, opacity: 0.5 }}>THE_SOLUTION</label>
                <p className="mt-md text-muted" style={{ fontSize: '1rem', lineHeight: '1.8' }}>
                  QuakeIntel (SeismoSense v4.3) bridges this gap using a hybrid GIS-XGBoost pipeline. By synthesizing spatial clustering (DBSCAN) with temporal quiescence analysis, we provide a granular "Risk Score" for any coordinate on the lithospheric grid.
                </p>
              </section>
            </div>

            <div className="dossier-spec" style={{ borderLeft: '1px solid rgba(0,0,0,0.05)', paddingLeft: '40px' }}>
              <div className="spec-item">
                <label style={{ fontSize: '0.6rem', fontWeight: 800 }}>TECH_STACK</label>
                <div className="serif mt-sm" style={{ fontSize: '1.1rem' }}>React 19 / Vite / Three.js</div>
                <div className="serif" style={{ fontSize: '1.1rem' }}>Flask / Scikit-Learn / XGBoost</div>
              </div>
              <div className="spec-item mt-xl">
                <label style={{ fontSize: '0.6rem', fontWeight: 800 }}>DATA_HORIZON</label>
                <div className="serif mt-sm" style={{ fontSize: '1.1rem' }}>2015 - 2024 Archive</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* SECTION 2: TECHNICAL PERFORMANCE (METRICS) */}
        <div style={{ marginTop: '100px', borderTop: '2px solid #000', paddingTop: '60px' }}>
          <label style={{ fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.2em' }}>TECHNICAL_ANALYSIS_CORE</label>
          <div className="metrics-hud mt-xl" style={{ display: 'flex', gap: '60px' }}>
            {metrics.map((m, i) => (
              <div key={m.label}>
                <label style={{ fontSize: '0.65rem', opacity: 0.5 }}>{m.label}</label>
                <div className="serif" style={{ fontSize: '3rem', color: m.color, lineHeight: 1 }}>{m.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 3: FEATURE IMPORTANCE GRID */}
        <div className="mt-xl" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '30px', marginTop: '60px' }}>
          {features.map((f) => (
            <div key={f.id} style={{ background: '#fff', padding: '30px', border: '1px solid rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', opacity: 0.4 }}>
                <span className="serif italic" style={{ fontSize: '0.7rem' }}>{f.id}</span>
                <span style={{ fontSize: '0.7rem', fontWeight: 800 }}>IMPORTANCE {f.importance}</span>
              </div>
              <h4 className="serif mt-md">{f.name}</h4>
              <p className="mt-sm sm" style={{ fontSize: '0.8rem', opacity: 0.6, lineHeight: 1.5 }}>{f.desc}</p>
            </div>
          ))}
        </div>

        {/* FOOTER: SCIENTIFIC NOTE */}
        <div className="mt-xl" style={{ borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '60px', opacity: 0.4 }}>
          <p className="serif sm italic" style={{ fontSize: '0.7rem', letterSpacing: '0.1em', maxWidth: '800px' }}>
            THIS DOCUMENT IS INTENDED FOR INFORMATIONAL AND SCIENTIFIC REVIEW. SYSTEM CORE v4.3. TRAINING INVOLVES 72,508 HISTORICAL RECORDS. MARGIN OF ERROR &lt; 2%.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DossierView;
