import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../Firebase/config";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Conditions.css";

const DeactivatePatient = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [patientData, setPatientData] = useState(null);
  const [isDeactivated, setIsDeactivated] = useState(false);
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const patientQuery = query(collection(db, "Patients"), where("patientId", "==", patientId));
        const patientSnapshot = await getDocs(patientQuery);

        if (!patientSnapshot.empty) {
          const docData = patientSnapshot.docs[0];
          setPatientData({ id: docData.id, ...docData.data() });
          setIsDeactivated(docData.data().deactivated || false);
          setReason(docData.data().deactivationReason || "");
        } else {
          console.error("No patient document found with patientId:", patientId);
        }
      } catch (error) {
        console.error("Error fetching patient data:", error);
      }
    };
    fetchPatientData();
  }, [patientId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!patientData) return;
      const patientRef = doc(db, "Patients", patientData.id);
      await updateDoc(patientRef, {
        deactivated: isDeactivated,
        deactivationReason: isDeactivated ? reason : "",
      });
      toast.success("Patient status updated successfully!");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update patient status. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="Conditions-container">
      <button className="Conditions-backButton" onClick={() => navigate(-1)}>&larr; Back</button>
      <h2 className="Conditions-title">Manage Patient Status (ID: {patientId})</h2>

      {patientData ? (
        <div className="Conditions-patientInfo">
          <h3><strong>Name:</strong> {patientData.name}</h3>
          <h3><strong>Address:</strong> {patientData.address}</h3>
          <h3 style={{ color: isDeactivated ? "red" : "green" }}>
            <strong>Status:</strong> {isDeactivated ? "Deactivated" : "Active"}
          </h3>
        </div>
      ) : (
        <div className="loading-container">
          <img src="https://media.giphy.com/media/YMM6g7x45coCKdrDoj/giphy.gif" alt="Loading..." className="loading-image" />
        </div>
      )}

      <form onSubmit={handleSubmit} className="Conditions-form">
        <h3>Deactivate Patient</h3>
        <label>
          <input
            type="checkbox"
            checked={isDeactivated}
            onChange={() => setIsDeactivated(!isDeactivated)}
          />
          Mark as Deactivated
        </label>
        {isDeactivated && (
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter deactivation reason"
            className="form-control-lg w-100 mt-2"
            required
          ></textarea>
        )}
        <button type="submit" className="Conditions-submitButton" disabled={isSubmitting}>
          {isSubmitting ? "Updating..." : "Save Changes"}
        </button>
      </form>
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar closeOnClick pauseOnHover draggable />
    </div>
  );
};

export default DeactivatePatient;
