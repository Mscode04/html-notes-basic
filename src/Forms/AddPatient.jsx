import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../Firebase/config";
import { collection, addDoc, getDocs, query } from "firebase/firestore";
import { doc, setDoc } from "firebase/firestore";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AddPatient.css";

const AddPatient = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [existingRegisterNumbers, setExistingRegisterNumbers] = useState([]);
  const [patientData, setPatientData] = useState({
    profile: {
      registernumber: "",
      name: "",
      age: "",
      dob: "",
      gender: "NOT SAY",
      category: "B",
      address: "",
      email: ".mkba@gmail.com",
      password: "",
      mainCaretaker: "",
      mainCaretakerPhone: "",
      panchayat: "",
      ward: "",
      location: "",
      relativePhone: "",
      communityVolunteer: "",
      communityVolunteerPhone: "",
      deactivated: false,
      referralPerson: "",
      referralPhone: "",
      neighbourName: "",
      neighbourPhone: "",
      wardMember: "",
      wardMemberPhone: "",
      ashaWorker: "",
      additionalInfo: "",
    },
    medical: {
      mainDiagnosis: "",
      medicalHistory: "",
      currentDifficulties: "",
    },
    doctor: {
      advice: "",
      note: "",
      examinations: "",
    },
  });

  const [registrationDate, setRegistrationDate] = useState("");
  const [familyDetails, setFamilyDetails] = useState([
    {
      name: "",
      age: "",
      relation: "",
      education: "",
      income: "",
      marriageStatus: "",
      remark: "NOT",
    },
  ]);

  useEffect(() => {
    // Fetch all existing registernumbers from Firestore
    const fetchRegisterNumbers = async () => {
      const q = query(collection(db, "Patients"));
      const querySnapshot = await getDocs(q);
      const registerNumbers = querySnapshot.docs.map((doc) => doc.data().registernumber);
      setExistingRegisterNumbers(registerNumbers);
    };

    fetchRegisterNumbers();
  }, []);

  const handleChange = (e, section) => {
    const { name, value } = e.target;
    setPatientData((prevData) => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        [name]: value,
      },
    }));
  };

  const handleFamilyDetailsChange = (index, e) => {
    const { name, value } = e.target;
    const updatedFamilyDetails = [...familyDetails];
    updatedFamilyDetails[index][name] = value;
    setFamilyDetails(updatedFamilyDetails);
  };

  const addFamilyMember = () => {
    setFamilyDetails([
      ...familyDetails,
      {
        name: "",
        relation: "",
        age: "",
        education: "",
        income: "",
        marriageStatus: "",
        remark: "NOT",
      },
    ]);
  };

  const generatePatientId = () => {
    const min = 100000000000; // Smallest 12-digit number
    const max = 999999999999; // Largest 12-digit number
    return (Math.floor(Math.random() * (max - min + 1)) + min).toString(); // Ensure it's a string
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if registernumber already exists
    if (existingRegisterNumbers.includes(patientData.profile.registernumber)) {
      toast.warning("Register number already exists!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    setLoading(true); // Start loading

    // Show "wait a moment" toast
    toast.info("Wait a moment...", {
      position: "top-center",
      autoClose: false, // Don't auto-close this toast
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
    });

    try {
      const patientId = generatePatientId();
      const registerTime = new Date().toISOString();

      const profileData = {
        ...patientData.profile,
        age: patientData.profile.age.toString(),
        mainCaretakerPhone: patientData.profile.mainCaretakerPhone.toString(),
        relativePhone: patientData.profile.relativePhone.toString(),
        referralPhone: patientData.profile.referralPhone.toString(),
        neighbourPhone: patientData.profile.neighbourPhone.toString(),
        communityVolunteerPhone: patientData.profile.communityVolunteerPhone.toString(),
        wardMemberPhone: patientData.profile.wardMemberPhone.toString(),
      };

      await setDoc(doc(db, "Patients", patientId), {
        ...profileData,
        ...patientData.medical,
        ...patientData.doctor,
        familyDetails: familyDetails.map((member) => ({
          ...member,
          age: member.age.toString(),
          income: member.income.toString(),
        })),
        registrationDate,
        registerTime,
        patientId,
      });

      await addDoc(collection(db, "users"), {
        email: patientData.profile.email,
        password: patientData.profile.password,
        patientId,
        is_nurse: false,
      });

      // Dismiss the "wait a moment" toast
      toast.dismiss();

      // Show success toast
      toast.success("Patient added successfully!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      setTimeout(() => {
        navigate(`/main/patient/${patientId}`);
      }, 3000);
    } catch (error) {
      // Dismiss the "wait a moment" toast
      toast.dismiss();

      // Show error toast
      toast.error(`Failed to add patient: ${error.message}`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="AddPatient-container">
      {loading && (
        <div className="loading-container">
          <img
            src="https://media.giphy.com/media/YMM6g7x45coCKdrDoj/giphy.gif"
            alt="Loading..."
            className="loading-image"
          />
        </div>
      )}
      <button className="AddPatient-backButton" onClick={() => navigate(-1)}>
        &larr; Back
      </button>
      <h2 className="AddPatient-title">Add New Patient</h2>
      <form onSubmit={handleSubmit} className="AddPatient-form">
        {/* Section 1: Profile */}
        <h4 className="AddPatient-sectionTitle">Section 1: Profile</h4>
        <div className="AddPatient-field">
          <label htmlFor="registrationDate">Registration Date: MM-DD-YYYY</label>
          <input
            type="date"
            id="registrationDate"
            name="registrationDate"
            value={registrationDate}
            onChange={(e) => setRegistrationDate(e.target.value)}
            required
          />
        </div>
        <div className="AddPatient-row">
          {Object.entries(patientData.profile).map(([field, value]) => (
            <div className="AddPatient-field" key={field}>
              <label
                htmlFor={field}
                className={field === "deactivated" ? "d-none" : ""}
              >
                {field.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}:
              </label>
              {field === "gender" ? (
                <select
                  id={field}
                  name={field}
                  className="form-control"
                  value={value || ""}
                  onChange={(e) => handleChange(e, "profile")}
                >
                  <option value="NOT SAY">Not Mention</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              ) : field === "category" ? (
                <select
                  id={field}
                  name={field}
                  className="form-control"
                  value={value || ""}
                  onChange={(e) => handleChange(e, "profile")}
                >
                  <option value="">Not Mention</option>
                  <option value="B">B</option>
                  <option value="A">A</option>
                  <option value="C">C</option>
                  <option value="NHC">NHC</option>
                  <option value="SOS">SOS</option>
                  <option value="MEDICAL SUPPORT">MEDICAL SUPPORT</option>
                </select>
              ) : field === "location" || field === "additionalInfo" ? (
                <textarea
                  id={field}
                  name={field}
                  value={value || ""}
                  onChange={(e) => handleChange(e, "profile")}
                  rows="3"
                />
              ) : field === "dob" ? (
                <input
                  type="date"
                  id={field}
                  name={field}
                  value={value || ""}
                  onChange={(e) => handleChange(e, "profile")}
                />
              ) : field === "deactivated" ? (
                <input
                  type="text"
                  id={field}
                  className="d-none"
                  name={field}
                  value={value || ""}
                  onChange={(e) => handleChange(e, "profile")}
                />
              ) : (
                <input
                  type={field === "email" ? "text" : field === "password" ? "password" : "text"}
                  id={field}
                  name={field}
                  value={value || ""}
                  onChange={(e) => handleChange(e, "profile")}
                />
              )}
            </div>
          ))}
        </div>

        {/* Section 2: Medical Section */}
        <h4 className="AddPatient-sectionTitle">Section 2: Medical Section</h4>
        <div className="AddPatient-row">
          {Object.entries(patientData.medical).map(([field, value]) => (
            <div className="AddPatient-field" key={field}>
              <label htmlFor={field}>
                {field.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}:
              </label>
              <textarea
                id={field}
                name={field}
                value={value}
                onChange={(e) => handleChange(e, "medical")}
                rows="4"
              ></textarea>
            </div>
          ))}
        </div>

        {/* Section 3: Doctor */}
        <h4 className="AddPatient-sectionTitle">Section 3: Doctor</h4>
        <div className="AddPatient-row">
          {Object.entries(patientData.doctor).map(([field, value]) => (
            <div className="AddPatient-field" key={field}>
              <label htmlFor={field}>
                {field.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}:
              </label>
              <textarea
                id={field}
                name={field}
                value={value}
                onChange={(e) => handleChange(e, "doctor")}
                rows="3"
              ></textarea>
            </div>
          ))}
        </div>

        {/* Section 4: Family Details */}
        <h4 className="AddPatient-sectionTitle">Section 4: Family Details</h4>
        {familyDetails.map((family, index) => (
          <div key={index} className="AddPatient-familyDetails">
            <h5>Family Member {index + 1}</h5>
            <div className="AddPatient-row">
              {Object.entries(family).map(([field, value]) => (
                <div className="AddPatient-field" key={field}>
                  <label htmlFor={`${field}-${index}`}>
                    {field.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}:
                  </label>
                  <input
                    type="text"
                    id={`${field}-${index}`}
                    name={field}
                    value={value}
                    onChange={(e) => handleFamilyDetailsChange(index, e)}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
        <button type="button" className="AddPatient-addFamilyButton" onClick={addFamilyMember}>
          + Family Member
        </button>

        {/* Submit Button */}
        <button type="submit" className="AddPatient-submitButton" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default AddPatient;