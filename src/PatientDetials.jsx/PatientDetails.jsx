import React, { useState, useEffect } from "react";
import { db } from "../Firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { useParams, Link, useNavigate } from "react-router-dom";
import "./PatientDetails.css";
import { collection, query, where, getDocs, deleteDoc } from "firebase/firestore";

const PatientDetails = () => {
  const { patientId } = useParams(); // Getting patientId from the URL
  const [patient, setPatient] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const [conditions, setConditions] = useState([]);
  const [familyDetails, setFamilyDetails] = useState([]); // State for family details
  const navigate = useNavigate();

  // Fetching patient details
  const fetchPatient = async () => {
    try {
      const docRef = doc(db, "Patients", patientId); // Fetch patient document based on patientId from URL
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const patientData = docSnap.data();
        setPatient(patientData);
        if (patientData.familyDetails) {
          setFamilyDetails(patientData.familyDetails); // Set family details if available
        }
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching patient details: ", error);
    }
  };

  // Fetching medicines related to this patient
  const fetchMedicines = async () => {
    try {
      if (patient) {
        const medicinesRef = collection(db, "Medicines");
        const q = query(medicinesRef, where("patientId", "==", patient.patientId));
        const querySnapshot = await getDocs(q);
        const medicinesData = querySnapshot.docs.map((doc) => doc.data());
        const allMedicines = medicinesData.flatMap((data) => data.medicines || []);
        setMedicines(allMedicines);
      }
    } catch (error) {
      console.error("Error fetching medicines: ", error);
    }
  };

  // Fetching equipments related to this patient
  const fetchEquipments = async () => {
    try {
      if (patient) {
        const equipmentsRef = collection(db, "Equipments");
        const q = query(equipmentsRef, where("patientId", "==", patient.patientId));
        const querySnapshot = await getDocs(q);
        const equipmentsData = querySnapshot.docs.map((doc) => doc.data());
        setEquipments(equipmentsData);
      }
    } catch (error) {
      console.error("Error fetching equipments: ", error);
    }
  };

  // Fetching conditions related to this patient
  const fetchConditions = async () => {
    try {
      if (patient) {
        const conditionsRef = collection(db, "Conditions");
        const q = query(conditionsRef, where("patientId", "==", patient.patientId));
        const querySnapshot = await getDocs(q);
        const conditionsData = querySnapshot.docs.map((doc) => doc.data());
        setConditions(conditionsData);
      }
    } catch (error) {
      console.error("Error fetching conditions: ", error);
    }
  };

  useEffect(() => {
    fetchPatient(); // Fetch patient details
  }, [patientId]); // Re-run when patientId changes

  useEffect(() => {
    if (patient) {
      fetchMedicines();
      fetchEquipments();
      fetchConditions();

    }
  }, [patient]); // Re-run when patient data is set

  if (!patient) {
    return <div className="loading-container">
      <img
        src="https://media.giphy.com/media/YMM6g7x45coCKdrDoj/giphy.gif"
        alt="Loading..."
        className="loading-image"
      />
    </div>;
  }
  const deletePatient = async () => {
    const confirmationCode = prompt("Please enter the confirmation code to delete this patient:");
    if (confirmationCode === "2012") {
      try {
        await deleteDoc(doc(db, "Patients", patientId));
        alert("Patient deleted successfully!");
        navigate("/main"); // Redirect to the main page after deletion
      } catch (error) {
        console.error("Error deleting patient: ", error);
        alert("Failed to delete patient.");
      }
    } else {
      alert("Incorrect confirmation code. Deletion canceled.");
    }
  };

  const exportToPrint = (patient) => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Patient Report - ${patient.name}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 10px;
              font-size: 12px;
            }
            h1 {
              font-size: 18px;
              color: #283593;
              margin-bottom: 15px;
            }
            .section-header {
              font-size: 14px;
              background-color: #d3d3d3;
              padding: 5px;
              margin-top: 10px;
              margin-bottom: 5px;
              page-break-after: avoid;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 10px;
            }
            table, th, td {
              border: 1px solid #ddd;
            }
            th, td {
              padding: 6px;
              text-align: left;
              font-size: 12px;
            }
            th {
              background-color: #f5f5f5;
            }
            tr:nth-child(even) {
              background-color: #f9f9f9;
            }
            .section {
              page-break-before: auto;
              page-break-inside: auto;
            }
            @media print {
              body {
                margin: 0;
                padding: 0;
              }
              .section {
                page-break-inside: avoid;
                page-break-after: auto;
              }
              table {
                page-break-before: auto;
              }
              thead {
                display: table-header-group;
              }
              tfoot {
                display: table-footer-group;
              }
            }
          </style>
        </head>
        <body>
          
    `);

    const addSectionHeader = (text) => {
      printWindow.document.write(`
        <div class="section-header">${text}</div>
      `);
    };

    const addTable = (data, headers) => {
      printWindow.document.write(`
        <table>
          <thead>
            <tr>
              ${headers.map((header) => `<th>${header}</th>`).join("")}
            </tr>
          </thead>
          <tbody>
            ${data
          .map(
            (row) => `
              <tr>
                ${row
                .map(
                  (cell) => `
                  <td>${cell || "N/A"}</td>
                `
                )
                .join("")}
              </tr>
            `
          )
          .join("")}
          </tbody>
        </table>
      `);
    };

    // Personal Details Section
    printWindow.document.write('<div class="section"><h1>Patient Profile</h1>');
    addSectionHeader("Personal Details");
    addTable(
      [
        ["Reg No", patient.registernumber],
        ["Name", patient.name],
        ["Registration Date", patient.registrationDate],
        ["Address", patient.address],
        ["Location", patient.location],
        ["Ward", patient.ward],
        ["Age", patient.age],
        ["Gender", patient.gender],
        ["Category", patient.category],
        ["Medical History", patient.medicalHistory],
        ["Main Diagnosis", patient.mainDiagnosis],
        ["Date of Birth", patient.dob],
        ["Current Difficulties", patient.currentDifficulties],
        ["Email", patient.email],
        ["Main Caretaker", patient.mainCaretaker],
        ["Main Caretaker Phone", patient.mainCaretakerPhone],
        ["Neighbour Name", patient.neighbourName],
        ["Neighbour Phone", patient.neighbourPhone],
        ["Panchayat", patient.panchayat],
        ["Patient ID", patient.patientId],
        ["Relative Phone", patient.relativePhone],
        ["Referral Person", patient.referralPerson],
        ["Referral Phone", patient.referralPhone],
        ["Community Volunteer", patient.communityVolunteer],
        ["Community Volunteer Phone", patient.communityVolunteerPhone],
        ["Ward Member", patient.wardMember],
        ["Ward Member Phone", patient.wardMemberPhone],
        ["Asha Worker", patient.ashaWorker],
        ["Status", patient.deactivated ? "INACTIVE" : "ACTIVE"],
      ],
      ["Field", "Value"]
    );
    printWindow.document.write('</div>');

    // Family Details Section
    if (patient.familyDetails && patient.familyDetails.length > 0) {
      printWindow.document.write('<div class="section">');
      addSectionHeader("Family Details");
      addTable(
        patient.familyDetails.map((family) => [
          family.name,
          family.relation,
          family.age,
          family.education,
          family.income,
          family.marriageStatus,
          family.remark,
        ]),
        ["Name", "Relation", "Age", "Education", "Income", "Marriage Status", "Remark"]
      );
      printWindow.document.write('</div>');
    }

    // Medicines Section
    if (patient.medicines && patient.medicines.length > 0) {
      printWindow.document.write('<div class="section">');
      addSectionHeader("Medicines");
      addTable(
        patient.medicines.map((medicine) => [
          medicine.medicineName,
          medicine.quantity,
          medicine.time,
          medicine.patientsNow ? "Show" : "Hide",
        ]),
        ["Medicine Name", "Quantity", "Time", "Show"]
      );
      printWindow.document.write('</div>');
    }

    // Equipments Section
    if (patient.equipments && patient.equipments.length > 0) {
      printWindow.document.write('<div class="section">');
      addSectionHeader("Equipments");
      addTable(
        patient.equipments.map((equipment) => [
          equipment.equipmentName,
          equipment.providedDate,
          equipment.returnDate,
          equipment.damage ? "Yes" : "No",
        ]),
        ["Equipment Name", "Provided Date", "Return Date", "Damage"]
      );
      printWindow.document.write('</div>');
    }

    // Conditions Section
    if (patient.conditions && patient.conditions.length > 0) {
      printWindow.document.write('<div class="section">');
      addSectionHeader("Conditions");
      addTable(
        patient.conditions.map((condition) => [condition.conditionName]),
        ["Condition Name"]
      );
      printWindow.document.write('</div>');
    }

    printWindow.document.write(`
        </body>
      </html>
    `);
    printWindow.document.close();

    setTimeout(() => {
      printWindow.print();
    }, 500); // Ensures the content is fully loaded before printing
  };


  return (
    <div className="PTDetail-container">
      <button className="PTDetail-backButton" onClick={() => navigate(-1)}>
        &#8592; Back
      </button>
      <h2>Patient Details</h2>
      <div className="PTDetail-card">
        <div className="PTDetail-profileHeader">
          <img
            src={patient.profilePic || "https://cliply.co/wp-content/uploads/2020/10/442010811_HEADPHONES_AVATAR_3D_400px.gif"}
            alt="Profile"
            className="PTDetail-profileImg"
          />
          <h3>{patient.name || "N/A"}</h3>
        </div>

        {/* Patient Information Table */}
        <div className="PTDetail-infoTable">
          <table>
            <tbody>
              <tr>
                <td><strong>Reg No:</strong></td>
                <td>{patient.registernumber || "N/A"}</td>
              </tr>
              <tr>
                <td><strong>Registration Date:</strong></td>
                <td>{patient.registrationDate || "N/A"}</td>
              </tr>
              <tr>
                <td><strong>Address:</strong></td>
                <td>{patient.address || "N/A"}</td>
              </tr>
              <tr>
                <td><strong>Location:</strong></td>
                <td>{patient.location || "N/A"}</td>
              </tr>

              <tr>
                <td><strong>Ward:</strong></td>
                <td>{patient.ward || "N/A"}</td>
              </tr>
              <tr>
                <td><strong>Age:</strong></td>
                <td>{patient.age || "N/A"}</td>
              </tr>
              <tr>
                <td><strong>Gender:</strong></td>
                <td>{patient.gender || "N/A"}</td>
              </tr>
              <tr>
                <td><strong>Category:</strong></td>
                <td>{patient.category || "N/A"}</td>
              </tr>

              <tr>
                <td><strong>Date of Birth:</strong></td>
                <td>{patient.dob || "N/A"}</td>
              </tr>

              <tr>
                <td><strong>Current Difficulties:</strong></td>
                <td>{patient.currentDifficulties || "N/A"}</td>
              </tr>
              <tr>
                <td><strong>Email:</strong></td>
                <td>{patient.email || "N/A"}</td>
              </tr>
              <tr>
                <td><strong>Main Caretaker:</strong></td>
                <td>{patient.mainCaretaker || "N/A"}</td>
              </tr>
              <tr>
                <td><strong>Main Caretaker Phone:</strong></td>
                <td>{patient.mainCaretakerPhone || "N/A"}</td>
              </tr>
              <tr>
                <td><strong>Main Diagnosis:</strong></td>
                <td>{patient.mainDiagnosis || "N/A"}</td>
              </tr>
              <tr>
                <td><strong>Medical History:</strong></td>
                <td>{patient.medicalHistory || "N/A"}</td>
              </tr>
              <tr>
                <td><strong>Neighbour Name:</strong></td>
                <td>{patient.neighbourName || "N/A"}</td>
              </tr>
              <tr>
                <td><strong>Neighbour Phone:</strong></td>
                <td>{patient.neighbourPhone || "N/A"}</td>
              </tr>
              <tr>
                <td><strong>Panchayat:</strong></td>
                <td>{patient.panchayat || "N/A"}</td>
              </tr>
              <tr>
                <td><strong>Patient ID:</strong></td>
                <td>{patient.patientId || "N/A"}</td>
              </tr>
              <tr>
                <td><strong>Relative Phone:</strong></td>
                <td>{patient.relativePhone || "N/A"}</td>
              </tr>

              <tr>
                <td><strong>Nurse Note:</strong></td>
                <td>{patient.additionalInfo || "N/A"}</td>
              </tr>
              <tr>
                <td><strong>Docter Advice:</strong></td>
                <td>{patient.advice || "N/A"}</td>
              </tr>
              <tr>
                <td><strong>Docter Examinations:</strong></td>
                <td>{patient.examinations || "N/A"}</td>
              </tr>
              <tr>
                <td><strong>Docter Note:</strong></td>
                <td>{patient.note || "N/A"}</td>
              </tr>
              <tr>
                <td><strong>Submited Date & Time:</strong></td>
                <td>{patient.registerTime ? new Date(patient.registerTime).toLocaleString() : "N/A"}</td>
              </tr>
              <tr>
                <td><strong>Referral Person:</strong></td>
                <td>{patient.referralPerson || "N/A"}</td>
              </tr>
              <tr>
                <td><strong>Referral Phone:</strong></td>
                <td>{patient.referralPhone || "N/A"}</td>
              </tr>
              <tr>
                <td><strong>Community Volunteer:</strong></td>
                <td>{patient.communityVolunteer || "N/A"}</td>
              </tr>
              <tr>
                <td><strong>Community Volunteer Phone:</strong></td>
                <td>{patient.communityVolunteerPhone || "N/A"}</td>
              </tr>
              <tr>
                <td><strong>Ward Member:</strong></td>
                <td>{patient.wardMember || "N/A"}</td>
              </tr>
              <tr>
                <td><strong>Ward Member Phone:</strong></td>
                <td>{patient.wardMemberPhone || "N/A"}</td>
              </tr>
              <tr>
                <td><strong>Asha Worker:</strong></td>
                <td>{patient.ashaWorker || "N/A"}</td>
              </tr>
              <tr>
                <td><strong>STATUS:</strong></td>
                <td style={{ display: "flex", alignItems: "center", gap: "8px", color: patient.deactivated ? "red" : "green" }}>
                  <span
                    style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      backgroundColor: patient.deactivated ? "red" : "green",
                      display: "inline-block",
                    }}
                  ></span>
                  {patient.deactivated ? "INACTIVE" : "ACTIVE"}
                </td>
              </tr>
              {patient.deactivationReason &&
                <tr>
                  <td><strong>Deactive Reason:</strong></td>
                  <td>{patient.deactivationReason}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <div className="PTDetail-equipmentsContainer">
          <h3>Family Details</h3>
          {conditions.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th> Family Details</th>
                </tr>
              </thead>
              <tbody>
                {conditions.map((condition, index) => (
                  <tr key={index}>
                    <td>{condition.conditionName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No conditions found for this patient.</p>
          )}
        </div>

        {/* Medicines Section */}
        <div className="PTDetail-medicinesContainer">
          <h3>Medicines</h3>
          {medicines.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Medicine Name</th>
                  <th>Quantity</th>
                  <th>Time</th>
                  <th>Show</th>
                </tr>
              </thead>
              <tbody>
                {medicines.map((medicine, index) => (
                  <tr key={index}>
                    <td>{medicine.medicineName}</td>
                    <td>{medicine.quantity}</td>
                    <td>{medicine.time}</td>
                    <td>{medicine.patientsNow ? "Show" : "Hide"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No medicines found for this patient.</p>
          )}
        </div>



        {/* Family Details Section */}
        <div className="PTDetail-familyDetails">
          <h3>Family Details</h3>
          {familyDetails.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Relation</th>
                  <th>Age</th>
                  <th>Education</th>
                  <th>Income</th>
                  <th>Marriage Status</th>
                  <th>Remark</th>
                </tr>
              </thead>
              <tbody>
                {familyDetails.map((family, index) => (
                  <tr key={index}>
                    <td>{family.name || "N/A"}</td>
                    <td>{family.relation || "N/A"}</td>
                    <td>{family.age || "N/A"}</td>
                    <td>{family.education || "N/A"}</td>
                    <td>{family.income || "N/A"}</td>
                    <td>{family.marriageStatus || "N/A"}</td>
                    <td>{family.remark || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No family details found for this patient.</p>
          )}
        </div>


        {/* Equipments Section */}
        <div className="PTDetail-equipmentsContainer">
          <h3>Equipments</h3>
          {equipments.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Equipment Name</th>
                  <th>Provided Date</th>
                  <th>Return Date</th>
                  <th>Damage</th>
                </tr>
              </thead>
              <tbody>
                {equipments.map((equipment, index) => (
                  <tr key={index}>
                    <td>{equipment.equipmentName}</td>
                    <td>{equipment.providedDate}</td>
                    <td>{equipment.returnDate}</td>
                    <td>{equipment.damage ? "Yes" : "No"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No equipments found for this patient.</p>
          )}
        </div>



        {/* Reports Section */}
        <Link to={`/main/reports/${patient.patientId}`} className="PTDetail-reportsLink">
          <div className="PTDetail-reportsContainer">
            <img src="https://cdn.dribbble.com/users/1015854/screenshots/3569620/day270_doctor-and-patient_1_2.gif" alt="" />
            <h3> Reports of the Patient</h3>

          </div>
        </Link>

        {/* Action Buttons */}
        <div className="PTDetail-buttonsContainer">
          <Link to={`/main/nhc/${patient.patientId}`} className="PTDetail-actionBtn PTDetail-smallBtn">NHC</Link>
          <Link to={`/main/dhc/${patient.patientId}`} className="PTDetail-actionBtn PTDetail-smallBtn">DHC</Link>
          <Link to={`/main/nhce/${patient.patientId}`} className="PTDetail-actionBtn PTDetail-smallBtn">NHC(E)</Link>
          <Link to={`/main/prograssion/${patient.patientId}`} className="PTDetail-actionBtn PTDetail-smallBtn">Progression Report</Link>
          <Link to={`/main/death/${patient.patientId}`} className="PTDetail-actionBtn PTDetail-smallBtn">Death Report</Link>
          <Link to={`/main/vhc/${patient.patientId}`} className="PTDetail-actionBtn PTDetail-smallBtn">VHC</Link>
          <Link to={`/main/medicine/${patient.patientId}`} className="PTDetail-actionBtn PTDetail-smallBtn">Medicine</Link>
          <Link to={`/main/equpment/${patient.patientId}`} className="PTDetail-actionBtn PTDetail-smallBtn">Equipment</Link>
          {/* <Link to={`/main/fmtree/${patient.patientId}`} className="PTDetail-actionBtn PTDetail-smallBtn">FM TREE</Link> */}
          <Link to={`/main/invest/${patient.patientId}`} className="PTDetail-actionBtn PTDetail-smallBtn">Investigation</Link>
          <Link to={`/main/social/${patient.patientId}`} className="PTDetail-actionBtn PTDetail-smallBtn">Social Support</Link>
          <Link to={`/main/deactive/${patient.patientId}`} className="PTDetail-actionBtn PTDetail-smallBtn">DEACTIVE</Link>
          <Link to={`/main/conditions/${patient.patientId}`} className="PTDetail-actionBtn PTDetail-smallBtn">Family Details</Link>
        </div>
        {/* Update Button */}
        <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
          <button
            className="PTDetail-updateButton"
            style={{ flex: 6 }} // 5 parts for Update button
            onClick={() => navigate(`/main/update-patient/${patientId}`)}
          >
            Update Patient Details
          </button>
          <button
            className="PTDetail-deleteButton"
            style={{ flex: 1 }} // 1 part for Delete button
            onClick={deletePatient}
          >
            Delete
          </button>
          <button
            className="PTDetail-deleteButton2"
            style={{ flex: 1 }} // 1 part for Print button
            onClick={() => exportToPrint(patient)}
          >
            Print
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientDetails;