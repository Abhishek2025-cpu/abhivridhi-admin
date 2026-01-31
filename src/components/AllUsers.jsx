import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";
import styles from "./AllUsers.module.css";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  const [totalUsersCount, setTotalUsersCount] = useState(0);

  // Search
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        "https://test.pearl-developer.com/abhivriti/public/api/admin/all-users"
      );

      if (response.data && Array.isArray(response.data.data)) {
        let fetchedUsers = response.data.data;

        // 🔍 Global Search
        const filteredUsers = fetchedUsers.filter((user) =>
          Object.values(user).some(
            (value) =>
              value &&
              String(value).toLowerCase().includes(searchTerm.toLowerCase())
          )
        );

        setTotalUsersCount(filteredUsers.length);

        // 📄 Pagination
        const startIndex = (currentPage - 1) * usersPerPage;
        const paginatedUsers = filteredUsers.slice(
          startIndex,
          startIndex + usersPerPage
        );

        setUsers(paginatedUsers);
      } else {
        setError("Invalid API response format");
        setUsers([]);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const totalPages = Math.ceil(totalUsersCount / usersPerPage);

  const paginate = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>
        <i className="fas fa-users me-2"></i>
        All Users ({totalUsersCount})
      </h2>

      {/* 🔍 Search */}
      <div className={styles.searchBar}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="🔍 Search by any field..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* 📋 Table */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Name</th>
              <th>Mobile</th>
              <th>Verified</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center">
                  Loading users...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="5" className="text-danger text-center">
                  {error}
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user, index) => (
                <tr key={user.user_id}>
                  <td>
                    {(currentPage - 1) * usersPerPage + index + 1}
                  </td>
                  <td>{user.name || "N/A"}</td>
                  <td>{user.mobile}</td>
                  <td>
                    <span
                      className={
                        user.is_verified
                          ? styles.badgeSuccess
                          : styles.badgeDanger
                      }
                    >
                      {user.is_verified ? "Verified" : "Not Verified"}
                    </span>
                  </td>
                  <td>
                    <span
                      className={
                        user.is_active === "1"
                          ? styles.badgeSuccess
                          : styles.badgeDanger
                      }
                    >
                      {user.is_active === "1" ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 📄 Pagination */}
      {totalPages > 1 && (
        <div className={styles.paginationNav}>
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => paginate(i + 1)}
              className={currentPage === i + 1 ? styles.active : ""}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}

      <div className={styles.paginationInfo}>
        Showing{" "}
        {Math.min(
          (currentPage - 1) * usersPerPage + 1,
          totalUsersCount
        )}{" "}
        to {Math.min(currentPage * usersPerPage, totalUsersCount)} of{" "}
        {totalUsersCount} entries
      </div>
    </div>
  );
};

export default AllUsers;
