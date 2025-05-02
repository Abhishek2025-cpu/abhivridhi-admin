import React, { useState, useEffect } from "react";
import axios from "axios";
import { Oval } from "react-loader-spinner";
import Modal from "react-modal";

const Clients = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [editName, setEditName] = useState("");
  const [editImage, setEditImage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://server1.pearl-developer.com/abhivriti/public/api/admin/client");
        setData(response.data?.data || []);
      } catch (error) {
        setError("Error fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const openModal = (client) => {
    setSelectedClient(client);
    setEditName(client.name);
    setEditImage(client.image);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedClient(null);
  };

  const handleEditClient = async (id) => {
    try {
      await axios.post(`https://server1.pearl-developer.com/abhivriti/public/api/admin/edit-client/${id}`, {
        name: editName,
        image: editImage
      });
      setData(data.map(client => client.id === id ? { ...client, name: editName, image: editImage } : client));
      closeModal();
    } catch (error) {
      console.error("Error editing client:", error);
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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Clients</h1>
      
      <div className="hidden md:block">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="py-2 px-4 border">Image</th>
              <th className="py-2 px-4 border">Name</th>
              <th className="py-2 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((client) => (
              <tr key={client.id} className="border">
                <td className="py-2 px-4 border text-center">
                  <img src={client.image} alt={client.name} className="w-16 h-16 object-cover mx-auto rounded-md" />
                </td>
                <td className="py-2 px-4 border text-center">{client.name}</td>
                <td className="py-2 px-4 border text-center">
                  <button onClick={() => openModal(client)} className="bg-blue-500 text-white p-1 rounded">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-6 md:hidden">
        {data.map((client) => (
          <div key={client.id} className="bg-white p-6 shadow-lg rounded-lg">
            <img src={client.image} alt={client.name} className="w-full h-40 object-cover mb-4 rounded-md" />
            <h2 className="text-xl font-bold text-blue-600 text-center">{client.name}</h2>
            <button onClick={() => openModal(client)} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Edit</button>
          </div>
        ))}
      </div>

      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} ariaHideApp={false} className="modal" overlayClassName="overlay">
        <h2 className="text-xl font-bold mb-4">Edit Client</h2>
        <label className="block mb-2">
          Name:
          <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" />
        </label>
        <label className="block mb-4">
          Image URL:
          <input type="text" value={editImage} onChange={(e) => setEditImage(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" />
        </label>
        <button onClick={() => handleEditClient(selectedClient.id)} className="bg-blue-500 text-white px-4 py-2 rounded-md">Save Changes</button>
        <button onClick={closeModal} className="ml-2 bg-gray-500 text-white px-4 py-2 rounded-md">Cancel</button>
      </Modal>
    </div>
  );
};

export default Clients;
