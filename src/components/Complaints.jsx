import React, { useState, useEffect } from 'react';
import './Complaints.css';
import { toast, Toaster } from 'react-hot-toast';
import { RotatingLines } from 'react-loader-spinner';
import { motion, AnimatePresence } from 'framer-motion';
import { jsPDF } from "jspdf";
import {
    User, Truck, MessageSquare, CheckCircle, XCircle, Clock, Send, Image as ImageIcon,
    Search, ChevronRight, FileText, UserSquare, Phone, DollarSign, AlertCircle, Download, Trash2
} from 'lucide-react';
import { getAllComplaints, getMessageById, updateUserMessageStatus, deleteUserMessage } from '../auth/authController';

const Complaints = () => {
    const [userTickets, setUserTickets] = useState([]);
    const [driverTickets, setDriverTickets] = useState([]);
    const [selectedTicketId, setSelectedTicketId] = useState(null);
    const [ticketDetail, setTicketDetail] = useState(null);
    const [adminMessage, setAdminMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isDetailLoading, setIsDetailLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('users');
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [statusToUpdate, setStatusToUpdate] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await getAllComplaints();
            if (response.status && response.data) {
                const uTickets = [];
                const dTickets = [];
                response.data.forEach(item => {
                    if (item.user_id) uTickets.push(item);
                    else if (item.driver_id) dTickets.push(item);
                });
                uTickets.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                dTickets.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                setUserTickets(uTickets);
                setDriverTickets(dTickets);
            }
        } catch (error) {
            toast.error("Failed to load complaints.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectComplaint = async (id) => {
        if (selectedTicketId === id) return;
        setSelectedTicketId(id);
        setIsDetailLoading(true);
        setTicketDetail(null);
        try {
            const res = await getMessageById(id);
            if (res.status) setTicketDetail(res.data);
        } catch (error) {
            toast.error("Could not fetch details");
        } finally {
            setIsDetailLoading(false);
        }
    };

    const handleDeleteTicket = async (e, id) => {
        e.stopPropagation();
        if (!window.confirm("Are you sure you want to delete this ticket?")) return;

        const toastId = toast.loading("Deleting...");
        try {
            const res = await deleteUserMessage(id);
            if (res.status) {
                toast.success("Ticket deleted", { id: toastId });
                setUserTickets(prev => prev.filter(t => t.id !== id));
                setDriverTickets(prev => prev.filter(t => t.id !== id));
                if (selectedTicketId === id) {
                    setSelectedTicketId(null);
                    setTicketDetail(null);
                }
            } else {
                toast.error(res.message || "Delete failed", { id: toastId });
            }
        } catch (error) {
            toast.error("Error deleting ticket", { id: toastId });
        }
    };

    const downloadEvidenceAsPDF = async (url, ticketId) => {
        if (!url) return;
        const toastId = toast.loading("Generating PDF...");
        try {
            const evidenceUrl = url.startsWith('http') ? url : `https://test.pearl-developer.com/abhivriti/public/${url}`;
            const response = await fetch(evidenceUrl, { mode: 'cors' });
            const blob = await response.blob();
            
            if (blob.type === 'application/pdf') {
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `Evidence_${ticketId}.pdf`;
                link.click();
                toast.success("Downloaded", { id: toastId });
                return;
            }

            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => {
                const pdf = new jsPDF();
                const img = new Image();
                img.src = reader.result;
                img.onload = () => {
                    const pageWidth = pdf.internal.pageSize.getWidth();
                    const pageHeight = pdf.internal.pageSize.getHeight();
                    const ratio = img.width / img.height;
                    let newWidth = pageWidth - 20;
                    let newHeight = newWidth / ratio;
                    if (newHeight > (pageHeight - 20)) {
                        newHeight = pageHeight - 20;
                        newWidth = newHeight * ratio;
                    }
                    pdf.text(`Evidence for Ticket #${ticketId}`, 10, 10);
                    pdf.addImage(reader.result, 'JPEG', 10, 20, newWidth, newHeight);
                    pdf.save(`Evidence_${ticketId}.pdf`);
                    toast.success("Downloaded as PDF", { id: toastId });
                };
            };
        } catch (error) {
            toast.error("Download failed", { id: toastId });
        }
    };

    const confirmStatusUpdate = async () => {
        if (!ticketDetail || !statusToUpdate) return;
        setShowStatusModal(false);
        const toastId = toast.loading("Updating...");
        try {
            const payload = { message: adminMessage || "Status updated", status: statusToUpdate };
            const response = await updateUserMessageStatus(ticketDetail.id, payload);
            if (response.status) {
                toast.success("Updated successfully", { id: toastId });
                setAdminMessage('');
                await handleSelectComplaint(ticketDetail.id);
                await fetchData();
            }
        } catch (error) {
            toast.error("Update failed", { id: toastId });
        }
    };

    const getStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending': return { color: '#f59e0b', bg: '#fef3c7', icon: <Clock size={14} /> };
            case 'resolved': return { color: '#10b981', bg: '#d1fae5', icon: <CheckCircle size={14} /> };
            case 'rejected': return { color: '#ef4444', bg: '#fee2e2', icon: <XCircle size={14} /> };
            default: return { color: '#6b7280', bg: '#f3f4f6', icon: <AlertCircle size={14} /> };
        }
    };

    const currentList = activeTab === 'users' ? userTickets : driverTickets;
    const filteredList = currentList.filter(item => {
        const term = searchTerm.toLowerCase();
        return (item.user?.name || item.driver?.name || "").toLowerCase().includes(term) || 
               (item.subject || "").toLowerCase().includes(term) || 
               (item.order_id || "").toLowerCase().includes(term);
    });

    return (
        <div className="complaints-app">
            <Toaster position="top-right" />
            <div className="complaints-wrapper">
                <aside className="sidebar">
                    <div className="sidebar-header">
                        <div className="logo-section">
                            <MessageSquare className="logo-icon" />
                            <h2>Support Hub</h2>
                        </div>
                        <div className="tab-switcher">
                            <button className={activeTab === 'users' ? 'active' : ''} onClick={() => { setActiveTab('users'); setSelectedTicketId(null); setTicketDetail(null); }}>
                                <User size={16} /> Users
                            </button>
                            <button className={activeTab === 'drivers' ? 'active' : ''} onClick={() => { setActiveTab('drivers'); setSelectedTicketId(null); setTicketDetail(null); }}>
                                <Truck size={16} /> Drivers
                            </button>
                        </div>
                        <div className="search-bar">
                            <Search size={18} className="search-icon" />
                            <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        </div>
                    </div>
                    <div className="chat-list">
                        {isLoading ? (
                            <div className="loader-container"><RotatingLines strokeColor="#4F46E5" width="30" /></div>
                        ) : filteredList.length > 0 ? (
                            filteredList.map((ticket) => {
                                const style = getStatusStyle(ticket.status);
                                return (
                                    <div key={ticket.id} className={`chat-item ${selectedTicketId === ticket.id ? 'selected' : ''}`} onClick={() => handleSelectComplaint(ticket.id)}>
                                        <div className="avatar-circle" style={{ backgroundColor: style.color }}>{(ticket.user?.name || ticket.driver?.name || "U").charAt(0).toUpperCase()}</div>
                                        <div className="item-details">
                                            <div className="item-top">
                                                <h4>{ticket.user?.name || ticket.driver?.name}</h4>
                                                <button className="delete-btn-icon" onClick={(e) => handleDeleteTicket(e, ticket.id)}>
                                                    <Trash2 size={14} color="#ef4444" />
                                                </button>
                                            </div>
                                            <div className="subject-line-wrapper">
                                                <span className='ticket-id'>#{ticket.id}</span>
                                                <p className="subject-line">{ticket.subject}</p>
                                            </div>
                                            <span className="status-pill" style={{ backgroundColor: style.bg, color: style.color }}>
                                                {style.icon} {ticket.status}
                                            </span>
                                        </div>
                                        <ChevronRight size={18} className="chevron-icon" />
                                    </div>
                                );
                            })
                        ) : <p className="no-data">No tickets found</p>}
                    </div>
                </aside>

                <main className="chat-viewport">
                    {isDetailLoading ? (
                        <div className="state-container"><RotatingLines strokeColor="#4F46E5" width="50" /></div>
                    ) : !ticketDetail ? (
                        <div className="state-container empty-state">
                            <MessageSquare size={64} opacity={0.2} />
                            <h3>Select a Ticket</h3>
                        </div>
                    ) : (
                        <div className="active-chat-container">
                            <header className="chat-navbar">
                                <div className="user-meta">
                                    <h3>{ticketDetail.user?.name || ticketDetail.driver?.name}</h3>
                                    <span>Ticket ID: #{ticketDetail.id} | Order ID: {ticketDetail.order_id}</span>
                                </div>
                                <div className="status-badge-large" style={{ ...getStatusStyle(ticketDetail.status), padding: '5px 10px', borderRadius: '5px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    {getStatusStyle(ticketDetail.status).icon} {ticketDetail.status}
                                </div>
                            </header>

                            <div className="messages-stream">
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="message-content-card">
                                    <div className="card-header">
                                        <h3 className="msg-subject">{ticketDetail.subject}</h3>
                                        <span className="timestamp">{new Date(ticketDetail.created_at).toLocaleString()}</span>
                                    </div>
                                    <p className="msg-text">{ticketDetail.message}</p>
                                    
                                    {ticketDetail.evidence && (
                                        <div className="evidence-container">
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                                <div className="evidence-label"><ImageIcon size={14} /> Attached Evidence</div>
                                                <button onClick={() => downloadEvidenceAsPDF(ticketDetail.evidence, ticketDetail.id)} className="pdf-download-btn">
                                                    <Download size={14} /> Download PDF
                                                </button>
                                            </div>
                                            <div className="image-wrapper">
                                                <img 
                                                    src={ticketDetail.evidence.startsWith('http') ? ticketDetail.evidence : `https://test.pearl-developer.com/abhivriti/public/${ticketDetail.evidence}`} 
                                                    alt="Evidence" 
                                                    onClick={() => window.open(ticketDetail.evidence.startsWith('http') ? ticketDetail.evidence : `https://test.pearl-developer.com/abhivriti/public/${ticketDetail.evidence}`)} 
                                                />
                                            </div>
                                        </div>
                                    )}
                                </motion.div>

                                <div className="details-grid single-card">
                                    <div className="info-card">
                                        <h4><User size={16}/> Customer Details</h4>
                                        <div className="info-row"><span>Name:</span> <strong>{ticketDetail.user?.name || 'N/A'}</strong></div>
                                        <div className="info-row"><span>Contact:</span> <strong>{ticketDetail.user?.mobile || 'N/A'}</strong></div>
                                    </div>
                                    {ticketDetail.booking && (
                                        <div className="info-card">
                                            <h4><FileText size={16}/> Booking Details</h4>
                                            <div className="info-row"><span>Order ID:</span> <strong>{ticketDetail.booking.order_id}</strong></div>
                                            <div className="info-row"><span>Fare:</span> <strong>{ticketDetail.booking.fare_total}</strong></div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <footer className="admin-reply-area">
                                <div className="status-selector-wrapper">
                                    <select className="status-dropdown" value={statusToUpdate || ticketDetail.status} onChange={(e) => setStatusToUpdate(e.target.value)}>
                                        <option value="pending">Pending</option>
                                        <option value="resolved">Resolved</option>
                                        <option value="rejected">Rejected</option>
                                        <option value="refund_initiated">Refund Initiated</option>
                                        <option value="refunded">Refunded</option>
                                    </select>
                                </div>
                                <div className="input-box-wrapper">
                                    <textarea value={adminMessage} onChange={(e) => setAdminMessage(e.target.value)} placeholder="Enter reply message..." />
                                    <button className="send-btn" onClick={() => setShowStatusModal(true)}>
                                        <Send size={18} /> Update
                                    </button>
                                </div>
                            </footer>
                        </div>
                    )}
                </main>
            </div>

            <AnimatePresence>
                {showStatusModal && (
                    <div className="modal-overlay">
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="modal-content">
                            <div className="modal-icon-wrapper"><CheckCircle size={24} /></div>
                            <h3>Confirm Status Update</h3>
                            <p>Status will change to <strong>{statusToUpdate}</strong></p>
                            <div className="modal-actions">
                                <button className="btn-cancel" onClick={() => setShowStatusModal(false)}>Cancel</button>
                                <button className="btn-confirm" onClick={confirmStatusUpdate}>Confirm</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Complaints;