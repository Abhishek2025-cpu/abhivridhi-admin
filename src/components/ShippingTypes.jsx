import React, { useState, useEffect } from "react";
import axios from "axios";
import { Oval } from "react-loader-spinner";

const ShippingTypes = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://server1.pearl-developer.com/abhivriti/public/api/app/admin/get-shipping-type");
        console.log("API response:", response);

        const shippingTypes = response.data?.data || [];
        console.log("Shipping Types:", shippingTypes);

        setData(shippingTypes);
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
    return <div className="text-center">No shipping types available.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Shipping Types</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {data.map((type) => (
          <div key={type.id} className="bg-white p-6 shadow-lg rounded-lg transform hover:scale-105 transition-transform duration-300">
            <h2 className="text-xl font-bold mb-4 text-blue-600">{type.name}</h2>
            <div className="mb-2">
              <h3 className="text-lg font-semibold">Description:</h3>
              <p className="text-gray-700 text-center">{type.description}</p>
            </div>
            <div className="mb-2">
              <h3 className="text-lg font-semibold">Price:</h3>
              <p className="text-gray-700 text-center">{type.price}</p>
            </div>
            <div className="text-gray-500 text-sm">
              <p>Created at: {new Date(type.created_at).toLocaleString()}</p>
              <p>Updated at: {new Date(type.updated_at).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShippingTypes;
