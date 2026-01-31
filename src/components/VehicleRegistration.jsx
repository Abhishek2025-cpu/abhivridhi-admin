import React, { useState, useEffect } from "react";
import axios from "axios";
import { Oval } from "react-loader-spinner";

const VehicleRegistration = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://test.pearl-developer.com/abhivriti/public/api/admin/vehicle-registration");
        console.log("API response:", response);

        const vehicles = response.data.data || [];
        console.log("Vehicle Registrations:", vehicles);

        setData(vehicles);
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
        <div className="text-center">
          <Oval color="#4A90E2" height={50} width={50} />
        </div>
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!data.length) {
    return <div className="text-center">No vehicle registrations available.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Vehicle Registrations</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {data.map((vehicle) => (
          <div key={vehicle.id} className="bg-white p-6 shadow-lg rounded-lg transform hover:scale-105 transition-transform duration-300">
          
          
            <p className="text-gray-700 mb-2"><strong>Name:</strong> {vehicle.name}</p>
            <p className="text-gray-700 mb-2"><strong>Mobile:</strong> {vehicle.mobile}</p>
            <p className="text-gray-700 mb-2"><strong>source:</strong> {vehicle.source}</p>
            <p className="text-gray-700 mb-2"><strong>state:</strong> {vehicle.state_name}</p>
            <p className="text-gray-700 mb-2"><strong>vehicle Name:</strong> {vehicle.vehicle_name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VehicleRegistration;
