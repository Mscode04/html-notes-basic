import React, { useState, useEffect } from "react";
import { db } from "../Firebase/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './UpdateINVESTIGATION.css'
const UpdateINVESTIGATION = () => {
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
    if (name.startsWith("REPORTS_FROM_")) {
      const field = name.split("_")[2]; // Extract the field name (ECG, X_RAY, etc.)
      setReport((prevData) => ({
        ...prevData,
        REPORTS_FROM: {
          ...prevData.REPORTS_FROM,
          [field]: value,
        },
      }));
    } else {
      setReport((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const reportRef = doc(db, "Reports", reportId);
      await updateDoc(reportRef, report);
      toast.success("Report updated successfully!");
      setTimeout(() => {
        navigate(`/report-investigation/${reportId}`); // Navigate back to the report details page
      }, 2000); // Delay navigation to show the toast
    } catch (error) {
      console.error("Error updating report: ", error);
      toast.error("Failed to update report. Please try again later.");
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
    <div className="UpdateINVESTIGATION-container">
      <button
        className="UpdateINVESTIGATION-back-button"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>
      <h2 className="UpdateINVESTIGATION-title">Update INVESTIGATION REPORT</h2>
      <form onSubmit={handleSubmit} className="UpdateINVESTIGATION-form">
        {/* Date */}
        <h3 className="UpdateINVESTIGATION-section-title">Date</h3>
        <div className="UpdateINVESTIGATION-field">
          <label>Date:</label>
          <input
            type="date"
            name="date"
            value={report.date || ""}
            onChange={handleChange}
          />
        </div>
        <div className="DeathAdd-field">
          <label>Reported By:</label>
          <input type="text" name="team1" value={report.team1} onChange={handleChange} required />
        </div>

        {/* Investigation Details */}
        <h3 className="UpdateINVESTIGATION-section-title">Investigation Details</h3>
        {["CBR", "ESR", "CRP", "FBS", "PPBS", "RBS", "HBa1c", "RFT", "LFT", "LIPID_PROFILE", "ELECTROLYTES", "URINE", "OTHERS"].map((field) => (
          <div className="UpdateINVESTIGATION-field" key={field}>
            <label>{field}:</label>
            <input
              type="text"
              name={field}
              value={report[field] || ""}
              onChange={handleChange}
            />
          </div>
        ))}

        {/* Reports From */}
        <h3 className="UpdateINVESTIGATION-section-title">Reports From</h3>
        {Object.keys(report.REPORTS_FROM || {}).map((field) => (
  <div className="UpdateINVESTIGATION-field" key={field}>
    <label>{field}:</label>
    <textarea
      name={`REPORTS_FROM_${field}`}
      value={report.REPORTS_FROM[field] || ""}
      onChange={handleChange}
      rows={3} // Adjust row size as needed
      className="textarea-field form-control" // Optional class for styling
    />
  </div>
))}


        <button type="submit" className="UpdateINVESTIGATION-update-button">
          Update Report
        </button>
      </form>
      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
};

export default UpdateINVESTIGATION;