import React from "react";
import { Link, Navigate } from "react-router-dom";
import "./Main.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route } from "react-router-dom";
import Home from "../Home/Home";
import AddPatient from "../Forms/AddPatient";
import PatientTable from "../Patients-List/PatientTable";
import PatientDetails from "../PatientDetials.jsx/PatientDetails";
import NHC from "../Forms/NHC";
import ReportsPage from "../PatientDetials.jsx/ReportsPage";
import ReportDetailsNHC from "../PatientDetials.jsx/ReportDetailsNHC";
import AllReportsPage from "../PatientDetials.jsx/AllReportsPage";
import Medicine from "../Forms/Medicine";
import UpdateMedicines from "../Forms/UpdateMedicines";
import Equipment from "../Forms/Equipment";
import NHCE from "../Forms/NHCE";
import VHC from "../Forms/VHC";
import GVHC from "../Forms/VHC";
import Progression from "../Forms/PROGRESSION";
import DHC from "../Forms/DHC";
import Social from "../Forms/Social";
import INVESTIGATION from "../Forms/INVESTGATION";
import DEATH from "../Forms/DEATH";
import UpdateNHC from "../Forms/UpdateNHC";
import UpdateDHC from "../Forms/UpdateDHC";
import UpdateVHC from "../Forms/UpdateVHC";
import UpdateINVESTIGATION from "../Forms/UpdateINVESTIGATION";
import UpdatePROGRESSION from "../Forms/UpdatePROGRESSION";
import ReportDetailsDHC from "../PatientDetials.jsx/ReportDetailsDHC";
import ReportDetailsVHC from "../PatientDetials.jsx/ReportDetailsVHC";
import AllRep from "../PatientDetials.jsx/AllRep";
import ReportDetailsPROGRESSION from "../PatientDetials.jsx/ReportDetailsPROGRESSION";
import ReportDetailsINVESTIGATION from "../PatientDetials.jsx/ReportDetailsINVESTIGATION";
import ReportDetailsSOCIAL from "../PatientDetials.jsx/ReportDetailsSOCIAL";
import ReportDetailsDEATH from "../PatientDetials.jsx/ReportDetailsDEATH";
import UpdateSOCIAL from "../Forms/UpdateSOCIAL";
import UpdateDEATH from "../Forms/UpdateDEATH";
import UpdatePatient from "../Forms/UpdatePatient";
import MedicineList from "../Forms/MedicineList";
import UpdateNHCE from "../Forms/UpdateNHCE";
import FamilyTree from "../Forms/FamilyTree";
import ReportDetailsNHCE from "../PatientDetials.jsx/ReportDetailsNHCE";
import Conditions from "../Forms/Conditions";
import DeactivatePatient from "../Forms/DeactivatePatient";
import Divya from "../PatientDetials.jsx/Divya";
import Shemeema from "../PatientDetials.jsx/Shemeema";
import Haseena from "../PatientDetials.jsx/Haseena";
import Auto from "../PatientDetials.jsx/Auto";
function Main({ isAuthenticated, isNurse }) {
  if (!isAuthenticated || !isNurse) {
    return <Navigate to="/" />; // Redirect to login if not authenticated or not a nurse
  }

  return (
    <div className="mainhome_app">
      <div className="mainhome_page-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/addpt" element={<AddPatient />} />
          <Route path="/fmtree/:patientId" element={<FamilyTree />} />
          <Route path="/allrepots" element={<AllReportsPage />} />
          <Route path="/allrep" element={<AllRep />} />
          <Route path="/medicine-list" element={<MedicineList />} />
          <Route path="/divya-list" element={<Divya />} />
          <Route path="/auto-list" element={<Auto />} />
          <Route path="/shameema-list" element={<Shemeema />} />
          <Route path="/haseena-list" element={<Haseena />} />
          <Route path="/ptlist" element={<PatientTable />} />
          <Route path="/patient/:patientId" element={<PatientDetails />} />
          <Route path="/nhc/:patientId" element={<NHC />} />
          <Route path="/dhc/:patientId" element={<DHC />} />
          <Route path="/nhce/:patientId" element={<NHCE />} />
          <Route path="/vhc/:patientId" element={<VHC />} />
          <Route path="/prograssion/:patientId" element={<Progression />} />
          <Route path="/gvhc/:patientId" element={<GVHC />} />
          <Route path="/equpment/:patientId" element={<Equipment />} />
          <Route path="/medicine/:patientId" element={<Medicine />} />
          <Route path="/social/:patientId" element={<Social />} />
          <Route path="/update-patient/:patientId" element={<UpdatePatient />} />
          <Route path="/invest/:patientId" element={<INVESTIGATION />} />
          <Route path="/death/:patientId" element={<DEATH />} />
          <Route path="/update-medicines/:patientId" element={<UpdateMedicines />} />
          <Route path="/conditions/:patientId" element={<Conditions />} />
          <Route path="/deactive/:patientId" element={<DeactivatePatient />} />
          <Route path="/reports/:patientId" element={<ReportsPage />} />
          <Route path="/reportsdetailnhc/:reportId" element={<ReportDetailsNHC />} />
          <Route path="/reportsdetailnhce/:reportId" element={<ReportDetailsNHCE />} />
          <Route path="/report-details-dhc/:reportId" element={<ReportDetailsDHC />} />
          <Route path="/report-details-vhc/:reportId" element={<ReportDetailsVHC />} />
          <Route path="/report-details-investigation/:reportId" element={<ReportDetailsINVESTIGATION />} />
          <Route path="/report-details-progression/:reportId" element={<ReportDetailsPROGRESSION />} />
          <Route path="/report-details-social/:reportId" element={<ReportDetailsSOCIAL />} />
          <Route path="/report-details-death/:reportId" element={<ReportDetailsDEATH />} />
          <Route path="/update-nhc/:reportId" element={<UpdateNHC />} />
          <Route path="/update-nhce/:reportId" element={<UpdateNHCE />} />
          <Route path="/update-dhc/:reportId" element={<UpdateDHC />} />
          <Route path="/update-vhc/:reportId" element={<UpdateVHC />} />
          <Route path="/update-investigation/:reportId" element={<UpdateINVESTIGATION />} />
          <Route path="/update-progression/:reportId" element={<UpdatePROGRESSION />} />
          <Route path="/update-social/:reportId" element={<UpdateSOCIAL />} />
          <Route path="/update-death/:reportId" element={<UpdateDEATH />} />
        </Routes>
      </div>

      {/* Bottom Navigation Bar */}
      <nav className="mainhome_bottom-nav">
        <Link to="/main" className="mainhome_nav-item">
          <i className="bi bi-house"></i>
        </Link>
        <Link to="/main/addpt" className="mainhome_nav-item">
          <i className="bi bi-plus-circle"></i>
        </Link>
        <Link to="/main/ptlist" className="mainhome_nav-item">
          <i className="bi bi-person"></i>
        </Link>
        <Link to="/main/allrepots" className="mainhome_nav-item">
          <i className="bi bi-files"></i>
        </Link>
      </nav>
    </div>
  );
}

export default Main;