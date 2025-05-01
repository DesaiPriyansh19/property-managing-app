// src/pages/Login.jsx
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import companyLogo from "../../public/logo final PNG.png";
const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can add a dummy condition like:
    if (username === "admin" && password === "admin") {
      login();
      navigate("/home");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-md mx-auto">
        <div className="flex items-center gap-5 mb-6 lg:mb-0">
                  <div className="p-1.5 bg-gradient-to-br from-[#7B3F00] to-[#A0522D] rounded-2xl shadow-2xl animate-float">
                    <img 
                      src={companyLogo} 
                      alt="Logo" 
                      className="w-16 h-16 rounded-xl border-4 border-white/20 bg-white/10 backdrop-blur-sm" 
                    />
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    <span className="block">RD Revenue</span>
                    <span className="bg-gradient-to-r from-[#7B3F00] to-[#A0522D] bg-clip-text text-transparent">
                      Legal Consulting
                    </span>
                  </h1>
                </div>
      <h2 className="text-xl font-semibold mb-4 my-20">Enter Admin Name and PassWord</h2>
      <input
        type="text"
        value={username}
        onChange={e => setUsername(e.target.value)}
        placeholder="Admin Name"
        className="block w-full mb-3 p-2 border-2 border-[#7B3F00] rounded-xl"
      />
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Password"
        className="block w-full mb-3 p-2 border-2 border-[#7B3F00] rounded-xl"
      />
      <button type="submit" className="bg-gradient-to-r from-[#7B3F00] to-[#A0522D] text-white px-4 py-2 rounded">Login</button>
    </form>
  );
};

export default Login;
