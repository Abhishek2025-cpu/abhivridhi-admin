import React, { useState, useEffect } from "react";
import axios from "axios";
import { Oval } from "react-loader-spinner";

const VehicleDescriptions = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    image: null,
    weight: "",
    height: "",
    width: "",
    starting_price: "",
  });
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://server1.pearl-developer.com/abhivriti/public/api/admin/vehicle-description"
        );
        setData(response.data.data || []);
      } catch (error) {
        setError("Error fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, image: file }));
  };

  const handleSubmit = async () => {
  try {
    const form = new FormData();
    form.append("name", formData.name);
    form.append("weight", formData.weight);
    form.append("height", formData.height);
    form.append("width", formData.width);
    form.append("starting_price", formData.starting_price);

    if (formData.image) {
      form.append("image", formData.image);
    }

    const response = await axios.post(
      "https://server1.pearl-developer.com/abhivriti/public/api/admin/add-vehicle-description",
      form,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (response.status === 200) {
      setSuccessMessage("Vehicle added successfully!");
      setShowModal(false);
      setFormData({
        name: "",
        image: null,
        weight: "",
        height: "",
        width: "",
        starting_price: "",
      });
    }
  } catch (error) {
    console.error("Error submitting vehicle:", error);
    if (error.response) {
      console.error("Error response:", error.response.data);
    }
    setError("Failed to add vehicle.");
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
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Vehicle Descriptions</h1>
        {/* <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Vehicle
        </button> */}
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-500 text-white p-4 rounded mb-4 text-center">
          {successMessage}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-center">Add New Vehicle</h2>
            <div className="space-y-3">
              {["Type", "weight", "height", "width", "starting_price"].map((field) => (
                <input
                  key={field}
                  type="text"
                  name={field}
                  placeholder={field.replace("_", " ").toUpperCase()}
                  value={formData[field]}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              ))}
              <input
                type="file"
                name="image"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border rounded"
                accept="image/*"
                required
              />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table View */}
      <div className="hidden md:block">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="border px-4 py-2">Type</th>
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
                  <img
                    src={vehicle.image}
                    alt={vehicle.name}
                    className="w-20 h-20 object-cover rounded-md"
                  />
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

      {/* Mobile Cards */}
      <div className="grid gap-6 md:hidden">
        {data.map((vehicle) => (
          <div
            key={vehicle.id}
            className="bg-white p-6 shadow-lg rounded-lg transform hover:scale-105 transition-transform duration-300"
          >
            <h2 className="text-xl font-bold mb-4 text-blue-600 text-center">{vehicle.name}</h2>
            <img
              src={vehicle.image}
              alt={vehicle.name}
              className="w-full h-32 object-cover mb-4 rounded-md"
            />
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
