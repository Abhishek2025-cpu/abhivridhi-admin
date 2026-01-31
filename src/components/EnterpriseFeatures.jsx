import React, { useState, useEffect } from "react";
import axios from "axios";
import { Oval } from "react-loader-spinner";
import Modal from "react-modal";

const EnterpriseFeatures = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "", image: "" });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("https://test.pearl-developer.com/abhivriti/public/api/admin/enterpriseFeature");
      setData(response.data.data || []);
    } catch (error) {
      setError("Error fetching data.");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (feature = null) => {
    setIsEditing(!!feature);
    setSelectedFeature(feature);
    setFormData(feature || { title: "", description: "", image: "" });
    setModalIsOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this feature?")) return;
    try {
      await axios.delete(`https://server1.pearl-developer.com/abhivriti/public/api/admin/enterpriseFeature/${id}`);
      fetchData();
    } catch (error) {
      console.error("Error deleting feature:", error);
    }
  };

  const handleSave = async () => {
    try {
      if (isEditing) {
        await axios.put(`https://server1.pearl-developer.com/abhivriti/public/api/admin/enterpriseFeature/${selectedFeature.id}`, formData);
      } else {
        await axios.post("https://server1.pearl-developer.com/abhivriti/public/api/admin/enterpriseFeature", formData);
      }
      setModalIsOpen(false);
      fetchData();
    } catch (error) {
      console.error("Error saving feature:", error);
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

  if (!data.length) {
    return <div className="text-center">No enterprise features available.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">Enterprise Features</h1>

      {/* Add New Feature Button */}
      <div className="flex justify-end mb-4">
        <button onClick={() => openModal()} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          Add New Feature
        </button>
      </div>

      {/* Responsive Table for Web */}
      <div className="hidden lg:block">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">Title</th>
              <th className="border border-gray-300 px-4 py-2">Description</th>
              <th className="border border-gray-300 px-4 py-2">Image</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((feature) => (
              <tr key={feature.id} className="hover:bg-gray-100">
                <td className="border border-gray-300 px-4 py-2">{feature.title}</td>
                <td className="border border-gray-300 px-4 py-2">{feature.description.substring(0, 50)}...</td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <img src={feature.image} alt={feature.title} className="w-16 h-16 object-cover rounded-md" />
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <button onClick={() => openModal(feature)} className="text-green-600 mr-2">Edit</button>
                  <button onClick={() => handleDelete(feature.id)} className="text-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards for Mobile */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:hidden">
        {data.map((feature) => (
          <div key={feature.id} className="bg-white p-6 shadow-lg rounded-lg">
            <h2 className="text-lg font-bold mb-2 text-blue-600">{feature.title}</h2>
            <img src={feature.image} alt={feature.title} className="w-full h-40 object-cover mb-4 rounded-md" />
            <p className="text-gray-700">{feature.description.substring(0, 50)}...</p>
            <div className="mt-4 flex justify-between">
              <button onClick={() => openModal(feature)} className="text-green-600">Edit</button>
              <button onClick={() => handleDelete(feature.id)} className="text-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Adding / Editing Feature */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        className="modal bg-white p-6 rounded-lg shadow-lg w-full sm:w-96"
        overlayClassName="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center px-4"
        ariaHideApp={false}
      >
        <h2 className="text-xl font-bold mb-4 text-center">{isEditing ? "Edit Feature" : "Add New Feature"}</h2>
        <input
          type="text"
          placeholder="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-md mb-4"
        />
        <textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-md mb-4"
        ></textarea>
        <input
          type="text"
          placeholder="Image URL"
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-md mb-4"
        />
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

export default EnterpriseFeatures;
