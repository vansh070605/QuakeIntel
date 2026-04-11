import React from 'react';
import { motion } from 'framer-motion';

const DossierView = () => {
  return (
    <div className="full-screen-canvas" style={{ overflowY: 'auto', padding: '120px 40px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <span className="serif italic" style={{ fontSize: '0.9rem', color: 'var(--text-muted)', letterSpacing: '0.3em' }}>PROJECT_INTELLIGENCE_DOSSIER</span>
          <h1 className="display-large serif mt-md">Seismic Sovereignty</h1>
          
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
                  QuakeIntel (SeismoSense v4.2) bridges this gap using a hybrid GIS-XGBoost pipeline. By synthesizing spatial clustering (DBSCAN) with temporal quiescence analysis, we provide a granular "Risk Score" for any coordinate on the lithospheric grid. Our model identifies subduction-zone instabilities before they manifest as surface-level catastrophes.
                </p>
              </section>
            </div>

            <div className="dossier-spec" style={{ borderLeft: '1px solid rgba(0,0,0,0.05)', paddingLeft: '40px' }}>
              <div className="spec-item">
                <label style={{ fontSize: '0.6rem', fontWeight: 800 }}>TECHNOLOGY_STACK</label>
                <div className="serif mt-sm" style={{ fontSize: '1.2rem' }}>React 19 / Vite</div>
                <div className="serif" style={{ fontSize: '1.2rem' }}>Flask / Scikit-Learn</div>
              </div>
              <div className="spec-item mt-xl">
                <label style={{ fontSize: '0.6rem', fontWeight: 800 }}>MODEL_ARCHITECTURE</label>
                <div className="serif mt-sm" style={{ fontSize: '1.2rem' }}>XGBoost Ensemble</div>
              </div>
              <div className="spec-item mt-xl">
                <label style={{ fontSize: '0.6rem', fontWeight: 800 }}>DATA_HORIZON</label>
                <div className="serif mt-sm" style={{ fontSize: '1.2rem' }}>2015 - 2024 Archive</div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="mt-xl" style={{ borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '60px', opacity: 0.6 }}>
          <p className="serif italic" style={{ fontSize: '0.8rem', letterSpacing: '0.1em' }}>
            THIS DOCUMENT IS INTENDED FOR INFORMATIONAL AND SCIENTIFIC REVIEW. ALL PREDICTIONS ARE BASED ON PROBABILISTIC MODELS OF HISTORICAL PATTERNS.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DossierView;
