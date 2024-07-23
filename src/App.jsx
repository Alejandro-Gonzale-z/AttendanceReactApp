// App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/landingPage";
import ClassPage from "./pages/classPage";
import ManagePage from "./pages/managePage";
import AttendancePage from "./pages/attendancePage";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/classpage" element={<ClassPage />} />
        <Route path="/managepage" element={<ManagePage />} />
        <Route path="/attendance" element={<AttendancePage />} />
      </Routes>
    </div>
  );
}

export default App;
