import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export default create(
  subscribeWithSelector((set) => {
    return {
      /**
       * Cubes
       */
      cubeCount: 0,
      cubeHits: 0,

      setCubeCount: (count) => {
        set((_) => {
          return {
            cubeCount: count,
          };
        });
      },

      incrementCubeHits: () => {
        set((state) => {
          return {
            cubeHits: state.cubeHits + 1,
          };
        });
      },

      /**
       * Bird
       */
      birdRef: null,

      setBirdRef: (ref) => set({ birdRef: ref }),

      /**
       * Camera
       */
      isCameraMoving: false,

      torqueDirection: null,

      setTorqueDirection: (direction) =>
        set((_) => {
          return {
            torqueDirection: direction,
          };
        }),

      /**
       * Pyramid
       */

      // isSpinning: false,
      // anchorB: null,

      // startSpin: (anchorB) => set({ isSpinning: true, anchorB }),
      // stopSpin: () => set({ isSpinning: false, anchorB: null }),

      /**
       * Phases
       */
      phase: "ready",

      start: () => {
        set((state) => {
          if (state.phase === "ready")
            return {
              phase: "playing",
            };

          return {};
        });
      },

      restart: () => {
        set((state) => {
          if (state.phase === "playing" || state.phase === "ended")
            return {
              phase: "ready",
            };

          return {};
        });
      },

      end: () => {
        set((state) => {
          if (state.phase === "playing")
            return {
              phase: "ended",
            };

          return {};
        });
      },
    };
  })
);
