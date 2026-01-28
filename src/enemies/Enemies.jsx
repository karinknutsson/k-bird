import { useEffect, useState, useRef } from "react";
import EnemyEgg from "./EnemyEgg";
import useGame from "../stores/useGame";

export default function Enemies() {
  const [enemyEggs, setEnemyEggs] = useState([]);
  const { phase, cameraPosition } = useGame();
  const intervalRef = useRef();
  const cameraPositionRef = useRef(cameraPosition);

  useEffect(() => {
    cameraPositionRef.current = cameraPosition;
  }, [cameraPosition]);

  useEffect(() => {
    if (phase === "playing") {
      intervalRef.current = setInterval(() => {
        setEnemyEggs((prev) => [
          ...prev,
          { active: true, cameraPosition: cameraPositionRef.current },
        ]);
      }, 3000);
    } else if (phase === "ready" || phase === "end") {
      setEnemyEggs((prev) => prev.map((egg) => ({ ...egg, active: false })));
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [phase]);

  return (
    <>
      {enemyEggs.map((egg, index) => {
        return (
          <EnemyEgg
            key={index}
            active={egg.active}
            cameraPosition={egg.cameraPosition}
            scale={0.8}
          />
        );
      })}
    </>
  );
}
