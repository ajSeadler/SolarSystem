import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import gsap from "gsap";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

const Mercury = () => {
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

    // Load texture for Mercury
    const textureLoader = new THREE.TextureLoader();
    const mercuryTexture = textureLoader.load("/mercurymap.jpg");

    // Create Mercury
    const mercuryGeometry = new THREE.SphereGeometry(1.5, 64, 64);
    const mercuryMaterial = new THREE.MeshBasicMaterial({ map: mercuryTexture });
    const mercuryMesh = new THREE.Mesh(mercuryGeometry, mercuryMaterial);
    scene.add(mercuryMesh);

    // Light
    const light = new THREE.PointLight(0xffffff, 70, 100, 1.7);
    light.position.set(0, 0, 0); // Place light at the center of Mercury
    scene.add(light);

    // Camera
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 100);
    camera.position.z = 10;
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

    // Add label for Mercury
    let mercuryLabelMesh;

    fontLoader.load("https://threejs.org/examples/fonts/helvetiker_regular.typeface.json", (font) => {
      const mercuryLabelGeometry = new TextGeometry("Mercury", { font, size: 0.2, height: 0.1 });
      const mercuryLabelMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
      mercuryLabelMesh = new THREE.Mesh(mercuryLabelGeometry, mercuryLabelMaterial);
      mercuryLabelMesh.position.set(1, 0, 0); // Adjust position relative to Mercury
      scene.add(mercuryLabelMesh);
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
    const animate = () => {
      if (isPageVisible.current) {
        // Continue the animation loop only if the page is visible
        // Rotate Mercury
        mercuryMesh.rotation.y += 0.004;

        // Update Mercury label's position
        if (mercuryLabelMesh) {
          mercuryLabelMesh.position.set(2, 0, 0); // Adjust position relative to Mercury
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
    tl.fromTo(mercuryMesh.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 });

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
            Mercury Information
          </Typography>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li>
              <span style={{ fontWeight: "bold" }}>Average Temperature:</span> 427°C (800°F) during the day, -183°C (-297°F) at night
            </li>
            <li>
              <span style={{ fontWeight: "bold" }}>Size:</span> Diameter of approximately 4,880 kilometers (3,032 miles)
            </li>
            <li>
              <span style={{ fontWeight: "bold" }}>Distance from the Sun:</span> Approximately 57.9 million kilometers (36 million miles)
            </li>
            <li>
              <span style={{ fontWeight: "bold" }}>Orbital Period:</span> About 88 Earth days
            </li>
            <li>
              <span style={{ fontWeight: "bold" }}>Rotation Period:</span> About 59 Earth days
            </li>
          </ul>
        </Paper>
      </Container>
    </>
  );
};

export default Mercury;
