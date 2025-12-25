import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Complaints.css';
import { toast, Toaster } from 'react-hot-toast';
import { RotatingLines } from 'react-loader-spinner';

const API_BASE_URL = 'https://server1.pearl-developer.com/abhivriti/public/api/admin';

const Complaints = () => {
    const [usersComplaints, setUsersComplaints] = useState([]);
    const [driversComplaints, setDriversComplaints] = useState([]);
    const [selectedEntity, setSelectedEntity] = useState(null); // Can be user or driver
    const [messages, setMessages] = useState([]);
    const [adminMessage, setAdminMessage] = useState('');
    const [complaintStatus, setComplaintStatus] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [statusToUpdate, setStatusToUpdate] = useState(null);
    const [activeTab, setActiveTab] = useState('users'); // 'users' or 'drivers'

    useEffect(() => {
        fetchAllComplaints();
    }, []);

    const fetchAllComplaints = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/get_user_messages`); // Assuming this API now returns both
            if (response.data.status && response.data.data) {
                const { users: userMessages, drivers: driverMessages } = response.data.data;

                // Process User Complaints
                const usersMap = new Map();
                if (userMessages) {
                    userMessages.forEach(msg => {
                        const entityId = msg.user_id;
                        if (!usersMap.has(entityId)) {
                            usersMap.set(entityId, {
                                id: entityId,
                                type: 'user',
                                name: msg.user_name || `User ${entityId}`,
                                latestMessage: msg.celint_massage,
                                latestMessageTime: msg.created_at,
                                status: msg.status,
                                original_message_id: msg.id // Store original message ID for updates
                            });
                        } else {
                            if (new Date(msg.created_at) > new Date(usersMap.get(entityId).latestMessageTime)) {
                                usersMap.set(entityId, {
                                    ...usersMap.get(entityId),
                                    latestMessage: msg.celint_massage,
                                    latestMessageTime: msg.created_at,
                                    status: msg.status,
                                    original_message_id: msg.id
                                });
                            }
                        }
                    });
                }
                setUsersComplaints(Array.from(usersMap.values()));

                // Process Driver Complaints
                const driversMap = new Map();
                if (driverMessages) {
                    driverMessages.forEach(msg => {
                        const entityId = msg.new_Drivers_id; // Use new_Drivers_id for drivers
                        if (!driversMap.has(entityId)) {
                            driversMap.set(entityId, {
                                id: entityId,
                                type: 'driver',
                                name: msg.driver_name || `Driver ${entityId}`,
                                latestMessage: msg.celint_massage,
                                latestMessageTime: msg.created_at,
                                status: msg.status,
                                original_message_id: msg.id
                            });
                        } else {
                            if (new Date(msg.created_at) > new Date(driversMap.get(entityId).latestMessageTime)) {
                                driversMap.set(entityId, {
                                    ...driversMap.get(entityId),
                                    latestMessage: msg.celint_massage,
                                    latestMessageTime: msg.created_at,
                                    status: msg.status,
                                    original_message_id: msg.id
                                });
                            }
                        }
                    });
                }
                setDriversComplaints(Array.from(driversMap.values()));

            } else {
                toast.error(response.data.message || "Failed to fetch complaints.");
            }
        } catch (error) {
            console.error('Error fetching all complaints:', error);
            toast.error("Failed to load complaints. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchEntityMessages = async (entityType, entityId) => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/get_user_messages`); // Still fetching all
            if (response.data.status && response.data.data) {
                const { users: userMessages, drivers: driverMessages } = response.data.data;

                let entitySpecificMessages = [];
                if (entityType === 'user' && userMessages) {
                    entitySpecificMessages = userMessages.filter(msg => msg.user_id === entityId);
                } else if (entityType === 'driver' && driverMessages) {
                    entitySpecificMessages = driverMessages.filter(msg => msg.new_Drivers_id === entityId);
                }

                // Sort messages by created_at to ensure correct order
                entitySpecificMessages.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

                setMessages(entitySpecificMessages);
                const latestStatus = entitySpecificMessages.length > 0 ? entitySpecificMessages[entitySpecificMessages.length - 1].status : null;
                setComplaintStatus(latestStatus);
            } else {
                toast.error(response.data.message || `Failed to fetch ${entityType} messages.`);
            }
        } catch (error) {
            console.error(`Error fetching messages for ${entityType} ${entityId}:`, error);
            toast.error("Failed to load messages. Please try again.");
            setMessages([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEntityClick = (entity) => {
        setSelectedEntity(entity);
        fetchEntityMessages(entity.type, entity.id);
        setAdminMessage(''); // Clear admin message when switching chats
    };

    const handleStatusBadgeClick = (status) => {
        setStatusToUpdate(status);
        setShowStatusModal(true);
    };

    const confirmStatusUpdate = async () => {
        setShowStatusModal(false);
        if (!selectedEntity || !statusToUpdate) return;

        setIsLoading(true);
        try {
            const latestMessageId = messages.length > 0 ? messages[messages.length - 1].id : null;

            if (!latestMessageId) {
                toast.error("No existing message to update status for.");
                return;
            }

            const payload = {
                status: statusToUpdate,
                admin_massage: adminMessage || null,
            };

            const response = await axios.post(`${API_BASE_URL}/massage/${latestMessageId}`, payload);

            if (response.data.status) {
                toast.success(`Complaint status updated to ${statusToUpdate}.`);
                setAdminMessage('');
                fetchEntityMessages(selectedEntity.type, selectedEntity.id); // Refresh messages
                fetchAllComplaints(); // Refresh sidebar to update status there too
            } else {
                toast.error(response.data.message || "Failed to update complaint status.");
            }
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update complaint status. Please try again.');
        } finally {
            setIsLoading(false);
            setStatusToUpdate(null);
        }
    };

    const handleSendMessage = async () => {
        if (!selectedEntity || (!adminMessage.trim() && !complaintStatus)) {
            toast.error("Please type a message or select a status.");
            return;
        }

        setIsLoading(true);
        try {
            const latestMessageId = messages.length > 0 ? messages[messages.length - 1].id : null;

            if (!latestMessageId) {
                toast.error("No existing message to respond to.");
                return;
            }

            const payload = {
                admin_massage: adminMessage.trim(),
                status: complaintStatus,
            };

            const response = await axios.post(`${API_BASE_URL}/massage/${latestMessageId}`, payload);

            if (response.data.status) {
                setAdminMessage('');
                fetchEntityMessages(selectedEntity.type, selectedEntity.id); // Refresh messages
                // Optionally refresh all complaints if sidebar needs to reflect new message quickly
                // fetchAllComplaints();
            } else {
                toast.error(response.data.message || "Failed to send message.");
            }
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error('Failed to send message. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'pending':
                return 'badge-pending';
            case 'open': // The API now uses "open" in some cases for users
                return 'badge-pending'; // Treat "open" as pending
            case 'resolved':
                return 'badge-resolved';
            case 'closed':
                return 'badge-closed';
            default:
                return 'badge-default';
        }
    };

    const currentChatList = activeTab === 'users' ? usersComplaints : driversComplaints;

    return (
        <div className="complaints-container">
            <Toaster />

            {isLoading && (
                <div className="loader-overlay">
                    <RotatingLines strokeColor="#1D4ED8" strokeWidth="5" animationDuration="0.75" width="96" visible={true} />
                </div>
            )}

            <div className="sidebar">
                <div className="sidebar-header">
                    <h2>Complaints</h2>
                    <div className="tab-buttons">
                        <button
                            className={activeTab === 'users' ? 'active' : ''}
                            onClick={() => { setActiveTab('users'); setSelectedEntity(null); setMessages([]); }}
                        >
                            Users
                        </button>
                        <button
                            className={activeTab === 'drivers' ? 'active' : ''}
                            onClick={() => { setActiveTab('drivers'); setSelectedEntity(null); setMessages([]); }}
                        >
                            Drivers
                        </button>
                    </div>
                </div>
                <div className="chat-list">
                    {currentChatList.map(entity => (
                        <div
                            key={`${entity.type}-${entity.id}`}
                            className={`chat-list-item ${selectedEntity?.id === entity.id && selectedEntity?.type === entity.type ? 'active' : ''}`}
                            onClick={() => handleEntityClick(entity)}
                        >
                            <div className="chat-avatar"></div>
                            <div className="chat-info">
                                <h3>{entity.name}</h3>
                                <p>{entity.latestMessage || "No message"}</p> {/* Handle null messages */}
                            </div>
                            <div className="chat-time">
                                {entity.latestMessageTime ? new Date(entity.latestMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                <span className={`status-badge-sidebar ${getStatusBadgeClass(entity.status)}`}>
                                    {entity.status ? entity.status.toUpperCase() : 'N/A'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="chat-area">
                {!selectedEntity ? (
                    <div className="no-chat-selected">
                        Select a chat to view messages
                    </div>
                ) : (
                    <>
                        <div className="chat-header">
                            <h3>{selectedEntity.name} ({selectedEntity.type === 'user' ? 'User' : 'Driver'})</h3>
                            <span className={`status-badge ${getStatusBadgeClass(complaintStatus)}`}>
                                {complaintStatus ? complaintStatus.toUpperCase() : 'N/A'}
                            </span>
                        </div>
                        <div className="message-list">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`message-bubble ${msg.admin_massage ? 'admin' : 'client'}`}>
                                    {/* Display client message or admin message clearly */}
                                    {msg.celint_massage && <p className="client-message">{selectedEntity.type === 'user' ? 'User' : 'Driver'}: {msg.celint_massage}</p>}
                                    {msg.admin_massage && <p className="admin-message">Admin: {msg.admin_massage}</p>}
                                    <span className="message-time">
                                        {new Date(msg.created_at).toLocaleString()}
                                    </span>
                                    {msg.status && (
                                        <span className={`message-status ${getStatusBadgeClass(msg.status)}`}>
                                            {msg.status.toUpperCase()}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="message-input-area">
                            <div className="status-badges">
                                <button
                                    className="badge badge-pending"
                                    onClick={() => handleStatusBadgeClick('pending')}
                                >
                                    Open
                                </button>
                                <button
                                    className="badge badge-resolved"
                                    onClick={() => handleStatusBadgeClick('resolved')}
                                >
                                    Resolve
                                </button>
                                <button
                                    className="badge badge-closed"
                                    onClick={() => handleStatusBadgeClick('closed')}
                                >
                                    Close
                                </button>
                            </div>
                            <textarea
                                value={adminMessage}
                                onChange={(e) => setAdminMessage(e.target.value)}
                                placeholder="Type your message..."
                                rows="3"
                            ></textarea>
                            <button onClick={handleSendMessage}>Send Message</button>
                        </div>
                    </>
                )}
            </div>

            {/* Status Confirmation Modal */}
            {showStatusModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Confirm Status Update</h3>
                        <p>Are you sure you want to change the status to "{statusToUpdate?.toUpperCase()}"?</p>
                        <div className="modal-actions">
                            <button onClick={() => setShowStatusModal(false)} className="modal-cancel-btn">Cancel</button>
                            <button onClick={confirmStatusUpdate} className="modal-confirm-btn">Confirm</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Complaints;