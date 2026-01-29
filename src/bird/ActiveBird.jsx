import { CapsuleCollider, RigidBody } from "@react-three/rapier";
import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useMemo, use } from "react";
import useGame from "../stores/useGame";
import BirdMesh from "./BirdMesh";
import * as THREE from "three";

export default function ActiveBird({ onDie }) {
  const birdRef = useRef();

  const birdDirection = useRef("downLeft");
  const [subscribeKeys] = useKeyboardControls();
  const isJumpingRef = useRef(true);

  const { start, pause, unpause, cameraPosition, moveCamera, phase } =
    useGame();

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
  function setIsJumpingRef(value) {
    isJumpingRef.current = value;
  }

  const smallJump = 1.2;
  const bigJump = 2.4;
  const quarterTurn = 0.035;

  // Jump up left
  const jumpUpLeft = () => {
    setIsJumpingRef(true);
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
        y: smallJump,
        z: movementRef.current.upLeft.z * 1.4,
      });
    } else {
      // On non-edge cubes, jump upward
      birdRef.current.applyImpulse({
        x: movementRef.current.upLeft.x,
        y: bigJump,
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
  };

  // Jump up right
  const jumpUpRight = () => {
    setIsJumpingRef(true);
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
        y: smallJump,
        z: movementRef.current.upRight.z * 1.4,
      });
    } else {
      // On non-edge cubes, jump upward
      birdRef.current.applyImpulse({
        x: movementRef.current.upRight.x,
        y: bigJump,
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
  };

  // Jump down left
  const jumpDownLeft = () => {
    setIsJumpingRef(true);
    birdRef.current.applyImpulse({
      x: movementRef.current.downLeft.x,
      y: smallJump,
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
  };

  // Jump down right
  const jumpDownRight = () => {
    setIsJumpingRef(true);
    birdRef.current.applyImpulse({
      x: movementRef.current.downRight.x,
      y: smallJump,
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
  };

  const queuedJumpRef = useRef(null);

  // Queue jumps in case key is pressed before landing
  function queueJump(jump) {
    queuedJumpRef.current = jump;
  }

  useEffect(() => {
    if (!isJumpingRef.current) {
      switch (queuedJumpRef.current) {
        case "downLeft":
          jumpDownLeft();
          break;
        case "downRight":
          jumpDownRight();
          break;
        case "upRight":
          jumpUpRight();
          break;
        case "upLeft":
          jumpUpLeft();
          break;
      }

      queuedJumpRef.current = null;
    }
  }, [isJumpingRef.current]);

  // Subscribe to jump keys
  useEffect(() => {
    const unsubscribeAny = subscribeKeys(() => {
      start();
    });

    const unsubscribeJumpDownLeft = subscribeKeys(
      (state) => state.downLeft,
      (value) => {
        if (!value) return;

        if (isJumpingRef.current) {
          queueJump("downLeft");
        } else {
          jumpDownLeft();
        }
      },
    );

    const unsubscribeJumpDownRight = subscribeKeys(
      (state) => state.downRight,
      (value) => {
        if (!value) return;

        if (isJumpingRef.current) {
          queueJump("downRight");
        } else {
          jumpDownRight();
        }
      },
    );

    const unsubscribeJumpUpRight = subscribeKeys(
      (state) => state.upRight,
      (value) => {
        if (!value) return;

        if (isJumpingRef.current) {
          queueJump("upRight");
        } else {
          jumpUpRight();
        }
      },
    );

    const unsubscribeJumpUpLeft = subscribeKeys(
      (state) => state.upLeft,
      (value) => {
        if (!value) return;

        if (isJumpingRef.current) {
          queueJump("upLeft");
        } else {
          jumpUpLeft();
        }
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
    // Die on enemy egg collision
    if (e.rigidBodyObject.name === "enemyEgg") {
      pause();

      setTimeout(() => {
        onDie();
        unpause();
      }, 2000);
      return;
    }

    // Landing time
    setTimeout(() => {
      setIsJumpingRef(false);
    }, 100);

    // Adjust position to be centered on cube
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

    // Adjust camera position if jumping over edge
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

  function resetBird() {
    birdRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
    birdRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
    birdRef.current.setTranslation({ x: 0, y: 3, z: 0 }, true);

    let rotationY = 0;

    switch (cameraPosition) {
      case 0:
        rotationY = 0;
        break;
      case 1:
        rotationY = -Math.PI * 0.5;
        break;
      case 2:
        rotationY = Math.PI;
        break;
      case 3:
        rotationY = Math.PI * 0.5;
        break;
    }

    const quaternion = new THREE.Quaternion();
    quaternion.setFromEuler(new THREE.Euler(0, rotationY, 0));
    birdRef.current.setRotation(quaternion, true);
    birdDirection.current = "downLeft";
  }

  useEffect(() => {
    if (phase === "ready") {
      resetBird();
    }
  }, [phase]);

  useFrame(() => {
    if (birdRef.current && birdRef.current.translation().y < -6) onDie();
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
