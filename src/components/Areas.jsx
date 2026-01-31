import React, { useState, useEffect } from "react";
import axios from "axios";
import { Oval } from "react-loader-spinner";
import Modal from "react-modal";

const Areas = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newAreaName, setNewAreaName] = useState("");
  const [viewAll, setViewAll] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://test.pearl-developer.com/abhivriti/public/api/admin/area"
      );
      const areas = response.data.data || [];
      setData(areas);
      setFilteredData(areas.slice(0, 8)); // Show first 8 by default
    } catch (error) {
      setError("Error fetching data.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredData(
      data.filter((area) => area.name.toLowerCase().includes(query))
    );
  };

  const handleAddArea = async () => {
    if (!newAreaName.trim()) return;
    try {
      await axios.post(
        "https://server1.pearl-developer.com/abhivriti/public/api/admin/add-area",
        { name: newAreaName }
      );
      setNewAreaName("");
      setModalIsOpen(false);
      fetchData();
    } catch (error) {
      console.error("Error adding area:", error);
    }
  };

  const toggleViewAll = () => {
    if (viewAll) {
      setFilteredData(data.slice(0, 8)); // Show first 8 again
      setSearchQuery(""); // Reset search query
      setModalIsOpen(false); // Close modal if open
    } else {
      setFilteredData(data); // Show all areas
    }
    setViewAll(!viewAll); // Toggle state
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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">Areas</h1>

      {/* Search & Add New Area */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Search areas..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full sm:w-2/3 p-2 border border-gray-300 rounded-md mb-4 sm:mb-0"
        />
        <button
          onClick={() => setModalIsOpen(true)}
          className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Add New Area
        </button>
      </div>

      {/* Areas Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredData.map((area) => (
          <div key={area.id} className="bg-white p-4 shadow-md rounded-md">
            <h2 className="text-lg font-semibold text-blue-600 text-center">
              {area.name}
            </h2>
          </div>
        ))}
      </div>

      {/* View All / View Less Button */}
      {data.length > 8 && (
        <div className="text-center mt-6">
          <button
            onClick={toggleViewAll}
            className="text-blue-600 font-bold hover:underline"
          >
            {viewAll ? "View Less" : "View All"}
          </button>
        </div>
      )}

      {/* Centered Modal for Adding a New Area */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        className="modal bg-white p-6 rounded-lg shadow-lg w-full sm:w-96"
        overlayClassName="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center px-4"
        ariaHideApp={false}
      >
        <h2 className="text-xl font-bold mb-4 text-center">Add New Area</h2>
        <input
          type="text"
          placeholder="Enter area name"
          value={newAreaName}
          onChange={(e) => setNewAreaName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md mb-4"
        />
        <div className="flex justify-center space-x-2">
          <button
            onClick={handleAddArea}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Save
          </button>
          <button
            onClick={() => setModalIsOpen(false)}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Areas;
