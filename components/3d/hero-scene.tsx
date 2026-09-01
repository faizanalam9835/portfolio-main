"use client";

import { useFrame } from "@react-three/fiber";
import * as React from "react";
import * as THREE from "three";

import type { NormalizedPointer } from "@/hooks/use-pointer";

/**
 * The system that orbits the hero photo: a small graph of glowing nodes,
 * connected edges, travelling packets and two thin orbit rings.
 *
 * The centre is deliberately quiet — the profile photo sits on top of it in
 * the DOM, so the interesting geometry lives out at the edges where it stays
 * visible. Everything is deterministic, low-poly and slow-moving, and uses
 * only core three.js primitives (no drei) to keep the dependency surface small.
 */

const ACCENTS = {
  blue: "#3b6cf6",
  violet: "#7c5cf6",
  cyan: "#22b8d9",
} as const;

type AccentKey = keyof typeof ACCENTS;

interface NodeSpec {
  position: readonly [number, number, number];
  radius: number;
  accent: AccentKey;
  /** Nodes with a pulse get a slowly breathing halo ring. */
  pulse?: boolean;
}

/**
 * Layout is hand-placed rather than random: a dense core (the application),
 * an inner ring (services) and outer satellites (data + AI dependencies).
 */
const NODES: readonly NodeSpec[] = [
  { position: [0, 0.1, 0], radius: 0.3, accent: "violet", pulse: true },

  { position: [-1.55, 0.95, 0.35], radius: 0.17, accent: "blue" },
  { position: [1.5, 1.15, -0.2], radius: 0.15, accent: "cyan" },
  { position: [1.85, -0.35, 0.5], radius: 0.18, accent: "blue" },
  { position: [-1.75, -0.55, -0.35], radius: 0.16, accent: "cyan" },
  { position: [0.2, 1.85, 0.15], radius: 0.14, accent: "violet" },
  { position: [-0.35, -1.7, 0.3], radius: 0.16, accent: "violet" },

  { position: [-2.85, 1.85, -0.9], radius: 0.11, accent: "blue" },
  { position: [3.05, 1.7, -0.75], radius: 0.1, accent: "cyan" },
  { position: [2.95, -1.65, -0.5], radius: 0.12, accent: "violet" },
  { position: [-3.1, -1.5, -0.7], radius: 0.1, accent: "blue" },
  { position: [0.9, -2.5, -0.6], radius: 0.09, accent: "cyan" },
  { position: [-1.2, 2.55, -0.55], radius: 0.09, accent: "blue" },
] as const;

/** Index pairs — core to inner ring, ring to ring, ring to satellites. */
const EDGES: readonly (readonly [number, number])[] = [
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 4],
  [0, 5],
  [0, 6],
  [1, 5],
  [2, 5],
  [3, 2],
  [4, 6],
  [1, 4],
  [3, 6],
  [1, 7],
  [2, 8],
  [3, 9],
  [4, 10],
  [6, 11],
  [5, 12],
  [7, 12],
  [8, 9],
  [10, 11],
] as const;

function Nodes() {
  return (
    <group>
      {NODES.map((node, index) => (
        <Node key={index} spec={node} index={index} />
      ))}
    </group>
  );
}

function Node({ spec, index }: { spec: NodeSpec; index: number }) {
  const haloRef = React.useRef<THREE.Mesh>(null);
  const color = ACCENTS[spec.accent];

  // Stagger the breathing so the graph never pulses in unison.
  const phase = index * 0.7;

  useFrame(({ clock }) => {
    const halo = haloRef.current;
    if (!halo) return;
    const t = clock.elapsedTime + phase;
    const scale = 1 + Math.sin(t * 0.9) * 0.16;
    halo.scale.setScalar(scale);
    const material = halo.material as THREE.MeshBasicMaterial;
    material.opacity = 0.14 + Math.sin(t * 0.9) * 0.06;
  });

  return (
    <group position={[spec.position[0], spec.position[1], spec.position[2]]}>
      <mesh>
        <sphereGeometry args={[spec.radius, 24, 24]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.55}
          roughness={0.28}
          metalness={0.1}
        />
      </mesh>

      {/* Soft halo — reads as glow without additive blending washing out on white. */}
      <mesh ref={haloRef} scale={1}>
        <sphereGeometry args={[spec.radius * 2.1, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.14} depthWrite={false} />
      </mesh>

      {spec.pulse ? (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[spec.radius * 3.4, 0.008, 8, 64]} />
          <meshBasicMaterial color={color} transparent opacity={0.35} />
        </mesh>
      ) : null}
    </group>
  );
}

function Connections() {
  const geometry = React.useMemo(() => {
    const positions = new Float32Array(EDGES.length * 6);
    const colors = new Float32Array(EDGES.length * 6);
    const from = new THREE.Color();
    const to = new THREE.Color();

    EDGES.forEach(([a, b], edgeIndex) => {
      const nodeA = NODES[a];
      const nodeB = NODES[b];
      if (!nodeA || !nodeB) return;

      const offset = edgeIndex * 6;
      positions.set(nodeA.position, offset);
      positions.set(nodeB.position, offset + 3);

      from.set(ACCENTS[nodeA.accent]);
      to.set(ACCENTS[nodeB.accent]);
      colors.set([from.r, from.g, from.b], offset);
      colors.set([to.r, to.g, to.b], offset + 3);
    });

    const result = new THREE.BufferGeometry();
    result.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    result.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return result;
  }, []);

  React.useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial vertexColors transparent opacity={0.32} />
    </lineSegments>
  );
}

/**
 * Packets travelling along the graph edges — the visual cue that this is a
 * system moving data, not just a decorative constellation.
 */
function Packets({ count }: { count: number }) {
  const meshRef = React.useRef<THREE.InstancedMesh>(null);
  const dummy = React.useMemo(() => new THREE.Object3D(), []);

  const routes = React.useMemo(
    () =>
      Array.from({ length: count }, (_, index) => {
        const edge = EDGES[index % EDGES.length];
        return {
          edge,
          speed: 0.16 + ((index * 37) % 11) / 40,
          offset: ((index * 53) % 97) / 97,
        };
      }),
    [count],
  );

  useFrame(({ clock }) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const t = clock.elapsedTime;

    routes.forEach((route, index) => {
      const [a, b] = route.edge ?? [0, 1];
      const nodeA = NODES[a];
      const nodeB = NODES[b];
      if (!nodeA || !nodeB) return;

      const progress = (t * route.speed + route.offset) % 1;
      dummy.position.set(
        THREE.MathUtils.lerp(nodeA.position[0], nodeB.position[0], progress),
        THREE.MathUtils.lerp(nodeA.position[1], nodeB.position[1], progress),
        THREE.MathUtils.lerp(nodeA.position[2], nodeB.position[2], progress),
      );
      // Fade in and out at the endpoints so packets don't pop.
      const fade = Math.sin(progress * Math.PI);
      dummy.scale.setScalar(0.35 + fade * 0.75);
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
    });

    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.045, 10, 10]} />
      <meshBasicMaterial color={ACCENTS.violet} transparent opacity={0.85} />
    </instancedMesh>
  );
}

/** Ambient dust — depth cue only, deliberately faint. */
function ParticleField({ count }: { count: number }) {
  const pointsRef = React.useRef<THREE.Points>(null);

  const geometry = React.useMemo(() => {
    const positions = new Float32Array(count * 3);

    // Deterministic scatter: golden-angle spiral pushed out to a shell.
    for (let i = 0; i < count; i += 1) {
      const t = i / count;
      const angle = i * 2.399963;
      const radius = 3.2 + t * 3.6;
      positions[i * 3] = Math.cos(angle) * radius * (0.7 + 0.3 * Math.sin(i));
      positions[i * 3 + 1] = Math.sin(angle) * radius * 0.55;
      positions[i * 3 + 2] = -1.5 - Math.sin(angle * 1.7) * 2.4;
    }

    const result = new THREE.BufferGeometry();
    result.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return result;
  }, [count]);

  React.useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame(({ clock }) => {
    const points = pointsRef.current;
    if (!points) return;
    points.rotation.z = clock.elapsedTime * 0.02;
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.035}
        color={ACCENTS.blue}
        transparent
        opacity={0.35}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

/** Thin wireframe shells that imply an enclosing system boundary. */
function SystemShells() {
  const outerRef = React.useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const group = outerRef.current;
    if (!group) return;
    group.rotation.y = clock.elapsedTime * 0.045;
    group.rotation.x = Math.sin(clock.elapsedTime * 0.12) * 0.12;
  });

  return (
    <group ref={outerRef}>
      <mesh>
        <icosahedronGeometry args={[3.85, 1]} />
        <meshBasicMaterial
          color={ACCENTS.blue}
          wireframe
          transparent
          opacity={0.07}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2.6, 0, 0.3]}>
        <torusGeometry args={[3.1, 0.004, 6, 96]} />
        <meshBasicMaterial color={ACCENTS.violet} transparent opacity={0.28} />
      </mesh>
      <mesh rotation={[Math.PI / 1.7, 0.5, 0]}>
        <torusGeometry args={[2.55, 0.004, 6, 96]} />
        <meshBasicMaterial color={ACCENTS.cyan} transparent opacity={0.22} />
      </mesh>
    </group>
  );
}

/**
 * Damped pointer parallax on the whole system. Reads the pointer from a ref
 * so the window listener never re-renders React.
 */
function ParallaxRig({
  pointer,
  children,
}: {
  pointer: React.RefObject<NormalizedPointer>;
  children: React.ReactNode;
}) {
  const groupRef = React.useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const { x, y } = pointer.current ?? { x: 0, y: 0 };

    // Deliberately shallow: this is a professional portfolio, not a toy.
    const targetY = x * 0.26;
    const targetX = -y * 0.18;

    group.rotation.y = THREE.MathUtils.damp(group.rotation.y, targetY, 3, delta);
    group.rotation.x = THREE.MathUtils.damp(group.rotation.x, targetX, 3, delta);
    group.position.x = THREE.MathUtils.damp(group.position.x, x * 0.22, 3, delta);
    group.position.y = THREE.MathUtils.damp(group.position.y, y * 0.16, 3, delta);
  });

  return <group ref={groupRef}>{children}</group>;
}

export interface HeroSceneProps {
  pointer: React.RefObject<NormalizedPointer>;
  /** Mobile/tablet get a lighter version of the same scene. */
  quality?: "low" | "high";
}

export function HeroScene({ pointer, quality = "high" }: HeroSceneProps) {
  const isHigh = quality === "high";

  return (
    <>
      <ambientLight intensity={1.15} />
      <directionalLight position={[4, 6, 8]} intensity={0.9} />
      <pointLight position={[-5, -2, 4]} intensity={22} color={ACCENTS.violet} distance={12} />
      <pointLight position={[5, 3, -3]} intensity={16} color={ACCENTS.cyan} distance={14} />

      <ParallaxRig pointer={pointer}>
        <group scale={isHigh ? 1.06 : 0.92}>
          <Connections />
          <Nodes />
          <Packets count={isHigh ? 14 : 7} />
          <SystemShells />
          <ParticleField count={isHigh ? 320 : 110} />
        </group>
      </ParallaxRig>
    </>
  );
}

export default HeroScene;
