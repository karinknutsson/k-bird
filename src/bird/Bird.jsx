import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useMemo } from "react";
import useGame from "../stores/useGame";
import BirdMesh from "./BirdMesh";

export default function Bird({ id, position, scale, onAwake, onDie, active }) {
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
  // Movement directions
  const movement = useMemo(() => {
    switch (cameraPosition) {
      case 0:
        return {
          upLeft: { x: -0.29, z: 0 },
          upRight: { x: 0, z: -0.29 },
          downLeft: { x: 0, z: 0.39 },
          downRight: { x: 0.39, z: 0 },
        };
      case 1:
        return {
          upLeft: { x: 0, z: -0.29 },
          upRight: { x: 0.29, z: 0 },
          downLeft: { x: -0.39, z: 0 },
          downRight: { x: 0, z: 0.39 },
        };
      case 2:
        return {
          upLeft: { x: 0.29, z: 0 },
          upRight: { x: 0, z: 0.29 },
          downLeft: { x: 0, z: -0.39 },
          downRight: { x: -0.39, z: 0 },
        };
      case 3:
        return {
          upLeft: { x: 0, z: 0.29 },
          upRight: { x: -0.29, z: 0 },
          downLeft: { x: 0.39, z: 0 },
          downRight: { x: 0, z: -0.39 },
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
        x: movementRef.current.upLeft.x * 1.4,
        y: 1.2,
        z: movementRef.current.upLeft.z * 1.4,
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
      birdRef.current.applyTorqueImpulse({ x: 0, y: -0.0064, z: 0 });
    } else if (birdDirection.current === "downRight") {
      birdRef.current.applyTorqueImpulse({ x: 0, y: -0.012, z: 0 });
    } else if (birdDirection.current === "upRight") {
      birdRef.current.applyTorqueImpulse({ x: 0, y: 0.0064, z: 0 });
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
        x: movementRef.current.upRight.x * 1.4,
        y: 1.2,
        z: movementRef.current.upRight.z * 1.4,
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
      birdRef.current.applyTorqueImpulse({ x: 0, y: 0.012, z: 0 });
    } else if (birdDirection.current === "downRight") {
      birdRef.current.applyTorqueImpulse({ x: 0, y: 0.0064, z: 0 });
    } else if (birdDirection.current === "upLeft") {
      birdRef.current.applyTorqueImpulse({ x: 0, y: -0.0064, z: 0 });
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
    birdRef.current.applyImpulse({
      x: movementRef.current.downRight.x,
      y: 1.2,
      z: movementRef.current.downRight.z,
    });

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

  // Subscribe to jump keys
  useEffect(() => {
    if (id === 0) {
      setTimeout(onAwake, 1000);
    }
    111;
    if (!active) return;

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
  }, [active]);

  /**
   * Bird collision
   */
  const birdCollision = () => {
    const position = birdRef.current.translation();

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

  useFrame(() => {
    if (birdRef.current && birdRef.current.translation().y < -6) onDie();
  });

  return (
    <RigidBody
      ref={birdRef}
      colliders={false}
      canSleep={false}
      angularDamping={1}
      enabledRotations={[false, true, false]}
      friction={1}
      restitution={0}
      type="dynamic"
    >
      {/* Bird collider */}
      <CuboidCollider
        position={position}
        args={[0.1, 0.35, 0.1]}
        mass={0.5}
        onCollisionEnter={birdCollision}
      />

      {/* Bird mesh */}
      <BirdMesh position={position} scale={scale} />
    </RigidBody>
  );
}
