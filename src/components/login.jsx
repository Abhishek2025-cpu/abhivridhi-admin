import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaLock, FaUser, FaEye, FaEyeSlash } from "react-icons/fa";
import { Oval } from "react-loader-spinner";
import logo from '../img/unnamed.png'


const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      if (email === "admin@test.com" && password === "admin123") {
        toast.success("Login Successful!", { position: "top-center" });
        navigate("/dashboard");
      } else {
        toast.error("Invalid Credentials!", { position: "top-center" });
      }
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-96">
        {/* Locker Icon */}
        <div className="flex justify-center mb-4">
          <FaLock className="text-blue-600 text-4xl" />
        </div>

        {/* Admin Logo */}
        <div className="flex justify-center mb-4">
          <img
            src={logo} // Replace with actual logo URL
            alt="Admin Logo"
            className="w-24 h-24 rounded-full border-2 border-gray-300"
          />
        </div>

        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">Admin Login</h2>

        <form onSubmit={handleLogin}>
          <div className="mb-4 relative">
            <label className="block text-gray-700 text-sm font-semibold mb-2">Email</label>
            <div className="flex items-center border rounded-md px-3">
              <FaUser className="text-gray-500 mr-2" />
              <input
                type="email"
                className="w-full py-2 focus:outline-none"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-4 relative">
            <label className="block text-gray-700 text-sm font-semibold mb-2">Password</label>
            <div className="flex items-center border rounded-md px-3">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full py-2 focus:outline-none"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-500 ml-2"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition flex justify-center items-center"
            disabled={loading}
          >
            {loading ? <Oval height={20} width={20} color="white" /> : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
