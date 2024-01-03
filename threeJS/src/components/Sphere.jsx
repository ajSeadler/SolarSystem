import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import gsap from "gsap";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

const Sphere = () => {
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

    // Scene
    const scene = new THREE.Scene();

    // Load texture for the main sphere background
    const textureLoader = new THREE.TextureLoader();
    const earthlightsTexture = textureLoader.load("/earthmap1k.jpg");

    // Create main sphere (Earth)
    const earthGeometry = new THREE.SphereGeometry(3.5, 64, 64);
    const earthMaterial = new THREE.MeshBasicMaterial({
      map: earthlightsTexture,
    });
    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earthMesh);

    // Load texture for the second sphere background (Moon)
    const moonTexture = textureLoader.load("/moonmap2k.jpg");

    // Create second sphere (Moon)
    const moonGeometry = new THREE.SphereGeometry(0.4, 64, 64); // Smaller radius for the Moon
    const moonMaterial = new THREE.MeshBasicMaterial({
      map: moonTexture,
    });
    const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
    moonMesh.position.set(10, 0, 0); // Set the initial position of the Moon relative to the Earth
    scene.add(moonMesh);

    // Create a group to hold both Earth and Moon
    const earthMoonGroup = new THREE.Group();
    earthMoonGroup.add(earthMesh);
    earthMoonGroup.add(moonMesh);
    scene.add(earthMoonGroup);

    // Light
    const light = new THREE.PointLight(0xffffff, 70, 100, 1.7);
    light.position.set(10, 10, 10);
    scene.add(light);

    // Camera
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 100);
    camera.position.z = window.innerWidth < 600 ? 40 : 20; // Adjust camera position for mobile view
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
    controls.autoRotate = true;

    // Add label for Earth
    const fontLoader = new FontLoader();
    let earthLabelMesh;

    fontLoader.load("https://threejs.org/examples/fonts/helvetiker_regular.typeface.json", (font) => {
      const earthLabelGeometry = new TextGeometry("Earth", { font, size: 0.7, height: 0.01 });
      const earthLabelMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
      earthLabelMesh = new THREE.Mesh(earthLabelGeometry, earthLabelMaterial);
      earthLabelMesh.position.set(0, 4, 0); // Adjust position as needed
      scene.add(earthLabelMesh);
    });

    // Add label for Moon
    let moonLabelMesh;

    fontLoader.load("https://threejs.org/examples/fonts/helvetiker_regular.typeface.json", (font) => {
      const moonLabelGeometry = new TextGeometry("", { font, size: 0.1, height: 0.01 });
      const moonLabelMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
      moonLabelMesh = new THREE.Mesh(moonLabelGeometry, moonLabelMaterial);
      moonLabelMesh.position.set(10, 0.7, 0); // Adjust position as needed
      scene.add(moonLabelMesh);
    });

    // Resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.position.z = window.innerWidth < 600 ? 40 : 20; // Adjust camera position for mobile view on resize
    };

    window.addEventListener("resize", handleResize);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Animation loop
    const animate = () => {
      if (isPageVisible.current) {
        // Continue the animation loop only if the page is visible
        // Rotate Earth and Moon around their common center
        earthMoonGroup.rotation.y += 0.005;
        // Rotate the Moon around the Earth
        moonMesh.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), 0.005);

        earthMesh.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), 0.001);

        // Update label positions
        if (earthLabelMesh) {
          earthLabelMesh.position.set(0, 4, 0); // Adjust position as needed
        }
        if (moonLabelMesh) {
          moonLabelMesh.position.set(10, 0.7, 0); // Adjust position as needed
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
    tl.fromTo(earthMoonGroup.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 });
    tl.fromTo(".nav", { y: "-100%" }, { y: "0%" });

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
            Earth Information
          </Typography>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li>
              <span style={{ fontWeight: "bold" }}>Average Temperature:</span> 15°C (59°F)
            </li>
            <li>
              <span style={{ fontWeight: "bold" }}>Size:</span> Diameter of approximately 12,742 kilometers (7,918 miles)
            </li>
            <li>
              <span style={{ fontWeight: "bold" }}>Distance from the Sun:</span> Approximately 149.6 million kilometers (93 million miles)
            </li>
            <li>
              <span style={{ fontWeight: "bold" }}>Orbital Period:</span> About 365.25 Earth days
            </li>
            <li>
              <span style={{ fontWeight: "bold" }}>Rotation Period:</span> About 24 hours
            </li>
          </ul>
          <Typography variant="body2" color="white">
            Earth is the third planet from the Sun and the only astronomical object known to harbor life.
            It is often referred to as the "Blue Planet" due to its abundant water resources.
          </Typography>
          {/* Add more information as needed */}
        </Paper>
      </Container>
    </>
  );
};

export default Sphere;
