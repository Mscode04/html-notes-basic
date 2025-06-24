import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "./Main.css";

const Main = () => {
  const navigate = useNavigate();

  // Sample navigation items
  const navItems = [
    { path: "/dashboard", name: "Dashboard", icon: "📊" },
    { path: "/patients", name: "Patients", icon: "👨‍⚕️" },
    { path: "/appointments", name: "Appointments", icon: "📅" },
    { path: "/reports", name: "Reports", icon: "📈" },
    { path: "/settings", name: "Settings", icon: "⚙️" },
  ];

  return (
    <div className="dashboard-container">
      {/* Sidebar/Navbar */}
      <nav className="sidebar">
        <div className="sidebar-header">
          <h2>ClinicPro</h2>
        </div>
        <ul className="nav-items">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link to={item.path} className="nav-link">
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-text">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="user-profile">
          <div className="user-avatar">👤</div>
          <div className="user-info">
            <span className="user-name">Admin User</span>
            <span className="user-role">Administrator</span>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="main-content">
        {/* Top Header */}
        <header className="content-header">
          <div className="header-left">
            <h1>Dashboard Overview</h1>
          </div>
          <div className="header-right">
            <button className="notification-btn">🔔</button>
            <button 
              className="logout-btn"
              onClick={() => navigate("/logout")}
            >
              Logout
            </button>
          </div>
        </header>

        {/* Page Content - This will render nested routes */}
        <div className="page-content">
          <Outlet />
        </div>

        {/* Footer */}
        <footer className="dashboard-footer">
          <div className="footer-content">
            <div className="help-section">
              <Link to="/help" className="help-link">
                Need Help? Contact Support
              </Link>
            </div>
            <div className="copyright">
              © {new Date().getFullYear()} ClinicPro. All rights reserved.
            </div>
            <div className="version">v1.0.0</div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Main;