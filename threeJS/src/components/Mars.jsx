import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import gsap from "gsap";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

const Mars = () => {
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

    // Load textures
    const textureLoader = new THREE.TextureLoader();
    const marsTexture = textureLoader.load("/mars_1k_color.jpg");
    const moon1Texture = textureLoader.load("/phobosbump.jpg");
    const moon2Texture = textureLoader.load("/deimosbump.jpg");

    // Create Mars
    const marsGeometry = new THREE.SphereGeometry(4, 64, 64);
    const marsMaterial = new THREE.MeshBasicMaterial({ map: marsTexture });
    const marsMesh = new THREE.Mesh(marsGeometry, marsMaterial);
    scene.add(marsMesh);

    // Create Moon 1
    const moon1Geometry = new THREE.SphereGeometry(0.5, 64, 64);
    const moon1Material = new THREE.MeshBasicMaterial({ map: moon1Texture });
    const moon1Mesh = new THREE.Mesh(moon1Geometry, moon1Material);
    moon1Mesh.position.set(6, 0, 0);
    scene.add(moon1Mesh);

    // Create Moon 2
    const moon2Geometry = new THREE.SphereGeometry(0.3, 64, 64);
    const moon2Material = new THREE.MeshBasicMaterial({ map: moon2Texture });
    const moon2Mesh = new THREE.Mesh(moon2Geometry, moon2Material);
    moon2Mesh.position.set(8, 0, 0);
    scene.add(moon2Mesh);

    // Create a group to hold both Mars and Moons
    const marsMoonsGroup = new THREE.Group();
    marsMoonsGroup.add(marsMesh);
    marsMoonsGroup.add(moon1Mesh);
    marsMoonsGroup.add(moon2Mesh);
    scene.add(marsMoonsGroup);

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

    // Add labels for Mars and Moons
    const fontLoader = new FontLoader();
    let marsLabelMesh, moon1LabelMesh, moon2LabelMesh;

    fontLoader.load("https://threejs.org/examples/fonts/helvetiker_regular.typeface.json", (font) => {
      const marsLabelGeometry = new TextGeometry("Mars", { font, size: 0.7, height: 0.1 });
      const marsLabelMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
      marsLabelMesh = new THREE.Mesh(marsLabelGeometry, marsLabelMaterial);
      marsLabelMesh.position.set(0, 5, 0);
      scene.add(marsLabelMesh);

      const moon1LabelGeometry = new TextGeometry("", { font, size: 0.2, height: 0.05 });
      const moon1LabelMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
      moon1LabelMesh = new THREE.Mesh(moon1LabelGeometry, moon1LabelMaterial);
      moon1LabelMesh.position.set(6, 0.7, 0);
      scene.add(moon1LabelMesh);

      const moon2LabelGeometry = new TextGeometry("", { font, size: 0.2, height: 0.05 });
      const moon2LabelMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
      moon2LabelMesh = new THREE.Mesh(moon2LabelGeometry, moon2LabelMaterial);
      moon2LabelMesh.position.set(8, 0.4, 0);
      scene.add(moon2LabelMesh);
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
        // Rotate Mars and its moons
        marsMesh.rotation.y += 0.002;
        moon1Mesh.rotation.y += 0.005;
        moon2Mesh.rotation.y += 0.008;

        // Rotate moons around Mars
        moon1Mesh.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), 0.005);
        moon2Mesh.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), 0.008);

        // Update moon labels' positions
        if (marsLabelMesh && moon1LabelMesh && moon2LabelMesh) {
          const moon1LabelPosition = new THREE.Vector3(6, 0.7, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), 0.005);
          moon1LabelMesh.position.set(moon1LabelPosition.x, moon1LabelPosition.y, moon1LabelPosition.z);

          const moon2LabelPosition = new THREE.Vector3(8, 0.4, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), 0.008);
          moon2LabelMesh.position.set(moon2LabelPosition.x, moon2LabelPosition.y, moon2LabelPosition.z);
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
    tl.fromTo(marsMoonsGroup.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 });

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
          Mars Information
        </Typography>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li>
            <span style={{ fontWeight: "bold" }}>Average Temperature:</span> -80°F (-62°C)
          </li>
          <li>
            <span style={{ fontWeight: "bold" }}>Size:</span> Diameter of approximately 6,779 kilometers (4,212 miles)
          </li>
          <li>
            <span style={{ fontWeight: "bold" }}>Distance from the Sun:</span> Approximately 227.9 million kilometers (141.6 million miles)
          </li>
          <li>
            <span style={{ fontWeight: "bold" }}>Orbital Period:</span> About 687 Earth days
          </li>
          <li>
            <span style={{ fontWeight: "bold" }}>Rotation Period:</span> About 24.6 hours
          </li>
        </ul>
        <Typography variant="body2" color="white">
          Mars is the fourth planet from the Sun and the second-smallest planet in the Solar System. It is often referred to as the "Red Planet" due to its reddish appearance.
        </Typography>
        {/* Add more information as needed */}
      </Paper>
    </Container>
  </>
  );
};

export default Mars;
