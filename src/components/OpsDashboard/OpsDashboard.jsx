import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSearch,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaMapMarkerAlt,
  FaHistory,
  FaUserShield,
  FaGavel,
  FaUndo,
  FaFileInvoiceDollar,
  FaArrowRight,
  FaArrowLeft,
  FaFilter
} from "react-icons/fa";

// Mock Data
const initialCases = [
  {
    id: "CS-2025-001",
    type: "Delivery Failure",
    priority: "High",
    status: "Escalated",
    user: "Rahul Sharma",
    rider: "Vikram Singh",
    issue: "Package marked delivered but not received.",
    slaBreach: true,
    evidence: {
      image: "https://via.placeholder.com/300x200?text=Doorstep+Proof",
      gps: "28.7041° N, 77.1025° E (Match: 98%)",
      chat: "Rider: 'I left it at the gate.'",
    },
    logs: [
      { time: "12:00 PM", action: "SLA Breached - Auto Escalated", actor: "System" },
      { time: "10:05 AM", action: "Evidence Attached", actor: "System" },
      { time: "10:00 AM", action: "Case Auto-Created", actor: "System" },
    ],
  },
  {
    id: "CS-2025-002",
    type: "Rider Dispute",
    priority: "Medium",
    status: "Pending",
    user: "Amit Verma",
    rider: "Suresh Kumar",
    issue: "Rider claims waiting charges rejected by user.",
    slaBreach: false,
    evidence: {
      image: null,
      gps: "Waiting loc: Sector 18 (Duration: 15m)",
      chat: "User: 'I was only 2 mins late.'",
    },
    logs: [
      { time: "02:16 PM", action: "GPS Logs Synced", actor: "System" },
      { time: "02:15 PM", action: "Dispute Initiated", actor: "Rider App" },
    ],
  },
  {
    id: "CS-2025-003",
    type: "Damaged Item",
    priority: "Low",
    status: "Resolved",
    user: "Sneha Gupta",
    rider: "Davinder Pal",
    issue: "Food spilled during transit.",
    slaBreach: false,
    evidence: {
      image: "https://via.placeholder.com/300x200?text=Spilled+Food",
      gps: "Route Clear",
      chat: "N/A",
    },
    logs: [
      { time: "09:30 AM", action: "Refund Approved", actor: "Admin: John" },
      { time: "09:00 AM", action: "Complaint Lodged", actor: "User App" },
    ],
  },
];

const OpsDashboard = () => {
  const [cases, setCases] = useState(initialCases);
  const [selectedCase, setSelectedCase] = useState(null);
  const [filter, setFilter] = useState("All");

  // Filter Logic
  const filteredCases = cases.filter((c) =>
    filter === "All" ? true : c.status === filter
  );

  // Function to handle resolution
  const handleResolution = (action) => {
    if (!selectedCase) return;

    const newLog = {
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      action: action,
      actor: "Admin (You)",
    };

    const updatedCases = cases.map((c) => {
      if (c.id === selectedCase.id) {
        return {
          ...c,
          status: action === "Reattempt Scheduled" ? "Pending" : "Resolved",
          logs: [newLog, ...c.logs],
        };
      }
      return c;
    });

    setCases(updatedCases);
    const updatedSelected = updatedCases.find((c) => c.id === selectedCase.id);
    setSelectedCase(updatedSelected);
  };

  return (
    // FIX: Height calculation adjusted to remove main scrollbar (100vh - header/padding approx 130px)
    <div className="flex flex-col h-[calc(100vh-130px)] w-full font-sans text-gray-800 overflow-hidden">
      
      {/* Header Section (Fixed Height) */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-none flex justify-between items-center mb-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <FaUserShield className="text-blue-600" /> Ops & Resolution
          </h1>
          <p className="text-gray-500 text-sm">Real-time dispute management</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="px-3 py-1 bg-white rounded-full shadow-sm border border-gray-200 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-xs font-semibold text-gray-600">Live</span>
          </div>
        </div>
      </motion.div>

      {/* Main Content Area (Fills remaining height) */}
      <div className="flex flex-1 gap-4 overflow-hidden relative">
        
        {/* LEFT PANEL: Case List */}
        <div className={`
            w-full md:w-1/3 lg:w-1/4 bg-white rounded-xl shadow-md border border-gray-200 flex flex-col z-10 overflow-hidden
            ${selectedCase ? 'hidden md:flex' : 'flex'}
        `}>
          
          {/* Search & Filter - Fixed at Top */}
          <div className="p-3 border-b border-gray-100 bg-white flex-none">
            <div className="relative mb-2">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search Ticket ID..."
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {["All", "Pending", "Escalated", "Resolved"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap transition-all ${
                    filter === f
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* List Items - Scrollable */}
          <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-gray-50 custom-scrollbar">
            <AnimatePresence>
              {filteredCases.length > 0 ? (
                filteredCases.map((c) => (
                  <motion.div
                    key={c.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    onClick={() => setSelectedCase(c)}
                    className={`p-3 rounded-lg cursor-pointer transition-all border ${
                      selectedCase?.id === c.id
                        ? "bg-white border-blue-500 shadow-md ring-1 ring-blue-100"
                        : "bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-[10px] font-bold text-gray-400">#{c.id}</span>
                      <span className="text-[10px] text-gray-400">{c.logs[0]?.time}</span>
                    </div>
                    
                    <div className="flex justify-between items-center mb-1">
                       <h4 className="font-bold text-gray-800 text-xs">{c.type}</h4>
                    </div>

                    <p className="text-[11px] text-gray-500 line-clamp-1 mb-2">{c.issue}</p>

                    <div className="flex items-center gap-2">
                        {c.slaBreach && (
                          <span className="px-1.5 py-0.5 text-[9px] bg-red-100 text-red-700 rounded font-bold flex items-center gap-1">
                            <FaExclamationTriangle /> SLA
                          </span>
                        )}
                        <span className={`px-1.5 py-0.5 text-[9px] rounded font-bold ${
                            c.status === "Resolved" ? "bg-green-100 text-green-700" :
                            c.status === "Escalated" ? "bg-orange-100 text-orange-700" :
                            "bg-blue-50 text-blue-700"
                        }`}>
                            {c.status}
                        </span>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                    <span className="text-xs">No cases found</span>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* RIGHT PANEL: Details Workspace */}
        <div className={`
            flex-1 bg-white rounded-xl shadow-md border border-gray-200 
            flex flex-col overflow-hidden transition-all
            ${selectedCase ? 'block' : 'hidden md:flex'}
        `}>
          
          {selectedCase ? (
            <>
              {/* Detail Header - Fixed */}
              <div className="p-4 border-b border-gray-100 bg-white flex-none">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setSelectedCase(null)} className="md:hidden p-2 bg-gray-100 rounded-full">
                            <FaArrowLeft />
                        </button>
                        <div>
                            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                {selectedCase.type} 
                                <span className={`text-[10px] px-2 py-0.5 rounded-full border ${selectedCase.priority === 'High' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-blue-50 text-blue-600 border-blue-200'}`}>
                                    {selectedCase.priority} Priority
                                </span>
                            </h2>
                            <p className="text-xs text-gray-500">{selectedCase.user} vs {selectedCase.rider}</p>
                        </div>
                    </div>
                    <div className={`flex items-center gap-1 font-mono font-bold text-sm ${selectedCase.status === 'Resolved' ? 'text-green-600' : 'text-red-500'}`}>
                        <FaClock /> 
                        {selectedCase.status === 'Resolved' ? 'CLOSED' : '-00:45:20'}
                    </div>
                </div>
              </div>

              {/* Detail Content - Scrollable */}
              <div className="flex-1 overflow-y-auto p-4 bg-gray-50/50 custom-scrollbar">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  
                  {/* Evidence Card */}
                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <h3 className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-2"><FaUserShield/> Evidence</h3>
                    
                    {selectedCase.evidence.image ? (
                        <div className="h-40 w-full rounded-lg overflow-hidden border border-gray-100 mb-3 group relative">
                            <img src={selectedCase.evidence.image} alt="Evidence" className="w-full h-full object-cover" />
                             <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-white text-xs font-bold border border-white px-2 py-1 rounded">View</span>
                             </div>
                        </div>
                    ) : (
                        <div className="h-20 bg-gray-100 rounded border-dashed border-2 border-gray-200 flex items-center justify-center text-xs text-gray-400 mb-3">
                            No Image
                        </div>
                    )}
                    
                    <div className="space-y-2">
                        <div className="bg-blue-50 p-2 rounded border border-blue-100">
                             <p className="text-[10px] text-blue-700 font-bold flex items-center gap-1"><FaMapMarkerAlt /> GPS</p>
                             <p className="text-xs text-gray-700">{selectedCase.evidence.gps}</p>
                        </div>
                        <div className="bg-purple-50 p-2 rounded border border-purple-100">
                             <p className="text-[10px] text-purple-700 font-bold flex items-center gap-1"><FaHistory /> Chat</p>
                             <p className="text-xs text-gray-700 italic">"{selectedCase.evidence.chat}"</p>
                        </div>
                    </div>
                  </div>

                  {/* Logs Card */}
                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <h3 className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-2"><FaHistory/> Logs</h3>
                    <div className="relative pl-4 border-l-2 border-gray-100 space-y-4">
                        {selectedCase.logs.map((log, idx) => (
                            <div key={idx} className="relative">
                                <div className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-blue-100 border-2 border-blue-500"></div>
                                <p className="text-[10px] text-gray-400">{log.time}</p>
                                <p className="text-xs font-semibold text-gray-800">{log.action}</p>
                                <p className="text-[10px] text-blue-500">By: {log.actor}</p>
                            </div>
                        ))}
                    </div>
                  </div>

                </div>
              </div>

              {/* Action Footer - Fixed */}
              <div className="p-3 bg-white border-t border-gray-200 flex justify-end gap-2 flex-none">
                {selectedCase.status !== "Resolved" ? (
                    <>
                        <button onClick={() => handleResolution("Reattempt Scheduled")} className="px-3 py-2 bg-gray-50 border border-gray-300 text-gray-700 text-xs font-bold rounded hover:bg-gray-100">Reattempt</button>
                        <button onClick={() => handleResolution("Refund Approved")} className="px-3 py-2 bg-red-50 border border-red-200 text-red-600 text-xs font-bold rounded hover:bg-red-100">Refund</button>
                        <button onClick={() => handleResolution("Case Closed - Validated")} className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded hover:bg-blue-700 shadow-md">Approve & Close</button>
                    </>
                ) : (
                    <div className="flex items-center gap-2 text-green-600 text-sm font-bold px-4 py-2 bg-green-50 rounded">
                        <FaCheckCircle /> Resolved
                    </div>
                )}
              </div>

            </>
          ) : (
             <div className="flex flex-col items-center justify-center h-full text-gray-400 bg-gray-50/50">
                <FaArrowRight className="text-3xl mb-3 opacity-20" />
                <p className="text-sm">Select a case to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OpsDashboard;