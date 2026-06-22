import React, { useMemo } from "react";
import * as THREE from "three";

// Minimalist reflective floor: a subtle grid of light lines that scroll
// toward the camera to convey speed. Pure black base for high contrast.
export const Ground: React.FC<{ scroll: number; speed: number }> = ({
  scroll,
  speed,
}) => {
  const lines = useMemo(() => {
    const arr: number[] = [];
    for (let i = 0; i < 60; i++) arr.push(i);
    return arr;
  }, []);

  const SPACING = 2.2;
  const FAR = 120;
  // Brightness of the rushing lines scales with speed → motion energy.
  const energy = Math.min(1, Math.abs(speed) * 0.9);

  return (
    <group>
      {/* base floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.001, 40]}>
        <planeGeometry args={[80, FAR * 2]} />
        <meshStandardMaterial color={"#050608"} roughness={0.9} metalness={0.1} />
      </mesh>

      {/* scrolling cross-lines (perpendicular to motion) */}
      {lines.map((i) => {
        const z = ((i * SPACING - (scroll % SPACING)) % FAR + FAR) % FAR;
        const fade = 1 - z / FAR;
        return (
          <mesh
            key={`x${i}`}
            position={[0, 0.005, z]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <planeGeometry args={[24, 0.05]} />
            <meshBasicMaterial
              color={"#9fd6ff"}
              transparent
              opacity={(0.05 + 0.22 * energy) * fade}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        );
      })}

      {/* two rail lines guiding the eye to the finish */}
      {[-3.2, 3.2].map((x) => (
        <mesh
          key={`rail${x}`}
          position={[x, 0.006, 50]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[0.04, FAR]} />
          <meshBasicMaterial
            color={"#bfe9ff"}
            transparent
            opacity={0.16}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
};
