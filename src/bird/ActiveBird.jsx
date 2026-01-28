import { CapsuleCollider, RigidBody } from "@react-three/rapier";
import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useMemo } from "react";
import useGame from "../stores/useGame";
import BirdMesh from "./BirdMesh";

export default function ActiveBird({ onDie }) {
  const birdRef = useRef();

  const birdDirection = useRef("downLeft");
  const [subscribeKeys] = useKeyboardControls();
  let isJumping = true;

  const start = useGame((state) => state.start);
  const pause = useGame((state) => state.pause);
  const unpause = useGame((state) => state.unpause);
  const cameraPosition = useGame((state) => state.cameraPosition);
  const moveCamera = useGame((state) => state.moveCamera);

  /**
   * Jump functionality
   */
  const downwardMovement = 0.38462;
  const upwardMovement = 0.28799;

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

  const quarterTurn = 0.035;

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
      birdRef.current.applyTorqueImpulse({ x: 0, y: -quarterTurn, z: 0 });
    } else if (birdDirection.current === "downRight") {
      birdRef.current.applyTorqueImpulse({ x: 0, y: -2 * quarterTurn, z: 0 });
    } else if (birdDirection.current === "upRight") {
      birdRef.current.applyTorqueImpulse({ x: 0, y: quarterTurn, z: 0 });
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
      birdRef.current.applyTorqueImpulse({ x: 0, y: 2 * quarterTurn, z: 0 });
    } else if (birdDirection.current === "downRight") {
      birdRef.current.applyTorqueImpulse({ x: 0, y: quarterTurn, z: 0 });
    } else if (birdDirection.current === "upLeft") {
      birdRef.current.applyTorqueImpulse({ x: 0, y: -quarterTurn, z: 0 });
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
      birdRef.current.applyTorqueImpulse({ x: 0, y: -quarterTurn, z: 0 });
    } else if (birdDirection.current === "upRight") {
      birdRef.current.applyTorqueImpulse({ x: 0, y: -2 * quarterTurn, z: 0 });
    } else if (birdDirection.current === "upLeft") {
      birdRef.current.applyTorqueImpulse({ x: 0, y: quarterTurn, z: 0 });
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
      birdRef.current.applyTorqueImpulse({ x: 0, y: quarterTurn, z: 0 });
    } else if (birdDirection.current === "upRight") {
      birdRef.current.applyTorqueImpulse({ x: 0, y: -quarterTurn, z: 0 });
    } else if (birdDirection.current === "upLeft") {
      birdRef.current.applyTorqueImpulse({ x: 0, y: 2 * quarterTurn, z: 0 });
    }

    birdDirection.current = "downRight";
    setIsJumping(false);
  };

  // Subscribe to jump keys
  useEffect(() => {
    setIsJumping(false);

    const unsubscribeAny = subscribeKeys(() => {
      start();
    });

    const unsubscribeJumpDownLeft = subscribeKeys(
      (state) => state.downLeft,
      (value) => {
        if (!isJumping && value) jumpDownLeft();
      },
    );

    const unsubscribeJumpDownRight = subscribeKeys(
      (state) => state.downRight,
      (value) => {
        if (!isJumping && value) jumpDownRight();
      },
    );

    const unsubscribeJumpUpRight = subscribeKeys(
      (state) => state.upRight,
      (value) => {
        if (!isJumping && value) jumpUpRight();
      },
    );

    const unsubscribeJumpUpLeft = subscribeKeys(
      (state) => state.upLeft,
      (value) => {
        if (!isJumping && value) jumpUpLeft();
      },
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
  const birdCollision = (e) => {
    if (e.rigidBodyObject.name === "enemyEgg") {
      pause();

      setTimeout(() => {
        resetAndDie();
        unpause();
      }, 2000);
      return;
    }

    const position = birdRef.current.translation();

    birdRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
    birdRef.current.setTranslation(
      {
        x: Math.round(position.x * 10) / 10,
        y: position.y,
        z: Math.round(position.z * 10) / 10,
      },
      true,
    );

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

  function resetAndDie() {
    birdRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
    birdRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
    birdRef.current.setTranslation({ x: 0, y: 3, z: 0 }, true);
    onDie();
  }

  useFrame(() => {
    if (birdRef.current && birdRef.current.translation().y < -6) resetAndDie();
  });

  return (
    <RigidBody
      ref={birdRef}
      colliders={false}
      canSleep={false}
      position={[0, 3, 0]}
      angularDamping={4}
      enabledRotations={[false, true, false]}
      friction={2}
      restitution={0}
      type="dynamic"
      name="bird"
    >
      {/* Bird collider */}
      <CapsuleCollider
        args={[0.1, 0.16]}
        mass={0.5}
        onCollisionEnter={birdCollision}
        position={[0, -0.09, 0]}
      />

      {/* Bird mesh */}
      <BirdMesh scale={0.2} />
    </RigidBody>
  );
}
