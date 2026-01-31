import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { FaSpinner, FaUsers, FaSearch } from 'react-icons/fa'; // Added FaSearch icon
import './DriverTable.css';

const DriverTable = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [driversPerPage] = useState(10);
  const [filters, setFilters] = useState({
    vehicle_type: "",
    city: "",
    state: "",
  });
  const [searchTerm, setSearchTerm] = useState(""); // New state for search term

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://test.pearl-developer.com/abhivriti/public/api/app/get_driver"
      );
      setDrivers(response.data.drivers);
    } catch (error) {
      console.error("Error fetching driver details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when search term changes
  };

  const filteredAndSearchedDrivers = useMemo(() => {
    let tempDrivers = drivers;

    // Apply dropdown filters
    tempDrivers = tempDrivers.filter((driver) => {
      return (
        (filters.vehicle_type === "" || driver.vehicle_type.toLowerCase() === filters.vehicle_type.toLowerCase()) &&
        (filters.city === "" || driver.city.toLowerCase() === filters.city.toLowerCase()) &&
        (filters.state === "" || driver.state.toLowerCase() === filters.state.toLowerCase())
      );
    });

    // Apply search term filter
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      tempDrivers = tempDrivers.filter((driver) => {
        return (
          driver.name.toLowerCase().includes(lowerCaseSearchTerm) ||
          (driver.phone && driver.phone.toLowerCase().includes(lowerCaseSearchTerm)) || // Check for phone existence
          (driver.email && driver.email.toLowerCase().includes(lowerCaseSearchTerm)) ||   // Check for email existence
          (driver.city && driver.city.toLowerCase().includes(lowerCaseSearchTerm)) ||
          (driver.state && driver.state.toLowerCase().includes(lowerCaseSearchTerm)) ||
          (driver.vehicle_type && driver.vehicle_type.toLowerCase().includes(lowerCaseSearchTerm)) ||
          (driver.vehicle_number && driver.vehicle_number.toLowerCase().includes(lowerCaseSearchTerm))
        );
      });
    }

    return tempDrivers;
  }, [drivers, filters, searchTerm]); // Depend on drivers, filters, and searchTerm

  // Get current drivers for pagination
  const indexOfLastDriver = currentPage * driversPerPage;
  const indexOfFirstDriver = indexOfLastDriver - driversPerPage;
  const currentDrivers = filteredAndSearchedDrivers.slice(indexOfFirstDriver, indexOfLastDriver);

  // Calculate total pages
  const totalPages = Math.ceil(filteredAndSearchedDrivers.length / driversPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Generate unique filter options
  const uniqueVehicleTypes = useMemo(() => {
    const types = drivers.map(driver => driver.vehicle_type).filter(Boolean); // Filter out undefined/null
    return [...new Set(types)].sort();
  }, [drivers]);

  const uniqueCities = useMemo(() => {
    const cities = drivers.map(driver => driver.city).filter(Boolean);
    return [...new Set(cities)].sort();
  }, [drivers]);

  const uniqueStates = useMemo(() => {
    const states = drivers.map(driver => driver.state).filter(Boolean);
    return [...new Set(states)].sort();
  }, [drivers]);

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="container">
      <h2 className="heading">
        <FaUsers /> Driver Details
      </h2>

      {/* Search Bar */}
      <div className="searchBar">
        <FaSearch className="searchIcon" />
        <input
          type="text"
          placeholder="Search by name, vehicle, city, state, etc."
          value={searchTerm}
          onChange={handleSearchChange}
          className="searchInput"
        />
      </div>

      <div className="tableContainer">
        <table className="table">
          <thead>
            <tr>
              <th>SR No.</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>
                <select
                  name="city"
                  value={filters.city}
                  onChange={handleFilterChange}
                  className="filterSelect"
                  title="Filter by City"
                >
                  <option value="">City (All)</option>
                  {uniqueCities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </th>
              <th>
                <select
                  name="state"
                  value={filters.state}
                  onChange={handleFilterChange}
                  className="filterSelect"
                  title="Filter by State"
                >
                  <option value="">State (All)</option>
                  {uniqueStates.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </th>
              <th>
                <select
                  name="vehicle_type"
                  value={filters.vehicle_type}
                  onChange={handleFilterChange}
                  className="filterSelect"
                  title="Filter by Vehicle Type"
                >
                  <option value="">Vehicle Type (All)</option>
                  {uniqueVehicleTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </th>
              <th>Vehicle Number</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="loadingRow">
                  <FaSpinner className="spinnerBorder" /> Loading Drivers...
                </td>
              </tr>
            ) : currentDrivers.length > 0 ? (
              currentDrivers.map((driver, index) => (
                <tr key={driver.id}>
                  <td>{indexOfFirstDriver + index + 1}</td>
                  <td>{driver.name}</td>
                  <td>{driver.phone}</td>
                  <td>{driver.email}</td>
                  <td>{driver.city}</td>
                  <td>{driver.state}</td>
                  <td>
                    <span className="badge badgeInfo">{driver.vehicle_type}</span>
                  </td>
                  <td>{driver.vehicle_number}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-data">No drivers found matching your criteria.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {!loading && totalPages > 1 && (
        <nav className="paginationNav">
          <ul className="paginationList">
            <li className={`pageItem ${currentPage === 1 ? 'disabled' : ''}`}>
              <button
                onClick={() => paginate(currentPage - 1)}
                className="pageButton"
                disabled={currentPage === 1}
              >
                Previous
              </button>
            </li>
            {pageNumbers.map((number) => (
              <li key={number} className={`pageItem ${currentPage === number ? 'active' : ''}`}>
                <button
                  onClick={() => paginate(number)}
                  className="pageButton"
                >
                  {number}
                </button>
              </li>
            ))}
            <li className={`pageItem ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button
                onClick={() => paginate(currentPage + 1)}
                className="pageButton"
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}
      {!loading && (
        <div className="paginationInfo">
          Showing {currentDrivers.length} of {filteredAndSearchedDrivers.length} drivers.
          Total {totalPages} pages.
        </div>
      )}
    </div>
  );
};

export default DriverTable;