import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function IcosahedronObject() {
  const groupRef = useRef<THREE.Group>(null);
  const wireRef = useRef<THREE.LineSegments>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const ringGeoRef = useRef<THREE.BufferGeometry>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const targetRot = useRef({ x: 0, y: 0 });

  const orbitData = useMemo(() => {
    const angles: number[] = [];
    const speeds: number[] = [];
    const radii: number[] = [];
    const yOffsets: number[] = [];
    for (let i = 0; i < 200; i++) {
      angles.push(Math.random() * Math.PI * 2);
      speeds.push(0.3 + Math.random() * 0.7);
      radii.push(2.8 + Math.random() * 1.2);
      yOffsets.push((Math.random() - 0.5) * 1.5);
    }
    const positions = new Float32Array(200 * 3);
    return { angles, speeds, radii, yOffsets, positions };
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Mouse parallax tilt
    targetRot.current.x = mouse.current.y * 0.25;
    targetRot.current.y = mouse.current.x * 0.25;
    if (groupRef.current) {
      groupRef.current.rotation.x += (targetRot.current.x - groupRef.current.rotation.x) * 0.05;
      groupRef.current.rotation.y += (targetRot.current.y - groupRef.current.rotation.y) * 0.05;
    }

    // Floating animation
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(t * 0.5) * 0.15;
      meshRef.current.rotation.y += 0.003;
    }
    if (wireRef.current) {
      wireRef.current.position.y = Math.sin(t * 0.5) * 0.15;
      wireRef.current.rotation.y += 0.003;
    }

    // Orbit particles
    if (particlesRef.current) {
      const { angles, speeds, radii, yOffsets, positions } = orbitData;
      for (let i = 0; i < 200; i++) {
        angles[i] += speeds[i] * 0.01;
        const r = radii[i];
        const yOff = yOffsets[i];
        const idx = i * 3;
        positions[idx] = Math.cos(angles[i]) * r;
        positions[idx + 1] = yOff + Math.sin(t * 0.5 + i) * 0.1;
        positions[idx + 2] = Math.sin(angles[i]) * r;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
      particlesRef.current.rotation.y += 0.001;
    }
  });

  const wireGeo = useMemo(() => new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(1.8, 1)), []);

  return (
    <group ref={groupRef}>
      {/* Inner solid mesh */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.7, 1]} />
        <meshPhysicalMaterial
          color="#0a1e40"
          transmission={0.6}
          roughness={0.1}
          metalness={0.3}
          transparent
          opacity={0.7}
          emissive="#001a33"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Outer wireframe */}
      <lineSegments ref={wireRef} geometry={wireGeo}>
        <lineBasicMaterial color="#00d4ff" transparent opacity={0.35} />
      </lineSegments>

      {/* Orbit particles */}
      <points ref={particlesRef}>
        <bufferGeometry ref={ringGeoRef}>
          <bufferAttribute
            attach="attributes-position"
            args={[orbitData.positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#00d4ff"
          size={0.04}
          transparent
          opacity={0.5}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

export default function HeroObjectCanvas() {
  return (
    <div className="w-full h-[400px] md:h-[500px] lg:h-[600px]">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
        frameloop="always"
      >
        <ambientLight intensity={0.1} />
        <pointLight color="#00d4ff" intensity={3} position={[5, 5, 5]} />
        <pointLight color="#7b61ff" intensity={2} position={[-5, -3, -5]} />
        <IcosahedronObject />
      </Canvas>
    </div>
  );
}
