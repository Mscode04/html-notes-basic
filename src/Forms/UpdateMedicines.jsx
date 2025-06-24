import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../Firebase/config";
import Select from "react-select";
import { collection, query, getDocs, updateDoc, where, addDoc } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./UpdateMedicines.css";

const UpdateMedicines = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState([]);
  const [patientDetails, setPatientDetails] = useState(null);
  const [formFields, setFormFields] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [medibaseMedicines, setMedibaseMedicines] = useState([]); // State to store medicines from medibase

  // Fetch medicines from medibase collection
  useEffect(() => {
    const fetchMedibaseMedicines = async () => {
      try {
        const medibaseCollection = collection(db, "medibase");
        const medibaseSnapshot = await getDocs(medibaseCollection);
        const medibaseData = medibaseSnapshot.docs.map((doc) => ({
          label: doc.data().name,
          value: doc.data().name,
        }));
        setMedibaseMedicines(medibaseData);
      } catch (error) {
        console.error("Error fetching medibase medicines:", error);
      }
    };

    fetchMedibaseMedicines();
  }, []);

  // Fetch patient medicines and details
  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const medicinesCollection = collection(db, "Medicines");
        const q = query(medicinesCollection, where("patientId", "==", patientId));
        const medicineSnapshot = await getDocs(q);

        const patientMedicines = [];
        let patientInfo = null;

        medicineSnapshot.forEach((doc) => {
          const docData = doc.data();
          patientMedicines.push(...docData.medicines);
          patientInfo = docData.patientDetails;
        });

        if (patientMedicines.length > 0) {
          setMedicines(patientMedicines);
        } else {
          console.error("No medicines found for this patient.");
        }

        if (patientInfo) {
          setPatientDetails(patientInfo);
        }
      } catch (error) {
        console.error("Error fetching medicines:", error);
      }
    };

    fetchMedicines();
  }, [patientId]);

  // Add new medicine to medibase collection if it doesn't exist
  const addMedicineToMedibase = async (medicineName) => {
    try {
      const medibaseCollection = collection(db, "medibase");
      const q = query(medibaseCollection, where("name", "==", medicineName));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        await addDoc(medibaseCollection, { name: medicineName });
        setMedibaseMedicines((prev) => [
          ...prev,
          { label: medicineName, value: medicineName },
        ]);
      }
    } catch (error) {
      console.error("Error adding medicine to medibase:", error);
    }
  };

  // Handle deleting a medicine
  const handleDeleteMedicine = async (index) => {
    const updatedMedicines = [...medicines];
    updatedMedicines.splice(index, 1);

    try {
      const medicinesCollection = collection(db, "Medicines");
      const q = query(medicinesCollection, where("patientId", "==", patientId));
      const medicineSnapshot = await getDocs(q);

      medicineSnapshot.forEach(async (doc) => {
        const docRef = doc.ref;
        await updateDoc(docRef, {
          medicines: updatedMedicines,
        });
      });

      setMedicines(updatedMedicines);
      toast.success("Medicine deleted successfully!");
    } catch (error) {
      console.error("Error deleting medicine:", error);
      toast.error("Error deleting medicine. Please try again.");
    }
  };

  // Handle input changes in the form fields
  const handleInputChange = (index, name, value) => {
    const updatedFields = [...formFields];
    updatedFields[index][name] = value;
    setFormFields(updatedFields);
  };

  // Add a new medicine field to the form
  const addMedicineField = () => {
    setFormFields([...formFields, { medicine: null, newMedicine: "", quantity: "", time: "Morning", patientsNow: false }]);
  };

  // Handle saving medicines
  const handleSaveMedicines = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const updatedMedicinesData = formFields.map((field) => ({
        medicineName: field.newMedicine || field.medicine?.value,
        quantity: field.quantity,
        time: field.time,
        patientsNow: field.patientsNow,
      }));

      // Add new medicines to medibase collection
      for (const field of formFields) {
        if (field.newMedicine) {
          await addMedicineToMedibase(field.newMedicine);
        }
      }

      const medicinesCollection = collection(db, "Medicines");
      const q = query(medicinesCollection, where("patientId", "==", patientId));
      const medicineSnapshot = await getDocs(q);

      medicineSnapshot.forEach(async (doc) => {
        const docRef = doc.ref;
        const currentMedicines = doc.data().medicines || [];
        const finalMedicines = [...currentMedicines, ...updatedMedicinesData];
        await updateDoc(docRef, { medicines: finalMedicines });
      });

      setMedicines((prevMedicines) => [...prevMedicines, ...updatedMedicinesData]);
      setFormFields([]);
      toast.success("Medicines updated successfully!");
      setTimeout(() => navigate(-1), 2000); // Navigate back after 2 seconds
    } catch (error) {
      console.error("Error saving medicines:", error);
      toast.error("Error saving medicines. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="UpdateMedicinesContainer">
      <button className="UpdateMedicinesBackButton" onClick={() => navigate(-1)}>
        <i className="bi bi-arrow-left"></i> Back
      </button>

      <h2>Update Medicines for Patient ID: {patientId}</h2>

      {patientDetails ? (
        <>
          <h3>Patient Details</h3>
          <p><strong>Name:</strong> {patientDetails.name}</p>
          <p><strong>Age:</strong> {patientDetails.age}</p>
          <p><strong>Address:</strong> {patientDetails.address}</p>
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

      {medicines.length > 0 ? (
        <div>
          <h3>Medicines</h3>
          <div className="table-responsive">
            <table className="UpdateMedicinesTable">
              <thead>
                <tr>
                  <th>Medicine Name</th>
                  <th>Quantity</th>
                  <th>Time</th>
                  <th>Patients Show</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {medicines.map((medicine, index) => (
                  <tr key={index}>
                    <td>{medicine.medicineName}</td>
                    <td>{medicine.quantity}</td>
                    <td>{medicine.time}</td>
                    <td>{medicine.patientsNow ? "Yes" : "No"}</td>
                    <td>
                      <button className="UpdateMedicinesButton" onClick={() => handleDeleteMedicine(index)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <p>No medicines found for this patient.</p>
      )}

      <form className="UpdateMedicinesForm" onSubmit={handleSaveMedicines}>
        <h3>Edit/Add Medicines</h3>
        {formFields.map((field, index) => (
          <div className="UpdateMedicinesField medsel" key={index}>
            <label>
              Medicine Name:
              <Select
                options={medibaseMedicines}
                value={field.medicine}
                onChange={(selectedOption) => handleInputChange(index, "medicine", selectedOption)}
                placeholder="Select Medicine"
                isClearable
              />
              <span>or Add New:</span>
              <input
                type="text"
                name="newMedicine"
                value={field.newMedicine}
                placeholder="New Medicine"
                onChange={(e) => handleInputChange(index, "newMedicine", e.target.value)}
                className="UpdateMedicinesInput form-control"
              />
            </label>
            <label>
              Quantity:
              <input
                type="number"
                name="quantity"
                value={field.quantity}
                onChange={(e) => handleInputChange(index, "quantity", e.target.value)}
                className="UpdateMedicinesInput  form-control"
              />
            </label>
            <label>
              Time:
              <select
                name="time"
                value={field.time}
                onChange={(e) => handleInputChange(index, "time", e.target.value)}
                className="UpdateMedicinesSelect  form-control"
              >
                <option value="Mor-Noon-Eve">Mor-Noon-Eve</option>
                <option value="Mor-Noon">Mor-Noon</option>
                <option value="Mor-Eve">Mor-Eve</option>
                <option value="Noon-Eve">Noon-Eve</option>
                <option value="Mor">Morning</option>
                <option value="Noon">Noon</option>
                <option value="Eve">Evening</option>
                <option value="SOS">SOS</option>
                <option value="If Required">If Required</option>
              </select>
            </label>
            <label>
              Patients Show:
              <input
                className=""
                type="checkbox"
                name="patientsNow"
                checked={field.patientsNow}
                onChange={(e) => handleInputChange(index, "patientsNow", e.target.checked)}
              />
            </label>
          </div>
        ))}
        <button type="button" className="UpdateMedicinesButton" onClick={addMedicineField}>
          Add More
        </button>
        <button type="submit" className="UpdateMedicinesButton" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Save Medicines"}
        </button>
      </form>

      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
};

export default UpdateMedicines;