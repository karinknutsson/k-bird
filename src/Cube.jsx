import * as THREE from "three";

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterial = new THREE.MeshStandardMaterial({ color: "#8080ff" });
const touchedMaterial = new THREE.MeshStandardMaterial({ color: "#eb4034" });

export default function Cube({ size, position }) {
  return (
    <mesh
      geometry={boxGeometry}
      material={cubeMaterial}
      scale={[size, size, size]}
      position={position}
    ></mesh>
  );
}
