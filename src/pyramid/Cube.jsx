import { useState } from "react";
import * as THREE from "three";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import useGame from "../stores/useGame";

/**
 * Geometry & material
 */
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

export default function Cube({ size, position }) {
  const [isTouched, setIsTouched] = useState(false);

  const { phase, incrementCubeHits, incrementScore } = useGame();

  /**
   * Change color on hit
   */
  const handleHitCube = (e) => {
    if (
      phase === "playing" &&
      e.rigidBodyObject.name === "bird" &&
      !isTouched
    ) {
      setIsTouched(true);
      incrementScore();
      incrementCubeHits();
    }
  };

  return (
    <RigidBody type="fixed" colliders={false} position={position}>
      {/* Collider */}
      <CuboidCollider
        onCollisionEnter={handleHitCube}
        args={[0.25, 0.25, 0.25]}
        friction={2}
      />

      {/* Cube mesh */}
      <mesh geometry={boxGeometry} scale={[size, size, size]}>
        <meshStandardMaterial color={isTouched ? "#66ff66" : "#9966ff"} />
      </mesh>
    </RigidBody>
  );
}
