import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { FontLoader } from "three/addons/loaders/FontLoader";
import gsap from "gsap";
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

    const scene = new THREE.Scene();

    const textureLoader = new THREE.TextureLoader();
    const venusTexture = textureLoader.load("/venusmap.jpg");

    const venusRadius = 4;
    const venusGeometry = new THREE.SphereGeometry(venusRadius, 64, 64);
    const venusMaterial = new THREE.MeshBasicMaterial({ map: venusTexture });
    const venusMesh = new THREE.Mesh(venusGeometry, venusMaterial);
    scene.add(venusMesh);

    let textFont;
    fontLoader.load("https://threejs.org/examples/fonts/helvetiker_regular.typeface.json", (font) => {
      textFont = font;
      createText();
    });

    const createText = () => {
      const textGeometry = new TextGeometry("Venus", {
        font: textFont,
        size: 0.5,
        height: 0.1,
      });
      const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const textMesh = new THREE.Mesh(textGeometry, textMaterial);
      textMesh.position.set(venusRadius + 2, 0, 0);
      scene.add(textMesh);
    };

    const light = new THREE.PointLight(0xffffff, 70, 100, 1.7);
    light.position.set(10, 10, 10);
    scene.add(light);

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 100);
    camera.position.z = window.innerWidth < 600 ? 55 : 25; // Adjust camera position for mobile view
    scene.add(camera);

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(2);
    renderer.render(scene, camera);

    const controls = new OrbitControls(camera, canvasRef.current);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.enableZoom = true;
    controls.autoRotate = false;

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.position.z = window.innerWidth < 600 ? 55 : 25; // Adjust camera position for mobile view on resize
    };

    window.addEventListener("resize", handleResize);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const venusRotationSpeed = 1 / 2.64;

    const animate = () => {
      if (isPageVisible.current) {
        venusMesh.rotation.y += venusRotationSpeed * 0.005;

        controls.update();
        renderer.render(scene, camera);
        animationId = requestAnimationFrame(animate);
      }
    };

    animationRef.current = animate;
    animate();

    const tl = gsap.timeline({ default: { duration: 1 } });
    tl.fromTo(venusMesh.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 });

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      cancelAnimationFrame(animationId);
    };
  }, []);

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
