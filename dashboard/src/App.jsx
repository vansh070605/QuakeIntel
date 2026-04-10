import React, { useState, useEffect } from 'react';
import GisCenter from './components/GisCenter';
import TacticalHud from './components/TacticalHud';
import MlMonitor from './components/MlMonitor';
import IndustrialLog from './components/IndustrialLog';

const App = () => {
  const [historicalData, setHistoricalData] = useState(null);
  const [scanningCoords, setScanningCoords] = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [activeFeatures, setActiveFeatures] = useState(null);

  // --- DATA FETCHING (HISTORICAL) ---
  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/seismic-data')
      .then(res => res.json())
      .then(data => setHistoricalData(data))
      .catch(err => console.error("History Feed Fault:", err));
  }, []);

  // --- PREDICTION LOGIC ---
  const handleScanInitiated = async (lat, lon, depth) => {
    if (!lat || !lon || !depth) return;

    setIsScanning(true);
    setScanningCoords([parseFloat(lat), parseFloat(lon)]);
    addLog(`INIT SCAN: [${lat}, ${lon}] @ ${depth}KM`);

    try {
      const response = await fetch('http://127.0.0.1:5000/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat, lon: lon, depth }) // Note: Backend expects 'lon' not 'lng'
      });
      
      const result = await response.json();
      
      if (result.status === 'success') {
        setPredictionResult(result);
        addLog(`SCAN SUCCESS: ${result.prediction} HAZARD DETECTED.`);
      } else {
        addLog(`SCAN FAULT: ${result.message}`);
      }
    } catch (err) {
      addLog(`SYSTEM CRITICAL: API CONNECTION REFUSED.`);
    } finally {
      setIsScanning(false);
    }
  };

  // Log sharing between components
  const [logs, setLogs] = useState([]);
  const addLog = (msg) => {
    const entry = { type: 'auto', msg };
    setLogs(prev => [...prev.slice(-15), entry]);
  };

  return (
    <div className="dashboard-grid">
      <GisCenter 
        historicalData={historicalData} 
        scanningCoords={scanningCoords} 
      />

      <TacticalHud 
        onScanInitiated={handleScanInitiated} 
        isScanning={isScanning}
        predictionResult={predictionResult}
      />

      <MlMonitor predictionResult={predictionResult} />

      <IndustrialLog externalLogs={logs} />
    </div>
  );
};

export default App;
