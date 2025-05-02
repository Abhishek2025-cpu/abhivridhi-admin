import React, { useState, useEffect } from "react";
import axios from "axios";
import { Oval } from "react-loader-spinner";

const News = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newNews, setNewNews] = useState({ headline: "", description: "", image: "", link: "" });

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await axios.get("https://server1.pearl-developer.com/abhivriti/public/api/admin/news");
      setData(response.data.data || []);
    } catch (error) {
      setError("Error fetching news.");
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNews = async () => {
    try {
      await axios.post("https://server1.pearl-developer.com/abhivriti/public/api/admin/news", newNews);
      fetchNews();
      setShowModal(false);
      setNewNews({ headline: "", description: "", image: "", link: "" });
    } catch (error) {
      console.error("Error adding news:", error);
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
      <h1 className="text-3xl font-bold mb-6 text-center">News</h1>

      {/* Add News Button */}
      <div className="flex justify-end mb-4">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          onClick={() => setShowModal(true)}
        >
          + Add New News
        </button>
      </div>

      {/* Table View for Web */}
      <div className="hidden md:block">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">Image</th>
              <th className="border border-gray-300 px-4 py-2">Headline</th>
              <th className="border border-gray-300 px-4 py-2">Description</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((article) => (
              <tr key={article.id} className="hover:bg-gray-100">
                <td className="border border-gray-300 px-4 py-2">
                  <img src={article.image} alt={article.headline} className="w-20 h-16 object-cover rounded-md" />
                </td>
                <td className="border border-gray-300 px-4 py-2">{article.headline}</td>
                <td className="border border-gray-300 px-4 py-2">{article.description || "No description available"}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <span className="text-green-600 cursor-pointer hover:underline mr-4">Update</span>
                  <span className="text-red-600 cursor-pointer hover:underline">Delete</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Card View for Mobile */}
      <div className="grid gap-6 md:hidden">
        {data.map((article) => (
          <div key={article.id} className="bg-white p-4 shadow-lg rounded-lg">
            <img src={article.image} alt={article.headline} className="w-full h-40 object-cover mb-4 rounded-md" />
            <h2 className="text-xl font-bold mb-2 text-blue-600">{article.headline}</h2>
            <p className="text-gray-700">{article.description || "No description available"}</p>
            <div className="mt-2 flex justify-between">
              <span className="text-green-600 cursor-pointer hover:underline">Update</span>
              <span className="text-red-600 cursor-pointer hover:underline">Delete</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Adding News */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Add New News</h2>

            <input
              type="text"
              placeholder="Headline"
              value={newNews.headline}
              onChange={(e) => setNewNews({ ...newNews, headline: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md mb-3"
            />
            <textarea
              placeholder="Description"
              value={newNews.description}
              onChange={(e) => setNewNews({ ...newNews, description: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md mb-3"
            ></textarea>
            <input
              type="text"
              placeholder="Image URL"
              value={newNews.image}
              onChange={(e) => setNewNews({ ...newNews, image: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md mb-3"
            />
            <input
              type="text"
              placeholder="News Link"
              value={newNews.link}
              onChange={(e) => setNewNews({ ...newNews, link: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md mb-3"
            />

            <div className="flex justify-between mt-4">
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                onClick={handleAddNews}
              >
                Add News
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default News;
