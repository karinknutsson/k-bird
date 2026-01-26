import { use, useState } from "react";
import * as THREE from "three";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import useGame from "../stores/useGame";

/**
 * Geometry & material
 */
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

export default function Cube({ size, position }) {
  const [isTouched, setIsTouched] = useState(false);

  const phase = useGame((state) => state.phase);
  const incrementCubeHits = useGame((state) => state.incrementCubeHits);
  const currentCubePosition = useGame((state) => state.currentCubePosition);
  const setCurrentCubePosition = useGame(
    (state) => state.setCurrentCubePosition,
  );

  /**
   * Change color on hit
   */
  const handleHitCube = () => {
    if (phase === "playing") {
      if (!isTouched) incrementCubeHits();

      setIsTouched(true);
      setCurrentCubePosition(position);
    }
  };

  return (
    <RigidBody type="fixed" colliders={false}>
      {/* Collider */}
      <CuboidCollider
        onCollisionEnter={handleHitCube}
        args={[0.25, 0.25, 0.25]}
        position={position}
        friction={2}
      />

      {/* Cube mesh */}
      <mesh
        geometry={boxGeometry}
        scale={[size, size, size]}
        position={position}
      >
        <meshStandardMaterial color={isTouched ? "#ffaf40" : "#8080ff"} />
      </mesh>
    </RigidBody>
  );
}
