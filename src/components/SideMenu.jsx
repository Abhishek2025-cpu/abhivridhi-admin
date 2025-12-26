import React, { useState } from "react";
import { Link } from "react-router-dom";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import {
  FaTachometerAlt,
  FaTruck,
  FaMoneyBill,
  FaCar,
  FaShippingFast,
  FaBoxes,
  FaUsers,
  FaUserTie,
  FaMapMarkedAlt,
  FaCity,
  FaHome,
  FaBuilding,
  FaNewspaper,
  FaBloggerB,
  FaStore,
  FaQuestionCircle,
  FaShieldAlt,
  FaHandsHelping,
  FaClipboard,
  FaExclamationTriangle,
  FaImage,
  FaArrowLeft,
  FaTags,
  FaUndo,
  FaGavel,
  FaCogs
} from "react-icons/fa";
import logo from "../img/unnamed.png";

const menuItems = [
  { path: "/Dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
  { path: "/ops-dashboard", label: "Ops & Resolution", icon: <FaCogs /> },
  { path: "/marketing-coupons", label: "Marketing & Coupons", icon: <FaTags /> },
  { path: "/delivery-failures", label: "Delivery Failures", icon: <FaUndo /> },
  { path: "/rider-disputes", label: "Rider Disputes", icon: <FaGavel /> },
  { path: "/Near-by-store" , label: "Near by Store", icon: <FaStore />},
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
  { path: "/complaints", label: "complaints", icon: <FaBoxes /> },
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
];

const Sidebar = ({ isOpen, toggleMenu }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredItems = menuItems.filter((item) =>
    item.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className={`fixed inset-y-0 left-0 transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out bg-blue-700 text-white w-64 shadow-lg`}
    >
      <div className="p-6">
        <div className="flex items-center mb-6">
          <img src={logo} alt="Logo" className="w-12 h-12 mr-3" />
          <h1 className="text-xl font-bold">Abhivriti</h1>
        </div>

        <button
          onClick={toggleMenu}
          className="text-lg font-semibold bg-blue-800 hover:bg-blue-600 rounded-full p-2 mb-4 flex items-center"
        >
          <FaArrowLeft className="mr-2" /> Back
        </button>

        <div className="mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
            className="w-full p-2 rounded bg-blue-600 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div style={{ height: "calc(100vh - 200px)", overflow: "hidden" }}>
          <PerfectScrollbar>
            <ul className="space-y-2">
              {filteredItems.map((item, index) => (
                <li key={index} className="group">
                  <Link
                    to={item.path}
                    className="flex items-center space-x-3 p-2 rounded hover:bg-blue-600 transition-all"
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </PerfectScrollbar>
        </div>

        <div className="mt-6 text-center text-sm">
          <p>&copy; 2025 Abhivriti. All Rights Reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;