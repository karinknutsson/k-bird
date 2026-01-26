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

      /**
       * Lives
       */
      lives: 3,

      livesPositions: [
        new THREE.Vector3(-1, 0, 1),
        new THREE.Vector3(-1, 0, -1),
        new THREE.Vector3(1, 0, -1),
        new THREE.Vector3(1, 0, 1),
      ],

      decrementLives: () => {
        set((state) => {
          return {
            extraLives: state.lives - 1,
          };
        });
      },
    };
  }),
);
