import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaTags, 
  FaPlus, 
  FaPercentage,    
  FaMoneyBillWave, 
  FaCalendarAlt, 
  FaUsers, 
  FaChartLine, 
  FaTrash, 
  FaCheckCircle, 
  FaTimesCircle,
  FaBullhorn,
  FaExclamationTriangle,
  FaNewspaper,
  FaStar,
  FaArchive,
  FaEye
} from "react-icons/fa";

// --- DUMMY DATA ---
const initialCoupons = [
  { id: 1, code: "WELCOME50", type: "Percentage", value: 50, limit: 100, used: 45, expiry: "2025-12-31", status: "Active", segment: "New Users" },
  { id: 2, code: "FLAT100", type: "Flat", value: 100, limit: 50, used: 50, expiry: "2024-11-01", status: "Expired", segment: "All Users" },
];

const initialAnnouncements = [
  { id: 1, title: "Server Maintenance", description: "App will be down for 1 hour.", date: "2025-01-20", priority: "High", status: "Active" },
  { id: 2, title: "New Feature Alert", description: "Check out the new dark mode.", date: "2025-01-15", priority: "Normal", status: "Archived" },
];

const MarketingFeatures = () => {
  // Tab State: 'coupons' or 'announcements'
  const [activeTab, setActiveTab] = useState("coupons");

  // --- COUPON STATE ---
  const [coupons, setCoupons] = useState(initialCoupons);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [couponForm, setCouponForm] = useState({
    code: "", type: "Percentage", value: "", limit: "", expiry: "", segment: "All Users"
  });

  // --- ANNOUNCEMENT STATE ---
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [showAnnounceModal, setShowAnnounceModal] = useState(false);
  const [announceForm, setAnnounceForm] = useState({
    title: "", description: "", date: "", priority: "Normal"
  });

  // --- DELETE MODAL STATE ---
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null); // { id, type: 'coupon' | 'announcement' }

  // --- HANDLERS: COUPONS ---
  const handleCouponChange = (e) => {
    setCouponForm({ ...couponForm, [e.target.name]: e.target.value });
  };

  const submitCoupon = (e) => {
    e.preventDefault();
    const newCoupon = {
      id: Date.now(),
      ...couponForm,
      code: couponForm.code.toUpperCase(),
      used: 0,
      status: "Active"
    };
    setCoupons([newCoupon, ...coupons]);
    setShowCouponModal(false);
    setCouponForm({ code: "", type: "Percentage", value: "", limit: "", expiry: "", segment: "All Users" });
  };

  // --- HANDLERS: ANNOUNCEMENTS ---
  const handleAnnounceChange = (e) => {
    setAnnounceForm({ ...announceForm, [e.target.name]: e.target.value });
  };

  const submitAnnouncement = (e) => {
    e.preventDefault();
    const newAnnounce = {
      id: Date.now(),
      ...announceForm,
      status: "Active" // New updates pushed automatically
    };
    setAnnouncements([newAnnounce, ...announcements]);
    setShowAnnounceModal(false);
    setAnnounceForm({ title: "", description: "", date: "", priority: "Normal" });
  };

  // --- HANDLERS: DELETE/ARCHIVE ---
  const triggerDelete = (id, type) => {
    setItemToDelete({ id, type });
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (itemToDelete.type === 'coupon') {
      setCoupons(coupons.filter(c => c.id !== itemToDelete.id));
    } else {
      setAnnouncements(announcements.filter(a => a.id !== itemToDelete.id));
    }
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  const toggleArchive = (id) => {
    setAnnouncements(announcements.map(a => 
      a.id === id ? { ...a, status: a.status === "Active" ? "Archived" : "Active" } : a
    ));
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Marketing & Communications</h1>
        <p className="text-gray-500 mt-1">Manage promo codes and app-wide announcements.</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-8 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("coupons")}
          className={`pb-4 px-4 font-semibold text-lg flex items-center gap-2 transition-colors ${
            activeTab === "coupons" ? "border-b-4 border-blue-600 text-blue-600" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <FaTags /> Coupons & Promos
        </button>
        <button
          onClick={() => setActiveTab("announcements")}
          className={`pb-4 px-4 font-semibold text-lg flex items-center gap-2 transition-colors ${
            activeTab === "announcements" ? "border-b-4 border-blue-600 text-blue-600" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <FaBullhorn /> Announcements ("What's New")
        </button>
      </div>

      {/* --- CONTENT AREA --- */}
      
      {/* 1. COUPONS SECTION */}
      {activeTab === "coupons" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="flex justify-between items-center mb-6">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mr-4">
                <StatsCard title="Active Campaigns" value={coupons.filter(c => c.status === "Active").length} icon={<FaTags />} color="bg-blue-100 text-blue-600" />
                <StatsCard title="Redemptions" value={coupons.reduce((acc, curr) => acc + Number(curr.used || 0), 0)} icon={<FaUsers />} color="bg-green-100 text-green-600" />
             </div>
             <button
              onClick={() => setShowCouponModal(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 hover:bg-blue-700 whitespace-nowrap h-fit"
            >
              <FaPlus /> Create Coupon
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
                <tr>
                  <th className="p-4">Code</th>
                  <th className="p-4">Details</th>
                  <th className="p-4">Segment</th>
                  <th className="p-4">Usage</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((coupon) => (
                  <tr key={coupon.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-bold text-blue-700">{coupon.code}</td>
                    <td className="p-4 text-sm">
                      <div className="font-semibold">{coupon.type === 'Flat' ? `$${coupon.value} OFF` : `${coupon.value}% OFF`}</div>
                      <div className="text-gray-400 text-xs">Expires: {coupon.expiry}</div>
                    </td>
                    <td className="p-4"><span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">{coupon.segment}</span></td>
                    <td className="p-4 text-sm">{coupon.used} / {coupon.limit} Used</td>
                    <td className="p-4">
                      {coupon.status === "Active" ? 
                        <span className="text-green-600 flex items-center gap-1 text-sm"><FaCheckCircle/> Active</span> : 
                        <span className="text-red-500 flex items-center gap-1 text-sm"><FaTimesCircle/> Expired</span>
                      }
                    </td>
                    <td className="p-4">
                      <button onClick={() => triggerDelete(coupon.id, 'coupon')} className="text-red-500 hover:bg-red-100 p-2 rounded-full"><FaTrash/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* 2. ANNOUNCEMENTS SECTION */}
      {activeTab === "announcements" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
           <div className="flex justify-between items-center mb-6">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mr-4">
                <StatsCard title="Active Updates" value={announcements.filter(a => a.status === "Active").length} icon={<FaBullhorn />} color="bg-purple-100 text-purple-600" />
                <StatsCard title="High Priority" value={announcements.filter(a => a.priority === "High" && a.status === "Active").length} icon={<FaStar />} color="bg-red-100 text-red-600" />
             </div>
             <button
              onClick={() => setShowAnnounceModal(true)}
              className="bg-purple-600 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 hover:bg-purple-700 whitespace-nowrap h-fit"
            >
              <FaPlus /> New Update
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
                <tr>
                  <th className="p-4">Priority (Display Type)</th>
                  <th className="p-4">Title & Description</th>
                  <th className="p-4">Effective Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {announcements.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      {item.priority === "High" ? (
                        <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold flex items-center w-fit gap-1">
                          <FaStar /> High (Popup)
                        </span>
                      ) : (
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold flex items-center w-fit gap-1">
                          <FaNewspaper /> Normal (Ticker)
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-gray-800">{item.title}</div>
                      <div className="text-gray-500 text-sm truncate max-w-xs">{item.description}</div>
                    </td>
                    <td className="p-4 text-sm text-gray-600">{item.date}</td>
                    <td className="p-4">
                      {item.status === "Active" ? (
                         <span className="text-green-600 text-sm font-semibold">Live</span>
                      ) : (
                         <span className="text-gray-400 text-sm font-semibold">Archived</span>
                      )}
                    </td>
                    <td className="p-4 flex gap-2">
                       {/* Archive Action */}
                       <button 
                        onClick={() => toggleArchive(item.id)}
                        className="text-gray-500 hover:bg-gray-200 p-2 rounded-full"
                        title={item.status === "Active" ? "Archive" : "Un-archive"}
                      >
                        <FaArchive />
                      </button>
                      <button 
                        onClick={() => triggerDelete(item.id, 'announcement')}
                        className="text-red-500 hover:bg-red-100 p-2 rounded-full"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* --- MODALS --- */}

      {/* 1. COUPON MODAL */}
      <AnimatePresence>
        {showCouponModal && (
          <Modal onClose={() => setShowCouponModal(false)} title="Create Coupon">
            <form onSubmit={submitCoupon} className="space-y-4">
              <input type="text" name="code" placeholder="Code (e.g. SAVE20)" required value={couponForm.code} onChange={handleCouponChange} className="w-full p-3 border rounded uppercase" />
              <div className="grid grid-cols-2 gap-4">
                <select name="type" value={couponForm.type} onChange={handleCouponChange} className="w-full p-3 border rounded">
                  <option value="Percentage">Percentage (%)</option>
                  <option value="Flat">Flat Amount ($)</option>
                </select>
                <input type="number" name="value" placeholder="Value" required value={couponForm.value} onChange={handleCouponChange} className="w-full p-3 border rounded" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <input type="number" name="limit" placeholder="Usage Limit" required value={couponForm.limit} onChange={handleCouponChange} className="w-full p-3 border rounded" />
                 <select name="segment" value={couponForm.segment} onChange={handleCouponChange} className="w-full p-3 border rounded">
                  <option>All Users</option>
                  <option>New Users Only</option>
                  <option>Premium Members</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500">Expiry Date</label>
                <input type="date" name="expiry" required value={couponForm.expiry} onChange={handleCouponChange} className="w-full p-3 border rounded" />
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700">Create Coupon</button>
            </form>
          </Modal>
        )}
      </AnimatePresence>

      {/* 2. ANNOUNCEMENT MODAL */}
      <AnimatePresence>
        {showAnnounceModal && (
          <Modal onClose={() => setShowAnnounceModal(false)} title="Create Announcement">
             <form onSubmit={submitAnnouncement} className="space-y-4">
              <div>
                <label className="text-sm font-bold text-gray-700">Title</label>
                <input type="text" name="title" placeholder="e.g. System Update" required value={announceForm.title} onChange={handleAnnounceChange} className="w-full p-3 border rounded" />
              </div>
              
              <div>
                <label className="text-sm font-bold text-gray-700">Description</label>
                <textarea name="description" placeholder="Details visible to user..." required value={announceForm.description} onChange={handleAnnounceChange} className="w-full p-3 border rounded h-24"></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="text-sm font-bold text-gray-700">Effective Date</label>
                   <input type="date" name="date" required value={announceForm.date} onChange={handleAnnounceChange} className="w-full p-3 border rounded" />
                </div>
                <div>
                   <label className="text-sm font-bold text-gray-700">Priority</label>
                   <select name="priority" value={announceForm.priority} onChange={handleAnnounceChange} className="w-full p-3 border rounded">
                      <option value="Normal">Normal (Ticker)</option>
                      <option value="High">High (Popup)</option>
                   </select>
                </div>
              </div>
              <button type="submit" className="w-full bg-purple-600 text-white py-3 rounded hover:bg-purple-700">Post Announcement</button>
            </form>
          </Modal>
        )}
      </AnimatePresence>

      {/* 3. DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {showDeleteModal && (
          <Modal onClose={() => setShowDeleteModal(false)} title="Confirm Delete">
             <div className="text-center">
                <FaExclamationTriangle className="text-red-500 text-4xl mx-auto mb-4" />
                <p className="text-gray-600 mb-6">Are you sure you want to delete this item? This cannot be undone.</p>
                <div className="flex justify-center gap-4">
                  <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 bg-gray-200 rounded text-gray-700">Cancel</button>
                  <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Delete</button>
                </div>
             </div>
          </Modal>
        )}
      </AnimatePresence>

    </div>
  );
};

// --- REUSABLE COMPONENTS ---

const StatsCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-4 rounded-xl shadow-sm flex items-center justify-between border border-gray-100">
    <div>
      <p className="text-gray-500 text-xs font-bold uppercase">{title}</p>
      <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
    </div>
    <div className={`p-3 rounded-full ${color} text-lg`}>{icon}</div>
  </div>
);

const Modal = ({ onClose, title, children }) => (
  <motion.div 
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-sm"
  >
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
      className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md relative"
    >
      <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-black">&times;</button>
      <h2 className="text-xl font-bold mb-4 text-gray-800">{title}</h2>
      {children}
    </motion.div>
  </motion.div>
);

export default MarketingFeatures;