import { CapsuleCollider, RigidBody } from "@react-three/rapier";
import { useRef } from "react";
import BirdMesh from "./BirdMesh";

export default function InactiveBird({ position, scale, onAwake, bodyType }) {
  const birdRef = useRef();

  /**
   * Bird collision
   */
  const birdCollision = () => {
    const position = birdRef.current.translation();

    if (position.y < 3) onAwake(position);
  };

  return (
    <RigidBody
      ref={birdRef}
      colliders={false}
      canSleep={false}
      angularDamping={4}
      enabledRotations={[false, true, false]}
      friction={2}
      restitution={0}
      type={bodyType}
      position={position}
    >
      {/* Bird collider */}
      <CapsuleCollider
        args={[0.1, 0.14]}
        mass={0.5}
        onCollisionEnter={birdCollision}
      />

      {/* Bird mesh */}
      <BirdMesh scale={scale} />
    </RigidBody>
  );
}
