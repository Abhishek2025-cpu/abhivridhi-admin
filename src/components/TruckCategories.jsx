import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TruckCategories = () => {
    const [truckCategories, setTruckCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTruckCategories = async (retryCount = 0) => {
            try {
                const response = await axios.get('https://test.pearl-developer.com/abhivriti/public/api/admin/truckCategories');
                setTruckCategories(response.data.data);
            } catch (err) {
                if (err.response && err.response.status === 429 && retryCount < 5) {
                    const retryAfter = err.response.headers['retry-after'] || 2 ** retryCount;
                    setTimeout(() => fetchTruckCategories(retryCount + 1), retryAfter * 1000);
                } else {
                    console.error('Error fetching data:', err);
                    setError(err.message || 'An error occurred');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchTruckCategories();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
            </div>
        );
    }

    if (error) return <p>{`Error fetching data: ${error}`}</p>;

    return (
        <div className="p-4 bg-gray-100 rounded-md shadow-md">
            <h1 className="text-2xl font-bold mb-4">Truck Categories</h1>
            <div className="hidden md:block">
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border border-gray-300 px-4 py-2">Category Name</th>
                            <th className="border border-gray-300 px-4 py-2">Capacity</th>
                            <th className="border border-gray-300 px-4 py-2">Length</th>
                            <th className="border border-gray-300 px-4 py-2">Breadth</th>
                            <th className="border border-gray-300 px-4 py-2">Height</th>
                        </tr>
                    </thead>
                    <tbody>
                        {truckCategories.map(category => (
                            <tr key={category.id} className="bg-white">
                                <td className="border border-gray-300 px-4 py-2">{category.name}</td>
                                <td className="border border-gray-300 px-4 py-2">{category.capacity}</td>
                                <td className="border border-gray-300 px-4 py-2">{category.length}</td>
                                <td className="border border-gray-300 px-4 py-2">{category.breadth}</td>
                                <td className="border border-gray-300 px-4 py-2">{category.height}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="md:hidden">
                <ul className="list-none p-0">
                    {truckCategories.map(category => (
                        <li key={category.id} className="mb-2 p-4 bg-white rounded shadow">
                            <p><strong>Category Name:</strong> {category.name}</p>
                            <p><strong>Capacity:</strong> {category.capacity}</p>
                            <p><strong>Length:</strong> {category.length}</p>
                            <p><strong>Breadth:</strong> {category.breadth}</p>
                            <p><strong>Height:</strong> {category.height}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default TruckCategories;
