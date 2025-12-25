import { useEffect, useRef } from "react";
import Cube from "./Cube";
import useGame from "../stores/useGame";
import { RigidBody } from "@react-three/rapier";
import Bird from "../bird/Bird";
import BirdPyramidJoint from "./BirdPyramidJoint";

const cubeSize = 0.5;

/**
 * Generate Manhattan rings
 */
function getCubeRing(level) {
  const cubes = [];

  for (let x = -level; x <= level; x++) {
    const z = level - Math.abs(x);

    if (z === 0) {
      cubes.push([x, 0, 0]);
    } else {
      cubes.push([x, 0, z]);
      cubes.push([x, 0, -z]);
    }
  }

  return cubes;
}

export function CubeLevel({ level }) {
  const positions = getCubeRing(level);

  return (
    <group position={[0, -level * cubeSize, 0]}>
      {positions.map((p, index) => {
        return (
          <Cube
            key={index}
            size={cubeSize}
            position={[p[0] * cubeSize, 0, p[2] * cubeSize]}
          />
        );
      })}
    </group>
  );
}

export default function Pyramid({ levelCount = 4 }) {
  const setCubeCount = useGame((state) => state.setCubeCount);
  const setTorqueDirection = useGame((state) => state.setTorqueDirection);
  const pyramidRef = useRef();
  const setPyramidRef = useGame((state) => state.setPyramidRef);
  const isSpinning = useGame((state) => state.isSpinning);

  const turnPyramid = (direction) => {
    const { birdRef, pyramidRef, startSpin, stopSpin, setTorqueDirection } =
      useGame.getState();

    if (!birdRef?.current || !pyramidRef?.current) return;

    const birdWorld = birdRef.current.translation();
    const pyramidWorld = pyramidRef.current.translation();

    const anchorB = [
      birdWorld.x - pyramidWorld.x,
      birdWorld.y - pyramidWorld.y,
      birdWorld.z - pyramidWorld.z,
    ];

    startSpin(anchorB);

    const impulse = direction === "clockwise" ? 0.5 : -0.5;
    pyramidRef.current.applyTorqueImpulse({ x: 0, y: 18, z: 0 });

    setTimeout(() => {
      setTorqueDirection(null);
      stopSpin();
    }, 2000);
  };

  useEffect(() => {
    setPyramidRef(pyramidRef);

    const totalCubes = 2 * Math.pow(levelCount, 2) - 2 * levelCount + 1;
    setCubeCount(totalCubes);

    const unsubscribeTorqueDirection = useGame.subscribe(
      (state) => state.torqueDirection,
      (direction) => {
        if (!direction) return;

        setTimeout(() => {
          turnPyramid(direction);
        }, 800);
      }
    );

    return () => {
      unsubscribeTorqueDirection();
    };
  }, []);

  return (
    <>
      <RigidBody ref={pyramidRef} type="dynamic" colliders={false} mass={0.1}>
        <group position={[0, levelCount * cubeSize * 0.5, 0]}>
          {[...Array(levelCount)].map((_, index) => {
            return <CubeLevel key={index} level={index} />;
          })}
        </group>
      </RigidBody>

      <RigidBody type="fixed">
        <mesh position={[0, -levelCount * cubeSize * 0.5, 0]}>
          <boxGeometry args={[levelCount - 0.5, 0.1, levelCount - 0.5]} />
          <meshBasicMaterial color="black" />
        </mesh>
      </RigidBody>

      <Bird position={[0, 1.7, 0]} />

      {isSpinning && <BirdPyramidJoint />}
    </>
  );
}
