import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaLock, FaUser, FaEye, FaEyeSlash, FaShieldAlt } from "react-icons/fa";
import { Oval } from "react-loader-spinner";
import { motion } from "framer-motion";
import logo from "../img/unnamed.png";
import { loginAdmin } from "../auth/authController";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await loginAdmin(email, password);

    if (result.success) {
      toast.success(result.message, { position: "top-center" });
      setTimeout(() => navigate("/dashboard"), 1000);
    } else {
      toast.error(result.message, { position: "top-center" });
    }
    setLoading(false);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden font-sans">

      {/* 🔥 Animated Gradient Background */}
      <div className="absolute inset-0 animated-gradient z-0"></div>

      {/* 🔥 Moving ABHIVRIDDHI Background Text */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="scrolling-text">
          ABHIVRIDDHI • ABHIVRIDDHI • ABHIVRIDDHI • ABHIVRIDDHI • ABHIVRIDDHI •
        </div>
      </div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md px-6"
      >
        <div className="bg-white/80 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-white rounded-[2.5rem] p-10">

          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="relative mb-4"
            >
              <img
                src={logo}
                alt="Admin Logo"
                className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover"
              />
              <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-2 rounded-full">
                <FaShieldAlt size={14} />
              </div>
            </motion.div>

            <h2 className="text-3xl font-extrabold text-gray-800">
              Admin <span className="text-blue-600">Portal</span>
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Powered by Abhivriddhi
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label className="text-xs font-bold text-gray-600 ml-1">
                Email Address
              </label>
              <div className="flex items-center bg-gray-50 rounded-2xl px-4 py-3">
                <FaUser className="text-gray-400" />
                <input
                  type="email"
                  className="w-full bg-transparent outline-none px-3"
                  placeholder="admin@abhivriddhi.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-bold text-gray-600 ml-1">
                Secure Password
              </label>
              <div className="flex items-center bg-gray-50 rounded-2xl px-4 py-3">
                <FaLock className="text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full bg-transparent outline-none px-3"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 rounded-2xl flex justify-center"
            >
              {loading ? <Oval height={20} width={20} color="white" /> : "ACCESS DASHBOARD"}
            </motion.button>
          </form>
        </div>
      </motion.div>

      {/* 🔥 CSS */}
      <style jsx>{`
        .animated-gradient {
          background: linear-gradient(
            120deg,
            #1e3a8a,
            #4338ca,
            #7c3aed,
            #1e3a8a
          );
          background-size: 300% 300%;
          animation: gradientMove 14s ease infinite;
        }

        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

.scrolling-text {
  position: absolute;
  top: 50%;
  left: 0;
  width: 200%;
  font-size: 7rem;
  font-weight: 900;
  letter-spacing: 1rem;
  color: rgba(255, 255, 255, 0.07);
  white-space: nowrap;
  transform: translateY(-50%);
  animation: scrollText 30s linear infinite;
  text-transform: uppercase;
}

        @keyframes scrollText {
          from { transform: translate(-50%, -50%) rotate(-12deg); }
          to { transform: translate(0%, -50%) rotate(-12deg); }
        }
      `}</style>
    </div>
  );
};

export default Login;
