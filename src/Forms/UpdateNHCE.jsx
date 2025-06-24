import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../Firebase/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './UpdateNHC.css'
import CreatableSelect from "react-select/creatable";
const UpdateNHCE = () => {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [formData, setFormData] = useState({
    date: "",
    team1: "",
    team2: "",
    team3: "",
    team4: "",
    firstImpression: "",
    patientAwareness: "Yes",
    caretakerAwareness: "Yes",
    extraDetailsAwareness: "",
    badHabit: "No",
    complimentaryRx: "nill",
    food: "Good",
    breath:"Normal",
    drink: "Good",
    pee: "Good",
    pop: "Good",
    sleep: "Good",
    selfHygiene: "Good",
    basicMattersNotes: "",
    sexuality: "nill",
    exercise: "No",
    exerciseFrequency: "NOT MENTION",
    exercisenotes: "",
    entertainmentTime: "",
    houseCleanliness: "clean",
    surroundingsCleanliness: "clean",
    bedroomCleanliness: "clean",
    bedCleanliness: "clean",
    dressCleanliness: "clean",
    addmoresurroundings:"",
    generalStatus: "stable",
    patientCurrently: "sitting",
    memoryStatus: "remember",
    responseStatus: "good",
    activityScore: "1",
    addmoregeneral:"",
    scalp: "Good",
    hair: "Good",
    skin: "Good",
    nails: "Good",
    mouth: "Good",
    perineum: "Good",
    hiddenSpaces: "Good",
    pressureSpaces: "Good",
    joints: "Good",
    headToFootNotes: "",
    specialCareAreas: "",
    summaryDiscussion: "",
    medicineChanges: "",
    otherActivities: "",
    homeCarePlan: "daily_7_1",
     thirst:"",
        digestion:"",
    consultation: "",
    formType: "NHC(E)",
    submittedAt: "",
    bp: "",
    ulLl: "NOT MENTION",
    position: "NOT MENTION",
    rr: "",
    rrType: "R",
    pulse: "",
    pulseType: "NOT MENTION",
    temperature: "",
    temperatureType: "NOT MENTION",
    spo2: "",
    gcs: "",
    grbs: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const reportRef = doc(db, "Reports", reportId);
        const reportSnapshot = await getDoc(reportRef);

        if (reportSnapshot.exists()) {
          const data = reportSnapshot.data();
          setReport(data);
          setFormData(data);
        } else {
          toast.error("Report not found.");
        }
      } catch (error) {
        toast.error("Failed to load report. Please try again.");
      }
    };

    fetchReport();
  }, [reportId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const reportRef = doc(db, "Reports", reportId);
      await updateDoc(reportRef, formData);

      toast.success("Report updated successfully!");
      setTimeout(() => {
        navigate(-1); // Navigate back after success
      }, 2000);
    } catch (error) {
      toast.error("Error updating the report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!report) {
    return          <div className="loading-container">
    <img
      src="https://media.giphy.com/media/YMM6g7x45coCKdrDoj/giphy.gif"
      alt="Loading..."
      className="loading-image"
    />
  </div>;
  }
  const nurseOptions = [
    { value: "SHAMEEMA", label: "SHAMEEMA" },
    { value: "", label: "" },
    { value: "DIVYA", label: "DIVYA" },
    { value: "HASEENA", label: "HASEENA" },
  ];
  return (
    <div className="UpdateNHC-container">
      <ToastContainer position="top-center" autoClose={3000} />
      <button className="UpdateNHC-back-btn" onClick={() => navigate(-1)}>
        &larr; Back
      </button>

      <h2 className="UpdateNHC-title">Update NHC(E) </h2>
      <form onSubmit={handleSubmit} className="UpdateNHC-form">
      <h3>Section 1: General Details</h3>
        <label>
          Date:
          <input type="date" name="date" value={formData.date} onChange={handleChange} />
        </label>
        <label>
          Team Member 1:
          <CreatableSelect
            options={nurseOptions} // Predefined options
            value={formData.team1 ? { value: formData.team1, label: formData.team1 } : null}
            onChange={(selectedOption) => {
              setFormData((prevData) => ({
                ...prevData,
                team1: selectedOption ? selectedOption.value : "", // Update team1 with selected or custom value
              }));
            }}
            placeholder="Select or enter a Nurse name"
            isClearable // Allows clearing the selected value
            formatCreateLabel={(inputValue) => `Add "${inputValue}"`} // Custom label for new options
          />
        </label>
        {[2, 3, 4].map((num) => (
          <label key={num}>
            Team Member {num}:
            <input type="text" name={`team${num}`} value={formData[`team${num}`]} onChange={handleChange} />
          </label>
        ))}
       <label>
  First Impression:
  <textarea
    name="firstImpression"
    value={formData.firstImpression}
    onChange={handleChange}
    rows="4"
  />
</label>

        <label>
          Patient Awareness:
          <select name="patientAwareness" value={formData.patientAwareness} onChange={handleChange}>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </label>
        <label>
          Caretaker Awareness:
          <select name="caretakerAwareness" value={formData.caretakerAwareness} onChange={handleChange}>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </label>
        <label>
          Extra Details about Awareness:
          <textarea name="extraDetailsAwareness" value={formData.extraDetailsAwareness} onChange={handleChange}></textarea>
        </label>
        <label>
          Bad Habit:
          <select name="badHabit" value={formData.badHabit} onChange={handleChange}>
            <option value="No">No</option>
            <option value="Yes">Yes</option>
          </select>
        </label>
        {formData.badHabit === "Yes" && (
          <label>
            More About Bad Habits:
            <input type="text" name="moreAboutBadHabits" value={formData.moreAboutBadHabits} onChange={handleChange} />
          </label>
        )}
        <label>
          Complimentary Rx:
          <select name="complimentaryRx" value={formData.complimentaryRx} onChange={handleChange}>
            <option value="nill">Nill</option>
            <option value="ay">AY</option>
            <option value="h">H</option>
            <option value="u">U</option>
            <option value="sd">SD</option>
            <option value="n">N</option>
            <option value="o">O</option>
          </select>
        </label>

             <h3>Section 2: Basic Matters (പ്രാഥമിക കാര്യങ്ങൾ)</h3>
{[
  {field: "food", label: "Food (ഭക്ഷണം)", options: ["Good", "Bad", "Average", "Satisfy", "NOT CHECKED"]},
  {field: "drink", label: "Drink (പാനീയം)", options: ["Good", "Bad", "Average", "Satisfy", "NOT CHECKED"]},
  {field: "pee", label: "Urine (മൂത്രം)", options: ["Normal", "Retention", "Inconvenience urinary","Flowys Catheter","Condom Catheter", "NOT CHECKED"]},
  {field: "pop", label: "Pop (ശോധന)", options: [
    "Normal", 
    "Constipation", 
    "Diarrhea", 
    "Spurious Diarrhea", 
    "With the Help of Medicine (Daily)", 
    "With the Help of Medicine (Alternative Days)", 
    "With the Help of Medicine (Twice Weekly)",
    "NOT CHECKED"
  ]},
  {field: "sleep", label: "Sleep (ഉറക്കം)", options: [
    "Normal", 
    "Support to medicine (good)", 
    "Support to medicine (bad)",
    "NOT CHECKED"
  ]},
{
  field: "selfHygiene",
  label: "Hygiene (ശുചിത്വം)",
  options: [
    "Daily bath (എന്നും കുളിക്കുന്നു)", 
    "Alternative days (ഒരു ദിവസം കൂടുമ്പോഴാണ് കുളിക്കുന്നത്)", 
    "Once a week (ആഴ്ചയിൽ ഒരു തവണ കുളിക്കുന്നു)", 
    "Twice a week (ആഴ്ചയിൽ രണ്ട് തവണ കുളിക്കുന്നു)", 
    "Wetting and licking (നനച്ച് തുടക്കലാണ്)", 
    "Both bath and Wetting and licking (നനച്ച് തുടക്കുകയും ഇടക്ക് കുളിപ്പിക്കുകയും ചെയ്യാറുണ്ട്)", 
    "NOT ASKED (ചോദിച്ചിട്ടില്ല)"
  ]
},
  {field: "breath", label: "Breath (ശ്വസനം)", options: [
    "Normal – സാധാരണ ശ്വാസം", 
    "Low/Shallow Breathing –  താഴ്ന്ന ശ്വാസോച്ഛ്വാസം", 
    "Breathing with Support – ഓക്സിജൻ സഹായത്തോടെ ശ്വാസം ", 
    "Shortness of Breath – ശ്വാസക്കുഴപ്പ് / ശ്വാസം പിടക്കൽ", 
    "Rapid Breathing – വേഗത്തിലുള്ള ശ്വാസം", 
    "No Breathing (Apnea) – ശ്വാസം ഇല്ലായ്മ ",
    "NOT CHECKED"
  ]},
  {field: "digestion", label: "Digestion (വിശപ്പ്)", options: [
    "Normal Digestion – സാധാരണ വിശപ്പ്", 
    "Indigestion (Dyspepsia) – കുടലൊരുക്കം", 
    "Acidity", 
    "Bloating – വയർ നിറഞ്ഞു തോന്നൽ / ഗ്യാസടക്കം",
    "NOT CHECKED"
  ]},
  {field: "thirst", label: "Thirst (ദാഹം)", options: [
    "Normal Thirst – സാധാരണ ദാഹം", 
    "Excessive Thirst (Polydipsia) – അത്യധികം ദാഹം", 
    "Reduced Thirst – കുറവായ ദാഹം", 
    "No Thirst – ദാഹം ഇല്ലായ്മ",
    "NOT CHECKED"
  ]},
].map((item) => (
  <label key={item.field}>
    {item.label}:
    <select name={item.field} value={formData[item.field]} onChange={handleChange}>
      {item.options.map(option => (
        <option key={option} value={option}>{option}</option>
      ))}
    </select>
  </label>
))}



        <label>
          Additional Notes:
          <textarea name="basicMattersNotes" value={formData.basicMattersNotes} onChange={handleChange}></textarea>
        </label>
        <label>
          Sexuality:
          <select name="sexuality" value={formData.sexuality} onChange={handleChange}>
            <option value="nill">Nill</option>
            <option value="yes">Yes</option>
          </select>
        </label>

        <h3>Section 3: Exercise</h3>
        <label>
          Exercise:
          <select name="exercise" value={formData.exercise} onChange={handleChange}>
          <option value="NOT MENTION">NOT MENTION</option>
            <option value="No">No</option>
            <option value="Yes">Yes</option>
          </select>
        </label>
        <label>
          Frequency:
          <select name="exerciseFrequency" value={formData.exerciseFrequency} onChange={handleChange}>
          <option value="NOT MENTION">NOT MENTION</option>
            <option value="daily">Daily</option>
            <option value="weekly once">Weekly Once</option>
            <option value="sometimes">Sometimes</option>
          </select>
        </label>
        <label>
        Additional Notes About Exercise:
  <textarea
    name="exercisenotes"
    value={formData.exercisenotes}
    onChange={handleChange}
    rows="3"
  />
</label>

        <h3>Section 4: Habits</h3>
        <label>
  Entertainment Time Spending:
  <textarea
    name="entertainmentTime"
    value={formData.entertainmentTime}
    onChange={handleChange}
    rows="3"
  />
</label>



        <h3>Section 5: Surroundings</h3>
        {["house", "surroundings", "bedroom", "bed", "dress"].map((field) => (
          <label key={field}>
            {field.charAt(0).toUpperCase() + field.slice(1)} Cleanliness:
            <select name={`${field}Cleanliness`} value={formData[`${field}Cleanliness`]} onChange={handleChange}>
              <option value="clean">Clean</option>
              <option value="unclean">Unclean</option>
              <option value="average">Average</option>
              <option value="NOT CHECKED">NOT CHECKED</option>
            </select>
          </label>
        ))}
                <label>
                Additional Notes About Surroundings:
  <textarea
    name="addmoresurroundings"
    value={formData.addmoresurroundings}
    onChange={handleChange}
    rows="3"
  />
</label>
        <h3>Section 6: General Matters</h3>
        <label>
          General Status:
          <select name="generalStatus" value={formData.generalStatus} onChange={handleChange}>
            <option value="stable">Stable</option>
            <option value="unstable">Unstable</option>
          </select>
        </label>
        <label>
          Patient Currently:
          <select name="patientCurrently" value={formData.patientCurrently} onChange={handleChange}>
          <option value="lying">Lying</option>
<option value="standing">Standing</option>
<option value="sitting">Sitting</option>
<option value="fully_capable">Fully Capable</option>
<option value="toss_and_turns_in_bed_self">Toss and Turns in Bed (Self)</option>
<option value="toss_and_turns_with_help">Toss and Turns with Help</option>
<option value="sitting_with_help">Sitting with Help</option>
<option value="standing_with_help">Standing with Help</option>
<option value="walking_house_self">Walking (House) Self</option>
<option value="walking_house_with_help">Walking (House) with Help</option>
<option value="walking_out_with_help">Walking (Out) with Help</option>
<option value="walking_out_self">Walking (Out) Self</option>
          </select>
        </label>
        <label>
          Memory Status:
          <select name="memoryStatus" value={formData.memoryStatus} onChange={handleChange}>
          <option value="remember">Remember</option>
    <option value="not-remember">Do Not Remember</option>
    <option value="sometimes">Sometimes</option>
    <option value="something">Something</option> 
          </select>
        </label>
        <label>
          Response Status:
          <select name="responseStatus" value={formData.responseStatus} onChange={handleChange}>
                      <option value="full-respond">Full Respond</option>
    <option value="slightly-respond">Slightly Respond</option>
    <option value="not-respond">Not Respond</option>
    <option value="respond-with-talking">Respond with Talking</option>
    <option value="respond-with-hands">Respond with Hands</option>
    <option value="respond-with-fingers">Respond with Fingers</option>
    <option value="respond-with-eye">Respond with Eye</option>
    <option value="respond-with-head">Respond with Head</option>
    <option value="respond-with-sound">Respond with Sound</option>
          </select>
        </label>
        <label>
          Activity Score:
          <select name="activityScore" value={formData.activityScore} onChange={handleChange}>
          <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </label>
        <label>
          Financial situation (സാമ്പത്തിക അവസ്ഥ):
          <textarea
            name="financialsituation"
            value={formData.financialsituation}
            onChange={handleChange}
            rows="1"
          />
        </label>
        <label>
                Additional Notes About General Matters:
  <textarea
    name="addmoregeneral"
    value={formData.addmoregeneral}
    onChange={handleChange}
    rows="3"
  />
</label>
        <h3>Section 7: Head to Foot Checkup</h3>
        {["scalp", "hair", "skin", "nails", "mouth", "perineum", "hiddenSpaces", "pressureSpaces", "joints"].map((field) => (
          <label key={field}>
            {field.charAt(0).toUpperCase() + field.slice(1)}:
            <select name={field} value={formData[field]} onChange={handleChange}>
              {field === "skin" && (
                <>
                  <option value="Dry">Dry</option>
                  <option value="Oily">Oily</option>
                  <option value="Combination">Combination</option>
                  <option value="Sensitive">Sensitive</option>
                  <option value="Normal">Normal</option>
                  <option value="Wrinkled">Wrinkled</option>
                  <option value="NOT CHECKED">NOT CHECKED</option>
                </>
              )}
              {field === "hair" && (
                <>
                  <option value="Messy Hair">Messy Hair</option>
                  <option value="Well maintain">Well maintain</option>
                  <option value="Clean">Clean</option>
                  <option value="Unclean">Unclean</option>
                  <option value="Normal">Normal</option>
                  <option value="NOT CHECKED">NOT CHECKED</option>
                </>
              )}
              {field === "nails" && (
                <>
                  <option value="Clean">Clean</option>
                  <option value="Unclean">Unclean</option>
                  <option value="Well maintain">Well maintain</option>
                  <option value="Normal">Normal</option>
                  <option value="Not maintain">Not maintain</option>
                  <option value="NOT CHECKED">NOT CHECKED</option>
                </>
              )}
              {field === "mouth" && (
                <>
                  <option value="Clean">Clean</option>
                  <option value="Unclean">Unclean</option>
                  <option value="Oral candidiasis">Oral candidiasis</option>
                  <option value="Glotitis">Glotitis</option>
                  <option value="Stomatitis">Stomatitis</option>
                  <option value="NOT CHECKED">NOT CHECKED</option>
                </>
              )}
              {field === "perineum" && (
                <>
                  <option value="Clean">Clean</option>
                  <option value="Unclean">Unclean</option>
                  <option value="Normal">Normal</option>
                  <option value="NOT CHECKED">NOT CHECKED</option>
                </>
              )}
              {field === "hiddenSpaces" && (
                <>
                  <option value="Clean">Clean</option>
                  <option value="Unclean">Unclean</option>
                  <option value="Normal">Normal</option>
                  <option value="NOT CHECKED">NOT CHECKED</option>
                </>
              )}
              {field === "pressureSpaces" && (
                <>
                  <option value="Clean">Clean</option>
                  <option value="Unclean">Unclean</option>
                  <option value="Normal">Normal</option>
                  <option value="NOT CHECKED">NOT CHECKED</option>
                </>
              )}
              {field === "joints" && (
                <>
                  <option value="Movable">Movable</option>
                  <option value="Slightly movable">Slightly movable</option>
                  <option value="Fixed">Fixed</option>
                  <option value="Freely movable">Freely movable</option>
                  <option value="NOT CHECKED">NOT CHECKED</option>
                </>
              )}
              {!["skin", "hair", "nails", "mouth", "perineum", "hiddenSpaces", "pressureSpaces", "joints"].includes(field) && (
                <>
                         <option value="Clean">Clean </option>
                  <option value="Unclean">Unclean</option>
                  <option value="Average">Average</option>
                  <option value="NOT CHECKED">NOT CHECKED</option>
                </>
              )}
            </select>
          </label>
        ))}
        <label>
        Additional Notes For Head to Foot Checkup:
          <textarea name="headToFootNotes" value={formData.headToFootNotes} onChange={handleChange}></textarea>
        </label>

        <h3>Section 9: Vital Signs</h3>
        <div className="vital-signs-row">
          <label>
            BP:
            <input type="text" name="bp" value={formData.bp} onChange={handleChange} />
          </label>
          <label>
            UL/LL:
            <select name="ulLl" value={formData.ulLl} onChange={handleChange}>
            <option value="NOT MENTION">NOT MENTION</option>
              <option value="Null">Null</option>
              <option value="UL">UL</option>
              <option value="LL">LL</option>
            </select>
          </label>
          <label>
            Position:
            <select name="position" value={formData.position} onChange={handleChange}>
            <option value="NOT MENTION">NOT MENTION</option>
              <option value="Null">Null</option>
              <option value="RT Sitting">RT Sitting</option>
              <option value="RT Lying">RT Lying</option>
              <option value="LT Sitting">LT Sitting</option>
              <option value="LT Lying">LT Lying</option>
            </select>
          </label>
        </div>
        <div className="vital-signs-row">
          <label>
            RR (Mt):
            <input type="text" name="rr" value={formData.rr} onChange={handleChange} placeholder="Mt" />
          </label>
          <label>
            RR Type:
            <select name="rrType" value={formData.rrType} onChange={handleChange}>
            <option value="NOT MENTION">NOT MENTION</option>
              <option value="R">R</option>
              <option value="IR">IR</option>
            </select>
          </label>
        </div>
        <div className="vital-signs-row">
          <label>
            Pulse (Mt):
            <input type="text" name="pulse" value={formData.pulse} onChange={handleChange} placeholder="Mt" />
          </label>
          <label>
            Pulse Type:
            <select name="pulseType" value={formData.pulseType} onChange={handleChange}>
            <option value="NOT MENTION">NOT MENTION</option>
              <option value="R">R</option>
              <option value="IR">IR</option>
            </select>
          </label>
        </div>
        <div className="vital-signs-row">
          <label>
            Temperature (°F):
            <input type="text" name="temperature" value={formData.temperature} onChange={handleChange} placeholder="Fahrenheit" />
          </label>
          <label>
            Temperature Type:
            <select name="temperatureType" value={formData.temperatureType} onChange={handleChange}>
            <option value="NOT MENTION">NOT MENTION</option>
              <option value="O">O</option>
              <option value="A">A</option>
              <option value="R">R</option>
            </select>
          </label>
        </div>
        <div className="vital-signs-row">
          <label>
            SpO2 (%):
            <input type="text" name="spo2" value={formData.spo2} onChange={handleChange} placeholder="%" />
          </label>
        </div>
        <div className="vital-signs-row">
          <label>
            GCS (/15):
            <input type="text" name="gcs" value={formData.gcs} onChange={handleChange} placeholder="/15" />
          </label>
        </div>
        <div className="vital-signs-row">
          <label>
            GRBS (mg/dl):
            <input type="text" name="grbs" value={formData.grbs} onChange={handleChange} placeholder="mg/dl" />
          </label>
        </div>

        <h3>Section 10: Summary Discussion</h3>
        <label>
          Special Care Areas:
          <textarea name="specialCareAreas" value={formData.specialCareAreas} onChange={handleChange}></textarea>
        </label>
        <label>
          Summary Discussion:
          <textarea name="summaryDiscussion" value={formData.summaryDiscussion} onChange={handleChange}></textarea>
        </label>
        <label>
          Medicine Changes:
          <textarea name="medicineChanges" value={formData.medicineChanges} onChange={handleChange}></textarea>
        </label>
        <label>
          Other Activities:
          <textarea name="otherActivities" value={formData.otherActivities} onChange={handleChange}></textarea>
        </label>
        <label>
          Home Care Plan:
          <select name="homeCarePlan" value={formData.homeCarePlan} onChange={handleChange}>
          <option value="NILL">NILL</option>
            <option value="daily_7_1">Daily (7/1)</option>
            <option value="1_day_1_week_1_1">1 Day 1 Week (1/1)</option>
            <option value="2_day_1_week_2_1">2 Day 1 Week (2/1)</option>
            <option value="3_day_1_week_3_1">3 Day 1 Week (3/1)</option>
            <option value="1_day_2_week_1_2">1 Day 2 Week (1/2)</option>
            <option value="1_day_1_month_1_4">1 Day 1 Month (1/4)</option>
            <option value="1_day_1.5_month_1_6">1 Day 1.5 Month (1/6)</option>
            <option value="1_day_2_month_1_8">1 Day 2 Month (1/8)</option>
            <option value="1_day_3_month_1_12">1 Day 3 Month (1/12)</option>
            <option value="NOT MENTION">NOT MENTION</option>
            <option value="sos">SOS</option>
          </select>
        </label>
        <label>
          Home Care Type:
        </label>
        <label>
          Consultation:
          <textarea name="consultation" value={formData.consultation} onChange={handleChange}></textarea>
        </label>
        {/* <label>
            FORM TYPE:
            <input type="text" name="formType" value={formData.formType} onChange={handleChange} placeholder="mg/dl" />
          </label> */}
        <button type="submit" className="UpdateNHC-submit-btn" disabled={isSubmitting}>
          {isSubmitting ? "Updating..." : "Update Report"}
        </button>
      </form>
    </div>
  );
};

export default UpdateNHCE;