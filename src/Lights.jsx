import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import useGame from "./stores/useGame";
import * as THREE from "three";

export default function Lights() {
  const lightRef = useRef();

  const { cameraPosition, lightPositions, isCameraMoving } = useGame();

  useFrame((_, delta) => {
    if (!lightRef.current) return;

    if (isCameraMoving) {
      const targetPosition = lightPositions[cameraPosition];
      lightRef.current.position.lerp(targetPosition, 5 * delta);

      const target = new THREE.Vector3(0, 0, 0);
      lightRef.current.lookAt(target);
    }
  });

  return (
    <>
      <directionalLight ref={lightRef} position={[-4, 4, 1]} intensity={4.5} />
      <ambientLight intensity={1.5} />
    </>
  );
}
