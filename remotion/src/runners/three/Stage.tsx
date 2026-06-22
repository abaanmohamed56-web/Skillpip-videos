import React from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { useCurrentFrame } from "remotion";
import { computeWorld, noise, smoothstep } from "../anim";
import { scrollAt, finishZAt, speedAt } from "../anim";
import { cameraAt } from "./camera";
import { Runner } from "./Runner";
import { Ground } from "./Ground";
import { FinishLine } from "./FinishLine";
import { Dust, Rain, Wind, Rocks, Burst } from "./Particles";
import { LANE } from "../constants";

// Drives the Three.js camera from the Remotion frame.
const CameraRig: React.FC<{ shake: number }> = ({ shake }) => {
  const frame = useCurrentFrame();
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const cam = cameraAt(frame);

  const sx = noise(frame * 0.7) * 0.06 * shake;
  const sy = noise(frame * 0.7 + 50) * 0.05 * shake;
  const sz = noise(frame * 0.7 + 99) * 0.03 * shake;

  camera.position.set(cam.pos[0] + sx, cam.pos[1] + sy, cam.pos[2] + sz);
  camera.fov = cam.fov;
  camera.near = 0.1;
  camera.far = 200;
  camera.updateProjectionMatrix();
  camera.lookAt(cam.tgt[0] + sx * 0.5, cam.tgt[1] + sy * 0.5, cam.tgt[2]);
  return null;
};

export const Stage: React.FC = () => {
  const frame = useCurrentFrame();
  const w = computeWorld(frame);
  const scroll = scrollAt(frame);
  const speed = speedAt(frame);
  const finishZ = finishZAt(frame);

  // Obstacle intensities (S2–S3).
  const rain =
    smoothstep(540, 660, frame) * (1 - smoothstep(1500, 1620, frame));
  const wind =
    smoothstep(600, 720, frame) * (1 - smoothstep(1080, 1180, frame));
  const rocks =
    smoothstep(720, 800, frame) * (1 - smoothstep(1080, 1160, frame));

  // Burst centred between the two runners at the lift.
  const burstCenter: [number, number, number] = [0, 0.6, 0.2];
  const burst =
    w.handClasp * 0.6 +
    smoothstep(2280, 2460, frame) * 0.8; // also blooms at the climax

  const finishIntensity =
    0.3 + smoothstep(2100, 2460, frame) * 1.2;

  return (
    <>
      <fogExp2 attach="fog" args={["#000000", 0.019]} />
      <color attach="background" args={["#000000"]} />

      {/* lighting */}
      <ambientLight intensity={0.35} color={"#9fb6d8"} />
      <directionalLight position={[3, 7, -2]} intensity={1.3} color={"#eaf4ff"} />
      <directionalLight position={[-5, 3, 8]} intensity={0.6} color={"#cfe0ff"} />
      <pointLight position={[0, 3, -3]} intensity={0.6} color={"#bfe9ff"} />

      <CameraRig shake={w.shake} />

      <Ground scroll={scroll} speed={speed} />
      <FinishLine z={finishZ} intensity={finishIntensity} />

      <Runner pose={w.leader} />
      <Runner pose={w.struggler} />

      <Dust scroll={scroll} />
      <Rain frame={frame} amount={rain} />
      <Wind frame={frame} amount={wind} />
      <Rocks frame={frame} amount={rocks} />
      <Burst frame={frame} amount={burst} center={burstCenter} />

      {/* faint ground-glow under each runner for grounding/bloom */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[w.leader.x, 0.01, 0]}
      >
        <circleGeometry args={[0.7, 24]} />
        <meshBasicMaterial
          color={"#bfe9ff"}
          transparent
          opacity={0.12 + w.leader.glow * 0.2}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[w.struggler.x, 0.01, 0]}
      >
        <circleGeometry args={[0.7, 24]} />
        <meshBasicMaterial
          color={"#bfe9ff"}
          transparent
          opacity={0.12 + w.struggler.glow * 0.2}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </>
  );
};
