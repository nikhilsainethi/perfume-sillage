// ============================================================
// SILLAGE — NoteConstellation (the signature 3D piece)
// The fragrance wheel reborn: notes float as glowing orbs in
// nine family lobes around a champagne core. Orbit it, hover a
// note to hear its name, click to draw it into your
// composition — selected notes tether to the core with threads
// of their own color. Lazy-loaded; 2D wheel remains the
// fallback for every gated device.
// ============================================================

import { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Billboard, Html, Line, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import type { AccordFamily, FragranceNote } from '@/domain/types';
import { FAMILY_COLOR, FAMILY_LABEL } from '@/data/notes';
import { layoutConstellation, familyCenters } from './constellationLayout';

const IVORY = '#faf8f4';
const CHAMPAGNE = '#b0843c';

/** Soften a hex toward white so orbs read as frosted glass, not billiard balls. */
function frost(hex: string, amt = 0.22): string {
  const h = hex.replace('#', '');
  const mix = (i: number) => {
    const c = parseInt(h.slice(i, i + 2), 16);
    return Math.round(c + (255 - c) * amt).toString(16).padStart(2, '0');
  };
  return `#${mix(0)}${mix(2)}${mix(4)}`;
}

// ---------- ambient scent dust ----------
function ScentDust() {
  const positions = useMemo(() => {
    const arr = new Float32Array(240 * 3);
    for (let i = 0; i < 240; i++) {
      const r = 4 + Math.random() * 7;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = (r * Math.cos(phi)) * 0.6;
      arr[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    return arr;
  }, []);
  const ref = useRef<THREE.Points>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.012;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.055}
        sizeAttenuation
        color={CHAMPAGNE}
        transparent
        opacity={0.35}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ---------- the champagne core ----------
function Core({ selectedCount }: { selectedCount: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime;
    const breath = 1 + Math.sin(t * 1.1) * 0.045;
    const grown = 0.62 + Math.min(selectedCount, 10) * 0.028; // the core swells as you compose
    ref.current.scale.setScalar(grown * breath);
  });
  return (
    <group>
      <mesh ref={ref}>
        <sphereGeometry args={[1, 48, 48]} />
        <meshStandardMaterial
          color="#e8cf9e"
          emissive={CHAMPAGNE}
          emissiveIntensity={0.55}
          roughness={0.25}
          metalness={0.35}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2.6, 0, 0.4]}>
        <torusGeometry args={[1.35, 0.012, 8, 96]} />
        <meshBasicMaterial color={CHAMPAGNE} transparent opacity={0.35} />
      </mesh>
      <pointLight color="#e7cfa0" intensity={6} distance={9} decay={2} />
    </group>
  );
}

// ---------- one note orb ----------
interface OrbProps {
  note: FragranceNote;
  position: [number, number, number];
  selected: boolean;
  dimmed: boolean;
  onToggle: (id: string) => void;
  onHoverFamily: (f: AccordFamily | null) => void;
}

function NoteOrb({ note, position, selected, dimmed, onToggle, onHoverFamily }: OrbProps) {
  const group = useRef<THREE.Group>(null);
  const mesh = useRef<THREE.Mesh>(null);
  const mat = useRef<THREE.MeshStandardMaterial>(null);
  const [hovered, setHovered] = useState(false);
  const phase = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame(({ clock }, dt) => {
    const t = clock.elapsedTime;
    if (group.current) {
      // gentle per-orb float
      group.current.position.set(
        position[0],
        position[1] + Math.sin(t * 0.7 + phase) * 0.12,
        position[2],
      );
    }
    if (mesh.current && mat.current) {
      const targetScale = hovered ? 1.5 : selected ? 1.22 : 1;
      mesh.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        Math.min(1, dt * 9),
      );
      const targetEmissive = hovered ? 0.85 : selected ? 0.6 : dimmed ? 0.04 : 0.18;
      mat.current.emissiveIntensity +=
        (targetEmissive - mat.current.emissiveIntensity) * Math.min(1, dt * 9);
      const targetOpacity = dimmed && !selected && !hovered ? 0.32 : 1;
      mat.current.opacity += (targetOpacity - mat.current.opacity) * Math.min(1, dt * 9);
    }
  });

  return (
    <group ref={group} position={position}>
      <mesh
        ref={mesh}
        onClick={(e) => {
          e.stopPropagation();
          onToggle(note.id);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          onHoverFamily(note.family);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          onHoverFamily(null);
          document.body.style.cursor = '';
        }}
      >
        <sphereGeometry args={[0.34, 32, 32]} />
        <meshStandardMaterial
          ref={mat}
          color={frost(note.color)}
          emissive={note.color}
          emissiveIntensity={0.18}
          roughness={0.5}
          metalness={0.08}
          transparent
          opacity={1}
        />
      </mesh>

      {selected && (
        <Billboard>
          <mesh>
            <ringGeometry args={[0.5, 0.55, 48]} />
            <meshBasicMaterial color={CHAMPAGNE} transparent opacity={0.85} side={THREE.DoubleSide} />
          </mesh>
        </Billboard>
      )}

      {(hovered || selected) && (
        <Html center distanceFactor={11} position={[0, 0.78, 0]} style={{ pointerEvents: 'none' }}>
          <div
            style={{
              whiteSpace: 'nowrap',
              textAlign: 'center',
              padding: '4px 10px',
              borderRadius: 999,
              background: 'rgba(255,255,255,0.88)',
              border: `1px solid ${hovered ? note.color : 'rgba(34,28,21,0.12)'}`,
              boxShadow: '0 4px 14px rgba(60,45,30,0.12)',
              fontFamily: 'Inter, sans-serif',
              fontSize: hovered ? 13 : 11,
              color: '#221c15',
            }}
          >
            {note.name}
            {hovered && (
              <span
                style={{
                  marginLeft: 6,
                  fontSize: 9,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: note.color,
                }}
              >
                {FAMILY_LABEL[note.family]}
              </span>
            )}
          </div>
        </Html>
      )}
    </group>
  );
}

// ---------- the scene ----------
function Scene({
  notes,
  selectedIds,
  onToggle,
}: {
  notes: FragranceNote[];
  selectedIds: string[];
  onToggle: (id: string) => void;
}) {
  const placements = useMemo(() => layoutConstellation(notes), [notes]);
  const centers = useMemo(() => familyCenters(notes), [notes]);
  const [hoveredFamily, setHoveredFamily] = useState<AccordFamily | null>(null);
  const selected = useMemo(() => new Set(selectedIds), [selectedIds]);

  return (
    <>
      <fog attach="fog" args={[IVORY, 13, 26]} />
      <ambientLight intensity={0.85} color="#fff6e8" />
      <directionalLight position={[6, 8, 5]} intensity={1.1} color="#ffe9c4" />
      <directionalLight position={[-7, -3, -5]} intensity={0.35} color="#c4d4e0" />

      <ScentDust />
      <Core selectedCount={selectedIds.length} />

      {/* composition threads: selected notes tether to the core */}
      {placements
        .filter((p) => selected.has(p.note.id))
        .map((p) => (
          <Line
            key={`thread-${p.note.id}`}
            points={[p.position, [0, 0, 0]]}
            color={p.note.color}
            transparent
            opacity={0.45}
            lineWidth={1.2}
          />
        ))}

      {/* family captions */}
      {[...centers.entries()].map(([family, pos]) => (
        <Html
          key={family}
          center
          distanceFactor={13}
          position={[pos[0] * 1.32, pos[1] * 1.32 + 0.9, pos[2] * 1.32]}
          style={{ pointerEvents: 'none' }}
        >
          <span
            style={{
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: 10,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: FAMILY_COLOR[family],
              opacity: hoveredFamily === null ? 0.55 : hoveredFamily === family ? 1 : 0.15,
              transition: 'opacity 0.3s',
              whiteSpace: 'nowrap',
            }}
          >
            {FAMILY_LABEL[family]}
          </span>
        </Html>
      ))}

      {placements.map((p) => (
        <NoteOrb
          key={p.note.id}
          note={p.note}
          position={p.position}
          selected={selected.has(p.note.id)}
          dimmed={hoveredFamily !== null && hoveredFamily !== p.note.family}
          onToggle={onToggle}
          onHoverFamily={setHoveredFamily}
        />
      ))}

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableDamping
        dampingFactor={0.06}
        autoRotate={hoveredFamily === null}
        autoRotateSpeed={0.55}
        minPolarAngle={Math.PI * 0.22}
        maxPolarAngle={Math.PI * 0.78}
      />
    </>
  );
}

export default function NoteConstellation({
  notes,
  selectedIds,
  onToggle,
  height = 560,
}: {
  notes: FragranceNote[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  height?: number;
}) {
  return (
    <div
      style={{ height }}
      className="relative w-full overflow-hidden rounded-panel border border-[var(--line)]"
      aria-label="Note constellation — drag to orbit, click a note to add it"
    >
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 1.2, 15.2], fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
      >
        <Scene notes={notes} selectedIds={selectedIds} onToggle={onToggle} />
      </Canvas>
      <span className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
        drag to orbit · click a note to compose
      </span>
    </div>
  );
}
