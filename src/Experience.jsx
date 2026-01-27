import { OrbitControls } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import Lights from "./Lights.jsx";
import Pyramid from "./pyramid/Pyramid.jsx";
import Enemies from "./enemies/Enemies.jsx";
import useGame from "./stores/useGame.js";

export default function Experience() {
  const { phase } = useGame();

  return (
    <>
      <OrbitControls />

      {/* <Physics debug paused={phase === "pause"}> */}
      <Physics paused={phase === "pause"}>
        <Lights />
        <Pyramid />
        <Enemies />
      </Physics>
    </>
  );
}
