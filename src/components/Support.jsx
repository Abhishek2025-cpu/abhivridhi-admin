import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import './SupportManager.css';

const API_BASE = 'https://server1.pearl-developer.com/abhivriti/public/api';

const Support = () => {
  const [supportList, setSupportList] = useState([]);
  const [formData, setFormData] = useState({ email: '', contact_no: '', messages: '' });
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [alert, setAlert] = useState({ show: false, msg: '', type: 'success' });
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  // 1. Wrapped showAlert in useCallback to prevent re-creation on every render
  const showAlert = useCallback((msg, type = 'success') => {
    setAlert({ show: true, msg, type });
    setTimeout(() => setAlert({ show: false, msg: '', type: 'success' }), 3000);
  }, []);

  // 2. Wrapped fetchSupportData in useCallback and added showAlert as dependency
  const fetchSupportData = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE}/app/get_support`);
      setSupportList(res.data.reverse());
    } catch {
      showAlert('Failed to fetch data', 'error');
    }
  }, [showAlert]);

  // 3. Added fetchSupportData to useEffect dependency array
  useEffect(() => {
    fetchSupportData();
  }, [fetchSupportData]);

  const handleSubmit = async () => {
    const url = editId
      ? `${API_BASE}/admin/update_support/${editId}`
      : `${API_BASE}/app/add_support`;

    try {
      await axios.post(url, formData);
      showAlert(editId ? 'Updated successfully' : 'Added successfully');
      setFormData({ email: '', contact_no: '', messages: '' });
      setEditId(null);
      setShowModal(false);
      fetchSupportData();
    } catch {
      showAlert('Submission failed', 'error');
    }
  };

  const handleEdit = (item) => {
    setFormData({ email: item.email, contact_no: item.contact_no, messages: item.messages });
    setEditId(item.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.get(`${API_BASE}/admin/delete_support/${id}`);
      showAlert('Deleted successfully', 'info');
      fetchSupportData();
    } catch {
      showAlert('Delete failed', 'error');
    }
  };

  const filteredList = supportList.filter(
    (item) =>
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.contact_no.includes(searchTerm) ||
      item.messages.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedList = filteredList.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const totalPages = Math.ceil(filteredList.length / rowsPerPage);

  return (
    <div className="support-container">
      <h2>Support Manager</h2>

      <div className="toolbar">
        <button onClick={() => { setFormData({ email: '', contact_no: '', messages: '' }); setEditId(null); setShowModal(true); }}>
          + Add Support
        </button>
        <input
          type="text"
          placeholder="Search by email, number or message"
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
        />
      </div>

      <table className="support-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Email</th>
            <th>Contact No</th>
            <th>Message</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedList.map((item, index) => (
            <tr key={item.id}>
              <td>{(currentPage - 1) * rowsPerPage + index + 1}</td>
              <td>{item.email}</td>
              <td>{item.contact_no}</td>
              <td>{item.messages}</td>
              <td>{item.created_at}</td>
              <td>
                <button className="edit-btn" onClick={() => handleEdit(item)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(item.id)}>Delete</button>
              </td>
            </tr>
          ))}
          {paginatedList.length === 0 && (
            <tr>
              <td colSpan="6">No data found.</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="pagination">
        {[...Array(totalPages)].map((_, idx) => (
          <button
            key={idx}
            className={currentPage === idx + 1 ? 'active' : ''}
            onClick={() => setCurrentPage(idx + 1)}
          >
            {idx + 1}
          </button>
        ))}
      </div>

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>{editId ? 'Edit Support' : 'Add Support'}</h3>
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <input
              type="text"
              placeholder="Contact Number"
              value={formData.contact_no}
              onChange={(e) => setFormData({ ...formData, contact_no: e.target.value })}
            />
            <textarea
              rows="4"
              placeholder="Message"
              value={formData.messages}
              onChange={(e) => setFormData({ ...formData, messages: e.target.value })}
            />
            <div className="modal-actions">
              <button className="cancel" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="submit" onClick={handleSubmit}>{editId ? 'Update' : 'Submit'}</button>
            </div>
          </div>
        </div>
      )}

      {alert.show && (
        <div className={`alert ${alert.type}`}>{alert.msg}</div>
      )}
    </div>
  );
};

export default Support;