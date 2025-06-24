import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../Firebase/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AddPatient.css"; // Reuse the same CSS file

const UpdatePatient = () => {
  const { patientId } = useParams(); // Get patientId from the URL
  const navigate = useNavigate();
  const [patientData, setPatientData] = useState({
    profile: {
      name: "",
      registernumber: "",
      age: "",
      gender: "",
      category: "",
      address: "",
      email: "",
      password: "",
      dob: "",
      location: "",
      panchayat: "",
      ward: "",
      mainCaretaker: "",
      mainCaretakerPhone: "",
      relativePhone: "",
      referralPerson: "",
      referralPhone: "",
      neighbourName: "",
      neighbourPhone: "",
      communityVolunteer: "",
      communityVolunteerPhone: "",
      wardMember: "",
      wardMemberPhone: "",
      ashaWorker: "",
      additionalInfo: "",
    },
    medical: {
      medicalHistory: "",
      currentDifficulties: "",
      mainDiagnosis: "",
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
      relation: "",
      age: "",
      education: "",
      income: "",
      marriageStatus: "",
      remark: "",
    },
  ]);

  // Fetch existing patient data
  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const docRef = doc(db, "Patients", patientId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const patientData = docSnap.data();
          setPatientData({
            profile: patientData.profile || patientData,
            medical: patientData.medical || {},
            doctor: patientData.doctor || {},
            additionalInfo: patientData.additionalInfo || "",
            deactivated: patientData.deactivated ?? false,
          });
          setRegistrationDate(patientData.registrationDate || "");
          setFamilyDetails(patientData.familyDetails || []);
        } else {
          toast.error("Patient not found!", {
            position: "top-center",
            autoClose: 3000,
          });
          navigate("/main/patients"); // Redirect if patient not found
        }
      } catch (error) {
        console.error("Error fetching patient: ", error);
        toast.error(`Error fetching patient: ${error.message}`, {
          position: "top-center",
          autoClose: 5000,
        });
      }
    };

    fetchPatient();
  }, [patientId, navigate]);

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
        remark: "",
      },
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const patientRef = doc(db, "Patients", patientId);
      await updateDoc(patientRef, {
        ...patientData.profile,
        ...patientData.medical,
        familyDetails,
        registrationDate,
        deactivated: false,
      });

      toast.success("Patient updated successfully!", {
        position: "top-center",
        autoClose: 3000,
      });

      setTimeout(() => {
        navigate(`/main/patient/${patientId}`);
      }, 3000);
    } catch (error) {
      toast.error(`Failed to update patient: ${error.message}`, {
        position: "top-center",
        autoClose: 5000,
      });
    }
  };

  return (
    <div className="AddPatient-container">
      <button className="AddPatient-backButton" onClick={() => navigate(-1)}>
        &larr; Back      </button>
      <h2 className="AddPatient-title">Update Patient</h2>
      <form onSubmit={handleSubmit} className="AddPatient-form">
        {/* Section 1: Profile */}
        <h4 className="AddPatient-sectionTitle">Profile Section : </h4>
        <div className="AddPatient-row">
                {/* Registration Date */}
        <div className="AddPatient-field">
          <label htmlFor="registrationDate">Registration Date:</label>
          <input
            type="date"
            id="registrationDate"
            name="registrationDate"
            value={registrationDate}
            onChange={(e) => setRegistrationDate(e.target.value)}
            required
          />
        </div>
          <div className="AddPatient-field">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={patientData.profile.name}
              onChange={(e) => handleChange(e, "profile")}
            />
          </div>
          <div className="AddPatient-field">
            <label htmlFor="registernumber">Register Number:</label>
            <input
              type="text"
              id="registernumber"
              name="registernumber"
              value={patientData.profile.registernumber}
              onChange={(e) => handleChange(e, "profile")}
            />
          </div>
          <div className="AddPatient-field">
            <label htmlFor="age">Age:</label>
            <input
              type="text"
              id="age"
              name="age"
              value={patientData.profile.age}
              onChange={(e) => handleChange(e, "profile")}
            />
          </div>
          <div className="AddPatient-field">
                  <label htmlFor="gender">Gender:</label>
                  <select
                    id="gender"
                    name="gender"
                    className="form-control"
                    value={patientData.profile.gender}
                    onChange={(e) => handleChange(e, "profile")}
                  >
                  <option value="NOT SAY">Not Mention</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                  </select>
                  </div>
                  <div className="AddPatient-field">
  <label htmlFor="category">Category:</label>
  <select
    id="category"
    name="category"
    className="form-control"
    value={patientData.profile.category}
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
</div>
      
          <div className="AddPatient-field">
            <label htmlFor="address">Address:</label>
            <input
              type="text"
              id="address"
              name="address"
              value={patientData.profile.address}
              onChange={(e) => handleChange(e, "profile")}
            />
          </div>
          <div className="AddPatient-field">
            <label htmlFor="email">Email:</label>
            <input
              type="text"
              id="email"
              name="email"
              value={patientData.profile.email}
              onChange={(e) => handleChange(e, "profile")}
            />
          </div>
          <div className="AddPatient-field">
            <label htmlFor="password">Password:</label>
            <input
              type="text"
              id="password"
              name="password"
              value={patientData.profile.password}
              onChange={(e) => handleChange(e, "profile")}
            />
          </div>
          <div className="AddPatient-field">
            <label htmlFor="dob">Dob:</label>
            <input
              type="date"
              id="dob"
              name="dob"
              value={patientData.profile.dob}
              onChange={(e) => handleChange(e, "profile")}
            />
          </div>
          <div className="AddPatient-field">
  <label htmlFor="location">Location:</label>
  <textarea
    id="location"
    name="location"
    style={{ height: "80px" }} // You can adjust the height as needed
    value={patientData.profile.location}
    onChange={(e) => handleChange(e, "profile")}
  />
</div>
          <div className="AddPatient-field">
            <label htmlFor="panchayat">Panchayat:</label>
            <input
              type="text"
              id="panchayat"
              name="panchayat"
              value={patientData.profile.panchayat}
              onChange={(e) => handleChange(e, "profile")}
            />
          </div>
          <div className="AddPatient-field">
            <label htmlFor="ward">Ward:</label>
            <input
              type="text"
              id="ward"
              name="ward"
              value={patientData.profile.ward}
              onChange={(e) => handleChange(e, "profile")}
            />
          </div>
          <div className="AddPatient-field">
            <label htmlFor="mainCaretaker">MainCaretaker:</label>
            <input
              type="text"
              id="mainCaretaker"
              name="mainCaretaker"
              value={patientData.profile.mainCaretaker}
              onChange={(e) => handleChange(e, "profile")}
            />
          </div>
          <div className="AddPatient-field">
            <label htmlFor="mainCaretakerPhone">MainCaretakerPhone:</label>
            <input
              type="text"
              id="mainCaretakerPhone"
              name="mainCaretakerPhone"
              value={patientData.profile.mainCaretakerPhone}
              onChange={(e) => handleChange(e, "profile")}
            />
          </div>
          <div className="AddPatient-field">
            <label htmlFor="relativePhone">RelativePhone:</label>
            <input
              type="text"
              id="relativePhone"
              name="relativePhone"
              value={patientData.profile.relativePhone}
              onChange={(e) => handleChange(e, "profile")}
            />
          </div>
          <div className="AddPatient-field">
            <label htmlFor="referralPerson">ReferralPerson:</label>
            <input
              type="text"
              id="referralPerson"
              name="referralPerson"
              value={patientData.profile.referralPerson}
              onChange={(e) => handleChange(e, "profile")}
            />
          </div>
          <div className="AddPatient-field">
            <label htmlFor="referralPhone">ReferralPhone:</label>
            <input
              type="text"
              id="referralPhone"
              name="referralPhone"
              value={patientData.profile.referralPhone}
              onChange={(e) => handleChange(e, "profile")}
            />
          </div>
          <div className="AddPatient-field">
            <label htmlFor="neighbourName">NeighbourName:</label>
            <input
              type="text"
              id="neighbourName"
              name="neighbourName"
              value={patientData.profile.neighbourName}
              onChange={(e) => handleChange(e, "profile")}
            />
          </div>
          <div className="AddPatient-field">
            <label htmlFor="neighbourPhone">NeighbourPhone:</label>
            <input
              type="text"
              id="neighbourPhone"
              name="neighbourPhone"
              value={patientData.profile.neighbourPhone}
              onChange={(e) => handleChange(e, "profile")}
            />
          </div>
          <div className="AddPatient-field">
            <label htmlFor="neighbourName">NeighbourName:</label>
            <input
              type="text"
              id="neighbourName"
              name="neighbourName"
              value={patientData.profile.neighbourName}
              onChange={(e) => handleChange(e, "profile")}
            />
          </div>
          <div className="AddPatient-field">
            <label htmlFor="communityVolunteer">CommunityVolunteer:</label>
            <input
              type="text"
              id="communityVolunteer"
              name="communityVolunteer"
              value={patientData.profile.communityVolunteer}
              onChange={(e) => handleChange(e, "profile")}
            />
          </div>
          <div className="AddPatient-field">
            <label htmlFor="communityVolunteerPhone">CommunityVolunteerPhone:</label>
            <input
              type="text"
              id="communityVolunteerPhone"
              name="communityVolunteerPhone"
              value={patientData.profile.communityVolunteerPhone}
              onChange={(e) => handleChange(e, "profile")}
            />
          </div>
          <div className="AddPatient-field">
            <label htmlFor="wardMember">WardMember:</label>
            <input
              type="text"
              id="wardMember"
              name="wardMember"
              value={patientData.profile.wardMember}
              onChange={(e) => handleChange(e, "profile")}
            />
          </div>
          <div className="AddPatient-field">
            <label htmlFor="wardMemberPhone">WardMemberPhone:</label>
            <input
              type="text"
              id="wardMemberPhone"
              name="wardMemberPhone"
              value={patientData.profile.wardMemberPhone}
              onChange={(e) => handleChange(e, "profile")}
            />
          </div>
          <div className="AddPatient-field">
            <label htmlFor="ashaWorker">AshaWorker:</label>
            <input
              type="text"
              id="ashaWorker"
              name="ashaWorker"
              value={patientData.profile.ashaWorker}
              onChange={(e) => handleChange(e, "profile")}
            />
          </div>
          <div className="AddPatient-field">
  <label htmlFor="medicalHistory">Medical History:</label>
  <textarea
    id="medicalHistory"
    name="medicalHistory"
    value={patientData.profile.medicalHistory}
    onChange={(e) => handleChange(e, "profile")}
    rows={5} // You can adjust the number of rows as needed
    style={{ resize: "vertical" }} // Allows vertical resizing
  />
</div>
          <div className="AddPatient-field">
            <label htmlFor="currentDifficulties">CurrentDifficulties:</label>
            <input
              type="text"
              id="currentDifficulties"
              name="currentDifficulties"
              value={patientData.profile.currentDifficulties}
              onChange={(e) => handleChange(e, "profile")}
            />
          </div>
          <div className="AddPatient-field">
            <label htmlFor="mainDiagnosis">MainDiagnosis:</label>
            <input
              type="text"
              id="mainDiagnosis"
              name="mainDiagnosis"
              value={patientData.profile.mainDiagnosis}
              onChange={(e) => handleChange(e, "profile")}
            />
          </div>
          <div className="AddPatient-field">
  <label htmlFor="additionalInfo">Additional Notes For Nurse:</label>
  <textarea
    id="additionalInfo"
    name="additionalInfo"
    value={patientData.profile.additionalInfo}
    onChange={(e) => handleChange(e, "profile")}
    rows={4} // Adjust the number of rows as needed
    style={{ resize: "vertical" }} // Allows vertical resizing
  />
</div>
          
<h4 className="AddPatient-sectionTitle">Doctor Section:</h4>
<div className="AddPatient-field">
  <label htmlFor="advice">Advice:</label>
  <textarea
    id="advice"
    name="advice"
    value={patientData.profile.advice}
    onChange={(e) => handleChange(e, "profile")}
    rows={4} // Adjust the number of rows as needed
    style={{ resize: "vertical", height: "80px" }} // Allows vertical resizing
  />
</div>
<div className="AddPatient-field">
  <label htmlFor="examinations">Examinations:</label>
  <textarea
    id="examinations"
    name="examinations"
    value={patientData.profile.examinations}
    onChange={(e) => handleChange(e, "profile")}
    rows={4} // Adjust the number of rows as needed
    style={{ resize: "vertical", height: "80px" }} // Allows vertical resizing
  />
</div>
<div className="AddPatient-field">
  <label htmlFor="note">Note For Doctors:</label>
  <textarea
    id="note"
    name="note"
    value={patientData.profile.note}
    onChange={(e) => handleChange(e, "profile")}
    rows={4} // Adjust the number of rows as needed
    style={{ resize: "vertical", height: "80px" }} // Allows vertical resizing
  />
</div>
        </div>

        {/* Section 4: Family Details */}
        <h4 className="AddPatient-sectionTitle">Section 4: Family Details</h4>
        {familyDetails.map((family, index) => (
          <div key={index} className="AddPatient-familyDetails">
            <h5>Family Member {index + 1}</h5>
            <div className="AddPatient-row">
              <div className="AddPatient-field">
                <label htmlFor={`name-${index}`}>Name:</label>
                <input
                  type="text"
                  id={`name-${index}`}
                  name="name"
                  value={family.name}
                  onChange={(e) => handleFamilyDetailsChange(index, e)}
                />
              </div>
              <div className="AddPatient-field">
                <label htmlFor={`relation-${index}`}>Relation:</label>
                <input
                  type="text"
                  id={`relation-${index}`}
                  name="relation"
                  value={family.relation}
                  onChange={(e) => handleFamilyDetailsChange(index, e)}
                />
              </div>
              <div className="AddPatient-field">
                <label htmlFor={`age-${index}`}>Age:</label>
                <input
                  type="text"
                  id={`age-${index}`}
                  name="age"
                  value={family.age}
                  onChange={(e) => handleFamilyDetailsChange(index, e)}
                />
              </div>
              <div className="AddPatient-field">
                <label htmlFor={`age-${index}`}>Education:</label>
                <input
                  type="text"
                  id={`education-${index}`}
                  name="education"
                  value={family.education}
                  onChange={(e) => handleFamilyDetailsChange(index, e)}
                />
              </div>
              <div className="AddPatient-field">
                <label htmlFor={`age-${index}`}>Income:</label>
                <input
                  type="text"
                  id={`income-${index}`}
                  name="income"
                  value={family.income}
                  onChange={(e) => handleFamilyDetailsChange(index, e)}
                />
              </div>
              <div className="AddPatient-field">
                <label htmlFor={`age-${index}`}>Marriage Status:</label>
                <input
                  type="text"
                  id={`marriageStatus-${index}`}
                  name="marriageStatus"
                  value={family.marriageStatus}
                  onChange={(e) => handleFamilyDetailsChange(index, e)}
                />
              </div>
              <div className="AddPatient-field">
                <label htmlFor={`age-${index}`}>Remark:</label>
                <input
                  type="text"
                  id={`remark-${index}`}
                  name="remark"
                  value={family.remark}
                  onChange={(e) => handleFamilyDetailsChange(index, e)}
                />
              </div>
              {/* Add more fields as needed */}
            </div>
          </div>
        ))}
        <button type="button" className="AddPatient-addFamilyButton" onClick={addFamilyMember}>
          + Family Member
        </button>
        {/* Submit Button */}
        <button type="submit" className="AddPatient-submitButton">
          Update Patient
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default UpdatePatient;