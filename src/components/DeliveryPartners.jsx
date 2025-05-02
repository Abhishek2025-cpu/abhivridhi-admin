import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Oval } from 'react-loader-spinner';
import './DeliveryPartners.css';

const DeliveryPartners = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    axios
      .get('https://server1.pearl-developer.com/abhivriti/public/api/admin/getDeliveryPartners')
      .then((response) => {
        setData(response.data.deliveryPartners[0]);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        toast.error('Failed to fetch delivery partners data!');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Oval color="#007BFF" height={50} width={50} />
      </div>
    );
  }

  return (
    <div className="container">
      <ToastContainer />
      
      {/* Add/Update Button */}
      <button
        className="add-update-button"
        onClick={() => setShowModal(true)}
        style={{
          backgroundColor: '#007BFF',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          padding: '10px 20px',
          fontSize: '16px',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 6px rgba(0, 123, 255, 0.3)',
        }}
      >
        Add/Update
      </button>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="text-xl font-bold mb-4">Add/Update Delivery Partner</h2>
            <p>Feature coming soon...</p>
            <button onClick={() => setShowModal(false)} className="modal-close-button">Close</button>
          </div>
        </div>
      )}

      {/* Porter Advantage Section */}
      <div className="section">
        <h2>Porter Advantage</h2>
        <div className="row">
          {data.porter_advantage.map((advantage, index) => (
            <div key={index} className="card">
              <img src={advantage.image} alt={advantage.topic} />
              <h3>{advantage.topic}</h3>
              <p>{advantage.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="section">
        <h2>Benefits</h2>
        <div className="row">
          {data.benefits.map((benefit, index) => (
            <div key={index} className="card">
              <img src={benefit.image} alt={benefit.topic} />
              <h3>{benefit.topic}</h3>
              <p>{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Making Life Easy Section */}
      <div className="section">
        <h2>Making Life Easy</h2>
        <img src={data.making_life_easy_image} style={{ height: '200px' }} alt="Making Life Easy" className="main-image" />
        <p>{data.making_life_easy_description}</p>
      </div>

      {/* Own Multiple Vehicles Section */}
      <div className="section">
        <h2>Own Multiple Vehicles</h2>
        <img src={data.own_multiple_vehicle_image} style={{ height: '200px' }} alt="Own Multiple Vehicles" className="main-image" />
      </div>
    </div>
  );
};

export default DeliveryPartners;