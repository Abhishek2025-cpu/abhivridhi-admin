import React, { useState, useEffect } from "react";
import axios from "axios";
import { Oval } from "react-loader-spinner";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const Banners = () => {
  const [deliveryBanner, setDeliveryBanner] = useState(null);
  const [enterpriseBanner, setEnterpriseBanner] = useState(null);
  const [homeBanner, setHomeBanner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://server1.pearl-developer.com/abhivriti/public/api/admin/banner"
        );
        console.log("API response:", response);

        const banners = response.data?.data || {};
        console.log("Banners:", banners);

        setDeliveryBanner(banners.delivery_banner);
        setEnterpriseBanner(banners.enterprise_banner);
        setHomeBanner(banners.home_banner);
      } catch (error) {
        setError("Error fetching data.");
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddBanner = () => {
    console.log("Add New Banner Clicked");
    // Implement add banner logic here
  };

  const handleUpdateBanner = (bannerType) => {
    console.log(`Update ${bannerType} Banner Clicked`);
    // Implement update banner logic here
  };

  const handleDeleteBanner = (bannerType) => {
    console.log(`Delete ${bannerType} Banner Clicked`);
    // Implement delete banner logic here
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

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Banners</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          onClick={handleAddBanner}
        >
          Add New Banner
        </button>
      </div>

      <Carousel showThumbs={false} showStatus={false} infiniteLoop autoPlay>
        {deliveryBanner && (
          <div className="relative">
            <h2 className="text-2xl font-bold text-white absolute top-4 left-4 bg-black bg-opacity-50 px-2 py-1 rounded">
              Delivery Banner
            </h2>
            <img
              src={deliveryBanner}
              alt="Delivery Banner"
              className="w-full h-96 object-cover rounded-md"
            />
            <div className="absolute bottom-4 left-4 flex gap-2">
              <button
                className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 transition"
                onClick={() => handleUpdateBanner("Delivery")}
              >
                Update
              </button>
              <button
                className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition"
                onClick={() => handleDeleteBanner("Delivery")}
              >
                Delete
              </button>
            </div>
          </div>
        )}

        {enterpriseBanner && (
          <div className="relative">
            <h2 className="text-2xl font-bold text-white absolute top-4 left-4 bg-black bg-opacity-50 px-2 py-1 rounded">
              Enterprise Banner
            </h2>
            <img
              src={enterpriseBanner}
              alt="Enterprise Banner"
              className="w-full h-96 object-cover rounded-md"
            />
            <div className="absolute bottom-4 left-4 flex gap-2">
              <button
                className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 transition"
                onClick={() => handleUpdateBanner("Enterprise")}
              >
                Update
              </button>
              <button
                className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition"
                onClick={() => handleDeleteBanner("Enterprise")}
              >
                Delete
              </button>
            </div>
          </div>
        )}

        {homeBanner && (
          <div className="relative">
            <h2 className="text-2xl font-bold text-white absolute top-4 left-4 bg-black bg-opacity-50 px-2 py-1 rounded">
              Home Banner
            </h2>
            <img
              src={homeBanner}
              alt="Home Banner"
              className="w-full h-96 object-cover rounded-md"
            />
            <div className="absolute bottom-4 left-4 flex gap-2">
              <button
                className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 transition"
                onClick={() => handleUpdateBanner("Home")}
              >
                Update
              </button>
              <button
                className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition"
                onClick={() => handleDeleteBanner("Home")}
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </Carousel>
    </div>
  );
};

export default Banners;
