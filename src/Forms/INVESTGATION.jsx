import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../Firebase/config";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./INVAdd.css";

const INVESTIGATION = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [patientData, setPatientData] = useState(null);
  const [formData, setFormData] = useState({
    date: "",
    CBR: "",
    ESR: "",
    CRP: "",
    FBS: "",
    PPBS: "",
    RBS: "",
    HBa1c: "",
    RFT: "",
    LFT: "",
    LIPID_PROFILE: "",
    ELECTROLYTES: "",
    URINE: "",
    OTHERS: "",
    REPORTS_FROM: {
      ECG: "",
      X_RAY: "",
      ECHO: "",
      SCAN: "",
    },
    formType: "INVESTIGATION",
    submittedAt: "",
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
    if (name.startsWith("REPORTS_FROM_")) {
      const field = name.split("_")[2]; // Extract the field name (ECG, X_RAY, etc.)
      setFormData((prevData) => ({
        ...prevData,
        REPORTS_FROM: {
          ...prevData.REPORTS_FROM,
          [field]: value,
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
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
      toast.success("Investigation report submitted successfully!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        onClose: () => navigate(-1), // Navigate back after the toast is closed
      });
  
      setFormData({
        date: "",
        team1:"",
        CBR: "",
        ESR: "",
        CRP: "",
        FBS: "",
        PPBS: "",
        RBS: "",
        HBa1c: "",
        RFT: "",
        LFT: "",
        LIPID_PROFILE: "",
        ELECTROLYTES: "",
        URINE: "",
        OTHERS: "",
        REPORTS_FROM: {
          ECG: "",
          X_RAY: "",
          ECHO: "",
          SCAN: "",
        },
        formType: "INVESTIGATION",
        submittedAt: "",
      });
    } catch (error) {
      console.error("Error adding document: ", error);
      toast.error("Error submitting the report. Please try again.", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="INVAdd-container">
      <button className="INVAdd-backButton" onClick={() => navigate(-1)}>
        &larr; Back
      </button>

      <h2 className="INVAdd-title">INVESTIGATION Details for Patient ID: {patientId}</h2>
      {patientData ? (
        <div className="INVAdd-patientInfo">
           <h3 style={{color:"black"}}>Patient INVESTIGATION</h3>
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

      <form onSubmit={handleSubmit} className="INVAdd-form">
        <h3>Section 1: General Details</h3>
        <div className="INVAdd-field">
          <label>Date:</label>
          <input type="date" name="date" value={formData.date} onChange={handleChange} required />
        </div>
        <div className="DeathAdd-field">
          <label>Reported By:</label>
          <input type="text" name="team1" value={formData.team1} onChange={handleChange} required />
        </div>
        <h3>Section 2: Investigation Details</h3>
        {["CBR", "ESR", "CRP", "FBS", "PPBS", "RBS", "HBa1c", "RFT", "LFT", "LIPID_PROFILE", "ELECTROLYTES", "URINE", "OTHERS"].map((field) => (
          <div className="INVAdd-field" key={field}>
            <label>{field}:</label>
            <input type="text" name={field} value={formData[field]} onChange={handleChange} />
          </div>
        ))}

        <h3>Section 3: Reports From</h3>
        {["ECG", "X_RAY", "ECHO", "SCAN"].map((field) => (
  <div className="INVAdd-field" key={field}>
    <label>{field}:</label>
    <textarea
      name={`REPORTS_FROM_${field}`}
      value={formData.REPORTS_FROM[field]}
      onChange={handleChange}
      rows={3} // Adjust row size as needed
      className="textarea-field form-control" // Optional: Add a class for styling
    />
  </div>
))}


        <button type="submit" className="INVAdd-submitButton" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        toastStyle={{ marginTop: "20px" }}
      />
    </div>
  );
};

export default INVESTIGATION;