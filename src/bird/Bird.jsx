import { ConeCollider, RigidBody } from "@react-three/rapier";
import * as THREE from "three";
import { useKeyboardControls } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";

const sphereGeometry = new THREE.IcosahedronGeometry(1, 30);
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const coneGeometry = new THREE.ConeGeometry(1, 1, 4, 1);
const birdMaterial = new THREE.MeshStandardMaterial({ color: "#ffffff" });
const detailMaterial = new THREE.MeshStandardMaterial({ color: "#fc5454" });
const eyeMaterial = new THREE.MeshStandardMaterial({ color: "#000000" });

const topFeatherGeometry = new THREE.BoxGeometry(0.2, 0.8, 1);
const topFeatherMatrix = new THREE.Matrix4();
topFeatherMatrix.makeShear(0, 0, 0, 0, 0, -0.8);
topFeatherGeometry.applyMatrix4(topFeatherMatrix);

const bottomFeatherGeometry = new THREE.BoxGeometry(0.2, 0.3, 1);
const bottomFeatherMatrix = new THREE.Matrix4();
bottomFeatherMatrix.makeShear(0, 0, 0, 0, 0, -0.3);
bottomFeatherGeometry.applyMatrix4(bottomFeatherMatrix);

export default function Bird({ position }) {
  const bird = useRef();
  const birdDirection = useRef("downLeft");
  const [subscribeKeys, getKeys] = useKeyboardControls();

  /**
   * Jump functionality
   */
  const jumpDownLeft = () => {
    console.log("current: " + birdDirection.current);
    console.log("jump down left");
    bird.current.applyImpulse({ x: 0, y: 0.6, z: 0.135 });

    if (birdDirection.current === "downRight") {
      bird.current.applyTorqueImpulse({ x: 0, y: -0.004, z: 0 });
    } else if (birdDirection.current === "upRight") {
      bird.current.applyTorqueImpulse({ x: 0, y: -0.007, z: 0 });
    } else if (birdDirection.current === "upLeft") {
      1;
      bird.current.applyTorqueImpulse({ x: 0, y: 0.004, z: 0 });
    }

    birdDirection.current = "downLeft";
  };

  const jumpDownRight = () => {
    console.log("current: " + birdDirection.current);
    console.log("jump down right");
    bird.current.applyImpulse({ x: 0.135, y: 0.6, z: 0 });

    if (birdDirection.current === "downLeft") {
      bird.current.applyTorqueImpulse({ x: 0, y: 0.0035, z: 0 });
    } else if (birdDirection.current === "upRight") {
      bird.current.applyTorqueImpulse({ x: 0, y: -0.004, z: 0 });
    } else if (birdDirection.current === "upLeft") {
      bird.current.applyTorqueImpulse({ x: 0, y: 0.0082, z: 0 });
    }

    birdDirection.current = "downRight";
  };

  const jumpUpLeft = () => {
    console.log("current: " + birdDirection.current);
    console.log("jump up left");
    bird.current.applyImpulse({ x: -0.125, y: 0.9, z: 0 });

    if (birdDirection.current === "downLeft") {
      bird.current.applyTorqueImpulse({ x: 0, y: -0.0035, z: 0 });
    } else if (birdDirection.current === "downRight") {
      bird.current.applyTorqueImpulse({ x: 0, y: -0.0069, z: 0 });
    } else if (birdDirection.current === "upRight") {
      bird.current.applyTorqueImpulse({ x: 0, y: 0.003, z: 0 });
    }

    birdDirection.current = "upLeft";
  };

  const jumpUpRight = () => {
    console.log("current: " + birdDirection.current);
    console.log("jump up right");
    bird.current.applyImpulse({ x: 0, y: 0.9, z: -0.125 });

    if (birdDirection.current === "downLeft") {
      bird.current.applyTorqueImpulse({ x: 0, y: 0.0069, z: 0 });
    } else if (birdDirection.current === "downRight") {
      bird.current.applyTorqueImpulse({ x: 0, y: 0.0035, z: 0 });
    } else if (birdDirection.current === "upLeft") {
      bird.current.applyTorqueImpulse({ x: 0, y: 0.003, z: 0 });
    }

    birdDirection.current = "upRight";
  };

  useEffect(() => {
    const unsubscribeJumpDownLeft = subscribeKeys(
      (state) => state.downLeft,
      (value) => {
        if (value) jumpDownLeft();
      }
    );

    const unsubscribeJumpDownRight = subscribeKeys(
      (state) => state.downRight,
      (value) => {
        if (value) jumpDownRight();
      }
    );

    const unsubscribeJumpUpRight = subscribeKeys(
      (state) => state.upRight,
      (value) => {
        if (value) jumpUpRight();
      }
    );

    const unsubscribeJumpUpLeft = subscribeKeys(
      (state) => state.upLeft,
      (value) => {
        if (value) jumpUpLeft();
      }
    );

    // return () => {
    //   unsubscribeJumpDownLeft();
    //   unsubscribeJumpDownRight();
    //   unsubscribeJumpUpRight();
    //   unsubscribeJumpUpLeft();
    // };
  }, []);

  return (
    <RigidBody ref={bird} colliders={false} canSleep={false}>
      {/* Collider */}
      <ConeCollider position={position} args={[0.36, 0.169]} mass={0.2} />

      <group position={position} scale={0.2}>
        {/* Body */}
        <mesh
          geometry={sphereGeometry}
          material={birdMaterial}
          scale={[1, 0.85, 0.85]}
        />

        {/* Eyes */}
        <group position={[0, 0.4, 0.78]}>
          <mesh
            geometry={sphereGeometry}
            material={eyeMaterial}
            position={[0.3, 0, 0]}
            scale={[0.11, 0.11, 0.11]}
          />
          <mesh
            geometry={sphereGeometry}
            material={eyeMaterial}
            position={[-0.3, 0, 0]}
            scale={[0.11, 0.11, 0.11]}
          />
        </group>

        {/* Beek */}
        <mesh
          geometry={coneGeometry}
          material={detailMaterial}
          position={[0, -0.3, 1.26]}
          scale={[0.4, 1.2, 0.4]}
          rotation={[Math.PI * 0.6, 0, 0]}
        />

        {/* Feathers */}
        <group position={[0, 0.1, -1]}>
          <mesh
            geometry={topFeatherGeometry}
            material={birdMaterial}
            position={[0, 0.3, 0]}
          />
          <mesh
            geometry={bottomFeatherGeometry}
            material={birdMaterial}
            position={[0, -0.2, 0]}
          />
        </group>

        {/* Left leg */}
        <group position={[0.4, 0.1, 0]}>
          <mesh
            geometry={boxGeometry}
            material={detailMaterial}
            position={[0, -1.3, 0]}
            scale={[0.1, 1, 0.1]}
          />
          <mesh
            geometry={boxGeometry}
            material={detailMaterial}
            position={[0.17, -1.8, 0.14]}
            scale={[0.1, 0.1, 0.4]}
            rotation={[0, Math.PI * 0.25, 0]}
          />
          <mesh
            geometry={boxGeometry}
            material={detailMaterial}
            position={[0, -1.8, 0.15]}
            scale={[0.1, 0.1, 0.4]}
            rotation={[0, 0, 0]}
          />
          <mesh
            geometry={boxGeometry}
            material={detailMaterial}
            position={[-0.17, -1.8, 0.14]}
            scale={[0.1, 0.1, 0.4]}
            rotation={[0, -Math.PI * 0.25, 0]}
          />
        </group>

        {/* Right leg */}
        <group position={[-0.4, 0.1, 0]}>
          <mesh
            geometry={boxGeometry}
            material={detailMaterial}
            position={[0, -1.3, 0]}
            scale={[0.1, 1, 0.1]}
          />
          <mesh
            geometry={boxGeometry}
            material={detailMaterial}
            position={[0.17, -1.8, 0.14]}
            scale={[0.1, 0.1, 0.4]}
            rotation={[0, Math.PI * 0.25, 0]}
          />
          <mesh
            geometry={boxGeometry}
            material={detailMaterial}
            position={[0, -1.8, 0.15]}
            scale={[0.1, 0.1, 0.4]}
            rotation={[0, 0, 0]}
          />
          <mesh
            geometry={boxGeometry}
            material={detailMaterial}
            position={[-0.17, -1.8, 0.14]}
            scale={[0.1, 0.1, 0.4]}
            rotation={[0, -Math.PI * 0.25, 0]}
          />
        </group>
      </group>
    </RigidBody>
  );
}
