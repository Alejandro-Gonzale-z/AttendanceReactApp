import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/landingPage';
import Classpage from './pages/classpage';
import ManagePage from './pages/managePage';


function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/classpage" element={<Classpage />} />
        <Route path="/managePage" element={<ManagePage />} />
      </Routes>
    </div>
  );
}

export default App;
