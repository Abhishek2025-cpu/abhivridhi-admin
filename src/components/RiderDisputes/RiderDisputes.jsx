import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaGavel,
  FaUserShield,
  FaExclamationCircle,
  FaCheckCircle,
  FaTimesCircle,
  FaCamera,
  FaHistory,
  FaFileAlt,
} from "react-icons/fa";

// Dummy Data (Mocking backend response)
const initialDisputes = [
  {
    id: "#DIS-1023",
    riderName: "Rahul Sharma",
    userName: "Amit Verma",
    issue: "Food Damaged / Spilled",
    status: "Pending",
    date: "2025-10-24",
    userComplaint: "The pizza box was crushed and topping spilled everywhere.",
    riderDefense: {
      note: "Box was handed over intact. Road was bumpy but I used thermal bag.",
      timestamp: "2025-10-24 08:30 PM",
      images: [
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=150&h=150&fit=crop", // Mock Image
        "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=150&h=150&fit=crop",
      ],
    },
  },
  {
    id: "#DIS-1024",
    riderName: "Vikram Singh",
    userName: "Priya Das",
    issue: "Late Delivery > 45 mins",
    status: "Pending",
    date: "2025-10-25",
    userComplaint: "Rider took a long route and food was cold.",
    riderDefense: {
      note: "Traffic jam at Main Street. GPS log attached showing standstill.",
      timestamp: "2025-10-25 01:15 PM",
      images: [
        "https://images.unsplash.com/photo-1494515855673-b411c78e19f5?w=150&h=150&fit=crop",
      ],
    },
  },
];

const RiderDisputes = () => {
  const [disputes, setDisputes] = useState(initialDisputes);
  const [selectedDispute, setSelectedDispute] = useState(null);

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  // Handle Decision
  const handleDecision = (id, decision) => {
    // In real app, send API call here
    alert(`Dispute ${id} marked as: ${decision}`);
    setDisputes((prev) => prev.filter((d) => d.id !== id));
    setSelectedDispute(null);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <FaGavel className="text-blue-600" /> Rider Disputes & Resolution
          </h1>
          <p className="text-gray-500 mt-1">
            Review claims, check rider defense, and apply penalties or clear disputes.
          </p>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { title: "Pending Disputes", count: disputes.length, color: "bg-orange-100 text-orange-600", icon: <FaExclamationCircle /> },
          { title: "Resolved Today", count: 12, color: "bg-green-100 text-green-600", icon: <FaCheckCircle /> },
          { title: "Penalties Applied", count: 3, color: "bg-red-100 text-red-600", icon: <FaTimesCircle /> },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: idx * 0.1 }}
            className={`p-6 rounded-xl shadow-sm bg-white border-l-4 border-blue-500 flex items-center justify-between hover:shadow-md transition-shadow`}
          >
            <div>
              <p className="text-gray-500 text-sm font-semibold uppercase">{stat.title}</p>
              <h2 className="text-3xl font-bold text-gray-800">{stat.count}</h2>
            </div>
            <div className={`text-3xl p-3 rounded-full ${stat.color}`}>{stat.icon}</div>
          </motion.div>
        ))}
      </div>

      {/* Disputes List */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {disputes.length === 0 ? (
          <div className="col-span-2 text-center py-20 bg-white rounded-lg shadow">
            <p className="text-gray-500 text-xl">🎉 No pending disputes! Great job.</p>
          </div>
        ) : (
          disputes.map((dispute) => (
            <motion.div
              key={dispute.id}
              variants={itemVariants}
              layoutId={dispute.id}
              onClick={() => setSelectedDispute(dispute)}
              className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 cursor-pointer hover:border-blue-400 transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs px-3 py-1 rounded-bl-lg">
                Action Required
              </div>
              
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-xl font-bold">
                    {dispute.riderName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">{dispute.riderName}</h3>
                    <p className="text-sm text-gray-500">Rider ID: {dispute.id}</p>
                  </div>
                </div>
                <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-bold uppercase border border-red-100">
                  {dispute.issue}
                </span>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 mb-4">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold text-red-500">User Complaint:</span> "{dispute.userComplaint}"
                </p>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500 mt-2">
                <span className="flex items-center gap-1"><FaHistory /> {dispute.date}</span>
                <span className="text-blue-600 font-semibold group-hover:underline">Review Defense &rarr;</span>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Modal / Detail View */}
      <AnimatePresence>
        {selectedDispute && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedDispute(null)}
          >
            <motion.div
              layoutId={selectedDispute.id}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-blue-700 text-white p-6 flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                     Dispute Resolution: {selectedDispute.id}
                  </h2>
                  <p className="opacity-90 text-sm mt-1">Reviewing case between {selectedDispute.userName} (User) & {selectedDispute.riderName} (Rider)</p>
                </div>
                <button 
                  onClick={() => setSelectedDispute(null)}
                  className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition"
                >
                  <FaTimesCircle size={24} />
                </button>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left: Complaint Details */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-800 border-b pb-2">🚨 Complaint Details</h3>
                  <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                    <p className="text-sm font-semibold text-red-800 uppercase mb-1">Issue Type</p>
                    <p className="text-gray-800 font-medium">{selectedDispute.issue}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-500 uppercase mb-1">User Statement</p>
                    <p className="text-gray-700 italic">"{selectedDispute.userComplaint}"</p>
                  </div>
                </div>

                {/* Right: Rider Defense (The Core Feature) */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-800 border-b pb-2 flex items-center gap-2">
                    <FaUserShield className="text-green-600" /> Rider Defense
                  </h3>
                  
                  <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                     <p className="text-sm font-semibold text-green-800 uppercase mb-1">Rider Statement</p>
                     <p className="text-gray-700">"{selectedDispute.riderDefense.note}"</p>
                     <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                       <FaHistory /> Submitted at: {selectedDispute.riderDefense.timestamp}
                     </p>
                  </div>

                  {/* Media Uploads */}
                  <div>
                    <p className="text-sm font-semibold text-gray-500 uppercase mb-2 flex items-center gap-2">
                        <FaCamera /> Evidence / Proofs
                    </p>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {selectedDispute.riderDefense.images.map((img, index) => (
                            <img 
                                key={index} 
                                src={img} 
                                alt="proof" 
                                className="w-24 h-24 object-cover rounded-lg border-2 border-gray-200 hover:scale-105 transition-transform cursor-zoom-in shadow-sm"
                            />
                        ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-6 bg-gray-50 border-t flex flex-col sm:flex-row justify-end gap-4">
                <div className="flex-1">
                    <p className="text-sm text-gray-500">
                        <FaFileAlt className="inline mr-1"/>
                        Review evidence carefully. Decisions are final and affect rider ratings.
                    </p>
                </div>
                <button
                  onClick={() => handleDecision(selectedDispute.id, "Rider Penalized")}
                  className="px-6 py-3 bg-red-600 text-white font-bold rounded-lg shadow hover:bg-red-700 transition flex items-center justify-center gap-2"
                >
                  <FaGavel /> Reject Defense & Penalize
                </button>
                <button
                  onClick={() => handleDecision(selectedDispute.id, "Dispute Closed - Rider Cleared")}
                  className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg shadow hover:bg-green-700 transition flex items-center justify-center gap-2"
                >
                  <FaCheckCircle /> Accept Defense & Clear
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RiderDisputes;