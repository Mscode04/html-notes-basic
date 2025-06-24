import React, { useState, useEffect, useRef } from "react";
import { db } from "../Firebase/config";
import { 
  collection, 
  getDocs, 
  query, 
  where, 
  doc, 
  deleteDoc, 
  orderBy, 
  limit,
  startAfter
} from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AllReportsPage.css";
import { ExclamationTriangleFill } from 'react-bootstrap-icons';

const AllReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [showMessage, setShowMessage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [nameFilter, setNameFilter] = useState("");
  const [formTypeFilter, setFormTypeFilter] = useState("");
  const [addressFilter, setAddressFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [reportToDelete, setReportToDelete] = useState(null);
  const [pin, setPin] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const lastDocRef = useRef(null);

  const reportsPerPage = 20; // Reduced for better performance
  const navigate = useNavigate();

  const fetchReports = async (loadMore = false) => {
    try {
      if (loadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
        setReports([]);
        lastDocRef.current = null;
        setHasMore(true);
      }

      setError(null);
      const reportsRef = collection(db, "Reports");
      
      // Base query with sorting (newest first)
      let q = query(
        reportsRef,
        orderBy("submittedAt", "desc"),
        limit(reportsPerPage)
      );

      // Apply cursor if loading more
      if (loadMore && lastDocRef.current) {
        q = query(q, startAfter(lastDocRef.current));
      }

      // Apply formType filter if selected
      if (formTypeFilter) {
        q = query(q, where("formType", "==", formTypeFilter));
      }

      const querySnapshot = await getDocs(q);
      
      // Update the last visible document reference
      if (querySnapshot.docs.length > 0) {
        lastDocRef.current = querySnapshot.docs[querySnapshot.docs.length - 1];
      }

      // Check if we've reached the end
      if (querySnapshot.docs.length < reportsPerPage) {
        setHasMore(false);
      }

      let reportsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Apply client-side filters
      reportsData = applyClientFilters(reportsData);

      // Merge new reports when loading more
      if (loadMore) {
        setReports(prevReports => [...prevReports, ...reportsData]);
      } else {
        setReports(reportsData);
      }
    } catch (error) {
      console.error("Error fetching reports: ", error);
      setError("Failed to load reports. Please try again later.");
    } finally {
      if (loadMore) {
        setLoadingMore(false);
      } else {
        setLoading(false);
      }
    }
  };

  const applyClientFilters = (data) => {
    let filteredData = [...data];
    
    // Name filter
    if (nameFilter) {
      filteredData = filteredData.filter((report) =>
        report.name?.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }
    
    // Address filter
    if (addressFilter) {
      filteredData = filteredData.filter((report) =>
        report.address?.toLowerCase().includes(addressFilter.toLowerCase())
      );
    }
    
    // Date filtering
    if (startDate || endDate) {
      const startDateObj = startDate ? new Date(startDate) : null;
      const endDateObj = endDate ? new Date(endDate) : null;
      if (endDateObj) endDateObj.setHours(23, 59, 59, 999);

      filteredData = filteredData.filter((report) => {
        if (!report.submittedAt) return false;
        const submittedAtDate = new Date(report.submittedAt);
        if (startDateObj && submittedAtDate < startDateObj) return false;
        if (endDateObj && submittedAtDate > endDateObj) return false;
        return true;
      });
    }
    
    return filteredData;
  };

  // Initial load
  useEffect(() => {
    fetchReports();
  }, []);

  // Refetch when filters change (except name/address which are client-side)
  useEffect(() => {
    if (!loading) {
      fetchReports();
    }
  }, [formTypeFilter, startDate, endDate]);

  const handleBackClick = () => {
    navigate(-1);
  };

  const getReportDetailsRoute = (formType, reportId) => {
    const routes = {
      "NHC": `/main/reportsdetailnhc/${reportId}`,
      "NHC(E)": `/main/reportsdetailnhce/${reportId}`,
      "DHC": `/main/report-details-dhc/${reportId}`,
      "PROGRESSION REPORT": `/main/report-details-progression/${reportId}`,
      "SOCIAL REPORT": `/main/report-details-social/${reportId}`,
      "VHC": `/main/report-details-vhc/${reportId}`,
      "GVHC": `/main/report-details-vhc/${reportId}`,
      "INVESTIGATION": `/main/report-details-investigation/${reportId}`,
      "DEATH": `/main/report-details-death/${reportId}`
    };
    return routes[formType] || `/main/report-details-default/${reportId}`;
  };

  const handleDeleteClick = (reportId) => {
    setReportToDelete(reportId);
    setShowConfirmation(true);
  };

  const handleConfirmDelete = async () => {
    if (pin === "2012") {
      try {
        await deleteDoc(doc(db, "Reports", reportToDelete));
        setReports(reports.filter((report) => report.id !== reportToDelete));
        setShowConfirmation(false);
        setPin("");
        toast.success("Report deleted successfully!");
      } catch (error) {
        console.error("Error deleting report: ", error);
        toast.error("Failed to delete report.");
      }
    } else {
      toast.error("Incorrect PIN.");
    }
  };

  const handleLoadMore = () => {
    if (hasMore && !loadingMore) {
      fetchReports(true);
    }
  };

  // Apply client-side filters to existing data when they change
  useEffect(() => {
    if (!loading && (nameFilter || addressFilter)) {
      const filteredReports = applyClientFilters(reports);
      setReports(filteredReports);
    }
  }, [nameFilter, addressFilter]);


  const handleClick = () => {
  setShowMessage(true);
};

const handleContinue = () => {
  navigate('/main/allrep');
};

const handleExit = () => {
  setShowMessage(false);
};

  return (
    <div className="AllRep-container">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        toastStyle={{ marginTop: "20px" }}
      />

      <button onClick={handleBackClick} className="AllRep-back-button">
        &larr; Back
      </button>
      <h2 className="AllRep-heading">All Reports ({reports.length})</h2>

      {/* Filters */}
      <div className="AllRep-filters-container">
        {/* <input
          type="text"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          placeholder="Search by Name"
          className="AllRep-filter-input"
        /> */}
        {/* <select
          value={formTypeFilter}
          onChange={(e) => setFormTypeFilter(e.target.value)}
          className="AllRep-filter-select"
        >
          <option value="">All Form Types</option>
          <option value="NHC">NHC</option>
          <option value="NHC(E)">NHC(E)</option>
          <option value="DHC">DHC</option>
          <option value="PROGRESSION REPORT">Progression Report</option>
          <option value="SOCIAL REPORT">Social Report</option>
          <option value="VHC">VHC</option>
          <option value="GVHC">GVHC</option>
          <option value="INVESTIGATION">Investigation</option>
          <option value="DEATH">Death</option>
        </select> */}
        
        {/* <input
          type="text"
          value={addressFilter}
          onChange={(e) => setAddressFilter(e.target.value)}
          placeholder="Search by Address"
          className="AllRep-filter-input"
        /> */}
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          placeholder="Start Date"
          className="AllRep-filter-input"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          placeholder="End Date"
          className="AllRep-filter-input"
        />
<button className="btn btn-dark p-2 m-2" onClick={handleClick}>
    Full Load
  </button>

  {showMessage && (
    <div className="alert alert-warning d-flex align-items-center mt-2" role="alert">
      <ExclamationTriangleFill className="me-2" />
      <div>
        This is fully report loading. Your Firebase usage may increase.
        <div className="mt-2">
          <button className="btn btn-success btn-sm me-2" onClick={handleContinue}>
            Continue
          </button>
          <button className="btn btn-secondary btn-sm" onClick={handleExit}>
            Exit
          </button>
        </div>
      </div>
    </div>
  )}
      </div>

      {loading ? (
        <div className="loading-container">
          <img
            src="https://media.giphy.com/media/YMM6g7x45coCKdrDoj/giphy.gif"
            alt="Loading..."
            className="loading-image"
          />
          <p>Loading initial reports...</p>
        </div>
      ) : error ? (
        <p className="AllRep-error">{error}</p>
      ) : reports.length === 0 ? (
        <p className="AllRep-no-reports">No reports found matching your criteria.</p>
      ) : (
        <>
          <div className="AllRep-reports-list">
            {reports.map((report) => (
              <div key={report.id} className="AllRep-report-item">
                <Link
                  to={getReportDetailsRoute(report.formType, report.id)}
                  className="AllRep-report-link"
                >
                  <h3 className="AllRep-report-title">
                    {report.formType || "Report"} : {report.name || "No Name"}
                  </h3>
                  <p className="AllRep-report-date">
                    {report.submittedAt
                      ? new Date(report.submittedAt).toLocaleString("en-US", {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "numeric",
                          second: "numeric",
                          hour12: true,
                        })
                      : "No date available"}
                  </p>
                  <p className="AllRep-report-name">{report.name || "No Name"}</p>
                  <p className="AllRep-report-name">
                    REPORTED BY: {report.team1 || "NOT MENTIONED"}
                  </p>
                  <p className="AllRep-report-name">{report.registernumber}</p>
                  <p className="AllRep-report-address">
                    {report.address || "No Address"}
                  </p>
                </Link>
                <button
                  onClick={() => handleDeleteClick(report.id)}
                  className="AllRep-delete-button"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>

          {/* Load More button */}
          {hasMore && (
            <div className="AllRep-load-more ">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="AllRep-load-more-button btn-dark p-3 m-3"
              >
                {loadingMore ? (
                  <span>Loading...</span>
                ) : (
                  <span className="">Load More Reports</span>
                )}
              </button>
              
            </div>
          )}
        </>
      )}

      {/* {showConfirmation && (
        <div className="AllRep-confirmation-box">
          <p>Enter PIN to delete the report:</p>
          <input
            type="password"
            value={pin}
            onChange={handlePinChange}
            placeholder="Enter PIN"
            className="AllRep-pin-input"
          />
          <div className="AllRep-confirmation-buttons">
            <button onClick={handleConfirmDelete} className="AllRep-confirm-button">
              Confirm
            </button>
            <button onClick={handleCancelDelete} className="AllRep-cancel-button">
              Cancel
            </button>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default AllReportsPage;