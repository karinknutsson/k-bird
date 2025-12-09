import { useState } from "react";
import * as THREE from "three";

const sphereGeometry = new THREE.IcosahedronGeometry(1, 30);
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const coneGeometry = new THREE.ConeGeometry(1, 1, 4, 1);
const birdMaterial = new THREE.MeshStandardMaterial({ color: "#ffffff" });

export default function Bird({ position }) {
  return (
    <group position={position} scale={0.25}>
      {/* Body*/}
      <mesh
        geometry={sphereGeometry}
        material={birdMaterial}
        scale={[1, 0.85, 1]}
      />

      {/* Beek */}
      <mesh
        geometry={coneGeometry}
        material={birdMaterial}
        position={[0, -0.3, 1.3]}
        scale={[0.4, 1, 0.4]}
        rotation={[Math.PI * 0.6, 0, 0]}
      />
    </group>
  );
}
