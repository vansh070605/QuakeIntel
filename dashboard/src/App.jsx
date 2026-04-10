import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import BriefOverlay from './components/BriefOverlay';

// VIEWS
import IntelligenceView from './components/views/IntelligenceView';
import SurveillanceView from './components/views/SurveillanceView';
import SimulationView from './components/views/SimulationView';
import ResearchView from './components/views/ResearchView';
import DossierView from './components/views/DossierView';

const App = () => {
  const [activeSection, setActiveSection] = useState('intelligence');
  const [predictionResult, setPredictionResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isBriefOpen, setIsBriefOpen] = useState(false);

  // --- SYNC WITH HASH ---
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (['intelligence', 'surveillance', 'simulation', 'analysis', 'dossier'].includes(hash)) {
        setActiveSection(hash);
      }
    };
    window.addEventListener('hashchange', handleHash);
    handleHash();
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  useEffect(() => {
    window.location.hash = activeSection;
    window.scrollTo(0, 0);
  }, [activeSection]);

  const handlePredict = async (lat, lon, depth) => {
    setIsLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:5000/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat, lon, depth })
      });
      const result = await response.json();
      if (result.status === 'success') {
        setPredictionResult(result);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'intelligence':
        return (
          <IntelligenceView 
            onPredict={handlePredict} 
            predictionResult={predictionResult}
            isLoading={isLoading}
          />
        );
      case 'surveillance':
        return <SurveillanceView />;
      case 'simulation':
        return <SimulationView />;
      case 'analysis':
        return <ResearchView />;
      case 'dossier':
        return <DossierView />;
      default:
        return <IntelligenceView onPredict={handlePredict} />;
    }
  };

  return (
    <div className="magazine-root">
      <Header activeSection={activeSection} setActiveSection={setActiveSection} />
      
      <main>
        <AnimatePresence mode="wait">
          {renderContent()}
        </AnimatePresence>
      </main>

      {/* GLOBAL (i) TRIGGER */}
      <button 
        className="info-trigger" 
        onClick={() => setIsBriefOpen(true)}
        title="Intelligence Brief"
      >
        i
      </button>

      {/* BRIEF OVERLAY */}
      <BriefOverlay 
        isOpen={isBriefOpen} 
        onClose={() => setIsBriefOpen(false)} 
        context={activeSection}
      />

      <style jsx="true">{`
        .magazine-root {
          min-height: 100vh;
          background-color: var(--bg-cream);
          display: flex;
          flex-direction: column;
        }
        .placeholder-view {
          min-height: 60vh;
        }
        .placeholder-content {
          font-size: 2rem;
          color: var(--text-charcoal);
          opacity: 0.3;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          padding: 100px 40px;
          border: 1px dashed rgba(29, 29, 31, 0.1);
        }
        .data-desk-imagery {
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        .cover-img.grayscale {
          filter: grayscale(1) contrast(1.1);
          opacity: 0.8;
          height: 80vh;
          object-fit: cover;
        }
      `}</style>
    </div>
  );
};

export default App;
