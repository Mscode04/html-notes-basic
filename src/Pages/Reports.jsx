import React from "react";
// import "./Reports.css";

const Reports = () => {
  const reportTypes = [
    { id: 1, name: "Patient Census", description: "Current patient demographics and statistics" },
    { id: 2, name: "Appointment History", description: "Detailed appointment records" },
    { id: 3, name: "Billing Summary", description: "Financial reports and revenue analysis" },
    { id: 4, name: "Clinical Statistics", description: "Treatment and diagnosis statistics" },
  ];

  return (
    <div className="reports-page">
      <h2>Reports & Analytics</h2>
      
      <div className="report-types">
        {reportTypes.map(report => (
          <div key={report.id} className="report-card">
            <h3>{report.name}</h3>
            <p>{report.description}</p>
            <div className="report-actions">
              <button className="btn primary">
                Generate Report
              </button>
              <button className="btn secondary">
                View Sample
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="report-history">
        <h3>Recently Generated Reports</h3>
        <table>
          <thead>
            <tr>
              <th>Report Name</th>
              <th>Generated On</th>
              <th>Format</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Patient Census - June 2023</td>
              <td>2023-06-01</td>
              <td>PDF</td>
              <td>
                <button className="action-btn download">Download</button>
                <button className="action-btn share">Share</button>
              </td>
            </tr>
            <tr>
              <td>Appointment History - Q2 2023</td>
              <td>2023-05-15</td>
              <td>Excel</td>
              <td>
                <button className="action-btn download">Download</button>
                <button className="action-btn share">Share</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;