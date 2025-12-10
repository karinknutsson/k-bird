import { useState } from "react";
import * as THREE from "three";
import { RigidBody, CuboidCollider } from "@react-three/rapier";

/**
 * Geometry & material
 */
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterial = new THREE.MeshStandardMaterial({ color: "#8080ff" });
const touchedMaterial = new THREE.MeshStandardMaterial({ color: "#ffaf40" });

export default function Cube({ size, position }) {
  const [isTouched, setIsTouched] = useState(false);

  /**
   * Change color on hit
   */
  const handleHitCube = () => {
    setIsTouched(true);
  };

  return (
    <RigidBody type="fixed" friction={0.5} colliders={false}>
      {/* Collider */}
      <CuboidCollider
        onCollisionEnter={handleHitCube}
        args={[0.25, 0.25, 0.25]}
        position={position}
      />

      {/* Cube mesh */}
      <mesh
        geometry={boxGeometry}
        material={isTouched ? touchedMaterial : cubeMaterial}
        scale={[size, size, size]}
        position={position}
      ></mesh>
    </RigidBody>
  );
}
