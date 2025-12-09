import { useState } from "react";
import * as THREE from "three";

const sphereGeometry = new THREE.IcosahedronGeometry(1, 30);
const birdMaterial = new THREE.MeshStandardMaterial({ color: "#ffffff" });

export default function Bird({ position }) {
  return (
    <group position={position} scale={0.25}>
      <mesh geometry={sphereGeometry} material={birdMaterial} />
    </group>
  );
}
