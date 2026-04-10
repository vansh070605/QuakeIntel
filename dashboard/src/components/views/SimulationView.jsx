import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';

// --- GEOGRAPHIC UTILS ---
const latLonToVector3 = (lat, lon, radius) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
};

// --- DATA POINT COMPONENT ---
const SeismicNodes = ({ data }) => {
  const points = useMemo(() => {
    return data.map(p => {
      // Map depth to a vector slightly below surface
      // Radius of Earth shell is 5, depth is scaled
      const adjustedRadius = 5 - (p.depth / 200); 
      return latLonToVector3(p.lat, p.lon, adjustedRadius);
    });
  }, [data]);

  return (
    <group>
      {data.map((p, i) => (
        <mesh key={i} position={points[i]}>
          <sphereGeometry args={[p.mag * 0.015, 8, 8]} />
          <meshBasicMaterial 
            color={p.risk_score > 7 ? '#ff3333' : p.risk_score > 4 ? '#ff9900' : '#00ff00'} 
            transparent 
            opacity={0.8} 
          />
        </mesh>
      ))}
    </group>
  );
};

// --- EARTH CORE ---
const Earth = () => {
  const earthRef = useRef();
  
  return (
    <group ref={earthRef}>
      {/* ATMOSPHERE GLOW */}
      <mesh scale={[1.02, 1.02, 1.02]}>
        <sphereGeometry args={[5, 64, 64]} />
        <meshPhongMaterial 
          color="#4488ff" 
          transparent 
          opacity={0.1} 
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* EARTH SHELL */}
      <mesh>
        <sphereGeometry args={[5, 64, 64]} />
        <meshStandardMaterial 
          color="#112233" 
          roughness={0.7}
          metalness={0.2}
          emissive="#000"
        />
      </mesh>
      
      {/* GRID OVERLAY */}
      <mesh scale={[1.001, 1.001, 1.001]}>
        <sphereGeometry args={[5, 32, 32]} />
        <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.05} />
      </mesh>
    </group>
  );
};

const SimulationView = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/historical_dataset')
      .then(res => res.json())
      .then(result => {
        if (result.status === 'success') {
          setData(result.data.slice(0, 1000));
        }
      });
  }, []);

  return (
    <div className="full-screen-canvas" style={{ background: '#000', position: 'relative' }}>
      <Canvas dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 15]} />
        <OrbitControls 
          enablePan={false} 
          minDistance={7} 
          maxDistance={25}
          autoRotate
          autoRotateSpeed={0.5}
        />
        
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        <Earth />
        <SeismicNodes data={data} />
      </Canvas>

      {/* OVERLAY INTERFACE */}
      <div className="interface-overlay modern-hud" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
        <div className="top-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '40px' }}>
          <motion.div 
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            className="overlay-panel glass"
            style={{ width: '400px', pointerEvents: 'auto' }}
          >
            <h2 className="serif" style={{ color: '#fff' }}>Simulation Lab v1.0</h2>
            <p className="text-muted sm">Volumetric Tectonic Analysis</p>
            
            <div className="divider-minimal" style={{ margin: '20px 0', background: 'rgba(255,255,255,0.1)' }}></div>
            
            <div className="telemetry-block">
              <label style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.2em' }}>3D MAPPED NODES</label>
              <div className="value serif" style={{ fontSize: '2rem', color: '#fff' }}>{data.length}</div>
            </div>

            <div className="lab-info mt-3" style={{ marginTop: '20px' }}>
              <p className="sm" style={{ opacity: 0.6, fontSize: '0.75rem', color: '#fff' }}>
                Real-time 3D reconstruction of seismic events. Z-axis represents 
                lithospheric depth (0-700km). Observe the Benioff Zone formation 
                at plate boundaries.
              </p>
            </div>
          </motion.div>

          <div className="technical-panel glass" style={{ pointerEvents: 'auto' }}>
            <div className="status-bit">
              <span className="label" style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.5)' }}>ENGINE: </span>
              <span className="val" style={{ color: '#fff', fontWeight: 'bold' }}>WEBGL 2.0</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx="true">{`
        .glass {
          background: rgba(10, 20, 30, 0.7);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 25px;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};

export default SimulationView;
