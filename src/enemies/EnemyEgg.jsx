import {
  RigidBody,
  CuboidCollider,
  CapsuleCollider,
} from "@react-three/rapier";
import * as THREE from "three";

/**
 * Material
 */
const eggMaterial = new THREE.MeshStandardMaterial({ color: "#fc5454" });

export default function EnemyEgg({ active, scale = 1 }) {
  return (
    <>
      {active && (
        <RigidBody
          type="dynamic"
          colliders={false}
          restitution={0}
          friction={2}
          position={[0, 4, 0]}
          scale={scale}
        >
          <CapsuleCollider args={[0.04, 0.16]} />
          <mesh
            position={[0, -0.06, 0]}
            rotation={[Math.PI * 0.5, 0, 0]}
            material={eggMaterial}
          >
            <torusGeometry args={[0.05, 0.2, 32, 100]} />
          </mesh>
          {/* <mesh position={[0, 0, 0]} material={eggMaterial}>
            <octahedronGeometry args={[0.2, 60]} />
          </mesh> */}
        </RigidBody>
      )}
    </>
  );
}
