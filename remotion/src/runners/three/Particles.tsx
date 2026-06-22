import React, { useMemo } from "react";
import * as THREE from "three";
import { glowTexture } from "./textures";
import { noise } from "../anim";

const rnd = (i: number, k: number) => {
  const s = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453;
  return s - Math.floor(s);
};

// ── Ambient floating dust (always-on atmosphere) ─────────────
export const Dust: React.FC<{ scroll: number }> = ({ scroll }) => {
  const N = 130;
  const { geom } = useMemo(() => {
    const pos = new Float32Array(N * 3);
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return { geom: g };
  }, []);

  const pos = geom.getAttribute("position") as THREE.BufferAttribute;
  for (let i = 0; i < N; i++) {
    const baseZ = rnd(i, 1) * 70;
    const z = ((baseZ - scroll * 0.25) % 70 + 70) % 70;
    const x = (rnd(i, 2) - 0.5) * 18;
    const y =
      0.3 +
      ((rnd(i, 3) * 6 + scroll * 0.06 * (0.5 + rnd(i, 4))) % 7);
    pos.setXYZ(i, x, y, z);
  }
  pos.needsUpdate = true;

  return (
    <points geometry={geom}>
      <pointsMaterial
        map={glowTexture()}
        color={"#cfe9ff"}
        size={0.16}
        sizeAttenuation
        transparent
        opacity={0.5}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

// ── Rain (obstacle scenes) ───────────────────────────────────
export const Rain: React.FC<{ frame: number; amount: number }> = ({
  frame,
  amount,
}) => {
  const N = 240;
  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(N * 2 * 3), 3)
    );
    return g;
  }, []);

  if (amount <= 0.01) return null;

  const t = frame / 60;
  const pos = geom.getAttribute("position") as THREE.BufferAttribute;
  for (let i = 0; i < N; i++) {
    const x = (rnd(i, 5) - 0.5) * 26;
    const z = rnd(i, 6) * 55 + 1;
    const fall = (rnd(i, 7) * 12 + t * 28) % 14;
    const y = 14 - fall;
    const len = 0.6 + rnd(i, 8) * 0.5;
    const skew = 0.9; // wind slant
    pos.setXYZ(i * 2, x, y, z);
    pos.setXYZ(i * 2 + 1, x + skew * 0.3, y - len, z);
  }
  pos.needsUpdate = true;

  return (
    <lineSegments geometry={geom}>
      <lineBasicMaterial
        color={"#bcd8ff"}
        transparent
        opacity={0.4 * amount}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </lineSegments>
  );
};

// ── Wind streaks (horizontal speed lines) ────────────────────
export const Wind: React.FC<{ frame: number; amount: number }> = ({
  frame,
  amount,
}) => {
  const N = 40;
  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(N * 2 * 3), 3)
    );
    return g;
  }, []);
  if (amount <= 0.01) return null;

  const t = frame / 60;
  const pos = geom.getAttribute("position") as THREE.BufferAttribute;
  for (let i = 0; i < N; i++) {
    const y = rnd(i, 9) * 5 + 0.5;
    const z = rnd(i, 10) * 45 + 3;
    const span = 2 + rnd(i, 11) * 3;
    const x = ((rnd(i, 12) * 30 + t * 34) % 36) - 18;
    pos.setXYZ(i * 2, x, y, z);
    pos.setXYZ(i * 2 + 1, x - span, y, z);
  }
  pos.needsUpdate = true;

  return (
    <lineSegments geometry={geom}>
      <lineBasicMaterial
        color={"#aac8ff"}
        transparent
        opacity={0.28 * amount}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </lineSegments>
  );
};

// ── Falling rocks (a few tumbling boxes) ─────────────────────
export const Rocks: React.FC<{ frame: number; amount: number }> = ({
  frame,
  amount,
}) => {
  const N = 6;
  if (amount <= 0.01) return null;
  const t = frame / 60;
  return (
    <group>
      {Array.from({ length: N }).map((_, i) => {
        const x = (rnd(i, 13) - 0.5) * 10;
        const z = 6 + rnd(i, 14) * 28;
        const fall = (rnd(i, 15) * 6 + t * 9) % 12;
        const y = 12 - fall;
        if (y < 0.2) return null;
        const s = 0.18 + rnd(i, 16) * 0.22;
        const rot = t * (1 + rnd(i, 17) * 2);
        return (
          <mesh key={i} position={[x, y, z]} rotation={[rot, rot * 0.7, rot * 0.4]}>
            <dodecahedronGeometry args={[s, 0]} />
            <meshStandardMaterial
              color={"#0b0d11"}
              emissive={"#1a2230"}
              emissiveIntensity={0.4}
              roughness={0.8}
            />
          </mesh>
        );
      })}
    </group>
  );
};

// ── Burst of light + particles during the hand-lift / climax ──
export const Burst: React.FC<{
  frame: number;
  amount: number;
  center: [number, number, number];
}> = ({ frame, amount, center }) => {
  const N = 90;
  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(N * 3), 3)
    );
    return g;
  }, []);
  if (amount <= 0.01) return null;

  const t = frame / 60;
  const pos = geom.getAttribute("position") as THREE.BufferAttribute;
  for (let i = 0; i < N; i++) {
    const ang = rnd(i, 18) * Math.PI * 2;
    const rise = (rnd(i, 19) * 2 + t * (0.6 + rnd(i, 20))) % 4;
    const rad = 0.4 + rise * (0.6 + rnd(i, 21));
    const x = center[0] + Math.cos(ang) * rad * 0.5 + noise(i + t) * 0.1;
    const y = center[1] + rise * 0.9;
    const z = center[2] + Math.sin(ang) * rad;
    pos.setXYZ(i, x, y, z);
  }
  pos.needsUpdate = true;

  // light rays radiating upward/out
  const rays = 9;
  return (
    <group>
      <points geometry={geom}>
        <pointsMaterial
          map={glowTexture()}
          color={"#eafaff"}
          size={0.22}
          sizeAttenuation
          transparent
          opacity={0.85 * amount}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
      <group position={center}>
        {Array.from({ length: rays }).map((_, i) => {
          const a = (i / rays) * Math.PI * 2 + t * 0.3;
          return (
            <mesh key={i} rotation={[0, 0, a]} position={[0, 1, 0]}>
              <planeGeometry args={[0.12, 7]} />
              <meshBasicMaterial
                map={glowTexture()}
                color={"#dff3ff"}
                transparent
                opacity={0.22 * amount}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
                side={THREE.DoubleSide}
              />
            </mesh>
          );
        })}
      </group>
      <pointLight position={center} color={"#eafaff"} intensity={12 * amount} distance={20} />
    </group>
  );
};
