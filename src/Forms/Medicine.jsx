import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Select from "react-select";
import { db } from "../Firebase/config";
import { FaTrash, FaEdit } from "react-icons/fa";
import { collection, query, where, getDocs, updateDoc, doc, addDoc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./MedAdd.css";

const Medicine = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [patientData, setPatientData] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [medicineDocId, setMedicineDocId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [medicineOptions, setMedicineOptions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showProviderModal, setShowProviderModal] = useState(false);
  const [providerData, setProviderData] = useState({
    currentProvider: "",
    drugAllergy: ""
  });

  const [currentMedicine, setCurrentMedicine] = useState({
    medicine: null,
    newMedicine: "",
    quantity: "",
    time: "Morning",
    patientsNow: true,
    drugAwareness: "N/A",
    source: "P",
    prescribed: "",
    consuming: "",
    response: "N/A",
    expiryDate: "",
    updatedDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch patient data
        const patientQuery = query(collection(db, "Patients"), where("patientId", "==", patientId));
        const patientSnapshot = await getDocs(patientQuery);

        if (!patientSnapshot.empty) {
          setPatientData(patientSnapshot.docs[0].data());
        }

        // Fetch medicines
        const medicineQuery = query(collection(db, "Medicines"), where("patientId", "==", patientId));
        const medicineSnapshot = await getDocs(medicineQuery);

        if (!medicineSnapshot.empty) {
          const docData = medicineSnapshot.docs[0].data();
          const medicinesWithStatus = docData.medicines.map(med => ({
            ...med,
            status: med.status || "active",
            drugAwareness: med.drugAwareness || "N/A",
            source: med.source || "P",
            prescribed: med.prescribed || "",
            consuming: med.consuming || "",
            response: med.response || "N/A",
            expiryDate: med.expiryDate || "",
            updatedDate: med.updatedDate || new Date().toISOString().split('T')[0]
          }));
          setMedicines(medicinesWithStatus);
          setMedicineDocId(medicineSnapshot.docs[0].id);
          
          // Set provider data if exists
          if (docData.providerData) {
            setProviderData(docData.providerData);
          }
        }

        // Fetch medicine options
        const medibaseSnapshot = await getDocs(collection(db, "medibase"));
        const options = medibaseSnapshot.docs.map(doc => ({
          value: doc.data().name,
          label: doc.data().name,
        }));
        setMedicineOptions(options);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Error fetching data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [patientId]);

  const handleInputChange = (name, value) => {
    setCurrentMedicine(prev => ({ ...prev, [name]: value }));
  };

  const handleProviderInputChange = (name, value) => {
    setProviderData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentMedicine.medicine && !currentMedicine.newMedicine) {
      toast.error("Please enter medicine name");
      return;
    }
    if (!currentMedicine.quantity) {
      toast.error("Please enter quantity");
      return;
    }

    setIsSubmitting(true);

    try {
      // Add new medicine to medibase if needed
      if (currentMedicine.newMedicine && !medicineOptions.some(opt => opt.value === currentMedicine.newMedicine)) {
        await addDoc(collection(db, "medibase"), { name: currentMedicine.newMedicine });
        setMedicineOptions(prev => [...prev, 
          { value: currentMedicine.newMedicine, label: currentMedicine.newMedicine }
        ]);
      }

      const newMed = {
        medicineName: currentMedicine.newMedicine || currentMedicine.medicine.value,
        quantity: currentMedicine.quantity,
        time: currentMedicine.time,
        patientsNow: currentMedicine.patientsNow,
        status: "active",
        drugAwareness: currentMedicine.drugAwareness,
        source: currentMedicine.source,
        prescribed: currentMedicine.prescribed,
        consuming: currentMedicine.consuming,
        response: currentMedicine.response,
        expiryDate: currentMedicine.expiryDate,
        updatedDate: currentMedicine.updatedDate
      };

      const updatedMeds = editingIndex !== null 
        ? medicines.map((med, i) => i === editingIndex ? newMed : med)
        : [...medicines, newMed];

      const updateData = {
        patientId,
        patientDetails: patientData,
        medicines: updatedMeds,
        providerData,
        submittedAt: new Date().toISOString(),
      };

      if (medicineDocId) {
        await updateDoc(doc(db, "Medicines", medicineDocId), updateData);
      } else {
        const docRef = await addDoc(collection(db, "Medicines"), updateData);
        setMedicineDocId(docRef.id);
      }

      setMedicines(updatedMeds);
      setShowModal(false);
      setEditingIndex(null);
      setCurrentMedicine({
        medicine: null,
        newMedicine: "",
        quantity: "",
        time: "Morning",
        patientsNow: false,
        drugAwareness: "N/A",
        source: "P",
        prescribed: "",
        consuming: "",
        response: "N/A",
        expiryDate: "",
        updatedDate: new Date().toISOString().split('T')[0]
      });

      toast.success("Medicine saved successfully!");
    } catch (error) {
      console.error("Error saving medicine:", error);
      toast.error("Error saving medicine");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProviderSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const updateData = {
        patientId,
        patientDetails: patientData,
        medicines,
        providerData,
        submittedAt: new Date().toISOString(),
      };

      if (medicineDocId) {
        await updateDoc(doc(db, "Medicines", medicineDocId), updateData);
        toast.success("Provider data saved successfully!");
        setShowProviderModal(false);
      } else {
        const docRef = await addDoc(collection(db, "Medicines"), updateData);
        setMedicineDocId(docRef.id);
        toast.success("Provider data saved successfully!");
        setShowProviderModal(false);
      }
    } catch (error) {
      console.error("Error saving provider data:", error);
      toast.error("Error saving provider data");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (index) => {
    const med = medicines[index];
    setCurrentMedicine({
      medicine: { value: med.medicineName, label: med.medicineName },
      newMedicine: "",
      quantity: med.quantity,
      time: med.time,
      patientsNow: med.patientsNow,
      drugAwareness: med.drugAwareness,
      source: med.source,
      prescribed: med.prescribed,
      consuming: med.consuming,
      response: med.response,
      expiryDate: med.expiryDate,
      updatedDate: med.updatedDate
    });
    setEditingIndex(index);
    setShowModal(true);
  };

  const handleDelete = async (index) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this medicine?");
    if (!confirmDelete) return;

    try {
      const updatedMeds = medicines.filter((_, i) => i !== index);
      await updateDoc(doc(db, "Medicines", medicineDocId), { 
        medicines: updatedMeds,
        providerData 
      });
      setMedicines(updatedMeds);
      toast.success("Medicine deleted successfully!");
    } catch (error) {
      console.error("Error deleting medicine:", error);
      toast.error("Error deleting medicine");
    }
  };

  const handleStopStart = async (index, newStatus) => {
    const confirmAction = window.confirm(`Are you sure you want to ${newStatus === "stopped" ? "stop" : "start"} this medicine?`);
    if (!confirmAction) return;

    try {
      const updatedMeds = medicines.map((med, i) => 
        i === index ? { ...med, status: newStatus } : med
      );

      await updateDoc(doc(db, "Medicines", medicineDocId), { 
        medicines: updatedMeds,
        providerData 
      });
      setMedicines(updatedMeds);
      toast.success(`Medicine ${newStatus === "stopped" ? "stopped" : "started"} successfully!`);
    } catch (error) {
      console.error(`Error ${newStatus === "stopped" ? "stopping" : "starting"} medicine:`, error);
      toast.error(`Error ${newStatus === "stopped" ? "stopping" : "starting"} medicine`);
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <img
          src="https://media.giphy.com/media/YMM6g7x45coCKdrDoj/giphy.gif"
          alt="Loading..."
          className="loading-image"
        />
      </div>
    );
  }

  const exportMedicineToPrint = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Medicine List - Patient ID: ${patientId}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 10px;
              font-size: 10px;
            }
            h1 {
              font-size: 16px;
              color: #283593;
              margin-bottom: 15px;
            }
            .section-header {
              font-size: 11px;
              background-color: #d3d3d3;
              padding: 3px;
              margin-top: 8px;
              margin-bottom: 3px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 8px;
              page-break-inside: avoid;
            }
            table, th, td {
              border: 1px solid #ddd;
            }
            th, td {
              padding: 4px;
              text-align: left;
              font-size: 10px;
            }
            th {
              background-color: #f5f5f5;
            }
            tr:nth-child(even) {
              background-color: #f9f9f9;
            }
            @media print {
              .section {
                page-break-inside: avoid;
              }
            }
          </style>
        </head>
        <body>
          <h1>Medicine List - Patient ID: ${patientId}</h1>
    `);
  
    // Add Patient Details Section
    printWindow.document.write('<div class="section">');
    printWindow.document.write('<div class="section-header">Patient Details</div>');
    printWindow.document.write(`
      <table>
        <tbody>
          <tr>
            <td><strong>Name:</strong></td>
            <td>${patientData?.name || "N/A"}</td>
          </tr>
          <tr>
            <td><strong>Address:</strong></td>
            <td>${patientData?.address || "N/A"}</td>
          </tr>
        </tbody>
      </table>
    `);
    printWindow.document.write('</div>');
  
    // Add Provider Details Section
    printWindow.document.write('<div class="section">');
    printWindow.document.write('<div class="section-header">Provider Details</div>');
    printWindow.document.write(`
      <table>
        <tbody>
          <tr>
            <td><strong>Current Medicine Provider:</strong></td>
            <td>${providerData?.currentProvider || "N/A"}</td>
          </tr>
          <tr>
            <td><strong>Drug Allergy:</strong></td>
            <td>${providerData?.drugAllergy || "N/A"}</td>
          </tr>
        </tbody>
      </table>
    `);
    printWindow.document.write('</div>');
  
    // Add Medicine List Section
    printWindow.document.write('<div class="section">');
    printWindow.document.write('<div class="section-header">Medication List</div>');
    printWindow.document.write(`
      <table>
        <thead>
          <tr>
            <th>Medicine</th>
            <th>Quantity</th>
            <th>Time</th>
            <th>Patients Show</th>
            <th>Drug Awareness</th>
            <th>Source</th>
            <th>Prescribed</th>
            <th>Consuming</th>
            <th>Response</th>
            <th>Expiry Date</th>
            <th>Updated Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${medicines
            .map(
              (med) => `
            <tr style="background-color: ${med.status === "stopped" ? "#ffcccc" : "white"}">
              <td>${med.medicineName}</td>
              <td>${med.quantity}</td>
              <td>${med.time}</td>
              <td>${med.patientsNow ? "Yes" : "No"}</td>
              <td>${med.drugAwareness}</td>
              <td>${med.source}</td>
              <td>${med.prescribed}</td>
              <td>${med.consuming}</td>
              <td>${med.response}</td>
              <td>${med.expiryDate}</td>
              <td>${med.updatedDate}</td>
              <td>${med.status}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    `);
    printWindow.document.write('</div>');
  
    printWindow.document.write(`
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="MedAdd-container">
      <button className="MedAdd-backButton" onClick={() => navigate(-1)}>
        &larr; Back
      </button>
      <h2 className="MedAdd-title">Medicines: {patientData.name}</h2>

      {/* {patientData && (
        <div className="MedAdd-patientInfo">
          <h3>Patient Details</h3>
          <p><strong>Name:</strong> {patientData.name}</p>
          <p><strong>Address:</strong> {patientData.address}</p>
        </div>
      )} */}

      <div className="MedAdd-provider-info">
        <h3>Provider Details</h3>
        <p><strong>Current Medicine Provider:</strong> {providerData.currentProvider || "N/A"}</p>
        <p><strong>Drug Allergy:</strong> {providerData.drugAllergy || "N/A"}</p>
        <button 
          className="MedAdd-editProviderButton"
          onClick={() => setShowProviderModal(true)}
        >
          <FaEdit /> Edit Provider Details
        </button>
      </div>

      <div className="MedAdd-header">
        <h3>Medication List</h3>
        <div>
          <button className="MedAdd-addButton" onClick={() => setShowModal(true)}>
            Add New Medicine
          </button>
          <button className="MedAdd-addButton2 MedAdd-addButton m-1" onClick={exportMedicineToPrint}>
            Print
          </button>
        </div>
      </div>

      {medicines.length > 0 ? (
        <div className="table-responsive">
          <table className="MedAdd-table">
            <thead>
              <tr>
                <th>Medicine</th>
                <th>Quantity</th>
                <th>Time</th>
                <th>Patients Show</th>
                <th>Drug Awareness</th>
                <th>Source</th>
                <th>Prescribed</th>
                <th>Consuming</th>
                <th>Response</th>
                <th>Expiry Date</th>
                <th>Updated Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {medicines.map((med, index) => (
                <tr key={index} style={{ backgroundColor: med.status === "stopped" ? "#ffcccc" : "white" }}>
                  <td>{med.medicineName}</td>
                  <td>{med.quantity}</td>
                  <td>{med.time}</td>
                  <td>{med.patientsNow ? "Yes" : "No"}</td>
                  <td>{med.drugAwareness}</td>
                  <td>{med.source}</td>
                  <td>{med.prescribed}</td>
                  <td>{med.consuming}</td>
                  <td>{med.response}</td>
                  <td>{med.expiryDate}</td>
                  <td>{med.updatedDate}</td>
                  <td>
                    <button onClick={() => handleEdit(index)} className="btn btn-warning btn-sm me-1 del-get">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(index)} className="btn btn-danger btn-sm m-1">
                      <FaTrash />
                    </button>
                    {med.status === "active" ? (
                      <button onClick={() => handleStopStart(index, "stopped")} className="btn btn-secondary btn-sm st-btn">
                        Stop
                      </button>
                    ) : (
                      <button onClick={() => handleStopStart(index, "active")} className="btn btn-success btn-sm st-btn">
                        Start
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No medications found</p>
      )}

      {/* Medicine Modal */}
      {showModal && (
        <div className="MedAdd-modal">
          <div className="MedAdd-modalContent">
            <h3>{editingIndex !== null ? "Edit Medicine" : "Add New Medicine"}</h3>
            <form onSubmit={handleSubmit}>
              <div className="MedAdd-formGroup">
                <label>Medicine Name:</label>
                <Select
                  options={medicineOptions}
                  value={currentMedicine.medicine}
                  onChange={(option) => handleInputChange("medicine", option)}
                  placeholder="Select medicine"
                  isClearable
                />
                <span className="MedAdd-or">OR</span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter new medicine name"
                  value={currentMedicine.newMedicine}
                  onChange={(e) => handleInputChange("newMedicine", e.target.value)}
                />
              </div>

              <div className="MedAdd-formGroup">
                <label>Quantity:</label>
                <input
                  type="text"
                  className="form-control"
                  value={currentMedicine.quantity}
                  onChange={(e) => handleInputChange("quantity", e.target.value)}
                />
              </div>

              <div className="MedAdd-formGroup">
                <label>Time:</label>
                <select
                  value={currentMedicine.time}
                  className="form-control"
                  onChange={(e) => handleInputChange("time", e.target.value)}
                >
                  <option value="Morning">Morning</option>
                  <option value="Noon">Noon</option>
                  <option value="Night">Night</option>
                  <option value="Morning-Noon">Morning & Noon</option>
                  <option value="Morning-Night">Morning & Night</option>
                  <option value="Noon-Night">Noon & Night</option>
                  <option value="Morning-Noon-Night">Morning, Noon & Night</option>
                  <option value="SOS">SOS</option>
                </select>
              </div>

              <div className="MedAdd-formGroup">
                <label>Drug Awareness:</label>
                <select
                  value={currentMedicine.drugAwareness}
                  className="form-control"
                  onChange={(e) => handleInputChange("drugAwareness", e.target.value)}
                >
                  <option value="N/A">N/A</option>
                  <option value="-1">-1</option>
                  <option value="0">0</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                </select>
              </div>

              <div className="MedAdd-formGroup">
                <label>Source:</label>
                <select
                  value={currentMedicine.source}
                  className="form-control"
                  onChange={(e) => handleInputChange("source", e.target.value)}
                >
                  <option value="P">P</option>
                  <option value="G">G</option>
                  <option value="S">S</option>
                  <option value="O">O</option>
                </select>
              </div>

              <div className="MedAdd-formGroup">
                <label>Prescribed:</label>
                <input
                  type="text"
                  className="form-control"
                  value={currentMedicine.prescribed}
                  onChange={(e) => handleInputChange("prescribed", e.target.value)}
                />
              </div>

              <div className="MedAdd-formGroup">
                <label>Consuming:</label>
                <input
                  type="text"
                  className="form-control"
                  value={currentMedicine.consuming}
                  onChange={(e) => handleInputChange("consuming", e.target.value)}
                />
              </div>

              <div className="MedAdd-formGroup">
                <label>Response:</label>
                <select
                  value={currentMedicine.response}
                  className="form-control"
                  onChange={(e) => handleInputChange("response", e.target.value)}
                >
                  <option value="N/A">N/A</option>
                  <option value="-1">-1</option>
                  <option value="0">0</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                </select>
              </div>

              <div className="MedAdd-formGroup">
                <label>Expiry Date:</label>
                <input
                  type="date"
                  className="form-control"
                  value={currentMedicine.expiryDate}
                  onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                />
              </div>

              <div className="MedAdd-formGroup">
                <label>Updated Date:</label>
                <input
                  type="date"
                  className="form-control"
                  value={currentMedicine.updatedDate}
                  onChange={(e) => handleInputChange("updatedDate", e.target.value)}
                />
              </div>

              <div className="MedAdd-formGroup">
                <label>
                  <input
                    type="checkbox"
                    checked={!!currentMedicine.patientsNow}
                    onChange={(e) => handleInputChange("patientsNow", e.target.checked)}
                  />
                  Patients Show
                </label>
              </div>

              <div className="MedAdd-modalActions">
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => {
                    setShowModal(false);
                    setEditingIndex(null);
                    setCurrentMedicine({
                      medicine: null,
                      newMedicine: "",
                      quantity: "",
                      time: "Morning",
                      patientsNow: false,
                      drugAwareness: "N/A",
                      source: "P",
                      prescribed: "",
                      consuming: "",
                      response: "N/A",
                      expiryDate: "",
                      updatedDate: new Date().toISOString().split('T')[0]
                    });
                  }}
                >
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="btn btn-success btn-sm">
                  {isSubmitting ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Provider Modal */}
      {showProviderModal && (
        <div className="MedAdd-modal">
          <div className="MedAdd-modalContent">
            <h3>Edit Provider Details</h3>
            <form onSubmit={handleProviderSubmit}>
              <div className="MedAdd-formGroup">
                <label>Current Medicine Provider:</label>
                <input
                  type="text"
                  className="form-control"
                  value={providerData.currentProvider}
                  onChange={(e) => handleProviderInputChange("currentProvider", e.target.value)}
                />
              </div>

              <div className="MedAdd-formGroup">
                <label>Drug Allergy:</label>
                <input
                  type="text"
                  className="form-control"
                  value={providerData.drugAllergy}
                  onChange={(e) => handleProviderInputChange("drugAllergy", e.target.value)}
                />
              </div>

              <div className="MedAdd-modalActions">
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => setShowProviderModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="btn btn-success btn-sm">
                  {isSubmitting ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default Medicine;