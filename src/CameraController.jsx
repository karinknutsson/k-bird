import { useFrame, useThree } from "@react-three/fiber";
import useGame from "./stores/useGame";
import * as THREE from "three";

export default function CameraController() {
  const { camera } = useThree();
  const { cameraPosition, cameraPositions, isCameraMoving, stopCamera } =
    useGame();

  useFrame((_, delta) => {
    if (!camera) return;

    if (isCameraMoving) {
      const targetPosition = cameraPositions[cameraPosition];
      camera.position.lerp(targetPosition, 5 * delta);

      const target = new THREE.Vector3(0, 0, 0);
      camera.lookAt(target);

      if (targetPosition === camera.position) stopCamera();
    }
  });

  return <></>;
}
