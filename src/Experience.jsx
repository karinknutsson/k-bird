import { OrbitControls } from "@react-three/drei";
import Lights from "./Lights.jsx";
import Pyramid from "./pyramid/Pyramid.jsx";
import Bird from "./bird/Bird.jsx";

export default function Experience() {
  return (
    <>
      <OrbitControls makeDefault />

      <Lights />

      <mesh>
        <boxGeometry args={[0.1, 0.1, 0.1]} />
        <meshNormalMaterial />
      </mesh>

      <Pyramid />

      <Bird position={[0, 2, 0]} />
    </>
  );
}
