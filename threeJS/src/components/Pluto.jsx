import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import gsap from "gsap";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

const Pluto = () => {
  const canvasRef = useRef();
  const animationRef = useRef();
  const isPageVisible = useRef(true);

  const handleVisibilityChange = () => {
    isPageVisible.current = document.visibilityState === "visible";
    if (isPageVisible.current) {
      // Restart the animation loop if the page becomes visible
      animationRef.current();
    }
  };

  useEffect(() => {
    let animationId;
    const fontLoader = new FontLoader();

    // Scene
    const scene = new THREE.Scene();

    // Load texture for Pluto
    const textureLoader = new THREE.TextureLoader();
    const plutoTexture = textureLoader.load("/plutomap2k.jpg");

    // Create Pluto
    const plutoGeometry = new THREE.SphereGeometry(0.1, 32, 32);
    const plutoMaterial = new THREE.MeshBasicMaterial({ map: plutoTexture });
    const plutoMesh = new THREE.Mesh(plutoGeometry, plutoMaterial);
    scene.add(plutoMesh);

    // Light
    const light = new THREE.PointLight(0xffffff, 70, 100, 1.7);
    light.position.set(0, 0, 0);
    scene.add(light);

    // Camera
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 100);
    camera.position.z = 1.5;
    scene.add(camera);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(2);
    renderer.render(scene, camera);

    // Controls
    const controls = new OrbitControls(camera, canvasRef.current);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.enableZoom = true;
    controls.autoRotate = false;

    // Add label for Pluto
    let plutoLabelMesh;

    fontLoader.load("https://threejs.org/examples/fonts/helvetiker_regular.typeface.json", (font) => {
      const plutoLabelGeometry = new TextGeometry("Pluto", { font, size: 0.02, height: 0.001 });
      const plutoLabelMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
      plutoLabelMesh = new THREE.Mesh(plutoLabelGeometry, plutoLabelMaterial);
      plutoLabelMesh.position.set(0.15, 0, 0); // Adjust position relative to Pluto
      scene.add(plutoLabelMesh);
    });

    // Resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Animation loop
    const plutoRotationSpeed = 0.005;

    const animate = () => {
      if (isPageVisible.current) {
        // Continue the animation loop only if the page is visible
        // Rotate Pluto
        plutoMesh.rotation.y += plutoRotationSpeed;

        // Update Pluto label's position
        if (plutoLabelMesh) {
          plutoLabelMesh.position.set(0.15, 0, 0); // Adjust position relative to Pluto
        }

        controls.update();
        renderer.render(scene, camera);
        animationId = requestAnimationFrame(animate);
      }
    };

    animationRef.current = animate;

    animate();

    // Timeline animations
    const tl = gsap.timeline({ default: { duration: 1 } });
    tl.fromTo(plutoMesh.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 });

    // Cleanup event listeners on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      cancelAnimationFrame(animationId);
    };
  }, []); // Empty dependency array ensures that useEffect runs only once

  return (
    <>
    <canvas ref={canvasRef} className="webgl" />
    <Container maxWidth="sm" style={{ position: "absolute", bottom: "20px", left: "20px" }}>
      <Paper elevation={0} style={{ padding: "20px", backgroundColor: "transparent", color: "white" }}>
        <Typography variant="h6" gutterBottom>
          Pluto Information
        </Typography>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li>
            <span style={{ fontWeight: "bold" }}>Diameter:</span> 2376 km
          </li>
          <li>
            <span style={{ fontWeight: "bold" }}>Mass:</span> 1.303 × 10^22 kg
          </li>
          <li>
            <span style={{ fontWeight: "bold" }}>Distance from the Sun:</span> Approximately 5.9 billion km
          </li>
          <li>
            <span style={{ fontWeight: "bold" }}>Rotation Period:</span> About 6.4 Earth days
          </li>
          <li>
            <span style={{ fontWeight: "bold" }}>Orbital Period:</span> About 248 Earth years
          </li>
        </ul>
        <Typography variant="body2" color="white">
          Pluto is a dwarf planet in our solar system, located in the Kuiper belt. It was discovered in 1930 and
          considered the ninth planet until reclassified in 2006 by the International Astronomical Union (IAU).
        </Typography>
        {/* Add more information as needed */}
      </Paper>
    </Container>
  </>
  );
};

export default Pluto;
