import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Chatbot.css";
import { ArrowBack } from "@mui/icons-material"; // For back button icon

function Chatbot() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();

  // Initial message from NeuAI
  useEffect(() => {
    const initialMessage = {
      text: `Hi, I am NeuAI from Neuraq Technologies, your medical assistant. I provide informational support, but always consult a doctor for medical advice.`,
      sender: "bot",
    };
    setMessages([initialMessage]);
  }, []);
  

  const handleSend = async () => {
    if (input.trim() === "") return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyDNMGZL6x1Qn_4PQ6QlK0pqhFg1wP0kdEU",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `As a medical expert, provide accurate and concise advice or explanations about medicines, diagnoses, or treatments. Organize the response in a clean, point-wise format without using symbols like *. give in short 1 pharagraph and 250 charecter  Answer the following query: ${input}`,
                  },
                ],
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      console.log("API Response:", data);

      const botMessage = {
        text: data.candidates?.[0]?.content?.parts?.[0]?.text || "No response received.",
        sender: "bot",
      };

      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error fetching response:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "Error: Unable to fetch response. Try again later.", sender: "bot" },
      ]);
    }

    setInput("");
  };

  return (
    <div className="chatbot-container">
      {/* App Bar */}
      <div className="app-bar">
        <button onClick={() => navigate(-1)} className="back-button">
          <ArrowBack />
        </button>
        <h1 className="app-title">NeuAI</h1>
      </div>

      {/* Chat Messages */}
      <div className="chatbot-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            <strong>{msg.sender === "user" ? "You: " : "NeuAI: "}</strong>
            {msg.sender === "bot" ? (
              <div className="bot-response">
                {msg.text.split("\n").map((line, i) => (
                  <p key={i} style={{color:"#e6ffd9"}}>{line}</p>
                ))}
              </div>
            ) : (
              msg.text
            )}
          </div>
        ))}
      </div>

      {/* Input Section */}
      <div className="chatbot-input">
  <input
    type="text"
    value={input}
    onChange={(e) => setInput(e.target.value)}
    placeholder="Drop your thoughts here"
    onKeyDown={(e) => e.key === "Enter" && handleSend()} // Send on Enter
  />
  <button onClick={handleSend}>
    <i className="fas fa-paper-plane"></i> {/* Send icon */}
  </button>
</div>

    </div>
  );
}

export default Chatbot;