import React, { useState, useEffect } from "react";
import { db } from "../Firebase/config";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Container, Table, Button, Spinner, Alert, Form, Row, Col } from "react-bootstrap";
import { format } from 'date-fns';

const AllSales = () => {
  const [sales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const q = query(collection(db, "sales"), orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);
        const salesData = querySnapshot.docs.map(doc => ({
          firebaseId: doc.id, // This is the Firestore document ID
          ...doc.data(),
          date: doc.data().timestamp?.toDate() || new Date()
        }));
        setSales(salesData);
        setFilteredSales(salesData);
      } catch (err) {
        console.error("Error fetching sales: ", err);
        setError("Failed to load sales. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, []);

  useEffect(() => {
    let results = sales;
    
    if (searchTerm) {
      results = results.filter(sale =>
        sale.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sale.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sale.productName?.toLowerCase().includes(searchTerm.toLowerCase()))
    }
    
    if (dateFilter) {
      results = results.filter(sale => 
        format(sale.date, 'yyyy-MM-dd') === dateFilter
      );
    }
    
    setFilteredSales(results);
  }, [searchTerm, dateFilter, sales]);

  const handleViewDetails = (firebaseId) => {
    navigate(`/sales/${firebaseId}`); // Now using Firestore document ID
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0);
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
        <h2>Sales History</h2>
      </div>

      <Row className="mb-4">
        <Col md={6}>
          <Form.Group controlId="search">
            <Form.Control
              type="text"
              placeholder="Search by customer, product or sale ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group controlId="dateFilter">
            <Form.Control
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={3} className="d-flex justify-content-end">
          <Button 
            variant="secondary"
            onClick={() => {
              setSearchTerm("");
              setDateFilter("");
            }}
          >
            Clear Filters
          </Button>
        </Col>
      </Row>

      {filteredSales.length === 0 ? (
        <Alert variant="info">No sales found matching your criteria</Alert>
      ) : (
        <div className="table-responsive">
          <Table striped bordered hover className="shadow-sm">
            <thead className="bg-primary text-white">
              <tr>
                <th>Sale ID</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Qty</th>
                <th>Amount</th>
                <th>Received</th>
                <th>Balance</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.map((sale) => (
                <tr key={sale.firebaseId}>
                  <td>{sale.id}</td> {/* Display the custom sale ID */}
                  <td>{format(sale.date, 'dd MMM yyyy')}</td>
                  <td>{sale.customerName || 'N/A'}</td>
                  <td>{sale.productName || 'N/A'}</td>
                  <td>{sale.salesQuantity}</td>
                  <td>{formatCurrency(sale.todayCredit)}</td>
                  <td>{formatCurrency(sale.totalAmountReceived)}</td>
                  <td className={sale.totalBalance > 0 ? 'text-danger' : 'text-success'}>
                    {formatCurrency(sale.totalBalance)}
                  </td>
                  <td>
                    <Button 
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleViewDetails(sale.firebaseId)} // Pass Firestore ID
                    >
                      Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </Container>
  );
};

export default AllSales;