import React, { useState, useEffect } from "react";
import { db } from "../Firebase/config";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Container, Table, Button, Spinner, Alert } from "react-bootstrap";

const AllCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "customers"));
        const customersData = querySnapshot.docs.map(doc => ({
          // Using Firestore's document ID as the primary identifier
          firebaseId: doc.id,  // This is the actual document ID from Firebase
          ...doc.data()
        }));
        setCustomers(customersData);
      } catch (err) {
        console.error("Error fetching customers: ", err);
        setError("Failed to load customers. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const handleViewDetails = (firebaseId) => {
    // Now passing the actual Firebase document ID
    navigate(`/customer/${firebaseId}`);
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>All Customers</h2>
        <Button 
          variant="primary"
          onClick={() => navigate("/customers/new")}
        >
          Add New Customer
        </Button>
      </div>

      <div className="table-responsive">
        <Table striped bordered hover className="shadow-sm">
          <thead className="bg-primary text-white">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Organization</th>
              <th>Phone</th>
              <th>Current Balance</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.firebaseId}>
                <td>{customer.id || '-'}</td> {/* Display the custom ID if exists */}
                <td>{customer.name}</td>
                <td>{customer.organization || '-'}</td>
                <td>{customer.phone}</td>
                <td>₹{customer.currentBalance?.toLocaleString('en-IN') || '0'}</td>
                <td>
                  <Button 
                    variant="outline-primary"
                    size="sm"
                    onClick={() => handleViewDetails(customer.firebaseId)}
                  >
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Container>
  );
};

export default AllCustomers;