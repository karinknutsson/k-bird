import { RigidBody } from "@react-three/rapier";

export default function EnemyEgg() {
  return (
    <>
      <RigidBody type="dynamic" colliders="hull" restitution={0} friction={2}>
        <mesh>
          <octahedronGeometry args={[0.3, 60]} />
          <meshStandardMaterial color="red" />
        </mesh>
      </RigidBody>
    </>
  );
}
