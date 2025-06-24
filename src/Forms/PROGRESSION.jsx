import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../Firebase/config";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Progression.css";

const Progression = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [patientData, setPatientData] = useState(null);
  const [formData, setFormData] = useState({
    timeIn: "",
    timeOut: "",
    team1:"",
    hcSiNo: "",
    dnvsphcNumber: "",
    monthly: "",
    lastHomeCare: "NHC",
    isEmergency: "No",
    pharmaceuticalService: "O",
    lastHomeCareDate: "",
    consultationHospitalisation: "No",
    mainActivities: "",
    physicalService: "No",
    primaryOnce: "0",
    patientAwareness: "No",
    familyAwareness: "No",
    financially: "No",
    emotionalState: "",
    caretaker: "",
    caretakerTypeDomestic: "-1",
    caretakerTypeExt: "-1",
    communitySupport: "-1",
    palliativeTeamSupport: "-1",
    environmentalHygiene: "-1",
    headToFootCheckup: "1",
    silentTapes: "",
    activityMobility: "1",
    glassglow: "1",
    generalCondition: "",
    careStatus: "0",
    qualityOfLife: "1",
    logistic: "",
    hcPlan: "1/1",
    hcType: "",
    team1: "Null",
    team2: "",
    team3: "",
    team4: "",
    submittedAt: "",
    formType: "PROGRESSION REPORT",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const q = query(collection(db, "Patients"), where("patientId", "==", patientId));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const data = querySnapshot.docs[0].data();
          setPatientData(data);
          console.log("Patient data fetched:", data);
        } else {
          console.error("No patient document found with patientId:", patientId);
        }
      } catch (error) {
        console.error("Error fetching patient data:", error);
      }
    };

    fetchPatientData();
  }, [patientId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const currentDate = new Date();
      const timestamp = currentDate.toISOString();

      const reportData = {
        ...formData,
        ...patientData,
        patientId,
        submittedAt: timestamp,
      };

      const docRef = await addDoc(collection(db, "Reports"), reportData);

      console.log("Document written with ID: ", docRef.id);
      toast.success("Report submitted successfully!", {
        position: "top-center",
        autoClose: 3000,
      });

      setFormData({
        timeIn: "",
        timeOut: "",
        team1:"",
        hcSiNo: "",
        dnvsphcNumber: "",
        monthly: "",
        lastHomeCare: "NHC",
        isEmergency: "No",
        pharmaceuticalService: "O",
        lastHomeCareDate: "",
        consultationHospitalisation: "No",
        mainActivities: "",
        physicalService: "No",
        primaryOnce: "0",
        patientAwareness: "No",
        familyAwareness: "No",
        financially: "No",
        emotionalState: "COP",
        caretaker: "",
        caretakerTypeDomestic: "-1",
        caretakerTypeExt: "-1",
        communitySupport: "-1",
        palliativeTeamSupport: "-1",
        environmentalHygiene: "-1",
        headToFootCheckup: "1",
        silentTapes: "",
        activityMobility: "1",
        glassglow: "1",
        generalCondition: "STABLE",
        careStatus: "0",
        qualityOfLife: "1",
        logistic: "",
        hcPlan: "1/1",
        hcType: "NHC",
        team1: "Null",
        team2: "",
        team3: "",
        team4: "",
        submittedAt: "",
        formType: "PROGRESSION REPORT",
      });
    } catch (error) {
      console.error("Error adding document: ", error);
      toast.error("Error submitting the report. Please try again.", {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="PROAdd-container">
      <button className="PROAdd-back-btn" onClick={() => navigate(-1)}>
        <i className="fa fa-arrow-left"></i> Back
      </button>

      <h2 className="NHCAdd-title">PROGRESSION REPORT Details for Patient ID: {patientId}</h2>
      {patientData ? (
        <div className="NHCAdd-patientInfo">
           <h3 style={{color:"black"}}>Patient PROGRESSION REPORT</h3>
          <h3><strong>Name:</strong> {patientData.name}</h3>
          <h3><strong>Address:</strong> {patientData.address}</h3>
        </div>
      ) : (
        <div className="loading-container">
        <img
          src="https://media.giphy.com/media/YMM6g7x45coCKdrDoj/giphy.gif"
          alt="Loading..."
          className="loading-image"
        />
      </div>
      )}

      <form onSubmit={handleSubmit} className="PROAdd-form">
        
        <label>
          Time In:
          <input type="time" name="timeIn" value={formData.timeIn} onChange={handleChange} />
        </label>
        <label>
          Time Out:
          <input type="time" name="timeOut" value={formData.timeOut} onChange={handleChange} />
        </label>
        <div className="DeathAdd-field">
          <label>Reported By:</label>
          <input type="text" name="team1" value={formData.team1} onChange={handleChange} required />
        </div>
        <label>
          HC SI No:
          <input type="text" name="hcSiNo" value={formData.hcSiNo} onChange={handleChange} />
        </label>
        <label>
          D/N/V/SPHC Number:
          <input type="text" name="dnvsphcNumber" value={formData.dnvsphcNumber} onChange={handleChange} />
        </label>
        <label>
          Monthly:
          <input type="text" name="monthly" value={formData.monthly} onChange={handleChange} />
        </label>
        <label>
          Last Home Care:
          <select name="lastHomeCare" value={formData.lastHomeCare} onChange={handleChange}>
            <option value="NHC">NHC</option>
            <option value="NHC(E)">NHC(E)</option>
            <option value="DHC">DHC</option>
            <option value="VHC">VHC</option>
            <option value="GVHC">GVHC</option>
            <option value="SPHC">SPHC</option>
          </select>
        </label>
        <label>
          Is this an Emergency:
          <select name="isEmergency" value={formData.isEmergency} onChange={handleChange}>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </label>
        <label>
          Pharmaceutical Service:
          <select name="pharmaceuticalService" value={formData.pharmaceuticalService} onChange={handleChange}>
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
        </label>
        <label>
          Last Home Care Date:
          <input type="date" name="lastHomeCareDate" value={formData.lastHomeCareDate} onChange={handleChange} />
        </label>
        <label>
          Consultation/Hospitalisation:
          <input type="text" name="consultationHospitalisation" value={formData.consultationHospitalisation} onChange={handleChange} />
        </label>
        <label>
          Main Activities:
          <textarea name="mainActivities" value={formData.mainActivities} onChange={handleChange}></textarea>
        </label>
        <label>
          Physical Service:
          <select name="physicalService" value={formData.physicalService} onChange={handleChange}>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </label>
        <label>
          The Primary Once:
          <select name="primaryOnce" value={formData.primaryOnce} onChange={handleChange}>
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
          </select>
        </label>
        <label>
          Patient Awareness:
          <select name="patientAwareness" value={formData.patientAwareness} onChange={handleChange}>
          
  <option value="NA">NA</option>
  <option value="-1">-1</option>
  <option value="DNL">DNL</option>
  <option value="COL">COL</option>
  <option value="1">1</option>
  <option value="2">2</option>
          </select>
        </label>
        <label>
          Family Awareness:
          <select name="familyAwareness" value={formData.familyAwareness} onChange={handleChange}>
          
  <option value="NA">NA</option>
  <option value="-1">-1</option>
  <option value="0">0</option>
  <option value="DNL">DNL</option>
  <option value="COL">COL</option>
  <option value="1">1</option>
  <option value="2">2</option>
          </select>
        </label>
        <label>
          Financially:
          <select name="financially" value={formData.financially} onChange={handleChange}>
          
  <option value="NA">NA</option>
  <option value="-1">-1</option>
  <option value="0">0</option>
  <option value="1">1</option>
  <option value="2">2</option>
          </select>
        </label>
        <label>
          Emotional State:
          <select name="emotionalState" value={formData.emotionalState} onChange={handleChange}>
            <option value="NA">NA</option>
            <option value="COP">COP</option>
            <option value="LAB">LAB</option>
            <option value="D1">D1</option>
            <option value="D2">D2</option>
            <option value="D3">D3</option>
            <option value="E1">E1</option>
            <option value="E2">E2</option>
          </select>
        </label>
        <label>
          Caretaker:
          <input type="text" name="caretaker" value={formData.caretaker} onChange={handleChange} />
        </label>
        <label>
          Caretaker Type (Domestic Support):
          <select name="caretakerTypeDomestic" value={formData.caretakerTypeDomestic} onChange={handleChange}>
            <option value="1">1</option>
            <option value="-1">-1</option>
            <option value="0">0</option>
            <option value="2">2</option>
          </select>
        </label>
        <label>
          Caretaker Type (Ext Family Support):
          <select name="caretakerTypeExt" value={formData.caretakerTypeExt} onChange={handleChange}>
            <option value="1">1</option>
            <option value="-1">-1</option>
            <option value="0">0</option>
            <option value="2">2</option>
          </select>
        </label>
        <label>
          Community Support:
          <select name="communitySupport" value={formData.communitySupport} onChange={handleChange}>
            <option value="-1">-1</option>
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
          </select>
        </label>
        <label>
          Palliative Team Support:
          <select name="palliativeTeamSupport" value={formData.palliativeTeamSupport} onChange={handleChange}>
            <option value="1">1</option>
            <option value="-1">-1</option>
            <option value="0">0</option>
            <option value="2">2</option>
          </select>
        </label>
        <label>
          Environmental Hygiene:
          <select name="environmentalHygiene" value={formData.environmentalHygiene} onChange={handleChange}>
            <option value="1">1</option>
            <option value="-1">-1</option>
            <option value="0">0</option>
            <option value="2">2</option>
          </select>
        </label>
        <label>
          Head to Foot Checkup:
          <select name="headToFootCheckup" value={formData.headToFootCheckup} onChange={handleChange}>
            {[...Array(10).keys()].map((i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </label>
        <label>
          Silent Tapes:
          <input type="text" name="silentTapes" value={formData.silentTapes} onChange={handleChange} />
        </label>
        <label>
          Activity Mobility:
          <select name="activityMobility" value={formData.activityMobility} onChange={handleChange}>
            {[...Array(5).keys()].map((i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </label>
        <label>
          Glassglow:
          <select name="glassglow" value={formData.glassglow} onChange={handleChange}>
            {[...Array(15).keys()].map((i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </label>
        <label>
          General Condition:
          <select name="generalCondition" value={formData.generalCondition} onChange={handleChange}>
            <option value="STABLE">STABLE</option>
            <option value="UNSTABLE">UNSTABLE</option>
          </select>
        </label>
        <label>
          Care Status:
          <select name="careStatus" value={formData.careStatus} onChange={handleChange}>
            <option value="0">0</option>
            <option value="MCC">MCC</option>
            <option value="-1">-1</option>
            <option value="-2">-2</option>
            <option value="-3">-3</option>
            <option value="1">1</option>
            <option value="2">2</option>
          </select>
        </label>
        <label>
          Quality of Life:
          <select name="qualityOfLife" value={formData.qualityOfLife} onChange={handleChange}>
            {[...Array(10).keys()].map((i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </label>
        <label>
          Logistic:
          <input type="text" name="logistic" value={formData.logistic} onChange={handleChange} />
        </label>
        <label>
          HC Plan:
          <select name="hcPlan" value={formData.hcPlan} onChange={handleChange}>
            <option value="1/1">1/1</option>
            <option value="1/2">1/2</option>
          </select>
        </label>
        <label>
          HC Type:
          <select name="hcType" value={formData.hcType} onChange={handleChange}>
            <option value="NHC">NHC</option>
            <option value="NHC(E)">NHC(E)</option>
            <option value="DHC">DHC</option>
            <option value="VHC">VHC</option>
            <option value="GVHC">GVHC</option>
            <option value="SPHC">SPHC</option>
          </select>
        </label>
        <label>
          Team 1:
          <select name="team1" value={formData.team1} onChange={handleChange}>
            <option value="Null">Null</option>
            <option value="Shemeema">Shemeema</option>
            <option value="Divya">Divya</option>
            <option value="Haseena">Haseena</option>
          </select>
        </label>
        <label>
          Team 2:
          <input type="text" name="team2" value={formData.team2} onChange={handleChange} />
        </label>
        <label>
          Team 3:
          <input type="text" name="team3" value={formData.team3} onChange={handleChange} />
        </label>
        <label>
          Team 4:
          <input type="text" name="team4" value={formData.team4} onChange={handleChange} />
        </label>

        <button type="submit" className="PROAdd-submit-btn" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Progression;