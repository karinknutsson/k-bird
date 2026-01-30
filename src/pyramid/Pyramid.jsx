import { useEffect, useState } from "react";
import Cube from "./Cube";
import useGame from "../stores/useGame";
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

export default function Pyramid() {
  const { setCubeCount, ready, end, layerCount, currentLevel, livesCount } =
    useGame();

  const [lives, setLives] = useState(livesCount);
  const [activeIndex, setActiveIndex] = useState(lives - 1);
  const [showBird, setShowBird] = useState(true);

  function handleDeath() {
    setLives((prev) => prev - 1);
    setShowBird(false);

    if (activeIndex === 0) {
      end();
      gsap.to(".game-over-container", { opacity: 1, duration: 0.5 });
    } else {
      ready();
      setActiveIndex((prev) => prev - 1);
      setShowBird(true);
    }
  }

  useEffect(() => {
    const extralivesContainer = document.querySelector(".extralives-container");
    extralivesContainer.innerHTML = "";

    for (let i = 0; i < lives - 1; i++) {
      const lifeDiv = document.createElement("div");
      lifeDiv.className = "extralife-wrapper";
      lifeDiv.innerHTML = `<img src="./jbirdicon.png" class="extralife-image" />`;
      extralivesContainer.appendChild(lifeDiv);
    }
  }, [lives]);

  useEffect(() => {
    const totalCubes = 2 * Math.pow(layerCount, 2) - 2 * layerCount + 1;
    setCubeCount(totalCubes);
  }, [layerCount]);

  return (
    <>
      <group position={[0, layerCount * cubeSize * 0.5, 0]}>
        {[...Array(layerCount)].map((_, index) => {
          return (
            <CubeLevel
              key={`level-${currentLevel}-index-${index}`}
              level={index}
            />
          );
        })}
      </group>

      {showBird && <ActiveBird onDie={handleDeath} />}
    </>
  );
}
