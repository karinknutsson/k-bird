import { OrbitControls } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import Lights from "./Lights.jsx";
import Pyramid from "./pyramid/Pyramid.jsx";
import Enemies from "./enemies/Enemies.jsx";

export default function Experience() {
  return (
    <>
      <OrbitControls />

      <Physics debug>
        {/* <Physics> */}
        <Lights />
        <Pyramid />
        <Enemies />
      </Physics>
    </>
  );
}
