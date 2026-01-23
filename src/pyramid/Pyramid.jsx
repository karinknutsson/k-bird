import { useEffect, useRef, useState } from "react";
import Cube from "./Cube";
import useGame from "../stores/useGame";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import Bird from "../bird/Bird";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import InactiveBird from "../bird/InactiveBird";
import ActiveBird from "../bird/ActiveBird";

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

export function BirdGround({ groundRef }) {
  return (
    <RigidBody
      ref={groundRef}
      type="kinematicPosition"
      colliders={false}
      friction={2}
    >
      <CuboidCollider
        args={[cubeSize * 0.3, 0.02, cubeSize * 0.3]}
        mass={0.5}
      />
    </RigidBody>
  );
}

export default function Pyramid({ levelCount = 4 }) {
  const pyramidRef = useRef();
  const { setCubeCount, cameraPosition, livesPositions } = useGame();

  const birdGroup = useRef();
  const [lives, setLives] = useState(6);
  const [activeIndex, setActiveIndex] = useState(lives - 1);
  const [activePosition, setActivePosition] = useState();
  const [isMoving, setIsMoving] = useState(false);
  const [positions, setPositions] = useState([]);
  const [targetPositions, setTargetPositions] = useState([]);
  const [livesUsed, setLivesUsed] = useState(0);
  const groundRefs = useRef([]);
  const livesPositionY = 3.4;

  function handleAwake(index, position) {
    setLivesUsed((lives) => lives + 1);
    setLives((lives) => lives - 1);
    setActivePosition(position);
    console.log("handle awake has been triggered");
    setIsMoving(true);
    console.log("isMoving has been set to true");
  }

  function handleDeath() {
    setActiveIndex((index) => index - 1);
    setActivePosition(null);
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

          const x =
            livesPositions[cameraPosition].x *
            cubeSize *
            (lives - index - 1 + livesUsed);
          const z =
            livesPositions[cameraPosition].z *
            cubeSize *
            (lives - index - 1 + livesUsed);

          return (
            <group key={index} position={[x, 0, z]}>
              <InactiveBird
                scale={inactive ? 0.14 : 0.2}
                onAwake={(position) => handleAwake(index, position)}
              />
            </group>
          );
        })}
      </group>

      {activePosition && (
        <ActiveBird position={activePosition} onDie={handleDeath} />
      )}
    </>
  );
}
