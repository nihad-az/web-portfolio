import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import "./grid.css";

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

const Grid = () => {
  const mountRef = useRef(null); // This is the correct ref

  useEffect(() => {
    let scene, camera, renderer, clock, gridGroup;

    function init() {
      if (!mountRef.current) return; // Ensure the ref is not null

      scene = new THREE.Scene();
      scene.fog = new THREE.Fog(FOG_COLOR, FOG_NEAR, FOG_FAR);

      const aspect = window.innerWidth / window.innerHeight;
      camera = new THREE.PerspectiveCamera(
        CAMERA_FOV,
        aspect,
        CAMERA_NEAR,
        CAMERA_FAR
      );
      camera.position.z = CAMERA_INITIAL_Z;

      renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas: mountRef.current,
      });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);

      const gridHelper = new THREE.GridHelper(
        GRID_SIZE,
        GRID_DIVISIONS,
        GRID_COLOR,
        GRID_COLOR
      );
      gridHelper.material.opacity = GRID_OPACITY;
      gridHelper.material.transparent = true;
      gridHelper.rotation.x = Math.PI / 2; // Face camera

      gridGroup = new THREE.Group();
      gridGroup.add(gridHelper);
      scene.add(gridGroup);

      clock = new THREE.Clock();

      window.addEventListener("resize", onWindowResize, false);
    }

    function onWindowResize() {
      if (!camera || !renderer) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function animate() {
      if (!renderer || !scene || !camera) return;

      requestAnimationFrame(animate);

      // Get total elapsed time
      const elapsedTime = clock.getElapsedTime();

      // Calculate rotation using a sine wave for smooth easing
      const currentAngle =
        MAX_ROTATION_ANGLE * Math.sin(elapsedTime * ROTATION_SPEED_FACTOR);
      gridGroup.rotation.y = currentAngle;

      // Render directly using the renderer
      renderer.render(scene, camera);
    }

    init();
    animate();

    return () => {
      // Cleanup on component unmount
      if (renderer) renderer.dispose();
      window.removeEventListener("resize", onWindowResize);
    };
  }, []);

  return <canvas id="bg" ref={mountRef} />;
};

export default Grid;
