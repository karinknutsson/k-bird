import { CuboidCollider, RigidBody } from "@react-three/rapier";
import * as THREE from "three";
import { useKeyboardControls } from "@react-three/drei";
import { useEffect, useRef } from "react";
import useGame from "../stores/useGame";

/**
 * Geometry
 */
const sphereGeometry = new THREE.IcosahedronGeometry(1, 30);
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const coneGeometry = new THREE.ConeGeometry(1, 1, 4, 1);

const topFeatherGeometry = new THREE.BoxGeometry(0.2, 0.8, 1);
const topFeatherMatrix = new THREE.Matrix4();
topFeatherMatrix.makeShear(0, 0, 0, 0, 0, -0.8);
topFeatherGeometry.applyMatrix4(topFeatherMatrix);

const bottomFeatherGeometry = new THREE.BoxGeometry(0.2, 0.3, 1);
const bottomFeatherMatrix = new THREE.Matrix4();
bottomFeatherMatrix.makeShear(0, 0, 0, 0, 0, -0.3);
bottomFeatherGeometry.applyMatrix4(bottomFeatherMatrix);

/**
 * Material
 */
const birdMaterial = new THREE.MeshStandardMaterial({ color: "#ffffff" });
const detailMaterial = new THREE.MeshStandardMaterial({ color: "#fc5454" });
const eyeMaterial = new THREE.MeshStandardMaterial({ color: "#000000" });

export default function Bird({ position }) {
  const birdRef = useRef();

  const birdDirection = useRef("downLeft");
  const [subscribeKeys, getKeys] = useKeyboardControls();
  let isJumping = false;

  const start = useGame((state) => state.start);
  const moveCamera = useGame((state) => state.moveCamera);

  /**
   * Jump functionality
   */
  // Lock / unlock jump
  const setIsJumping = (value, ms = 800) => {
    if (value) {
      isJumping = true;
    } else {
      setTimeout(() => {
        isJumping = false;
      }, ms);
    }
  };

  // Jump down left
  const jumpDownLeft = () => {
    setIsJumping(true);
    birdRef.current.applyImpulse({ x: 0, y: 1.2, z: 0.39 });

    if (birdDirection.current === "downRight") {
      birdRef.current.applyTorqueImpulse({ x: 0, y: -0.008, z: 0 });
    } else if (birdDirection.current === "upRight") {
      birdRef.current.applyTorqueImpulse({ x: 0, y: -0.016, z: 0 });
    } else if (birdDirection.current === "upLeft") {
      birdRef.current.applyTorqueImpulse({ x: 0, y: 0.008, z: 0 });
    }

    birdDirection.current = "downLeft";
    setIsJumping(false);
  };

  // Jump down right
  const jumpDownRight = () => {
    setIsJumping(true);
    birdRef.current.applyImpulse({ x: 0.39, y: 1.2, z: 0 });

    if (birdDirection.current === "downLeft") {
      birdRef.current.applyTorqueImpulse({ x: 0, y: 0.008, z: 0 });
    } else if (birdDirection.current === "upRight") {
      birdRef.current.applyTorqueImpulse({ x: 0, y: -0.008, z: 0 });
    } else if (birdDirection.current === "upLeft") {
      birdRef.current.applyTorqueImpulse({ x: 0, y: 0.016, z: 0 });
    }

    birdDirection.current = "downRight";
    setIsJumping(false);
  };

  // Jump up left
  const jumpUpLeft = () => {
    setIsJumping(true);
    const position = birdRef.current.translation();

    if (position.x > 0.1) {
      birdRef.current.applyImpulse({ x: -0.29, y: 2.4, z: 0 });
    } else {
      birdRef.current.applyImpulse({ x: -0.4, y: 1.2, z: 0 });
    }

    if (birdDirection.current === "downLeft") {
      birdRef.current.applyTorqueImpulse({ x: 0, y: -0.0064, z: 0 });
    } else if (birdDirection.current === "downRight") {
      birdRef.current.applyTorqueImpulse({ x: 0, y: -0.012, z: 0 });
    } else if (birdDirection.current === "upRight") {
      birdRef.current.applyTorqueImpulse({ x: 0, y: 0.0064, z: 0 });
    }

    birdDirection.current = "upLeft";
    setIsJumping(false, 1150);
  };

  // Jump up right
  const jumpUpRight = () => {
    setIsJumping(true);
    const position = birdRef.current.translation();

    if (position.z > 0.1) {
      birdRef.current.applyImpulse({ x: 0, y: 2.4, z: -0.29 });
    } else {
      birdRef.current.applyImpulse({ x: 0, y: 1.2, z: -0.4 });
    }

    if (birdDirection.current === "downLeft") {
      birdRef.current.applyTorqueImpulse({ x: 0, y: 0.012, z: 0 });
    } else if (birdDirection.current === "downRight") {
      birdRef.current.applyTorqueImpulse({ x: 0, y: 0.0064, z: 0 });
    } else if (birdDirection.current === "upLeft") {
      birdRef.current.applyTorqueImpulse({ x: 0, y: -0.0064, z: 0 });
    }

    birdDirection.current = "upRight";
    setIsJumping(false, 1150);
  };

  useEffect(() => {
    const unsubscribeAny = subscribeKeys(() => {
      start();
    });

    const unsubscribeJumpDownLeft = subscribeKeys(
      (state) => state.downLeft,
      (value) => {
        if (!isJumping && value) jumpDownLeft();
      }
    );

    const unsubscribeJumpDownRight = subscribeKeys(
      (state) => state.downRight,
      (value) => {
        if (!isJumping && value) jumpDownRight();
      }
    );

    const unsubscribeJumpUpRight = subscribeKeys(
      (state) => state.upRight,
      (value) => {
        if (!isJumping && value) jumpUpRight();
      }
    );

    const unsubscribeJumpUpLeft = subscribeKeys(
      (state) => state.upLeft,
      (value) => {
        if (!isJumping && value) jumpUpLeft();
      }
    );

    return () => {
      unsubscribeAny();
      unsubscribeJumpDownLeft();
      unsubscribeJumpDownRight();
      unsubscribeJumpUpRight();
      unsubscribeJumpUpLeft();
    };
  }, []);

  const birdCollision = () => {
    const position = birdRef.current.translation();
    console.log("x: " + position.x, ", z: " + position.z);

    if (position.x < -0.35) {
      moveCamera("counterClockwise");
    } else if (position.z < -0.35) {
      moveCamera("clockwise");
    }
  };

  return (
    <RigidBody ref={birdRef} colliders={false} canSleep={false}>
      {/* Collider */}
      <CuboidCollider
        position={position}
        args={[0.1, 0.35, 0.1]}
        mass={0.5}
        onCollisionEnter={birdCollision}
      />

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
