import { CuboidCollider, RigidBody } from "@react-three/rapier";
import * as THREE from "three";
import { useKeyboardControls } from "@react-three/drei";
import { useEffect, useRef, useMemo } from "react";
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
  const [subscribeKeys] = useKeyboardControls();
  let isJumping = false;

  const start = useGame((state) => state.start);
  const cameraPosition = useGame((state) => state.cameraPosition);
  const moveCamera = useGame((state) => state.moveCamera);

  /**
   * Jump functionality
   */
  const downwardMovement = 0.38466;
  const upwardMovement = 0.28795;

  // Movement directions
  const movement = useMemo(() => {
    switch (cameraPosition) {
      case 0:
        return {
          upLeft: { x: -upwardMovement, z: 0 },
          upRight: { x: 0, z: -upwardMovement },
          downLeft: { x: 0, z: downwardMovement },
          downRight: { x: downwardMovement, z: 0 },
        };
      case 1:
        return {
          upLeft: { x: 0, z: -upwardMovement },
          upRight: { x: upwardMovement, z: 0 },
          downLeft: { x: -downwardMovement, z: 0 },
          downRight: { x: 0, z: downwardMovement },
        };
      case 2:
        return {
          upLeft: { x: upwardMovement, z: 0 },
          upRight: { x: 0, z: upwardMovement },
          downLeft: { x: 0, z: -downwardMovement },
          downRight: { x: -downwardMovement, z: 0 },
        };
      case 3:
        return {
          upLeft: { x: 0, z: upwardMovement },
          upRight: { x: -upwardMovement, z: 0 },
          downLeft: { x: downwardMovement, z: 0 },
          downRight: { x: 0, z: -downwardMovement },
        };
    }
  }, [cameraPosition]);

  const movementRef = useRef(movement);
  movementRef.current = movement;

  const cameraPositionRef = useRef(cameraPosition);
  cameraPositionRef.current = cameraPosition;

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

  // Jump up left
  const jumpUpLeft = () => {
    setIsJumping(true);
    const position = birdRef.current.translation();

    // Check if bird is on edge in current zone
    const birdOnEdge =
      (cameraPositionRef.current % 2 === 0 &&
        position.x < 0.3 &&
        position.x > -0.3) ||
      (cameraPositionRef.current % 2 === 1 &&
        position.z < 0.3 &&
        position.z > -0.3);

    // If bird is on edge cube, jump downward
    if (birdOnEdge) {
      birdRef.current.applyImpulse({
        x: -movementRef.current.downRight.x,
        y: 1.2,
        z: -movementRef.current.downRight.z,
      });
    } else {
      // On non-edge cubes, jump upward
      birdRef.current.applyImpulse({
        x: movementRef.current.upLeft.x,
        y: 2.4,
        z: movementRef.current.upLeft.z,
      });
    }

    if (birdDirection.current === "downLeft") {
      birdRef.current.applyTorqueImpulse({ x: 0, y: -0.01, z: 0 });
    } else if (birdDirection.current === "downRight") {
      birdRef.current.applyTorqueImpulse({ x: 0, y: -0.018, z: 0 });
    } else if (birdDirection.current === "upRight") {
      birdRef.current.applyTorqueImpulse({ x: 0, y: 0.009, z: 0 });
    }

    birdDirection.current = birdOnEdge ? "downLeft" : "upLeft";
    setIsJumping(false, 900);
  };

  // Jump up right
  const jumpUpRight = () => {
    setIsJumping(true);
    const position = birdRef.current.translation();

    // Check if bird is on edge in current zone
    const birdOnEdge =
      (cameraPositionRef.current % 2 === 1 &&
        position.x < 0.3 &&
        position.x > -0.3) ||
      (cameraPositionRef.current % 2 === 0 &&
        position.z < 0.3 &&
        position.z > -0.3);

    // If bird is on edge cube, jump downward
    if (birdOnEdge) {
      birdRef.current.applyImpulse({
        x: -movementRef.current.downLeft.x,
        y: 1.2,
        z: -movementRef.current.downLeft.z,
      });
    } else {
      // On non-edge cubes, jump upward
      birdRef.current.applyImpulse({
        x: movementRef.current.upRight.x,
        y: 2.4,
        z: movementRef.current.upRight.z,
      });
    }

    if (birdDirection.current === "downLeft") {
      birdRef.current.applyTorqueImpulse({ x: 0, y: 0.018, z: 0 });
    } else if (birdDirection.current === "downRight") {
      birdRef.current.applyTorqueImpulse({ x: 0, y: 0.009, z: 0 });
    } else if (birdDirection.current === "upLeft") {
      birdRef.current.applyTorqueImpulse({ x: 0, y: -0.009, z: 0 });
    }

    birdDirection.current = birdOnEdge ? "downRight" : "upRight";
    setIsJumping(false, 900);
  };

  // Jump down left
  const jumpDownLeft = () => {
    setIsJumping(true);
    birdRef.current.applyImpulse({
      x: movementRef.current.downLeft.x,
      y: 1.2,
      z: movementRef.current.downLeft.z,
    });

    if (birdDirection.current === "downRight") {
      birdRef.current.applyTorqueImpulse({ x: 0, y: -0.011, z: 0 });
    } else if (birdDirection.current === "upRight") {
      birdRef.current.applyTorqueImpulse({ x: 0, y: -0.022, z: 0 });
    } else if (birdDirection.current === "upLeft") {
      birdRef.current.applyTorqueImpulse({ x: 0, y: 0.011, z: 0 });
    }

    birdDirection.current = "downLeft";
    setIsJumping(false);
  };

  // Jump down right
  const jumpDownRight = () => {
    setIsJumping(true);
    birdRef.current.applyImpulse({
      x: movementRef.current.downRight.x,
      y: 1.2,
      z: movementRef.current.downRight.z,
    });

    if (birdDirection.current === "downLeft") {
      birdRef.current.applyTorqueImpulse({ x: 0, y: 0.011, z: 0 });
    } else if (birdDirection.current === "upRight") {
      birdRef.current.applyTorqueImpulse({ x: 0, y: -0.011, z: 0 });
    } else if (birdDirection.current === "upLeft") {
      birdRef.current.applyTorqueImpulse({ x: 0, y: 0.022, z: 0 });
    }

    birdDirection.current = "downRight";
    setIsJumping(false);
  };

  // Subscribe to jump keys
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

  /**
   * Bird collision
   */
  const birdCollision = () => {
    const position = birdRef.current.translation();
    console.log("bird x: " + position.x + ", bird z: " + position.z);

    switch (cameraPosition) {
      case 0:
        if (position.x < -0.3) {
          moveCamera("clockwise");
        } else if (position.z < -0.3) {
          moveCamera("counterClockwise");
        }
        break;
      case 1:
        if (position.x > 0.3) {
          moveCamera("counterClockwise");
        } else if (position.z < -0.3) {
          moveCamera("clockwise");
        }
        break;
      case 2:
        if (position.x > 0.3) {
          moveCamera("clockwise");
        } else if (position.z > 0.3) {
          moveCamera("counterClockwise");
        }
        break;
      case 3:
        if (position.x < -0.3) {
          moveCamera("counterClockwise");
        } else if (position.z > 0.3) {
          moveCamera("clockwise");
        }
        break;
    }
  };

  return (
    <RigidBody
      ref={birdRef}
      colliders={false}
      canSleep={false}
      angularDamping={1}
      enabledRotations={[false, true, false]}
      friction={1}
      restitution={0}
    >
      {/* Bird collider */}
      <CuboidCollider
        position={position}
        args={[0.1, 0.35, 0.1]}
        mass={0.5}
        onCollisionEnter={birdCollision}
      />

      <group position={position} scale={0.2}>
        {/* Bird body */}
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
