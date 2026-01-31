import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import {
  FaTachometerAlt, FaTruck, FaMoneyBill, FaCar, FaShippingFast,
  FaBoxes, FaUsers, FaUserTie, FaMapMarkedAlt, FaCity, FaHome,
  FaBuilding, FaNewspaper, FaBloggerB, FaStore, FaQuestionCircle,
  FaShieldAlt, FaHandsHelping, FaClipboard, FaExclamationTriangle,
  FaImage, FaArrowLeft, FaTags, FaUndo, FaGavel, FaCogs, FaUser,
  FaSignOutAlt
} from "react-icons/fa";
import logo from "../img/unnamed.png";

const menuItems = [
  { path: "/Dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
  { path: "/ops-dashboard", label: "Ops & Resolution", icon: <FaCogs /> },
  { path: "/marketing-coupons", label: "Marketing & Coupons", icon: <FaTags /> },
  { path: "/delivery-failures", label: "Delivery Failures", icon: <FaUndo /> },
  { path: "/rider-disputes", label: "Rider Disputes", icon: <FaGavel /> },
  { path: "/Near-by-store", label: "Near by Store", icon: <FaStore /> },
  { path: "/DeliveryPartners", label: "Delivery Partners", icon: <FaTruck /> },
  { path: "/All-Users", label: "All Users", icon: <FaUsers /> },
  { path: "/All-driver", label: "All Drivers", icon: <FaUsers /> },
  { path: "/Shipping", label: "Shipping", icon: <FaShippingFast /> },
  { path: "/truck-categories", label: "Truck Categories", icon: <FaTruck /> },
  { path: "/base-price", label: "Base Price", icon: <FaMoneyBill /> },
  { path: "/vechile-disc", label: "Vehicle Description", icon: <FaCar /> },
  { path: "/Categories", label: "Categories", icon: <FaBoxes /> },
  { path: "/Contacted-Users", label: "Contacted Users", icon: <FaUsers /> },
  { path: "/Clients", label: "Clients", icon: <FaUserTie /> },
  { path: "/complaints", label: "Complaints", icon: <FaBoxes /> },
  { path: "/States", label: "States", icon: <FaMapMarkedAlt /> },
  { path: "/Areas", label: "Areas", icon: <FaCity /> },
  { path: "/Addresses", label: "Addresses", icon: <FaHome /> },
  { path: "/Enterprise-Features", label: "Enterprise Features", icon: <FaBuilding /> },
  { path: "/News", label: "News", icon: <FaNewspaper /> },
  { path: "/Blog", label: "Blog", icon: <FaBloggerB /> },
  { path: "/FAQs", label: "FAQs", icon: <FaQuestionCircle /> },
  { path: "/Insurance-FAQ", label: "Insurance FAQ", icon: <FaShieldAlt /> },
  { path: "/Support", label: "Support", icon: <FaHandsHelping /> },
  { path: "/Policy", label: "Policy", icon: <FaClipboard /> },
  { path: "/ZeroTolerancePolicy", label: "Zero Tolerance Policy", icon: <FaExclamationTriangle /> },
  { path: "/Banners", label: "Banners", icon: <FaImage /> },
  { path: "/profile", label: "Profile", icon: <FaUser /> },
];

const Sidebar = ({ isOpen, toggleMenu }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const filteredItems = menuItems.filter((item) =>
    item.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    window.location.reload();
  };

  return (
    <>
      {/* Dark Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={toggleMenu}
        ></div>
      )}

      <div
        className={`fixed inset-y-0 left-0 transform ${isOpen ? "translate-x-0" : "-translate-x-full"
          } transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] bg-[#0f172a] text-slate-300 w-72 shadow-[10px_0_30px_-15px_rgba(0,0,0,0.5)] z-50 flex flex-col`}
      >
        {/* Header Section */}
        <div className="p-6 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="p-1.5 bg-white rounded-lg shadow-[0_0_15px_rgba(255,255,255,0.1)] group-hover:scale-110 transition-transform duration-300">
                <img src={logo} alt="Logo" className="w-9 h-9 object-contain" />
              </div>
              <h1 className="text-2xl font-black tracking-tight text-white uppercase font-sans">
                Abhivridhi
              </h1>
            </div>
            {/* Close button for mobile */}
            <button
              onClick={toggleMenu}
              className="p-2 hover:bg-slate-800 rounded-full transition-all text-slate-500 hover:text-white"
            >
              <FaArrowLeft size={16} />
            </button>
          </div>

          {/* Luxury Search Bar */}
          <div className="relative group">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Quick Search..."
              className="w-full pl-4 pr-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-slate-800 transition-all shadow-inner"
            />
          </div>
        </div>

        {/* Menu Items with Custom Scrollbar */}
        <div className="flex-grow px-3 overflow-hidden">
          <PerfectScrollbar options={{ wheelSpeed: 0.5, suppressScrollX: true }}>
            <ul className="space-y-1 pb-10">
              {filteredItems.map((item, index) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={index}>
                    <Link
                      to={item.path}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-semibold transition-all duration-300 group
                        ${isActive
                          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/50 translate-x-2"
                          : "hover:bg-slate-800 hover:text-white text-slate-400"
                        }`}
                    >
                      <span className={`text-lg transition-all duration-300 ${isActive ? "text-white scale-110" : "text-slate-500 group-hover:text-indigo-400 group-hover:scale-110"}`}>
                        {item.icon}
                      </span>
                      <span className="tracking-wide">{item.label}</span>

                      {isActive && (
                        <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </PerfectScrollbar>
        </div>

        {/* Footer Area - Fixed at bottom */}
        <div className="p-4 bg-slate-900/80 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-3 w-full p-3 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-red-600 hover:text-white transition-all duration-300 group shadow-lg"
          >
            <FaSignOutAlt className="group-hover:-translate-x-1 transition-transform" />
            <span>Sign Out</span>
          </button>
          <div className="mt-4 text-center">
            <p className="text-[10px] text-slate-600 uppercase tracking-[0.2em] font-bold">
              v2.0 • Abhivriti Tech
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;