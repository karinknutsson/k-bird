import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useMemo } from "react";
import useGame from "../stores/useGame";
import BirdMesh from "./BirdMesh";

export default function InactiveBird({ scale, onAwake }) {
  const birdRef = useRef();

  const birdDirection = useRef("downLeft");

  const cameraPosition = useGame((state) => state.cameraPosition);

  /**
   * Bird collision
   */
  const birdCollision = () => {
    const position = birdRef.current.translation();

    if (position.y < 3) onAwake(position);
    if (position.y < 3) console.log("bird collides with pyramid");
  };

  return (
    <RigidBody
      ref={birdRef}
      colliders={false}
      canSleep={false}
      angularDamping={1}
      enabledRotations={[false, true, false]}
      friction={2}
      restitution={0}
      type="dynamic"
    >
      {/* Bird collider */}
      <CuboidCollider
        args={[0.1, 0.35, 0.1]}
        mass={0.5}
        onCollisionEnter={birdCollision}
      />

      {/* Bird mesh */}
      <BirdMesh scale={scale} />
    </RigidBody>
  );
}
