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
        <Lights />

        <mesh>
          <boxGeometry args={[0.1, 0.1, 0.1]} />
          <meshNormalMaterial />
        </mesh>

        <Pyramid />

        <Bird position={[0.5, 0.85, 0.56]} rotation={[0, Math.PI * 0.1, 0]} />
        {/* <Bird position={[1, 0.35, 0.62]} rotation={[0, Math.PI, 0]} /> */}
      </Physics>
    </>
  );
}
