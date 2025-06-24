import React, { useState, useEffect } from "react";
import { db } from "../Firebase/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./UpdateSOCIAL.css";

const UpdateSOCIAL = () => {
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

  const handleChange = (e, index) => {
    const { name, value } = e.target;

    if (name.startsWith("dynamic")) {
      const fieldName = name.split("-")[1];
      const updatedDynamicFields = [...report.dynamicFields];
      updatedDynamicFields[index][fieldName] = value;

      setReport((prevData) => ({
        ...prevData,
        dynamicFields: updatedDynamicFields,
      }));
    } else {
      setReport((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const addDynamicField = () => {
    setReport((prevData) => ({
      ...prevData,
      dynamicFields: [
        ...prevData.dynamicFields,
        {
          freq: "",
          feaDate: "",
          cat: "",
          catDate: "",
        },
      ],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const reportRef = doc(db, "Reports", reportId);
      await updateDoc(reportRef, report);
      toast.success("Report updated successfully!");
      setTimeout(() => {
        navigate(-1); // Navigate back to the report details page
      }, 2000);
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
    <div className="UpdateSOCIAL-container">
      <button className="UpdateSOCIAL-back-button" onClick={() => navigate(-1)}>
        ← Back
      </button>
      <h2 className="UpdateSOCIAL-title">Update Social Report</h2>
      <form onSubmit={handleSubmit} className="UpdateSOCIAL-form">
        {/* General Details */}
        <h3 className="UpdateSOCIAL-section-title">General Details</h3>
        <div className="UpdateSOCIAL-field">
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
        <div className="UpdateSOCIAL-field">
          <label>Food:</label>
          <input
            type="text"
            name="food"
            value={report.food || ""}
            onChange={handleChange}
          />
        </div>
        <div className="UpdateSOCIAL-field">
          <label>Education:</label>
          <input
            type="text"
            name="edn"
            value={report.edn || ""}
            onChange={handleChange}
          />
        </div>
        <div className="UpdateSOCIAL-field">
          <label>Others:</label>
          <input
            type="text"
            name="others"
            value={report.others || ""}
            onChange={handleChange}
          />
        </div>

        {/* Dynamic Fields */}
        <h3 className="UpdateSOCIAL-section-title">Dynamic Fields</h3>
        {report.dynamicFields?.map((field, index) => (
          <div key={index} className="UpdateSOCIAL-dynamic-field-group">
            <div className="UpdateSOCIAL-field">
              <label>Frequency:</label>
              <input
                type="text"
                name={`dynamic-freq`}
                value={field.freq || ""}
                onChange={(e) => handleChange(e, index)}
              />
            </div>
            <div className="UpdateSOCIAL-field">
              <label>FEA Date:</label>
              <input
                type="date"
                name={`dynamic-feaDate`}
                value={field.feaDate || ""}
                onChange={(e) => handleChange(e, index)}
              />
            </div>
            <div className="UpdateSOCIAL-field">
              <label>Category:</label>
              <input
                type="text"
                name={`dynamic-cat`}
                value={field.cat || ""}
                onChange={(e) => handleChange(e, index)}
              />
            </div>
            <div className="UpdateSOCIAL-field">
              <label>Category Date:</label>
              <input
                type="date"
                name={`dynamic-catDate`}
                value={field.catDate || ""}
                onChange={(e) => handleChange(e, index)}
              />
            </div>
          </div>
        ))}
        <button
          type="button"
          className="UpdateSOCIAL-add-btn"
          onClick={addDynamicField}
        >
          Add More
        </button>

        <button type="submit" className="UpdateSOCIAL-update-button">
          Update Report
        </button>
      </form>
      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
};

export default UpdateSOCIAL;