import React, { useState, useEffect } from "react";
import { db } from "../Firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import "./ReportDetailsDHC.css"; // Import the CSS file
import { Printer } from "lucide-react";
import "jspdf-autotable";
import { Pencil ,Download} from "lucide-react";
const ReportDetailsDHC = () => {
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
    navigate(`/main/update-dhc/${reportId}`); // Navigate to the UpdateDHC component
  };

  if (loading) {
    return <p>         <div className="loading-container">
    <img
      src="https://media.giphy.com/media/YMM6g7x45coCKdrDoj/giphy.gif"
      alt="Loading..."
      className="loading-image"
    />
  </div></p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const exportToPrint = (report) => {
    // Create a new window for printing
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>DHC Report - ${report.name}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 10px;
              font-size: 10px; /* Reduced font size */
            }
            h1 {
              font-size: 16px; /* Reduced font size */
              color: #283593;
              margin-bottom: 15px;
            }
            .section-header {
              font-size: 11px; /* Reduced font size */
              background-color: #d3d3d3;
              padding: 3px; /* Reduced padding */
              margin-top: 8px;
              margin-bottom: 3px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 8px; /* Reduced margin */
              page-break-inside: avoid; /* Avoid breaking tables across pages */
            }
            table, th, td {
              border: 1px solid #ddd;
            }
            th, td {
              padding: 4px; /* Reduced padding */
              text-align: left;
              font-size: 10px; /* Reduced font size */
            }
            th {
              background-color: #f5f5f5;
            }
            tr:nth-child(even) {
              background-color: #f9f9f9;
            }
            @media print {
              .section {
                page-break-inside: avoid; /* Avoid breaking sections across pages */
              }
            }
          </style>
        </head>
        <body>
          <h1>DHC Report - ${report.name}</h1>
    `);
  
    const addSectionHeader = (text) => {
      printWindow.document.write(`
        <div class="section-header">${text}</div>
      `);
    };
  
    const addTable = (data) => {
      printWindow.document.write(`
        <table>
          <tbody>
            ${data
              .map(
                (row) => `
              <tr>
                ${row
                  .map(
                    (cell) => `
                  <td>${cell}</td>
                `
                  )
                  .join("")}
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      `);
    };
  
    // Personal Details Section
    printWindow.document.write('<div class="section">');
    addSectionHeader("Personal Details");
    addTable([
      ["Reg No", report.registernumber || "N/A"],
      ["Reported BY", report.team1 || "N/A"],
      ["Date", report.date || "N/A"],
      ["Patient Name", report.name || "N/A"],
      ["Age", report.age || "N/A"],
      ["Gender", report.gender || "N/A"],
      ["Address", report.address || "N/A"],
      ["Main Diagnosis", report.mainDiagnosis || "N/A"],
      ["Patient ID", report.patientId || "N/A"],
    ]);
    printWindow.document.write('</div>');
  
    // First Impression Section
    printWindow.document.write('<div class="section">');
    addSectionHeader("First Impression");
    addTable([["First Impressions", report.firstImpression || "N/A"]]);
    printWindow.document.write('</div>');
  
    // Awareness Section
    printWindow.document.write('<div class="section">');
    addSectionHeader("Awareness");
    addTable([
      ["Patient Awareness", report.patientAwareness || "N/A"],
      ["Caretaker Awareness", report.caretakerAwareness || "N/A"],
      ["Extra Details Awareness", report.extraDetailsAwareness || "N/A"],
    ]);
    printWindow.document.write('</div>');
  
    // Habits Section
    printWindow.document.write('<div class="section">');
    addSectionHeader("Habits");
    addTable([
      ["Bad Habit", report.badHabit || "N/A"],
      ["More About Bad Habits", report.moreAboutBadHabits || "NOT HAVE BAD HABITS"],
      ["Entertainments", report.entertainmentTime || "N/A"],
    ]);
    printWindow.document.write('</div>');

    // Basic Matters Section
    printWindow.document.write('<div class="section">');
    addSectionHeader("Basic Matters");
    addTable([
      ["Food", report.food || "N/A"],
      ["Thirst", report.thirst || "N/A"],
      ["Digestion", report.digestion || "N/A"],
      ["Drink", report.drink || "N/A"],
      ["Pee", report.pee || "N/A"],
      ["Poop", report.pop || "N/A"],
      ["Sleep", report.sleep || "N/A"],
      ["Breath", report.breath || "N/A"],
      ["Self Hygiene", report.selfHygiene || "N/A"],
      ["Basic Matters Notes", report.basicMattersNotes || "N/A"],
      ["Sexuality", report.sexuality || "N/A"],
    ]);
    printWindow.document.write('</div>');

    // Exercise Section
    printWindow.document.write('<div class="section">');
    addSectionHeader("Exercise");
    addTable([
      ["Exercise", report.exercise || "N/A"],
      ["Exercise Frequency", report.exerciseFrequency || "N/A"],
      ["Exercise Notes", report.exerciseNotes || "N/A"],
    ]);
    printWindow.document.write('</div>');

    // Surroundings Section
    printWindow.document.write('<div class="section">');
    addSectionHeader("Surroundings");
    addTable([
     
      ["House", report.house || "N/A"],
      ["Bedroom", report.bedroom || "N/A"],
      ["Bed", report.bed || "N/A"],
      ["Dress", report.dress || "N/A"],
      ["More Details Surroundings", report.addmoresurroundings || "N/A"],
    ]);
    printWindow.document.write('</div>');

    // General Matters Section
    printWindow.document.write('<div class="section">');
    addSectionHeader("General Matters");
    addTable([
      ["General Status", report.generalStatus || "N/A"],
      ["Patient Currently", report.patientCurrently || "N/A"],
      ["Memory Status", report.memoryStatus || "N/A"],
      ["Response Status", report.responseStatus || "N/A"],
      ["Activity Score", report.activityScore || "N/A"],
      ["Add More General", report.addmoregeneral || "N/A"],
    ]);
    printWindow.document.write('</div>');

    // Head to Foot Checkup Section
    printWindow.document.write('<div class="section">');
    addSectionHeader("Head to Foot Checkup");
    addTable([
      ["Scalp", report.scalp || "N/A"],
      ["Hair", report.hair || "N/A"],
      ["Skin", report.skin || "N/A"],
      ["Nails", report.nails || "N/A"],
      ["Mouth", report.mouth || "N/A"],
      ["Perineum", report.perineum || "N/A"],
      ["Hidden Spaces", report.hiddenSpaces || "N/A"],
      ["Pressure Spaces", report.pressureSpaces || "N/A"],
      ["Joints", report.joints || "N/A"],
      ["Head to Foot Notes", report.headToFootNotes || "N/A"],
    ]);
    printWindow.document.write('</div>');

    // Vital Signs Section
    printWindow.document.write('<div class="section">');
    addSectionHeader("Vital Signs");
    addTable([
      ["BP", `${report.bp || "N/A"} mmHg - ${report.ulLl || ""} - ${report.position || ""}`],
      ["RR", `${report.rr || ""} Mt - ${report.rrType || ""}`],
      ["Pulse", `${report.pulse || ""} Mt - ${report.pulseType || ""}`],
      ["Temperature", `${report.pulse || ""} °F - ${report.temperatureType || ""}`],
      ["SpO2", `${report.pulse || ""} %`],
      ["GCS", `${report.gcs || ""} /15`],
      ["GRBS", `${report.grbs || ""} mg/dl`],
    ]);
    printWindow.document.write('</div>');

    // Summary Discussion Section
    printWindow.document.write('<div class="section">');
    addSectionHeader("Summary Discussion");
    addTable([
      ["Discussion and Management :", report.summaryDiscussion || "N/A"],
      ["Special Care Areas", report.specialCareAreas || "N/A"],
      ["ComplimentaryRx", report.complimentaryRx || "N/A"],
      ["Medicine Changes", report.medicineChanges || "N/A"],
      ["Other Activities", report.otherActivities || "N/A"],
      ["Home Care Plan", report.homeCarePlan || "N/A"],
      ["Medical Examination :", report.consultation || "N/A"],
    ]);
    printWindow.document.write('</div>');

    // Miscellaneous Section
    printWindow.document.write('<div class="section">');
    addSectionHeader("Miscellaneous");
    addTable([
      ["Form Type", report.formType || "N/A"],
      ["Registration Date", report.registrationDate || "N/A"],
      ["Submitted At", report.submittedAt ? new Date(report.submittedAt).toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }) : "N/A"],
      ["Team 1", report.team1 || "N/A"],
      ["Team 2", report.team2 || "N/A"],
      ["Team 3", report.team3 || "N/A"],
      ["Team 4", report.team4 || "N/A"],
      ["Team 5", report.team5 || "N/A"],
    ]);
    printWindow.document.write('</div>');

    printWindow.document.write(`
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print(); // Trigger the print dialog
};
const exportToPrintshort = (report) => {
  // Create a new window for printing
  const printWindow = window.open("", "_blank");
  printWindow.document.write(`
    <html>
      <head>
        <title>DHC Report - ${report.name}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 10px;
            font-size: 10px; /* Reduced font size */
          }
          h1 {
            font-size: 16px; /* Reduced font size */
            color: #283593;
            margin-bottom: 15px;
          }
          .section-header {
            font-size: 11px; /* Reduced font size */
            background-color: #d3d3d3;
            padding: 3px; /* Reduced padding */
            margin-top: 8px;
            margin-bottom: 3px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 8px; /* Reduced margin */
            page-break-inside: avoid; /* Avoid breaking tables across pages */
          }
          table, th, td {
            border: 1px solid #ddd;
          }
          th, td {
            padding: 4px; /* Reduced padding */
            text-align: left;
            font-size: 10px; /* Reduced font size */
          }
          th {
            background-color: #f5f5f5;
          }
          tr:nth-child(even) {
            background-color: #f9f9f9;
          }
          @media print {
            .section {
              page-break-inside: avoid; /* Avoid breaking sections across pages */
            }
          }
        </style>
      </head>
      <body>
        <h1>DHC Report - ${report.name}</h1>
  `);

  const addSectionHeader = (text) => {
    printWindow.document.write(`
      <div class="section-header">${text}</div>
    `);
  };

  const addTable = (data) => {
    printWindow.document.write(`
      <table>
        <tbody>
          ${data
            .map(
              (row) => `
            <tr>
              ${row
                .map(
                  (cell) => `
                <td>${cell}</td>
              `
                )
                .join("")}
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    `);
  };

  // Personal Details Section
  printWindow.document.write('<div class="section">');
  addSectionHeader("Personal Details");
  addTable([
    ["Reg No", report.registernumber || "N/A"],
    ["Reported BY", report.team1 || "N/A"],
    ["Date", report.date || "N/A"],
    ["Patient Name", report.name || "N/A"],
    ["Main Diagnosis", report.mainDiagnosis || "N/A"],
    
  ]);
  printWindow.document.write('</div>');

  // First Impression Section
  printWindow.document.write('<div class="section">');
  addSectionHeader("First Impression");
  addTable([["First Impressions", report.firstImpression || "N/A"]]);
  printWindow.document.write('</div>');


  // Basic Matters Section
  printWindow.document.write('<div class="section">');
  addSectionHeader("Basic Matters");
  addTable([
    ["Basic Matters Notes", report.basicMattersNotes || "N/A"],
  ]);
  printWindow.document.write('</div>');

  // General Matters Section
  printWindow.document.write('<div class="section">');
  addSectionHeader("General Matters");
  addTable([
    ["General Status", report.generalStatus || "N/A"],
    ["Patient Currently", report.patientCurrently || "N/A"],
    ["Activity Score", report.activityScore || "N/A"],
    ["Add More General", report.addmoregeneral || "N/A"],
    ["Add More General", report.financialsituation || "N/A"],
  ]);
  printWindow.document.write('</div>');

 

  // Vital Signs Section
  printWindow.document.write('<div class="section">');
  addSectionHeader("Vital Signs");
  addTable([
    ["BP", `${report.bp || "N/A"} mmHg - ${report.ulLl || ""} - ${report.position || ""}`],
    ["RR", `${report.rr || ""} Mt - ${report.rrType || ""}`],
    ["Pulse", `${report.pulse || ""} Mt - ${report.pulseType || ""}`],
    ["Temperature", `${report.pulse || ""} °F - ${report.temperatureType || ""}`],
    ["SpO2", `${report.pulse || ""} %`],
    ["GCS", `${report.gcs || ""} /15`],
    ["GRBS", `${report.grbs || ""} mg/dl`],
  ]);
  printWindow.document.write('</div>');

  // Summary Discussion Section
  printWindow.document.write('<div class="section">');
  addSectionHeader("Summary Discussion");
  addTable([
    ["Discussion and Management :", report.summaryDiscussion || "N/A"],
    ["Special Care Areas", report.specialCareAreas || "N/A"],
    ["ComplimentaryRx", report.complimentaryRx || "N/A"],
    ["Medicine Changes", report.medicineChanges || "N/A"],
    ["Other Activities", report.otherActivities || "N/A"],
    ["Home Care Plan", report.homeCarePlan || "N/A"],
    ["Medical Examination :", report.consultation || "N/A"],
  ]);
  printWindow.document.write('</div>');

  // Miscellaneous Section
  printWindow.document.write('<div class="section">');
  addSectionHeader("Miscellaneous");
  addTable([
    ["Form Type", report.formType || "N/A"],
    ["Registration Date", report.registrationDate || "N/A"],
    ["Submitted At", report.submittedAt ? new Date(report.submittedAt).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }) : "N/A"],
  ]);
  printWindow.document.write('</div>');

  printWindow.document.write(`
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.print(); // Trigger the print dialog
};

  if (!report) {
    return <p>No report found.</p>;
  }

  return (
    <div className="rdhc-container">
      <button className="rdhc-back-button" onClick={goBack}>
        &larr; Back
      </button>
      <h2 className="rdhc-title">DHC OF {report.name}</h2>
      <button className="custom-button" onClick={() => exportToPrint(report)}>
  < Download size={20} />
</button>
<button className="custom-button" onClick={() => exportToPrintshort(report)}>
  <Printer  size={20} />
</button>
<button className="custom-button" onClick={goToUpdate}>
  <Pencil size={20} />
</button>
      <div className="rdhc-content">
        {/* Personal Details */}
        <h3 className="rnhc-section-title">Personal Details</h3>
        <div className="rnhc-field">
          <label>Reg No:</label>
          <span>{report.registernumber || "N/A"}</span>
        </div>
        <div className="rnhc-field">
          <label>Date:</label>
          <span>{report.date || "N/A"}</span>
        </div>
        <div className="rnhc-field">
          <label>Reported BY:</label>
          <span>{report.team1 || "N/A"}</span>
        </div>
        <div className="rnhc-field">
          <label>Patient Name:</label>
          <span>{report.name || "N/A"}</span>
        </div>
        <div className="rnhc-field">
          <label>Age:</label>
          <span>{report.age || "N/A"}</span>
        </div>
        <div className="rnhc-field">
          <label>Gender:</label>
          <span>{report.gender || "N/A"}</span>
        </div>
        {/* <div className="rnhc-field">
          <label>Date of Birth:</label>
          <span>{report.dob || "N/A"}</span>
        </div> */}
        <div className="rnhc-field">
          <label>Address:</label>
          <span>{report.address || "N/A"}</span>
        </div>
        {/* <div className="rnhc-field">
          <label>Email:</label>
          <span>{report.email || "N/A"}</span>
        </div> */}
           <div className="rnhc-field">
          <label>Main Diagnosis:</label>
          <span>{report.mainDiagnosis || "N/A"}</span>
        </div>
        <div className="rnhc-field">
          <label>Patient ID:</label>
          <span>{report.patientId || "N/A"}</span>
        </div>

        <h3 className="rnhc-section-title">First Impression</h3>
        <div className="rnhc-field">
          <label>First Impressions:</label>
          <span>{report.firstImpression || "N/A"}</span>
        </div>
        <h3 className="rnhc-section-title">Awareness</h3>
        <div className="rnhc-field">
          <label>Patient Awareness:</label>
          <span>{report.patientAwareness || "N/A"}</span>
        </div>
        <div className="rnhc-field">
          <label>Caretaker Awarenesss:</label>
          <span>{report.caretakerAwareness || "N/A"}</span>
        </div>
        <div className="rnhc-field">
          <label>Extra Details Awareness:</label>
          <span>{report.extraDetailsAwareness || "N/A"}</span>
        </div>

        <h3 className="rnhc-section-title">Habits</h3>
        <div className="rnhc-field">
          <label>Bad Habit:</label>
          <span>{report.badHabit || "N/A"}</span>
        </div>
        <div className="rnhc-field">
          <label>More About Bad Habits:</label>
          <span>{report.moreAboutBadHabits || "NOT HAVE BAD HABITS"}</span>
        </div>
        <div className="rnhc-field">
          <label>Entertainments:</label>
          <span>{report.entertainmentTime || "N/A"}</span>
        </div>


<h3 className="rnhc-section-title">Basic Matters</h3>
<div className="rnhc-field">
  <label>Food:</label>
  <span>{report.food || "N/A"}</span>
</div>
<div className="rnhc-field">
  <label>Thirst:</label>
  <span>{report.thirst || "N/A"}</span>
</div>
<div className="rnhc-field">
  <label>Digestion:</label>
  <span>{report.digestion|| "N/A"}</span>
</div>
<div className="rnhc-field">
  <label>Drink:</label>
  <span>{report.drink || "N/A"}</span>
</div>
<div className="rnhc-field">
  <label>Pee:</label>
  <span>{report.pee || "N/A"}</span>
</div>
<div className="rnhc-field">
  <label>Poop:</label>
  <span>{report.pop || "N/A"}</span>
</div>
<div className="rnhc-field">
  <label>Sleep:</label>
  <span>{report.sleep || "N/A"}</span>
</div>
<div className="rnhc-field">
  <label>Breath:</label>
  <span>{report.breath || "N/A"}</span>
</div>

<div className="rnhc-field">
  <label>Self Hygiene:</label>
  <span>{report.selfHygiene || "N/A"}</span>
</div>
<div className="rnhc-field">
  <label>Basic Matters Notes:</label>
  <span>{report.basicMattersNotes || "N/A"}</span>
</div>
<div className="rnhc-field">
  <label>Sexuality:</label>
  <span>{report.sexuality || "N/A"}</span>
</div>


<h3 className="rnhc-section-title">Exercise</h3>
<div className="rnhc-field">
  <label>Exercise:</label>
  <span>{report.exercise || "N/A"}</span>
</div>
<div className="rnhc-field">
  <label>Exercise Frequency:</label>
  <span>{report.exerciseFrequency || "N/A"}</span>
</div>
<div className="rnhc-field">
  <label>Exercise Notes:</label>
  <span>{report.exercisenotes || "N/A"}</span>
</div>



<h3 className="rnhc-section-title">Surroundings</h3>
<div className="rnhc-field">
  <label>House:</label>
  <span>{report.houseCleanliness || "N/A"}</span>
</div>
<div className="rnhc-field">
  <label>Surroundings:</label>
  <span>{report.surroundingsCleanliness || "N/A"}</span>
</div>
<div className="rnhc-field">
  <label>Bedroom:</label>
  <span>{report.bedroomCleanliness || "N/A"}</span>
</div>
<div className="rnhc-field">
  <label>Bed:</label>
  <span>{report.bedCleanliness || "N/A"}</span>
</div>
<div className="rnhc-field">
  <label>Dress:</label>
  <span>{report.dressCleanliness || "N/A"}</span>
</div>
<div className="rnhc-field">
  <label>More Details Surroundings:</label>
  <span>{report.addmoresurroundings || "N/A"}</span>
</div>

<h3 className="rnhc-section-title">General Matters</h3>
        <div className="rnhc-field">
          <label>General Status:</label>
          <span>{report.generalStatus || "N/A"}</span>
        </div>
        <div className="rnhc-field">
          <label>Patient Currently:</label>
          <span>{report.patientCurrently || "N/A"}</span>
        </div>
        <div className="rnhc-field">
          <label>Memory Status:</label>
          <span>{report.memoryStatus || "N/A"}</span>
        </div>
        <div className="rnhc-field">
          <label>Response Status:</label>
          <span>{report.responseStatus || "N/A"}</span>
        </div>
        <div className="rnhc-field">
          <label>Activity Score:</label>
          <span>{report.activityScore || "N/A"}</span>
        </div>
        <div className="rnhc-field">
          <label>Add More General:</label>
          <span>{report.addmoregeneral || "N/A"}</span>
        </div>



        <h3 className="rnhc-section-title">Head to Foot Checkup</h3>

<div className="rnhc-field">
  <label>Scalp:</label> 
  <span>{report.scalp || "N/A"}</span>
</div>
<div className="rnhc-field">
  <label>Hair:</label> 
  <span>{report.hair || "N/A"}</span>
</div>
<div className="rnhc-field">
  <label>Skin:</label> 
  <span>{report.skin || "N/A"}</span>
</div>
<div className="rnhc-field">
  <label>Nails:</label> 
  <span>{report.nails || "N/A"}</span>
</div>
<div className="rnhc-field">
  <label>Mouth:</label> 
  <span>{report.mouth || "N/A"}</span>
</div>
<div className="rnhc-field">
  <label>Perineum:</label> 
  <span>{report.perineum || "N/A"}</span>
</div>
<div className="rnhc-field">
  <label>Hidden Spaces:</label> 
  <span>{report.hiddenSpaces || "N/A"}</span>
</div>
<div className="rnhc-field">
  <label>Pressure Spaces:</label> 
  <span>{report.pressureSpaces || "N/A"}</span>
</div>
<div className="rnhc-field">
  <label>Joints:</label> 
  <span>{report.joints || "N/A"}</span>
</div>
<div className="rnhc-field">
  <label>Head to Foot Notes:</label> 
  <span>{report.headToFootNotes || "N/A"}</span>
</div>



<h3 className="rnhc-section-title">Vital Signs</h3>
        <div className="rnhc-field">
          <label>BP:</label>
          <span>{report.bp || "N/A"} mmHg  -  {report.ulLl || " "} - {report.position || " "}</span>
        </div>
        <div className="rnhc-field">
          <label>RR:</label>
          <span>{report.rr || ""} Mt  -  {report.rrType || ""} </span>
        </div>
        <div className="rnhc-field">
          <label>Pulse:</label>
          <span>{report.pulse || ""} Mt  -  {report.pulseType || ""} </span>
        </div>
        <div className="rnhc-field">
          <label>Temperature:</label>
          <span>{report.pulse || ""} °F  -  {report.temperatureType || ""} </span>
        </div>
        <div className="rnhc-field">
          <label>SpO2:</label>
          <span>{report.pulse || ""} %</span>
        </div>
        <div className="rnhc-field">
          <label>GCS:</label>
          <span>{report.gcs || ""} /15</span>
        </div>
        <div className="rnhc-field">
          <label>GRBS:</label>
          <span>{report.grbs || ""} mg/dl</span>
        </div>




        <h3 className="rnhc-section-title">Summary Discussion</h3>
        <div className="rnhc-field">
          <label>Discussion and Management :</label>
          <span>{report.summaryDiscussion || "N/A"}</span>
        </div>
     
        {/* <div className="rnhc-field">
          <label>Medical History:</label>
          <span>{report.medicalHistory || "N/A"}</span>
        </div> */}
        <div className="rnhc-field">
          <label>Special Care Areas:</label>
          <span>{report.specialCareAreas || "N/A"}</span>
        </div>
        <div className="rnhc-field">
          <label>ComplimentaryRx:</label>
          <span>{report.complimentaryRx || "N/A"}</span>
        </div>
        <div className="rnhc-field">
          <label>Medicine Changes:</label>
          <span>{report.medicineChanges || "N/A"}</span>
        </div>
        <div className="rnhc-field">
          <label>Activities :</label>
          <span>{report.otherActivities || "N/A"}</span>
        </div>
        {/* <div className="rnhc-field">
          <label>Current Difficulties:</label>
          <span>{report.currentDifficulties || "N/A"}</span>
        </div> */}
        <div className="rnhc-field">
          <label>Home Care Plan:</label>
          <span>{report.homeCarePlan || "N/A"}</span>
        </div>
        <div className="rnhc-field">
          <label>Medical Examination :</label>
          <span>{report.consultation || "N/A"}</span>
        </div>
     

        <h3 className="rnhc-section-title">Miscellaneous</h3>
        <div className="rnhc-field">
          <label>Form Type:</label>
          <span>{report.formType || "N/A"}</span>
        </div>
        <div className="rnhc-field">
          <label>Registration Date:</label>
          <span>{report.registrationDate || "N/A"}</span>
        </div>
        <div className="rnhc-field">
  <label>Submitted At:</label>
  <span>
    {report.submittedAt
      ? new Date(report.submittedAt).toLocaleString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      : "N/A"}
  </span>
</div>

        <div className="rnhc-field">
          <label>Team 1:</label>
          <span>{report.team1 || "N/A"}</span>
        </div>
        <div className="rnhc-field">
          <label>Team 2:</label>
          <span>{report.team2 || "N/A"}</span>
        </div>
        <div className="rnhc-field">
          <label>Team 3:</label>
          <span>{report.team3 || "N/A"}</span>
        </div>
        <div className="rnhc-field">
          <label>Team 4:</label>
          <span>{report.team4 || "N/A"}</span>
        </div>
        <div className="rnhc-field">
          <label>Team 5:</label>
          <span>{report.team5 || "N/A"}</span>
        </div>
      </div>
   
    </div>
  );
};

export default ReportDetailsDHC;