import useGame from "./stores/useGame";
import BirdMesh from "./bird/BirdMesh";

export default function Interface() {
  const { cameraPosition, extraLives, extraLivesPositions } = useGame();

  return (
    <>
      <group position={[0, 3, 0]}>
        {[...Array(extraLives)].map((life, index) => {
          return (
            <BirdMesh
              key={index}
              position={[
                extraLivesPositions[cameraPosition].x * index * 0.4,
                0,
                extraLivesPositions[cameraPosition].z * index * 0.4,
              ]}
              scale={0.14}
            />
          );
        })}
      </group>
    </>
  );
}
