import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import * as THREE from "three";

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
       * Camera
       */

      isCameraMoving: false,
      cameraPosition: 0,

      cameraPositions: [
        new THREE.Vector3(5, 6, 5),
        new THREE.Vector3(-5, 6, 5),
        new THREE.Vector3(-5, 6, -5),
        new THREE.Vector3(5, 6, -5),
      ],

      moveCamera: (direction) => {
        set((state) => {
          const nextPosition =
            direction === "clockwise"
              ? state.cameraPosition === 3
                ? 0
                : state.cameraPosition + 1
              : state.cameraPosition === 0
              ? 3
              : state.cameraPosition - 1;

          return {
            isCameraMoving: true,
            cameraPosition: nextPosition,
          };
        });
      },

      stopCamera: () => {
        set((_) => {
          return {
            isCameraMoving: false,
          };
        });
      },

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
