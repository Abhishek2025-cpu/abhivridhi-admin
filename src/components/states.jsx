import React, { useState, useEffect } from "react";
import axios from "axios";
import { Oval } from "react-loader-spinner";
// Removed unused import: import Modal from "react-modal"; 

const States = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newState, setNewState] = useState({ name: "", image: "" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://server1.pearl-developer.com/abhivriti/public/api/admin/state");
        console.log("API response:", response);

        const states = response.data.data || [];  // Access data correctly
        console.log("States:", states);

        setData(states);
      } catch (error) {
        setError("Error fetching data.");
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddState = () => {
    setData([...data, newState]);
    setNewState({ name: "", image: "" });
    setIsModalOpen(false);
  };

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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">States</h1>
      <button onClick={() => setIsModalOpen(true)} className="mb-4 bg-blue-500 text-white p-2 rounded">Add New State</button>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {data.map((state, index) => (
          <div key={index} className="bg-white p-6 shadow-lg rounded-lg transform hover:scale-105 transition-transform duration-300">
            <h2 className="text-xl font-bold mb-4 text-blue-600 text-center">{state.name}</h2>
            <img src={state.image} alt={state.name} className="w-full h-40 object-cover mb-4 rounded-md" />
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-2">Add New State</h2>
            <input type="text" value={newState.name} onChange={(e) => setNewState({ ...newState, name: e.target.value })} placeholder="Enter state name" className="p-2 border rounded w-full mb-2" />
            <input type="text" value={newState.image} onChange={(e) => setNewState({ ...newState, image: e.target.value })} placeholder="Enter image URL" className="p-2 border rounded w-full mb-2" />
            <div className="flex justify-end gap-2">
              <button onClick={() => setIsModalOpen(false)} className="bg-gray-500 text-white p-2 rounded">Cancel</button>
              <button onClick={handleAddState} className="bg-green-500 text-white p-2 rounded">Add State</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default States;