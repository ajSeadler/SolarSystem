import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";
import { Link } from 'react-router-dom';

const Homepage = () => {
  const canvasRef = useRef();
  const animationRef = useRef();
  const isPageVisible = useRef(true);

  const handleVisibilityChange = () => {
    isPageVisible.current = document.visibilityState === "visible";
    if (isPageVisible.current) {
      animationRef.current();
    }
  };

  useEffect(() => {
    let animationId;

    const scene = new THREE.Scene();

    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(25, 25, 25); // Adjust the position of the light
    scene.add(directionalLight);

    const loader = new GLTFLoader();
    let ufoModel;

    loader.load("/le-solar-systme-v4.glb", (gltf) => {
      ufoModel = gltf.scene;
      scene.add(ufoModel);

      ufoModel.position.set(0, 5, 0);
      ufoModel.scale.set(0.1, 0.1, 0.1);
      ufoModel.rotation.y = Math.PI / 2;

      const tl = gsap.timeline({ default: { duration: 0.1 } });
      tl.fromTo(ufoModel.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 });

      const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 100);
      camera.position.z = 55;
      scene.add(camera);

      const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(2);
      renderer.render(scene, camera);

      const controls = new OrbitControls(camera, canvasRef.current);
      controls.enableDamping = true;
      controls.enablePan = false;
      controls.enableZoom = false;
      controls.autoRotate = false;

      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };

      window.addEventListener("resize", handleResize);
      document.addEventListener("visibilitychange", handleVisibilityChange);

      const animate = () => {
        if (isPageVisible.current) {
          if (ufoModel) {
            ufoModel.rotation.y += 0.01;
          }

          controls.update();
          renderer.render(scene, camera);
          animationId = requestAnimationFrame(animate);
        }
      };

      animationRef.current = animate;

      animate();

      return () => {
        window.removeEventListener("resize", handleResize);
        document.removeEventListener("visibilitychange", handleVisibilityChange);
        cancelAnimationFrame(animationId);
      };
    });

    // No return statement here

  }, []); // Empty dependency array ensures that useEffect runs only once

  return (
    <>
      <canvas ref={canvasRef} className="webgl" />
      {/* <h1 style={{ position: "absolute", top: "20px", left: "50%", transform: "translateX(-50%)", color: "white" }}>
        Welcome to the Milky Way!
      </h1>
      <div style={{ display: "flex", justifyContent: "center", gap: "10px", color: "white", fontSize:'2rem' }}>
        <Link to="/" style={{ textDecoration: 'none', color:'#fff' }}><h6>Home</h6></Link>
        <Link to="/sun" style={{ textDecoration: 'none', color:'#fff' }}><h6>Sun</h6></Link>
        <Link to="/mercury" style={{ textDecoration: 'none', color:'#fff' }}><h6>Mercury</h6></Link>
        {/* ... Repeat for other planets ... */}
      {/* </div> */}
    </>
  );
};

export default Homepage;
