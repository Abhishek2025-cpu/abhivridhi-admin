import React, { useEffect, useState } from "react";
import axios from "axios";

const ZeroTolerancePolicy = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("https://server1.pearl-developer.com/abhivriti/public/api/admin/zero-tolerance-policy")
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
    console.log("Add New Zero Tolerance Policy Clicked");
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

  const zeroTolerancePolicy = policies.find(
    (policy) => policy.heading === "Porter has zero tolerance towards the following, including but not limited to:"
  );

  return (
    <div className="max-w-4xl mx-auto p-4 bg-gray-100 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-green-600">Zero Tolerance Policy</h2>
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

      {zeroTolerancePolicy && (
        <div className="mt-6">
          <h3 className="text-xl font-bold">Porter has zero tolerance towards the following, including but not limited to:</h3>
          <ul className="pl-6 space-y-2">
            {zeroTolerancePolicy.description.split(";").map((item, index) => (
              <li key={index}>{item.trim()}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6">
        <h3 className="text-xl font-bold">Reporting Complaints:</h3>
        <p>
          For reporting the complaint for the breach of any of the above incidents, our end users can reach out to the email id{" "}
          <a href="mailto:help@porter.in" className="text-blue-500">
            help@porter.in
          </a>{" "}
          and phone number{" "}
          <a href="tel:02244104410" className="text-blue-500">
            022 4410 4410
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default ZeroTolerancePolicy;
