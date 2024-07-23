// App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/landingPage";
import ClassesPage from "./pages/classPage";
import AttendancePage from "./pages/attendancePage";
import AttendanceReport from "./pages/Report";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/classList" element={<ClassesPage />} />
        <Route path="/attendance" element={<AttendancePage />} />
        <Route path="/AttendanceReport" element={<AttendanceReport />} />
      </Routes>
    </div>
  );
}

export default App;
