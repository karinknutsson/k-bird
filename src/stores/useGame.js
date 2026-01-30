import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import * as THREE from "three";

export default create(
  subscribeWithSelector((set) => {
    return {
      /**
       * Levels and layers
       */
      currentLevel: 1,
      layerCount: 1,
      enemyInterval: 6000,

      setEnemyInterval: (value) => {
        set((_) => {
          return {
            enemyInterval: value,
          };
        });
      },

      incrementCurrentLevel: () => {
        set((state) => {
          return {
            currentLevel: state.currentLevel + 1,
          };
        });
      },

      incrementLayerCount: () => {
        set((state) => {
          return {
            layerCount: state.layerCount + 1,
          };
        });
      },

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

      resetCubeHits: () => {
        set((_) => {
          return {
            cubeHits: 0,
          };
        });
      },

      /**
       * Score
       */

      score: 0,

      incrementScore: (value) => {
        set((state) => {
          return {
            score: state.score + value,
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
       * Light
       */
      lightPositions: [
        new THREE.Vector3(-4, 4, 1),
        new THREE.Vector3(-1, 4, -4),
        new THREE.Vector3(4, 4, -1),
        new THREE.Vector3(1, 4, 4),
      ],

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

      ready: () => {
        set((state) => {
          if (state.phase === "playing")
            return {
              phase: "ready",
            };

          return {};
        });
      },

      pause: () => {
        set(() => {
          return {
            phase: "pause",
          };
        });
      },

      unpause: () => {
        set(() => {
          return {
            phase: "ready",
          };
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
  }),
);
