import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry"; // Import TextGeometry
import { FontLoader } from "three/addons/loaders/FontLoader";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

const Uranus = () => {
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

    // Load texture for Uranus
    const textureLoader = new THREE.TextureLoader();
    const uranusTexture = textureLoader.load("/uranusmap.jpg");

    // Create Uranus
    const uranusRadius = 3.5;
    const uranusGeometry = new THREE.SphereGeometry(uranusRadius, 64, 64);
    const uranusMaterial = new THREE.MeshBasicMaterial({ map: uranusTexture });
    const uranusMesh = new THREE.Mesh(uranusGeometry, uranusMaterial);
    scene.add(uranusMesh);

    // Load texture for Uranus's ring pattern
    const ringTexture = textureLoader.load("/uranusringcolour.jpg");
    const ringGeometry = new THREE.RingGeometry(uranusRadius + 0.5, uranusRadius + 1, 64);
    const ringMaterial = new THREE.MeshBasicMaterial({ map: ringTexture, side: THREE.DoubleSide });
    const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
    ringMesh.rotation.x = Math.PI / 2;
    scene.add(ringMesh);

    // Load font for 3D text
    let textFont;
    fontLoader.load("https://threejs.org/examples/fonts/helvetiker_regular.typeface.json", (font) => {
      textFont = font;
      createText();
    });

    // Create 3D text
    const createText = () => {
      const textGeometry = new TextGeometry("Uranus", {
        font: textFont,
        size: 0.4,
        height: 0.1,
      });
      const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const textMesh = new THREE.Mesh(textGeometry, textMaterial);
      textMesh.position.set(uranusRadius + 0, uranusRadius + 0.0, 0); // Adjust the position relative to Uranus
      scene.add(textMesh);
    };

    // Light
    const light = new THREE.PointLight(0xffffff, 70, 100, 1.7);
    light.position.set(10, 10, 10);
    scene.add(light);

    // Camera
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 100);

    // Adjust camera distance based on screen width for mobile view
    const isMobile = window.innerWidth <= 768;
    camera.position.z = isMobile ? 35 : 15;

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
    const uranusRotationSpeed = 1 / 17.24;

    const animate = () => {
      if (isPageVisible.current) {
        uranusMesh.rotation.y += uranusRotationSpeed * 0.005;

        controls.update();
        renderer.render(scene, camera);
        animationId = requestAnimationFrame(animate);
      }
    };

    animationRef.current = animate;

    animate();

    // Timeline animations
    const tl = gsap.timeline({ default: { duration: 1 } });
    tl.fromTo(uranusMesh.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 });
    tl.fromTo(ringMesh.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 });

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
          Uranus Information
        </Typography>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li>
            <span style={{ fontWeight: "bold" }}>Diameter:</span> 50,724 km
          </li>
          <li>
            <span style={{ fontWeight: "bold" }}>Mass:</span> 8.681 × 10^25 kg
          </li>
          <li>
            <span style={{ fontWeight: "bold" }}>Distance from the Sun:</span> 2.87 billion km
          </li>
          <li>
            <span style={{ fontWeight: "bold" }}>Rotation Period:</span> About 17.24 hours
          </li>
          <li>
            <span style={{ fontWeight: "bold" }}>Orbital Period:</span> About 84 Earth years
          </li>
          <li>
            <span style={{ fontWeight: "bold" }}>Average Temperature:</span> Approximately -224 °C
          </li>
        </ul>
        <Typography variant="body2" color="white">
          Uranus is the seventh planet from the Sun in the Solar System. It is a gas giant with an atmosphere
          composed primarily of hydrogen, helium, and methane.
        </Typography>
        {/* Add more information as needed */}
      </Paper>
    </Container>
  </>
  );
};

export default Uranus;
