import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';

/* ─── Three.js Particle Dodecahedron ─── */
function LoaderDodecahedron({ phase }: { phase: string }) {
  const pointsRef = useRef<THREE.Points>(null);
  const ringRef = useRef<THREE.Points>(null);
  const geoRef = useRef<THREE.BufferGeometry>(null);
  const ringGeoRef = useRef<THREE.BufferGeometry>(null);

  const count = typeof window !== 'undefined' && window.innerWidth < 768 ? 300 : 600;

  const { startPositions, targetPositions, ringPositions } = useMemo(() => {
    const targets: THREE.Vector3[] = [];
    const dodec = new THREE.DodecahedronGeometry(2, 0);
    const posAttr = dodec.attributes.position;

    // Sample from vertices
    for (let i = 0; i < posAttr.count; i++) {
      targets.push(new THREE.Vector3(posAttr.getX(i), posAttr.getY(i), posAttr.getZ(i)));
    }
    // Sample from face centers
    const faces = dodec.index;
    if (faces) {
      for (let i = 0; i < faces.count; i += 3) {
        const a = faces.getX(i), b = faces.getY(i), c = faces.getZ(i);
        const vA = new THREE.Vector3(posAttr.getX(a), posAttr.getY(a), posAttr.getZ(a));
        const vB = new THREE.Vector3(posAttr.getX(b), posAttr.getY(b), posAttr.getZ(b));
        const vC = new THREE.Vector3(posAttr.getX(c), posAttr.getY(c), posAttr.getZ(c));
        targets.push(vA.clone().add(vB).add(vC).multiplyScalar(1 / 3));
      }
    }

    // Pick `count` targets
    const selected: THREE.Vector3[] = [];
    for (let i = 0; i < count; i++) {
      selected.push(targets[i % targets.length].clone().add(
        new THREE.Vector3((Math.random() - 0.5) * 0.3, (Math.random() - 0.5) * 0.3, (Math.random() - 0.5) * 0.3)
      ));
    }

    const starts = new Float32Array(count * 3);
    const targs = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 8;
      starts[i * 3] = (Math.random() - 0.5) * 2 * r;
      starts[i * 3 + 1] = (Math.random() - 0.5) * 2 * r;
      starts[i * 3 + 2] = (Math.random() - 0.5) * 2 * r;
      targs[i * 3] = selected[i].x;
      targs[i * 3 + 1] = selected[i].y;
      targs[i * 3 + 2] = selected[i].z;
    }

    // Ring particles
    const ringCount = 200;
    const ringPos = new Float32Array(ringCount * 3);
    for (let i = 0; i < ringCount; i++) {
      const angle = (i / ringCount) * Math.PI * 2;
      ringPos[i * 3] = Math.cos(angle) * 3.5;
      ringPos[i * 3 + 1] = (Math.random() - 0.5) * 0.2;
      ringPos[i * 3 + 2] = Math.sin(angle) * 3.5;
    }

    return { startPositions: starts, targetPositions: targs, ringPositions: ringPos };
  }, [count]);

  const currentPositions = useRef(new Float32Array(startPositions));
  const assembled = useRef(false);

  useEffect(() => {
    if (phase === 'boot' && !assembled.current) {
      assembled.current = true;
      const cur = currentPositions.current;
      for (let i = 0; i < count; i++) {
        const delay = Math.random() * 0.4;
        gsap.to(cur, {
          [i * 3]: targetPositions[i * 3],
          [i * 3 + 1]: targetPositions[i * 3 + 1],
          [i * 3 + 2]: targetPositions[i * 3 + 2],
          duration: 1.8,
          delay,
          ease: 'power3.out',
        });
      }
    }
    if (phase === 'reveal') {
      const cur = currentPositions.current;
      for (let i = 0; i < count; i++) {
        gsap.to(cur, {
          [i * 3]: cur[i * 3] * 4,
          [i * 3 + 1]: cur[i * 3 + 1] * 4,
          [i * 3 + 2]: cur[i * 3 + 2] * 4,
          duration: 0.5,
          ease: 'power2.in',
        });
      }
    }
  }, [phase, count, targetPositions]);

  useFrame((state) => {
    if (!pointsRef.current || !geoRef.current) return;
    void state.clock.getElapsedTime();
    pointsRef.current.rotation.y += 0.005;
    pointsRef.current.rotation.x += 0.002;

    const pos = geoRef.current.attributes.position.array as Float32Array;
    const cur = currentPositions.current;
    for (let i = 0; i < count * 3; i++) {
      pos[i] = cur[i];
    }
    geoRef.current.attributes.position.needsUpdate = true;

    // Ring rotation
    if (ringRef.current) {
      ringRef.current.rotation.y -= 0.003;
    }
  });

  return (
    <group>
      <points ref={pointsRef}>
        <bufferGeometry ref={geoRef}>
          <bufferAttribute
            attach="attributes-position"
            args={[startPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#00d4ff"
          size={0.04}
          transparent
          opacity={phase === 'reveal' || phase === 'exit' ? 0 : 0.6}
          blending={THREE.AdditiveBlending}
        />
      </points>
      <points ref={ringRef}>
        <bufferGeometry ref={ringGeoRef}>
          <bufferAttribute
            attach="attributes-position"
            args={[ringPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#7b61ff"
          size={0.02}
          transparent
          opacity={phase === 'reveal' || phase === 'exit' ? 0 : 0.3}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

/* ─── Boot Log Lines ─── */
const bootLines = [
  'SYSTEM :: INITIALIZING...',
  'CORE :: NODE_RUNTIME v20.14.0 ......... ✓',
  'CORE :: MONGODB_DRIVER v6.9.0 ......... ✓',
  'CORE :: AZURE_SDK v12.18.0 ............ ✓',
  'CORE :: DOCKER_ENGINE v27.1.0 ......... ✓',
  'CORE :: N8N_RUNTIME v1.57.0 ........... ✓',
  'LOADING :: NEURAL_ORCHESTRATION ........ ✓',
  'LOADING :: MERN_STACK .................. ✓',
  'LOADING :: DEVOPS_PIPELINE ............. ✓',
  'LOADING :: AI_AGENTS ................... ✓',
  'STATUS :: ALL SYSTEMS NOMINAL',
  'BOOTING :: VISHNU_ROHITH_INTERFACE...',
];

/* ─── Main Loader Component ─── */
interface LoaderProps {
  onComplete: () => void;
}

export default function Loader({ onComplete }: LoaderProps) {
  const [phase, setPhase] = useState<'birth' | 'boot' | 'reveal' | 'exit'>('birth');
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const [visibleLines, setVisibleLines] = useState(0);
  const progressObj = useRef({ val: 0 });

  const startSequence = useCallback(() => {
    const tl = gsap.timeline();
    tl.to({}, { duration: 1.2, onComplete: () => setPhase('boot') })
      .to({}, { duration: 2.0, onComplete: () => setPhase('reveal') })
      .to({}, { duration: 0.8, onComplete: () => setPhase('exit') })
      .to({}, {
        duration: 0.7,
        onComplete: () => {
          setVisible(false);
          onComplete();
        },
      });

    gsap.to(progressObj.current, {
      val: 100,
      duration: 3.5,
      ease: 'none',
      onUpdate: () => setProgress(Math.round(progressObj.current.val)),
    });
  }, [onComplete]);

  useEffect(() => {
    startSequence();
  }, [startSequence]);

  // Boot line typing
  useEffect(() => {
    if (phase === 'boot') {
      const interval = setInterval(() => {
        setVisibleLines((prev) => {
          if (prev >= bootLines.length) {
            clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, 180);
      return () => clearInterval(interval);
    }
  }, [phase]);

  if (!visible) return null;

  const topPanel = {
    exit: { y: '-110vh', transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] as const } },
  };
  const bottomPanel = {
    exit: { y: '110vh', transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] as const } },
  };

  const nameLetters = 'VISHNU ROHITH B'.split('');

  return (
    <AnimatePresence>
      {visible && (
        <div
          role="status"
          aria-label="Loading portfolio"
          style={{ position: 'fixed', inset: 0, zIndex: 1000 }}
        >
          {/* CRT scan lines */}
          <div
            style={{
              position: 'fixed', inset: 0, zIndex: 2,
              background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,212,255,0.015) 2px, rgba(0,212,255,0.015) 4px)',
              pointerEvents: 'none',
            }}
          />

          {/* Three.js canvas */}
          <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
            <Canvas
              camera={{ position: [0, 0, 8], fov: 50 }}
              gl={{ alpha: true, antialias: true }}
              style={{ background: '#020408' }}
              frameloop="always"
            >
              <ambientLight intensity={0.05} />
              <pointLight color="#00d4ff" intensity={4} position={[3, 3, 3]} />
              <pointLight color="#7b61ff" intensity={2} position={[-3, -2, -3]} />
              <LoaderDodecahedron phase={phase} />
            </Canvas>
          </div>

          {/* Top Panel (clip: top half) */}
          <motion.div
            style={{
              position: 'fixed', inset: 0, zIndex: 10,
              clipPath: 'inset(0 0 50% 0)',
              background: '#020408',
            }}
            variants={topPanel}
            animate={phase === 'exit' ? 'exit' : undefined}
          >
            {/* Boot log */}
            {phase === 'boot' && (
              <div
                className="font-mono absolute top-[15%] left-1/2 -translate-x-1/2 text-center"
                aria-live="polite"
              >
                {bootLines.slice(0, visibleLines).map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-[9px] md:text-[11px] tracking-[0.08em] mb-1"
                    style={{
                      color: i >= bootLines.length - 2 ? '#00d4ff' : 'rgba(0,212,255,0.5)',
                    }}
                  >
                    {line}
                  </motion.div>
                ))}
              </div>
            )}

            {/* Corner brackets */}
            {phase === 'boot' && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120px] h-[120px] md:w-[160px] md:h-[160px]"
              >
                <div className="absolute top-0 left-0 w-8 md:w-10 h-8 md:h-10 border-t border-l border-cyan/40 animate-[pulse-glow_2s_ease-in-out_infinite]" />
                <div className="absolute top-0 right-0 w-8 md:w-10 h-8 md:h-10 border-t border-r border-cyan/40 animate-[pulse-glow_2s_ease-in-out_infinite]" />
                <div className="absolute bottom-0 left-0 w-8 md:w-10 h-8 md:h-10 border-b border-l border-cyan/40 animate-[pulse-glow_2s_ease-in-out_infinite]" />
                <div className="absolute bottom-0 right-0 w-8 md:w-10 h-8 md:h-10 border-b border-r border-cyan/40 animate-[pulse-glow_2s_ease-in-out_infinite]" />
              </motion.div>
            )}
          </motion.div>

          {/* Bottom Panel (clip: bottom half) */}
          <motion.div
            style={{
              position: 'fixed', inset: 0, zIndex: 10,
              clipPath: 'inset(50% 0 0 0)',
              background: '#020408',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            variants={bottomPanel}
            animate={phase === 'exit' ? 'exit' : undefined}
          >
            {/* Identity label */}
            {phase === 'boot' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0.4, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="font-mono text-[10px] tracking-[0.2em] text-cyan/50 absolute top-[20%]"
              >
                [ IDENTITY MODULE — LOADING ]
              </motion.div>
            )}

            {/* Name reveal */}
            {phase === 'reveal' && (
              <div className="text-center absolute top-[15%]">
                <div className="flex justify-center flex-wrap">
                  {nameLetters.map((letter, i) => (
                    <motion.span
                      key={i}
                      initial={{ y: 30, opacity: 0, filter: 'blur(8px)' }}
                      animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                      transition={{ delay: i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className="text-gradient-full inline-block font-bold"
                      style={{
                        fontSize: 'clamp(2.5rem, 6vw, 5rem)',
                        fontFamily: "'Space Grotesk', sans-serif",
                        letterSpacing: letter === ' ' ? '0.3em' : '0.02em',
                      }}
                    >
                      {letter === ' ' ? '\u00A0' : letter}
                    </motion.span>
                  ))}
                </div>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="font-mono text-[10px] md:text-[11px] tracking-[0.2em] uppercase mt-4"
                  style={{ color: 'rgba(139,168,196,0.7)' }}
                >
                  FULL STACK DEVELOPER · MERN · AZURE · DEVOPS · AI AUTOMATION
                </motion.p>

                {/* Progress bar */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.0 }}
                  className="mt-6 flex flex-col items-center gap-2"
                >
                  <div
                    className="w-[200px] md:w-[300px] h-[2px] rounded-full overflow-hidden"
                    style={{ background: 'rgba(0,212,255,0.1)' }}
                  >
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        background: 'linear-gradient(90deg, #00d4ff, #7b61ff)',
                        boxShadow: '0 0 12px rgba(0,212,255,0.8), 4px 0 12px #00d4ff',
                      }}
                      initial={{ width: '0%' }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.1 }}
                    />
                  </div>
                  <span
                    className="font-mono text-[13px] tracking-[0.15em]"
                    style={{ color: '#00d4ff' }}
                  >
                    [ {String(progress).padStart(3, '0')}% ]
                  </span>
                </motion.div>
              </div>
            )}
          </motion.div>

          {/* White flash line on exit */}
          {phase === 'exit' && (
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: [0, 1, 0], scaleX: [0, 1, 1] }}
              transition={{ duration: 0.3 }}
              style={{
                position: 'fixed', top: '50%', left: 0, right: 0,
                height: '2px', background: 'white', zIndex: 101,
              }}
            />
          )}
        </div>
      )}
    </AnimatePresence>
  );
}
