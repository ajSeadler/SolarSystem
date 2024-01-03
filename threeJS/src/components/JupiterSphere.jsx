import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import gsap from "gsap";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

const JupiterSphere = () => {
  const canvasRef = useRef();
  const animationRef = useRef();
  const isPageVisible = useRef(true);

  const handleVisibilityChange = () => {
    isPageVisible.current = document.visibilityState === "visible";
    if (isPageVisible.current) {
      // Restart the animation loop if the page becomes visible, otherwise it will lag
      animationRef.current();
    }
  };

  useEffect(() => {
    let animationId;
    const fontLoader = new FontLoader();

    // Scene
    const scene = new THREE.Scene();

    // Load texture for Jupiter
    const textureLoader = new THREE.TextureLoader();
    const jupiterTexture = textureLoader.load("/jupiter2_4k.jpg");

    // Create Jupiter
    const jupiterGeometry = new THREE.SphereGeometry(6, 64, 64);
    const jupiterMaterial = new THREE.MeshBasicMaterial({ map: jupiterTexture });
    const jupiterMesh = new THREE.Mesh(jupiterGeometry, jupiterMaterial);
    scene.add(jupiterMesh);

    // Light
    const light = new THREE.PointLight(0xffffff, 70, 100, 1.7);
    light.position.set(10, 10, 10);
    scene.add(light);

    // Camera
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 100);

    // Adjust camera distance based on screen width for mobile view
    const isMobile = window.innerWidth <= 768;
    camera.position.z = isMobile ? 60 : 20;

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

    // Add label for Jupiter
    let jupiterLabelMesh;

    fontLoader.load("https://threejs.org/examples/fonts/helvetiker_regular.typeface.json", (font) => {
      const jupiterLabelGeometry = new TextGeometry("Jupiter", { font, size: 0.5, height: 0.1 });
      const jupiterLabelMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
      jupiterLabelMesh = new THREE.Mesh(jupiterLabelGeometry, jupiterLabelMaterial);
      jupiterLabelMesh.position.set(7, 0, 0); // Adjust position relative to Jupiter
      scene.add(jupiterLabelMesh);
    });

    // Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Animation loop
    const animate = () => {
      if (isPageVisible.current) {
        // Continue the animation loop only if the page is visible
        // Rotate Jupiter
        jupiterMesh.rotation.y += 0.002;

        // Update Jupiter label's position
        if (jupiterLabelMesh) {
          jupiterLabelMesh.position.set(7, 0, 0); // Adjust position relative to Jupiter
        }

        controls.update();
        renderer.render(scene, camera);
        animationId = requestAnimationFrame(animate);
      }
    };

    animationRef.current = animate; // Save the reference to the initial loop

    animate();

    // Timeline animations
    const tl = gsap.timeline({ default: { duration: 1 } });
    tl.fromTo(jupiterMesh.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 });

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
            Jupiter Information
          </Typography>
          <ul style={{ listStyle: "none", padding: 2, margin: 2 }}>
            <li>
              <span style={{ fontWeight: "bold" }}>Diameter:</span> 139,820 km
            </li>
            <li>
              <span style={{ fontWeight: "bold" }}>Mass:</span> 1.898 × 10^27 kg
            </li>
            <li>
              <span style={{ fontWeight: "bold" }}>Volume:</span> 1.4313 × 10^15 cubic kilometers
            </li>
            <li>
              <span style={{ fontWeight: "bold" }}>Average Distance from the Sun:</span> 778 million km
            </li>
            <li>
              <span style={{ fontWeight: "bold" }}>Orbital Period:</span> 11.86 Earth years
            </li>
            <li>
              <span style={{ fontWeight: "bold" }}>Day Length:</span> About 9.9 Earth hours
            </li>
            <li>
              <span style={{ fontWeight: "bold" }}>Average Temperature:</span> Approximately -145°C
            </li>
          </ul>
          <Typography variant="body2" color="white">
            Jupiter is the largest planet in our Solar System. It is a gas giant and is known for its
            prominent bands of clouds and the Great Red Spot.
          </Typography>
          {/* Add more information as needed */}
        </Paper>
      </Container>
    </>
  );
};

export default JupiterSphere;
