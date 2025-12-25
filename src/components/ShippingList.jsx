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
  <div style={styles.container}>
  <h2 style={{ marginBottom: '20px' }}>📦 Shipping Orders</h2>

  {/* Filters */}
  <div style={styles.filters}>
    <input
      type="text"
      placeholder="🔍 Search by Order ID or Location"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      style={styles.input}
    />
    <select
      value={statusFilter}
      onChange={(e) => setStatusFilter(e.target.value)}
      style={styles.input}
    >
      <option value="All">All Status</option>
      <option value="Pending">Pending</option>
      <option value="In Progress">In Progress</option>
      <option value="Delivered">Delivered</option>
    </select>
  </div>

  {/* Table */}
  <div style={{ overflowX: 'auto' }}>
    <table style={styles.table}>
      <thead>
        <tr>
          <th style={styles.th} onClick={() => toggleSort('order_id')}>Order ID {getSortIcon('order_id')}</th>
          <th style={styles.th}>From</th>
          <th style={styles.th}>To</th>
          <th style={styles.th} onClick={() => toggleSort('type')}>Type {getSortIcon('type')}</th>
          <th style={styles.th} onClick={() => toggleSort('weight')}>Weight {getSortIcon('weight')}</th>
          <th style={styles.th} onClick={() => toggleSort('price')}>Price {getSortIcon('price')}</th>
          <th style={styles.th}>Status</th>
          <th style={styles.th}>Progress</th>
          <th style={styles.th}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {filteredData.length > 0 ? (
          filteredData.map((item) => (
            <tr key={item.id}>
              <td style={styles.td}><strong>{item.order_id}</strong></td>
              <td style={styles.td}>{item.start_location}</td>
              <td style={styles.td}>{item.end_location}</td>
              <td style={styles.td}>{item.type}</td>
              <td style={styles.td}>{item.weight} kg</td>
              <td style={styles.td}>₹{item.price}</td>
              <td style={styles.td}>
                <span style={{
                  ...styles.badge,
                  backgroundColor:
                    item.status === 'Delivered' ? '#28a745'
                      : item.status === 'In Progress' ? '#ffc107'
                        : '#6c757d'
                }}>
                  {item.status || 'Pending'}
                </span>
              </td>
              <td style={styles.td}>
                <div style={styles.progressWrapper}>
                  <div style={styles.progressBar(item.status, item.progress)}>
                    {item.progress ? `${item.progress}%` : '0%'}
                  </div>
                </div>
              </td>
              <td style={styles.td}>
                <div style={styles.actionBtns}>
                  <button style={styles.btn('#007bff')}>View</button>
                  <button style={styles.btn('#28a745')}>Edit</button>
                  <button style={styles.btn('#dc3545')}>Delete</button>
                </div>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="9" style={{ ...styles.td, color: '#777' }}>No shipping data found.</td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>

  );
};


const styles = {
  container: {
    maxWidth: '1000px',
    margin: '40px auto',
    padding: '20px',
    background: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    fontFamily: 'Arial, sans-serif',
  },
  filters: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    marginBottom: '20px',
  },
  input: {
    flex: 1,
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'center',
  },
  th: {
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
    padding: '12px',
  },
  td: {
    padding: '12px',
    borderBottom: '1px solid #eee',
  },
  badge: {
    padding: '4px 8px',
    borderRadius: '5px',
    color: '#fff',
    fontSize: '0.85em',
  },
  progressWrapper: {
    height: '20px',
    backgroundColor: '#eee',
    borderRadius: '10px',
    overflow: 'hidden',
  },
  progressBar: (status, progress) => ({
    height: '100%',
    width: `${progress || 0}%`,
    backgroundColor:
      status === 'Delivered' ? '#28a745' : status === 'In Progress' ? '#ffc107' : '#6c757d',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
  }),
  actionBtns: {
    display: 'flex',
    gap: '8px',
    justifyContent: 'center',
  },
  btn: (color) => ({
    padding: '5px 10px',
    border: `1px solid ${color}`,
    backgroundColor: 'transparent',
    color,
    borderRadius: '4px',
    cursor: 'pointer',
  }),
};


export default ShippingList;
