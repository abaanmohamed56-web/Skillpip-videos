import React from "react";
import * as THREE from "three";
import type { Pose } from "../anim";

// ── Proportions (world units) ────────────────────────────────
const HIPS_Y = 0.92;
const THIGH = 0.44;
const SHIN = 0.44;
const TORSO = 0.56;
const NECK = 0.10;
const HEAD_R = 0.16;
const UP_ARM = 0.32;
const FORE_ARM = 0.30;
const HIP_W = 0.16;
const SHO_W = 0.20;
const R = 0.058; // limb radius

const Mat: React.FC<{ glow: number }> = ({ glow }) => (
  <meshStandardMaterial
    color={"#ffffff"}
    emissive={"#dff3ff"}
    emissiveIntensity={0.35 + glow}
    roughness={0.4}
    metalness={0.0}
  />
);

const Joint: React.FC<{ r: number; glow: number }> = ({ r, glow }) => (
  <mesh>
    <sphereGeometry args={[r, 12, 12]} />
    <Mat glow={glow} />
  </mesh>
);

// Single bone: cylinder from the pivot (y=0) downward to y=-len.
const Segment: React.FC<{ len: number; radius: number; glow: number }> = ({
  len,
  radius,
  glow,
}) => (
  <mesh position={[0, -len / 2, 0]}>
    <cylinderGeometry args={[radius * 0.92, radius, len, 12]} />
    <Mat glow={glow} />
  </mesh>
);

// Two-segment chain (leg = thigh+shin, arm = upper+fore).
const Chain: React.FC<{
  a1: number;
  a2: number;
  l1: number;
  l2: number;
  radius: number;
  splay?: number;
  glow: number;
  foot?: boolean;
}> = ({ a1, a2, l1, l2, radius, splay = 0, glow, foot }) => (
  <group rotation={[a1, 0, splay]}>
    <Joint r={radius * 1.3} glow={glow} />
    <Segment len={l1} radius={radius} glow={glow} />
    <group position={[0, -l1, 0]} rotation={[a2, 0, 0]}>
      <Joint r={radius * 1.15} glow={glow} />
      <Segment len={l2} radius={radius * 0.92} glow={glow} />
      {foot && (
        <mesh position={[0, -l2 + 0.02, 0.07]} rotation={[Math.PI / 2, 0, 0]}>
          <capsuleGeometry args={[radius * 0.9, 0.14, 4, 8]} />
          <Mat glow={glow} />
        </mesh>
      )}
    </group>
  </group>
);

export const Runner: React.FC<{ pose: Pose; z?: number }> = ({ pose, z = 0 }) => {
  const g = pose.glow;
  return (
    <group position={[pose.x, HIPS_Y + pose.y, z]} rotation={[0, pose.yaw, 0]}>
      {/* hip joints */}
      <Joint r={R * 1.4} glow={g} />

      {/* Spine + everything upper pivots forward at the hips */}
      <group rotation={[pose.lean, 0, 0]}>
        {/* torso */}
        <mesh position={[0, TORSO / 2, 0]}>
          <cylinderGeometry args={[R * 1.15, R * 1.35, TORSO, 12]} />
          <Mat glow={g} />
        </mesh>

        {/* shoulders / neck / head */}
        <group position={[0, TORSO, 0]}>
          <Joint r={R * 1.5} glow={g} />
          {/* neck */}
          <mesh position={[0, NECK / 2, 0]}>
            <cylinderGeometry args={[R * 0.7, R * 0.8, NECK, 8]} />
            <Mat glow={g} />
          </mesh>
          {/* head */}
          <group rotation={[pose.headTilt, 0, 0]}>
            <mesh position={[0, NECK + HEAD_R, 0]}>
              <sphereGeometry args={[HEAD_R, 18, 18]} />
              <Mat glow={g} />
            </mesh>
          </group>

          {/* arms hang from shoulders */}
          <group position={[-SHO_W, 0, 0]}>
            <Chain
              a1={pose.lShoulder}
              a2={pose.lElbow}
              l1={UP_ARM}
              l2={FORE_ARM}
              radius={R * 0.78}
              splay={0.12}
              glow={g}
            />
          </group>
          <group position={[SHO_W, 0, 0]}>
            <Chain
              a1={pose.rShoulder}
              a2={pose.rElbow}
              l1={UP_ARM}
              l2={FORE_ARM}
              radius={R * 0.78}
              splay={-0.12}
              glow={g}
            />
          </group>
        </group>
      </group>

      {/* legs */}
      <group position={[-HIP_W, 0, 0]}>
        <Chain
          a1={pose.lHip}
          a2={pose.lKnee}
          l1={THIGH}
          l2={SHIN}
          radius={R}
          splay={0.06}
          glow={g}
          foot
        />
      </group>
      <group position={[HIP_W, 0, 0]}>
        <Chain
          a1={pose.rHip}
          a2={pose.rKnee}
          l1={THIGH}
          l2={SHIN}
          radius={R}
          splay={-0.06}
          glow={g}
          foot
        />
      </group>
    </group>
  );
};

// Helper to read a runner's right-hand world position (for the hand clasp
// spark). Kept simple/approximate — matches the reach pose.
export function rightHandLocal(pose: Pose): THREE.Vector3 {
  return new THREE.Vector3(pose.x + 0.2, HIPS_Y + pose.y + 0.45, 0.4);
}
