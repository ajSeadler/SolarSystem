import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import gsap from "gsap";

const HomePage = () => {
  const canvasRef = useRef();
  const animationRef = useRef();
  const isPageVisible = useRef(true);

  const camera = useRef(null);
  const light = useRef(null);

  const handleVisibilityChange = () => {
    isPageVisible.current = document.visibilityState === "visible";
    if (isPageVisible.current) {
      animationRef.current();
    }
  };

  useEffect(() => {
    let animationId;
    const fontLoader = new FontLoader();

    const scene = new THREE.Scene();
    const textureLoader = new THREE.TextureLoader();
    const jupiterTexture = textureLoader.load("/moon_1k.jpeg");
    const jupiterGeometry = new THREE.SphereGeometry(6, 64, 64);
    
    // Configure material for shadows
    const jupiterMaterial = new THREE.MeshStandardMaterial({ 
      map: jupiterTexture,
      roughness: 0.7,
      metalness: 0.0
    });

    const jupiterMesh = new THREE.Mesh(jupiterGeometry, jupiterMaterial);
    jupiterMesh.castShadow = true; // Enable casting shadows
    scene.add(jupiterMesh);

    light.current = new THREE.PointLight(0xffffff, 70, 100, 1.7);
    light.current.position.set(10, 10, 10);
    light.current.castShadow = true; // Enable casting shadows
    scene.add(light.current);

    camera.current = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 100);
    camera.current.position.z = 20;
    scene.add(camera.current);

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(2);
    
    // Configure renderer for shadows
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    renderer.render(scene, camera.current);

    const controls = new OrbitControls(camera.current, canvasRef.current);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.enableZoom = true;
    controls.autoRotate = false;

    let jupiterLabelMesh;

    fontLoader.load("https://threejs.org/examples/fonts/helvetiker_regular.typeface.json", (font) => {
      const jupiterLabelGeometry = new TextGeometry("", { font, size: 0.5, height: 0.1 });
      const jupiterLabelMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
      jupiterLabelMesh = new THREE.Mesh(jupiterLabelGeometry, jupiterLabelMaterial);
      jupiterLabelMesh.position.set(7, 0, 0);
      scene.add(jupiterLabelMesh);
    });

    const handleResize = () => {
      camera.current.aspect = window.innerWidth / window.innerHeight;
      camera.current.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const animate = () => {
      if (isPageVisible.current) {
        jupiterMesh.rotation.y += 0.002;

        if (jupiterLabelMesh) {
          jupiterLabelMesh.position.set(7, 0, 0);
        }

        controls.update();
        renderer.render(scene, camera.current);
        animationId = requestAnimationFrame(animate);
      }
    };

    animationRef.current = animate;

    animate();

    const tl = gsap.timeline({ default: { duration: 1 } });
    tl.fromTo(jupiterMesh.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 });

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      cancelAnimationFrame(animationId);
    };
  }, []);

  const handleFullMoon = () => {
    light.current.position.set(10, 10, 10);
  };

  const handleHalfMoon = () => {
    light.current.position.set(-10, 10, 10);
  };

  const handleQuarterMoon = () => {
    light.current.position.set(10, -10, 10);
  };

  return (
    <>
      <canvas ref={canvasRef} className="webgl" />
      <div>
        {/* <button onClick={handleFullMoon}>Full Moon</button>
        <button onClick={handleHalfMoon}>Half Moon</button>
        <button onClick={handleQuarterMoon}>Quarter Moon</button> */}
      </div>
    </>
  );
};

export default HomePage;
