import React, { useState, useEffect } from "react";
import axios from "axios";
import { Oval } from "react-loader-spinner";

const Support = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newSupport, setNewSupport] = useState({
    title: "",
    description: "",
    customer_support_number: "",
    customer_support_email: "",
  });

  useEffect(() => {
    fetchSupportData();
  }, []);

  const fetchSupportData = async () => {
    try {
      const response = await axios.get(
        "https://server1.pearl-developer.com/abhivriti/public/api/admin/support"
      );
      setData(response.data.data || []);
    } catch (error) {
      setError("Error fetching support data.");
      console.error("Error fetching support data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `https://server1.pearl-developer.com/abhivriti/public/api/admin/support/${id}`
      );
      setData(data.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting support entry:", error);
    }
  };

  const handleAdd = async () => {
    try {
      const response = await axios.post(
        "https://server1.pearl-developer.com/abhivriti/public/api/admin/support",
        newSupport
      );
      setData([...data, response.data]);
      setNewSupport({
        title: "",
        description: "",
        customer_support_number: "",
        customer_support_email: "",
      });
    } catch (error) {
      console.error("Error adding support entry:", error);
    }
  };

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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Support</h1>

      {/* Add New Support Button */}
     {/* Add New Support Button */}
<div className="mb-6 text-left">
  <button
    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
    onClick={handleAdd}
  >
    Add New Support
  </button>
</div>


      {/* Support Cards */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {data.map((item) => (
          <div key={item.id} className="p-4 shadow-lg rounded-lg bg-gray-100">
            <h2 className="text-lg font-bold text-blue-600">{item.title}</h2>
            <p className="mt-2 text-gray-700">{item.description}</p>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                <strong>Contact:</strong> {item.customer_support_number}
              </p>
              <p className="text-sm text-gray-500">
                <strong>Email:</strong> {item.customer_support_email}
              </p>
              <p className="text-sm text-gray-500">
                <strong>Abhivriti Number:</strong> {item.drive_with_porter_number}
              </p>
              <p className="text-sm text-gray-500">
                <strong>Packer's Email:</strong> {item.packers_email}
              </p>
              <div className="mt-2">
                <strong>Packer's Numbers:</strong>
                <ul className="list-disc list-inside">
                  {item.packers_numbers && item.packers_numbers.length > 0 ? (
                    item.packers_numbers.map((number, numIndex) => (
                      <li key={numIndex} className="text-gray-700">{number}</li>
                    ))
                  ) : (
                    <li className="text-gray-500">No numbers available</li>
                  )}
                </ul>
              </div>
            </div>
            {/* Delete Button */}
            <div className="mt-4 text-right">
              <button
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
                onClick={() => handleDelete(item.id)}
              >
                Delete Support
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Support;
