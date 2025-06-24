import React, { useState, useEffect } from "react";
import { db } from "../Firebase/config"; // Firebase configuration
import { collection, doc, getDoc, setDoc, updateDoc, getDocs } from "firebase/firestore";
import Select from "react-select";
import DatePicker from "react-datepicker";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import './Divya.css';
import "react-datepicker/dist/react-datepicker.css";
import { FaTrash} from "react-icons/fa";
const Haseena = () => {
  const [patients, setPatients] = useState([]);
  const [allPatients, setAllPatients] = useState([]); // All patients from Firestore
  const [name, setName] = useState("");
  const [registernumber, setRegNumber] = useState("");
  const [address, setAddress] = useState("");
  const [mainCaretakerPhone, setPhone] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [patientId, setPatientId] = useState(""); // Add patientId state
  const navigate = useNavigate(); // Initialize useNavigate

  const formattedDate = selectedDate.toISOString().split("T")[0];
  const docRef = doc(collection(db, "Haseena"), formattedDate); // One document per day

  useEffect(() => {
    const fetchPatients = async () => {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setPatients(docSnap.data().patients || []);
      }
    };
    fetchPatients();
  }, [selectedDate]);

  useEffect(() => {
    const fetchAllPatients = async () => {
      const querySnapshot = await getDocs(collection(db, "Patients")); // Fetch all patients
      const patientList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAllPatients(patientList);
    };
    fetchAllPatients();
  }, []);

  const addPatient = async () => {
    if (!name || !registernumber || !address || !mainCaretakerPhone) {
      alert("Please fill all fields");
      return;
    }

    const newPatient = {
      id: patientId, // Use the patientId from the Patients collection
      name,
      registernumber,
      address,
      mainCaretakerPhone,
      checked: false, // Add a checked field
    };
    const updatedPatients = [...patients, newPatient];
    setPatients(updatedPatients);

    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      await updateDoc(docRef, { patients: updatedPatients });
    } else {
      await setDoc(docRef, { patients: updatedPatients });
    }

    setName("");
    setRegNumber("");
    setAddress("");
    setPhone("");
    setPatientId(""); // Reset patientId
  };

  const deletePatient = async (id) => {
    const updatedPatients = patients.filter((patient) => patient.id !== id);
    setPatients(updatedPatients);
    await updateDoc(docRef, { patients: updatedPatients });
  };

  const handleCheckboxChange = async (id) => {
    const updatedPatients = patients.map((patient) =>
      patient.id === id ? { ...patient, checked: !patient.checked } : patient
    );
    setPatients(updatedPatients);

    await updateDoc(docRef, { patients: updatedPatients });
  };

  const handleSelectPatient = (selectedOption) => {
    const selectedPatient = allPatients.find((p) => p.id === selectedOption.value);
    if (selectedPatient) {
      setName(selectedPatient.name);
      setRegNumber(selectedPatient.registernumber);
      setAddress(selectedPatient.address);
      setPhone(selectedPatient.mainCaretakerPhone);
      setPatientId(selectedPatient.id); // Set the patientId
    }
  };

  const handleCardClick = (patientId) => {
    navigate(`/main/patient/${patientId}`); // Navigate to the patient's document page
  };
  const goBack = () => {
    navigate(-1); // Go back to the previous page
  };
  return (
    <div className="divya-container">
         <button className="rdeath-back-button" onClick={goBack}>
        &larr; Back
      </button>
      <h2>HASEENA'S</h2>
      <h2>({formattedDate}) </h2>

      <div className="divya-patient-form">
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="yyyy-MM-dd"
          className="divya-datepicker form-control"
        />

        <Select
          options={allPatients.map((p) => ({
            value: p.id,
            label: `${p.name} | ${p.registernumber} | ${p.mainCaretakerPhone}`,
          }))}
          placeholder="Search by Name, Reg Number, or Phone"
          onChange={handleSelectPatient}
          className="divya-select"
        />
       <div className="d-none">   
        <input
          type="text"
          placeholder="Patient Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="divya-input"
        />
        <input
          type="text"
          placeholder="Reg Number"
          value={registernumber}
          onChange={(e) => setRegNumber(e.target.value)}
          className="divya-input"
        />
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="divya-input"
        />
        <input
          type="text"
          placeholder="Phone"
          value={mainCaretakerPhone}
          onChange={(e) => setPhone(e.target.value)}
          className="divya-input"
        />
</div>  
        <button onClick={addPatient} className="divya-button m-2">
          Add Patient
        </button>
      </div>

      <div className="divya-patient-list">
        <h3>Today's List</h3>
        {patients.length === 0 ? (
          <p>No patients added yet.</p>
        ) : (
          <table className="divya-table">
            <thead>
              <tr>
                <th>Check</th>
                <th>S.No</th>
                <th>Name</th>
                <th>Reg Number</th>
                <th>Address</th>
                
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient, index) => (
                <tr key={patient.id}  style={{ cursor: "pointer" }}>
                  <td>
                    <input
                      type="checkbox"
                      className="divya-checkbox"
                      checked={patient.checked || false} // Bind the checked state
                      onChange={() => handleCheckboxChange(patient.id)} // Handle changes
                    />
                  </td>
                  <td>{index + 1}</td>
                  <td onClick={() => handleCardClick(patient.id)}>{patient.name} </td>
                  <td>{patient.registernumber}</td>
                  <td>{patient.address}</td>
                  
                  <td>
                    <button onClick={(e) => { e.stopPropagation(); deletePatient(patient.id); }} className="divya-delete-button">
                    <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Haseena;