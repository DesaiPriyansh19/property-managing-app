// src/components/Layout.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { FaHome, FaPlusSquare, FaBuilding, FaWallet, FaLock, FaSignOutAlt } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";

import companyLogo from "../../public/WhatsApp Image 2025-05-01 at 16.53.33_ce5a9459.jpg"; // update path if needed

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-64 xl:w-72 bg-gray-700 shadow-xl transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out z-40`}>


        <div className="p-6">
          <div className="flex justify-start items-end gap-3 mt-10 mb-5">
            <div className="rounded-2xl shadow-lg border-2 border-gray-200">
              <img
                src={companyLogo}
                alt="Company Logo"
                className="w-20 h-20 sm:w-16 sm:h-16 rounded-xl object-cover shadow-md"
              />
            </div>
            <h2 className="text-xl xl:2xl text-white font-bold mb-4">Menu</h2>
            
          </div>

          <ul className="space-y-4 text-start text-white">
            {[
              { to: "/home", icon: <FaHome />, label: "Home" },
              { to: "/add-property", icon: <FaPlusSquare />, label: "Add Property" },
              { to: "/onboard-properties", icon: <FaBuilding />, label: "On Board Properties" },
              { to: "/mywallet", icon: <FaWallet />, label: "My Wallet" },
              { to: "https://web.whatsapp.com/", icon: <FaWhatsapp />, label: "WhatsApp" },
              { to: "/change-password", icon: <FaLock />, label: "Change Password" },
              { to: "/logout", icon: <FaSignOutAlt />, label: "Logout", danger: true },
            ].map(({ to, icon, label, danger }) => (
              <li
                key={to}
                className={`transition-all duration-300 hover:pl-2 hover:scale-105 ${
                  danger ? "text-red-500 hover:text-red-400" : "hover:text-gray-300"
                }`}
              >
                <Link to={to} className="flex items-center gap-3 font-semibold">
                  {icon} {label}
                </Link>
              </li>
            ))}
            
          </ul>
        </div>
      </div>

      {/* Sidebar overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-30 z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 left-4 text-white text-3xl focus:outline-none z-50"
      >
        ☰
      </button>

      {/* Main Content */}
      <div className="flex-1 ml-0 xl:ml-72 p-6 w-full">{children}</div>
    </div>
    
  );
};

export default Layout;
