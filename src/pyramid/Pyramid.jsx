import { useEffect } from "react";
import Cube from "./Cube";
import useGame from "../stores/useGame";

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

  const turnPyramid = (direction) => {
    console.log(direction);

    setTimeout(() => {
      setTorqueDirection(null);
    }, 2000);
  };

  useEffect(() => {
    const totalCubes = 2 * Math.pow(levelCount, 2) - 2 * levelCount + 1;
    setCubeCount(totalCubes);

    const unsubscribeTorqueDirection = useGame.subscribe(
      (state) => state.torqueDirection,
      (direction) => {
        if (!direction) return;

        turnPyramid(direction);
      }
    );

    return () => {
      unsubscribeTorqueDirection();
    };
  }, []);

  return (
    <>
      <group position={[0, levelCount * cubeSize * 0.5, 0]}>
        {[...Array(levelCount)].map((_, index) => {
          return <CubeLevel key={index} level={index} />;
        })}
      </group>
    </>
  );
}
