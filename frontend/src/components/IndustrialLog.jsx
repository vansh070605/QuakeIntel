import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, ShieldAlert, Cpu, Network } from 'lucide-react';

const IndustrialLog = ({ externalLogs = [] }) => {
  const [internalLogs, setInternalLogs] = useState([
    { type: 'sys', msg: 'INITIALIZING_CORE_REQUISITION...' },
    { type: 'io',  msg: 'LINKING_GEOSPATIAL_TILE_PROV_01...' },
    { type: 'net', msg: 'ESTABLISHING_SECURE_WSS_SYNC...' },
    { type: 'ml',  msg: 'XGBOOST_MODEL_READY [ID: 0x4f22]' },
  ]);

  const logEndRef = useRef(null);

  // Combine internal simulated logs with real external events
  const allLogs = [...internalLogs, ...externalLogs];

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [allLogs]);

  // Simulate some background hum
  useEffect(() => {
    const hum = ["BUFFER_CLEARED", "CORE_WATCHDOG_OK", "MAP_CACHED_S01"];
    const interval = setInterval(() => {
      const msg = hum[Math.floor(Math.random() * hum.length)];
      setInternalLogs(prev => [...prev.slice(-10), { type: 'auto', msg }]);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-panel" style={{ 
      gridArea: 'terminal', 
      background: '#000', 
      padding: '16px', 
      display: 'flex', 
      flexDirection: 'column',
      borderTop: '1px solid var(--border-dim)'
    }}>
      <header style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        marginBottom: '12px', 
        borderBottom: '1px solid #1e293b', 
        paddingBottom: '8px' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TerminalIcon size={14} color="var(--neon-amber)" />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '1px' }}>
            ROOT@SEISMOSENSE:~/TACTICAL_LOGS
          </span>
        </div>
      </header>

      <div style={{ 
        flexGrow: 1, 
        fontFamily: 'var(--font-mono)', 
        fontSize: '0.7rem', 
        color: 'var(--neon-amber)', 
        overflowY: 'auto',
        lineHeight: '1.4'
      }}>
        {allLogs.map((log, i) => (
          <div key={i} style={{ marginBottom: '2px', display: 'flex', gap: '8px' }}>
            <span style={{ color: 'rgba(255,255,255,0.15)' }}>[{new Date().toLocaleTimeString('en-GB')}]</span>
            <span style={{ color: log.type === 'auto' ? 'rgba(245, 158, 11, 0.6)' : 'var(--neon-amber)' }}>
              {log.msg}
            </span>
          </div>
        ))}
        <div ref={logEndRef} />
        <div className="terminal-cursor"></div>
      </div>
    </div>
  );
};

export default IndustrialLog;
