import React, { useState, useEffect } from "react";
import axios from "axios";
import { Oval } from "react-loader-spinner";
import { Pie, Line, Bar, Doughnut } from "react-chartjs-2";
import "chart.js/auto";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const paginatedData = (data && data.userActivity) 
  

  ? data.userActivity.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage) 
  : []; // Ensure it doesn't throw an error if data or userActivity is undefined.

const totalPages = (data && data.userActivity)
  ? Math.ceil(data.userActivity.length / itemsPerPage)
  : 1; // Default to 1 if userActivity is undefined.

const filteredData = (data && data.userActivity)
  ? data.userActivity.filter((activity) =>
      activity.user.toLowerCase().includes(search.toLowerCase())
    )
  : []; // Handle undefined userActivity during filtering.
  const [orderId, setOrderId] = useState('');
  const [orderData, setOrderData] = useState(null);

  const [trips, setTrips] = useState([]);
  const [tripLoading, setTripLoading] = useState(true);
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await axios.get(
          "https://server1.pearl-developer.com/abhivriti/public/api/app/admin/all-trips"
        );
        setTrips(response.data.trips || []);

        console.log("Fetched trips:", response.data.trips);

      } catch (err) {
        console.error("Error fetching trips:", err);
      } finally {
        setTripLoading(false);
      }
    };
  
    fetchTrips();
  }, []);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://server1.pearl-developer.com/abhivriti/public/api/admin/dashboard"
        );
        setData(response.data.data);
      } catch (error) {
        setError("Error fetching data.");
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Oval color="#4A90E2" height={50} width={50} />
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!data) {
    return <div className="text-center">No dashboard data available.</div>;
  }


  const revenueGraphData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Monthly Revenue (₹)",
        data: [12000, 15000, 18000, 20000, 25000, 30000],
        borderColor: "#4CAF50",
        backgroundColor: "rgba(76, 175, 80, 0.3)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const salesComparisonData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Online Sales",
        data: [500, 700, 900, 1100, 1300, 1500],
        backgroundColor: "#03A9F4",
      },
      {
        label: "Offline Sales",
        data: [300, 500, 800, 1000, 1200, 1400],
        backgroundColor: "#FF5722",
      },
    ],
  };

    // Chart Data
    const pieData = {
      labels: ["Customers", "Delivery Partners", "Users"],
      datasets: [
        {
          data: [data.total_customers, data.total_delivery_partners, data.total_users],
          backgroundColor: ["#4CAF50", "#FF9800", "#2196F3"],
        },
      ],
    };
  





  const handleSearch = async () => {
    if (!orderId.trim()) {
      setError('Please enter an order ID');
      return;
    }

    try {
      const res = await axios.get(`https://server1.pearl-developer.com/abhivriti/public/api/app/shipping/${orderId}`);
      if (res.data.success && res.data.orderData) {
        setOrderData(res.data.orderData);
        setError('');
      } else {
        setOrderData(null);
        setError('No data found');
      }
    } catch (err) {
      console.error(err);
      setOrderData(null);
      setError('Error fetching order');
    }
  };



  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
  <div className="p-4 bg-blue-600 text-white rounded-lg shadow-md">
    <h3 className="text-lg">Total Users</h3>
    <p className="text-2xl font-bold">{data.total_users}</p>
  </div>
  <div className="p-4 bg-green-600 text-white rounded-lg shadow-md">
    <h3 className="text-lg">Total Customers</h3>
    <p className="text-2xl font-bold">{data.total_customers}</p>
  </div>
  <div className="p-4 bg-yellow-500 text-white rounded-lg shadow-md">
    <h3 className="text-lg">Delivery Partners</h3>
    <p className="text-2xl font-bold">{data.total_delivery_partners}</p>
  </div>

  <div className="p-4 bg-yellow-500 text-white rounded-lg shadow-md">
    <h3 className="text-lg">Orders</h3>
    <p className="text-2xl font-bold">{data.total_delivery_partners}</p>
  </div>
</div>


      {/* Interactive Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 shadow-md rounded-lg">
          <h2 className="text-lg font-bold mb-2">User Distribution</h2>
          <Pie data={pieData} />
        </div>
        <div className="bg-white p-4 shadow-md rounded-lg">
          <h2 className="text-lg font-bold mb-2">Revenue Trends</h2>
          <Line data={revenueGraphData} options={{ responsive: true }} />
        </div>
        <div className="bg-white p-4 shadow-md rounded-lg">
          <h2 className="text-lg font-bold mb-2">Sales Comparison</h2>
          <Bar data={salesComparisonData} options={{ responsive: true }} />
        </div>
      </div>

      <h2 className="text-2xl font-bold my-6">All Trips</h2>
<div className="overflow-x-auto">
  <table className="min-w-full bg-white border shadow-md rounded-lg">
    <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
      <tr>
        <th className="py-3 px-6 text-left">Order ID</th>
        <th className="py-3 px-6 text-left">Name</th>
        <th className="py-3 px-6 text-left">Start</th>
        <th className="py-3 px-6 text-left">End</th>
        <th className="py-3 px-6 text-left">Type</th>
        <th className="py-3 px-6 text-left">Weight</th>
        <th className="py-3 px-6 text-left">Driver</th>
        <th className="py-3 px-6 text-left">Price</th>
        <th className="py-3 px-6 text-left">Status</th>
        <th className="py-3 px-6 text-left">Ended At</th>
      </tr>
    </thead>
    <tbody className="text-gray-700 text-sm font-light">
      {tripLoading ? (
        <tr>
          <td className="py-3 px-6" colSpan="10">Loading...</td>
        </tr>
      ) : (
        trips.map((trip) => (
          <tr key={trip.id} className="border-b border-gray-200 hover:bg-gray-100">
            <td className="py-3 px-6">{trip.order_id}</td>
            <td className="py-3 px-6">{trip.name}</td>
            <td className="py-3 px-6">{trip.start_location}</td>
            <td className="py-3 px-6">{trip.end_location}</td>
            <td className="py-3 px-6">{trip.type}</td>
            <td className="py-3 px-6">{trip.weight}</td>
            <td className="py-3 px-6">{trip.driver_name}</td>
            <td className="py-3 px-6">₹{trip.price}</td>
            <td className="py-3 px-6">{trip.trip_status}</td>
            <td className="py-3 px-6">{trip.ended_at}</td>
          </tr>
        ))
      )}
    </tbody>
  </table>
</div>

<div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h2>Search Shipping Order</h2>
      <div style={{ marginBottom: '10px' }}>
        <input
          type="text"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          placeholder="Enter Order ID (e.g. XO100002)"
          style={{ padding: '8px', width: '70%', marginRight: '10px' }}
        />
        <button onClick={handleSearch} style={{ padding: '8px 16px' }}>Search</button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {orderData && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={thStyle}>Field</th>
              <th style={thStyle}>Value</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(orderData).map(([key, value]) => (
              <tr key={key}>
                <td style={tdStyle}>{key}</td>
                <td style={tdStyle}>{value !== null ? value : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>





    </div>
  );
};

const thStyle = {
  border: '1px solid #ccc',
  padding: '8px',
  backgroundColor: '#f2f2f2',
  textAlign: 'left',
};

const tdStyle = {
  border: '1px solid #ccc',
  padding: '8px',
};

export default Dashboard;