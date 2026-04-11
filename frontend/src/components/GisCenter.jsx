import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Navigation } from 'lucide-react';

// --- INDUSTRIAL MAP THEME ---
const MAP_TILES = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";

// Component to handle map center changes smoothly
const ChangeView = ({ center, zoom }) => {
  const map = useMap();
  map.setView(center, zoom);
  return null;
};

const GisCenter = ({ historicalData, scanningCoords }) => {
  const [plates, setPlates] = useState(null);

  useEffect(() => {
    // Fetch tectonic boundary data for industrial context
    fetch('https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json')
      .then(res => res.json())
      .then(data => setPlates(data))
      .catch(err => console.error("Plates Feed Fault:", err));
  }, []);

  return (
    <div className="glass-panel" style={{ gridArea: 'gis-main', position: 'relative', overflow: 'hidden', background: '#000' }}>
      <div className="scanline"></div>
      
      <MapContainer 
        center={[20, 0]} 
        zoom={2} 
        scrollWheelZoom={true} 
        style={{ width: '100%', height: '100%' }}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer url={MAP_TILES} />
        
        {/* Tectonic Boundaries Overlay */}
        {plates && <GeoJSON data={plates} style={{ color: 'var(--neon-cyan)', weight: 1, opacity: 0.3, dashArray: '3, 8' }} />}

        {/* Historical Events */}
        {historicalData && historicalData.features && historicalData.features.map((feature, i) => {
          const [lon, lat] = feature.geometry.coordinates;
          const mag = feature.properties.mag;
          const color = mag > 6 ? 'var(--neon-red)' : (mag > 4.5 ? 'var(--neon-amber)' : 'var(--neon-cyan)');
          
          return (
            <CircleMarker 
              key={i}
              center={[lat, lon]} 
              radius={mag * 1.5}
              pathOptions={{
                fillColor: color,
                color: '#fff',
                weight: 0.5,
                opacity: 1,
                fillOpacity: 0.2
              }}
            >
              <Popup>
                <div style={{ background: '#0f172a', color: '#fff', padding: '8px', border: '1px solid var(--border-cyan)' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--neon-cyan)', marginBottom: '4px' }}>SEISMIC_EVENT_ID: {i}</div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800 }}>MAGNITUDE: {mag}</div>
                  <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.6)' }}>DEPTH: {feature.properties.depth} KM</div>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}

        {/* Global HUD Overlay UI */}
        <div style={{ position: 'absolute', top: '24px', left: '24px', zIndex: 1000, pointerEvents: 'none' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', background: 'rgba(2, 6, 23, 0.8)', padding: '12px', border: '1px solid var(--border-cyan)' }}>
            <div style={{ color: 'var(--neon-cyan)' }}>GIS_SURVEILLANCE_CENTER</div>
            <div style={{ color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>{new Date().toISOString()}</div>
          </div>
        </div>

        {scanningCoords && <ChangeView center={scanningCoords} zoom={6} />}
      </MapContainer>
    </div>
  );
};

export default GisCenter;
