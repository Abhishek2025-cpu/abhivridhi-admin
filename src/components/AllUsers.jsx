import React, { useEffect, useState } from "react";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios
      .get("https://server1.pearl-developer.com/abhivriti/public/api/app/getalluser")
      .then((response) => {
        if (response.data && Array.isArray(response.data.users)) {
          setUsers(response.data.users);
        } else {
          console.error("Invalid API response format");
        }
      })
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.mobile?.includes(search)
  );

  const getUserTypeBadge = (type) => {
    switch (type?.toLowerCase()) {
      case "customer":
        return (
          <span className="badge bg-info text-dark">
            <i className="fas fa-user-tag me-1"></i>Customer
          </span>
        );
      case "delivery" :
      case "delivery_partner":
        return (
          <span className="badge bg-warning text-dark">
            <i className="fas fa-truck me-1"></i>Delivery
          </span>
        );
      case "user":
        return (
          <span className="badge bg-secondary">
            <i className="fas fa-user me-1"></i>User
          </span>
        );
      case "0":
        return (
          <span className="badge bg-danger">
            <i className="fas fa-exclamation-triangle me-1"></i>Unknown
          </span>
        );
      default:
        return (
          <span className="badge bg-light text-dark">{type || "N/A"}</span>
        );
    }
  };

  return (
    <div className="container mt-4">
      <style>{`
        .table {
          border: 2px solid #4a90e2;
          border-collapse: separate;
          border-spacing: 0;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .table th, .table td {
          border: 1px solid #4a90e2;
          vertical-align: middle;
          padding: 12px 15px;
        }

        .table thead th {
          background-color: #4a90e2;
          color: white;
          position: sticky;
          top: 0;
          z-index: 2;
          font-weight: 600;
        }

        .table tbody tr:nth-child(odd) {
          background-color: #f0f7ff;
        }

        .table tbody tr:nth-child(even) {
          background-color: #e6f0ff;
        }

        .table tbody tr:hover {
          background-color: #c2daf7;
          cursor: pointer;
        }

        .badge {
          font-weight: 600;
          padding: 0.35em 0.65em;
          font-size: 0.9em;
          border-radius: 0.375rem;
        }
      `}</style>

      <h2 className="mb-3">
        <i className="fas fa-users me-2"></i>All Users ({filteredUsers.length})
      </h2>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="🔍 Search by name or mobile..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="table-responsive">
        <table className="table align-middle text-center table-striped table-bordered shadow-sm">
          <thead className="table-primary sticky-top">
            <tr>
              <th>S.No</th>
              <th><i className="fas fa-user me-1"></i>Name</th>
              <th><i className="fas fa-phone-alt me-1"></i>Mobile</th>
              <th><i className="fas fa-id-badge me-1"></i>User Type</th>
              <th><i className="fas fa-city me-1"></i>City</th>
              <th><i className="fas fa-car me-1"></i>Vehicle</th>
              <th><i className="fas fa-calendar-alt me-1"></i>Registered At</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <tr key={user._id || index}>
                <td>
                  <span className="badge bg-secondary">{index + 1}</span>
                </td>

                <td>
                  <span className="badge bg-info text-dark p-2">
                    {user.name || "N/A"}
                  </span>
                </td>

                <td>
                  <span className="badge bg-dark p-2">{user.mobile || "N/A"}</span>
                </td>

                <td>{getUserTypeBadge(user.user_type)}</td>

                <td>
                  <span className="badge bg-light text-dark border p-2">
                    {user.city || "N/A"}
                  </span>
                </td>

                <td>
                  <span className="badge bg-danger-subtle text-dark border p-2">
                    {user.vehicle || "N/A"}
                  </span>
                </td>

                <td>
                  <span className="badge bg-light text-dark p-2">
                    {user.created_at
                      ? new Date(user.created_at).toLocaleString()
                      : "N/A"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllUsers;