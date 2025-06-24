import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../Firebase/config";
import { collection, query, where, getDocs, addDoc, doc, updateDoc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./FamilyTree.css";

const FamilyTree = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [patientData, setPatientData] = useState(null);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [treeData, setTreeData] = useState(null);
  const [name, setName] = useState("");
  const [gender, setGender] = useState("male");
  const [parentId, setParentId] = useState("");
  const [editMemberId, setEditMemberId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch patient details
  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const patientQuery = query(collection(db, "Patients"), where("patientId", "==", patientId));
        const patientSnapshot = await getDocs(patientQuery);

        if (!patientSnapshot.empty) {
          setPatientData(patientSnapshot.docs[0].data());
        } else {
          console.error("No patient document found with patientId:", patientId);
        }
      } catch (error) {
        console.error("Error fetching patient data:", error);
      }
    };

    fetchPatientData();
  }, [patientId]);

  // Fetch family members
  useEffect(() => {
    const fetchFamilyMembers = async () => {
      try {
        const familyQuery = query(collection(db, "FamilyTree"), where("patientId", "==", patientId));
        const familySnapshot = await getDocs(familyQuery);
        const members = familySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        setFamilyMembers(members);
        setTreeData(buildFamilyTree(members)); // Build tree structure
      } catch (error) {
        console.error("Error fetching family members:", error);
      }
    };

    fetchFamilyMembers();
  }, [patientId]);

  // Function to build tree structure
  const buildFamilyTree = (members) => {
    let memberMap = {};
    let root = null;

    members.forEach(member => memberMap[member.id] = { ...member, children: [] });

    members.forEach(member => {
      if (member.parentId) {
        if (memberMap[member.parentId]) {
          memberMap[member.parentId].children.push(memberMap[member.id]);
        }
      } else {
        root = memberMap[member.id]; // Root is the main patient or first ancestor
      }
    });

    return root;
  };

  // Function to handle adding/updating family members
  const handleAddOrUpdateMember = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const memberData = { patientId, name, gender, parentId: parentId || null };

      if (editMemberId) {
        await updateDoc(doc(db, "FamilyTree", editMemberId), memberData);
        toast.success("Family member updated successfully!");
      } else {
        const docRef = await addDoc(collection(db, "FamilyTree"), memberData);
        toast.success("Family member added successfully!");
      }

      setName("");
      setGender("male");
      setParentId("");
      setEditMemberId(null);
      window.location.reload(); // Refresh data
    } catch (error) {
      console.error("Error saving family member:", error);
      toast.error("Error saving family member. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit action
  const handleEditMember = (member) => {
    setName(member.name);
    setGender(member.gender);
    setParentId(member.parentId);
    setEditMemberId(member.id);
  };

  // Recursive function to render the tree
  const renderTree = (node) => {
    if (!node) return null;

    return (
      <div key={node.id} className="family-node">
        <span>{node.gender === "male" ? "🟦" : "🟪"} {node.name}</span>
        <div className="children">
          {node.children.map(child => renderTree(child))}
        </div>
      </div>
    );
  };

  return (
    <div className="FamilyTree-container">
      <button className="FamilyTree-backButton" onClick={() => navigate(-1)}>
        &larr; Back
      </button>
      <h2>Family Tree for Patient ID: {patientId}</h2>

      {patientData ? (
        <div className="FamilyTree-patientInfo">
          <h3><strong>Name:</strong> {patientData.name}</h3>
          <h3><strong>Address:</strong> {patientData.address}</h3>
        </div>
      ) : (
        <p>Loading patient details...</p>
      )}

      {/* Form to Add/Edit Family Members */}
      <form onSubmit={handleAddOrUpdateMember} className="FamilyTree-form">
        <h3>{editMemberId ? "Edit Family Member" : "Add Family Member"}</h3>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name"
            required
          />
        </label>
        <label>
          Gender:
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </label>
        <label>
          Parent:
          <select value={parentId} onChange={(e) => setParentId(e.target.value)}>
            <option value="">No Parent (Root)</option>
            {familyMembers.map(member => (
              <option key={member.id} value={member.id}>{member.name}</option>
            ))}
          </select>
        </label>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : (editMemberId ? "Update Member" : "Add Member")}
        </button>
      </form>

      {/* Display Family Members */}
      <div className="FamilyTree-members">
        <h3>Family Members</h3>
        {familyMembers.length > 0 ? (
          familyMembers.map(member => (
            <div key={member.id} className="FamilyTree-member">
              <span>{member.gender === "male" ? "⬜" : "⚫"} {member.name} (Parent: {member.parentId ? member.parentId : "None"})</span>
              <button onClick={() => handleEditMember(member)}>Edit</button>
            </div>
          ))
        ) : (
          <p>No family members found.</p>
        )}
      </div>

      {/* Render Family Tree */}
      <div className="family-tree">
        {treeData ? renderTree(treeData) : <p>Loading family tree...</p>}
      </div>

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default FamilyTree;
