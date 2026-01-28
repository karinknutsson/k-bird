import { Physics } from "@react-three/rapier";
import { useEffect } from "react";
import Lights from "./Lights.jsx";
import Pyramid from "./pyramid/Pyramid.jsx";
import Enemies from "./enemies/Enemies.jsx";
import useGame from "./stores/useGame.js";
import gsap from "gsap";

export default function Experience() {
  const { phase, cubeCount, cubeHits, pause } = useGame();

  useEffect(() => {
    if (phase === "playing" && cubeHits >= cubeCount) {
      setTimeout(() => {
        pause();

        gsap.to(".game-won-container", {
          opacity: 1,
          duration: 0.5,
        });
      }, 300);
    }
  }, [cubeHits]);

  return (
    <>
      {/* <Physics debug paused={phase === "pause"}> */}
      <Physics paused={phase === "pause"}>
        <Lights />
        <Pyramid />
        <Enemies />
      </Physics>
    </>
  );
}
