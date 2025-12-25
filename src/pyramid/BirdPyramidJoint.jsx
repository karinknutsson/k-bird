import { useFixedJoint } from "@react-three/rapier";

export default function BirdPyramidJoint() {
  const bird = useGame((state) => state.birdRef);
  const pyramid = useGame((state) => state.pyramidRef);
  const anchorB = useGame((state) => state.anchorB);

  if (!bird || !pyramid || !anchorB) return null;

  useFixedJoint(bird, pyramid, [
    [0, 0, 0],
    [0, 0, 0, 1],
    anchorB,
    [0, 0, 0, 1],
  ]);

  console.log(anchorB);

  return null;
}
