import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../Firebase/config";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaArrowLeft, FaTrash, FaPlus, FaTimes } from "react-icons/fa";
import "./MedicineList.css";

const MedicineList = () => {
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState([]);
  const [search, setSearch] = useState("");
  const [newMedicine, setNewMedicine] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [confirmPin, setConfirmPin] = useState("");
  const medicinesPerPage = 10;

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const medicineSnapshot = await getDocs(collection(db, "medibase"));
        setMedicines(medicineSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching medicines:", error);
      }
    };
    fetchMedicines();
  }, []);

  const handleAddMedicine = async () => {
    if (!newMedicine.trim()) return;
    try {
      const docRef = await addDoc(collection(db, "medibase"), { name: newMedicine.trim() });
      setMedicines([...medicines, { id: docRef.id, name: newMedicine.trim() }]);
      setNewMedicine("");
      setShowModal(false);
      toast.success("Medicine added successfully!");
    } catch (error) {
      console.error("Error adding medicine:", error);
      toast.error("Failed to add medicine.");
    }
  };

  const handleDeleteMedicine = async () => {
    if (confirmPin !== "2012") {
      toast.error("Incorrect PIN!");
      return;
    }
    try {
      await deleteDoc(doc(db, "medibase", deleteId));
      setMedicines(medicines.filter((medicine) => medicine.id !== deleteId));
      setDeleteId(null);
      setConfirmPin("");
      toast.success("Medicine deleted successfully!");
    } catch (error) {
      console.error("Error deleting medicine:", error);
      toast.error("Failed to delete medicine.");
    }
  };

  const filteredMedicines = medicines.filter((med) =>
    med.name.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLastMedicine = currentPage * medicinesPerPage;
  const indexOfFirstMedicine = indexOfLastMedicine - medicinesPerPage;
  const currentMedicines = filteredMedicines.slice(indexOfFirstMedicine, indexOfLastMedicine);

  return (
    <div className="medlist-container">
      <button className="medlist-back-button" onClick={() => navigate(-1)}>
        <FaArrowLeft /> Back
      </button>
      <h2>Medicine List</h2>
      <input
        type="text"
        placeholder="Search medicine..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="medlist-input"
      />
      <button onClick={() => setShowModal(true)} className="medlist-add-button mb-4">
        <FaPlus /> Add Medicine
      </button>
      <table className="medlist-table">
        <thead>
          <tr>
            <th>Medicine Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentMedicines.map((medicine) => (
            <tr key={medicine.id}>
              <td>{medicine.name}</td>
              <td>
                <button onClick={() => setDeleteId(medicine.id)} className="medlist-delete-button">
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="medlist-pagination">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <button
          onClick={() => setCurrentPage((prev) => (indexOfLastMedicine < filteredMedicines.length ? prev + 1 : prev))}
          disabled={indexOfLastMedicine >= filteredMedicines.length}
        >
          Next
        </button>
      </div>
      {showModal && (
        <div className="medlist-modal">
          <div className="medlist-modal-content">
            <FaTimes className="medlist-close" onClick={() => setShowModal(false)} />
            <h3>Add New Medicine</h3>
            <input
              type="text"
              placeholder="Medicine Name"
              value={newMedicine}
              onChange={(e) => setNewMedicine(e.target.value)}
              className="medlist-input"
            />
            <button onClick={handleAddMedicine} className="medlist-add-button">Add</button>
          </div>
        </div>
      )}
      {deleteId && (
        <div className="medlist-modal">
          <div className="medlist-modal-content">
            <h3>Confirm Deletion</h3>
            <p>Enter PIN to delete:</p>
            <input
              type="password"
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value)}
              className="medlist-input"
            />
            <button onClick={handleDeleteMedicine} className="medlist-delete-button me-3">Confirm</button>
            <button onClick={() => setDeleteId(null)} className="medlist-cancel-button">Cancel</button>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default MedicineList;