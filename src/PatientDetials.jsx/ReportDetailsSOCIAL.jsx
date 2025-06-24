import React, { useState, useEffect } from "react";
import { db } from "../Firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import "./ReportDetailsSOCIAL.css"; // Import the CSS file
import { Printer } from "lucide-react";
import "jspdf-autotable";
import { Pencil } from "lucide-react";
const ReportDetailsSOCIAL = () => {
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

  const goToUpdate = () => {
    navigate(`/main/update-social/${reportId}`); // Navigate to the UpdateSOCIAL component
  };
  const exportToPrint = (report) => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Social Report - ${report.name}</title>
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
          <h1>Social Report - ${report.name}</h1>
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
      ["Date", report.date || "N/A"],
      ["Gender", report.gender || "N/A"],
      ["Date of Birth", report.dob || "N/A"],
      ["Address", report.address || "N/A"],
      ["Email", report.email || "N/A"],
      ["Patient ID", report.patientId || "N/A"],
    ]);
  
    // General Details
    addSectionHeader("General Details");
    addTable([
      ["Date", report.date || "N/A"],
      ["Food", report.food || "N/A"],
      ["Education", report.edn || "N/A"],
      ["Others", report.others || "N/A"],
    ]);
  
    // Dynamic Fields
    if (report.dynamicFields && report.dynamicFields.length > 0) {
      addSectionHeader("Dynamic Fields");
      addTable(report.dynamicFields.map(field => [
        ["Frequency", field.freq || "N/A"],
        ["FEA Date", field.feaDate || "N/A"],
        ["Category", field.cat || "N/A"],
        ["Category Date", field.catDate || "N/A"]
      ]).flat());
    } else {
      printWindow.document.write(`<p>No Dynamic Fields Available</p>`);
    }
  
    printWindow.document.write(`</body></html>`);
    printWindow.document.close();
    printWindow.print();
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
    <div className="rsocial-container">
      <button className="rsocial-back-button" onClick={goBack}>
        &larr; Back
      </button>
      <h2 className="rsocial-title">Social Report Details</h2>
            <button className="custom-button" onClick={() => exportToPrint(report)}>
        <Printer size={20} />
      </button>
      
      <button className="custom-button" onClick={goToUpdate}>
        <Pencil size={20} />
      </button>
      <div className="rsocial-content">
        {/* Personal Details */}
        <h3 className="rsocial-section-title">Personal Details</h3>
        <div className="rsocial-field">
          <label>Patient Name:</label>
          <span>{report.name || "N/A"}</span>
        </div>
        <div className="rnhc-field">
          <label>Date:</label>
          <span>{report.date || "N/A"}</span>
        </div>
        <div className="rsocial-field">
          <label>Age:</label>
          <span>{report.age || "N/A"}</span>
        </div>
        <div className="rsocial-field">
          <label>Gender:</label>
          <span>{report.gender || "N/A"}</span>
        </div>
        <div className="rsocial-field">
          <label>Date of Birth:</label>
          <span>{report.dob || "N/A"}</span>
        </div>
        <div className="rsocial-field">
          <label>Address:</label>
          <span>{report.address || "N/A"}</span>
        </div>
        <div className="rsocial-field">
          <label>Email:</label>
          <span>{report.email || "N/A"}</span>
        </div>
        <div className="rsocial-field">
          <label>Patient ID:</label>
          <span>{report.patientId || "N/A"}</span>
        </div>

        {/* General Details */}
        <h3 className="rsocial-section-title">General Details</h3>
        <div className="rsocial-field">
          <label>Date:</label>
          <span>{report.date || "N/A"}</span>
        </div>
        <div className="rsocial-field">
          <label>Food:</label>
          <span>{report.food || "N/A"}</span>
        </div>
        <div className="rsocial-field">
          <label>Education:</label>
          <span>{report.edn || "N/A"}</span>
        </div>
        <div className="rsocial-field">
          <label>Others:</label>
          <span>{report.others || "N/A"}</span>
        </div>

        {/* Dynamic Fields */}
        <h3 className="rsocial-section-title">Dynamic Fields</h3>
        {report.dynamicFields?.map((field, index) => (
          <div key={index} className="rsocial-dynamic-field-group">
            <div className="rsocial-field">
              <label>Frequency:</label>
              <span>{field.freq || "N/A"}</span>
            </div>
            <div className="rsocial-field">
              <label>FEA Date:</label>
              <span>{field.feaDate || "N/A"}</span>
            </div>
            <div className="rsocial-field">
              <label>Category:</label>
              <span>{field.cat || "N/A"}</span>
            </div>
            <div className="rsocial-field">
              <label>Category Date:</label>
              <span>{field.catDate || "N/A"}</span>
            </div>
          </div>
        ))}
      </div>
      <button className="rsocial-update-button" onClick={goToUpdate}>
        Update Report
      </button>
    </div>
  );
};

export default ReportDetailsSOCIAL;