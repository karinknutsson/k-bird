import { RigidBody, CapsuleCollider } from "@react-three/rapier";
import * as THREE from "three";
import { useRef, useEffect } from "react";
import { useMemo } from "react";
import useGame from "../stores/useGame";

/**
 * Material
 */
const eggMaterial = new THREE.MeshStandardMaterial({ color: "#fc5454" });

export default function EnemyEgg({ active, scale = 1 }) {
  const enemyEggRef = useRef();
  const intervalRef = useRef();

  const { cameraPosition } = useGame();

  /**
   * Jump functionality
   */
  const downwardMovement = 0.38462;

  // Movement directions
  const movement = useMemo(() => {
    switch (cameraPosition) {
      case 0:
        return {
          downLeft: { x: 0, z: downwardMovement },
          downRight: { x: downwardMovement, z: 0 },
        };
      case 1:
        return {
          downLeft: { x: -downwardMovement, z: 0 },
          downRight: { x: 0, z: downwardMovement },
        };
      case 2:
        return {
          downLeft: { x: 0, z: -downwardMovement },
          downRight: { x: -downwardMovement, z: 0 },
        };
      case 3:
        return {
          downLeft: { x: downwardMovement, z: 0 },
          downRight: { x: 0, z: -downwardMovement },
        };
    }
  }, [cameraPosition]);

  const movementRef = useRef(movement);
  movementRef.current = movement;

  // Jump down left
  const jumpDownLeft = () => {
    enemyEggRef.current.applyImpulse({
      x: movementRef.current.downLeft.x,
      y: 1.2,
      z: movementRef.current.downLeft.z,
    });
  };

  // Jump down right
  const jumpDownRight = () => {
    enemyEggRef.current.applyImpulse({
      x: movementRef.current.downRight.x,
      y: 1.2,
      z: movementRef.current.downRight.z,
    });
  };

  useEffect(() => {
    if (active) {
      intervalRef.current = setInterval(() => {
        const random = Math.random();
        if (random < 0.5) {
          jumpDownLeft();
        } else {
          jumpDownRight();
        }
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [active]);

  return (
    <>
      {active && (
        <RigidBody
          ref={enemyEggRef}
          type="dynamic"
          canSleep={false}
          colliders={false}
          angularDamping={4}
          enabledRotations={[false, true, false]}
          restitution={0}
          friction={2}
          position={[0, 4, 0]}
          scale={scale}
          userData={{ type: "enemyEgg" }}
        >
          <CapsuleCollider args={[0.04, 0.16]} mass={0.5} />
          <mesh
            position={[0, -0.06, 0]}
            rotation={[Math.PI * 0.5, 0, 0]}
            material={eggMaterial}
          >
            <torusGeometry args={[0.05, 0.2, 32, 100]} />
          </mesh>
        </RigidBody>
      )}
    </>
  );
}
