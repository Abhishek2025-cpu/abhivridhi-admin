import React, { useState } from "react";
import { 
  FaUndo, FaCamera, FaMicrophone, FaExclamationCircle, FaCheckCircle,
  FaTruck, FaWarehouse, FaHeadset, FaClipboardList, FaClock, FaTimesCircle
} from "react-icons/fa";

const DeliveryFailures = () => {
  const [viewMode, setViewMode] = useState("admin"); // 'admin' or 'rider'
  
  // --- STATES ---
  const [reportForm, setReportForm] = useState({
    orderId: "",
    reason: "",
    notes: "",
    photo: null,
  });

  const [failureCases, setFailureCases] = useState([
    {
      id: 101,
      orderId: "ORD-1234",
      rider: "Rahul Kumar",
      reason: "Receiver Unavailable",
      notes: "Knocked twice, no answer. Called 3 times.",
      timestamp: "2023-10-25 10:30 AM",
      status: "Pending Action",
      evidence: "door_photo.jpg"
    },
    {
      id: 102,
      orderId: "ORD-5678",
      rider: "Amit Singh",
      reason: "Incorrect Address",
      notes: "Location pin leads to empty plot.",
      timestamp: "2023-10-25 11:15 AM",
      status: "Escalated",
      evidence: "street_photo.jpg"
    },
    {
      id: 103,
      orderId: "ORD-9988",
      rider: "Vikram Singh",
      reason: "Refused Delivery",
      notes: "Customer refused to pay COD amount.",
      timestamp: "2023-10-26 09:15 AM",
      status: "Return to Hub",
      evidence: "refusal_sig.jpg"
    }
  ]);

  // --- HANDLERS ---
  const handleReportSubmit = (e) => {
    e.preventDefault();
    if (!reportForm.reason) {
      alert("Please select a reason for failure.");
      return;
    }
    const newFailureCase = {
      id: Math.floor(Math.random() * 1000),
      orderId: reportForm.orderId || "ORD-NEW",
      rider: "Current Rider",
      reason: reportForm.reason,
      notes: reportForm.notes,
      timestamp: new Date().toLocaleString(),
      status: "Pending Action",
      evidence: reportForm.photo ? "Photo Uploaded" : "No Photo",
    };
    setFailureCases([newFailureCase, ...failureCases]);
    alert("Failure Reported Successfully!");
    setReportForm({ orderId: "", reason: "", notes: "", photo: null });
    setViewMode("admin");
  };

  const handleDecision = (id, action) => {
    const updatedCases = failureCases.map((item) => 
      item.id === id ? { ...item, status: action } : item
    );
    setFailureCases(updatedCases);
  };

  // --- HELPER COMPONENTS ---
  const StatCard = ({ title, count, icon, color }) => (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between transition-transform hover:-translate-y-1">
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800">{count}</h3>
      </div>
      <div className={`p-3 rounded-full ${color} text-white text-lg`}>{icon}</div>
    </div>
  );

  return (
    <div className="flex-1 bg-gray-50 min-h-screen p-4 md:p-8 transition-all duration-300 font-sans">
      
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
            <FaUndo className="mr-3 text-red-500" /> 
            Delivery Failure Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Real-time resolution for failed deliveries, returns & disputes.
          </p>
        </div>
        
        {/* Toggle Button */}
        <div className="bg-white p-1.5 rounded-lg shadow-sm border border-gray-200 flex items-center">
          <button 
            onClick={() => setViewMode("rider")} 
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center ${viewMode === 'rider' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>
            <FaTruck className="mr-2"/> Rider View
          </button>
          <button 
            onClick={() => setViewMode("admin")} 
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center ml-2 ${viewMode === 'admin' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>
            <FaClipboardList className="mr-2"/> Ops Dashboard
          </button>
        </div>
      </div>

      {/* --- RIDER VIEW (Mobile App Style) --- */}
      {viewMode === "rider" && (
        <div className="flex justify-center animate-fade-in-up">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="bg-red-500 p-4 text-white flex items-center justify-between">
              <h2 className="font-bold text-lg flex items-center"><FaExclamationCircle className="mr-2"/> Report Failure</h2>
              <span className="text-xs bg-red-600 px-2 py-1 rounded">Rider App</span>
            </div>
            
            <form onSubmit={handleReportSubmit} className="p-6 space-y-5">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Order ID</label>
                <input 
                  type="text" 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-200 focus:border-red-500 outline-none transition"
                  placeholder="#ORD-..."
                  value={reportForm.orderId}
                  onChange={(e) => setReportForm({...reportForm, orderId: e.target.value})}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Reason for Failure</label>
                <select 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-200 outline-none bg-white"
                  value={reportForm.reason}
                  onChange={(e) => setReportForm({...reportForm, reason: e.target.value})}
                  required
                >
                  <option value="">Select Reason...</option>
                  <option value="Receiver Unavailable">Receiver Unavailable</option>
                  <option value="Incorrect Address">Incorrect Address</option>
                  <option value="Customer Unreachable">Customer Unreachable</option>
                  <option value="Refused Delivery">Refused Delivery</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Evidence (Required)</label>
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FaCamera className="text-gray-400 text-2xl mb-2"/>
                    <p className="text-sm text-gray-500">Click to upload photo</p>
                  </div>
                  <input type="file" className="hidden" onChange={(e) => setReportForm({ ...reportForm, photo: e.target.files[0] })} />
                </label>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Notes / Voice</label>
                <div className="relative">
                  <textarea 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-200 outline-none" 
                    rows="2" 
                    placeholder="Add specific details..."
                    value={reportForm.notes}
                    onChange={(e) => setReportForm({...reportForm, notes: e.target.value})}
                  ></textarea>
                  <FaMicrophone className="absolute right-3 bottom-3 text-gray-400 cursor-pointer hover:text-red-500"/>
                </div>
              </div>

              <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-lg shadow-lg transform active:scale-95 transition-all">
                Submit Failure Report
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- OPS DASHBOARD VIEW --- */}
      {viewMode === "admin" && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Active Failures" count={failureCases.filter(c => c.status === 'Pending Action').length} icon={<FaExclamationCircle />} color="bg-red-500" />
            <StatCard title="Total Disputes" count={12} icon={<FaClipboardList />} color="bg-blue-500" />
            <StatCard title="Returned to Hub" count={failureCases.filter(c => c.status === 'Return to Hub').length} icon={<FaWarehouse />} color="bg-orange-500" />
            <StatCard title="Resolved Today" count={8} icon={<FaCheckCircle />} color="bg-green-500" />
          </div>

          {/* Main Table Card */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-700 text-lg">Live Failure Feed</h3>
              <input type="text" placeholder="Search Order ID..." className="text-sm border rounded px-3 py-1.5 focus:outline-none focus:border-blue-500"/>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                    <th className="p-4 font-semibold">Order Details</th>
                    <th className="p-4 font-semibold">Failure Reason</th>
                    <th className="p-4 font-semibold">Evidence & Notes</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold text-center">Action Required</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {failureCases.map((item) => (
                    <tr key={item.id} className="hover:bg-blue-50 transition-colors duration-150">
                      
                      {/* Order Details */}
                      <td className="p-4">
                        <div className="font-bold text-gray-800">{item.orderId}</div>
                        <div className="text-xs text-gray-500 flex items-center mt-1">
                           <FaTruck className="mr-1"/> {item.rider}
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5">{item.timestamp}</div>
                      </td>

                      {/* Reason */}
                      <td className="p-4">
                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-50 text-red-600 border border-red-100">
                          {item.reason}
                        </span>
                      </td>

                      {/* Evidence */}
                      <td className="p-4 max-w-xs">
                        <p className="text-sm text-gray-600 mb-1 truncate" title={item.notes}>{item.notes}</p>
                        <a href="#" className="text-xs text-blue-500 hover:underline flex items-center">
                          <FaCamera className="mr-1"/> View Evidence
                        </a>
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        {item.status === 'Pending Action' && (
                           <span className="flex items-center text-xs font-bold text-yellow-600 bg-yellow-100 px-2 py-1 rounded-md w-max">
                             <FaClock className="mr-1"/> Pending
                           </span>
                        )}
                        {item.status === 'Retry Scheduled' && (
                           <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-md">Retry</span>
                        )}
                        {item.status === 'Return to Hub' && (
                           <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded-md">Return</span>
                        )}
                        {item.status === 'Escalated' && (
                           <span className="text-xs font-bold text-purple-600 bg-purple-100 px-2 py-1 rounded-md">Escalated</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="p-4">
                        {item.status === "Pending Action" ? (
                          <div className="flex justify-center space-x-2">
                            <button 
                              onClick={() => handleDecision(item.id, "Retry Scheduled")}
                              className="group relative p-2 bg-white border border-green-200 text-green-500 rounded-lg hover:bg-green-500 hover:text-white transition shadow-sm">
                              <FaTruck />
                              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">Retry</span>
                            </button>
                            
                            <button 
                              onClick={() => handleDecision(item.id, "Return to Hub")}
                              className="group relative p-2 bg-white border border-orange-200 text-orange-500 rounded-lg hover:bg-orange-500 hover:text-white transition shadow-sm">
                              <FaWarehouse />
                              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">Return to Hub</span>
                            </button>
                            
                            <button 
                              onClick={() => handleDecision(item.id, "Escalated")}
                              className="group relative p-2 bg-white border border-purple-200 text-purple-500 rounded-lg hover:bg-purple-500 hover:text-white transition shadow-sm">
                              <FaHeadset />
                              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">Support</span>
                            </button>
                          </div>
                        ) : (
                          <div className="text-center text-gray-400 text-sm">
                            <FaCheckCircle className="inline text-green-500 mr-1"/> Action Taken
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {failureCases.length === 0 && (
                <div className="p-10 text-center text-gray-400">
                   <FaCheckCircle className="text-4xl mx-auto mb-2 text-green-200"/>
                   <p>All clear! No delivery failures pending.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryFailures;