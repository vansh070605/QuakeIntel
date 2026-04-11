import React from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Professional Crosshair Icon
const crosshairIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-black.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const MapClickHandler = ({ onLocationPick }) => {
  useMapEvents({
    click(e) {
      onLocationPick(e.latlng.lat.toFixed(4), e.latlng.lng.toFixed(4));
    },
  });
  return null;
};

const LocationPickerMap = ({ pickedCoords, onLocationPick }) => {
  const position = pickedCoords ? [pickedCoords.lat, pickedCoords.lon] : null;

  return (
    <div className="location-picker-map" style={{ height: '100%', width: '100%', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
      <MapContainer 
        center={[20, 0]} 
        zoom={2} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
        zoomControl={true}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; CARTO'
        />
        
        <MapClickHandler onLocationPick={onLocationPick} />

        {position && (
          <Marker position={position} icon={crosshairIcon} />
        )}
      </MapContainer>
      
      <div style={{ position: 'absolute', bottom: '12px', left: '12px', zIndex: 1000, background: 'rgba(255,255,255,0.9)', padding: '6px 12px', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 600, color: '#64748b', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        CLICK ANYWHERE TO PICK COORDINATES
      </div>
    </div>
  );
};

export default LocationPickerMap;
