import { OrbitControls } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import Lights from "./Lights.jsx";
import Pyramid from "./pyramid/Pyramid.jsx";
import Bird from "./bird/Bird.jsx";

export default function Experience() {
  return (
    <>
      <OrbitControls makeDefault />

      <Physics debug>
        {/* <Physics> */}
        <Lights />

        <mesh>
          <boxGeometry args={[0.1, 0.1, 0.1]} />
          <meshNormalMaterial />
        </mesh>

        <Pyramid />

        {/* <Bird position={[0.54, 0.85, 0.54]} rotation={[0, 0, 0]} /> */}
        <Bird position={[0, 2, 0]} />
      </Physics>
    </>
  );
}
