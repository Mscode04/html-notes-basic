import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./Main/LandingPage";
import LoginPage from "./Main/LoginPage";
import Main from "./Main/Main";
import Logout from "./Pages/Logout";
import Dashboard from "./Pages/Dashboard";
import Patients from "./Pages/Patients";
import Appointments from "./Pages/Appointments";
import Reports from "./Pages/Reports";
import Settings from "./Pages/Settings";
import Help from "./Pages/Help";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  );

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("isAuthenticated");
  };

  return (
    
      <Routes>
        <Route path="/" element={<LandingPage isAuthenticated={isAuthenticated} />} />
        <Route path="/login" element={!isAuthenticated ? <LoginPage setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/dashboard" />} />
        <Route path="/logout" element={<Logout onLogout={handleLogout} />} />
        
        {/* Protected routes */}
        <Route path="/" element={<Main />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="patients" element={<Patients />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
          <Route path="help" element={<Help />} />
        </Route>

        {/* Redirect to dashboard if authenticated but invalid route */}
        <Route path="*" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
      </Routes>
   
  );
}

export default App;