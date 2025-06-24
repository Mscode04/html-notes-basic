import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";

const Logout = ({ onLogout }) => {
  useEffect(() => {
    onLogout(); // Call the logout handler
  }, [onLogout]);

  return <Navigate to="/" replace={true} />; // Redirect to the root path
};

export default Logout;