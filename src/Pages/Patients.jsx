import React, { useState } from "react";
// import "./Patients.css";

const Patients = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const patients = [
    { id: 1, name: "John Doe", age: 45, gender: "Male", lastVisit: "2023-05-15", status: "Active" },
    { id: 2, name: "Jane Smith", age: 32, gender: "Female", lastVisit: "2023-06-02", status: "Active" },
    { id: 3, name: "Robert Johnson", age: 58, gender: "Male", lastVisit: "2023-04-20", status: "Inactive" },
    { id: 4, name: "Emily Davis", age: 29, gender: "Female", lastVisit: "2023-06-10", status: "Active" },
  ];

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.id.toString().includes(searchTerm)
  );

  return (
    <div className="patients-page">
      <div className="page-header">
        <h2>Patient Management</h2>
        <div className="header-actions">
          <input
            type="text"
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button className="btn primary">
            + Add New Patient
          </button>
        </div>
      </div>

      <div className="patients-table-container">
        <table className="patients-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Last Visit</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map(patient => (
              <tr key={patient.id}>
                <td>#{patient.id}</td>
                <td>{patient.name}</td>
                <td>{patient.age}</td>
                <td>{patient.gender}</td>
                <td>{patient.lastVisit}</td>
                <td>
                  <span className={`status-badge ${patient.status.toLowerCase()}`}>
                    {patient.status}
                  </span>
                </td>
                <td>
                  <button className="action-btn view">View</button>
                  <button className="action-btn edit">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Patients;