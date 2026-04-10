import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BriefOverlay = ({ isOpen, onClose, context }) => {
  const briefs = {
    intelligence: {
      title: "Intelligence Inquiry Desk",
      quote: "The model is not just a predictor; it is a synthesis of historical chaos.",
      details: "This station utilizes an XGBoost ensemble trained on a decade of seismic telemetry. We evaluate 8 critical features, including Time Since Last (TSL) event and spatial DBSCAN zones, to determine hazard probability at the specified depth."
    },
    surveillance: {
      title: "Global Surveillance Desk",
      quote: "Observation is the first step toward mitigation.",
      details: "A high-fidelity geospatial canvas rendering over 2,000 sampling points from the 2015-2024 seismic archive. Each blip represents a pre-calculated risk score, derived from magnitude density and vertical depth profiles."
    },
    analysis: {
      title: "Technical Analysis Lab",
      quote: "Patterns emerge when we look beyond the epicenter.",
      details: "This lab deconstructs the feature importance of our intelligence core. We explore how temporal cycles (hour/month) and spatial clustering (DBSCAN) influence the final risk assessment."
    },
    dossier: {
      title: "Project Dossier",
      quote: "Structural resilience through digital intelligence.",
      details: "The QuakeIntel initiative seeks to bridge the gap between raw CSV data and actionable geospatial insight. Built with React, Flask, and Scikit-Learn."
    }
  };

  const currentBrief = briefs[context] || briefs.intelligence;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="brief-overlay-root"
          onClick={onClose}
        >
          <motion.div 
            initial={{ y: 50, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="brief-card"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="close-brief" onClick={onClose}>&times;</button>
            <div className="label serif italic">Intelligence Brief</div>
            <h1 className="serif mt-md">{currentBrief.title}</h1>
            <p className="quote serif mt-lg">"{currentBrief.quote}"</p>
            <div className="details mt-xl">
              {currentBrief.details}
            </div>
          </motion.div>

          <style jsx="true">{`
            .brief-overlay-root {
              position: fixed; top: 0; left: 0; width: 100%; height: 100%;
              background: rgba(252, 250, 246, 0.9); backdrop-filter: blur(10px);
              z-index: 10000; display: flex; align-items: center; justify-content: center;
              padding: 40px;
            }
            .brief-card {
              background: #fff; width: 100%; max-width: 600px; padding: 60px;
              border: 1px solid rgba(0,0,0,0.05); position: relative;
              box-shadow: 0 40px 100px rgba(0,0,0,0.1);
            }
            .close-brief {
              position: absolute; top: 30px; right: 30px; background: none; border: none;
              font-size: 2rem; cursor: pointer; opacity: 0.3;
            }
            .label { font-size: 0.8rem; letter-spacing: 0.2em; text-transform: uppercase; opacity: 0.5; }
            .quote { font-size: 1.5rem; line-height: 1.4; color: var(--text-muted); }
            .details { font-size: 1.1rem; line-height: 1.6; border-top: 1px solid rgba(0,0,0,0.05); paddingTop: 40px; }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BriefOverlay;
