import React from 'react';
import logo from '../img/unnamed.png';
import { useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi"; // Import Logout Icon

const Header = ({ toggleMenu }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear session storage (if needed)
    localStorage.removeItem("adminToken");

    // Navigate to login
    navigate("/");
  };
  return (
    <div className="flex justify-between items-center p-4 bg-blue-700 text-white shadow-md">
      <div className="flex items-center space-x-4">
        <button onClick={toggleMenu} className="text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <img
          src={logo}
          alt="Profile"
          className="w-12 h-12 rounded-full"
        />
        <h1 className="text-3xl font-semibold">Abhivridhi Admin</h1>
       
      </div>
       <button
      className="flex items-center space-x-2 text-red-600 hover:text-red-800"
      onClick={handleLogout}
    >
      <span>Logout</span>
      <FiLogOut className="w-6 h-6" />
    </button>
    </div>
  );
};

export default Header;
