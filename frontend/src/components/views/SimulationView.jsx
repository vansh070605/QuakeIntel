import React, { useState, useEffect, useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Stars, PerspectiveCamera, Html } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';

// --- GEOGRAPHIC UTILS ---
const latLonToVector3 = (lat, lon, radius) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
};

// --- INSTANCED SEISMIC NODES ---
const SeismicNodes = ({ data, onHover }) => {
  const meshRef = useRef();
  const tempObject = new THREE.Object3D();

  const points = useMemo(() => {
    return (data || []).map(p => {
      const adjustedRadius = 5 - (p.depth / 200); 
      return latLonToVector3(p.lat, p.lon, adjustedRadius);
    });
  }, [data]);

  useFrame(() => {
    if (!meshRef.current || !data) return;
    
    data.forEach((p, i) => {
      const pos = points[i];
      if (!pos) return;
      tempObject.position.set(pos.x, pos.y, pos.z);
      
      const pulse = 1 + Math.sin(Date.now() * 0.003 + i) * 0.15;
      const scale = (p.mag * 0.015) * pulse;
      tempObject.scale.set(scale, scale, scale);
      
      tempObject.updateMatrix();
      meshRef.current.setMatrixAt(i, tempObject.matrix);
      
      const color = new THREE.Color(
        p.risk_score > 7 ? '#ef4444' : p.risk_score > 4 ? '#f97316' : '#22c55e'
      );
      meshRef.current.setColorAt(i, color);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  });

  if (!data || data.length === 0) return null;

  return (
    <instancedMesh 
      ref={meshRef} 
      args={[null, null, data.length]}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover(data[e.instanceId]);
      }}
      onPointerOut={() => onHover(null)}
    >
      <sphereGeometry args={[1, 12, 12]} />
      <meshBasicMaterial transparent opacity={0.6} depthWrite={false} />
    </instancedMesh>
  );
};

// --- REALISTIC WORLD (Earth + Nodes) ---
const RealisticWorld = ({ children, isRotating }) => {
  const groupRef = useRef();
  const cloudRef = useRef();
  
  const [dayMap, nightMap, bumpMap, cloudMap] = useLoader(THREE.TextureLoader, [
    'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg',
    'https://unpkg.com/three-globe/example/img/earth-night.jpg',
    'https://unpkg.com/three-globe/example/img/earth-topology.png',
    'https://clouds.matteason.co.uk/images/4096x2048/clouds.jpg'
  ]);

  useFrame(() => {
    if (!isRotating || !groupRef.current) return;
    groupRef.current.rotation.y += 0.0005;
    if (cloudRef.current) cloudRef.current.rotation.y += 0.0002; // Extra relative speed
  });

  return (
    <group>
      {/* STATIONARY ATMOSPHERE HALO */}
      <mesh scale={[1.15, 1.15, 1.15]}>
        <sphereGeometry args={[5, 64, 64]} />
        <meshBasicMaterial 
          color="#88ccff" 
          transparent 
          opacity={0.05} 
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* ROTATING BASE (Earth + Nodes) */}
      <group ref={groupRef}>
        <mesh receiveShadow>
          <sphereGeometry args={[5, 128, 128]} />
          <meshStandardMaterial 
            map={dayMap}
            bumpMap={bumpMap}
            bumpScale={0.15}
            emissiveMap={nightMap}
            emissive={new THREE.Color('#ffffcc')}
            emissiveIntensity={1.2}
            roughness={0.8}
            metalness={0.1}
          />
        </mesh>
        
        {/* Dynamic Nodes now live here to rotate WITH the earth */}
        {children}

        {/* CLOUD LAYER (Inside group to inherit base spin, plus extra) */}
        <mesh ref={cloudRef} scale={[1.008, 1.008, 1.008]}>
          <sphereGeometry args={[5, 64, 64]} />
          <meshStandardMaterial 
            map={cloudMap}
            transparent
            opacity={0.25}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>
    </group>
  );
};

const SimulationView = () => {
  const [data, setData] = useState([]);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [isRotating, setIsRotating] = useState(true);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/historical_dataset')
      .then(res => res.json())
      .then(result => {
        if (result.status === 'success') {
          setData(result.data.slice(0, 5000));
        }
      })
      .catch(err => console.error("Data Load Fault:", err));
  }, []);

  return (
    <div className="full-screen-canvas" style={{ background: '#000000', position: 'relative' }}>
      <Canvas dpr={[1, 2]} shadows>
        <PerspectiveCamera makeDefault position={[0, 0, 15]} />
        <OrbitControls 
          enablePan={false} 
          minDistance={6} 
          maxDistance={30}
          autoRotate={isRotating}
          autoRotateSpeed={0.3}
        />
        
        <ambientLight intensity={0.4} />
        
        <directionalLight 
          position={[10, 5, 10]} 
          intensity={2} 
          color="#fff5e6"
          castShadow
        />

        <Stars radius={150} depth={50} count={6000} factor={4} saturation={1} fade speed={1} />
        
        <Suspense fallback={<Html center><div className="loader-text">INITIALIZING_GLOBAL_SURVEILLANCE...</div></Html>}>
          <RealisticWorld isRotating={isRotating}>
            <SeismicNodes data={data} onHover={setHoveredNode} />
          </RealisticWorld>
        </Suspense>
      </Canvas>

      {/* EXPLORER HUD */}
      <div className="explorer-hud" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', padding: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <motion.div 
            initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            className="hud-card"
            style={{ pointerEvents: 'auto' }}
          >
            <div className="tag">ORBITAL_PLATFORM_V4</div>
            <h1 className="title serif">Global Surveillance</h1>
            <p className="subtitle">Operational Seismic Intelligence Network</p>
            
            <div className="stats-row">
              <div className="stat">
                <span className="num">{Math.floor(data.length / 1000)}K</span>
                <span className="lab">NODES</span>
              </div>
              <div className="stat">
                <span className="num">700KM</span>
                <span className="lab">Z-RANGE</span>
              </div>
            </div>
          </motion.div>

          {/* DYNAMIC DOSSIER */}
          <AnimatePresence>
            {hoveredNode && (
              <motion.div 
                initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 20, opacity: 0 }}
                className="hud-card dossier"
                style={{ pointerEvents: 'auto', width: '300px' }}
              >
                <div className="dossier-header">
                  <span className="tag-yellow">TARGET_ACQUIRED</span>
                  <h2>{hoveredNode.place?.split(',').pop()?.trim() || 'Global Point'}</h2>
                </div>
                <div className="divider-sm" />
                <div className="metrics">
                  <div className="m-item"><strong>MAG:</strong> {hoveredNode.mag}M</div>
                  <div className="m-item"><strong>DEP:</strong> {hoveredNode.depth}km</div>
                  <div className="m-item"><strong>RSK:</strong> {hoveredNode.risk_score?.toFixed(2)}</div>
                </div>
                <div className="time">{new Date(hoveredNode.time).toLocaleString()}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* BOTTOM CONTROLS */}
        <div style={{ position: 'absolute', bottom: '40px', left: '40px', right: '40px', display: 'flex', justifyContent: 'space-between' }}>
           <div className="status-indicator">
             <div className="dot pulse" />
             <span>LIVE_TECTONIC_STREAM_ENABLED</span>
           </div>
           
           <div className="controls-group" style={{ pointerEvents: 'auto' }}>
             <button onClick={() => setIsRotating(!isRotating)} className="btn-explorer">
               {isRotating ? 'SUSPEND_ORBIT' : 'RESUME_ORBIT'}
             </button>
           </div>
        </div>
      </div>

      <style jsx="true">{`
        .loader-text {
          color: white;
          font-family: monospace;
          font-size: 0.8rem;
          letter-spacing: 0.2em;
          animation: blink 1.5s infinite;
        }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        
        .hud-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 24px;
          border-radius: 4px;
          color: white;
        }
        .tag { font-size: 0.6rem; letter-spacing: 0.2em; color: #88ccff; font-weight: 800; margin-bottom: 8px; }
        .tag-yellow { font-size: 0.6rem; letter-spacing: 0.2em; color: #fbbf24; font-weight: 800; }
        .title { font-size: 1.8rem; margin: 0; color: white; }
        .subtitle { font-size: 0.75rem; opacity: 0.6; margin-top: 4px; }
        .stats-row { display: flex; gap: 30px; margin-top: 20px; }
        .stat .num { display: block; font-size: 1.2rem; font-weight: 800; color: #88ccff; }
        .stat .lab { font-size: 0.6rem; opacity: 0.4; letter-spacing: 0.1em; }
        .divider-sm { height: 1px; background: rgba(255,255,255,0.1); margin: 12px 0; }
        .metrics { display: flex; gap: 15px; font-size: 0.8rem; margin-bottom: 8px; }
        .time { font-size: 0.65rem; opacity: 0.5; }
        .status-indicator { display: flex; align-items: center; gap: 10px; color: white; font-size: 0.6rem; letter-spacing: 0.15em; font-weight: 700; }
        .dot { width: 6px; height: 6px; background: #22c55e; border-radius: 50%; }
        .dot.pulse { animation: pulse 2s infinite; }
        @keyframes pulse { 0% { opacity: 0.4; } 50% { opacity: 1; } 100% { opacity: 0.4; } }
        .btn-explorer {
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          color: white;
          padding: 10px 24px;
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          cursor: pointer;
          transition: all 0.3s;
        }
        .btn-explorer:hover { background: white; color: black; }
      `}</style>
    </div>
  );
};

export default SimulationView;
