import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import companyLogo from "../../public/WhatsApp Image 2025-05-01 at 16.53.33_ce5a9459.jpg";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === "admin" && password === "admin") {
      login();
      navigate("/home");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans bg-[#fffaf3]">
      {/* Left Panel */}
      <div className="w-full md:w-1/2 bg-gray-300 text-[#7B3F00] p-6 flex flex-col justify-center relative overflow-hidden rounded-b-3xl md:rounded-r-[3rem] md:rounded-bl-none">
        {/* Logo */}
        <div className=" items-center mx-auto  mb-8 z-10">
          <div className="p-2  rounded-xl mx-auto animate-float">
            <img
              src={companyLogo}
              alt="Logo"
              className="w-60 xl:w-[28rem] h-60 xl:h-96 object-cover rounded-3xl xl:rounded-[80px]"
            />
          </div>
          <div>
            <h1 className="text-3xl text-gray-500 md:text-4xl lg:text-5xl font-bold leading-tight mb-2">Welcome To</h1>
            <p className="bg-clip-text text-gray-600 bg-gradient-to-r from-white to-orange-200 font-semibold text-lg md:text-xl lg:text-2xl">
            RD  Legal Consulting
            </p>
          </div>
        </div>

        {/* Animated Bubbles */}
        <div className="absolute top-10 left-10 w-14 h-14 bg-gray-600 opacity-10 rounded-full animate-ping"></div>
        <div className="absolute bottom-10 right-10 w-20 h-20 bg-gray-600 opacity-10 rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-16 h-16 bg-gray-600 opacity-10 rounded-full animate-bounce blur-sm"></div>
        <div className="absolute bottom-[20%] left-1/2 w-12 h-12 bg-gray-600 opacity-10 rounded-full animate-ping blur-sm"></div>
      </div>

      {/* Right Panel */}
      <div className="w-full md:w-1/2 bg-white p-8 md:p-12 lg:p-16 flex flex-col justify-center rounded-t-3xl md:rounded-l-[3rem] md:rounded-tl-none shadow-md">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-6 text-gray-800 text-center md:text-left">
          Admin Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Admin Name"
            className="border border-gray-300 rounded-full px-5 py-3 w-full focus:outline-none focus:ring-2 focus:ring-gray-600 text-lg md:text-xl"
          />

          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="border border-gray-300 rounded-full px-5 py-3 w-full pr-16 focus:outline-none focus:ring-2 focus:ring-gray-600 text-lg md:text-xl"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-5 top-1/2 transform -translate-y-1/2 text-sm text-gray-700 focus:outline-none"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button
            type="submit"
            className="bg-gray-700 text-white py-3 rounded-full w-full font-semibold hover:opacity-90 transition text-lg md:text-xl"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
