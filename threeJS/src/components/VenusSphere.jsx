import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry"; // Import TextGeometry
import { FontLoader } from "three/addons/loaders/FontLoader";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

const VenusSphere = () => {
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

    // Load texture for Venus
    const textureLoader = new THREE.TextureLoader();
    const venusTexture = textureLoader.load("/venusmap.jpg");

    // Create Venus
    const venusRadius = 4;
    const venusGeometry = new THREE.SphereGeometry(venusRadius, 64, 64);
    const venusMaterial = new THREE.MeshBasicMaterial({ map: venusTexture });
    const venusMesh = new THREE.Mesh(venusGeometry, venusMaterial);
    scene.add(venusMesh);

    // Load font for 3D text
    let textFont;
    fontLoader.load("https://threejs.org/examples/fonts/helvetiker_regular.typeface.json", (font) => {
      textFont = font;
      createText();
    });

    // Create 3D text
    const createText = () => {
      const textGeometry = new TextGeometry("Venus", {
        font: textFont,
        size: 0.5,
        height: 0.1,
      });
      const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const textMesh = new THREE.Mesh(textGeometry, textMaterial);
      textMesh.position.set(venusRadius + 2, 0, 0); // Adjust the position relative to Venus
      scene.add(textMesh);
    };

    // Light
    const light = new THREE.PointLight(0xffffff, 70, 100, 1.7);
    light.position.set(10, 10, 10);
    scene.add(light);

    // Camera
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 100);
    camera.position.z = 25;
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

    // Resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Animation loop
    const venusRotationSpeed = 1 / 2.64; // Venus's rotation period in days

    const animate = () => {
      if (isPageVisible.current) {
        // Continue the animation loop only if the page is visible
        // Rotate Venus
        venusMesh.rotation.y += venusRotationSpeed * 0.005; // Adjust speed for smooth animation

        controls.update();
        renderer.render(scene, camera);
        animationId = requestAnimationFrame(animate);
      }
    };

    animationRef.current = animate; // Save the reference to the initial loop

    animate();

    // Timeline animations
    const tl = gsap.timeline({ default: { duration: 1 } });
    tl.fromTo(venusMesh.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 });

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
        <Paper elevation={0} style={{ padding: "20px", backgroundColor: "rgba(0, 0, 0, 0.8)", color: "white" }}>
          <Typography variant="h6" gutterBottom>
            Venus Information
          </Typography>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li>
              <span style={{ fontWeight: "bold" }}>Average Temperature:</span> 465°C (869°F)
            </li>
            <li>
              <span style={{ fontWeight: "bold" }}>Size:</span> Diameter of approximately 12,104 kilometers (7,521 miles)
            </li>
            <li>
              <span style={{ fontWeight: "bold" }}>Distance from the Sun:</span> Approximately 108.2 million kilometers (67.2 million miles)
            </li>
            <li>
              <span style={{ fontWeight: "bold" }}>Orbital Period:</span> About 225 Earth days
            </li>
            <li>
              <span style={{ fontWeight: "bold" }}>Rotation Period:</span> About 243 Earth days (retrograde rotation)
            </li>
          </ul>
        </Paper>
      </Container>
    </>
  );
};

export default VenusSphere;
