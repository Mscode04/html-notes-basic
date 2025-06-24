import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../Firebase/config";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './SocialAdd.css'
const Social = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [patientData, setPatientData] = useState(null);
  const [formData, setFormData] = useState({
    date: "",
    team1:"",
    food: "",
    edn: "",
    others: "",
    dynamicFields: [
      {
        freq: "",
        feaDate: "",
        cat: "",
        catDate: "",
      },
    ],
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

  const handleChange = (e, index) => {
    const { name, value } = e.target;

    if (name.startsWith("dynamic")) {
      const fieldName = name.split("-")[1];
      const updatedDynamicFields = [...formData.dynamicFields];
      updatedDynamicFields[index][fieldName] = value;

      setFormData((prevData) => ({
        ...prevData,
        dynamicFields: updatedDynamicFields,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const addDynamicField = () => {
    setFormData((prevData) => ({
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
    setIsSubmitting(true);

    try {
      const currentDate = new Date();
      const timestamp = currentDate.toISOString();

      const reportData = {
        ...formData,
        ...patientData,
        patientId,
        submittedAt: timestamp,
        formType: "SOCIAL REPORT",
      };

      const docRef = await addDoc(collection(db, "Reports"), reportData);

      console.log("Document written with ID: ", docRef.id);
      toast.success("Report submitted successfully!");
      setTimeout(() => navigate(-1), 2000); // Navigate back after 2 seconds
    } catch (error) {
      console.error("Error adding document: ", error);
      toast.error("Error submitting the report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="SocialAdd-container">
      <ToastContainer position="top-center" autoClose={2000} />
      <button className="SocialAdd-back-btn" onClick={() => navigate(-1)}>
        <i className="fa fa-arrow-left"></i> Back
      </button>

      <h2>Social Report for Patient ID: {patientId}</h2>
      {patientData ? (
        <>
          <h3>Patient Information</h3>
          <p><strong>Name:</strong> {patientData.name}</p>
          <p><strong>Address:</strong> {patientData.address}</p>
          <p><strong>Phone Number:</strong> {patientData.phone}</p>
          <p><strong>Location:</strong> {patientData.location}</p>
          <p><strong>Age:</strong> {patientData.age}</p>
        </>
      ) : (
        <div className="loading-container">
        <img
          src="https://media.giphy.com/media/YMM6g7x45coCKdrDoj/giphy.gif"
          alt="Loading..."
          className="loading-image"
        />
      </div>
      )}

      <form onSubmit={handleSubmit} className="SocialAdd-form">
        <h3>Section 1: General Details</h3>
        <label>
          Date:
          <input type="date" name="date" value={formData.date} onChange={handleChange} />
        </label>
        <div className="DeathAdd-field">
          <label>Reported By:</label>
          <input type="text" name="team1" value={formData.team1} onChange={handleChange} required />
        </div>
        <label>
          Food:
          <input type="text" name="food" value={formData.food} onChange={handleChange} />
        </label>
        <label>
          Education:
          <input type="text" name="edn" value={formData.edn} onChange={handleChange} />
        </label>
        <label>
          Others:
          <input type="text" name="others" value={formData.others} onChange={handleChange} />
        </label>

        <h3>Section 2: Dynamic Fields</h3>
        {formData.dynamicFields.map((field, index) => (
          <div key={index} className="SocialAdd-dynamic-field-group">
            <label>
              Frequency:
              <input
                type="text"
                name={`dynamic-freq`}
                value={field.freq}
                onChange={(e) => handleChange(e, index)}
              />
            </label>
            <label>
              FEA Date:
              <input
                type="date"
                name={`dynamic-feaDate`}
                value={field.feaDate}
                onChange={(e) => handleChange(e, index)}
              />
            </label>
            <label>
              Category:
              <input
                type="text"
                name={`dynamic-cat`}
                value={field.cat}
                onChange={(e) => handleChange(e, index)}
              />
            </label>
            <label>
              Category Date:
              <input
                type="date"
                name={`dynamic-catDate`}
                value={field.catDate}
                onChange={(e) => handleChange(e, index)}
              />
            </label>
          </div>
        ))}
        <button type="button" className="SocialAdd-add-btn" onClick={addDynamicField}>
          Add More
        </button>

        <button type="submit" className="SocialAdd-submit-btn" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default Social;