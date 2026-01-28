import { useEffect, useState, useRef } from "react";
import EnemyEgg from "./EnemyEgg";
import useGame from "../stores/useGame";

export default function Enemies() {
  const [enemyEggs, setEnemyEggs] = useState([]);
  const { phase } = useGame();
  const intervalRef = useRef();

  useEffect(() => {
    if (phase === "playing") {
      intervalRef.current = setInterval(() => {
        setEnemyEggs((prev) => [...prev, { active: true }]);
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
        return <EnemyEgg key={index} active={egg.active} scale={0.8} />;
      })}
    </>
  );
}
