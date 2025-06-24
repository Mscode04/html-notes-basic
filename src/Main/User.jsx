import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import "./User.css";

function User({ isAuthenticated, isNurse }) {
  const { patientId } = useParams(); // Access patientId from the URL
  const [patientName, setPatientName] = useState(""); // Store patient's name
  const db = getFirestore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatientName = async () => {
      if (patientId) {
        const patientDoc = doc(db, "Patients", patientId); // Access the document
        try {
          const snapshot = await getDoc(patientDoc);
          if (snapshot.exists()) {
            setPatientName(snapshot.data().name); // Set the patient's name
          } else {
            setPatientName("Patient not found");
          }
        } catch (error) {
          console.error("Error fetching patient:", error);
          setPatientName("Error fetching patient data");
        }
      }
    };

    fetchPatientName();
  }, [patientId, db]);

  const handleLogout = () => {
    navigate("/logout"); // Navigate to the /logout route
  };

  return (
    <div className="user-container min-h-screen bg-blue-900 flex flex-col items-center text-white">
      {/* Top 1/3 with background image */}
      <div className="user-header w-full h-1/3 bg-cover bg-center relative">
        <div className="user-header-overlay absolute inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <h1 className="user-header-title text-4xl font-bold">
            Welcome: {patientName || "Bystander"}
          </h1>
        </div>
      </div>

      {/* Profile Card */}
      <div className="user-profile-card bg-white text-black w-11/12 max-w-lg p-6 mt-[-50px] rounded-2xl shadow-lg">
        <Link to={`/puser/${patientId}`}>
          <div className="user-profile-content flex flex-col items-center">
            <div className="user-profile-picture w-24 h-24 rounded-full bg-gray-300 overflow-hidden">
              {/* Placeholder for patient profile picture */}
              <img
                src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExaWp2bzdlbnA5anZxYWZueXA1YnVkeTN3czZuNjVmOTJ6djdrN3E0ZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ZXkraFrlIW1D25M6ZJ/giphy.gif"
                alt={patientName}
                className="user-profile-image w-full h-full object-cover"
              />
            </div>
            <h2 className="user-profile-name text-2xl font-semibold mt-4">
              {patientName || "Bystander"}
            </h2>
          </div>
        </Link>
      </div>

      {/* Contact section */}
      <div className="user-contact-section bg-white w-11/12 max-w-lg mt-4 p-4 rounded-2xl shadow-lg">
        <div className="about-palliative">
          <img
            src="https://health-app-psi.vercel.app/images/aboutus.gif"
            alt="Palliative Care"
          />
          <a href="https://neuraq.github.io/Palliative-Mkba-Web/">
            Palliative Mkakkaraparamba
          </a>
        </div>
        <h3 className="user-contact-title text-xl font-semibold text-center mb-4">
          You can contact
        </h3>
        <div className="user-contact-list space-y-2">
          {[
            { name: "Divya", phone: "8606910902", avatar: "default_avatar_url" },
            { name: "Haseena", phone: "9946204100", avatar: "default_avatar_url" },
            { name: "Shameema", phone: "9037646308", avatar: "default_avatar_url" },
            {
              name: "Office",
              phone: "8606910901",
              avatar:
                "https://media.istockphoto.com/id/1344779917/vector/medical-center-hospital-building-vector-design.jpg?s=612x612&w=0&k=20&c=_sZByueZhEZbK2WjQz1jqXy1_Rr5jYkgiVBj-2ls44s=",
            },
            {
              name: "Ambulance",
              phone: "9946205100",
              avatar:
                "https://media2.giphy.com/media/3oKIPdGRt4YcjFx8be/200w.gif?cid=6c09b9521d38njhisbausfg8aiwe0c10jhf3accp56xzvrp0&ep=v1_gifs_search&rid=200w.gif&ct=g",
            },
          ].map((contact) => (
            <div
              key={contact.name}
              className="user-contact-item flex justify-between items-center bg-blue-100 p-3 rounded-lg shadow"
            >
              <div className="user-contact-info flex items-center space-x-3">
                <div className="user-contact-avatar w-12 h-12 rounded-full bg-gray-300 overflow-hidden">
                  <img
                    src={
                      contact.avatar !== "default_avatar_url"
                        ? contact.avatar
                        : "https://cl-wpml.careerlink.vn/cam-nang-viec-lam/wp-content/uploads/2023/08/21085609/healthcare-workers-preventing-virus-quarantine-campaign-concept-cheerful-friendly-asian-female-physician-doctor-with-clipboard-during-daily-checkup-standing-white-background-1024x683.jpg"
                    }
                    alt={contact.name}
                    className="user-contact-image w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="user-contact-name text-lg font-medium">
                    {contact.name}
                  </span>
                </div>
              </div>
              <a
                href={`tel:${contact.phone}`}
                className="user-contact-button text-blue-500 hover:text-blue-700"
              >
                📞
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Chatbot Button */}
      <div className="user-chatbot-section">
  <button
    className="user-chatbot-button"
    onClick={() => navigate("/chatbot")}
  >
    <span className="chatbot-icon">💬</span>
    <span className="chatbot-text">NeuAI</span>
  </button>
</div>

      {/* Logout button */}
      <div className="user-logout-section mt-4">
        <button
          className="user-logout-button bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-11/12 max-w-lg"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      {/* Footer */}
      <footer className="footer">
        Powered by{" "}
        <a href="https://neuraq.in" target="_blank" rel="noopener noreferrer">
          neuraq.in
        </a>
      </footer>
    </div>
  );
}

export default User;