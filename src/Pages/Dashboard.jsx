import React from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  
  // Sample data for the dashboard
  const quickActions = [
    { title: "New Connection", icon: "🔗", path: "/new-connection" },
    { title: "New Sales", icon: "💰", path: "/sales" },
    { title: "New Route", icon: "🛣️", path: "/routes" },
    { title: "Products", icon: "📦", path: "/products" },
      { title: "All Customers", icon: "👥", path: "/all-customers" },
  { title: "All Sales", icon: "📊", path: "/all-sales" },
  { title: "Check-in", icon: "📊", path: "/check-in" },
  ];

  const handleActionClick = (path) => {
    navigate(path);
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        
      </header>

      {/* Quick Actions Section */}
      <section className="quick-actions-section">
        <div className="quick-actions-grid">
          {quickActions.map((action, index) => (
            <div 
              key={index} 
              className="action-card"
              onClick={() => handleActionClick(action.path)}
            >
              <span className="action-icon">{action.icon}</span>
              <span className="action-title">{action.title}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;