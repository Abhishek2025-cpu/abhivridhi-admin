import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BasePrice = () => {
  const [basePrice, setBasePrice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pricePerKm, setPricePerKm] = useState('');
  const [pricePerKg, setPricePerKg] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchBasePrice = async () => {
      try {
        const response = await axios.get('https://server1.pearl-developer.com/abhivriti/public/api/admin/base-price');
        setBasePrice(response.data.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBasePrice();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await axios.post('https://server1.pearl-developer.com/abhivriti/public/api/app/admin/base-price', {
        price_per_km: pricePerKm,
        price_per_kg: pricePerKg,
      });
      setBasePrice(response.data.data);
      setPricePerKm('');
      setPricePerKg('');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
      setModalOpen(false);
    } catch (err) {
      console.error('Error submitting data', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  if (error) return <p>Error fetching data</p>;

  return (
    <div className="p-4 bg-gray-100 rounded-md shadow-md">
      <h1 className="text-2xl font-bold mb-4">Base Price</h1>
      <ul className="list-none p-0">
        <li className="mb-2 p-2 bg-white rounded shadow">
          <strong className="inline-block w-40 font-semibold">Price per KM:</strong> {basePrice?.price_per_km}
        </li>
        <li className="mb-2 p-2 bg-white rounded shadow">
          <strong className="inline-block w-40 font-semibold">Price per KG:</strong> {basePrice?.price_per_kg}
        </li>
      </ul>
      <button
        onClick={() => setModalOpen(true)}
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
      >
        Add New Base Price
      </button>

      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Add New Base Price</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-2">
                <label className="block font-semibold">Price per KM:</label>
                <input
                  type="number"
                  value={pricePerKm}
                  onChange={(e) => setPricePerKm(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-2">
                <label className="block font-semibold">Price per KG:</label>
                <input
                  type="number"
                  value={pricePerKg}
                  onChange={(e) => setPricePerKg(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-400 text-white rounded"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded flex items-center justify-center"
                  disabled={submitting}
                >
                  {submitting ? (
                    <div className="loader-small"></div>
                  ) : (
                    'Submit'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {success && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded shadow-lg">
          Successfully added base price!
        </div>
      )}
    </div>
  );
};

export default BasePrice;
