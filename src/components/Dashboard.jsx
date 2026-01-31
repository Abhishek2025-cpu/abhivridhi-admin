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

  // Fetch dashboard stats & All Bookings (Trips)
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("adminToken");
      
      try {
        // 1. Fetch Dashboard Stats
        const dashRes = await axios.get(
          "https://test.pearl-developer.com/abhivriti/public/api/admin/dashboard",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (dashRes.data.success) {
          setData(dashRes.data.data);
        }

        // 2. Fetch All Bookings (Trips)
        const bookingsRes = await axios.get(
          "https://test.pearl-developer.com/abhivriti/public/api/app/admin/get_all_bookings",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        if (bookingsRes.data.success) {
          setTrips(bookingsRes.data.data);
        } else {
          console.error("Failed to load bookings");
        }

      } catch (error) {
        setError("Error fetching data from server.");
        console.error("Error:", error);
      } finally {
        setLoading(false);
        setTripLoading(false);
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
      const token = localStorage.getItem("adminToken");
      const res = await axios.get(
        `https://test.pearl-developer.com/abhivriti/public/api/app/shipping/${orderId}`,
        { headers: { Authorization: `Bearer ${token}` } }
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

  // Charts data calculation
  const pieData = {
    labels: ["Total Customers", "Delivery Partners", "Total Bookings"],
    datasets: [
      {
        data: [
          data?.customers?.total || 0,
          data?.delivery_partners?.total || 0,
          data?.bookings?.total || 0,
        ],
        backgroundColor: ["#4CAF50", "#FF9800", "#9C27B0"],
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
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Admin Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-blue-600 text-white rounded-lg shadow-md">
          <h3 className="text-lg">Total Customers</h3>
          <p className="text-2xl font-bold">{data?.customers?.total || 0}</p>
        </div>
        <div className="p-4 bg-green-600 text-white rounded-lg shadow-md">
          <h3 className="text-lg">Active Customers</h3>
          <p className="text-2xl font-bold">{data?.customers?.active || 0}</p>
        </div>
        <div className="p-4 bg-yellow-500 text-white rounded-lg shadow-md">
          <h3 className="text-lg">Delivery Partners</h3>
          <p className="text-2xl font-bold">{data?.delivery_partners?.total || 0}</p>
        </div>
        <div className="p-4 bg-purple-600 text-white rounded-lg shadow-md">
          <h3 className="text-lg">Total Bookings</h3>
          <p className="text-2xl font-bold">{data?.bookings?.total || 0}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 shadow-md rounded-lg">
          <h2 className="text-lg font-bold mb-2">Booking & Partner Ratio</h2>
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

      {/* Trips Table (Real Data from API) */}
      <h2 className="text-2xl font-bold my-6 text-gray-700">All Trips (Bookings)</h2>
      <div className="overflow-x-auto mb-10">
        <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs leading-normal font-bold">
            <tr>
              <th className="py-3 px-4 border-b"></th>
              <th className="py-3 px-4 border-b text-left">Order ID</th>
              <th className="py-3 px-4 border-b text-left">Customer</th>
              <th className="py-3 px-4 border-b text-left">Pickup</th>
              <th className="py-3 px-4 border-b text-left">Delivery</th>
              <th className="py-3 px-4 border-b text-left">Vehicle</th>
              <th className="py-3 px-4 border-b text-left">Fare</th>
              <th className="py-3 px-4 border-b text-left">Status</th>
              <th className="py-3 px-4 border-b text-left">Created At</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm font-light">
            {tripLoading ? (
              <tr>
                <td className="py-10 text-center font-bold" colSpan="9">
                   <div className="flex justify-center"><Oval color="#000" height={30} width={30} /></div>
                </td>
              </tr>
            ) : trips.length > 0 ? (
              trips.map((trip) => <TripRow key={trip.id} trip={trip} />)
            ) : (
              <tr>
                <td className="py-5 text-center" colSpan="9">No bookings found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Shipping Order Search */}
      <div className="my-10 p-6 bg-gray-50 shadow-inner rounded-xl max-w-2xl mx-auto border border-gray-200">
        <h2 className="text-xl font-bold mb-4 text-blue-800">Direct Shipping Search</h2>
        <div className="flex mb-4 gap-2">
          <input
            type="text"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="Enter Order ID (e.g. LV100070)"
            className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition-colors font-semibold"
          >
            Search
          </button>
        </div>
        {error && <p className="text-red-500 mb-2 font-medium">{error}</p>}
        {orderData && (
          <div className="bg-white p-4 rounded border">
             <pre className="text-xs text-gray-600 whitespace-pre-wrap">{JSON.stringify(orderData, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

// Updated Collapsible Row Component to match get_all_bookings API
const TripRow = ({ trip }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Status color logic
  const getStatusColor = (status) => {
    switch(status) {
        case 'completed': return 'text-green-600 bg-green-100';
        case 'confirmed': return 'text-blue-600 bg-blue-100';
        case 'picked_up': return 'text-orange-600 bg-orange-100';
        case 'delivered': return 'text-teal-600 bg-teal-100';
        default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <>
      <tr
        className="border-b border-gray-100 hover:bg-blue-50 cursor-pointer transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <td className="py-3 px-4 text-center font-bold text-blue-600">{isOpen ? "−" : "+"}</td>
        <td className="py-3 px-4 font-semibold">{trip.order_id}</td>
        <td className="py-3 px-4">{trip.user?.name || "N/A"}</td>
        <td className="py-3 px-4 truncate max-w-[150px]" title={trip.pickup_location}>{trip.pickup_location}</td>
        <td className="py-3 px-4 truncate max-w-[150px]" title={trip.delivery_location}>{trip.delivery_location}</td>
        <td className="py-3 px-4">{trip.vehicle_type?.name || trip.vehicle_type_id}</td>
        <td className="py-3 px-4 font-bold">₹{trip.fare_total}</td>
        <td className="py-3 px-4">
            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusColor(trip.status)}`}>
                {trip.status}
            </span>
        </td>
        <td className="py-3 px-4 text-[11px] text-gray-500">
            {new Date(trip.created_at).toLocaleDateString()}
        </td>
      </tr>
      {isOpen && (
        <tr className="bg-blue-50/30">
          <td colSpan="9" className="py-4 px-8 border-b border-blue-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              {/* Fare Breakdown */}
              <div className="bg-white p-3 rounded shadow-sm border border-blue-100">
                <h4 className="font-bold text-blue-800 mb-2 border-b pb-1">Fare Breakdown</h4>
                <div className="flex justify-between"><span>Base Fare:</span> <span>₹{trip.fare_breakdown?.base_fare}</span></div>
                <div className="flex justify-between"><span>Distance Fare:</span> <span>₹{trip.fare_breakdown?.distance_fare}</span></div>
                <div className="flex justify-between"><span>GST ({trip.fare_breakdown?.gst_percent}%):</span> <span>₹{trip.fare_breakdown?.gst_fee}</span></div>
                <div className="flex justify-between font-bold mt-1 text-green-700"><span>Total:</span> <span>₹{trip.fare_breakdown?.total_fare}</span></div>
              </div>

              {/* Package Details */}
              <div className="bg-white p-3 rounded shadow-sm border border-blue-100">
                <h4 className="font-bold text-blue-800 mb-2 border-b pb-1">Package Info</h4>
                {trip.packages?.map((pkg, idx) => (
                    <div key={pkg.id} className="mb-2 last:mb-0">
                        <p className="font-semibold text-gray-700 text-xs">#{idx+1} {pkg.title} ({pkg.package_type})</p>
                        <p className="text-[11px] text-gray-500">
                            Weight: {pkg.weight}kg | Vol: {pkg.volumetric_weight}
                            <br/>
                            Size: {pkg.length}L x {pkg.width}W x {pkg.height}H
                        </p>
                    </div>
                ))}
              </div>

              {/* Additional Info */}
              <div className="bg-white p-3 rounded shadow-sm border border-blue-100">
                <h4 className="font-bold text-blue-800 mb-2 border-b pb-1">Other Details</h4>
                <p><strong>Customer Mobile:</strong> {trip.user?.mobile || "N/A"}</p>
                <p><strong>Payment Status:</strong> <span className="capitalize text-orange-600 font-bold">{trip.payment_status}</span></p>
                <p><strong>Payment Mode:</strong> <span className="uppercase">{trip.payment_mode || "N/A"}</span></p>
                <p><strong>Rider ID:</strong> {trip.rider_id || "Not Assigned"}</p>
                {trip.pickup_time && <p><strong>Picked At:</strong> {new Date(trip.pickup_time).toLocaleString()}</p>}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

export default Dashboard;