import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs, query, where, updateDoc } from "firebase/firestore";
import { db } from "../Firebase/config";
import Select from 'react-select';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Sales = () => {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [formData, setFormData] = useState({
    id: `TBG${new Date().toISOString().replace(/[-:T.]/g, "").slice(0, 14)}`,
    customerId: "",
    customerData: null,
    productId: "",
    productData: null,
    routeId: "",
    routeData: null,
    salesQuantity: 0,
    emptyQuantity: 0,
    todayCredit: 0,
    totalAmountReceived: 0,
    totalBalance: 0,
    previousBalance: 0,
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch customers
        const customersSnapshot = await getDocs(collection(db, "customers"));
        const customersData = customersSnapshot.docs.map(doc => ({
          docId: doc.id,
          ...doc.data()
        }));
        setCustomers(customersData);
        
        // Fetch products
        const productsSnapshot = await getDocs(collection(db, "products"));
        const productsData = productsSnapshot.docs.map(doc => ({
          docId: doc.id,
          ...doc.data()
        }));
        setProducts(productsData);
        
        // Fetch routes
        const routesSnapshot = await getDocs(collection(db, "routes"));
        const routesData = routesSnapshot.docs.map(doc => ({
          docId: doc.id,
          ...doc.data()
        }));
        setRoutes(routesData);
      } catch (error) {
        toast.error(`Error fetching data: ${error.message}`);
      }
    };
    
    fetchData();
  }, []);

  useEffect(() => {
    if (formData.customerId) {
      const customer = customers.find(c => c.id === formData.customerId);
      if (customer) {
        setSelectedCustomer(customer);
        setFormData(prev => ({
          ...prev,
          customerData: customer,
          previousBalance: customer.currentBalance || 0,
          totalBalance: (customer.currentBalance || 0) + prev.todayCredit - prev.totalAmountReceived
        }));
      }
    }
  }, [formData.customerId, customers]);

  useEffect(() => {
    if (formData.productId) {
      const product = products.find(p => p.id === formData.productId);
      if (product) {
        setSelectedProduct(product);
        setFormData(prev => ({
          ...prev,
          productData: product
        }));
      }
    }
  }, [formData.productId, products]);

  useEffect(() => {
    if (formData.routeId) {
      const route = routes.find(r => r.id === formData.routeId);
      if (route) {
        setSelectedRoute(route);
        setFormData(prev => ({
          ...prev,
          routeData: route
        }));
      }
    }
  }, [formData.routeId, routes]);

  useEffect(() => {
    if (selectedProduct && formData.salesQuantity) {
      const todayCredit = selectedProduct.price * formData.salesQuantity;
      const totalBalance = (formData.previousBalance || 0) + todayCredit - formData.totalAmountReceived;
      
      setFormData(prev => ({
        ...prev,
        todayCredit,
        totalBalance
      }));
    }
  }, [selectedProduct, formData.salesQuantity, formData.totalAmountReceived, formData.previousBalance]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === "salesQuantity" || name === "emptyQuantity" || name === "totalAmountReceived" 
        ? parseInt(value) || 0 
        : value 
    }));
  };

  const handleCustomerChange = (selectedOption) => {
    setFormData(prev => ({
      ...prev,
      customerId: selectedOption ? selectedOption.value : "",
      customerData: selectedOption ? selectedOption.data : null
    }));
  };

  const handleProductChange = (selectedOption) => {
    setFormData(prev => ({
      ...prev,
      productId: selectedOption ? selectedOption.value : "",
      productData: selectedOption ? selectedOption.data : null
    }));
  };

  const handleRouteChange = (selectedOption) => {
    setFormData(prev => ({
      ...prev,
      routeId: selectedOption ? selectedOption.value : "",
      routeData: selectedOption ? selectedOption.data : null
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedCustomer) {
      toast.error("Please select a customer");
      return;
    }

    if (!selectedRoute) {
      toast.error("Please select a route");
      return;
    }

    if (formData.emptyQuantity > selectedCustomer.currentGasOnHand) {
      toast.error(`Empty quantity (${formData.emptyQuantity}) cannot be more than current gas on hand (${selectedCustomer.currentGasOnHand})`);
      return;
    }

    try {
      // Prepare complete sale data with only essential route information
      const saleData = {
        ...formData,
        customerName: selectedCustomer.name,
        customerPhone: selectedCustomer.phone,
        customerAddress: selectedCustomer.address,
        productName: selectedProduct.name,
        productPrice: selectedProduct.price,
        routeId: selectedRoute.id,
        routeName: selectedRoute.name,
        timestamp: new Date()
      };

      // Remove the routeData object if it exists
      delete saleData.routeData;

      // Add sale to sales collection
      await addDoc(collection(db, "sales"), saleData);
      
      // Update customer document
      const customerDoc = customers.find(c => c.id === formData.customerId);
      if (customerDoc) {
        const customerQuery = query(
          collection(db, "customers"),
          where("id", "==", formData.customerId)
        );
        
        const querySnapshot = await getDocs(customerQuery);
        if (!querySnapshot.empty) {
          const customerDocRef = querySnapshot.docs[0].ref;
          await updateDoc(customerDocRef, {
            currentBalance: formData.totalBalance,
            currentGasOnHand: (selectedCustomer.currentGasOnHand || 0) - formData.emptyQuantity + formData.salesQuantity
          });
        }
      }
      
      toast.success("Sale recorded successfully!");
      // Reset form
      setFormData({
        id: `TBG${new Date().toISOString().replace(/[-:T.]/g, "").slice(0, 14)}`,
        customerId: "",
        customerData: null,
        productId: "",
        productData: null,
        routeId: "",
        routeData: null,
        salesQuantity: 0,
        emptyQuantity: 0,
        todayCredit: 0,
        totalAmountReceived: 0,
        totalBalance: 0,
        previousBalance: 0,
        date: new Date().toISOString().split('T')[0]
      });
      setSelectedProduct(null);
      setSelectedCustomer(null);
      setSelectedRoute(null);
    } catch (error) {
      console.error("Error adding document: ", error);
      toast.error("Error recording sale: " + error.message);
    }
  };

  // Prepare options for select components
  const customerOptions = customers.map(customer => ({
    value: customer.id,
    label: `${customer.name} (${customer.phone}) - Balance: ₹${customer.currentBalance || 0}`,
    data: customer
  }));

  const productOptions = products.map(product => ({
    value: product.id,
    label: `${product.name} (₹${product.price})`,
    data: product
  }));

  const routeOptions = routes.map(route => ({
    value: route.id,
    label: route.name,
    data: route
  }));

  return (
    <div className="form-container">
      <h2>New Sales</h2>
      <ToastContainer position="top-right" autoClose={5000} />
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Sale ID:</label>
          <input
            type="text"
            name="id"
            value={formData.id}
            readOnly
          />
        </div>
        
        <div className="form-group">
          <label>Date:</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Route:</label>
          <Select
            options={routeOptions}
            value={routeOptions.find(option => option.value === formData.routeId)}
            onChange={handleRouteChange}
            placeholder="Select Route"
            isSearchable
            required
          />
        </div>
        
        <div className="form-group">
          <label>Customer:</label>
          <Select
            options={customerOptions}
            value={customerOptions.find(option => option.value === formData.customerId)}
            onChange={handleCustomerChange}
            placeholder="Select Customer"
            isSearchable
            required
          />
        </div>
        
        {selectedCustomer && (
          <div className="customer-details">
            <p><strong>Current Balance:</strong> ₹{selectedCustomer.currentBalance || 0}</p>
            <p><strong>Gas On Hand:</strong> {selectedCustomer.currentGasOnHand || 0}</p>
          </div>
        )}
        
        <div className="form-group">
          <label>Product:</label>
          <Select
            options={productOptions}
            value={productOptions.find(option => option.value === formData.productId)}
            onChange={handleProductChange}
            placeholder="Select Product"
            isSearchable
            required
          />
        </div>
        
        {selectedProduct && (
          <>
            <div className="form-group">
              <label>Product Price:</label>
              <input
                type="number"
                value={selectedProduct.price}
                readOnly
              />
            </div>
            
            <div className="form-group">
              <label>Sales Quantity:</label>
              <input
                type="number"
                name="salesQuantity"
                value={formData.salesQuantity}
                onChange={handleChange}
                required
                min="1"
              />
            </div>
            
            <div className="form-group">
              <label>Empty Quantity (Current on hand: {selectedCustomer?.currentGasOnHand || 0}):</label>
              <input
                type="number"
                name="emptyQuantity"
                value={formData.emptyQuantity}
                onChange={handleChange}
                required
                min="0"
                max={selectedCustomer?.currentGasOnHand || 0}
              />
            </div>
            
            <div className="form-group">
              <label>Today Credit:</label>
              <input
                type="number"
                name="todayCredit"
                value={formData.todayCredit}
                readOnly
              />
            </div>
            
            <div className="form-group">
              <label>Previous Balance:</label>
              <input
                type="number"
                name="previousBalance"
                value={formData.previousBalance}
                readOnly
              />
            </div>
            
            <div className="form-group">
              <label>Total Amount Received:</label>
              <input
                type="number"
                name="totalAmountReceived"
                value={formData.totalAmountReceived}
                onChange={handleChange}
                required
                min="0"
              />
            </div>
            
            <div className="form-group">
              <label>Total Balance:</label>
              <input
                type="number"
                name="totalBalance"
                value={formData.totalBalance}
                readOnly
              />
            </div>
            
            <div className="form-group">
              <label>New Gas On Hand After Sale:</label>
              <input
                type="number"
                value={
                  selectedCustomer 
                    ? (selectedCustomer.currentGasOnHand || 0) - formData.emptyQuantity + formData.salesQuantity
                    : 0
                }
                readOnly
              />
            </div>
          </>
        )}
        
        <button type="submit" className="submit-btn">Save</button>
      </form>
    </div>
  );
};

export default Sales;