import "./style.css";
import ReactDOM from "react-dom/client";
import { Canvas } from "@react-three/fiber";
import Experience from "./Experience.jsx";
import { KeyboardControls } from "@react-three/drei";
import CameraController from "./CameraController.jsx";

const root = ReactDOM.createRoot(document.querySelector("#root"));

root.render(
  <>
    <KeyboardControls
      map={[
        { name: "upLeft", keys: ["Numpad7", "KeyQ"] },
        { name: "upRight", keys: ["Numpad9", "KeyE"] },
        { name: "downLeft", keys: ["Numpad1", "KeyZ"] },
        { name: "downRight", keys: ["Numpad3", "KeyC"] },
      ]}
    >
      <Canvas
        camera={{
          fov: 45,
          near: 0.1,
          far: 200,
          position: [5, 6, 5],
        }}
      >
        <CameraController />
        <Experience />
      </Canvas>
    </KeyboardControls>
  </>,
);
