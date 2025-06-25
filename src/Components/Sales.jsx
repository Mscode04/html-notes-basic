import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs, query, where, updateDoc } from "firebase/firestore";
import { db } from "../Firebase/config";

const Sales = () => {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [formData, setFormData] = useState({
    id: `TBG${new Date().toISOString().replace(/[-:T.]/g, "").slice(0, 14)}`,
    customerId: "", // Changed from customer to customerId for clarity
    customerData: null,
    productId: "", // Changed from product to productId for clarity
    productData: null,
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
      // Fetch customers
      const customersSnapshot = await getDocs(collection(db, "customers"));
      const customersData = customersSnapshot.docs.map(doc => ({
        docId: doc.id, // Store the document ID
        ...doc.data()
      }));
      setCustomers(customersData);
      
      // Fetch products
      const productsSnapshot = await getDocs(collection(db, "products"));
      const productsData = productsSnapshot.docs.map(doc => ({
        docId: doc.id, // Store the document ID
        ...doc.data()
      }));
      setProducts(productsData);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedCustomer) {
      alert("Please select a customer");
      return;
    }

    if (formData.emptyQuantity > selectedCustomer.currentGasOnHand) {
      alert(`Error: Empty quantity (${formData.emptyQuantity}) cannot be more than current gas on hand (${selectedCustomer.currentGasOnHand})`);
      return;
    }

    try {
      // Prepare complete sale data
      const saleData = {
        ...formData,
        customerName: selectedCustomer.name,
        customerPhone: selectedCustomer.phone,
        customerAddress: selectedCustomer.address,
        productName: selectedProduct.name,
        productPrice: selectedProduct.price,
        timestamp: new Date()
      };

      // Add sale to sales collection
      await addDoc(collection(db, "sales"), saleData);
      
      // Find the customer document to update
      const customerDoc = customers.find(c => c.id === formData.customerId);
      if (customerDoc) {
        // Get reference to the customer document using its document ID
        const customerQuery = query(
          collection(db, "customers"),
          where("id", "==", formData.customerId)
        );
        
        const querySnapshot = await getDocs(customerQuery);
        if (!querySnapshot.empty) {
          // Update the first matching document (assuming customer IDs are unique)
          const customerDocRef = querySnapshot.docs[0].ref;
          await updateDoc(customerDocRef, {
            currentBalance: formData.totalBalance,
            currentGasOnHand: (selectedCustomer.currentGasOnHand || 0) - formData.emptyQuantity + formData.salesQuantity
          });
        } else {
          throw new Error("Customer document not found");
        }
      }
      
      alert("Sale recorded successfully!");
      // Reset form
      setFormData({
        id: `TBG${new Date().toISOString().replace(/[-:T.]/g, "").slice(0, 14)}`,
        customerId: "",
        customerData: null,
        productId: "",
        productData: null,
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
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Error recording sale: " + error.message);
    }
  };

  return (
    <div className="form-container">
      <h2>New Sales</h2>
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
          <label>Customer:</label>
          <select
            name="customerId"
            value={formData.customerId}
            onChange={handleChange}
            required
          >
            <option value="">Select Customer</option>
            {customers.map(customer => (
              <option key={customer.id} value={customer.id}>
                {customer.name} ({customer.phone}) - Balance: ₹{customer.currentBalance || 0}
              </option>
            ))}
          </select>
        </div>
        
        {selectedCustomer && (
          <div className="customer-details">
            <p><strong>Current Balance:</strong> ₹{selectedCustomer.currentBalance || 0}</p>
            <p><strong>Gas On Hand:</strong> {selectedCustomer.currentGasOnHand || 0}</p>
          </div>
        )}
        
        <div className="form-group">
          <label>Product:</label>
          <select
            name="productId"
            value={formData.productId}
            onChange={handleChange}
            required
          >
            <option value="">Select Product</option>
            {products.map(product => (
              <option key={product.id} value={product.id}>
                {product.name} (₹{product.price})
              </option>
            ))}
          </select>
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
        
        <button type="submit" className="submit-btn">Record Sale</button>
      </form>
    </div>
  );
};

export default Sales;