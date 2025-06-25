import React, { useState, useEffect } from "react";
import { db } from "../Firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Card, Button, Spinner, Alert, Badge, Row, Col } from "react-bootstrap";
import { format } from 'date-fns';

const SaleDetail = () => {
  const { id } = useParams(); // This should be the Firestore document ID
  const [sale, setSale] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSale = async () => {
      try {
        if (!id) {
          throw new Error("No sale ID provided");
        }

        const docRef = doc(db, "sales", id);
        const docSnap = await getDoc(docRef);
        
        if (!docSnap.exists()) {
          throw new Error("Sale document not found");
        }

        const saleData = docSnap.data();
        // Ensure we have all required fields
        if (!saleData.id || !saleData.customerName || !saleData.productName) {
          console.warn("Sale document is missing required fields:", saleData);
        }

        setSale({
          firebaseId: docSnap.id, // Store Firestore document ID
          ...saleData,
          date: saleData.timestamp?.toDate() || new Date(saleData.date || new Date())
        });
      } catch (err) {
        console.error("Error fetching sale:", err);
        setError(err.message || "Failed to load sale details");
      } finally {
        setLoading(false);
      }
    };

    fetchSale();
  }, [id]);

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
        <Alert variant="danger">
          <Alert.Heading>Error Loading Sale</Alert.Heading>
          <p>{error}</p>
          <div className="d-flex justify-content-end">
            <Button variant="outline-danger" onClick={() => navigate('/sales')}>
              Back to Sales List
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  if (!sale) {
    return (
      <Container className="mt-4">
        <Alert variant="warning">
          <Alert.Heading>Sale Not Found</Alert.Heading>
          <p>The requested sale could not be found in our records.</p>
          <div className="d-flex justify-content-end">
            <Button variant="outline-secondary" onClick={() => navigate('/sales')}>
              Back to Sales List
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Button 
        variant="outline-secondary" 
        onClick={() => navigate('/sales')} 
        className="mb-3"
      >
        &larr; Back to All Sales
      </Button>

      <Card className="shadow-sm mb-4">
        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
          <h4 className="mb-0">Sale Receipt</h4>
          <Badge bg="light" text="dark">
            {format(sale.date, 'dd MMM yyyy')}
          </Badge>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <h5>Sale Information</h5>
              <hr />
              <p><strong>Sale ID:</strong> {sale.id || 'N/A'}</p>
              <p><strong>Document ID:</strong> <small>{sale.firebaseId}</small></p>
              <p><strong>Product:</strong> {sale.productName || 'N/A'} ({formatCurrency(sale.productPrice)})</p>
              <p><strong>Quantity:</strong> {sale.salesQuantity || 0}</p>
              <p><strong>Empty Cylinders:</strong> {sale.emptyQuantity || 0}</p>
            </Col>
            <Col md={6}>
              <h5>Customer Information</h5>
              <hr />
              <p><strong>Name:</strong> {sale.customerName || 'N/A'}</p>
              <p><strong>Phone:</strong> {sale.customerPhone || 'N/A'}</p>
              <p><strong>Address:</strong> {sale.customerAddress || 'N/A'}</p>
            </Col>
          </Row>

          <Row className="mt-4">
            <Col md={6}>
              <h5>Transaction Details</h5>
              <hr />
              <p><strong>Total Amount:</strong> {formatCurrency(sale.todayCredit)}</p>
              <p><strong>Amount Paid:</strong> {formatCurrency(sale.totalAmountReceived)}</p>
            </Col>
            <Col md={6}>
              <h5>Balance Information</h5>
              <hr />
              <p><strong>Previous Balance:</strong> {formatCurrency(sale.previousBalance)}</p>
              <p>
                <strong>Current Balance:</strong>
                <Badge bg={sale.totalBalance > 0 ? 'danger' : 'success'} className="ms-2">
                  {formatCurrency(sale.totalBalance)}
                </Badge>
              </p>
            </Col>
          </Row>
        </Card.Body>
        <Card.Footer className="d-flex justify-content-end">
          <Button variant="primary" onClick={() => window.print()}>
            Print Receipt
          </Button>
        </Card.Footer>
      </Card>
    </Container>
  );
};

export default SaleDetail;