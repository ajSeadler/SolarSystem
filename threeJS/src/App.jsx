// App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sphere from './components/Sphere';
import Navbar from './components/Navbar';
import Mars from './components/Mars';
import JupiterSphere from './components/JupiterSphere';
import Sun from './components/Sun';
import Mercury from './components/Mercury';
import VenusSphere from './components/VenusSphere';
import Saturn from './components/Saturn';
import Uranus from './components/Uranus';
import Neptune from './components/Neptune';
import Pluto from './components/Pluto';
import UFO from './components/UFO';
import Error404 from './components/Error404';

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<UFO />} />
        <Route path="/sun" element={<Sun />} />
        <Route path="/mercury" element={<Mercury />} />
        <Route path="/venus" element={<VenusSphere />} />
        <Route path="/earth" element={<Sphere />} />
        <Route path="/mars" element={<Mars />} />
        <Route path="/jupiter" element={<JupiterSphere />} />
        <Route path="/saturn" element={<Saturn />} />
        <Route path="/uranus" element={<Uranus />} />
        <Route path="/neptune" element={<Neptune />} />
        <Route path="/pluto" element={<Pluto />} />
        {/* Add the wildcard route for 404 errors */}
        <Route path="*" element={<Error404 />} />
      </Routes>
    </>
  );
};

export default App;
