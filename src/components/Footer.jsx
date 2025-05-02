import React, { useState, useEffect } from "react";
import axios from "axios";
import { Oval } from "react-loader-spinner";

const Footer = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://server1.pearl-developer.com/abhivriti/public/api/admin/footer");
        console.log("API response:", response);

        const footerData = response.data.data || {};
        console.log("Footer Data:", footerData);

        setData(footerData);
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

  if (!data) {
    return <div className="text-center">No footer data available.</div>;
  }

  return (
    <footer className="bg-gray-800 text-white p-4">
      <div className="container mx-auto">
        {data.tagline && <p className="text-center mb-2">{data.tagline}</p>}
        <p className="text-center mb-2"> {data.copyright}</p>
        {data.links && (
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-4">
            {data.links.map((link, index) => (
              <a key={index} href={link.url} className="text-blue-400 hover:text-blue-600 transition-colors duration-300">
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </footer>
  );
};

export default Footer;
