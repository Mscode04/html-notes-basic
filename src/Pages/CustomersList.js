import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../Firebase/config";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Table, Typography, Button, Box, CircularProgress, Paper } from "@mui/material";
import { Link } from "react-router-dom";

const CustomersList = () => {
  const { routeName } = useParams();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const customersRef = collection(db, "customers");
        const q = query(customersRef, where("route", "==", routeName));
        const querySnapshot = await getDocs(q);
        
        const customersData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setCustomers(customersData);
      } catch (err) {
        console.error("Error fetching customers:", err);
        setError("Failed to load customers");
      } finally {
        setLoading(false);
      }
    };
    
    fetchCustomers();
  }, [routeName]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Paper elevation={3} sx={{ p: 2, backgroundColor: 'error.light', color: 'white' }}>
        {error}
      </Paper>
    );
  }

  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Customers for {routeName}</Typography>
        <Button 
          variant="contained" 
          component={Link} 
          to={`/customers/new/${routeName}`}
        >
          Add New Customer
        </Button>
      </Box>
      
      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Balance</th>
            <th>Gas On Hand</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map(customer => (
            <tr key={customer.id}>
              <td>{customer.name}</td>
              <td>{customer.phone}</td>
              <td>{customer.address}</td>
              <td>₹{customer.currentBalance?.toLocaleString() || '0'}</td>
              <td>{customer.currentGasOnHand || '0'}</td>
              <td>
                <Button 
                  component={Link} 
                  to={`/customer/${customer.id}/${routeName}`}
                  variant="outlined"
                >
                  View
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default CustomersList;