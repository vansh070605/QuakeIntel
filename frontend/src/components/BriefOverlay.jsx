import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BriefOverlay = ({ isOpen, onClose, context }) => {
  const briefs = {
    intelligence: {
      title: "Intelligence Inquiry Desk",
      quote: "The model is not just a predictor; it is a synthesis of historical chaos.",
      details: (
        <div>
          <p><strong>SYSTEM MISSION:</strong> This workstation uses a Machine Learning ensemble to synthesize risk for specific geographical coordinates. It evaluates spatial context against a decade of seismic history.</p>
          <p className="mt-md"><strong>PARAMETER LOGIC:</strong></p>
          <ul className="mt-sm" style={{ listStyle: 'none', padding: 0 }}>
            <li>• <strong>LAT/LON:</strong> Contextualizes the target within historical tectonic zones.</li>
            <li>• <strong>DEPTH:</strong> Source depth is the primary risk dissipator. Shallow events (&lt;50km) concentrate force at the surface, while deep events (300km+) typically lose hazard potential.</li>
            <li>• <strong>HAZARD TABS:</strong> Switches the synthesis mode. <em>Seismic</em> is tectonic-focused, while <em>Tsunami</em> mode specifically analyzes surge potential from shallow-water hypocenters. </li>
          </ul>
        </div>
      )
    },
    surveillance: {
      title: "Global Surveillance Desk",
      quote: "Observation is the first step toward mitigation.",
      details: (
        <div>
          <p><strong>SYSTEM MISSION:</strong> Provides a live geospatial overview of global seismic events. Analysts use this to monitor real-time clusters and density patterns.</p>
          <p className="mt-md"><strong>PARAMETER LOGIC:</strong></p>
          <ul className="mt-sm" style={{ listStyle: 'none', padding: 0 }}>
            <li>• <strong>MAGNITUDE THRESHOLD:</strong> Adjust this filter to reduce background noise. High-magnitude events (7.0+) are automatically prioritized via color-coding to signify critical structural risk.</li>
            <li>• <strong>TEMPORAL RANGE:</strong> Use the timeline to witness the "migration" of seismic activity across fault lines.</li>
          </ul>
        </div>
      )
    },
    simulation: {
      title: "Simulation Lab",
      quote: "Reconstructing the lithospheric volume.",
      details: (
        <div>
          <p><strong>SYSTEM MISSION:</strong> A volumetric 3D projection of tectonic activity. It visualizes the Earth not just as a surface, but as a deep, active volume.</p>
          <p className="mt-md"><strong>PARAMETER LOGIC:</strong></p>
          <ul className="mt-sm" style={{ listStyle: 'none', padding: 0 }}>
            <li>• <strong>Z-AXIS MAPPING:</strong> Points are accurately placed according to their depth. Explore how clusters "plumage" beneath the crust.</li>
            <li>• <strong>RESUME/SUSPEND:</strong> Halt autonomous orbital tracking to lock on specific regional focal points for deep inspection.</li>
          </ul>
        </div>
      )
    },
    dossier: {
      title: "Project Dossier",
      quote: "Structural resilience through digital intelligence.",
      details: "Comprehensive documentation of the SeismoSense system architecture and technical performance. This consolidated archive details the XGBoost model parameters, feature importance (DBSCAN/TSL), and the historical dataset metrics (98.17% accuracy) used for global synthesis."
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
