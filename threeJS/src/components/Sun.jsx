import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry"; // Import TextGeometry
import { FontLoader } from "three/addons/loaders/FontLoader";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

const Sun = () => {
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

    // Load texture for the Sun
    const textureLoader = new THREE.TextureLoader();
    const sunTexture = textureLoader.load("/sunmap.jpg");

    // Create Sun
    const sunGeometry = new THREE.SphereGeometry(10, 64, 64);
    const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture });
    const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sunMesh);

    // Load font for 3D text
    let textFont;
    fontLoader.load("https://threejs.org/examples/fonts/helvetiker_regular.typeface.json", (font) => {
      textFont = font;
      createText();
    });

    // Create 3D text
    const createText = () => {
      const textGeometry = new TextGeometry("Sun", {
        font: textFont,
        size: 1,
        height: 0.1,
      });
      const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const textMesh = new THREE.Mesh(textGeometry, textMaterial);
      textMesh.position.set(12, 0, 0); // Adjust the position relative to the Sun
      scene.add(textMesh);
    };

    // Light
    const light = new THREE.PointLight(0xffffff, 70, 100, 1.7);
    light.position.set(0, 0, 0);
    scene.add(light);

    // Camera
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 1000);
camera.position.z = 30;
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
    const animate = () => {
      if (isPageVisible.current) {
        sunMesh.rotation.y += 0.002;

        controls.update();
        renderer.render(scene, camera);
        animationId = requestAnimationFrame(animate);
      }
    };

    animationRef.current = animate;

    animate();

    // Timeline animations
    const tl = gsap.timeline({ default: { duration: 1 } });
    tl.fromTo(sunMesh.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 });

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
          Sun Information
        </Typography>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li>
            <span style={{ fontWeight: "bold" }}>Diameter:</span> 1,391,000 km
          </li>
          <li>
            <span style={{ fontWeight: "bold" }}>Mass:</span> 1.989 × 10^30 kg
          </li>
          <li>
            <span style={{ fontWeight: "bold" }}>Volume:</span> 1.41 × 10^18 cubic kilometers
          </li>
          <li>
            <span style={{ fontWeight: "bold" }}>Average Distance from the Earth:</span> 149.6 million km
          </li>
          <li>
            <span style={{ fontWeight: "bold" }}>Temperature at the Core:</span> Approximately 15 million °C
          </li>
        </ul>
        <Typography variant="body2" color="white">
          The Sun is the star at the center of our solar system. It provides light and heat, making life
          possible on Earth. The Sun is a massive, hot ball of gas, primarily composed of hydrogen and helium.
        </Typography>
        {/* Add more information as needed */}
      </Paper>
    </Container>
  </>
  );
};

export default Sun;
