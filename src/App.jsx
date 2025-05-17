// App.jsx
import { BrowserRouter, Routes, Route, useLocation, Link } from "react-router-dom";
import { useState } from "react";
import Login from "./pages/Login";
import Home from "./pages/Home";
import PropertyDetails from "./pages/PropertyDetails";
import AddProperty from "./pages/AddProperty";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import BrokerManagement from "./pages/BrokerManagement.jsx";
import BuyerManagement from "./pages/BuyersManagment.jsx";
import AllMaps from "./pages/AllMaps.jsx";

import {
  FaHome,
  FaPlusSquare,
  FaBuilding,
  FaWallet,
  FaLock,
  FaSignOutAlt,
} from "react-icons/fa";
import companyLogo from "../public/WhatsApp Image 2025-05-01 at 16.53.33_ce5a9459.jpg";
import "./App.css";
import MyWallet from "./pages/MyWallet.jsx";
import PropertyPage from "./components/AllProperties.jsx";

// Custom wrapper to access location outside Routes
const AppWrapper = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isLoginPage = location.pathname === "/";

  return (
    <>
      {/* Sidebar (hidden on /login) */}
      {!isLoginPage && (
        <>

       <div
  className={`fixed top-0 left-0 min-h-screen w-64  bg-gray-700 shadow-xl transform ${
    isSidebarOpen ? "translate-x-0" : "-translate-x-full "
  } transition-transform duration-300 ease-in-out z-40`}
>
  <div className="p-6">
    <div className="flex justify-start items-end gap-3 mt-10 mb-5">
      <div className="rounded-2xl shadow-lg border-2 border-gray-200"  onClick={() => setIsSidebarOpen(false)}>
        <img
          src={companyLogo}
          alt="Company Logo"
          className="w-20 h-20 sm:w-16 sm:h-16 rounded-xl object-cover shadow-md"
        />
      </div>
      <h2 className="text-xl xl:text-2xl text-white font-bold mb-4">Menu</h2>
    </div>
    <ul className="space-y-4 text-start text-white">
      <li onClick={() => setIsSidebarOpen(false)} className="hover:pl-2 hover:scale-105 hover:text-gray-300 transition-all">
        <Link to="/home" className="flex items-center gap-3 font-semibold">
          <FaHome /> Home
        </Link>
      </li>
      <li onClick={() => setIsSidebarOpen(false)} className="hover:pl-2 hover:scale-105 hover:text-gray-300 transition-all">
        <Link to="/add-property" className="flex items-center gap-3 font-semibold">
          <FaPlusSquare /> Add Property
        </Link>
      </li>
      <li onClick={() => setIsSidebarOpen(false)} className="hover:pl-2 hover:scale-105 hover:text-gray-300 transition-all">
        <Link to="/onboard-properties" className="flex items-center gap-3 font-semibold">
          <FaBuilding /> On Board Properties
        </Link>
      </li>
      <li onClick={() => setIsSidebarOpen(false)} className="hover:pl-2 hover:scale-105 hover:text-gray-300 transition-all">
        <Link to="/mywallet" className="flex items-center gap-3 font-semibold">
          <FaWallet /> My Wallet
        </Link>
      </li>
      <li onClick={() => setIsSidebarOpen(false)} className="hover:pl-2 hover:scale-105 hover:text-gray-300 transition-all">
        <Link to="/change-password" className="flex items-center gap-3 font-semibold">
          <FaLock /> Change Password
        </Link>
      </li>
      <li onClick={() => setIsSidebarOpen(false)} className="hover:pl-2 hover:scale-105 text-red-500 hover:text-red-400 transition-all">
        <Link to="/logout" className="flex items-center gap-3 font-semibold">
          <FaSignOutAlt /> Logout
        </Link>
      </li>
    </ul>
  </div>
</div>


          {/* Mobile Overlay */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black opacity-30 z-30 xl:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          {/* Toggle Button - Hide if sidebar open */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className={`absolute top-1 left-1 z-50 text-gray-800  text-3xl   p-2 rounded-md ${
              isSidebarOpen || isLoginPage ? "hidden" : "block"
            }`}
          >
            ☰
          </button>
          
        </>
      )}

      {/* Main Page Content */}
      <div className={`${!isLoginPage ? "" : ""}`}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/property/:id"
            element={
              <ProtectedRoute>
                <PropertyDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-property"
            element={
              <ProtectedRoute>
                <AddProperty />
              </ProtectedRoute>
            }
          />
          <Route
            path="/brokers"
            element={
              <ProtectedRoute>
                <BrokerManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/buyers"
            element={
              <ProtectedRoute>
                <BuyerManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mywallet"
            element={
              <ProtectedRoute>
                <MyWallet/>
              </ProtectedRoute>
            }
          />
          <Route
            path="/allmaps"
            element={
              <ProtectedRoute>
                <AllMaps />
              </ProtectedRoute>
            }
          />
              <Route
            path="/allproperties"
            element={
              <ProtectedRoute>
                <PropertyPage/>
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </>
  );
};

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  </AuthProvider>
);

export default App;
