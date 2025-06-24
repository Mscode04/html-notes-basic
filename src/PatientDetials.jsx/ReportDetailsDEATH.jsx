import React, { useState, useEffect } from "react";
import { db } from "../Firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import "./ReportDetailsDEATH.css"; 
import { Printer } from "lucide-react";
import "jspdf-autotable";
import { Pencil } from "lucide-react";

const ReportDetailsDEATH = () => {
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
    navigate(`/main/update-death/${reportId}`); // Navigate to the UpdateDEATH component
  };
  const exportToPrint = (report) => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Death Report - ${report.name}</title>
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
          <h1>Death Report - ${report.name}</h1>
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
  
    // Death Details
    addSectionHeader("Death Details");
    addTable([
      ["Date of Death", report.date || "N/A"],
      ["Time of Death", report.timeOfDeath || "N/A"],
      ["Reason for Death", report.deathReason || "N/A"],
      ["Visited Hospital", report.visitedHospital || "N/A"],
      ["Place of Death", report.deathPlace || "N/A"],
    ]);
  
    // Additional Details
    addSectionHeader("Additional Details");
    addTable([
      ["Main Diagnosis", report.mainDiagnosis || "N/A"],
      ["Medical History", report.medicalHistory || "N/A"],
      ["Current Difficulties", report.currentDifficulties || "N/A"],
      ["Main Caretaker", report.mainCaretaker || "N/A"],
      ["Main Caretaker Phone", report.mainCaretakerPhone || "N/A"],
    
    ]);
  
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
    <div className="rdeath-container">
      <button className="rdeath-back-button" onClick={goBack}>
        &larr; Back
      </button>
      <h2 className="rdeath-title">DEATH Report Details</h2>
            <button className="custom-button" onClick={() => exportToPrint(report)}>
        <Printer size={20} />
      </button>
      
      <button className="custom-button" onClick={goToUpdate}>
        <Pencil size={20} />
      </button>
      <div className="rdeath-content">
        {/* Personal Details */}
        <h3 className="rdeath-section-title">Personal Details</h3>
        <div className="rdeath-field">
          <label>Patient Name:</label>
          <span>{report.name || "N/A"}</span>
        </div>
        <div className="rdeath-field">
          <label>Age:</label>
          <span>{report.age || "N/A"}</span>
        </div>
        <div className="rdeath-field">
          <label>Gender:</label>
          <span>{report.gender || "N/A"}</span>
        </div>
        <div className="rdeath-field">
          <label>Date of Birth:</label>
          <span>{report.dob || "N/A"}</span>
        </div>
        <div className="rdeath-field">
          <label>Address:</label>
          <span>{report.address || "N/A"}</span>
        </div>
        <div className="rdeath-field">
          <label>Email:</label>
          <span>{report.email || "N/A"}</span>
        </div>
        <div className="rdeath-field">
          <label>Patient ID:</label>
          <span>{report.patientId || "N/A"}</span>
        </div>

        {/* Death Details */}
        <h3 className="rdeath-section-title">Death Details</h3>
        <div className="rdeath-field">
          <label>Date of Death:</label>
          <span>{report.date || "N/A"}</span>
        </div>
        <div className="rdeath-field">
          <label>Time of Death:</label>
          <span>{report.timeOfDeath || "N/A"}</span>
        </div>
        <div className="rdeath-field">
          <label>Reason for Death:</label>
          <span>{report.deathReason || "N/A"}</span>
        </div>
        <div className="rdeath-field">
          <label>Visited Hospital:</label>
          <span>{report.visitedHospital || "N/A"}</span>
        </div>
        <div className="rdeath-field">
          <label>Place of Death:</label>
          <span>{report.deathPlace || "N/A"}</span>
        </div>

        {/* Additional Details */}
        <h3 className="rdeath-section-title">Additional Details</h3>
        <div className="rdeath-field">
          <label>Main Diagnosis:</label>
          <span>{report.mainDiagnosis || "N/A"}</span>
        </div>
        <div className="rdeath-field">
          <label>Medical History:</label>
          <span>{report.medicalHistory || "N/A"}</span>
        </div>
        <div className="rdeath-field">
          <label>Current Difficulties:</label>
          <span>{report.currentDifficulties || "N/A"}</span>
        </div>
        <div className="rdeath-field">
          <label>Main Caretaker:</label>
          <span>{report.mainCaretaker || "N/A"}</span>
        </div>
        <div className="rdeath-field">
          <label>Main Caretaker Phone:</label>
          <span>{report.mainCaretakerPhone || "N/A"}</span>
        </div>
        <div className="rdeath-field">
          <label>Neighbour Name:</label>
          <span>{report.neighbourName || "N/A"}</span>
        </div>
        <div className="rdeath-field">
          <label>Neighbour Phone:</label>
          <span>{report.neighbourPhone || "N/A"}</span>
        </div>
        <div className="rdeath-field">
          <label>Referral Person:</label>
          <span>{report.referralPerson || "N/A"}</span>
        </div>
        <div className="rdeath-field">
          <label>Referral Phone:</label>
          <span>{report.referralPhone || "N/A"}</span>
        </div>
        <div className="rdeath-field">
          <label>Ward:</label>
          <span>{report.ward || "N/A"}</span>
        </div>
        <div className="rdeath-field">
          <label>Ward Member:</label>
          <span>{report.wardMember || "N/A"}</span>
        </div>
        <div className="rdeath-field">
          <label>Ward Member Phone:</label>
          <span>{report.wardMemberPhone || "N/A"}</span>
        </div>
      </div>
      <button className="rdeath-update-button" onClick={goToUpdate}>
        Update Report
      </button>
    </div>
  );
};

export default ReportDetailsDEATH;