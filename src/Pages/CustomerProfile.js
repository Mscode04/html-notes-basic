import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { db } from "../Firebase/config";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { 
  Typography, 
  Paper, 
  Box, 
  Button, 
  CircularProgress, 
  Table,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip
} from "@mui/material";
import { format } from 'date-fns';

const CustomerProfile = () => {
  const { id, routeName } = useParams();
  const [customer, setCustomer] = useState(null);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        // Fetch customer
        const customerDoc = await getDoc(doc(db, "customers", id));
        if (!customerDoc.exists()) {
          throw new Error("Customer not found");
        }
        setCustomer({ id: customerDoc.id, ...customerDoc.data() });
        
        // Fetch sales
        const salesQuery = query(
          collection(db, "sales"),
          where("customerId", "==", customerDoc.data().id),
          where("route", "==", routeName)
        );
        const salesSnapshot = await getDocs(salesQuery);
        const salesData = salesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setSales(salesData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCustomerData();
  }, [id, routeName]);

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
    <Box>
      <Button 
        component={Link}
        to={`/customers/${routeName}`}
        variant="outlined"
        sx={{ mb: 2 }}
      >
        Back to Customers
      </Button>
      
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          {customer.name}'s Profile
        </Typography>
        
        <List>
          <ListItem>
            <ListItemText primary="Phone" secondary={customer.phone} />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText primary="Address" secondary={customer.address} />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText 
              primary="Current Balance" 
              secondary={`₹${customer.currentBalance?.toLocaleString() || '0'}`} 
            />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText 
              primary="Gas On Hand" 
              secondary={customer.currentGasOnHand || '0'} 
            />
          </ListItem>
        </List>
        
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button 
            variant="contained"
            component={Link}
            to={`/customer/edit/${customer.id}/${routeName}`}
          >
            Edit Profile
          </Button>
          <Button 
            variant="contained"
            color="success"
            component={Link}
            to={`/sales/new/${routeName}?customerId=${customer.id}`}
          >
            New Sale
          </Button>
        </Box>
      </Paper>
      
      <Typography variant="h5" gutterBottom>
        Sales History
      </Typography>
      
      <Table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Sale ID</th>
            <th>Product</th>
            <th>Quantity</th>
            <th>Amount</th>
            <th>Received</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>
          {sales.map(sale => (
            <tr key={sale.id}>
              <td>{format(sale.timestamp?.toDate(), 'dd MMM yyyy')}</td>
              <td>{sale.id}</td>
              <td>{sale.productName}</td>
              <td>{sale.salesQuantity}</td>
              <td>₹{sale.todayCredit?.toLocaleString()}</td>
              <td>₹{sale.totalAmountReceived?.toLocaleString()}</td>
              <td>
                <Chip 
                  label={`₹${sale.totalBalance?.toLocaleString()}`}
                  color={sale.totalBalance > 0 ? 'error' : 'success'}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Box>
  );
};

export default CustomerProfile;