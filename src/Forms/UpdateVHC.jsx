import React, { useState, useEffect } from "react";
import { db } from "../Firebase/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./UpdateVHC.css";

const UpdateVHC = () => {
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
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      const keys = name.split(".");
      if (keys.length === 1) {
        setReport((prevData) => ({
          ...prevData,
          [name]: checked,
        }));
      } else if (keys.length === 2) {
        setReport((prevData) => ({
          ...prevData,
          [keys[0]]: {
            ...prevData[keys[0]],
            [keys[1]]: checked,
          },
        }));
      } else if (keys.length === 3) {
        setReport((prevData) => ({
          ...prevData,
          [keys[0]]: {
            ...prevData[keys[0]],
            [keys[1]]: {
              ...prevData[keys[0]][keys[1]],
              [keys[2]]: checked,
            },
          },
        }));
      }
    } else {
      setReport((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleWelfareBenefitChange = (index, field, value) => {
    const updatedBenefits = [...report.welfareBenefits];
    updatedBenefits[index][field] = value;
    setReport((prevData) => ({
      ...prevData,
      welfareBenefits: updatedBenefits,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const reportRef = doc(db, "Reports", reportId);
      await updateDoc(reportRef, report);
      toast.success("Report updated successfully!");
      setTimeout(() => {
        navigate(`/report-vhc/${reportId}`); // Navigate back to the report details page
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
    <div className="UpdateVHC-container">
      <button className="UpdateVHC-back-button" onClick={() => navigate(-1)}>
        ← Back
      </button>
      <h2 className="UpdateVHC-title">Update VHC Report</h2>
      <form onSubmit={handleSubmit} className="UpdateVHC-form">
        {/* Team Details */}
        <h3 className="UpdateVHC-section-title">Team Details</h3>
        <div className="UpdateVHC-field">
          <label>Team 1:</label>
          <input
            type="text"
            name="team1"
            value={report.team1 || ""}
            onChange={handleChange}
          />
        </div>
        <div className="UpdateVHC-field">
          <label>Team 2:</label>
          <input
            type="text"
            name="team2"
            value={report.team2 || ""}
            onChange={handleChange}
          />
        </div>
        <div className="UpdateVHC-field">
          <label>Team 3:</label>
          <input
            type="text"
            name="team3"
            value={report.team3 || ""}
            onChange={handleChange}
          />
        </div>
        <div className="UpdateVHC-field">
          <label>Team 4:</label>
          <input
            type="text"
            name="team4"
            value={report.team4 || ""}
            onChange={handleChange}
          />
        </div>
        <div className="UpdateVHC-field">
          <label>Other Team Members:</label>
          <input
            type="text"
            name="otherTeamMembers"
            value={report.otherTeamMembers || ""}
            onChange={handleChange}
          />
        </div>

        {/* Disease Information */}
        <h3 className="UpdateVHC-section-title">Disease Information</h3>
        <div className="UpdateVHC-field">
          <label>Disease Information:</label>
          <textarea
            name="diseaseInformation"
            value={report.diseaseInformation || ""}
            onChange={handleChange}
          />
        </div>

        {/* Patient Condition */}
        <h3 className="UpdateVHC-section-title">Patient Condition</h3>
        <div className="UpdateVHC-field">
          <label>Patient Condition:</label>
          <textarea
            name="patientCondition"
            value={report.patientCondition || ""}
            onChange={handleChange}
          />
        </div>

        {/* Financial Situation */}
        <h3 className="UpdateVHC-section-title">Financial Situation</h3>
        {Object.keys(report.financialSituation || {}).map((field) => (
          <div className="UpdateVHC-field" key={field}>
            <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
            <input
              type="checkbox"
              name={`financialSituation.${field}`}
              checked={report.financialSituation[field] || false}
              onChange={handleChange}
            />
          </div>
        ))}

        {/* Welfare Schemes */}
        <h3 className="UpdateVHC-section-title">Welfare Schemes</h3>
        <div className="UpdateVHC-field">
          <label>Ration Card Number:</label>
          <input
            type="text"
            name="welfareSchemes.rationCardNumber"
            value={report.welfareSchemes?.rationCardNumber || ""}
            onChange={handleChange}
          />
        </div>
        <div className="UpdateVHC-field">
          <label>Ration Card Type:</label>
          <select
            name="welfareSchemes.rationCardType"
            value={report.welfareSchemes?.rationCardType || ""}
            onChange={handleChange}
          >
            <option value="apl">APL</option>
            <option value="bpl">BPL</option>
          </select>
        </div>
        <div className="UpdateVHC-field">
          <label>Financial Status:</label>
          <select
            name="welfareSchemes.financialStatus"
            value={report.welfareSchemes?.financialStatus || ""}
            onChange={handleChange}
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        {/* Government Welfare Schemes */}
        <h4 className="UpdateVHC-subsection-title">Government</h4>
        {Object.keys(report.welfareSchemes?.government || {}).map((field) => (
          <div className="UpdateVHC-field" key={field}>
            <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
            <input
              type="checkbox"
              name={`welfareSchemes.government.${field}`}
              checked={report.welfareSchemes.government[field] || false}
              onChange={handleChange}
            />
          </div>
        ))}

        {/* Non-Government Welfare Schemes */}
        <h4 className="UpdateVHC-subsection-title">Non-Government</h4>
        {Object.keys(report.welfareSchemes?.nonGovernment || {}).map((field) => (
          <div className="UpdateVHC-field" key={field}>
            <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
            <input
              type="checkbox"
              name={`welfareSchemes.nonGovernment.${field}`}
              checked={report.welfareSchemes.nonGovernment[field] || false}
              onChange={handleChange}
            />
          </div>
        ))}

        {/* Other Agencies */}
        <h4 className="UpdateVHC-subsection-title">Other Agencies</h4>
        {Object.keys(report.welfareSchemes?.otherAgencies || {}).map((field) => (
          <div className="UpdateVHC-field" key={field}>
            <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
            <input
              type="checkbox"
              name={`welfareSchemes.otherAgencies.${field}`}
              checked={report.welfareSchemes.otherAgencies[field] || false}
              onChange={handleChange}
            />
          </div>
        ))}

        {/* Welfare Benefits */}
        <h3 className="UpdateVHC-section-title">Welfare Benefits</h3>
        {report.welfareBenefits?.map((benefit, index) => (
          <div key={index} className="UpdateVHC-field">
            <label>Full Name:</label>
            <input
              type="text"
              value={benefit.fullName || ""}
              onChange={(e) =>
                handleWelfareBenefitChange(index, "fullName", e.target.value)
              }
            />
            <label>Phone No:</label>
            <input
              type="text"
              value={benefit.phoneNo || ""}
              onChange={(e) =>
                handleWelfareBenefitChange(index, "phoneNo", e.target.value)
              }
            />
            <label>Relation:</label>
            <input
              type="text"
              value={benefit.relation || ""}
              onChange={(e) =>
                handleWelfareBenefitChange(index, "relation", e.target.value)
              }
            />
            <label>Ways to Help:</label>
            <input
              type="text"
              value={benefit.waysToHelp || ""}
              onChange={(e) =>
                handleWelfareBenefitChange(index, "waysToHelp", e.target.value)
              }
            />
          </div>
        ))}

        {/* Physical Condition */}
        <h3 className="UpdateVHC-section-title">Physical Condition</h3>
        {Object.keys(report.physicalCondition || {}).map((field) => (
          <div className="UpdateVHC-field" key={field}>
            <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
            <input
              type="checkbox"
              name={`physicalCondition.${field}`}
              checked={report.physicalCondition[field] || false}
              onChange={handleChange}
            />
          </div>
        ))}

        {/* Home Care Conditions */}
        <h3 className="UpdateVHC-section-title">Home Care Conditions</h3>
        {Object.keys(report.homeCareConditions || {}).map((field) => (
          <div className="UpdateVHC-field" key={field}>
            <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
            <input
              type="checkbox"
              name={`homeCareConditions.${field}`}
              checked={report.homeCareConditions[field] || false}
              onChange={handleChange}
            />
          </div>
        ))}

        {/* Mental Difficulties */}
        <h3 className="UpdateVHC-section-title">Mental Difficulties</h3>
        <div className="UpdateVHC-field">
          <label>Mental Difficulties:</label>
          <textarea
            name="mentalDifficulties"
            value={report.mentalDifficulties || ""}
            onChange={handleChange}
          />
        </div>

        {/* Learned from Family */}
        <h3 className="UpdateVHC-section-title">Learned from Family</h3>
        <div className="UpdateVHC-field">
          <label>Learned from Family:</label>
          <textarea
            name="learnedFromFamily"
            value={report.learnedFromFamily || ""}
            onChange={handleChange}
          />
        </div>

        {/* Volunteer Suggestions */}
        <h3 className="UpdateVHC-section-title">Volunteer Suggestions</h3>
        <div className="UpdateVHC-field">
          <label>Volunteer Suggestions:</label>
          <textarea
            name="volunteerSuggestions"
            value={report.volunteerSuggestions || ""}
            onChange={handleChange}
          />
        </div>

        {/* Care Summary */}
        <h3 className="UpdateVHC-section-title">Care Summary</h3>
        <div className="UpdateVHC-field">
          <label>Home Care:</label>
          <input
            type="text"
            name="careSummary.homeCare"
            value={report.careSummary?.homeCare || ""}
            onChange={handleChange}
          />
        </div>
        <div className="UpdateVHC-field">
          <label>Activity Items:</label>
          <input
            type="text"
            name="careSummary.activityItems"
            value={report.careSummary?.activityItems || ""}
            onChange={handleChange}
          />
        </div>
        <div className="UpdateVHC-field">
          <label>Remarks:</label>
          <input
            type="text"
            name="careSummary.remarks"
            value={report.careSummary?.remarks || ""}
            onChange={handleChange}
          />
        </div>

        {/* Volunteer Details */}
        <h3 className="UpdateVHC-section-title">Volunteer Details</h3>
        <div className="UpdateVHC-field">
          <label>Volunteer Name:</label>
          <input
            type="text"
            name="volunteerName"
            value={report.volunteerName || ""}
            onChange={handleChange}
          />
        </div>
        <div className="UpdateVHC-field">
          <label>Volunteer Phone:</label>
          <input
            type="text"
            name="volunteerPhone"
            value={report.volunteerPhone || ""}
            onChange={handleChange}
          />
        </div>
        <div className="UpdateVHC-field">
          <label>Visit Date:</label>
          <input
            type="date"
            name="visitDate"
            value={report.visitDate || ""}
            onChange={handleChange}
          />
        </div>
        <div className="UpdateVHC-field">
          <label>Visit Time:</label>
          <input
            type="time"
            name="visitTime"
            value={report.visitTime || ""}
            onChange={handleChange}
          />
        </div>

        {/* Volunteer Plan */}
        <h3 className="UpdateVHC-section-title">Volunteer Plan</h3>
        {Object.keys(report.volunteerPlan || {}).map((field) => (
          <div className="UpdateVHC-field" key={field}>
            <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
            <input
              type="checkbox"
              name={`volunteerPlan.${field}`}
              checked={report.volunteerPlan[field] || false}
              onChange={handleChange}
            />
          </div>
        ))}

        <button type="submit" className="UpdateVHC-update-button">
          Update Report
        </button>
      </form>
      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
};

export default UpdateVHC;