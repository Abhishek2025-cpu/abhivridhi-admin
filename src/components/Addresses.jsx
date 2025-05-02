import React, { useState, useEffect } from "react";
import axios from "axios";
import { Oval } from "react-loader-spinner";
import Modal from "react-modal";

const Addresses = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ state_name: "", address: "" });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://server1.pearl-developer.com/abhivriti/public/api/admin/addresses"
      );
      setData(response.data.data[0] || {});
    } catch (error) {
      setError("Error fetching data.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewMore = (index) => {
    setExpandedIndex(index === expandedIndex ? null : index);
  };

  const openModal = (address = null) => {
    setIsEditing(!!address);
    setSelectedAddress(address);
    setFormData(address || { state_name: "", address: "" });
    setModalIsOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    try {
      await axios.delete(`https://server1.pearl-developer.com/abhivriti/public/api/admin/address/${id}`);
      fetchData();
    } catch (error) {
      console.error("Error deleting address:", error);
    }
  };

  const handleSave = async () => {
    try {
      if (isEditing) {
        await axios.put(`https://server1.pearl-developer.com/abhivriti/public/api/admin/address/${selectedAddress.id}`, formData);
      } else {
        await axios.post("https://server1.pearl-developer.com/abhivriti/public/api/admin/address", formData);
      }
      setModalIsOpen(false);
      fetchData();
    } catch (error) {
      console.error("Error saving address:", error);
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
    return <div>{error}</div>;
  }

  if (!data.addresses || !data.addresses.length) {
    return <div className="text-center">No address data available.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">Addresses</h1>

      {/* Add New Address Button */}
      <div className="flex justify-end mb-4">
        <button onClick={() => openModal()} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          Add New Address
        </button>
      </div>

      {/* Head Office Info */}
      <div className="mb-6 p-4 shadow-lg rounded-lg bg-yellow-200 text-center">
        <h2 className="text-lg font-bold text-blue-600">Head Office</h2>
        <p className="text-gray-700">{data.headoffice_state_name}</p>
        <p className="text-gray-700">{data.headoffice_address}</p>
      </div>

      {/* Responsive Table for Web */}
      <div className="hidden lg:block">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">State Name</th>
              <th className="border border-gray-300 px-4 py-2">Address</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.addresses.map((item) => (
              <tr key={item.id} className="hover:bg-gray-100">
                <td className="border border-gray-300 px-4 py-2">{item.state_name}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {expandedIndex === item.id ? item.address : `${item.address.substring(0, 50)}...`}
                  <button className="text-blue-600 ml-2" onClick={() => handleViewMore(item.id)}>
                    {expandedIndex === item.id ? "View Less" : "View More"}
                  </button>
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <button onClick={() => openModal(item)} className="text-green-600 mr-2">Edit</button>
                  <button onClick={() => handleDelete(item.id)} className="text-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards for Mobile */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:hidden">
        {data.addresses.map((item) => (
          <div key={item.id} className="p-4 shadow-lg rounded-lg bg-blue-200">
            <h2 className="text-lg font-bold mb-2 text-blue-600">{item.state_name}</h2>
            <p className="text-gray-700">{expandedIndex === item.id ? item.address : `${item.address.substring(0, 50)}...`}</p>
            <button className="text-blue-600 underline mt-2" onClick={() => handleViewMore(item.id)}>
              {expandedIndex === item.id ? "View Less" : "View More"}
            </button>
            <div className="mt-4 flex justify-between">
              <button onClick={() => openModal(item)} className="text-green-600">Edit</button>
              <button onClick={() => handleDelete(item.id)} className="text-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Adding / Editing Address */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        className="modal bg-white p-6 rounded-lg shadow-lg w-full sm:w-96"
        overlayClassName="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center px-4"
        ariaHideApp={false}
      >
        <h2 className="text-xl font-bold mb-4 text-center">{isEditing ? "Edit Address" : "Add New Address"}</h2>
        <input
          type="text"
          placeholder="State Name"
          value={formData.state_name}
          onChange={(e) => setFormData({ ...formData, state_name: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-md mb-4"
        />
        <textarea
          placeholder="Address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-md mb-4"
        ></textarea>
        <div className="flex justify-center space-x-2">
          <button onClick={handleSave} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            Save
          </button>
          <button onClick={() => setModalIsOpen(false)} className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600">
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Addresses;
