import React, { useState, useEffect } from "react";
import axios from "axios";
import { Oval } from "react-loader-spinner";

const InsuranceFAQ = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedIndex, setExpandedIndex] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://test.pearl-developer.com/abhivriti/public/api/admin/insurance-faq");
        console.log("API response:", response);

        const faqData = response.data.data || [];
        console.log("FAQ Data:", faqData);

        setData(faqData);
      } catch (error) {
        setError("Error fetching data.");
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleToggle = (index) => {
    setExpandedIndex(index === expandedIndex ? null : index);
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

  if (!data.length) {
    return <div className="text-center">No FAQs available.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Insurance FAQs</h1>
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="p-4 shadow-lg rounded-lg bg-gray-100">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => handleToggle(index)}
            >
              <h2 className="text-lg font-bold text-blue-600">{item.insurance_question}</h2>
              <span>{expandedIndex === index ? "-" : "+"}</span>
            </div>
            {expandedIndex === index && (
              <p className="mt-2 text-gray-700">{item.insurance_answer}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default InsuranceFAQ;
