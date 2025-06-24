import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Select from "react-select";
import { db } from "../Firebase/config";
import { collection, query, where, getDocs, addDoc, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./EquAdd.css";

const Equipment = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [patientData, setPatientData] = useState(null);
  const [equipments, setEquipments] = useState([]);
  const [formFields, setFormFields] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updatingEquipmentId, setUpdatingEquipmentId] = useState(null);

  const equipmentOptions = [
    { label: "Oxygen Concentrator", value: "Oxygen Concentrator" },
    { label: "Bypap", value: "Bypap" },
    { label: "Air Bed", value: "Air Bed" },
    { label: "Water Bed", value: "Water Bed" },
    { label: "Bed", value: "Bed" },
    { label: "Cot", value: "Cot" },
    { label: "Wheel Chair", value: "Wheel Chair" },
    { label: "Walker", value: "Walker" },
    { label: "Elbow Crutches", value: "Elbow Crutches" },
    { label: "Walking Stick", value: "Walking Stick" },
    { label: "Ampit Crutches", value: "Ampit Crutches" },
    { label: "Oxygen Cylinder", value: "Oxygen Cylinder" },
    { label: "Nebulaiser", value: "Nebulaiser" },
    { label: "Commode Chair", value: "Commode Chair" },
    { label: "Back Rest", value: "Back Rest" },
    { label: "Stretcher", value: "Stretcher" },
    { label: "Drip Stand", value: "Drip Stand" },
    { label: "Traction", value: "Traction" },
    { label: "Flow Meter", value: "Flow Meter" },
  ];

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const patientQuery = query(collection(db, "Patients"), where("patientId", "==", patientId));
        const patientSnapshot = await getDocs(patientQuery);

        if (!patientSnapshot.empty) {
          const data = patientSnapshot.docs[0].data();
          setPatientData(data);
        } else {
          console.error("No patient document found with patientId:", patientId);
        }

        const equipmentQuery = query(collection(db, "Equipments"), where("patientId", "==", patientId));
        const equipmentSnapshot = await getDocs(equipmentQuery);

        if (!equipmentSnapshot.empty) {
          const equipmentsData = equipmentSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setEquipments(equipmentsData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchPatientData();
  }, [patientId]);

  const handleInputChange = (index, name, value) => {
    const updatedFields = [...formFields];
    updatedFields[index][name] = value;
    setFormFields(updatedFields);
  };

  const addEquipmentField = () => {
    setFormFields([...formFields, { equipment: null, newEquipment: "", providedDate: "", returnDate: "", damage: "" }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const currentDate = new Date().toISOString();

      const equipmentsData = formFields.map((field) => ({
        equipmentName: field.newEquipment || field.equipment?.value,
        providedDate: field.providedDate,
        returnDate: field.returnDate,
        damage: field.damage,
      }));

      // Save equipment data in the Equipments collection
      const reportData = {
        patientId,
        patientDetails: patientData,
        equipments: equipmentsData,
        submittedAt: currentDate,
      };
      await addDoc(collection(db, "Equipments"), reportData);

      toast.success("Equipments saved successfully!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      setEquipments([...equipments, ...equipmentsData]);
      setFormFields([]);
    } catch (error) {
      console.error("Error saving equipments:", error);
      toast.error("Error saving equipments. Please try again.", {
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

  const handleDelete = async (id) => {
    try {
      const equipmentRef = doc(db, "Equipments", id);
      await deleteDoc(equipmentRef);

      toast.success("Equipment deleted successfully!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      setEquipments(equipments.filter((equipment) => equipment.id !== id));
    } catch (error) {
      console.error("Error deleting equipment:", error);
      toast.error("Error deleting equipment. Please try again.", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleUpdate = async (id, updatedFields) => {
    try {
      const equipmentRef = doc(db, "Equipments", id);
      
      // Get the current equipment data
      const equipmentToUpdate = equipments.find(eq => eq.id === id);
      
      // Merge the updated fields with the existing equipment data
      const updatedEquipment = {
        ...equipmentToUpdate,
        ...updatedFields
      };
  
      await updateDoc(equipmentRef, updatedEquipment);
  
      toast.success("Equipment updated successfully!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
  
      setEquipments(equipments.map(equipment =>
        equipment.id === id ? updatedEquipment : equipment
      ));
      setUpdatingEquipmentId(null);
    } catch (error) {
      console.error("Error updating equipment:", error);
      toast.error("Error updating equipment. Please try again.", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <div className="EquAdd-container">
      <button className="EquAdd-backButton" onClick={() => navigate(-1)}>
        &larr; Back
      </button>
      <h2 className="EquAdd-title">Manage Equipments for Patient ID: {patientId}</h2>
      {patientData ? (
        <div className="EquAdd-patientInfo">
          <h3 style={{color:"black"}}>Patient Equipments</h3>
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

      {equipments.length > 0 && (
        <div className="EquAdd-existingEquipments">
          <h3>Existing Equipments</h3>
          <table className="EquAdd-table">
            <thead>
              <tr>
                <th>Equipment Name</th>
                <th>Provided Date</th>
                <th>Return Date</th>
                <th>Damage</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {equipments.map((equipment, index) => (
                <React.Fragment key={index}>
                  <tr>
                    <td data-label="Equipment Name" className="me-5" > {equipment.equipmentName}</td>
                    <td data-label="Provided Date">{equipment.providedDate}</td>
                    <td data-label="Return Date">{equipment.returnDate}</td>
                    <td data-label="Damage">{equipment.damage}</td>
                    <td data-label="Actions">
                      <button onClick={() => setUpdatingEquipmentId(equipment.id)} className="EquAdd-updateButton">
                        Update
                      </button>
                      <button onClick={() => handleDelete(equipment.id)} className="EquAdd-deleteButton">
                        Delete
                      </button>
                    </td>
                  </tr>
                  {updatingEquipmentId === equipment.id && (
  <tr>
    <td colSpan="5">
      <div className="EquAdd-updateForm">
        <label>
          Equipment Name:
          <Select
            options={equipmentOptions}
            value={equipmentOptions.find(opt => opt.value === equipment.equipmentName)}
            onChange={(selectedOption) => 
              handleUpdate(equipment.id, { equipmentName: selectedOption.value })
            }
            placeholder="Select Equipment"
            isClearable
          />
        </label>
        <label>
          Provided Date:
          <input
            type="date"
            value={equipment.providedDate || ''}
            onChange={(e) => 
              handleUpdate(equipment.id, { providedDate: e.target.value })
            }
          />
        </label>
        <label>
          Return Date:
          <input
            type="date"
            value={equipment.returnDate || ''}
            onChange={(e) => 
              handleUpdate(equipment.id, { returnDate: e.target.value })
            }
          />
        </label>
        <label>
          Damage:
          <input
            type="text"
            value={equipment.damage || ''}
            onChange={(e) => 
              handleUpdate(equipment.id, { damage: e.target.value })
            }
            placeholder="Enter damage details"
          />
        </label>
        <div className="EquAdd-updateButtons">
          <button 
            onClick={() => handleUpdate(equipment.id, equipment)} 
            className="EquAdd-saveButton"
          >
            Save Changes
          </button>
          <button 
            onClick={() => setUpdatingEquipmentId(null)} 
            className="EquAdd-cancelButton"
          >
            Cancel
          </button>
        </div>
      </div>
    </td>
  </tr>
)}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <form onSubmit={handleSubmit} className="EquAdd-form">
        <h3>Add Equipments</h3>
        {formFields.map((field, index) => (
          <div key={index} className="EquAdd-field">
            <label>
              Equipment Name:
              <Select
                options={equipmentOptions}
                value={field.equipment}
                onChange={(selectedOption) => handleInputChange(index, "equipment", selectedOption)}
                placeholder="Select Equipment"
                isClearable
              />
              <span>or Add New:</span>
              <input
                type="text"
                name="newEquipment"
                value={field.newEquipment}
                placeholder="New Equipment"
                onChange={(e) => handleInputChange(index, "newEquipment", e.target.value)}
              />
            </label>
            <label>
              Provided Date:
              <input
                type="date"
                name="providedDate"
                value={field.providedDate}
                onChange={(e) => handleInputChange(index, "providedDate", e.target.value)}
              />
            </label>
            <label>
              Return Date:
              <input
                type="date"
                name="returnDate"
                value={field.returnDate}
                onChange={(e) => handleInputChange(index, "returnDate", e.target.value)}
              />
            </label>
            <label>
              Damage:
              <input
                type="text"
                name="damage"
                value={field.damage}
                placeholder="Enter damage details"
                onChange={(e) => handleInputChange(index, "damage", e.target.value)}
              />
            </label>
          </div>
        ))}
        <button type="button" onClick={addEquipmentField} className="EquAdd-addButton">
          Add More
        </button>
        <button type="submit" className="EquAdd-submitButton" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Save Equipments"}
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

export default Equipment;