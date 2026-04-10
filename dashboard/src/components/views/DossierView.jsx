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
              <p className="serif italic" style={{ fontSize: '1.8rem', lineHeight: '1.4' }}>
                "Our mission is to bridge the gap between geological uncertainty and digital absolute."
              </p>
              <div className="divider-minimal mt-xl"></div>
              <p className="mt-xl text-muted" style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
                QuakeIntel represents the synthesis of multi-decade seismic archives and state-of-the-art machine learning. By deconstructing the planet's fractures into a manageable feature set—Lateral Position, Temporal Quiescence, and Spatial Zoning—we provide a granular assessment of global hazard potential.
              </p>
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
