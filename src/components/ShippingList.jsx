import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ShippingList = () => {
  const [shippingData, setShippingData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    axios.get('https://server1.pearl-developer.com/abhivriti/public/api/app/get_shipping')
      .then(response => {
        const data = response.data.data || [];
        setShippingData(data);
        setFilteredData(data);
      })
      .catch(error => {
        console.error("Error fetching shipping data:", error);
      });
  }, []);

  useEffect(() => {
    let result = [...shippingData];

    if (statusFilter !== 'All') {
      result = result.filter(item => (item.status || 'Pending') === statusFilter);
    }

    if (search) {
      result = result.filter(item =>
        item.order_id?.toLowerCase().includes(search.toLowerCase()) ||
        item.start_location?.toLowerCase().includes(search.toLowerCase()) ||
        item.end_location?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (sortField) {
      result.sort((a, b) => {
        const valA = a[sortField];
        const valB = b[sortField];
        if (sortOrder === 'asc') return valA > valB ? 1 : -1;
        else return valA < valB ? 1 : -1;
      });
    }

    setFilteredData(result);
  }, [search, sortField, sortOrder, statusFilter, shippingData]);

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return '⇅';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <h4 className="card-title mb-4">📦 Shipping Orders</h4>

          {/* Filters */}
          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="🔍 Search by Order ID or Location"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle text-center">
              <thead className="table-primary">
                <tr>
                  <th onClick={() => toggleSort('order_id')} style={{ cursor: 'pointer' }}>
                    Order ID {getSortIcon('order_id')}
                  </th>
                  <th>From</th>
                  <th>To</th>
                  <th onClick={() => toggleSort('type')} style={{ cursor: 'pointer' }}>
                    Type {getSortIcon('type')}
                  </th>
                  <th onClick={() => toggleSort('weight')} style={{ cursor: 'pointer' }}>
                    Weight {getSortIcon('weight')}
                  </th>
                  <th onClick={() => toggleSort('price')} style={{ cursor: 'pointer' }}>
                    Price {getSortIcon('price')}
                  </th>
                  <th>Status</th>
                  <th>Progress</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map(item => (
                    <tr key={item.id}>
                      <td><strong>{item.order_id}</strong></td>
                      <td>{item.start_location}</td>
                      <td>{item.end_location}</td>
                      <td>{item.type}</td>
                      <td>{item.weight} kg</td>
                      <td>₹{item.price}</td>
                      <td>
                        <span className={`badge bg-${item.status === 'Delivered' ? 'success' : item.status === 'In Progress' ? 'warning' : 'secondary'}`}>
                          {item.status || 'Pending'}
                        </span>
                      </td>
                      <td>
                        <div className="progress" style={{ height: '20px' }}>
                          <div
                            className={`progress-bar ${item.status === 'Delivered' ? 'bg-success' : item.status === 'In Progress' ? 'bg-warning' : 'bg-secondary'}`}
                            role="progressbar"
                            style={{ width: `${item.progress || 0}%` }}
                            aria-valuenow={item.progress || 0}
                            aria-valuemin="0"
                            aria-valuemax="100"
                          >
                            {item.progress ? `${item.progress}%` : '0%'}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-muted">No shipping data found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingList;
