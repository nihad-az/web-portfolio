import { useEffect, useRef } from "react";
import * as THREE from "three";
import "./bgGrid.css";

export default function BgGrid() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // ---------- Scene / Camera / Renderer ----------
    const scene = new THREE.Scene();

    const getCssVh = (): number => {
      const v = getComputedStyle(document.documentElement).getPropertyValue(
        "--vh"
      );
      return v ? parseFloat(v) : 0;
    };

    const initialWidth = window.innerWidth;
    const initialHeight = (() => {
      const cssVh = getCssVh();
      return cssVh ? Math.round(cssVh * 100) : window.innerHeight;
    })();

    const camera = new THREE.PerspectiveCamera(
      60,
      initialWidth / initialHeight,
      0.1,
      2000
    );
    camera.position.z = 180;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(initialWidth, initialHeight, false);

    // keep canvas style consistent
    const canvas = renderer.domElement;
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";

    mount.appendChild(canvas);

    // ---------- Particles ----------
    const particleCount = 4800;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const primary = new THREE.Color("#902BA9");
    const darker = new THREE.Color("#1d0520");
    const greyish = new THREE.Color("#0b0b0d");

    for (let i = 0; i < particleCount; i++) {
      const r = 350 * Math.cbrt(Math.random());
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // less vibrant
      const mixShade = Math.random() * 0.5;
      const color = primary.clone().lerp(darker, mixShade).lerp(greyish, 0.5);

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
      opacity: 0.7,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // ---------- Animation ----------
    let t = 0;

    const animate = (): void => {
      t += 0.0015;

      particles.rotation.y += 0.0007;
      particles.rotation.x += 0.0004;

      camera.position.x = Math.sin(t * 0.25) * 10;
      camera.position.y = Math.cos(t * 0.3) * 7;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
      rafRef.current = requestAnimationFrame(animate);
    };

    animate();

    // ---------- Resize Logic ----------
    let lastHeight = initialHeight;
    const HEIGHT_THRESHOLD_PX = 60;

    const resize = (): void => {
      const w = window.innerWidth;

      // Use CSS variable --vh
      const cssVh = parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue("--vh") ||
          "0"
      );
      const h = cssVh ? Math.round(cssVh * 100) : window.innerHeight;

      // Only update if width changes OR height changes > threshold
      if (w === camera.aspect * h && Math.abs(h - lastHeight) < 100) return;

      lastHeight = h;

      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };

    const onVisibility = (): void => resize();

    // Visual viewport safe access
    const visualViewport = globalThis.visualViewport;

    const onVisualViewport = (): void => resize();

    window.addEventListener("resize", resize, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    if (visualViewport) {
      visualViewport.addEventListener("resize", onVisualViewport);
      visualViewport.addEventListener("scroll", onVisualViewport);
    }

    // ---------- Cleanup ----------
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);

      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);

      if (visualViewport) {
        visualViewport.removeEventListener("resize", onVisualViewport);
        visualViewport.removeEventListener("scroll", onVisualViewport);
      }

      geometry.dispose();
      material.dispose();
      renderer.dispose();

      if (mount.contains(canvas)) mount.removeChild(canvas);
    };
  }, []);

  return <div ref={mountRef} className="space-bg" />;
}
