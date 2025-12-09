import { useState } from "react";
import * as THREE from "three";
import { RigidBody } from "@react-three/rapier";

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterial = new THREE.MeshStandardMaterial({ color: "#8080ff" });
const touchedMaterial = new THREE.MeshStandardMaterial({ color: "#ffaf40" });

export default function Cube({ size, position }) {
  const [isTouched, setIsTouched] = useState(false);

  return (
    <RigidBody type="fixed" friction={0.5}>
      <mesh
        geometry={boxGeometry}
        material={isTouched ? touchedMaterial : cubeMaterial}
        scale={[size, size, size]}
        position={position}
      ></mesh>
    </RigidBody>
  );
}
