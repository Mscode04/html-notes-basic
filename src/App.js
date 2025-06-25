import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./Main/LandingPage";
import LoginPage from "./Main/LoginPage";
import Main from "./Main/Main";
import Logout from "./Pages/Logout";
import Dashboard from "./Pages/Dashboard";
import Patients from "./Pages/Patients";
import Appointments from "./Pages/Appointments";
import Reports from "./Pages/Reports";
import Settings from "./Pages/Settings";
import Help from "./Pages/Help";
import Products from "./Components/Products";
import Sales from "./Components/Sales";
import NewConnection from "./Components/NewConnection";
import Routess from "./Components/Routess";
import AllCustomers from "./Pages/AllCustomers";
import AllSales from "./Pages/AllSales";
import SaleDetail from "./Pages/SaleDetail";
import CustomerProfile from "./Pages/CustomerProfile";
import Checkin from "./Pages/Checkin";
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  );

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("isAuthenticated");
  };

  return (
    
      <Routes>
        <Route path="/" element={<LandingPage isAuthenticated={isAuthenticated} />} />
        <Route path="/login" element={!isAuthenticated ? <LoginPage setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/dashboard" />} />
        <Route path="/logout" element={<Logout onLogout={handleLogout} />} />
        
        {/* Protected routes */}
        <Route path="/" element={<Main />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="patients" element={<Patients />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
          <Route path="new-connection" element={<NewConnection />} />
          <Route path="sales" element={<Sales />} />
          <Route path="routes" element={<Routess/>} />
          <Route path="products" element={<Products />} />
          <Route path="help" element={<Help />} />
          <Route path="check-in" element={<Checkin />} />
          <Route path="all-customers" element={<AllCustomers />} />
            <Route path="all-sales" element={<AllSales />} />
<Route path="/customer/:id" element={<CustomerProfile />} />
<Route path="/sales/:id" element={<SaleDetail />} />
          
        </Route>

        {/* Redirect to dashboard if authenticated but invalid route */}
        <Route path="*" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
      </Routes>
   
  );
}

export default App;