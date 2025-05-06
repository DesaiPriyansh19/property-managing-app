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
    <div className="min-h-screen flex flex-col md:flex-row font-sans bg-gradient-to-r from-[#7B3F00] to-[#A0522D]">
      {/* Left Panel */}
      <div className="w-full md:w-1/2 bg-gradient-to-r from-[#7B3F00] to-[#A0522D] text-white p-6 flex flex-col justify-center relative overflow-hidden rounded-b-3xl md:rounded-r-[3rem] md:rounded-bl-none">
        {/* Logo */}
        <div className=" items-center mx-auto  mb-8 z-10">
          <div className="p-2  rounded-xl mx-auto animate-float">
            <img
              src={companyLogo}
              alt="Logo"
              className="w-60 xl:w-[28rem] h-[28rem] xl:h-96 object-cover rounded-lg xl:rounded-[80px]"
            />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">RD Revenue</h1>
            <p className="bg-clip-text text-transparent bg-gradient-to-r from-white to-orange-200 font-semibold text-lg md:text-xl lg:text-2xl">
              Legal Consulting
            </p>
          </div>
        </div>

        {/* Animated Bubbles */}
        <div className="absolute top-10 left-10 w-14 h-14 bg-white opacity-10 rounded-full animate-ping"></div>
        <div className="absolute bottom-10 right-10 w-20 h-20 bg-white opacity-10 rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-16 h-16 bg-white opacity-10 rounded-full animate-bounce blur-sm"></div>
        <div className="absolute bottom-[20%] left-1/2 w-12 h-12 bg-white opacity-10 rounded-full animate-ping blur-sm"></div>
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
            className="border border-gray-300 rounded-full px-5 py-3 w-full focus:outline-none focus:ring-2 focus:ring-[#A0522D] text-lg md:text-xl"
          />

          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="border border-gray-300 rounded-full px-5 py-3 w-full pr-16 focus:outline-none focus:ring-2 focus:ring-[#A0522D] text-lg md:text-xl"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-5 top-1/2 transform -translate-y-1/2 text-sm text-[#A0522D] focus:outline-none"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button
            type="submit"
            className="bg-gradient-to-r from-[#7B3F00] to-[#A0522D] text-white py-3 rounded-full w-full font-semibold hover:opacity-90 transition text-lg md:text-xl"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
