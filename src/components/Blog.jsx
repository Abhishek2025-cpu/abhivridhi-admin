import React, { useState, useEffect } from "react";
import axios from "axios";
import { Oval } from "react-loader-spinner";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Blog = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedTopics, setExpandedTopics] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [newBlog, setNewBlog] = useState({ title: "", subtitle: "", images: [], topics_and_descriptions: [] });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get("https://server1.pearl-developer.com/abhivriti/public/api/admin/blog");
      setData(response.data.data || []);
    } catch (error) {
      setError("Error fetching blogs.");
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTopics = (blogId) => {
    setExpandedTopics((prev) => ({
      ...prev,
      [blogId]: !prev[blogId],
    }));
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
      <h1 className="text-3xl font-bold mb-6 text-center">Blog Posts</h1>

      {/* Add Blog Button */}
      <div className="flex justify-end mb-4">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          onClick={() => setShowModal(true)}
        >
          + Add New Blog
        </button>
      </div>

      {/* Table View for Web */}
      <div className="hidden md:block">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">Image</th>
              <th className="border border-gray-300 px-4 py-2">Title</th>
              <th className="border border-gray-300 px-4 py-2">Subtitle</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((blog) => (
              <tr key={blog.id} className="hover:bg-gray-100">
                <td className="border border-gray-300 px-4 py-2">
                  <img src={blog.images?.[0]} alt={blog.title} className="w-20 h-16 object-cover rounded-md" />
                </td>
                <td className="border border-gray-300 px-4 py-2">{blog.title}</td>
                <td className="border border-gray-300 px-4 py-2">{blog.subtitle || "No subtitle"}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <span className="text-green-600 cursor-pointer hover:underline mr-4">Update</span>
                  <span className="text-red-600 cursor-pointer hover:underline">Delete</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Topics (Expandable Outside the Table) */}
      <div className="mt-6">
        <h2 className="text-2xl font-bold mb-4">Blog Topics</h2>
        {data.map((blog) => (
          <div key={blog.id} className="bg-gray-100 p-4 rounded-lg mb-4">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => handleToggleTopics(blog.id)}
            >
              <h3 className="text-lg font-semibold">{blog.title}</h3>
              <span className="text-blue-500">{expandedTopics[blog.id] ? "▲ Hide Topics" : "▼ Show Topics"}</span>
            </div>
            {expandedTopics[blog.id] && (
              <ul className="mt-2 pl-4 list-disc">
                {blog.topics_and_descriptions?.map((topic, index) => (
                  <li key={index} className="text-gray-700">{topic.description}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      {/* Modal for Adding Blog */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Add New Blog</h2>

            <input
              type="text"
              placeholder="Title"
              value={newBlog.title}
              onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md mb-3"
            />
            <input
              type="text"
              placeholder="Subtitle"
              value={newBlog.subtitle}
              onChange={(e) => setNewBlog({ ...newBlog, subtitle: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md mb-3"
            />
            <input
              type="text"
              placeholder="Image URL (comma-separated)"
              value={newBlog.images.join(",")}
              onChange={(e) => setNewBlog({ ...newBlog, images: e.target.value.split(",") })}
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
                onClick={() => {
                  setShowModal(false);
                  setNewBlog({ title: "", subtitle: "", images: [], topics_and_descriptions: [] });
                }}
              >
                Add Blog
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blog;
