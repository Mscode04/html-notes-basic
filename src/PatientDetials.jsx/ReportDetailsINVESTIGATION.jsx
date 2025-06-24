import React, { useState, useEffect } from "react";
import { db } from "../Firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import "./ReportDetailsINVESTIGATION.css"; // Import the CSS file
import { Printer } from "lucide-react";
import "jspdf-autotable";
import { Pencil } from "lucide-react";
const ReportDetailsINVESTIGATION = () => {
  const { reportId } = useParams(); // Get reportId from URL
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate(); // Use useNavigate

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        setError(null);

        const reportRef = doc(db, "Reports", reportId);
        const reportSnapshot = await getDoc(reportRef);

        if (reportSnapshot.exists()) {
          console.log("Report data:", reportSnapshot.data());
          setReport(reportSnapshot.data());
        } else {
          console.log("No report found with ID:", reportId);
          setError("Report not found.");
        }
      } catch (error) {
        console.error("Error fetching report: ", error);
        setError("Failed to load report. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [reportId]);

  const goBack = () => {
    navigate(-1); // Go back to the previous page
  };
  const exportToPrint = (report) => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Investigation Report - ${report.name}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { font-size: 18px; color: #283593; margin-bottom: 20px; }
            .section-header { font-size: 14px; font-weight: bold; background-color: #d3d3d3; padding: 5px; margin-top: 10px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
            table, th, td { border: 1px solid #ddd; }
            th, td { padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; }
            tr:nth-child(even) { background-color: #f9f9f9; }
          </style>
        </head>
        <body>
          <h1>Investigation Report - ${report.name}</h1>
    `);
  
    const addSectionHeader = (text) => {
      printWindow.document.write(`<div class="section-header">${text}</div>`);
    };
  
    const addTable = (data) => {
      printWindow.document.write(`
        <table>
          <tbody>
            ${data.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join("")}</tr>`).join("")}
          </tbody>
        </table>
      `);
    };
  
    // Personal Details
    addSectionHeader("Personal Details");
    addTable([
      ["Patient Name", report.name || "N/A"],
      ["Age", report.age || "N/A"],
      ["Gender", report.gender || "N/A"],
      ["Date of Birth", report.dob || "N/A"],
      ["Address", report.address || "N/A"],
      ["Email", report.email || "N/A"],
      ["Patient ID", report.patientId || "N/A"],
    ]);
  
    // Investigation Details
    addSectionHeader("Investigation Details");
    const investigationFields = ["CBR", "ESR", "CRP", "FBS", "PPBS", "RBS", "HBa1c", "RFT", "LFT", "LIPID_PROFILE", "ELECTROLYTES", "URINE", "OTHERS"];
    addTable(investigationFields.map(field => [field, report[field] || "N/A"]));
  
    // Reports From
    addSectionHeader("Reports From");
    if (report.REPORTS_FROM && Object.keys(report.REPORTS_FROM).length > 0) {
      addTable(Object.entries(report.REPORTS_FROM).map(([key, value]) => [key, value || "N/A"]));
    } else {
      printWindow.document.write(`<p>No Reports Available</p>`);
    }
  
    // Date
    addSectionHeader("Date");
    addTable([["Date", report.date || "N/A"]]);
  
    printWindow.document.write(`</body></html>`);
    printWindow.document.close();
    printWindow.print();
  };
  
  const goToUpdate = () => {
    navigate(`/main/update-investigation/${reportId}`); // Navigate to the UpdateINVESTIGATION component
  };

  if (loading) {
    return          <div className="loading-container">
    <img
      src="https://media.giphy.com/media/YMM6g7x45coCKdrDoj/giphy.gif"
      alt="Loading..."
      className="loading-image"
    />
  </div>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!report) {
    return <p>No report found.</p>;
  }

  return (
    <div className="rinvestigation-container">
      <button className="rinvestigation-back-button" onClick={goBack}>
        &larr; Back
      </button>
      <h2 className="rinvestigation-title">INVESTIGATION REPORT</h2>
      <button className="custom-button" onClick={() => exportToPrint(report)}>
  <Printer size={20} />
</button>

<button className="custom-button" onClick={goToUpdate}>
  <Pencil size={20} />
</button>
      <div className="rinvestigation-content">
        {/* Personal Details */}
        <h3 className="rinvestigation-section-title">Personal Details</h3>
        <div className="rinvestigation-field">
          <label>Patient Name:</label>
          <span>{report.name || "N/A"}</span>
        </div>
        <div className="rinvestigation-field">
          <label>Age:</label>
          <span>{report.age || "N/A"}</span>
        </div>
        <div className="rinvestigation-field">
          <label>Gender:</label>
          <span>{report.gender || "N/A"}</span>
        </div>
        <div className="rinvestigation-field">
          <label>Date of Birth:</label>
          <span>{report.dob || "N/A"}</span>
        </div>
        <div className="rinvestigation-field">
          <label>Address:</label>
          <span>{report.address || "N/A"}</span>
        </div>
        <div className="rinvestigation-field">
          <label>Email:</label>
          <span>{report.email || "N/A"}</span>
        </div>
        <div className="rinvestigation-field">
          <label>Patient ID:</label>
          <span>{report.patientId || "N/A"}</span>
        </div>

        {/* Investigation Details */}
        <h3 className="rinvestigation-section-title">Investigation Details</h3>
        {["CBR", "ESR", "CRP", "FBS", "PPBS", "RBS", "HBa1c", "RFT", "LFT", "LIPID_PROFILE", "ELECTROLYTES", "URINE", "OTHERS"].map((field) => (
          <div className="rinvestigation-field" key={field}>
            <label>{field}:</label>
            <span>{report[field] || "N/A"}</span>
          </div>
        ))}

        {/* Reports From */}
        <h3 className="rinvestigation-section-title">Reports From</h3>
        {Object.keys(report.REPORTS_FROM || {}).map((field) => (
          <div className="rinvestigation-field" key={field}>
            <label>{field}:</label>
            <span>{report.REPORTS_FROM[field] || "N/A"}</span>
          </div>
        ))}

        {/* Date */}
        <h3 className="rinvestigation-section-title">Date</h3>
        <div className="rinvestigation-field">
          <label>Date:</label>
          <span>{report.date || "N/A"}</span>
        </div>
      </div>
      <button className="rinvestigation-update-button" onClick={goToUpdate}>
        Update Report
      </button>
    </div>
  );
};

export default ReportDetailsINVESTIGATION;