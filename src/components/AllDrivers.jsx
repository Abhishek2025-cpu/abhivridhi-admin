import React, { useState, useEffect } from "react";
import axios from "axios";
import './DriverTable.css'; // Import the CSS file for styling

const DriverTable = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await axios.get("https://server1.pearl-developer.com/abhivriti/public/api/app/get_driver");
        setDrivers(response.data.drivers);
      } catch (error) {
        console.error("Error fetching driver details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDrivers();
  }, []);

  const handleDelete = (id) => {
    // Implement delete functionality here
    console.log(`Delete driver with ID: ${id}`);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="driver-table-container">
      <h2>Driver Details</h2>
      <table className="driver-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>City</th>
            <th>State</th>
            <th>Vehicle Type</th>
            <th>Vehicle Number</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {drivers.map((driver) => (
            <tr key={driver.id}>
              <td>{driver.id}</td>
              <td>{driver.name}</td>
              <td>{driver.phone}</td>
              <td>{driver.email}</td>
              <td>{driver.city}</td>
              <td>{driver.state}</td>
              <td>{driver.vehicle_type}</td>
              <td>{driver.vehicle_number}</td>
              <td>
                <button
                  onClick={() => handleDelete(driver.id)}
                  className="delete-button"
                >
                  <img
                    src="https://img.icons8.com/ios-filled/24/000000/trash.png"
                    alt="Delete"
                  />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DriverTable;
