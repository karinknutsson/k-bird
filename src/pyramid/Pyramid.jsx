import { useEffect, useRef, useState, useMemo } from "react";
import Cube from "./Cube";
import useGame from "../stores/useGame";
import { RigidBody } from "@react-three/rapier";
import InactiveBird from "../bird/InactiveBird";
import ActiveBird from "../bird/ActiveBird";
import gsap from "gsap";

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
  const pyramidRef = useRef();
  const { setCubeCount, cameraPosition, livesPositions, phase, end } =
    useGame();

  const birdGroup = useRef();
  const [lives, setLives] = useState(3);
  const [activeIndex, setActiveIndex] = useState(lives - 1);
  const [activePosition, setActivePosition] = useState();
  const livesPositionY = 3;

  const birdPositions = useMemo(
    () => calculateBirdPositions(),
    [lives, cameraPosition, livesPositions],
  );

  function handleAwake(_, position) {
    setLives((prev) => prev - 1);
    setActivePosition(position);
  }

  function handleDeath() {
    if (activeIndex === 0) {
      end();

      gsap.to(".game-over-container", { opacity: 1, duration: 0.5 });
    } else {
      setActiveIndex((prev) => prev - 1);
      setActivePosition(null);
    }
  }

  function calculateBirdPositions() {
    const positions = [];

    for (let i = 0; i < lives; i++) {
      const x =
        livesPositions[cameraPosition].x * cubeSize * (lives - i - 1.00001);
      const z =
        livesPositions[cameraPosition].z * cubeSize * (lives - i - 1.00001);

      positions.push({ x, y: 0, z });
    }

    return positions;
  }

  useEffect(() => {
    const totalCubes = 2 * Math.pow(levelCount, 2) - 2 * levelCount + 1;
    setCubeCount(totalCubes);
  }, []);

  return (
    <>
      <RigidBody ref={pyramidRef} colliders={false} mass={0.1}>
        <group position={[0, levelCount * cubeSize * 0.5, 0]}>
          {[...Array(levelCount)].map((_, index) => {
            return <CubeLevel key={index} level={index} />;
          })}
        </group>
      </RigidBody>

      <group ref={birdGroup} position={[0, livesPositionY, 0]}>
        {[...Array(lives)].map((_, index) => {
          const inactive = activeIndex !== index;

          return (
            <InactiveBird
              key={`${index}-${lives}`}
              position={[birdPositions[index].x, 0, birdPositions[index].z]}
              scale={0.14}
              onAwake={(position) => handleAwake(index, position)}
              bodyType={inactive ? "kinematicPosition" : "dynamic"}
            />
          );
        })}
      </group>

      {phase !== "ended" && activePosition && (
        <ActiveBird position={activePosition} onDie={handleDeath} />
      )}
    </>
  );
}
