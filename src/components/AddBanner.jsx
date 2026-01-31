import React, { useState } from "react";
import { FaCloudUploadAlt, FaTrash, FaEdit } from "react-icons/fa";
import { addBanner } from "../auth/apiService"; // Apne file path ke hisaab se change karein

const AddBanner = () => {
  const [banners, setBanners] = useState([
    { id: 1, title: "Diwali Offer", position: "1", status: "1", image: "https://via.placeholder.com/150" },
  ]);

  const [formData, setFormData] = useState({
    title: "",
    position: "",
    status: "1",
    image: null, // File store karne ke liye
  });

  const [loading, setLoading] = useState(false);

  // Handle File Change
  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    // 1. Create FormData Object
    const data = new FormData();
    data.append("title", formData.title);
    data.append("position", formData.position);
    data.append("status", formData.status);
    
    // 2. Append Image with key 'image[]' as required by API
    if (formData.image) {
      data.append("image[]", formData.image); 
    }

    // 3. Call Controller
    const response = await addBanner(data);

    if (response.status === true || response.status === "true") {
      alert("Banner added successfully!");
      setFormData({ title: "", position: "", status: "1", image: null });
    } else {
      alert(response.message || "Failed to add banner");
    }
  } catch (error) {
    console.error("Submit Error:", error);
    alert(typeof error.message === 'string' ? error.message : "Error connecting to server");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-slate-800">Manage Banners</h2>

      {/* Form Section */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <h3 className="text-lg font-semibold mb-4 text-indigo-600">Add New Banner</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Banner Title</label>
            <input
              type="text"
              className="mt-1 w-full p-2 border border-gray-300 rounded-lg"
              placeholder="Enter title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Position</label>
            <input
              type="number"
              className="mt-1 w-full p-2 border border-gray-300 rounded-lg"
              placeholder="e.g. 1"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              className="mt-1 w-full p-2 border border-gray-300 rounded-lg"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="1">Active</option>
              <option value="0">Inactive</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Upload Image</label>
            <div className="mt-1 flex items-center gap-3">
              <label className="cursor-pointer bg-slate-100 px-4 py-2 rounded-lg border-2 border-dashed border-gray-300 hover:bg-slate-200 flex items-center gap-2">
                <FaCloudUploadAlt /> {formData.image ? formData.image.name : "Choose File"}
                <input 
                    type="file" 
                    className="hidden" 
                    onChange={handleFileChange}
                    accept="image/*"
                />
              </label>
            </div>
          </div>
          <div className="md:col-span-2">
            <button 
              type="submit" 
              disabled={loading}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition disabled:bg-gray-400"
            >
              {loading ? "Saving..." : "Save Banner"}
            </button>
          </div>
        </form>
      </div>

      {/* Table Section (Static for now) */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-4 border-b font-semibold text-slate-700">Image</th>
              <th className="p-4 border-b font-semibold text-slate-700">Title</th>
              <th className="p-4 border-b font-semibold text-slate-700">Position</th>
              <th className="p-4 border-b font-semibold text-slate-700">Status</th>
              <th className="p-4 border-b font-semibold text-slate-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {banners.map((banner) => (
              <tr key={banner.id} className="hover:bg-slate-50">
                <td className="p-4 border-b">
                  <img src={banner.image} alt="thumb" className="w-16 h-10 object-cover rounded" />
                </td>
                <td className="p-4 border-b">{banner.title}</td>
                <td className="p-4 border-b">{banner.position}</td>
                <td className="p-4 border-b">
                  <span className={`px-2 py-1 rounded text-xs ${banner.status === '1' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {banner.status === '1' ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="p-4 border-b">
                  <div className="flex gap-3">
                    <button className="text-blue-500 hover:text-blue-700"><FaEdit /></button>
                    <button className="text-red-500 hover:text-red-700"><FaTrash /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AddBanner;