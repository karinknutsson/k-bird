import { useEffect, useRef } from "react";
import Cube from "./Cube";
import useGame from "../stores/useGame";
import { RigidBody } from "@react-three/rapier";
import Bird from "../bird/Bird";

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

export function GroundLevel({ level }) {
  const positions = getCubeRing(level);

  return (
    <group position={[0, -level * cubeSize, 0]}>
      {positions.map((p, index) => {
        return (
          <mesh key={index} position={[p[0] * cubeSize, 0, p[2] * cubeSize]}>
            <boxGeometry args={[cubeSize, 0.1, cubeSize]} />
            <meshBasicMaterial color="black" />
          </mesh>
        );
      })}
    </group>
  );
}

export default function Pyramid({ levelCount = 4 }) {
  const setCubeCount = useGame((state) => state.setCubeCount);
  const pyramidRef = useRef();

  useEffect(() => {
    const totalCubes = 2 * Math.pow(levelCount, 2) - 2 * levelCount + 1;
    setCubeCount(totalCubes);
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
        <group position={[0, cubeSize, 0]}>
          <GroundLevel level={levelCount - 1} />
        </group>
      </RigidBody>

      <Bird position={[0, 1.7, 0]} />
    </>
  );
}
