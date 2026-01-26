import { OrbitControls } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import Lights from "./Lights.jsx";
import Pyramid from "./pyramid/Pyramid.jsx";

export default function Experience() {
  return (
    <>
      <OrbitControls />

      <Physics debug numSolverIterations={8}>
        {/* <Physics> */}
        {/* <Interface /> */}
        <Lights />
        <Pyramid />
      </Physics>
    </>
  );
}
