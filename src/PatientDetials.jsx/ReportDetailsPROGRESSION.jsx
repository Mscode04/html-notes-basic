import React, { useState, useEffect } from "react";
import { db } from "../Firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import "./ReportDetailsPROGRESSION.css"; // Import the CSS file
import { Printer,Download } from "lucide-react";
import "jspdf-autotable";
import { Pencil } from "lucide-react";
const ReportDetailsPROGRESSION = () => {
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
          <title>Progression Report - ${report.name}</title>
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
          <h1>Progression Report - ${report.name}</h1>
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
      ["Address", report.address || "N/A"],
    
    ]);
  
    // General Details
    addSectionHeader("General Details");
    addTable([
      ["Time In", report.timeIn || "N/A"],
      ["Time Out", report.timeOut || "N/A"],
      ["HC SI No", report.hcSiNo || "N/A"],
      ["D/N/V/SPHC Number", report.dnvsphcNumber || "N/A"],
      ["Monthly", report.monthly || "N/A"],
      ["Last Home Care", report.lastHomeCare || "N/A"],
      ["Last Home Care Date", report.lastHomeCareDate || "N/A"],
      ["Consultation/Hospitalisation", report.consultationHospitalisation || "N/A"],
      ["Main Activities", report.mainActivities || "N/A"],
      ["Physical Service", report.physicalService || "N/A"],
      ["The Primary Once", report.primaryOnce || "N/A"],
      ["Patient Awareness", report.patientAwareness || "N/A"],
      ["Family Awareness", report.familyAwareness || "N/A"],
      ["Financially", report.financially || "N/A"],
      ["Emotional State", report.emotionalState || "N/A"],
      ["Caretaker", report.caretaker || "N/A"],
      ["Caretaker Type", report.caretakerType || "N/A"],
      ["Community Support", report.communitySupport || "N/A"],
      ["Palliative Team Support", report.palliativeTeamSupport || "N/A"],
      ["Environmental Hygiene", report.environmentalHygiene || "N/A"],
      ["Head to Foot Checkup", report.headToFootCheckup || "N/A"],
      ["Silent Tapes", report.silentTapes || "N/A"],
      ["Activity Mobility", report.activityMobility || "N/A"],
      ["Glassglow", report.glassglow || "N/A"],
      ["General Condition", report.generalCondition || "N/A"],
      ["Care Status", report.careStatus || "N/A"],
      ["Quality of Life", report.qualityOfLife || "N/A"],
      ["Logistic", report.logistic || "N/A"],
      ["HC Plan", report.hcPlan || "N/A"],
      ["Team 1", report.team1 || "N/A"],
      ["Team 2", report.team2 || "N/A"],
      ["Team 3", report.team3 || "N/A"],
      ["Team 4", report.team4 || "N/A"],
      ["Submitted At", report.submittedAt || "N/A"],
    ]);
  
    // Date
    addSectionHeader("Date");
    addTable([]);
  
    printWindow.document.write(`</body></html>`);
    printWindow.document.close();
    printWindow.print();
  };
  
  const exportToPrintshort = (report) => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Progression Report - ${report.name}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { font-size: 18px; color: #283593; margin-bottom: 20px; text-align: center; }
            .section-header { font-size: 14px; font-weight: bold; background-color: #d3d3d3; padding: 5px; margin-top: 10px; text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
            table, th, td { border: 1px solid #ddd; }
            th, td { padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; }
            tr:nth-child(even) { background-color: #f9f9f9; }
          </style>
        </head>
        <body>
          <h1>Progression Report - ${report.name}</h1>
    `);

    const addSectionHeader = (text) => {
        printWindow.document.write(`<div class="section-header">${text}</div>`);
    };

    const addTwoColumnTable = (data) => {
        let rows = "";
        for (let i = 0; i < data.length; i += 2) {
            rows += `<tr>
                      <td><b>${data[i][0]}</b></td><td>${data[i][1]}</td>
                      ${data[i + 1] ? `<td><b>${data[i + 1][0]}</b></td><td>${data[i + 1][1]}</td>` : `<td></td><td></td>`}
                    </tr>`;
        }
        printWindow.document.write(`
          <table>
            <tbody>${rows}</tbody>
          </table>
        `);
    };

    // Personal Details
    addSectionHeader("Personal Details");
    addTwoColumnTable([
      ["Submitted Date", report.submittedAt || "N/A"],
      ["Date", report.date || "N/A"],
        ["Patient Name", report.name || "N/A"],
        ["Age", report.age || "N/A"],
        ["Address", report.address || "N/A"],
        
    ]);

    // General Details
    addSectionHeader("General Details");
    addTwoColumnTable([
        ["Time In", report.timeIn || "N/A"],
        ["Time Out", report.timeOut || "N/A"],
        ["HC SI No", report.hcSiNo || "N/A"],
        ["D/N/V/SPHC Number", report.dnvsphcNumber || "N/A"],
        ["Monthly", report.monthly || "N/A"],
        ["Last Home Care", report.lastHomeCare || "N/A"],
        ["Last Home Care Date", report.lastHomeCareDate || "N/A"],
        ["Consultation/Hospitalisation", report.consultationHospitalisation || "N/A"],
        
        ["Physical Service", report.physicalService || "N/A"],
        ["The Primary Once", report.primaryOnce || "N/A"],
        ["Patient Awareness", report.patientAwareness || "N/A"],
        ["Family Awareness", report.familyAwareness || "N/A"],
        ["Financially", report.financially || "N/A"],
        ["Emotional State", report.emotionalState || "N/A"],
        ["Caretaker", report.caretaker || "N/A"],
        ["Caretaker Type", report.caretakerType || "N/A"],
        ["Community Support", report.communitySupport || "N/A"],
        ["Palliative Team Support", report.palliativeTeamSupport || "N/A"],
        ["Environmental Hygiene", report.environmentalHygiene || "N/A"],
        ["Head to Foot Checkup", report.headToFootCheckup || "N/A"],
        ["Silent Tapes", report.silentTapes || "N/A"],
        ["Activity Mobility", report.activityMobility || "N/A"],
        ["Glassglow", report.glassglow || "N/A"],
        ["General Condition", report.generalCondition || "N/A"],
        ["Care Status", report.careStatus || "N/A"],
        ["Quality of Life", report.qualityOfLife || "N/A"],
        ["Logistic", report.logistic || "N/A"],
        ["HC Plan", report.hcPlan || "N/A"],
        ["Team 1", report.team1 || "N/A"],
        ["Team 2", report.team2 || "N/A"],
        ["Team 3", report.team3 || "N/A"],
        ["Team 4", report.team4 || "N/A"],
        
    ]);


    addSectionHeader("Activities");
    addTwoColumnTable([
      ["Main Activities", report.mainActivities || "N/A"],
    ]);

    printWindow.document.write(`</body></html>`);
    printWindow.document.close();
    printWindow.print();
};


  const goToUpdate = () => {
    navigate(`/main/update-progression/${reportId}`); // Navigate to the UpdatePROGRESSION component
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
    <div className="rprogression-container">
      <button className="rprogression-back-button" onClick={goBack}>
        &larr; Back
      </button>
      <h2 className="rprogression-title">Progression Report Details</h2>
            <button className="custom-button" onClick={() => exportToPrint(report)}>
        < Download size={20} />
      </button>
            <button className="custom-button" onClick={() => exportToPrintshort(report)}>
        <Printer size={20} />
      </button>
      
      
      <button className="custom-button" onClick={goToUpdate}>
        <Pencil size={20} />
      </button>
      <div className="rprogression-content">
        {/* Personal Details */}
        <h3 className="rprogression-section-title">Personal Details</h3>
        <div className="rprogression-field">
          <label>Patient Name:</label>
          <span>{report.name || "N/A"}</span>
        </div>
        <div className="rnhc-field">
          <label>Date:</label>
          <span>{report.date || "N/A"}</span>
        </div>
        <div className="rprogression-field">
          <label>Age:</label>
          <span>{report.age || "N/A"}</span>
        </div>
        <div className="rprogression-field">
          <label>Gender:</label>
          <span>{report.gender || "N/A"}</span>
        </div>
        <div className="rprogression-field">
          <label>Date of Birth:</label>
          <span>{report.dob || "N/A"}</span>
        </div>
        <div className="rprogression-field">
          <label>Address:</label>
          <span>{report.address || "N/A"}</span>
        </div>
        <div className="rprogression-field">
          <label>Email:</label>
          <span>{report.email || "N/A"}</span>
        </div>
        <div className="rprogression-field">
          <label>Patient ID:</label>
          <span>{report.patientId || "N/A"}</span>
        </div>

        {/* General Details */}
        <h3 className="rprogression-section-title">General Details</h3>
        <div className="rprogression-field">
          <label>Time In:</label>
          <span>{report.timeIn || "N/A"}</span>
        </div>
        <div className="rprogression-field">
          <label>Time Out:</label>
          <span>{report.timeOut || "N/A"}</span>
        </div>
        <div className="rprogression-field">
          <label>HC SI No:</label>
          <span>{report.hcSiNo || "N/A"}</span>
        </div>
        <div className="rprogression-field">
          <label>D/N/V/SPHC Number:</label>
          <span>{report.dnvsphcNumber || "N/A"}</span>
        </div>
        <div className="rprogression-field">
          <label>Monthly:</label>
          <span>{report.monthly || "N/A"}</span>
        </div>
        <div className="rprogression-field">
          <label>Last Home Care:</label>
          <span>{report.lastHomeCare || "N/A"}</span>
        </div>
        <div className="rprogression-field">
          <label>Last Home Care Date:</label>
          <span>{report.lastHomeCareDate || "N/A"}</span>
        </div>
        <div className="rprogression-field">
          <label>Consultation/Hospitalisation:</label>
          <span>{report.consultationHospitalisation || "N/A"}</span>
        </div>
        <div className="rprogression-field">
          <label>Main Activities:</label>
          <span>{report.mainActivities || "N/A"}</span>
        </div>
        <div className="rprogression-field">
          <label>Physical Service:</label>
          <span>{report.physicalService || "N/A"}</span>
        </div>
        <div className="rprogression-field">
          <label>The Primary Once:</label>
          <span>{report.primaryOnce || "N/A"}</span>
        </div>
        <div className="rprogression-field">
          <label>Patient Awareness:</label>
          <span>{report.patientAwareness || "N/A"}</span>
        </div>
        <div className="rprogression-field">
          <label>Family Awareness:</label>
          <span>{report.familyAwareness || "N/A"}</span>
        </div>
        <div className="rprogression-field">
          <label>Financially:</label>
          <span>{report.financially || "N/A"}</span>
        </div>
        <div className="rprogression-field">
          <label>Emotional State:</label>
          <span>{report.emotionalState || "N/A"}</span>
        </div>
        <div className="rprogression-field">
          <label>Caretaker:</label>
          <span>{report.caretaker || "N/A"}</span>
        </div>
        <div className="rprogression-field">
          <label>Caretaker Type:</label>
          <span>{report.caretakerType || "N/A"}</span>
        </div>
        <div className="rprogression-field">
          <label>Community Support:</label>
          <span>{report.communitySupport || "N/A"}</span>
        </div>
        <div className="rprogression-field">
          <label>Palliative Team Support:</label>
          <span>{report.palliativeTeamSupport || "N/A"}</span>
        </div>
        <div className="rprogression-field">
          <label>Environmental Hygiene:</label>
          <span>{report.environmentalHygiene || "N/A"}</span>
        </div>
        <div className="rprogression-field">
          <label>Head to Foot Checkup:</label>
          <span>{report.headToFootCheckup || "N/A"}</span>
        </div>
        <div className="rprogression-field">
          <label>Silent Tapes:</label>
          <span>{report.silentTapes || "N/A"}</span>
        </div>
        <div className="rprogression-field">
          <label>Activity Mobility:</label>
          <span>{report.activityMobility || "N/A"}</span>
        </div>
        <div className="rprogression-field">
          <label>Glassglow:</label>
          <span>{report.glassglow || "N/A"}</span>
        </div>
        <div className="rprogression-field">
          <label>General Condition:</label>
          <span>{report.generalCondition || "N/A"}</span>
        </div>
        <div className="rprogression-field">
          <label>Care Status:</label>
          <span>{report.careStatus || "N/A"}</span>
        </div>
        <div className="rprogression-field">
          <label>Quality of Life:</label>
          <span>{report.qualityOfLife || "N/A"}</span>
        </div>
        <div className="rprogression-field">
          <label>Logistic:</label>
          <span>{report.logistic || "N/A"}</span>
        </div>
        <div className="rprogression-field">
          <label>HC Plan:</label>
          <span>{report.hcPlan || "N/A"}</span>
        </div>
        <div className="rprogression-field">
          <label>Team 1:</label>
          <span>{report.team1 || "N/A"}</span>
        </div>
        <div className="rprogression-field">
          <label>Team 2:</label>
          <span>{report.team2 || "N/A"}</span>
        </div>
        <div className="rprogression-field">
          <label>Team 3:</label>
          <span>{report.team3 || "N/A"}</span>
        </div>
        <div className="rprogression-field">
          <label>Team 4:</label>
          <span>{report.team4 || "N/A"}</span>
        </div>
        <div className="rprogression-field">
          <label>Submitted At:</label>
          <span>{report.submittedAt || "N/A"}</span>
        </div>
      </div>
      <button className="rprogression-update-button" onClick={goToUpdate}>
        Update Report
      </button>
    </div>
  );
};

export default ReportDetailsPROGRESSION;