import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../Firebase/config";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const NewConnection = () => {
  const navigate = useNavigate();
  const [routes, setRoutes] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    organization: "",
    phone: "",
    address: "",
    ownerName: "",
    ownerPhone: "",
    password: "",
    route: "",
    currentBalance: 0
  });

  useEffect(() => {
    // Generate initial ID
    setFormData(prev => ({ ...prev, id: "00001" }));
    
    // Fetch routes for dropdown
    const fetchRoutes = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "routes"));
        const routesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setRoutes(routesData);
      } catch (error) {
        toast.error("Failed to load routes");
        console.error("Error fetching routes: ", error);
      }
    };
    
    fetchRoutes();
  }, []);

  const generatePassword = (phone) => {
    const randomChars = phone?.slice(-4) + "@tbgmkba";
    return randomChars;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === "phone" && { password: generatePassword(value) })
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await addDoc(collection(db, "customers"), formData);
      toast.success("Customer added successfully!", {
        onClose: () => navigate("/all-customers"),
        autoClose: 3000
      });
      
      // Reset form with new ID
      const newId = String(parseInt(formData.id) + 1).padStart(5, '0');
      setFormData({
        id: newId,
        name: "",
        organization: "",
        phone: "",
        address: "",
        ownerName: "",
        ownerPhone: "",
        password: "",
        route: "",
        currentBalance: 0
      });
    } catch (error) {
      toast.error("Error adding customer: " + error.message);
      console.error("Error adding document: ", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <h2>New Connection</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>ID:</label>
          <input
            type="text"
            name="id"
            value={formData.id}
            onChange={handleChange}
            required
            readOnly
          />
        </div>
        
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Organization:</label>
          <input
            type="text"
            name="organization"
            value={formData.organization}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label>Phone:</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Address:</label>
          <textarea
          className="form-control"
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows="3"
          />
        </div>
        
        <div className="form-group">
          <label>Owner Name:</label>
          <input
            type="text"
            name="ownerName"
            value={formData.ownerName}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label>Owner Phone:</label>
          <input
            type="text"
            name="ownerPhone"
            value={formData.ownerPhone}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label>Password (Auto-generated):</label>
          <input
            type="text"
            name="password"
            value={formData.password}
            readOnly
          />
        </div>
        
        <div className="form-group">
          <label>Route:</label>
          <select
            name="route"
            value={formData.route}
            onChange={handleChange}
            required
          >
            <option value="">Select Route</option>
            {routes.map(route => (
              <option key={route.id} value={route.name}>
                {route.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label>Current Balance Amount:</label>
          <input
            type="number"
            name="currentBalance"
            value={formData.currentBalance}
            onChange={handleChange}
            required
          />
        </div>
        
        <button 
          type="submit" 
          className="submit-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save Connection'}
        </button>
      </form>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default NewConnection;