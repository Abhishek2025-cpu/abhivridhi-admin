import React from 'react';
import logo from '../img/unnamed.png';
import { useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi"; 
import { HiMenuAlt2 } from "react-icons/hi"; 

const Header = ({ toggleMenu }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear(); 
    navigate("/", { replace: true });
    window.location.reload(); 
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/60 px-6 py-3 shadow-sm">
      <div className="max-w-[1920px] mx-auto flex justify-between items-center relative">
        
        {/* LEFT SECTION: Toggle & Logo */}
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleMenu} 
            className="p-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 transition-all duration-300 active:scale-95 shadow-sm border border-slate-100"
          >
            <HiMenuAlt2 className="w-6 h-6" />
          </button>
          
          <div className="hidden md:flex items-center group cursor-pointer">
            <div className="relative overflow-hidden rounded-full w-10 h-10 border-2 border-white shadow-md group-hover:shadow-indigo-100 transition-all duration-300">
              <img
                src={logo}
                alt="Logo"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
          </div>
        </div>

        {/* CENTER SECTION: Classic Professional Title */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex flex-col items-center">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-800 font-serif">
              Abhivridhi
            </h1>
            <span className="hidden xs:block h-6 w-[1.5px] bg-slate-300 mx-1"></span>
            <span className="text-xs md:text-sm font-bold tracking-[0.2em] uppercase text-indigo-600">
              Admin
            </span>
          </div>
          {/* Decorative Underline - Professional look */}
          <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent mt-0.5"></div>
        </div>

        {/* RIGHT SECTION: Logout Button */}
        <div className="flex items-center">
          <button
            onClick={handleLogout}
            className="group relative flex items-center gap-2 bg-slate-50 border border-slate-200 text-slate-700 px-5 py-2.5 rounded-xl 
                       hover:bg-red-50 hover:text-red-600 hover:border-red-100 
                       transition-all duration-300 font-bold text-sm shadow-sm active:scale-95"
          >
            <span>Logout</span>
            <div className="p-1 bg-white rounded-lg shadow-sm group-hover:bg-red-600 group-hover:text-white transition-colors duration-300">
              <FiLogOut className="w-4 h-4" />
            </div>
          </button>
        </div>

      </div>
    </header>
  );
};

export default Header;