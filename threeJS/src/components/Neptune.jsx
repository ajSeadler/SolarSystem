import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import gsap from "gsap";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

const Neptune = () => {
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

    // Load texture for Neptune
    const textureLoader = new THREE.TextureLoader();
    const neptuneTexture = textureLoader.load("/neptunemap.jpg");

    // Create Neptune
    const neptuneRadius = 3.8;
    const neptuneGeometry = new THREE.SphereGeometry(neptuneRadius, 64, 64);
    const neptuneMaterial = new THREE.MeshBasicMaterial({ map: neptuneTexture });
    const neptuneMesh = new THREE.Mesh(neptuneGeometry, neptuneMaterial);
    scene.add(neptuneMesh);

    // Light
    const light = new THREE.PointLight(0xffffff, 70, 100, 1.7);
    light.position.set(10, 10, 10);
    scene.add(light);

    // Camera
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 100);
    camera.position.z = 15;
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

    // Add label for Neptune
    let neptuneLabelMesh;

    fontLoader.load("https://threejs.org/examples/fonts/helvetiker_regular.typeface.json", (font) => {
      const neptuneLabelGeometry = new TextGeometry("Neptune", { font, size: 0.5, height: 0.1 });
      const neptuneLabelMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
      neptuneLabelMesh = new THREE.Mesh(neptuneLabelGeometry, neptuneLabelMaterial);
      neptuneLabelMesh.position.set(neptuneRadius + 0.5, 0, 0); // Adjust position relative to Neptune
      scene.add(neptuneLabelMesh);
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
    const neptuneRotationSpeed = 1 / 16.11;

    const animate = () => {
      if (isPageVisible.current) {
        // Continue the animation loop only if the page is visible
        // Rotate Neptune
        neptuneMesh.rotation.y += neptuneRotationSpeed * 0.005;

        // Update Neptune label's position
        if (neptuneLabelMesh) {
          neptuneLabelMesh.position.set(neptuneRadius + 0.5, 0, 0); // Adjust position relative to Neptune
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
    tl.fromTo(neptuneMesh.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 });

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
          Neptune Information
        </Typography>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li>
            <span style={{ fontWeight: "bold" }}>Diameter:</span> 49,244 km
          </li>
          <li>
            <span style={{ fontWeight: "bold" }}>Mass:</span> 1.024 × 10^26 kg
          </li>
          <li>
            <span style={{ fontWeight: "bold" }}>Distance from the Sun:</span> 4.5 billion km
          </li>
          <li>
            <span style={{ fontWeight: "bold" }}>Rotation Period:</span> About 16.11 hours
          </li>
          <li>
            <span style={{ fontWeight: "bold" }}>Orbital Period:</span> About 165 Earth years
          </li>
        </ul>
        <Typography variant="body2" color="white">
          Neptune is the eighth and farthest-known planet from the Sun in the Solar System. It is the fourth-largest
          planet by diameter and the third-largest by mass.
        </Typography>
        {/* Add more information as needed */}
      </Paper>
    </Container>
  </>
  );
};

export default Neptune;
