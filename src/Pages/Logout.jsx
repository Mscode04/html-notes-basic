import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import "./Logout.css";

const Logout = ({ onLogout }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Perform logout actions
    const performLogout = () => {
      // Call the logout function passed from App.js
      onLogout();
      
      // Add any additional cleanup here (e.g., clearing local storage)
      localStorage.removeItem("userToken");
      localStorage.removeItem("userPreferences");
      
      // Redirect to login after a brief delay
      setTimeout(() => {
        navigate("/login", { state: { fromLogout: true } });
      }, 2000);
    };

    performLogout();
  }, [onLogout, navigate]);

  return (
    <div className="logout-container">
      <div className="logout-content">
        <div className="spinner"></div>
        <h2>Logging Out...</h2>
        <p>You're being securely logged out of the system.</p>
      </div>
    </div>
  );
};

export default Logout;