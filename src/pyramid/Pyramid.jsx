import { useEffect, useRef, useState } from "react";
import Cube from "./Cube";
import useGame from "../stores/useGame";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
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

export function BirdGround({ position }) {
  return (
    <RigidBody type="fixed" colliders={false}>
      <CuboidCollider
        position={position}
        args={[cubeSize * 0.3, 0.02, cubeSize * 0.3]}
        mass={0.5}
      />
    </RigidBody>
  );
}

export default function Pyramid({ levelCount = 4 }) {
  const pyramidRef = useRef();
  const { setCubeCount, cameraPosition, extraLives, extraLivesPositions } =
    useGame();

  useEffect(() => {
    const totalCubes = 2 * Math.pow(levelCount, 2) - 2 * levelCount + 1;
    setCubeCount(totalCubes);
  }, []);

  const birdRefs = useRef([]);
  const [activeIndex, setActiveIndex] = useState(null);

  function handleAwake(index) {
    setActiveIndex(index);
    console.log(activeIndex);
  }

  function handleDeath() {
    console.log("die");
  }

  return (
    <>
      <RigidBody ref={pyramidRef} colliders={false} mass={0.1}>
        <group position={[0, levelCount * cubeSize * 0.5, 0]}>
          {[...Array(levelCount)].map((_, index) => {
            return <CubeLevel key={index} level={index} />;
          })}
        </group>
      </RigidBody>

      {[...Array(extraLives)].map((_, index) => {
        const inactive = activeIndex !== index;

        return (
          <group key={index}>
            {inactive && (
              <BirdGround
                position={[
                  extraLivesPositions[cameraPosition].x * index * 0.4,
                  2.4,
                  extraLivesPositions[cameraPosition].z * index * 0.4,
                ]}
                args={[cubeSize * 0.3, 0.02, cubeSize * 0.3]}
              />
            )}

            <Bird
              id={index}
              position={[
                extraLivesPositions[cameraPosition].x * index * 0.4,
                3,
                extraLivesPositions[cameraPosition].z * index * 0.4,
              ]}
              scale={inactive ? 0.14 : 0.2}
              active={!inactive}
              onAwake={() => handleAwake(index)}
              onDie={handleDeath}
            />
          </group>
        );
      })}
    </>
  );
}
