import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, Float } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const BLUE = "#1E90FF";
const DEEP = "#0b3f86";
const GLOW = "#7cc4ff";

function CoreObject() {
  const group = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Mesh>(null);

  useFrame((state, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    const { pointer } = state;
    if (group.current) {
      group.current.rotation.y += delta * 0.25;
      group.current.rotation.x = THREE.MathUtils.damp(
        group.current.rotation.x,
        -pointer.y * 0.35,
        3,
        delta,
      );
      group.current.rotation.z = THREE.MathUtils.damp(
        group.current.rotation.z,
        pointer.x * 0.2,
        3,
        delta,
      );
    }
    if (inner.current) {
      inner.current.rotation.y -= delta * 0.6;
      inner.current.rotation.x += delta * 0.3;
    }
  });

  return (
    <group ref={group}>
      <mesh>
        <icosahedronGeometry args={[1.55, 1]} />
        <meshStandardMaterial
          color={BLUE}
          roughness={0.15}
          metalness={0.9}
          transparent
          opacity={0.32}
        />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[1.56, 1]} />
        <meshBasicMaterial color={GLOW} wireframe transparent opacity={0.55} />
      </mesh>
      <mesh ref={inner}>
        <octahedronGeometry args={[0.78, 0]} />
        <meshStandardMaterial
          color={DEEP}
          emissive={BLUE}
          emissiveIntensity={0.7}
          roughness={0.2}
          metalness={1}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2.4, 0, 0]}>
        <torusGeometry args={[2.25, 0.012, 8, 128]} />
        <meshBasicMaterial color={BLUE} transparent opacity={0.7} />
      </mesh>
      <mesh rotation={[Math.PI / 1.7, 0.6, 0.4]}>
        <torusGeometry args={[2.6, 0.01, 8, 128]} />
        <meshBasicMaterial color={GLOW} transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

function Satellites() {
  const items = useMemo(
    () =>
      [
        { p: [2.6, 1.1, -0.6], s: 0.28, type: "box" },
        { p: [-2.7, -0.8, 0.4], s: 0.22, type: "sphere" },
        { p: [2.1, -1.5, 0.9], s: 0.18, type: "sphere" },
        { p: [-2.2, 1.6, -0.9], s: 0.24, type: "box" },
        { p: [0.4, 2.3, -1.4], s: 0.16, type: "box" },
      ] as const,
    [],
  );

  return (
    <>
      {items.map((it, i) => (
        <Float key={i} speed={1.2 + i * 0.2} rotationIntensity={0.8} floatIntensity={1.2}>
          <mesh position={it.p as unknown as [number, number, number]}>
            {it.type === "box" ? (
              <boxGeometry args={[it.s, it.s, it.s]} />
            ) : (
              <sphereGeometry args={[it.s, 24, 24]} />
            )}
            <meshStandardMaterial
              color={i % 2 ? GLOW : BLUE}
              emissive={BLUE}
              emissiveIntensity={0.35}
              roughness={0.2}
              metalness={0.85}
            />
          </mesh>
        </Float>
      ))}
    </>
  );
}

function Particles({ count = 420 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 3 + Math.random() * 5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = (Math.random() - 0.5) * 7;
      arr[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta) * 0.5;
    }
    return arr;
  }, [count]);

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    if (ref.current) ref.current.rotation.y += delta * 0.04;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.035} color={BLUE} transparent opacity={0.7} sizeAttenuation />
    </points>
  );
}

function CameraDrift() {
  const { camera } = useThree();
  useFrame((state, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    camera.position.x = THREE.MathUtils.damp(camera.position.x, state.pointer.x * 0.9, 2, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, 0.3 + state.pointer.y * 0.5, 2, delta);
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function HeroScene() {
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const small = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <Canvas
      dpr={[1, small ? 1.5 : 2]}
      camera={{ position: [0, 0.3, 6.4], fov: 45 }}
      gl={{ antialias: !small, alpha: true }}
      frameloop={reduced ? "demand" : "always"}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 6, 5]} intensity={1.6} color={GLOW} />
      <pointLight position={[-5, -2, 2]} intensity={40} color={BLUE} distance={14} />
      <Environment>
        <Lightformer intensity={2} position={[0, 4, 2]} scale={[8, 8, 1]} color="#ffffff" />
        <Lightformer
          intensity={1.4}
          color={BLUE}
          position={[-5, 1, -1]}
          rotation-y={Math.PI / 2}
          scale={[16, 3, 1]}
        />
      </Environment>
      <CoreObject />
      <Satellites />
      <Particles count={small ? 200 : 420} />
      {!reduced && <CameraDrift />}
    </Canvas>
  );
}
