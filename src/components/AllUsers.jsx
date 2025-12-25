import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";
import styles from "./AllUsers.module.css"; // Import the CSS module

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10); // 10 entries per page
  const [totalFilteredUsersCount, setTotalFilteredUsersCount] = useState(0);

  // Filter states
  const [userTypeFilter, setUserTypeFilter] = useState("all");
  const [vehicleFilter, setVehicleFilter] = useState("all");

  // Search state
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // In a true server-side scenario, these parameters would be sent to the API.
      // For this example, we fetch all, then filter/paginate client-side.
      const response = await axios.get(
        "https://server1.pearl-developer.com/abhivriti/public/api/app/getalluser"
      );

      if (response.data && Array.isArray(response.data.users)) {
        let fetchedUsers = response.data.users;

        // Sort by creation date in descending order (latest first)
        fetchedUsers.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        // Apply dynamic search across all fields
        const filteredBySearch = fetchedUsers.filter((user) =>
          Object.values(user).some(
            (value) =>
              value &&
              String(value).toLowerCase().includes(searchTerm.toLowerCase())
          )
        );

        // Apply user type filter
        const filteredByUserType =
          userTypeFilter === "all"
            ? filteredBySearch
            : filteredBySearch.filter(
                (user) => user.user_type?.toLowerCase() === userTypeFilter
              );

        // Apply vehicle filter
        const filteredByVehicle =
          vehicleFilter === "all"
            ? filteredByUserType
            : filteredByUserType.filter(
                (user) => user.vehicle?.toLowerCase() === vehicleFilter
              );

        // Update total count of filtered users (before pagination)
        setTotalFilteredUsersCount(filteredByVehicle.length);

        // Apply client-side pagination
        const offset = (currentPage - 1) * usersPerPage;
        const paginatedUsers = filteredByVehicle.slice(offset, offset + usersPerPage);

        setUsers(paginatedUsers);
      } else {
        setError("Invalid API response format");
        setUsers([]);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to fetch users.");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, usersPerPage, userTypeFilter, vehicleFilter, searchTerm]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Calculate total pages based on filtered count
  const totalPages = Math.ceil(totalFilteredUsersCount / usersPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getUserTypeBadge = (type) => {
    switch (type?.toLowerCase()) {
      case "customer":
        return (
          <span className={`${styles.badge} ${styles.badgeInfo}`}>
            <i className="fas fa-user-tag me-1"></i>Customer
          </span>
        );
      case "delivery":
      case "delivery_partner":
        return (
          <span className={`${styles.badge} ${styles.badgeWarning}`}>
            <i className="fas fa-truck me-1"></i>Delivery
          </span>
        );
      case "user":
        return (
          <span className={`${styles.badge} ${styles.badgeSecondary}`}>
            <i className="fas fa-user me-1"></i>User
          </span>
        );
      case "0": // Assuming '0' might represent an unknown/default user type
        return (
          <span className={`${styles.badge} ${styles.badgeDanger}`}>
            <i className="fas fa-exclamation-triangle me-1"></i>Unknown
          </span>
        );
      default:
        return (
          <span className={`${styles.badge} ${styles.badgeLight}`}>
            {type || "N/A"}
          </span>
        );
    }
  };

  // Predefined lists for filters to control options and prevent dynamic extraction issues
  const userTypeOptions = ["all", "customer", "delivery_partner", "user"];
  const vehicleOptions = ["all", "two_wheeler", "three_wheeler", "mini_truck", "van", "truck"];


  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>
        <i className="fas fa-users"></i>All Users ({totalFilteredUsersCount})
      </h2>

      <div className={styles.searchBar}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="🔍 Search dynamically by any field..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Reset to first page on search
          }}
        />
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>S.No</th>
              <th><i className="fas fa-user me-1"></i>Name</th>
              <th><i className="fas fa-phone-alt me-1"></i>Mobile</th>
              <th>
                <div className={styles.filterHeader}>
                  <div className={styles.filterHeaderTitle}>
                    <i className="fas fa-id-badge me-1"></i>User Type
                  </div>
                  <select
                    className={styles.filterSelect}
                    value={userTypeFilter}
                    onChange={(e) => {
                      setUserTypeFilter(e.target.value);
                      setCurrentPage(1); // Reset to first page on filter change
                    }}
                  >
                    {userTypeOptions.map((type) => (
                      <option key={type} value={type}>
                        {type === "all" ? "All Types" : type.replace(/_/g, ' ')}
                      </option>
                    ))}
                  </select>
                </div>
              </th>
              <th><i className="fas fa-city me-1"></i>City</th>
              <th>
                <div className={styles.filterHeader}>
                  <div className={styles.filterHeaderTitle}>
                    <i className="fas fa-car me-1"></i>Vehicle
                  </div>
                  <select
                    className={styles.filterSelect}
                    value={vehicleFilter}
                    onChange={(e) => {
                      setVehicleFilter(e.target.value);
                      setCurrentPage(1); // Reset to first page on filter change
                    }}
                  >
                    {vehicleOptions.map((vehicle) => (
                      <option key={vehicle} value={vehicle}>
                        {vehicle === "all" ? "All Vehicles" : vehicle.replace(/_/g, ' ')}
                      </option>
                    ))}
                  </select>
                </div>
              </th>
              <th><i className="fas fa-calendar-alt me-1"></i>Registered At</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr className={styles.loadingRow}>
                <td colSpan="7">
                  <div className="d-flex justify-content-center align-items-center py-3">
                    <div className={styles.spinnerBorder} role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <span className="ms-2">Loading users...</span>
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr className={styles.errorRow}>
                <td colSpan="7" className="text-danger">
                  <i className="fas fa-exclamation-circle me-1"></i> {error}
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center">No users found matching your criteria.</td>
              </tr>
            ) : (
              users.map((user, index) => (
                <tr key={user.id || index}>
                  <td>
                    <span className={`${styles.badge} ${styles.badgeSecondary}`}>
                      {(currentPage - 1) * usersPerPage + index + 1}
                    </span>
                  </td>
                  <td>
                    <span className={`${styles.badge} ${styles.badgeInfo}`}>
                      {user.name || "N/A"}
                    </span>
                  </td>
                  <td>
                    <span className={`${styles.badge} ${styles.badgeDark}`}>
                      {user.mobile || "N/A"}
                    </span>
                  </td>
                  <td>{getUserTypeBadge(user.user_type)}</td>
                  <td>
                    <span className={`${styles.badge} ${styles.badgeLight}`}>
                      {user.city || "N/A"}
                    </span>
                  </td>
                  <td>
                    <span className={`${styles.badge} ${styles.badgeDangerSubtle}`}>
                      {user.vehicle ? user.vehicle.replace(/_/g, ' ') : "N/A"}
                    </span>
                  </td>
                  <td>
                    <span className={`${styles.badge} ${styles.badgeLight}`}>
                      {user.created_at
                        ? new Date(user.created_at).toLocaleString()
                        : "N/A"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className={styles.paginationNav} aria-label="Page navigation">
          <ul className={styles.paginationList}>
            <li className={`${styles.pageItem} ${currentPage === 1 ? styles.disabled : ""}`}>
              <button
                className={styles.pageButton}
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
            </li>
            {Array.from({ length: totalPages }).map((_, i) => (
              <li
                key={i}
                className={`${styles.pageItem} ${currentPage === i + 1 ? styles.active : ""}`}
              >
                <button className={styles.pageButton} onClick={() => paginate(i + 1)}>
                  {i + 1}
                </button>
              </li>
            ))}
            <li
              className={`${styles.pageItem} ${
                currentPage === totalPages ? styles.disabled : ""
              }`}
            >
              <button
                className={styles.pageButton}
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}
       <div className={styles.paginationInfo}>
        Showing {Math.min((currentPage - 1) * usersPerPage + 1, totalFilteredUsersCount)} to {Math.min(currentPage * usersPerPage, totalFilteredUsersCount)} of {totalFilteredUsersCount} entries
      </div>
    </div>
  );
};

export default AllUsers;