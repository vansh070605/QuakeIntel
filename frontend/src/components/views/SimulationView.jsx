import React, { useState, useEffect, useRef, useMemo, useCallback, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Stars, PerspectiveCamera, Html } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';

// --- GEOGRAPHIC UTILS ---
// Correct formula for Three.js SphereGeometry with equirectangular texture:
// U=0 of the texture (lon=-180) maps to the -X axis of the sphere.
// Therefore: theta = (lon + 180), x = -r·sin(phi)·cos(theta)
const latLonToVector3 = (lat, lon, radius) => {
  const phi   = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z =   radius * Math.sin(phi) * Math.sin(theta);
  const y =   radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
};

// --- TIER CLASSIFICATION ---
const getTier = (p) => {
  const score = p.risk_score != null ? p.risk_score : (p.mag ?? 0);
  if (score > 7 || (p.mag ?? 0) >= 6) return 'severe';
  if (score > 4 || (p.mag ?? 0) >= 4) return 'moderate';
  return 'nominal';
};

// --- SEISMIC POINTS (particle system — one draw call, tiny crisp dots) ---
const TIER_COLORS = {
  severe:   new THREE.Color('#ff3333'),
  moderate: new THREE.Color('#ff9900'),
  nominal:  new THREE.Color('#ffe033'),
};

const SeismicPoints = ({ data, onHover }) => {
  // Build geometry imperatively — avoids R3F declarative bufferAttribute
  // update issues when async data arrives after initial render.
  const { geo, originalData } = useMemo(() => {
    const positions = [];
    const colors = [];
    const originalData = [];

    (data || []).forEach((p) => {
      const radius = 5.06 - ((p.depth ?? 0) / 700) * 0.5;
      const pos = latLonToVector3(p.lat, p.lon, radius);
      positions.push(pos.x, pos.y, pos.z);
      const c = TIER_COLORS[getTier(p)];
      colors.push(c.r, c.g, c.b);
      originalData.push(p);
    });

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
    geo.setAttribute('color',    new THREE.BufferAttribute(new Float32Array(colors), 3));
    geo.computeBoundingSphere();
    return { geo, originalData };
  }, [data]);

  const handlePointerMove = useCallback((e) => {
    if (e.index != null && originalData[e.index]) {
      onHover(originalData[e.index]);
    }
  }, [originalData, onHover]);

  const handlePointerLeave = useCallback(() => onHover(null), [onHover]);

  if (!data || data.length === 0) return null;

  return (
    <points
      geometry={geo}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <pointsMaterial
        vertexColors
        size={2.5}
        sizeAttenuation={false}
        transparent
        opacity={0.9}
      />
    </points>
  );
};

// --- EARTH TEXTURES ---
const EARTH_DAY = 'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg';
const EARTH_NIGHT = 'https://unpkg.com/three-globe/example/img/earth-night.jpg';
const EARTH_BUMP = 'https://unpkg.com/three-globe/example/img/earth-topology.png';
const EARTH_SPEC = 'https://unpkg.com/three-globe/example/img/earth-water.png';

const generateCloudTexture = () => {
  const w = 2048, h = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, w, h);
  let s = 42;
  const rand = () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
  for (let i = 0; i < 800; i++) {
    const x = rand() * w, y = rand() * h, r = rand() * 80 + 20;
    const alpha = rand() * 0.35 + 0.05;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, `rgba(255,255,255,${alpha})`);
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(x, y, r, r * (rand() * 0.5 + 0.3), rand() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  return tex;
};

// --- REALISTIC GLOBE ---
const RealisticWorld = ({ children, isRotating }) => {
  const groupRef = useRef();
  const cloudRef = useRef();

  const [dayMap, nightMap, bumpMap, specMap] = useLoader(THREE.TextureLoader, [
    EARTH_DAY, EARTH_NIGHT, EARTH_BUMP, EARTH_SPEC,
  ]);

  [dayMap, nightMap, bumpMap, specMap].forEach(t => {
    if (!t) return;
    t.anisotropy = 8;
    t.minFilter = THREE.LinearMipmapLinearFilter;
    t.magFilter = THREE.LinearFilter;
  });

  const cloudTexture = useMemo(() => generateCloudTexture(), []);

  useFrame(() => {
    if (!isRotating) return;
    if (groupRef.current) groupRef.current.rotation.y += 0.0005;
    if (cloudRef.current) cloudRef.current.rotation.y += 0.00007;
  });

  return (
    <group>
      <mesh scale={[1.18, 1.18, 1.18]}>
        <sphereGeometry args={[5, 64, 64]} />
        <meshBasicMaterial color="#4488ff" transparent opacity={0.06} side={THREE.BackSide} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>

      <group ref={groupRef}>
        <mesh>
          <sphereGeometry args={[5, 128, 128]} />
          <meshPhongMaterial
            map={dayMap}
            bumpMap={bumpMap}
            bumpScale={0.12}
            emissiveMap={nightMap}
            emissive={new THREE.Color('#ffe8a0')}
            emissiveIntensity={1.0}
            specularMap={specMap}
            specular={new THREE.Color('#335566')}
            shininess={18}
          />
        </mesh>
        {children}
      </group>

      <mesh ref={cloudRef} scale={[1.007, 1.007, 1.007]}>
        <sphereGeometry args={[5, 64, 64]} />
        <meshStandardMaterial map={cloudTexture} transparent opacity={0.22} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
};

// --- MAIN VIEW ---
const SimulationView = () => {
  const [data, setData] = useState([]);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [isRotating, setIsRotating] = useState(true);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/historical_dataset')
      .then(res => res.json())
      .then(result => {
        if (result.status === 'success') setData(result.data.slice(0, 5000));
      })
      .catch(err => console.error('Data Load Fault:', err));
  }, []);

  const cardStyle = {
    background: 'rgba(255,255,255,0.05)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.1)',
    padding: '24px',
    borderRadius: '4px',
    color: 'white',
  };

  return (
    <div style={{ background: '#000008', position: 'relative', width: '100%', height: '100vh' }}>
      <Canvas dpr={[1, 2]} shadows gl={{ antialias: true, alpha: false }}>
        <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={45} />
        <OrbitControls enablePan={false} minDistance={6} maxDistance={30} enableDamping dampingFactor={0.05} />
        <ambientLight intensity={0.35} />
        <directionalLight position={[10, 5, 10]} intensity={2.2} color="#fff5e6" castShadow />
        <directionalLight position={[-10, -5, -10]} intensity={0.15} color="#aaccff" />
        <Stars radius={200} depth={60} count={8000} factor={4} saturation={0.8} fade speed={0.8} />
        <Suspense fallback={<Html center><div style={{ color: 'white', fontFamily: 'monospace', fontSize: '0.8rem', letterSpacing: '0.2em' }}>INITIALIZING...</div></Html>}>
          <RealisticWorld isRotating={isRotating}>
            <SeismicPoints data={data} onHover={setHoveredNode} />
          </RealisticWorld>
        </Suspense>
      </Canvas>

      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', padding: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{ ...cardStyle, pointerEvents: 'auto' }}>
            <div style={{ fontSize: '0.6rem', letterSpacing: '0.2em', color: '#88ccff', fontWeight: 800, marginBottom: '8px' }}>ORBITAL_PLATFORM_V4</div>
            <h1 style={{ fontSize: '1.8rem', margin: 0 }}>Global Surveillance</h1>
            <p style={{ fontSize: '0.75rem', opacity: 0.6, marginTop: '4px' }}>Operational Seismic Intelligence Network</p>
            <div style={{ display: 'flex', gap: '30px', marginTop: '20px' }}>
              <div>
                <span style={{ display: 'block', fontSize: '1.2rem', fontWeight: 800, color: '#88ccff' }}>
                  {data.length >= 1000 ? `${Math.floor(data.length / 1000)}K` : data.length}
                </span>
                <span style={{ fontSize: '0.6rem', opacity: 0.4, letterSpacing: '0.1em' }}>NODES</span>
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '1.2rem', fontWeight: 800, color: '#88ccff' }}>700KM</span>
                <span style={{ fontSize: '0.6rem', opacity: 0.4, letterSpacing: '0.1em' }}>Z-RANGE</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '14px', marginTop: '16px' }}>
              {[['#ff1a1a', 'SEVERE'], ['#ff8800', 'MODERATE'], ['#ffe033', 'NOMINAL']].map(([c, l]) => (
                <div key={l} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />
                  <span style={{ fontSize: '0.55rem', opacity: 0.7, letterSpacing: '0.08em' }}>{l}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <AnimatePresence>
            {hoveredNode && (
              <motion.div key="dossier" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 20, opacity: 0 }}
                style={{ ...cardStyle, pointerEvents: 'auto', width: '300px' }}>
                <div style={{ fontSize: '0.6rem', letterSpacing: '0.2em', color: '#fbbf24', fontWeight: 800 }}>TARGET_ACQUIRED</div>
                <h2 style={{ margin: '6px 0', fontSize: '1rem' }}>{hoveredNode.place?.split(',').pop()?.trim() || 'Global Point'}</h2>
                <div style={{ height: 1, background: 'rgba(255,255,255,0.1)', margin: '12px 0' }} />
                <div style={{ display: 'flex', gap: '15px', fontSize: '0.8rem', marginBottom: '8px' }}>
                  <div><strong>MAG:</strong> {hoveredNode.mag}M</div>
                  <div><strong>DEP:</strong> {hoveredNode.depth}km</div>
                  <div><strong>RSK:</strong> {hoveredNode.risk_score?.toFixed(2)}</div>
                </div>
                <div style={{ fontSize: '0.65rem', opacity: 0.5 }}>{new Date(hoveredNode.time).toLocaleString()}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div style={{ position: 'absolute', bottom: '40px', left: '40px', right: '40px', display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'white', fontSize: '0.6rem', letterSpacing: '0.15em', fontWeight: 700 }}>
            <div style={{ width: 6, height: 6, background: '#22c55e', borderRadius: '50%', animation: 'nodePulse 2s infinite' }} />
            LIVE_TECTONIC_STREAM_ENABLED
          </div>
          <button onClick={() => setIsRotating(!isRotating)}
            style={{ pointerEvents: 'auto', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '10px 24px', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.1em', cursor: 'pointer' }}>
            {isRotating ? 'SUSPEND_ORBIT' : 'RESUME_ORBIT'}
          </button>
        </div>
      </div>

      <style>{`@keyframes nodePulse { 0%,100%{opacity:0.4} 50%{opacity:1} }`}</style>
    </div>
  );
};

export default SimulationView;