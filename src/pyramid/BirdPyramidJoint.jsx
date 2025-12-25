import { useFixedJoint } from "@react-three/rapier";
import useGame from "../stores/useGame";
import * as THREE from "three";

export default function BirdPyramidJoint() {
  const bird = useGame((state) => state.birdRef);
  const pyramid = useGame((state) => state.pyramidRef);
  const anchorB = useGame((state) => state.anchorB);
  const torqueDirection = useGame((state) => state.torqueDirection);

  if (!bird || !pyramid || !anchorB) return null;

  const birdRotation = bird.current.rotation();

  const birdQuaternion = new THREE.Quaternion(
    birdRotation.x,
    birdRotation.y,
    birdRotation.z,
    birdRotation.w
  );

  // const anchorARotation = [
  //   birdQuaternion.x,
  //   birdQuaternion.y,
  //   birdQuaternion.z,
  //   birdQuaternion.w,
  // ];

  // console.log(anchorARotation);

  const anchorARotation =
    torqueDirection === "clockwise" ? [0, 1, 0, 0] : [0, 0.5, 0, 0];

  useFixedJoint(bird, pyramid, [
    [0, 0, 0],
    anchorARotation,
    // [0, 0, 0, 1],
    anchorB,
    [0, 0, 0, 1],
  ]);

  return (
    <mesh position={[3.4, 0, 3.4]}>
      <boxGeometry args={[2, 2, 2]} />
      <meshNormalMaterial />
    </mesh>
  );
}
