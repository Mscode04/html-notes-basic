import React, { useState } from "react";
// import "./Appointments.css";

const Appointments = () => {
  const [activeTab, setActiveTab] = useState("upcoming");

  const appointments = {
    upcoming: [
      { id: 1, patient: "John Doe", date: "2023-06-15", time: "10:00 AM", doctor: "Dr. Smith", status: "Confirmed" },
      { id: 2, patient: "Jane Smith", date: "2023-06-16", time: "02:30 PM", doctor: "Dr. Johnson", status: "Confirmed" },
    ],
    completed: [
      { id: 3, patient: "Robert Johnson", date: "2023-06-10", time: "09:00 AM", doctor: "Dr. Smith", status: "Completed" },
    ],
    cancelled: [
      { id: 4, patient: "Emily Davis", date: "2023-06-05", time: "11:00 AM", doctor: "Dr. Lee", status: "Cancelled" },
    ]
  };

  return (
    <div className="appointments-page">
      <div className="page-header">
        <h2>Appointment Scheduling</h2>
        <button className="btn primary">
          + Schedule New Appointment
        </button>
      </div>

      <div className="tabs">
        <button 
          className={`tab-btn ${activeTab === "upcoming" ? "active" : ""}`}
          onClick={() => setActiveTab("upcoming")}
        >
          Upcoming
        </button>
        <button 
          className={`tab-btn ${activeTab === "completed" ? "active" : ""}`}
          onClick={() => setActiveTab("completed")}
        >
          Completed
        </button>
        <button 
          className={`tab-btn ${activeTab === "cancelled" ? "active" : ""}`}
          onClick={() => setActiveTab("cancelled")}
        >
          Cancelled
        </button>
      </div>

      <div className="appointments-list">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Patient</th>
              <th>Date</th>
              <th>Time</th>
              <th>Doctor</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments[activeTab].map(appointment => (
              <tr key={appointment.id}>
                <td>#{appointment.id}</td>
                <td>{appointment.patient}</td>
                <td>{appointment.date}</td>
                <td>{appointment.time}</td>
                <td>{appointment.doctor}</td>
                <td>
                  <span className={`status-badge ${appointment.status.toLowerCase()}`}>
                    {appointment.status}
                  </span>
                </td>
                <td>
                  {activeTab === "upcoming" && (
                    <>
                      <button className="action-btn check-in">Check In</button>
                      <button className="action-btn cancel">Cancel</button>
                    </>
                  )}
                  <button className="action-btn view">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Appointments;