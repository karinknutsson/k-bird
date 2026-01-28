import { useEffect, useState } from "react";
import EnemyEgg from "./EnemyEgg";
import useGame from "../stores/useGame";
import { addEffect } from "@react-three/fiber";

export default function Enemies() {
  const [showEgg, setShowEgg] = useState(false);
  const { phase } = useGame();

  useEffect(() => {
    if (phase === "playing") {
      setTimeout(() => {
        setShowEgg(true);
      }, 3000);
    } else if (phase === "ready" || phase === "end") {
      setShowEgg(false);
    }
  }, [phase]);

  return (
    <>
      <EnemyEgg active={showEgg} scale={0.8} />
    </>
  );
}
