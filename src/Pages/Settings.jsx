import React, { useState } from "react";
// import "./Settings.css";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [formData, setFormData] = useState({
    name: "Admin User",
    email: "admin@clinicpro.com",
    role: "Administrator",
    notifications: true,
    theme: "light"
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  return (
    <div className="settings-page">
      <h2>Settings</h2>
      
      <div className="settings-container">
        <div className="settings-sidebar">
          <button 
            className={`settings-tab ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </button>
          <button 
            className={`settings-tab ${activeTab === "account" ? "active" : ""}`}
            onClick={() => setActiveTab("account")}
          >
            Account
          </button>
          <button 
            className={`settings-tab ${activeTab === "preferences" ? "active" : ""}`}
            onClick={() => setActiveTab("preferences")}
          >
            Preferences
          </button>
          <button 
            className={`settings-tab ${activeTab === "security" ? "active" : ""}`}
            onClick={() => setActiveTab("security")}
          >
            Security
          </button>
        </div>

        <div className="settings-content">
          {activeTab === "profile" && (
            <div className="profile-settings">
              <h3>Profile Information</h3>
              <form>
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled
                  />
                </div>
                <div className="form-group">
                  <label>Role</label>
                  <input
                    type="text"
                    value={formData.role}
                    disabled
                  />
                </div>
                <button type="submit" className="btn primary">
                  Save Changes
                </button>
              </form>
            </div>
          )}

          {activeTab === "preferences" && (
            <div className="preferences-settings">
              <h3>User Preferences</h3>
              <form>
                <div className="form-group checkbox">
                  <input
                    type="checkbox"
                    id="notifications"
                    name="notifications"
                    checked={formData.notifications}
                    onChange={handleChange}
                  />
                  <label htmlFor="notifications">Enable Email Notifications</label>
                </div>
                <div className="form-group">
                  <label>Theme</label>
                  <select
                    name="theme"
                    value={formData.theme}
                    onChange={handleChange}
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System Default</option>
                  </select>
                </div>
                <button type="submit" className="btn primary">
                  Save Preferences
                </button>
              </form>
            </div>
          )}

          {/* Add other tabs content similarly */}
        </div>
      </div>
    </div>
  );
};

export default Settings;