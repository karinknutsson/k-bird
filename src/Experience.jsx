import { OrbitControls } from "@react-three/drei";
import Lights from "./Lights.jsx";
import Pyramid from "./pyramid/Pyramid.jsx";

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
    </>
  );
}
