import React, { useState, useEffect } from "react";
import axios from "axios";
import { Oval } from "react-loader-spinner";

const Services = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://test.pearl-developer.com/abhivriti/public/api/admin/view-services");
        console.log("API response:", response);

        const services = response.data.services || [];
        console.log("Services:", services);

        setData(services);
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
    return <div className="text-center">No services available.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Our Services</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {data.map((service) => (
          <div key={service.id} className="bg-white p-6 shadow-lg rounded-lg transform hover:scale-105 transition-transform duration-300">
            <h2 className="text-xl font-bold mb-4 text-blue-600 text-center">{service.name}</h2>
            <img src={service.image} alt={service.name} className="w-full h-40 object-cover mb-4 rounded-md" />
            <div className="mb-2">
              <h3 className="text-lg font-semibold">Description:</h3>
              <p className="text-gray-700 text-center">{service.description}</p>
            </div>
            <div className="mb-2">
              <h3 className="text-lg font-semibold">Price:</h3>
              <p className="text-gray-700 text-center">{service.price}</p>
            </div>
            <div className="mb-2">
              <h3 className="text-lg font-semibold">Duration:</h3>
              <p className="text-gray-700 text-center">{service.duration}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
