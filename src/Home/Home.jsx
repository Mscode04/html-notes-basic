import React, { useState, useEffect } from "react";
import { db } from "../Firebase/config"; // Your Firebase config file
import { collection, getDocs } from "firebase/firestore";
import "./Home.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useNavigate } from "react-router-dom";

function Home() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReporter, setSelectedReporter] = useState("All");
  const [uniqueReporters, setUniqueReporters] = useState([]);
  const navigate = useNavigate();

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleLogout = () => {
    navigate("/logout");
  };

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const reportsRef = collection(db, "Reports");
        const currentDate = new Date();
        const startOfToday = new Date(currentDate.setHours(0, 0, 0, 0));
        const endOfToday = new Date(currentDate.setHours(23, 59, 59, 999));

        const reportsSnapshot = await getDocs(reportsRef);
        const reportsData = reportsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const filteredReports = reportsData.filter((report) => {
          const reportDate = new Date(report.submittedAt);
          return reportDate >= startOfToday && reportDate <= endOfToday;
        });

        setReports(filteredReports);

        // Extract unique reporters
        const reporters = [...new Set(filteredReports.map((report) => report.team1))];
        setUniqueReporters(["All", ...reporters]);
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const getReportDetailsRoute = (formType, reportId) => {
    switch (formType) {
      case "NHC":
        return `/main/reportsdetailnhc/${reportId}`;
      case "NHC(E)":
        return `/main/reportsdetailnhce/${reportId}`;
      case "DHC":
        return `/main/report-details-dhc/${reportId}`;
      case "PROGRESSION REPORT":
        return `/main/report-details-progression/${reportId}`;
      case "SOCIAL REPORT":
        return `/main/report-details-social/${reportId}`;
      case "VHC":
        return `/main/report-details-vhc/${reportId}`;
      case "GVHC":
        return `/main/report-details-vhc/${reportId}`;
      case "INVESTIGATION":
        return `/main/report-details-investigation/${reportId}`;
      case "DEATH":
        return `/main/report-details-death/${reportId}`;
      default:
        return `/main/report-details-default/${reportId}`;
    }
  };

  const handleReporterChange = (event) => {
    setSelectedReporter(event.target.value);
  };

  const filteredReports = selectedReporter === "All"
    ? reports
    : reports.filter((report) => report.team1 === selectedReporter);

  return (
    <div className="HomeApp">
      {/* Topbar */}
      <header className="HomeTopbar">
        <button className="btn btn-transparent" onClick={toggleDrawer}>
          <i className="bi bi-list"></i>
        </button>
      </header>

      {/* Drawer */}
      <div className={`HomeDrawer ${drawerOpen ? "open" : ""}`}>
        <button className="HomeDrawerCloseButton" onClick={toggleDrawer}>
          <i className="bi bi-arrow-left"></i>
        </button>
        <div className="drawer-content">
          {/* <Link to="/main/auto-list" className="HomeDrawerButton">
          AUTO SCHEDULE
          </Link> */}
          <Link to="/main/shameema-list" className="HomeDrawerButton">
          SHAMEEMA
          </Link>
          <Link to="/main/divya-list" className="HomeDrawerButton">
            DIVYA
          </Link>
          <Link to="/main/haseena-list" className="HomeDrawerButton">
            HASEENA
          </Link>
          <a
            href="https://neuraq.github.io/Palliative-Mkba-App-Contact/"
            target="_blank"
            rel="noopener noreferrer"
            className="HomeDrawerButton"
          >
            Contact Us
          </a>
          <Link to="/main/medicine-list" className="HomeDrawerButton">
            Medicine List
          </Link>
        </div>
        <div className="drawer-footer">
          <button className="HomeDrawerButton btn-danger" onClick={handleLogout}>
            Logout
          </button>
          <div className="powered-by">Powered by Neuraq Technologies</div>
        </div>
      </div>

      {/* Banner Section */}
      <div className="HomeBanner">
        <div className="hero-name">
        <h1 style={{ color: "#1e506b" }} className="">Dashboard</h1>
        </div>
        {/* <div className="HomeBannerButtons">
          <Link to="/main/addpt" className="HomeBannerButton">
            Register New Patients
          </Link>
          <Link to="/main/allrepots" className="HomeBannerButton">
            Patients Reports
          </Link>
        </div> */}
      </div>

      {/* Reports Section */}
      <div className="HomeReports filter-section">
        <h4 className="HomeReportsTitle">Today ({filteredReports.length})  <select
            id="reporter-filter"
            className="filter-section"
            value={selectedReporter}
            onChange={handleReporterChange}
          >
            {uniqueReporters.map((reporter) => (
              <option key={reporter} value={reporter}>
                {reporter}
              </option>
            ))}
          </select></h4> 
      
        {loading ? (
          <div className="loading-container">
            <img
              src="https://media.giphy.com/media/YMM6g7x45coCKdrDoj/giphy.gif"
              alt="Loading..."
              className="loading-image"
            />
          </div>
        ) : filteredReports.length === 0 ? (
          <p>No reports found for today.</p>
        ) : (
          <div className="HomeReportsCards">
            {filteredReports.map((report) => (
              <Link
                to={getReportDetailsRoute(report.formType, report.id)}
                className="HomeReportCardLink"
                key={report.id}
              >
                <div className="HomeReportCard">
                  <img src="https://www.csdtitsolution.com/images/blogs/Chapitre_2.gif" alt="" />
                  <div className="HomeReportInfo">
                    <h5>{report.formType} : {report.name} </h5>
                    <p></p>
                  <small>
  {new Date(report.submittedAt).toLocaleString()} - REPORTED BY {"  "}
  <span style={{ color: "#000" }}>{report.team1}</span>
</small>

                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;