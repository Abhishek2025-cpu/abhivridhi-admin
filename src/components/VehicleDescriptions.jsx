import React, { useState, useEffect } from "react";
import axios from "axios";
import { Oval } from "react-loader-spinner";

const VehicleDescriptions = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://server1.pearl-developer.com/abhivriti/public/api/admin/vehicle-description");
        console.log("API response:", response);

        const vehicles = response.data.data || [];
        console.log("Vehicle Descriptions:", vehicles);

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
        <Oval color="#4A90E2" height={50} width={50} />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!data.length) {
    return <div className="text-center">No vehicle descriptions available.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Vehicle Descriptions</h1>
      <div className="hidden md:block">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Image</th>
              <th className="border px-4 py-2">Weight</th>
              <th className="border px-4 py-2">Height</th>
              <th className="border px-4 py-2">Width</th>
              <th className="border px-4 py-2">Starting Price</th>
            </tr>
          </thead>
          <tbody>
            {data.map((vehicle) => (
              <tr key={vehicle.id} className="border">
                <td className="border px-4 py-2">{vehicle.name}</td>
                <td className="border px-4 py-2">
                  <img src={vehicle.image} alt={vehicle.name} className="w-20 h-20 object-cover rounded-md" />
                </td>
                <td className="border px-4 py-2">{vehicle.weight}</td>
                <td className="border px-4 py-2">{vehicle.height}</td>
                <td className="border px-4 py-2">{vehicle.width}</td>
                <td className="border px-4 py-2">₹{vehicle.starting_price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid gap-6 md:hidden">
        {data.map((vehicle) => (
          <div key={vehicle.id} className="bg-white p-6 shadow-lg rounded-lg transform hover:scale-105 transition-transform duration-300">
            <h2 className="text-xl font-bold mb-4 text-blue-600 text-center">{vehicle.name}</h2>
            <img src={vehicle.image} alt={vehicle.name} className="w-full h-32 object-cover mb-4 rounded-md" />
            <p className="text-gray-700 mb-2"><strong>Weight:</strong> {vehicle.weight}</p>
            <p className="text-gray-700 mb-2"><strong>Height:</strong> {vehicle.height}</p>
            <p className="text-gray-700 mb-2"><strong>Width:</strong> {vehicle.width}</p>
            <p className="text-gray-700 mb-2"><strong>Starting Price:</strong> ₹{vehicle.starting_price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};



export default VehicleDescriptions;
