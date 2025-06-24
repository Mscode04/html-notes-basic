import React, { useState, useEffect } from "react";
import { db } from "../Firebase/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./UpdatePROGRESSION.css"; // Import CSS file

const UpdatePROGRESSION = () => {
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
          setReport(reportSnapshot.data());
        } else {
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
    setReport((prevReport) => ({
      ...prevReport,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const reportRef = doc(db, "Reports", reportId);
      await updateDoc(reportRef, report);
      toast.success("Report updated successfully!");
      setTimeout(() => {
        navigate(-1); // Navigate back after toast
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
    <div className="UpdatePROGRESSION-container">
      <button
        className="UpdatePROGRESSION-back-button"
        onClick={() => navigate(-1)}
      >
        &larr; Back
      </button>
      <h2 className="UpdatePROGRESSION-title">Update Progression Report</h2>
      <form onSubmit={handleSubmit} className="UpdatePROGRESSION-form">
        {/* General Details */}
        <h3 className="uprogression-section-title">General Details</h3>
        <div className="uprogression-field">
          <label>Time In:</label>
          <input
            type="time"
            name="timeIn"
            value={report.timeIn || ""}
            onChange={handleChange}
          />
        </div>
        <div className="uprogression-field">
          <label>Time Out:</label>
          <input
            type="time"
            name="timeOut"
            value={report.timeOut || ""}
            onChange={handleChange}
          />
        </div>
        <div className="DeathAdd-field">
          <label>Reported By:</label>
          <input type="text" name="team1" value={report.team1} onChange={handleChange} required />
        </div>
        <div className="uprogression-field">
          <label>HC SI No:</label>
          <input
            type="text"
            name="hcSiNo"
            value={report.hcSiNo || ""}
            onChange={handleChange}
          />
        </div>
        <div className="uprogression-field">
          <label>D/N/V/SPHC Number:</label>
          <input
            type="text"
            name="dnvsphcNumber"
            value={report.dnvsphcNumber || ""}
            onChange={handleChange}
          />
        </div>
        <div className="uprogression-field">
          <label>Monthly:</label>
          <input
            type="text"
            name="monthly"
            value={report.monthly || ""}
            onChange={handleChange}
          />
        </div>
        <div className="uprogression-field">
          <label>Last Home Care:</label>
          <select
            name="lastHomeCare"
            value={report.lastHomeCare || "NHC"}
            onChange={handleChange}
          >
            <option value="NHC">NHC</option>
            <option value="NHC(E)">NHC(E)</option>
            <option value="DHC">DHC</option>
            <option value="VHC">VHC</option>
            <option value="GVHC">GVHC</option>
            <option value="SPHC">SPHC</option>
          </select>
        </div>
        <div className="uprogression-field">
          <label>Is this an Emergency:</label>
          <select
            name="isEmergency"
            value={report.isEmergency || "No"}
            onChange={handleChange}
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        <div className="uprogression-field">
          <label>Pharmaceutical Service:</label>
          <select
            name="pharmaceuticalService"
            value={report.pharmaceuticalService || "O"}
            onChange={handleChange}
          >
            <option value="O">O</option>
            <option value="SOS">SOS</option>
            <option value="IR-P">IR-P</option>
            <option value="R">R</option>
            <option value="OTC">OTC</option>
            <option value="DUPL">DUPL</option>
            <option value="ADV">ADV</option>
            <option value="MIXUP">MIXUP</option>
            <option value="ALT">ALT</option>
          </select>
        </div>
        <div className="uprogression-field">
          <label>Last Home Care Date:</label>
          <input
            type="date"
            name="lastHomeCareDate"
            value={report.lastHomeCareDate || ""}
            onChange={handleChange}
          />
        </div>
        <div className="uprogression-field">
          <label>Consultation/Hospitalisation:</label>
          <select
            name="consultationHospitalisation"
            value={report.consultationHospitalisation || "No"}
            onChange={handleChange}
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        <div className="uprogression-field">
          <label>Main Activities:</label>
          <textarea
            name="mainActivities"
            value={report.mainActivities || ""}
            onChange={handleChange}
          />
        </div>
        <div className="uprogression-field">
          <label>Physical Service:</label>
          <select
            name="physicalService"
            value={report.physicalService || "No"}
            onChange={handleChange}
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        <div className="uprogression-field">
          <label>The Primary Once:</label>
          <select
            name="primaryOnce"
            value={report.primaryOnce || "0"}
            onChange={handleChange}
          >
            <option value="-1">-1</option>
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
          </select>
        </div>
        <div className="uprogression-field">
          <label>Patient Awareness:</label>
          <select
            name="patientAwareness"
            value={report.patientAwareness || "No"}
            onChange={handleChange}
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        <div className="uprogression-field">
          <label>Family Awareness:</label>
          <select
            name="familyAwareness"
            value={report.familyAwareness || "No"}
            onChange={handleChange}
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        <div className="uprogression-field">
          <label>Financially:</label>
          <select
            name="financially"
            value={report.financially || "No"}
            onChange={handleChange}
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        <div className="uprogression-field">
          <label>Emotional State:</label>
          <select
            name="emotionalState"
            value={report.emotionalState || "COP"}
            onChange={handleChange}
          >
            <option value="COP">COP</option>
            <option value="LAB">LAB</option>
            <option value="D1">D1</option>
            <option value="D2">D2</option>
            <option value="D3">D3</option>
            <option value="E1">E1</option>
            <option value="E2">E2</option>
          </select>
        </div>
        <div className="uprogression-field">
          <label>Caretaker:</label>
          <input
            type="text"
            name="caretaker"
            value={report.caretaker || ""}
            onChange={handleChange}
          />
        </div>
        <div className="uprogression-field">
          <label>Caretaker Type (Domestic):</label>
          <select
            name="caretakerTypeDomestic"
            value={report.caretakerTypeDomestic || "-1"}
            onChange={handleChange}
          >
            <option value="-1">-1</option>
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
          </select>
        </div>
        <div className="uprogression-field">
          <label>Caretaker Type (Ext):</label>
          <select
            name="caretakerTypeExt"
            value={report.caretakerTypeExt || "-1"}
            onChange={handleChange}
          >
            <option value="-1">-1</option>
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
          </select>
        </div>
        <div className="uprogression-field">
          <label>Community Support:</label>
          <select
            name="communitySupport"
            value={report.communitySupport || "-1"}
            onChange={handleChange}
          >
            <option value="-1">-1</option>
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
          </select>
        </div>
        <div className="uprogression-field">
          <label>Palliative Team Support:</label>
          <select
            name="palliativeTeamSupport"
            value={report.palliativeTeamSupport || "-1"}
            onChange={handleChange}
          >
            <option value="-1">-1</option>
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
          </select>
        </div>
        <div className="uprogression-field">
          <label>Environmental Hygiene:</label>
          <select
            name="environmentalHygiene"
            value={report.environmentalHygiene || "-1"}
            onChange={handleChange}
          >
            <option value="-1">-1</option>
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
          </select>
        </div>
        <div className="uprogression-field">
          <label>Head to Foot Checkup:</label>
          <select
            name="headToFootCheckup"
            value={report.headToFootCheckup || "1"}
            onChange={handleChange}
          >
            {[...Array(10).keys()].map((i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>
        <div className="uprogression-field">
          <label>Silent Tapes:</label>
          <input
            type="text"
            name="silentTapes"
            value={report.silentTapes || ""}
            onChange={handleChange}
          />
        </div>
        <div className="uprogression-field">
          <label>Activity Mobility:</label>
          <select
            name="activityMobility"
            value={report.activityMobility || "1"}
            onChange={handleChange}
          >
            {[...Array(5).keys()].map((i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>
        <div className="uprogression-field">
          <label>Glassglow:</label>
          <select
            name="glassglow"
            value={report.glassglow || "1"}
            onChange={handleChange}
          >
            {[...Array(15).keys()].map((i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>
        <div className="uprogression-field">
          <label>General Condition:</label>
          <select
            name="generalCondition"
            value={report.generalCondition || "STABLE"}
            onChange={handleChange}
          >
            <option value="STABLE">STABLE</option>
            <option value="UNSTABLE">UNSTABLE</option>
          </select>
        </div>
        <div className="uprogression-field">
          <label>Care Status:</label>
          <select
            name="careStatus"
            value={report.careStatus || "0"}
            onChange={handleChange}
          >
            <option value="0">0</option>
            <option value="MCC">MCC</option>
            <option value="-1">-1</option>
            <option value="-2">-2</option>
            <option value="-3">-3</option>
            <option value="1">1</option>
            <option value="2">2</option>
          </select>
        </div>
        <div className="uprogression-field">
          <label>Quality of Life:</label>
          <select
            name="qualityOfLife"
            value={report.qualityOfLife || "1"}
            onChange={handleChange}
          >
            {[...Array(10).keys()].map((i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>
        <div className="uprogression-field">
          <label>Logistic:</label>
          <input
            type="text"
            name="logistic"
            value={report.logistic || ""}
            onChange={handleChange}
          />
        </div>
        <div className="uprogression-field">
          <label>HC Plan:</label>
          <select
            name="hcPlan"
            value={report.hcPlan || "1/1"}
            onChange={handleChange}
          >
            <option value="1/1">1/1</option>
            <option value="1/2">1/2</option>
          </select>
        </div>
        <div className="uprogression-field">
          <label>HC Type:</label>
          <select
            name="hcType"
            value={report.hcType || "NHC"}
            onChange={handleChange}
          >
            <option value="NHC">NHC</option>
            <option value="NHC(E)">NHC(E)</option>
            <option value="DHC">DHC</option>
            <option value="VHC">VHC</option>
            <option value="GVHC">GVHC</option>
            <option value="SPHC">SPHC</option>
          </select>
        </div>
        <div className="uprogression-field">
          <label>Team 1:</label>
          <select
            name="team1"
            value={report.team1 || "Null"}
            onChange={handleChange}
          >
            <option value="Null">Null</option>
            <option value="Shemeema">Shemeema</option>
            <option value="Divya">Divya</option>
            <option value="Haseena">Haseena</option>
          </select>
        </div>
        <div className="uprogression-field">
          <label>Team 2:</label>
          <input
            type="text"
            name="team2"
            value={report.team2 || ""}
            onChange={handleChange}
          />
        </div>
        <div className="uprogression-field">
          <label>Team 3:</label>
          <input
            type="text"
            name="team3"
            value={report.team3 || ""}
            onChange={handleChange}
          />
        </div>
        <div className="uprogression-field">
          <label>Team 4:</label>
          <input
            type="text"
            name="team4"
            value={report.team4 || ""}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="UpdatePROGRESSION-update-button">
          Update Report
        </button>
      </form>
      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
};

export default UpdatePROGRESSION;