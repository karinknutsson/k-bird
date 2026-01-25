import { OrbitControls } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import Lights from "./Lights.jsx";
import Pyramid from "./pyramid/Pyramid.jsx";

export default function Experience() {
  return (
    <>
      <OrbitControls />

      <Physics debug>
        {/* <Physics> */}
        {/* <Interface /> */}
        <Lights />
        <Pyramid />
      </Physics>
    </>
  );
}
