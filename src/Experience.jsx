import { Physics } from "@react-three/rapier";
import { use, useEffect } from "react";
import Lights from "./Lights.jsx";
import Pyramid from "./pyramid/Pyramid.jsx";
import Enemies from "./enemies/Enemies.jsx";
import useGame from "./stores/useGame.js";
import gsap from "gsap";

export default function Experience() {
  const {
    phase,
    cubeCount,
    cubeHits,
    pause,
    unpause,
    ready,
    score,
    currentLevel,
    layerCount,
    incrementCurrentLevel,
    incrementLayerCount,
    resetCubeHits,
    incrementScore,
    enemyInterval,
    setEnemyInterval,
  } = useGame();

  useEffect(() => {
    const scoreValue = document.querySelector(".score-value");
    if (scoreValue) scoreValue.textContent = score;
  }, [score]);

  useEffect(() => {
    const levelValue = document.querySelector(".level-value");
    if (levelValue) levelValue.textContent = currentLevel;
  }, [currentLevel]);

  useEffect(() => {
    if (phase === "playing" && cubeHits >= cubeCount) {
      setTimeout(() => {
        pause();
        incrementScore(200 * currentLevel);

        gsap.to(".level-won-container", {
          opacity: 1,
          duration: 0.5,
        });
      }, 300);

      setTimeout(() => {
        resetCubeHits();
        incrementCurrentLevel();
        setEnemyInterval(enemyInterval * 0.9);

        if (layerCount < 6) incrementLayerCount();

        ready();
        unpause();

        gsap.to(".level-won-container", {
          opacity: 0,
          duration: 0.5,
        });
      }, 3300);
    }
  }, [cubeHits]);

  return (
    <>
      {/* <Physics debug paused={phase === "pause"}> */}
      <Physics paused={phase === "pause"}>
        <Lights />
        <Pyramid />
        {layerCount > 2 && <Enemies />}
      </Physics>
    </>
  );
}
