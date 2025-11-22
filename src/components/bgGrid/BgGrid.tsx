import { useEffect, useRef } from "react";
import * as THREE from "three";
import "./bgGrid.css";

export default function SpaceBackground() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 2000);
    camera.position.z = 180;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    /* PARTICLES */
    const particleCount = 4800;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    // New: softer color palette
    const primary = new THREE.Color("#902BA9"); // your card color
    const darker = new THREE.Color("#1d0520"); // deeper subtle purple
    const greyish = new THREE.Color("#0b0b0d"); // space black/grey blend

    for (let i = 0; i < particleCount; i++) {
      // spherical spread
      const r = 350 * Math.cbrt(Math.random());
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // NEW: significantly reduced vibrance
      const mix1 = Math.random() * 0.25; // only 25% primary purple
      const mix2 = Math.random() * 0.5; // blend with darker tones

      const color = primary.clone().lerp(darker, mix2).lerp(greyish, 0.5);

      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 2.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.7, // lowered from 0.9 → softer glow
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    /* ANIMATION */
    let t = 0;
    function animate() {
      // much slower progression
      t += 0.0015; // was 0.0032

      // significantly slower rotation
      particles.rotation.y += 0.0007; // was 0.0016
      particles.rotation.x += 0.0004; // was 0.0009

      // very slow camera drift
      camera.position.x = Math.sin(t * 0.25) * 10; // was * 0.35, amplitude 14
      camera.position.y = Math.cos(t * 0.3) * 7; // was * 0.42, amplitude 10

      camera.lookAt(scene.position);

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }
    animate();

    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="space-bg" />;
}
