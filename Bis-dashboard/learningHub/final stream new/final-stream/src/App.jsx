import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import CategoryView from './components/CategoryView';
import VideoPlayer from './components/VideoPlayer';
import Certificate from './components/Certificate';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/category/:id" element={<CategoryView />} />
          <Route path="/video/:id" element={<VideoPlayer />} />
          <Route path="/certificate/:categoryId" element={<Certificate />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;