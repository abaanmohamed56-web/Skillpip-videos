import React from "react";
import * as THREE from "three";
import { glowTexture, beamTexture } from "./textures";
import { FINISH_COLOR } from "../constants";

// Glowing finish line with volumetric light shaft + bloom halo.
export const FinishLine: React.FC<{ z: number; intensity: number }> = ({
  z,
  intensity,
}) => {
  const glow = glowTexture();
  const beam = beamTexture();
  // Fade out once it has passed behind the camera.
  const vis = z > -6 ? 1 : 0;
  if (!vis) return null;

  return (
    <group position={[0, 0, z]}>
      {/* gate posts */}
      {[-3.4, 3.4].map((x) => (
        <mesh key={x} position={[x, 2.4, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 4.8, 12]} />
          <meshStandardMaterial
            color={"#ffffff"}
            emissive={FINISH_COLOR}
            emissiveIntensity={2 + intensity * 3}
          />
        </mesh>
      ))}
      {/* top bar */}
      <mesh position={[0, 4.7, 0]}>
        <boxGeometry args={[7, 0.16, 0.16]} />
        <meshStandardMaterial
          color={"#ffffff"}
          emissive={FINISH_COLOR}
          emissiveIntensity={2 + intensity * 3}
        />
      </mesh>

      {/* glowing ground line */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <planeGeometry args={[7, 0.5]} />
        <meshBasicMaterial
          color={FINISH_COLOR}
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* volumetric light shaft */}
      <mesh position={[0, 4, 0.2]}>
        <planeGeometry args={[7.5, 9]} />
        <meshBasicMaterial
          map={beam}
          color={FINISH_COLOR}
          transparent
          opacity={0.35 + intensity * 0.4}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* big soft bloom halo */}
      <mesh position={[0, 2.6, -0.1]}>
        <planeGeometry args={[16, 16]} />
        <meshBasicMaterial
          map={glow}
          color={FINISH_COLOR}
          transparent
          opacity={0.4 + intensity * 0.5}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* light cast forward */}
      <pointLight
        position={[0, 3, -2]}
        color={FINISH_COLOR}
        intensity={6 + intensity * 14}
        distance={40}
        decay={1.4}
      />
    </group>
  );
};
