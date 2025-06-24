import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../Firebase/config";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./VHCAdd.css";

const VHC = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [patientData, setPatientData] = useState(null);
  const [formData, setFormData] = useState({
    team1: "",
    team2: "",
    team3: "",
    team4: "",
    otherTeamMembers: "",
    date: "",
    diseaseInformation: "",
    patientCondition: "",
    financialSituation: {
      business: false,
      governmentJob: false,
      privateJob: false,
      otherIncomes: false,
      koolie: false,
      familyLiability: false,
      farmer: false,
    },
    welfareSchemes: {
      rationCardNumber: "",
      rationCardType: "",
      financialStatus: "",
      government: {
        pension: false,
        insurance: false,
        others: false,
      },
      nonGovernment: {
        palliativeCare: false,
        wardLocal: false,
        localSelf: false,
      },
      otherAgencies: {
        mosque: false,
        temples: false,
        organizations: false,
        zakath: false,
        helpCommittee: false,
        others: false,
      },
    },
    welfareBenefits: [],
    physicalCondition: {
      inBed: false,
      sittingUpWithHelp: false,
      seatedInChair: false,
      walkingIndependently: false,
      leavingHouse: false,
      eatingIndependently: false,
      registeredForDrugDevice: false,
    },
    homeCareConditions: {
      houseAndServants: false,
      noHouseNoServants: false,
      servantsNotInterested: false,
      houseNoServants: false,
      noHouseWithServants: false,
      wellTakenCare: false,
      notEnoughCare: false,
      takingCare: false,
      occasionallyTakingCare: false,
      servantsPowerless: false,
      lackOfExperience: false,
      noOneToTakeCare: false,
      caregiverAlsoSick: false,
    },
    mentalDifficulties: "",
    learnedFromFamily: "",
    volunteerSuggestions: "",
    careSummary: {
      homeCare: "",
      activityItems: "",
      remarks: "",
    },
    volunteerName: "",
    volunteerPhone: "",
    visitDate: "",
    visitTime: "",
    formType: "VHC",
    submittedAt: "",
    volunteerPlan: {
      daycare: false,
      employment: false,
      employmentTraining: false,
      occupation: "",
      food: false,
      clothing: false,
      infrastructure: false,
      educationExpenses: false,
      nextVisitPlan: "",
      psychosocialSupport: false,
      psychosocialSupportDetails: "",
      gvhcRequired: false,
    },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const q = query(collection(db, "Patients"), where("patientId", "==", patientId));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const data = querySnapshot.docs[0].data();
          setPatientData(data);
        } else {
          console.error("No patient document found with patientId:", patientId);
        }
      } catch (error) {
        console.error("Error fetching patient data:", error);
      }
    };

    fetchPatientData();
  }, [patientId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      const keys = name.split(".");
      if (keys.length === 1) {
        setFormData((prevData) => ({
          ...prevData,
          [name]: checked,
        }));
      } else if (keys.length === 2) {
        setFormData((prevData) => ({
          ...prevData,
          [keys[0]]: {
            ...prevData[keys[0]],
            [keys[1]]: checked,
          },
        }));
      } else if (keys.length === 3) {
        setFormData((prevData) => ({
          ...prevData,
          [keys[0]]: {
            ...prevData[keys[0]],
            [keys[1]]: {
              ...prevData[keys[0]][keys[1]],
              [keys[2]]: checked,
            },
          },
        }));
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleAddWelfareBenefit = () => {
    setFormData((prevData) => ({
      ...prevData,
      welfareBenefits: [
        ...prevData.welfareBenefits,
        { fullName: "", phoneNo: "", relation: "", waysToHelp: "" },
      ],
    }));
  };

  const handleWelfareBenefitChange = (index, field, value) => {
    const updatedBenefits = [...formData.welfareBenefits];
    updatedBenefits[index][field] = value;
    setFormData((prevData) => ({
      ...prevData,
      welfareBenefits: updatedBenefits,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const currentDate = new Date();
      const timestamp = currentDate.toISOString();

      const reportData = {
        ...formData,
        ...patientData,
        patientId,
        submittedAt: timestamp,
      };

      await addDoc(collection(db, "Reports"), reportData);

      toast.success("Report submitted successfully!");
      setTimeout(() => {
        navigate(-1);
      }, 2000); // Navigate back after 2 seconds
    } catch (error) {
      console.error("Error adding document: ", error);
      toast.error("Error submitting the report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="VHCAdd-container">
      <button className="VHCAdd-back-btn" onClick={() => navigate(-1)}>
        &larr; Back
      </button>

      <h2>VHC Details for Patient ID: {patientId}</h2>
      {patientData ? (
        <>
          <h3>Patient Information</h3>
          <p><strong>Name:</strong> {patientData.name}</p>
          <p><strong>Address:</strong> {patientData.address}</p>
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

      <form onSubmit={handleSubmit} className="VHCAdd-form">
        <h3>Section 1: Team Details</h3>
        <label>
          Team 1:
          <input type="text" name="team1" value={formData.team1} onChange={handleChange} />
        </label>
        <label>
          Team 2:
          <input type="text" name="team2" value={formData.team2} onChange={handleChange} />
        </label>
        <label>
          Team 3:
          <input type="text" name="team3" value={formData.team3} onChange={handleChange} />
        </label>
        <label>
          Team 4:
          <input type="text" name="team4" value={formData.team4} onChange={handleChange} />
        </label>
        <label>
          Other Team Members:
          <input type="text" name="otherTeamMembers" value={formData.otherTeamMembers} onChange={handleChange} />
        </label>

        <h3>Section 2: Date</h3>
        <label>
          Date:
          <input type="date" name="date" value={formData.date} onChange={handleChange} />
        </label>

        <h3>Section 3: Disease Information</h3>
        <label>
          Disease Information Given to the Patient/Relative Volunteer:
          <textarea name="diseaseInformation" value={formData.diseaseInformation} onChange={handleChange}></textarea>
        </label>

        <h3>Section 4: Patient Condition</h3>
        <label>
          The Current Condition of the Patient and Family:
          <textarea name="patientCondition" value={formData.patientCondition} onChange={handleChange}></textarea>
        </label>

        <h3>Section 5: Financial Situation</h3>
        {Object.keys(formData.financialSituation).map((field) => (
          <label key={field}>
            <input
              type="checkbox"
              name={`financialSituation.${field}`}
              checked={formData.financialSituation[field]}
              onChange={handleChange}
            />
            {field.charAt(0).toUpperCase() + field.slice(1)}
          </label>
        ))}

        <h3>Section 6: Welfare Schemes</h3>
        <label>
          Ration Card Number:
          <input type="text" name="welfareSchemes.rationCardNumber" value={formData.welfareSchemes.rationCardNumber} onChange={handleChange} />
        </label>
        <label>
          Ration Card Type:
          <select name="welfareSchemes.rationCardType" value={formData.welfareSchemes.rationCardType} onChange={handleChange}>
            <option value="apl">APL</option>
            <option value="bpl">BPL</option>
          </select>
        </label>
        <label>
          Financial Status:
          <select name="welfareSchemes.financialStatus" value={formData.welfareSchemes.financialStatus} onChange={handleChange}>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </label>

        <h4>Government</h4>
        {Object.keys(formData.welfareSchemes.government).map((field) => (
          <label key={field}>
            <input
              type="checkbox"
              name={`welfareSchemes.government.${field}`}
              checked={formData.welfareSchemes.government[field]}
              onChange={handleChange}
            />
            {field.charAt(0).toUpperCase() + field.slice(1)}
          </label>
        ))}

        <h4>Non-Government</h4>
        {Object.keys(formData.welfareSchemes.nonGovernment).map((field) => (
          <label key={field}>
            <input
              type="checkbox"
              name={`welfareSchemes.nonGovernment.${field}`}
              checked={formData.welfareSchemes.nonGovernment[field]}
              onChange={handleChange}
            />
            {field.charAt(0).toUpperCase() + field.slice(1)}
          </label>
        ))}

        <h4>Other Agencies</h4>
        {Object.keys(formData.welfareSchemes.otherAgencies).map((field) => (
          <label key={field}>
            <input
              type="checkbox"
              name={`welfareSchemes.otherAgencies.${field}`}
              checked={formData.welfareSchemes.otherAgencies[field]}
              onChange={handleChange}
            />
            {field.charAt(0).toUpperCase() + field.slice(1)}
          </label>
        ))}

        <h3>Section 7: Welfare Benefits</h3>
        {formData.welfareBenefits.map((benefit, index) => (
          <div key={index}>
            <label>
              Full Name:
              <input
                type="text"
                value={benefit.fullName}
                onChange={(e) => handleWelfareBenefitChange(index, "fullName", e.target.value)}
              />
            </label>
            <label>
              Phone No:
              <input
                type="text"
                value={benefit.phoneNo}
                onChange={(e) => handleWelfareBenefitChange(index, "phoneNo", e.target.value)}
              />
            </label>
            <label>
              Relation to Patient:
              <input
                type="text"
                value={benefit.relation}
                onChange={(e) => handleWelfareBenefitChange(index, "relation", e.target.value)}
              />
            </label>
            <label>
              Ways Does Help:
              <input
                type="text"
                value={benefit.waysToHelp}
                onChange={(e) => handleWelfareBenefitChange(index, "waysToHelp", e.target.value)}
              />
            </label>
          </div>
        ))}
        <button type="button" onClick={handleAddWelfareBenefit}>
          Add Another Welfare Benefit
        </button>

        <h3>Section 8: Physical Condition of Patient</h3>
        {Object.keys(formData.physicalCondition).map((field) => (
          <label key={field}>
            <input
              type="checkbox"
              name={`physicalCondition.${field}`}
              checked={formData.physicalCondition[field]}
              onChange={handleChange}
            />
            {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, " $1")}
          </label>
        ))}

        <h3>Section 9: Home and Home Care Conditions</h3>
        {Object.keys(formData.homeCareConditions).map((field) => (
          <label key={field}>
            <input
              type="checkbox"
              name={`homeCareConditions.${field}`}
              checked={formData.homeCareConditions[field]}
              onChange={handleChange}
            />
            {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, " $1")}
          </label>
        ))}
         <h3>Section 15: Volunteer Plan After VHC</h3>
        <label>
          Day Care:
          <input
            type="checkbox"
            name="volunteerPlan.daycare"
            checked={formData.volunteerPlan.daycare}
            onChange={handleChange}
          />
        </label>
        <label>
          Employment:
          <input
            type="checkbox"
            name="volunteerPlan.employment"
            checked={formData.volunteerPlan.employment}
            onChange={handleChange}
          />
        </label>
        <label>
          Employment Training:
          <input
            type="checkbox"
            name="volunteerPlan.employmentTraining"
            checked={formData.volunteerPlan.employmentTraining}
            onChange={handleChange}
          />
        </label>
        <label>
          If so, what occupation?
          <input
            type="text"
            name="volunteerPlan.occupation"
            value={formData.volunteerPlan.occupation}
            onChange={handleChange}
          />
        </label>
        <label>
          Food:
          <input
            type="checkbox"
            name="volunteerPlan.food"
            checked={formData.volunteerPlan.food}
            onChange={handleChange}
          />
        </label>
        <label>
          Clothing:
          <input
            type="checkbox"
            name="volunteerPlan.clothing"
            checked={formData.volunteerPlan.clothing}
            onChange={handleChange}
          />
        </label>
        <label>
          Infrastructure:
          <input
            type="checkbox"
            name="volunteerPlan.infrastructure"
            checked={formData.volunteerPlan.infrastructure}
            onChange={handleChange}
          />
        </label>
        <label>
          Education Expenses:
          <input
            type="checkbox"
            name="volunteerPlan.educationExpenses"
            checked={formData.volunteerPlan.educationExpenses}
            onChange={handleChange}
          />
        </label>
        <label>
          Plan your next visit:
          <input
            type="text"
            name="volunteerPlan.nextVisitPlan"
            value={formData.volunteerPlan.nextVisitPlan}
            onChange={handleChange}
          />
        </label>
        <label>
          Other members of the family need psychosocial support:
          <input
            type="checkbox"
            name="volunteerPlan.psychosocialSupport"
            checked={formData.volunteerPlan.psychosocialSupport}
            onChange={handleChange}
          />
        </label>
        <label>
          If so, who?
          <input
            type="text"
            name="volunteerPlan.psychosocialSupportDetails"
            value={formData.volunteerPlan.psychosocialSupportDetails}
            onChange={handleChange}
          />
        </label>
        <label>
          Is GVHC required:
          <input
            type="checkbox"
            name="volunteerPlan.gvhcRequired"
            checked={formData.volunteerPlan.gvhcRequired}
            onChange={handleChange}
          />
        </label>
        <h3>Section 10: Mental Difficulties/Needs</h3>
        <label>
          If the patient or family shared with you their mental difficulties/needs/social spiritual emotional problems:
          <textarea name="mentalDifficulties" value={formData.mentalDifficulties} onChange={handleChange}></textarea>
        </label>

        <h3>Section 11: Learned from Family</h3>
        <label>
          What was learned from listening to the patient's caregivers/family members (children, nieces, nephews, siblings, other family members):
          <textarea name="learnedFromFamily" value={formData.learnedFromFamily} onChange={handleChange}></textarea>
        </label>

        <h3>Section 12: Volunteer Suggestions</h3>
        <label>
          Suggestions for Volunteer:
          <textarea name="volunteerSuggestions" value={formData.volunteerSuggestions} onChange={handleChange}></textarea>
        </label>

        <h3>Section 13: Care Summary</h3>
        <label>
          Home Care:
          <input type="text" name="careSummary.homeCare" value={formData.careSummary.homeCare} onChange={handleChange} />
        </label>
        <label>
          Activity/Items:
          <input type="text" name="careSummary.activityItems" value={formData.careSummary.activityItems} onChange={handleChange} />
        </label>
        <label>
          Remarks:
          <input type="text" name="careSummary.remarks" value={formData.careSummary.remarks} onChange={handleChange} />
        </label>

        <h3>Section 14: Volunteer Details</h3>
        <label>
          Name of Volunteer:
          <input type="text" name="volunteerName" value={formData.volunteerName} onChange={handleChange} />
        </label>
        <label>
          Phone No:
          <input type="text" name="volunteerPhone" value={formData.volunteerPhone} onChange={handleChange} />
        </label>
        <label>
          Visit Date:
          <input type="date" name="visitDate" value={formData.visitDate} onChange={handleChange} />
        </label>
        <label>
          Visit Time:
          <input type="time" name="visitTime" value={formData.visitTime} onChange={handleChange} />
        </label>

        <button type="submit" className="VHCAdd-submit-btn" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>

      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
};

export default VHC;