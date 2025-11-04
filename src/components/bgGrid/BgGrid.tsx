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
    if (!mountRef.current) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(FOG_COLOR, FOG_NEAR, FOG_FAR);

    const camera = new THREE.PerspectiveCamera(
      CAMERA_FOV,
      window.innerWidth / window.innerHeight,
      CAMERA_NEAR,
      CAMERA_FAR
    );
    camera.position.z = CAMERA_INITIAL_Z;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: mountRef.current,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";

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

    const gridGroup = new THREE.Group();
    gridGroup.add(gridHelper);
    scene.add(gridGroup);

    const clock = new THREE.Clock();

    // Resize handler
    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
    };
    window.addEventListener("resize", onWindowResize);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();
      const currentAngle =
        MAX_ROTATION_ANGLE * Math.sin(elapsedTime * ROTATION_SPEED_FACTOR);

      gridGroup.rotation.y = currentAngle;

      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      renderer.dispose();
      window.removeEventListener("resize", onWindowResize);
    };
  }, []);

  return <canvas id="bg" ref={mountRef} />;
};

export default Grid;
