// src/App.js
import React, { useState, useEffect } from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./Main/LandingPage";
import LoginPage from "./Main/LoginPage";
import Main from "./Main/Main";
import User from "./Main/User";
import Chatbot from "./Main/Chatbot";
import PUser from "./Main/PUser";
import Logout from "./Main/Logout";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  );
  const [isNurse, setIsNurse] = useState(
    localStorage.getItem("isNurse") === "true"
  );

  useEffect(() => {
    localStorage.setItem("isAuthenticated", isAuthenticated);
    localStorage.setItem("isNurse", isNurse);
  }, [isAuthenticated, isNurse]);

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsNurse(false);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("isNurse");
    localStorage.removeItem("patientId");
  };

  return (
    <>
      <Routes>
        {/* Landing Page - Always shown */}
        <Route
          path="/"
          element={
            <LandingPage 
              isAuthenticated={isAuthenticated} 
              isNurse={isNurse} 
            />
          }
        />

        {/* Login Page */}
        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <LoginPage 
                setIsAuthenticated={setIsAuthenticated} 
                setIsNurse={setIsNurse} 
              />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* Main Page (for nurses) */}
        <Route
          path="/main/*"
          element={
            isAuthenticated && isNurse ? (
              <Main isAuthenticated={isAuthenticated} isNurse={isNurse} />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* User Page (for non-nurses) */}
        <Route
          path="/users/:patientId/*"
          element={
            isAuthenticated && !isNurse ? (
              <User isAuthenticated={isAuthenticated} isNurse={isNurse} />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* PUser Route */}
        <Route
          path="/puser/:patientId"
          element={<PUser />}
        />
        
        <Route
          path="/chatbot"
          element={<Chatbot />}
        />

        {/* Logout Route */}
        <Route
          path="/logout"
          element={<Logout onLogout={handleLogout} />}
        />
      </Routes>
    </>
  );
}

export default App;