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
        { name: "upLeft", keys: ["Numpad7", "KeyW"] },
        { name: "upRight", keys: ["Numpad9", "KeyR"] },
        { name: "downLeft", keys: ["Numpad1", "KeyX"] },
        { name: "downRight", keys: ["Numpad3", "KeyV"] },
      ]}
    >
      <Canvas
        camera={{
          fov: 45,
          near: 0.1,
          far: 200,
          // Side view
          position: [5, 6, 5],
          // Top view
          // position: [0, 8, 0],
        }}
      >
        {/* <Canvas> */}
        <CameraController />
        <Experience />
      </Canvas>
    </KeyboardControls>
  </>
);
