import React, { useState, useEffect, useMemo, useCallback } from "react";
import { db } from "../Firebase/config";
import { FaUserInjured } from "react-icons/fa";
import { collection, query, orderBy, limit, startAfter, getDocs } from "firebase/firestore";
import "./PatientTable.css";
import { useNavigate } from "react-router-dom";
import { FaFilter, FaFileExcel, FaArrowLeft, FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import * as XLSX from "xlsx";

const PatientTable = () => {
  // State management
  const [patients, setPatients] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [sortConfig, setSortConfig] = useState({ 
    key: "registrationDate", 
    direction: "desc" 
  });
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  
  const patientsPerPage = 50; // Reduced initial load
  const navigate = useNavigate();

  // Fetch initial batch of patients from Firestore
  useEffect(() => {
    const fetchInitialPatients = async () => {
      try {
        setIsLoading(true);
        const patientsRef = collection(db, "Patients");
        const firstBatchQuery = query(
          patientsRef,
          orderBy(sortConfig.key, sortConfig.direction),
          limit(patientsPerPage)
        );
        
        const documentSnapshots = await getDocs(firstBatchQuery);
        const patientsData = documentSnapshots.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setPatients(patientsData);
        setLastVisible(documentSnapshots.docs[documentSnapshots.docs.length - 1]);
        setHasMore(patientsData.length === patientsPerPage);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching patients: ", error);
        setIsLoading(false);
      }
    };

    fetchInitialPatients();
  }, [sortConfig.key, sortConfig.direction]);

  // Load more patients when needed
  const loadMorePatients = async () => {
    if (!lastVisible || isLoadingMore) return;
    
    try {
      setIsLoadingMore(true);
      const patientsRef = collection(db, "Patients");
      const nextBatchQuery = query(
        patientsRef,
        orderBy(sortConfig.key, sortConfig.direction),
        startAfter(lastVisible),
        limit(patientsPerPage)
      );
      
      const documentSnapshots = await getDocs(nextBatchQuery);
      const newPatients = documentSnapshots.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setPatients(prev => [...prev, ...newPatients]);
      setLastVisible(documentSnapshots.docs[documentSnapshots.docs.length - 1]);
      setHasMore(newPatients.length === patientsPerPage);
    } catch (error) {
      console.error("Error loading more patients: ", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Normalize diagnosis string into an array
  const normalizeDiagnosis = useCallback((diagnosis) => {
    if (!diagnosis) return [];
    return diagnosis.split(",").map((d) => d.trim());
  }, []);

  // Get unique diagnoses for the filter dropdown
  const uniqueDiagnoses = useMemo(() => {
    const diagnoses = ["All"];
    patients.forEach((patient) => {
      const normalized = normalizeDiagnosis(patient.mainDiagnosis);
      normalized.forEach((d) => {
        if (d && !diagnoses.includes(d)) diagnoses.push(d);
      });
    });
    return diagnoses;
  }, [patients, normalizeDiagnosis]);

  // Filter and sort patients (client-side for the loaded subset)
  const filteredPatients = useMemo(() => {
    let filtered = patients.filter((patient) => {
      const searchFields = [
        patient.name || "",
        patient.address || "",
        patient.mainCaretakerPhone || "",
        patient.mainDiagnosis || "",
        patient.registernumber || ""
      ].join(" ").toLowerCase();

      const matchesSearchQuery = searchFields.includes(searchQuery.toLowerCase());
      const normalizedDiagnosis = normalizeDiagnosis(patient.mainDiagnosis);
      const matchesDiagnosis = selectedDiagnosis === "All" || normalizedDiagnosis.includes(selectedDiagnosis);
      const matchesStatus = selectedStatus === "All" || 
                         (selectedStatus === "Active" && !patient.deactivated) || 
                         (selectedStatus === "Inactive" && patient.deactivated);

      return matchesSearchQuery && matchesDiagnosis && matchesStatus;
    });

    // Client-side sorting as fallback
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key] || "";
        const bValue = b[sortConfig.key] || "";
        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [patients, searchQuery, selectedDiagnosis, selectedStatus, sortConfig, normalizeDiagnosis]);

  // Pagination
  const currentPatients = useMemo(() => {
    const indexOfLastPatient = currentPage * patientsPerPage;
    const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
    return filteredPatients.slice(indexOfFirstPatient, indexOfLastPatient);
  }, [filteredPatients, currentPage]);

  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);

  // Handlers
  const handleCardClick = (patientId) => navigate(`/main/patient/${patientId}`);
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (hasMore) {
      loadMorePatients().then(() => {
        setCurrentPage(currentPage + 1);
      });
    }
  };
  
  const handlePreviousPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  const handleDownloadExcel = () => {
    const headers = [
      "Reg No", "Name", "Registration Date", "Address", "Location", "Ward", 
      "Age", "Gender", "Category", "Medical History", "Main Diagnosis", 
      "Date of Birth", "Current Difficulties", "Email", "Main Caretaker", 
      "Main Caretaker Phone", "Neighbour Name", "Neighbour Phone", "Panchayat", 
      "Patient ID", "Relative Phone", "Referral Person", "Referral Phone", 
      "Community Volunteer", "Community Volunteer Phone", "Ward Member", 
      "Ward Member Phone", "Asha Worker", "Status"
    ];

    const data = filteredPatients.map((patient) => ({
      "Reg No": patient.registernumber || "N/A",
      "Name": patient.name || "N/A",
      "Registration Date": patient.registrationDate || "N/A",
      "Address": patient.address || "N/A",
      "Location": patient.location || "N/A",
      "Ward": patient.ward || "N/A",
      "Age": patient.age || "N/A",
      "Gender": patient.gender || "N/A",
      "Category": patient.category || "N/A",
      "Medical History": patient.medicalHistory || "N/A",
      "Main Diagnosis": patient.mainDiagnosis || "N/A",
      "Date of Birth": patient.dob || "N/A",
      "Current Difficulties": patient.currentDifficulties || "N/A",
      "Email": patient.email || "N/A",
      "Main Caretaker": patient.mainCaretaker || "N/A",
      "Main Caretaker Phone": patient.mainCaretakerPhone || "N/A",
      "Neighbour Name": patient.neighbourName || "N/A",
      "Neighbour Phone": patient.neighbourPhone || "N/A",
      "Panchayat": patient.panchayat || "N/A",
      "Patient ID": patient.patientId || "N/A",
      "Relative Phone": patient.relativePhone || "N/A",
      "Referral Person": patient.referralPerson || "N/A",
      "Referral Phone": patient.referralPhone || "N/A",
      "Community Volunteer": patient.communityVolunteer || "N/A",
      "Community Volunteer Phone": patient.communityVolunteerPhone || "N/A",
      "Ward Member": patient.wardMember || "N/A",
      "Ward Member Phone": patient.wardMemberPhone || "N/A",
      "Asha Worker": patient.ashaWorker || "N/A",
      "Status": patient.deactivated ? "INACTIVE" : "ACTIVE"
    }));

    const worksheet = XLSX.utils.json_to_sheet(data, { header: headers });
    XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: "A1" });
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Patients");
    XLSX.writeFile(workbook, `patients_export_${new Date().toISOString().slice(0,10)}.xlsx`);
  };

  // Sort indicator component
  const SortIndicator = ({ sortKey }) => {
    if (sortConfig.key !== sortKey) return <FaSort className="sort-icon" />;
    return sortConfig.direction === "asc" ? 
      <FaSortUp className="sort-icon active" /> : 
      <FaSortDown className="sort-icon active" />;
  };

  return (
    <div className="PatientTable-container compact-view">
      {/* Header Section */}
      <div className="PatientTable-header compact-header">
        <div className="header-left">
          <button className="back-button compact" onClick={() => navigate(-1)}>
            <FaArrowLeft />
          </button>
          <h2 className="compact-title">Patient List</h2>
        </div>
        
        <div className="header-right">
          <span className="patient-count compact">
            <FaUserInjured style={{ marginRight: "5px" }} />
            {filteredPatients.length} 
            {hasMore && filteredPatients.length >= patientsPerPage && "+"}
          </span>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="search-filter-container compact">
        <div className="search-bar compact">
          <input
            type="text"
            placeholder="Search patients..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        
        <button
          className={`filter-toggle compact ${showFilters ? "active" : ""}`}
          onClick={() => setShowFilters(!showFilters)}
          title={showFilters ? "Hide Filters" : "Show Filters"}
        >
          <FaFilter />
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="filters-box compact">
          <div className="filter-group compact">
            <label>Diagnosis</label>
            <select 
              value={selectedDiagnosis} 
              onChange={(e) => {
                setSelectedDiagnosis(e.target.value);
                setCurrentPage(1);
              }}
            >
              {uniqueDiagnoses.map((diagnosis) => (
                <option key={diagnosis} value={diagnosis}>
                  {diagnosis}
                </option>
              ))}
            </select>
          </div>
          
          <div className="filter-group compact">
            <label>Status</label>
            <select 
              value={selectedStatus} 
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="All">All Status</option>
              <option value="Active">Active Only</option>
              <option value="Inactive">Inactive Only</option>
            </select>
          </div>
          
          <div className="sort-options compact">
            <label>Sort By</label>
            <div className="sort-buttons">
              <button 
                className={`sort-btn compact ${sortConfig.key === "name" ? "active" : ""}`}
                onClick={() => handleSort("name")}
              >
                Name <SortIndicator sortKey="name" />
              </button>
              <button 
                className={`sort-btn compact ${sortConfig.key === "registrationDate" ? "active" : ""}`}
                onClick={() => handleSort("registrationDate")}
              >
                Date <SortIndicator sortKey="registrationDate" />
              </button>
              <button 
                className="download-btn compact sort-btn"
                onClick={handleDownloadExcel}
                title="Export to Excel"
              >
                <FaFileExcel /> Excel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      {isLoading ? (
        <div className="loading-container compact">
          <img
            src="https://media.giphy.com/media/YMM6g7x45coCKdrDoj/giphy.gif"
            alt="Loading..."
            className="loading-image compact"
          />
        </div>
      ) : (
        <>
          {/* Patient Cards Grid */}
          <div className="patient-cards-grid compact">
            {currentPatients.length > 0 ? (
              currentPatients.map((patient) => (
                <PatientCard 
                  key={patient.id}
                  patient={patient}
                  onClick={() => handleCardClick(patient.id)}
                  normalizeDiagnosis={normalizeDiagnosis}
                  compact={true}
                />
              ))
            ) : (
              <div className="no-results compact">
                No patients found matching your criteria
              </div>
            )}
          </div>

          {/* Pagination */}
          {(filteredPatients.length > patientsPerPage || hasMore) && (
            <div className="pagination compact">
              <button 
                onClick={handlePreviousPage} 
                disabled={currentPage === 1} 
                className="pagination-btn compact"
              >
                &lt;
              </button>
              
              <div className="page-info compact">
                {currentPage} {hasMore && filteredPatients.length >= patientsPerPage ? "+" : ""}
              </div>
              
              <button 
                onClick={handleNextPage} 
                disabled={!hasMore && currentPage === totalPages} 
                className="pagination-btn compact"
              >
                {isLoadingMore ? "..." : ">"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// Compact Patient Card Component
const PatientCard = ({ patient, onClick, normalizeDiagnosis, compact }) => {
  return (
    <div className={`patient-card ${compact ? "compact" : ""}`} onClick={onClick}>
      <div className="card-header">
        <div className={`profile-pic compact ${patient.deactivated ? "inactive-border" : "active-border"}`}>
          <img 
            src={patient.profilePic || "https://cdn-icons-png.flaticon.com/512/3177/3177440.png"} 
            alt="Patient" 
            onError={(e) => {
              e.target.src = "https://cdn-icons-png.flaticon.com/512/3177/3177440.png";
            }}
          />
        </div>

        <div className="patient-meta">
          <h3 className="patient-name compact">{patient.name || "N/A"}</h3>
          <span className="info-value">{patient.registernumber || "N/A"}</span>
        </div>
      </div>
      
      <div className="card-body compact">
        <div className="info-row compact">
          <span className="info-label">Address:</span>
          <span className="info-value">{patient.address || "N/A"}</span>
        </div>
        <div className="info-row compact">
          <span className="info-label">Diagnosis:</span>
          <span className="info-value" title={normalizeDiagnosis(patient.mainDiagnosis).join(", ")}>
            {normalizeDiagnosis(patient.mainDiagnosis).join(", ") || "N/A"}
          </span>
        </div>
        <div className="info-row compact">
          <span className="info-label">Registered:</span>
          <span className="info-value">
            {patient.registrationDate ? new Date(patient.registrationDate).toLocaleDateString() : "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PatientTable;