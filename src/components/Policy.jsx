import React, { useEffect, useState } from "react";
import axios from "axios";

const Policy = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("https://server1.pearl-developer.com/abhivriti/public/api/admin/policy")
      .then((response) => {
        const { data } = response.data;
        setPolicies(data.policies);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  const handleAddPolicy = () => {
    console.log("Add New Policy Clicked");
    // Implement add policy logic here
  };

  const handleUpdatePolicy = (policyId) => {
    console.log(`Update Policy ${policyId} Clicked`);
    // Implement update policy logic here
  };

  const handleDeletePolicy = (policyId) => {
    console.log(`Delete Policy ${policyId} Clicked`);
    // Implement delete policy logic here
  };

  if (loading) return <div className="text-center text-lg text-blue-500">Loading...</div>;
  if (error) return <div className="text-center text-lg text-red-500">Error: {error.message}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 bg-gray-100 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-green-600">Policies</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          onClick={handleAddPolicy}
        >
          Add New Policy
        </button>
      </div>
      <ul className="list-decimal pl-6 space-y-4">
        {policies.map((policy, index) => (
          <li key={index} className="bg-white p-4 rounded-md shadow">
            <strong className="block">{policy.heading}</strong>
            <p>{policy.description}</p>
            <div className="flex gap-2 mt-2">
              <button
                className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 transition"
                onClick={() => handleUpdatePolicy(policy.id)}
              >
                Update
              </button>
              <button
                className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition"
                onClick={() => handleDeletePolicy(policy.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Policy;
