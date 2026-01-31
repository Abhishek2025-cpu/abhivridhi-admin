import React, { useState, useEffect } from "react";
import axios from "axios";
import { Oval } from "react-loader-spinner";

const SocialMedia = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://test.pearl-developer.com/abhivriti/public/api/admin/social-media");
        console.log("API response:", response);

        const socialMediaData = response.data.data || [];
        console.log("Social Media Data:", socialMediaData);

        setData(socialMediaData);
      } catch (error) {
        setError("Error fetching data.");
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
    return <div className="text-center">No social media data available.</div>;
  }

  const platformColors = {
    Facebook: "bg-blue-600",
    Twitter: "bg-blue-400",
    Instagram: "bg-pink-500",
    LinkedIn: "bg-blue-700",
    YouTube: "bg-red-600",
  };

  const handleCardClick = (url) => {
    window.open(url, "_blank");
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Social Media Platforms</h1>
      <div className="flex justify-center gap-2 flex-wrap">
        {data.map((item) => (
          <div
            key={item.url}
            className={`w-16 h-16 p-2 shadow-lg rounded-full transform hover:scale-105 transition-transform duration-300 cursor-pointer ${platformColors[item.name] || "bg-gray-400"}`}
            onClick={() => handleCardClick(item.url)}
          >
            <div className="flex justify-center">
              <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded-full bg-white p-1" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SocialMedia;
