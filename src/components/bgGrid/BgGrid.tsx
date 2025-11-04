import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import "./bgGrid.css";

const FOG_COLOR = 0x000000;
const CAMERA_FOV = 75;
const CAMERA_NEAR = 0.1;
const CAMERA_FAR = 500;
const CAMERA_INITIAL_Z = 10;

const GRID_BASE_SIZE = 500;
const GRID_BASE_DIVISIONS = 250;
const GRID_COLOR = 0x800080;
const GRID_OPACITY = 1;

const ROTATION_SPEED_FACTOR = 0.15;
const MAX_ROTATION_ANGLE = Math.PI * (65 / 180);

const Grid: React.FC = () => {
  const mountRef = useRef<HTMLCanvasElement | null>(null);
  const requestRef = useRef<number | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const gridGroupRef = useRef<THREE.Group | null>(null);
  const clockRef = useRef<THREE.Clock | null>(null);

  useEffect(() => {
    const init = () => {
      if (!mountRef.current) return;

      // Scene
      const scene = new THREE.Scene();
      scene.fog = new THREE.Fog(FOG_COLOR, 20, 100);
      sceneRef.current = scene;

      // Camera
      const camera = new THREE.PerspectiveCamera(
        CAMERA_FOV,
        window.innerWidth / window.innerHeight,
        CAMERA_NEAR,
        CAMERA_FAR
      );
      camera.position.z = CAMERA_INITIAL_Z;
      cameraRef.current = camera;

      // Renderer
      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas: mountRef.current,
        powerPreference: "high-performance",
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      rendererRef.current = renderer;

      // Grid
      const gridGroup = new THREE.Group();
      gridGroupRef.current = gridGroup;

      const scaleFactor = Math.min(window.innerWidth / 1440, 1);
      const gridSize = GRID_BASE_SIZE * scaleFactor;
      const gridDivisions = Math.max(
        Math.floor(GRID_BASE_DIVISIONS * scaleFactor),
        50
      );

      const gridHelper = new THREE.GridHelper(
        gridSize,
        gridDivisions,
        GRID_COLOR,
        GRID_COLOR
      );
      (gridHelper.material as THREE.Material).opacity = GRID_OPACITY;
      (gridHelper.material as THREE.Material).transparent = true;
      gridHelper.rotation.x = Math.PI / 2;
      gridGroup.add(gridHelper);

      scene.add(gridGroup);

      // Clock
      clockRef.current = new THREE.Clock();
    };

    const handleResize = () => {
      const camera = cameraRef.current;
      const renderer = rendererRef.current;
      const gridGroup = gridGroupRef.current;
      if (!camera || !renderer || !gridGroup) return;

      // Keep aspect ratio correct
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);

      // Only scale grid by width (ignore height)
      const scaleFactor = Math.min(window.innerWidth / 1440, 1);
      const newGridSize = GRID_BASE_SIZE * scaleFactor;

      gridGroup.children.forEach((child) => {
        if (child instanceof THREE.GridHelper) {
          child.scale.set(
            newGridSize / GRID_BASE_SIZE,
            1,
            newGridSize / GRID_BASE_SIZE
          );
        }
      });
    };

    const animate = () => {
      requestRef.current = requestAnimationFrame(animate);

      const renderer = rendererRef.current;
      const scene = sceneRef.current;
      const camera = cameraRef.current;
      const gridGroup = gridGroupRef.current;
      const clock = clockRef.current;

      if (!renderer || !scene || !camera || !gridGroup || !clock) return;

      const elapsed = clock.getElapsedTime();
      gridGroup.rotation.y =
        MAX_ROTATION_ANGLE * Math.sin(elapsed * ROTATION_SPEED_FACTOR);

      renderer.render(scene, camera);
    };

    init();
    animate();

    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("orientationchange", handleResize, {
      passive: true,
    });

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);

      if (rendererRef.current) {
        rendererRef.current.dispose();
        const canvas = rendererRef.current.domElement;
        if (canvas && canvas.parentNode) {
          canvas.parentNode.removeChild(canvas);
        }
      }

      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);

  return <canvas id="bg" ref={mountRef} />;
};

export default Grid;
