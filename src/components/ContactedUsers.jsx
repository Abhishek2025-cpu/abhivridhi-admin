import React, { useState, useEffect } from "react";
import axios from "axios";
import { Oval } from "react-loader-spinner";

const ContactedUsers = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://server1.pearl-developer.com/abhivriti/public/api/admin/get-contacted-users");
        const contactedUsers = response.data?.data || [];
        setData(contactedUsers);
      } catch (error) {
        setError("Error fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
    return <div className="text-center">No contacted users available.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Contacted Users</h1>
      
      {/* Table View for Web */}
      <div className="hidden md:block">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="py-2 px-4 border">Name</th>
              <th className="py-2 px-4 border">Company</th>
              <th className="py-2 px-4 border">Email</th>
              <th className="py-2 px-4 border">Phone</th>
              <th className="py-2 px-4 border">Message</th>
              <th className="py-2 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((user) => (
              <tr key={user.id} className="border">
                <td className="py-2 px-4 border">{user.name}</td>
                <td className="py-2 px-4 border">{user.company_name}</td>
                <td className="py-2 px-4 border">{user.email}</td>
                <td className="py-2 px-4 border">{user.mobile}</td>
                <td className="py-2 px-4 border">{user.message}</td>
                <td className="py-2 px-4 border">
                  <button className="bg-yellow-500 text-white p-1 rounded mr-2">Update</button>
                  <button className="bg-red-500 text-white p-1 rounded">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Card View for Mobile */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:hidden">
        {data.map((user) => (
          <div key={user.id} className="bg-white p-6 shadow-lg rounded-lg">
            <h2 className="text-xl font-bold mb-4 text-blue-600">{user.name}</h2>
            <p className="text-gray-700"><strong>Company:</strong> {user.company_name}</p>
            <p className="text-gray-700"><strong>Email:</strong> {user.email}</p>
            <p className="text-gray-700"><strong>Phone:</strong> {user.mobile}</p>
            <p className="text-gray-700"><strong>Message:</strong> {user.message}</p>
            <div className="flex justify-center gap-2 mt-2">
              <button className="bg-yellow-500 text-white p-1 rounded">Update</button>
              <button className="bg-red-500 text-white p-1 rounded">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactedUsers;
