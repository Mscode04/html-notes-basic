import React from "react";
// import "./Help.css";

const Help = () => {
  const faqs = [
    {
      question: "How do I add a new patient?",
      answer: "Navigate to the Patients page and click the 'Add New Patient' button."
    },
    {
      question: "How can I schedule an appointment?",
      answer: "Go to the Appointments page and click 'Schedule New Appointment'."
    },
    {
      question: "Where can I find financial reports?",
      answer: "Financial reports are available under the Reports section."
    }
  ];

  return (
    <div className="help-page">
      <h2>Help & Support</h2>
      
      <div className="help-sections">
        <div className="contact-support">
          <h3>Contact Support</h3>
          <p>If you need immediate assistance, please contact our support team:</p>
          <ul>
            <li>Email: support@clinicpro.com</li>
            <li>Phone: (555) 123-4567</li>
            <li>Hours: Mon-Fri, 9AM-5PM EST</li>
          </ul>
        </div>

        <div className="faq-section">
          <h3>Frequently Asked Questions</h3>
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <h4>{faq.question}</h4>
                <p>{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="resources">
          <h3>Additional Resources</h3>
          <div className="resource-cards">
            <div className="resource-card">
              <h4>User Manual</h4>
              <p>Download our comprehensive user guide</p>
              <button className="btn secondary">Download PDF</button>
            </div>
            <div className="resource-card">
              <h4>Training Videos</h4>
              <p>Watch tutorial videos for common tasks</p>
              <button className="btn secondary">View Videos</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;