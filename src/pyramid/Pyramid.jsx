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
  const groundRefs = useRef([]);
  const livesPositionY = 3.4;

  useEffect(() => {
    setTimeout(() => {
      setIsMoving(true);
    }, 400);
  }, []);

  function handleAwake(index, position) {
    setLives((lives) => lives - 1);
    setActivePosition(position);
  }

  function handleDeath() {
    setActiveIndex((index) => index - 1);
    setActivePosition(null);
    setTimeout(() => {
      setIsMoving(true);
    }, 400);
  }

  function areRoughlyEqual(a, b, epsilon = 0.01) {
    return Math.abs(a - b) < epsilon;
  }

  useFrame((_, delta) => {
    if (!isMoving) return;

    for (let i = activeIndex - 1; i > -1; i--) {
      const position = positions[i];

      position.x = THREE.MathUtils.lerp(
        position.x,
        targetPositions[i].x,
        delta * 2
      );
      position.y = THREE.MathUtils.lerp(
        position.y,
        targetPositions[i].y,
        delta * 2
      );
      position.z = THREE.MathUtils.lerp(
        position.z,
        targetPositions[i].z,
        delta * 2
      );

      groundRefs.current[i].setNextKinematicTranslation({
        x: position.x,
        y: position.y,
        z: position.z,
      });

      if (areRoughlyEqual(position.x, targetPositions[i].x)) {
        setPositions((prev) =>
          prev.map((pos, index) =>
            i === index
              ? {
                  x: targetPositions[i].x,
                  y: targetPositions[i].y,
                  z: targetPositions[i].z,
                }
              : pos
          )
        );

        if (i === 0) setIsMoving(false);
      }
    }
  });

  useEffect(() => {
    const totalCubes = 2 * Math.pow(levelCount, 2) - 2 * levelCount + 1;
    setCubeCount(totalCubes);

    let currentPositions = [];

    for (let i = 0; i < lives; i++) {
      currentPositions[i] = {
        x: livesPositions[cameraPosition].x * cubeSize * (lives - i - 1),
        y: livesPositionY - 0.6,
        z: livesPositions[cameraPosition].z * cubeSize * (lives - i - 1),
      };
    }

    setPositions(currentPositions);

    let targets = [];

    for (let i = 0; i < lives - 1; i++) {
      targets[i] = {
        x: livesPositions[cameraPosition].x * cubeSize * (lives - i - 2),
        y: livesPositionY - 0.6,
        z: livesPositions[cameraPosition].z * cubeSize * (lives - i - 2),
      };
    }

    setTargetPositions(targets);
  }, [cameraPosition]);

  return (
    <>
      <RigidBody ref={pyramidRef} colliders={false} mass={0.1}>
        <group position={[0, levelCount * cubeSize * 0.5, 0]}>
          {[...Array(levelCount)].map((_, index) => {
            return <CubeLevel key={index} level={index} />;
          })}
        </group>
      </RigidBody>

      {positions[0] && (
        <group ref={birdGroup} position={[0, livesPositionY, 0]}>
          {[...Array(lives)].map((_, index) => {
            const inactive = activeIndex !== index;

            const x =
              livesPositions[cameraPosition].x * cubeSize * (lives - index - 1);
            const z =
              livesPositions[cameraPosition].z * cubeSize * (lives - index - 1);

            return (
              <group key={index} position={[x, 0, z]}>
                {inactive && (
                  <group position={[0, -0.6, 0]}>
                    <BirdGround
                      groundRef={(e) => (groundRefs.current[index] = e)}
                      position={[0, -0.6, 0]}
                      args={[cubeSize * 0.3, 0.02, cubeSize * 0.3]}
                    />
                  </group>
                )}

                <InactiveBird
                  scale={inactive ? 0.14 : 0.2}
                  onAwake={(position) => handleAwake(index, position)}
                />
              </group>
            );
          })}
        </group>
      )}

      {activePosition && (
        <ActiveBird position={activePosition} onDie={handleDeath} />
      )}
    </>
  );
}
