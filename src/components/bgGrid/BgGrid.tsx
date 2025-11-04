import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import "./bgGrid.css";

const FOG_COLOR = 0x000000;
const FOG_NEAR = 20;
const FOG_FAR = 100;
const CAMERA_FOV = 75;
const CAMERA_NEAR = 0.1;
const CAMERA_FAR = 500;
const CAMERA_INITIAL_Z = 10;

const GRID_SIZE = 500;
const GRID_DIVISIONS = 250;
const GRID_COLOR = 0x800080;
const GRID_OPACITY = 1;

const ROTATION_SPEED_FACTOR = 0.15;
const MAX_ROTATION_ANGLE = Math.PI * (65 / 180);

const Grid: React.FC = () => {
  const mountRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let clock: THREE.Clock;
    let gridGroup: THREE.Group;
    let animationFrameId: number;

    const init = () => {
      if (!mountRef.current) return;

      // Scene
      scene = new THREE.Scene();
      scene.fog = new THREE.Fog(FOG_COLOR, FOG_NEAR, FOG_FAR);

      // Camera
      camera = new THREE.PerspectiveCamera(
        CAMERA_FOV,
        window.innerWidth / window.innerHeight,
        CAMERA_NEAR,
        CAMERA_FAR
      );
      camera.position.z = CAMERA_INITIAL_Z;

      // Renderer
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas: mountRef.current,
        // Preserve drawing buffer can help on some devices
        preserveDrawingBuffer: false,
        powerPreference: "high-performance",
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for performance
      renderer.setSize(window.innerWidth, window.innerHeight);

      // Grid
      const gridHelper = new THREE.GridHelper(
        GRID_SIZE,
        GRID_DIVISIONS,
        GRID_COLOR,
        GRID_COLOR
      );
      (gridHelper.material as THREE.Material).opacity = GRID_OPACITY;
      (gridHelper.material as THREE.Material).transparent = true;
      gridHelper.rotation.x = Math.PI / 2;

      gridGroup = new THREE.Group();
      gridGroup.add(gridHelper);
      scene.add(gridGroup);

      // Clock
      clock = new THREE.Clock();

      // Resize handler
      window.addEventListener("resize", onWindowResize, false);

      // Prevent touch events from interfering
      preventTouchInterference();
    };

    const preventTouchInterference = () => {
      if (!mountRef.current) return;

      const preventDefault = (e: Event) => {
        e.preventDefault();
      };

      // Prevent various touch interactions
      const events = [
        "touchstart",
        "touchmove",
        "touchend",
        "touchcancel",
        "gesturestart",
        "gesturechange",
        "gestureend",
      ];

      events.forEach((event) => {
        mountRef.current?.addEventListener(event, preventDefault, {
          passive: false,
        });
      });
    };

    const onWindowResize = () => {
      if (!camera || !renderer) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    const animate = () => {
      if (!renderer || !scene || !camera || !clock || !gridGroup) return;

      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();
      const currentAngle =
        MAX_ROTATION_ANGLE * Math.sin(elapsedTime * ROTATION_SPEED_FACTOR);
      gridGroup.rotation.y = currentAngle;

      renderer.render(scene, camera);
    };

    init();
    animate();

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (renderer) {
        renderer.dispose();
        // Clean up geometries and materials
        scene.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            object.geometry.dispose();
            if (object.material instanceof THREE.Material) {
              object.material.dispose();
            } else if (Array.isArray(object.material)) {
              object.material.forEach((material) => material.dispose());
            }
          }
        });
      }
      window.removeEventListener("resize", onWindowResize);
    };
  }, []);

  return <canvas id="bg" ref={mountRef} />;
};

export default Grid;
