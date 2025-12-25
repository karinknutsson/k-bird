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
       * Pyramid
       */
      pyramidRef: null,

      setPyramidRef: (ref) => set({ pyramidRef: ref }),

      isSpinning: false,
      anchorB: null,

      startSpin: (anchorB) => set({ spinning: true, anchorB }),
      stopSpin: () => set({ spinning: false, anchorB: null }),

      torqueDirection: null,

      setTorqueDirection: (direction) =>
        set((state) => {
          return {
            torqueDirection: direction,
          };
        }),

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
