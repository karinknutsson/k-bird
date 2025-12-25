// components/SmoothCameraController.jsx
import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import { useGame } from "../stores/useGame";
import * as THREE from "three";

export function SmoothCameraController() {
  const cameraRef = useRef();
  const { cameraPosition, setCameraPosition, isCameraMoving } = useGame();

  const cameraPositions = {
    front: new THREE.Vector3(5, 6, 5),
    left: new THREE.Vector3(-5, 6, 5),
    back: new THREE.Vector3(-5, 6, -5),
    right: new THREE.Vector3(5, 6, -5),
  };

  useFrame((state, delta) => {
    if (!cameraRef.current) return;

    const camera = cameraRef.current;

    const targetPosition = cameraPositions[currentPosition];
    camera.position.lerp(targetPosition, 5 * delta);

    const target = new THREE.Vector3(0, 0, 0);
    camera.lookAt(target);
  });

  return <perspectiveCamera ref={cameraRef} position={[5, 6, 5]} />;
}
