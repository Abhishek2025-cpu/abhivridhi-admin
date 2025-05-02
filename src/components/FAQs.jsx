import React, { useState, useEffect } from "react";
import axios from "axios";
import { Oval } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";

const FAQs = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://server1.pearl-developer.com/abhivriti/public/api/admin/faq");
        console.log("API response:", response);

        const faqs = response.data.data || [];
        console.log("FAQs:", faqs);

        setData(faqs);
      } catch (error) {
        setError("Error fetching data.");
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleAccordion = (index) => {
    setExpanded(expanded === index ? null : index);
  };

  const handleEditClick = (id) => {
    navigate(`/edit-faq/${id}`);
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
      <h1 className="text-3xl font-bold mb-6 text-center">Frequently Asked Questions</h1>
      <div className="text-right mb-4">
        <button
          style={{
            backgroundColor: "#007BFF",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
            transition: "all 0.3s ease",
            boxShadow: "0 4px 6px rgba(0, 123, 255, 0.3)",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#0056b3")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#007BFF")}
          onClick={() => handleEditClick(data[0].id)} // Navigate to edit the first FAQ as an example
        
        >
          Edit FAQ
        </button>
      </div>
      <div className="space-y-4">
        {data.map((faq, index) => (
          <div key={faq.id} className="border rounded-lg">
            <button
              onClick={() => toggleAccordion(index)}
              className="w-full px-4 py-2 text-left text-lg font-medium text-gray-800 bg-gray-200 rounded-t-lg focus:outline-none"
            >
              {faq.question}
            </button>
            {expanded === index && (
              <div className="px-4 py-2 text-gray-700 bg-white rounded-b-lg">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQs;
