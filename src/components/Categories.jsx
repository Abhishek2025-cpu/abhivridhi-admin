import React, { useState, useEffect } from "react";
import axios from "axios";
import { Oval } from "react-loader-spinner";

const Categories = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newCategory, setNewCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [updatedCategory, setUpdatedCategory] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://server1.pearl-developer.com/abhivriti/public/api/admin/category");
        const categoryData = response.data.data || [];
        setData(categoryData);
      } catch (error) {
        setError("Error fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddCategory = () => {
    if (newCategory) {
      setData([...data, { name: newCategory }]);
      setNewCategory("");
    }
  };

  const handleUpdateCategory = () => {
    setData(data.map(cat => cat.name === selectedCategory ? { name: updatedCategory } : cat));
    setIsModalOpen(false);
  };

  const handleDeleteCategory = (name) => {
    setData(data.filter(cat => cat.name !== name));
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
      <h1 className="text-3xl font-bold mb-6 text-center">Categories</h1>
      
      <div className="mb-4 flex gap-2">
        <input 
          type="text" 
          value={newCategory} 
          onChange={(e) => setNewCategory(e.target.value)} 
          placeholder="Enter new category" 
          className="p-2 border rounded" 
        />
        <button onClick={handleAddCategory} className="bg-blue-500 text-white p-2 rounded">Add Category</button>
      </div>
      
      <div className="hidden md:block">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-green-500 text-white">
              <th className="py-2 px-4 border">Name</th>
              <th className="py-2 px-2 border w-24">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="border">
                <td className="py-2 px-4 border">{item.name}</td>
                <td className="py-2 px-2 border flex gap-1 justify-center">
                  <button onClick={() => { setSelectedCategory(item.name); setIsModalOpen(true); }} className="bg-yellow-500 text-white p-1 rounded">Update</button>
                  <button onClick={() => handleDeleteCategory(item.name)} className="bg-red-500 text-white p-1 rounded">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:hidden">
        {data.map((item, index) => (
          <div key={index} className="p-4 shadow-lg rounded-lg bg-green-200">
            <h2 className="text-lg font-bold mb-2 text-green-600 text-center">{item.name}</h2>
            <div className="flex justify-center gap-1">
              <button onClick={() => { setSelectedCategory(item.name); setIsModalOpen(true); }} className="bg-yellow-500 text-white p-1 rounded">Update</button>
              <button onClick={() => handleDeleteCategory(item.name)} className="bg-red-500 text-white p-1 rounded">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-2">Update Category</h2>
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="p-2 border rounded w-full mb-2">
              {data.map((item, index) => (
                <option key={index} value={item.name}>{item.name}</option>
              ))}
            </select>
            <input type="text" value={updatedCategory} onChange={(e) => setUpdatedCategory(e.target.value)} placeholder="Enter new name" className="p-2 border rounded w-full mb-2" />
            <div className="flex justify-end gap-2">
              <button onClick={() => setIsModalOpen(false)} className="bg-gray-500 text-white p-2 rounded">Cancel</button>
              <button onClick={handleUpdateCategory} className="bg-green-500 text-white p-2 rounded">Update</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
