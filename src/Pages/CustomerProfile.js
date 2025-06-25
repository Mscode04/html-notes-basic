import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../Firebase/config";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { Container, Card, Button, Spinner, Alert, ListGroup, Badge, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { format } from 'date-fns';

const CustomerProfile = () => {
  const { id } = useParams(); // Firebase document ID
  const [customer, setCustomer] = useState(null);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [salesLoading, setSalesLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomerAndSales = async () => {
      try {
        // Fetch customer data
        const docRef = doc(db, "customers", id);
        const docSnap = await getDoc(docRef);
        
        if (!docSnap.exists()) {
          throw new Error("Customer not found");
        }

        const customerData = {
          firebaseId: docSnap.id,
          ...docSnap.data()
        };
        setCustomer(customerData);

        // Fetch sales for this customer
        const salesQuery = query(
          collection(db, "sales"),
          where("customerId", "==", customerData.id) // Assuming you store customerId in sales
        );
        
        const querySnapshot = await getDocs(salesQuery);
        const salesData = querySnapshot.docs.map(doc => ({
          firebaseId: doc.id,
          ...doc.data(),
          date: doc.data().timestamp?.toDate() || new Date()
        }));

        setSales(salesData);
      } catch (err) {
        console.error("Error fetching data: ", err);
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
        setSalesLoading(false);
      }
    };

    fetchCustomerAndSales();
  }, [id]);

  const handleGoBack = () => {
    navigate("/customers");
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  const handleViewSale = (saleId) => {
    navigate(`/sales/${saleId}`);
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
        <Button variant="secondary" onClick={handleGoBack} className="mt-3">
          Back to Customers
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Button 
        variant="outline-secondary" 
        onClick={handleGoBack}
        className="mb-4"
      >
        &larr; Back to All Customers
      </Button>

      {/* Customer Profile Card */}
      <Card className="shadow-sm mb-4">
        <Card.Header className="bg-primary text-white">
          <div className="d-flex justify-content-between align-items-center">
            <h3 className="mb-0">{customer.name}'s Profile</h3>
            <div>
              <Badge bg="light" text="dark" className="me-2">
                ID: {customer.id || 'N/A'}
              </Badge>
              <Badge bg="light" text="primary">
                Firebase ID: {customer.firebaseId.substring(0, 8)}...
              </Badge>
            </div>
          </div>
        </Card.Header>
        
        <Card.Body>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <strong>Name:</strong> {customer.name}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Organization:</strong> {customer.organization || 'N/A'}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Phone:</strong> {customer.phone}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Current Balance:</strong> {formatCurrency(customer.currentBalance)}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Current Gas On Hand:</strong> {customer.currentGasOnHand || 0}
            </ListGroup.Item>
          </ListGroup>
        </Card.Body>
        
        <Card.Footer className="bg-light">
          <div className="d-flex justify-content-end gap-2">
            <Button 
              variant="primary"
              onClick={() => navigate(`/customer/${customer.firebaseId}/edit`)}
            >
              Edit Profile
            </Button>
            <Button 
              variant="success"
              onClick={() => navigate(`/sales/new?customerId=${customer.id}`)}
            >
              New Sale
            </Button>
          </div>
        </Card.Footer>
      </Card>

      {/* Sales History Section */}
      <Card className="shadow-sm">
        <Card.Header className="bg-secondary text-white">
          <h4 className="mb-0">Sales History</h4>
        </Card.Header>
        <Card.Body>
          {salesLoading ? (
            <div className="d-flex justify-content-center">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : sales.length === 0 ? (
            <Alert variant="info">No sales found for this customer</Alert>
          ) : (
            <div className="table-responsive">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Sale ID</th>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Amount</th>
                    <th>Received</th>
                    <th>Balance</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.map((sale) => (
                    <tr key={sale.firebaseId}>
                      <td>{format(sale.date, 'dd MMM yyyy')}</td>
                      <td>{sale.id}</td>
                      <td>{sale.productName}</td>
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
                          onClick={() => handleViewSale(sale.firebaseId)}
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CustomerProfile;