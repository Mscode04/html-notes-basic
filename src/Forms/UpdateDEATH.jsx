import React, { useState, useEffect } from "react";
import { db } from "../Firebase/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./UpdateDEATH.css"; // Import the updated CSS file

const UpdateDEATH = () => {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReport((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const reportRef = doc(db, "Reports", reportId);
      await updateDoc(reportRef, report);
      toast.success("Report updated successfully!"); // Show success toast
      setTimeout(() => {
        navigate(-1); // Navigate back after 2 seconds
      }, 2000);
    } catch (error) {
      console.error("Error updating report: ", error);
      toast.error("Failed to update report. Please try again later."); // Show error toast
    }
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
    <div className="UpdateDEATH-container">
      <ToastContainer position="top-center" autoClose={2000} /> {/* Toast container */}
      <button className="UpdateDEATH-back-button" onClick={() => navigate(-1)}>
        &larr; Back
      </button>
      <h2 className="UpdateDEATH-title">Update DEATH Report</h2>
      <form onSubmit={handleSubmit} className="UpdateDEATH-form">
        {/* Death Details */}
        <h3 className="UpdateDEATH-section-title">Death Details</h3>
        <div className="UpdateDEATH-field">
          <label>Date of Death:</label>
          <input
            type="date"
            name="date"
            value={report.date || ""}
            onChange={handleChange}
          />
        </div>
        <div className="DeathAdd-field">
          <label>Reported By:</label>
          <input type="text" name="team1" value={report.team1 || ""} onChange={handleChange} required />
        </div>
        <div className="UpdateDEATH-field">
          <label>Time of Death:</label>
          <input
            type="time"
            name="timeOfDeath"
            value={report.timeOfDeath || ""}
            onChange={handleChange}
          />
        </div>
        <div className="UpdateDEATH-field">
          <label>Reason for Death:</label>
          <textarea
            name="deathReason"
            value={report.deathReason || ""}
            onChange={handleChange}
          />
        </div>
        <div className="UpdateDEATH-field">
          <label>Visited Hospital:</label>
          <select
            name="visitedHospital"
            value={report.visitedHospital || "No"}
            onChange={handleChange}
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        <div className="UpdateDEATH-field">
          <label>Place of Death:</label>
          <input
            type="text"
            name="deathPlace"
            value={report.deathPlace || ""}
            onChange={handleChange}
          />
        </div>

        {/* Additional Details */}
        <h3 className="UpdateDEATH-section-title">Additional Details</h3>
        <div className="UpdateDEATH-field">
          <label>Main Diagnosis:</label>
          <input
            type="text"
            name="mainDiagnosis"
            value={report.mainDiagnosis || ""}
            onChange={handleChange}
          />
        </div>
        <div className="UpdateDEATH-field">
          <label>Medical History:</label>
          <input
            type="text"
            name="medicalHistory"
            value={report.medicalHistory || ""}
            onChange={handleChange}
          />
        </div>
        <div className="UpdateDEATH-field">
          <label>Current Difficulties:</label>
          <input
            type="text"
            name="currentDifficulties"
            value={report.currentDifficulties || ""}
            onChange={handleChange}
          />
        </div>
        <div className="UpdateDEATH-field">
          <label>Main Caretaker:</label>
          <input
            type="text"
            name="mainCaretaker"
            value={report.mainCaretaker || ""}
            onChange={handleChange}
          />
        </div>
        <div className="UpdateDEATH-field">
          <label>Main Caretaker Phone:</label>
          <input
            type="text"
            name="mainCaretakerPhone"
            value={report.mainCaretakerPhone || ""}
            onChange={handleChange}
          />
        </div>
        <div className="UpdateDEATH-field">
          <label>Neighbour Name:</label>
          <input
            type="text"
            name="neighbourName"
            value={report.neighbourName || ""}
            onChange={handleChange}
          />
        </div>
        <div className="UpdateDEATH-field">
          <label>Neighbour Phone:</label>
          <input
            type="text"
            name="neighbourPhone"
            value={report.neighbourPhone || ""}
            onChange={handleChange}
          />
        </div>
        <div className="UpdateDEATH-field">
          <label>Referral Person:</label>
          <input
            type="text"
            name="referralPerson"
            value={report.referralPerson || ""}
            onChange={handleChange}
          />
        </div>
        <div className="UpdateDEATH-field">
          <label>Referral Phone:</label>
          <input
            type="text"
            name="referralPhone"
            value={report.referralPhone || ""}
            onChange={handleChange}
          />
        </div>
        <div className="UpdateDEATH-field">
          <label>Ward:</label>
          <input
            type="text"
            name="ward"
            value={report.ward || ""}
            onChange={handleChange}
          />
        </div>
        <div className="UpdateDEATH-field">
          <label>Ward Member:</label>
          <input
            type="text"
            name="wardMember"
            value={report.wardMember || ""}
            onChange={handleChange}
          />
        </div>
        <div className="UpdateDEATH-field">
          <label>Ward Member Phone:</label>
          <input
            type="text"
            name="wardMemberPhone"
            value={report.wardMemberPhone || ""}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="UpdateDEATH-update-button">
          Update Report
        </button>
      </form>
    </div>
  );
};

export default UpdateDEATH;