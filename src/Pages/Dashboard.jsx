import React, { useState, useEffect } from "react";
import { db } from "../Firebase/config";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line 
} from 'recharts';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Dashboard.css";
import { Box } from '@mui/material';

const Dashboard = () => {
  const [salesData, setSalesData] = useState([]);
  const [customersData, setCustomersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState("All");
  const [timePeriod, setTimePeriod] = useState("today");
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch sales data
        const salesQuery = query(collection(db, "sales"), orderBy("timestamp", "desc"));
        const salesSnapshot = await getDocs(salesQuery);
        const salesData = salesSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            date: data.timestamp?.toDate(),
            route: data.route || 'Unknown' // Default to 'Unknown' if route doesn't exist
          };
        });
        setSalesData(salesData);

        // Fetch customers data
        const customersQuery = query(collection(db, "customers"));
        const customersSnapshot = await getDocs(customersQuery);
        const customersData = customersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCustomersData(customersData);

        // Extract unique routes
        const routeSet = new Set();
        salesData.forEach(sale => {
          if (sale.route) {
            routeSet.add(sale.route);
          }
        });
        const uniqueRoutes = Array.from(routeSet).filter(route => route && route.trim() !== '');
        setRoutes(["All", ...uniqueRoutes]);

        console.log("Routes found:", uniqueRoutes); // Debug log
        console.log("Sales data sample:", salesData.slice(0, 3)); // Debug log

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter data based on selected filters
  const filteredData = salesData.filter(sale => {
    // Filter by time period
    if (timePeriod !== "All") {
      const today = new Date();
      const saleDate = sale.date ? new Date(sale.date) : null;
      
      if (!saleDate) return false;
      
      if (timePeriod === "today") {
        return (
          saleDate.getDate() === today.getDate() &&
          saleDate.getMonth() === today.getMonth() &&
          saleDate.getFullYear() === today.getFullYear()
        );
      } else if (timePeriod === "lastWeek") {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        return saleDate >= oneWeekAgo && saleDate <= today;
      } else if (timePeriod === "lastMonth") {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        return saleDate >= oneMonthAgo && saleDate <= today;
      } else if (timePeriod === "lastYear") {
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        return saleDate >= oneYearAgo && saleDate <= today;
      } else if (timePeriod === "custom") {
        if (startDate && endDate) {
          return saleDate >= startDate && saleDate <= endDate;
        }
      }
    }

    // Filter by route
    if (selectedRoute !== "All" && sale.route !== selectedRoute) return false;

    return true;
  });

  // Calculate summary statistics
  const totalSalesAmount = filteredData.reduce((sum, sale) => sum + (sale.todayCredit || 0), 0);
  const totalSalesQuantity = filteredData.reduce((sum, sale) => sum + (sale.salesQuantity || 0), 0);
  const totalEmptyQuantity = filteredData.reduce((sum, sale) => sum + (sale.emptyQuantity || 0), 0);
  const totalGasQuantity = customersData.reduce((sum, customer) => sum + (customer.currentGasOnHand || 0), 0);
  const totalBalance = customersData.reduce((sum, customer) => sum + (customer.currentBalance || 0), 0);
  const totalAmountReceived = filteredData.reduce((sum, sale) => sum + (sale.totalAmountReceived || 0), 0);

  // Prepare data for Sales by Route chart
  const salesByRoute = routes
    .filter(r => r !== "All" && r !== "Unknown")
    .map(route => {
      const routeSales = filteredData.filter(sale => sale.route === route);
      return {
        name: route,
        sales: routeSales.reduce((sum, sale) => sum + (sale.todayCredit || 0), 0),
        amountReceived: routeSales.reduce((sum, sale) => sum + (sale.totalAmountReceived || 0), 0),
        count: routeSales.length
      };
    });

  console.log("Sales by route data:", salesByRoute); // Debug log

  // Prepare data for Sales vs Amount Received chart
  const salesVsReceived = filteredData
    .sort((a, b) => (a.date || 0) - (b.date || 0))
    .map(sale => ({
      date: sale.date?.toLocaleDateString() || 'No Date',
      sales: sale.todayCredit || 0,
      amountReceived: sale.totalAmountReceived || 0
    }));

if (loading) {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
      <img
        src="https://cdn.pixabay.com/animation/2023/10/08/03/19/03-19-26-213_512.gif"
        alt="Loading..."
        style={{ width: '150px', height: '150px' }}
      />
    </Box>
  );
}

  return (
    <div className="dashboard-container">
      {/* Filters Section at the Top */}
      <section className="filters-section">
        <div className="filter-group">
          <label>Time Period:</label>
          <select 
            value={timePeriod} 
            onChange={(e) => {
              setTimePeriod(e.target.value);
              if (e.target.value !== "custom") {
                setStartDate(null);
                setEndDate(null);
              }
            }}
          >
            <option value="today">Today</option>
            <option value="lastWeek">Last Week</option>
            <option value="lastMonth">Last Month</option>
            <option value="lastYear">Last Year</option>
            <option value="custom">Custom Range</option>
            <option value="All">All Time</option>
          </select>
        </div>

        {timePeriod === "custom" && (
          <>
            <div className="filter-group">
              <label>Start Date:</label>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                isClearable
                placeholderText="Select start date"
              />
            </div>
            <div className="filter-group">
              <label>End Date:</label>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                isClearable
                placeholderText="Select end date"
              />
            </div>
          </>
        )}

        {/* <div className="filter-group">
          <label>Route:</label>
          <select 
            value={selectedRoute} 
            onChange={(e) => setSelectedRoute(e.target.value)}
          >
            {routes.map(route => (
              <option key={route} value={route}>{route}</option>
            ))}
          </select>
        </div> */}
      </section>

      {/* Charts Section */}
      <section className="charts-section">
        <div className="chart-container">
          <h3>Sales by Route</h3>
          {salesByRoute.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesByRoute}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'sales' ? `₹${value.toLocaleString('en-IN')}` : `₹${value.toLocaleString('en-IN')}`,
                    name === 'sales' ? 'Sales Amount' : 'Amount Received'
                  ]}
                />
                <Legend />
                <Bar dataKey="sales" fill="#8884d8" name="Sales Amount" />
                <Bar dataKey="amountReceived" fill="#82ca9d" name="Amount Received" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p>No sales data available for the selected routes/filters</p>
          )}
        </div>

        <div className="chart-container">
          <h3>Sales vs Amount Received Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesVsReceived}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  `₹${value.toLocaleString('en-IN')}`,
                  name === 'sales' ? 'Sales Amount' : 'Amount Received'
                ]}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="sales" 
                stroke="#8884d8" 
                name="Sales Amount" 
                activeDot={{ r: 8 }} 
              />
              <Line 
                type="monotone" 
                dataKey="amountReceived" 
                stroke="#82ca9d" 
                name="Amount Received" 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Summary Cards Section at the Bottom */}
      <section className="summary-section">
        <div className="summary-card">
          <h3>Total Sales Amount</h3>
          <p>₹{totalSalesAmount.toLocaleString('en-IN')}</p>
        </div>
        <div className="summary-card">
          <h3>Total Sales Quantity</h3>
          <p>{totalSalesQuantity}</p>
        </div>
        <div className="summary-card">
          <h3>Total Empty Cylinders</h3>
          <p>{totalEmptyQuantity}</p>
        </div>
        <div className="summary-card">
          <h3>Total Gas On Hand</h3>
          <p>{totalGasQuantity}</p>
        </div>
        <div className="summary-card">
          <h3>Total Balance Due</h3>
          <p>₹{totalBalance.toLocaleString('en-IN')}</p>
        </div>
        <div className="summary-card">
          <h3>Total Amount Received</h3>
          <p>₹{totalAmountReceived.toLocaleString('en-IN')}</p>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;