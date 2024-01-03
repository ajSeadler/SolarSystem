import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import gsap from "gsap";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

const Saturn = () => {
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

    // Load texture for Saturn
    const textureLoader = new THREE.TextureLoader();
    const saturnTexture = textureLoader.load("/saturnmap.jpg");

    // Create Saturn
    const saturnRadius = 4; // Reduced the size to make it fit better on the screen
    const saturnGeometry = new THREE.SphereGeometry(saturnRadius, 64, 64);
    const saturnMaterial = new THREE.MeshBasicMaterial({ map: saturnTexture });
    const saturnMesh = new THREE.Mesh(saturnGeometry, saturnMaterial);
    scene.add(saturnMesh);

    // Load texture for Saturn's ring
    const ringTexture = textureLoader.load("/saturnringcolor.jpg");
    const ringGeometry = new THREE.RingGeometry(saturnRadius + 1, saturnRadius + 2, 64);
    const ringMaterial = new THREE.MeshBasicMaterial({ map: ringTexture, side: THREE.DoubleSide });
    const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
    ringMesh.rotation.x = Math.PI / 2; // Rotate the ring to be in the correct orientation
    scene.add(ringMesh);

    // Light
    const light = new THREE.PointLight(0xffffff, 70, 100, 1.0);
    light.position.set(10, 10, 10);
    scene.add(light);

    // Camera
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 100);

    // Adjust camera distance based on screen width for mobile view
    const isMobile = window.innerWidth <= 768;
    camera.position.z = isMobile ? 40 : 15; // Adjusted the camera position

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

    // Add label for Saturn
    let saturnLabelMesh;

    fontLoader.load("https://threejs.org/examples/fonts/helvetiker_regular.typeface.json", (font) => {
      const saturnLabelGeometry = new TextGeometry("Saturn", { font, size: 0.5, height: 0.01 });
      const saturnLabelMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
      saturnLabelMesh = new THREE.Mesh(saturnLabelGeometry, saturnLabelMaterial);
      saturnLabelMesh.position.set(saturnRadius + 0.5, 0, 0); // Adjust position relative to Saturn
      scene.add(saturnLabelMesh);
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
    const saturnRotationSpeed = 1 / 10.5; // Saturn's rotation period in hours

    const animate = () => {
      if (isPageVisible.current) {
        // Continue the animation loop only if the page is visible
        // Rotate Saturn
        saturnMesh.rotation.y += saturnRotationSpeed * 0.005; // Adjust speed for smooth animation

        // Update Saturn label's position
        if (saturnLabelMesh) {
          saturnLabelMesh.position.set(saturnRadius + 0.5, 0, 0); // Adjust position relative to Saturn
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
    tl.fromTo(saturnMesh.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 });
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
          Saturn Information
        </Typography>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li>
            <span style={{ fontWeight: "bold" }}>Diameter:</span> 116,464 km
          </li>
          <li>
            <span style={{ fontWeight: "bold" }}>Mass:</span> 5.683 × 10^26 kg
          </li>
          <li>
            <span style={{ fontWeight: "bold" }}>Distance from the Sun:</span> 1.42 billion km
          </li>
          <li>
            <span style={{ fontWeight: "bold" }}>Rotation Period:</span> About 10.5 hours
          </li>
          <li>
            <span style={{ fontWeight: "bold" }}>Orbital Period:</span> About 29.5 Earth years
          </li>
          <li>
            <span style={{ fontWeight: "bold" }}>Average Temperature:</span> Approximately -178 °C
          </li>
        </ul>
        <Typography variant="body2" color="white">
          Saturn is the sixth planet from the Sun and the second-largest in the Solar System, after Jupiter.
          It is known for its stunning ring system.
        </Typography>
        {/* Add more information as needed */}
      </Paper>
    </Container>
  </>
  );
};

export default Saturn;
