import React from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css";

const LandingPage = ({ isAuthenticated }) => {
  return (
    <div className="landing-page">
      <h1>Welcome to Our Application</h1>
      {!isAuthenticated ? (
        <div className="auth-buttons">
          <Link to="/login" className="login-button">
            Login
          </Link>
        </div>
      ) : (
        <div className="auth-buttons">
          <Link to="/main" className="main-button">
            Go to Main Page
          </Link>
          <Link to="/logout" className="logout-button">
            Logout
          </Link>
        </div>
      )}
    </div>
  );
};

export default LandingPage;