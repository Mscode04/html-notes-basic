import React from "react";
// import "./Dashboard.css";

const Dashboard = () => {
  // Sample data
  const stats = [
    { title: "Total Patients", value: "1,245", change: "+12%", trend: "up" },
    { title: "Appointments", value: "48", change: "+5%", trend: "up" },
    { title: "Pending Tasks", value: "7", change: "-2", trend: "down" },
    { title: "Revenue", value: "$28,450", change: "+8%", trend: "up" },
  ];

  const recentPatients = [
    { id: 1, name: "John Doe", lastVisit: "2 hours ago", status: "Checked In" },
    { id: 2, name: "Jane Smith", lastVisit: "1 day ago", status: "Follow Up" },
    { id: 3, name: "Robert Johnson", lastVisit: "2 days ago", status: "Discharged" },
  ];

  return (
    <div className="dashboard-page">
      <h2>Overview</h2>
      
      {/* Stats Cards */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <h3>{stat.title}</h3>
            <div className="stat-value">{stat.value}</div>
            <div className={`stat-change ${stat.trend}`}>
              {stat.change} {stat.trend === "up" ? "↑" : "↓"}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="dashboard-section">
        <h3>Recent Patients</h3>
        <div className="recent-patients">
          <table>
            <thead>
              <tr>
                <th>Patient ID</th>
                <th>Name</th>
                <th>Last Visit</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentPatients.map((patient) => (
                <tr key={patient.id}>
                  <td>#{patient.id}</td>
                  <td>{patient.name}</td>
                  <td>{patient.lastVisit}</td>
                  <td>
                    <span className={`status-badge ${patient.status.toLowerCase().replace(' ', '-')}`}>
                      {patient.status}
                    </span>
                  </td>
                  <td>
                    <button className="action-btn view">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="dashboard-section">
        <h3>Quick Actions</h3>
        <div className="quick-actions">
          <button className="action-btn primary">
            + New Appointment
          </button>
          <button className="action-btn secondary">
            Add Patient
          </button>
          <button className="action-btn tertiary">
            Generate Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;