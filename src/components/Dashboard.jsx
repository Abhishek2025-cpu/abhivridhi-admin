import React, { useState, useEffect } from "react";
import axios from "axios";
import { Oval } from "react-loader-spinner";
import { Pie, Line, Bar } from "react-chartjs-2";
import "chart.js/auto";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderId, setOrderId] = useState("");
  const [orderData, setOrderData] = useState(null);
  const [trips, setTrips] = useState([]);
  const [tripLoading, setTripLoading] = useState(true);

  // Fetch trips
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await axios.get(
          "https://server1.pearl-developer.com/abhivriti/public/api/app/admin/all-trips"
        );
        setTrips(response.data.trips || []);
      } catch (err) {
        console.error("Error fetching trips:", err);
      } finally {
        setTripLoading(false);
      }
    };
    fetchTrips();
  }, []);

  // Fetch dashboard data
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

  const handleSearch = async () => {
    if (!orderId.trim()) {
      setError("Please enter an order ID");
      return;
    }
    try {
      const res = await axios.get(
        `https://server1.pearl-developer.com/abhivriti/public/api/app/shipping/${orderId}`
      );
      if (res.data.success && res.data.orderData) {
        setOrderData(res.data.orderData);
        setError("");
      } else {
        setOrderData(null);
        setError("No data found");
      }
    } catch (err) {
      console.error(err);
      setOrderData(null);
      setError("Error fetching order");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Oval color="#4A90E2" height={50} width={50} />
      </div>
    );
  }

  if (error && !orderData) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!data) {
    return <div className="text-center">No dashboard data available.</div>;
  }

  const pieData = {
    labels: ["Customers", "Delivery Partners", "Users"],
    datasets: [
      {
        data: [
          data.total_customers,
          data.total_delivery_partners,
          data.total_users,
        ],
        backgroundColor: ["#4CAF50", "#FF9800", "#2196F3"],
      },
    ],
  };

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
        <div className="p-4 bg-purple-600 text-white rounded-lg shadow-md">
          <h3 className="text-lg">Orders</h3>
          <p className="text-2xl font-bold">{data.total_orders}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 shadow-md rounded-lg">
          <h2 className="text-lg font-bold mb-2">User Distribution</h2>
          <Pie data={pieData} />
        </div>
        <div className="bg-white p-4 shadow-md rounded-lg">
          <h2 className="text-lg font-bold mb-2">Revenue Trends</h2>
          <Line data={revenueGraphData} />
        </div>
        <div className="bg-white p-4 shadow-md rounded-lg">
          <h2 className="text-lg font-bold mb-2">Sales Comparison</h2>
          <Bar data={salesComparisonData} />
        </div>
      </div>

      {/* Trips Table */}
      <h2 className="text-2xl font-bold my-6">All Trips</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border shadow-md rounded-lg">
          <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <tr>
              <th className="py-3 px-6 text-left"></th>
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
                <td className="py-3 px-6" colSpan="11">
                  Loading...
                </td>
              </tr>
            ) : (
              trips.map((trip) => <TripRow key={trip.trip_id} trip={trip} />)
            )}
          </tbody>
        </table>
      </div>

      {/* Shipping Order Search */}
      <div className="my-6 p-4 bg-white shadow-md rounded-lg max-w-xl mx-auto">
        <h2 className="text-xl font-bold mb-4">Search Shipping Order</h2>
        <div className="flex mb-4">
          <input
            type="text"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="Enter Order ID (e.g. XO100002)"
            className="border border-gray-300 rounded-l px-4 py-2 w-full"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-4 py-2 rounded-r"
          >
            Search
          </button>
        </div>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        {orderData && (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2">Field</th>
                <th className="border px-4 py-2">Value</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(orderData).map(([key, value]) => (
                <tr key={key}>
                  <td className="border px-4 py-2">{key}</td>
                  <td className="border px-4 py-2">{value ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

// Collapsible row component
const TripRow = ({ trip }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <tr
        className="border-b border-gray-200 hover:bg-gray-100 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <td className="py-3 px-6 text-center">{isOpen ? "−" : "+"}</td>
        <td className="py-3 px-6">{trip.order_id}</td>
        <td className="py-3 px-6">{trip.name_sender}</td>
        <td className="py-3 px-6">{trip.pickup_location}</td>
        <td className="py-3 px-6">{trip.delivery_location}</td>
        <td className="py-3 px-6">{trip.vehicle_type}</td>
        <td className="py-3 px-6">{trip.weight}</td>
        <td className="py-3 px-6">{trip.driver_name}</td>
        <td className="py-3 px-6">₹{trip.price}</td>
        <td className="py-3 px-6">{trip.trip_status}</td>
        <td className="py-3 px-6">{trip.ended_at ?? "-"}</td>
      </tr>
      {isOpen && (
        <tr className="bg-gray-50">
          <td colSpan="11" className="py-3 px-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Sender:</strong> {trip.name_sender} ({trip.mobile_sender})
                <br />
                {trip.address_sender}, {trip.office_sender}, {trip.zip_sender}
                <br />
                {trip.email_sender}
              </div>
              <div>
                <strong>Receiver:</strong> {trip.name_receiver} (
                {trip.mobile_receiver})
                <br />
                {trip.address_receiver}, {trip.office_receiver},{" "}
                {trip.zip_receiver}
                <br />
                {trip.email_receiver}
              </div>
              <div>
                <strong>Courier Type:</strong> {trip.courier_type}
                <br />
                <strong>Labour Type:</strong> {trip.labour_type}
                <br />
                <strong>Special Handling:</strong>{" "}
                {trip.fragile_handling ? "Fragile" : "-"} /{" "}
                {trip.over_sized ? "Oversized" : "-"}
                <br />
                <strong>Home Delivery:</strong> {trip.home_delivery ? "Yes" : "No"}
              </div>
              <div>
                <strong>Tracking:</strong> {trip.order_tracking}
                <br />
                <strong>COD:</strong> {trip.case_on_delivery ? "Yes" : "No"}
                <br />
                <strong>Same Day Delivery:</strong>{" "}
                {trip.same_day_delivery ? "Yes" : "No"}
                <br />
                <strong>Total Amount:</strong> ₹{trip.total_amount}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

export default Dashboard;
