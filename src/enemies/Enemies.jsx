import { useEffect, useState } from "react";
import EnemyEgg from "./EnemyEgg";

export default function Enemies() {
  const [showEgg, setShowEgg] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      console.log("Spawn Enemy Egg");

      setShowEgg(true);
    }, 3000);
  }, []);

  return (
    <>
      <EnemyEgg active={showEgg} scale={0.8} />
    </>
  );
}
