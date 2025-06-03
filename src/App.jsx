"use client";
import PageWrapper from "./components/PageWrapper";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Link,
} from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Login from "./pages/Login";
import Home from "./pages/Home";
import PropertyDetails from "./pages/PropertyDetails";
import AddProperty from "./pages/AddProperty";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import BrokerManagement from "./pages/BrokerManagement.jsx";
import BuyerManagement from "./pages/BuyersManagment.jsx";
import AllMaps from "./pages/AllMaps.jsx";
import Logout from "./pages/Logout.jsx";
import ChangePassword from "./pages/ChangePassword.jsx";

import {
  FaHome,
  FaPlusSquare,
  FaBuilding,
  FaWallet,
  FaLock,
  FaSignOutAlt,
  FaWhatsapp,
  FaTrash,
  FaTimes,
} from "react-icons/fa";
import companyLogo from "../public/WhatsApp Image 2025-05-01 at 16.53.33_ce5a9459.jpg";
import "./App.css";
import MyWallet from "./pages/MyWallet.jsx";
import PropertyPage from "./components/AllProperties.jsx";
import OnBoardProperties from "./pages/OnBoardProperties.jsx";
import RecycleBin from "./pages/RecycleBin.jsx";

// Custom wrapper to access location outside Routes
const AppWrapper = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isLoginPage = location.pathname === "/";
  const sidebarRef = useRef(null);
  const [activeRoute, setActiveRoute] = useState("");

  // Set active route based on current location
  useEffect(() => {
    setActiveRoute(location.pathname);
  }, [location]);

  // Handle click outside to close sidebar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        isSidebarOpen
      ) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]);

  // Sidebar animation variants
  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    closed: {
      x: "-100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
  };

  // Menu item animation variants
  const menuItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
  };

  const menuItems = [
    { path: "/home", name: "Home", icon: <FaHome className="text-lg" /> },
    {
      path: "/add-property",
      name: "Add Property",
      icon: <FaPlusSquare className="text-lg" />,
    },
    {
      path: "/recycle-bin",
      name: "RecycleBin",
      icon: <FaTrash className="text-lg" />,
    },
    {
      path: "/onboard-properties",
      name: "On Board Properties",
      icon: <FaBuilding className="text-lg" />,
    },
    {
      path: "/mywallet",
      name: "My Wallet",
      icon: <FaWallet className="text-lg" />,
    },
    {
      path: "/change-password",
      name: "Change Password",
      icon: <FaLock className="text-lg" />,
    },
    {
      path: "https://web.whatsapp.com/",
      name: "WhatsApp",
      icon: <FaWhatsapp className="text-lg" />,
      external: true,
    },
    {
      path: "/logout",
      name: "Logout",
      icon: <FaSignOutAlt className="text-lg" />,
      className: "text-red-500 hover:text-red-400",
    },
  ];

  return (
    <>
      {/* Sidebar (hidden on /login) */}
      {!isLoginPage && (
        <>
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSidebarOpen(false)}
              />
            )}
          </AnimatePresence>

          <motion.div
            ref={sidebarRef}
            className="fixed top-0 left-0 min-h-screen w-72 bg-gradient-to-b from-gray-800 to-gray-900 shadow-2xl z-40 overflow-hidden"
            variants={sidebarVariants}
            initial="closed"
            animate={isSidebarOpen ? "open" : "closed"}
          >
            <div className="p-6 h-full flex flex-col">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-end gap-3">
                  <div className="rounded-2xl shadow-lg border-2 border-gray-700 overflow-hidden">
                    <img
                      src={companyLogo || "/placeholder.svg"}
                      alt="Company Logo"
                      className="w-16 h-16 object-cover"
                    />
                  </div>
                  <h2 className="text-2xl text-white font-bold">Menu</h2>
                </div>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-700 transition-colors"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="overflow-y-auto flex-grow">
                <ul className="space-y-2 text-start">
                  {menuItems.map((item, index) => (
                    <motion.li
                      key={item.name}
                      custom={index}
                      variants={menuItemVariants}
                      initial="hidden"
                      animate="visible"
                      className={`rounded-lg overflow-hidden ${
                        isSidebarOpen ? "" : "opacity-0"
                      }`}
                    >
                      {item.external ? (
                        <a
                          href={item.path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center gap-3 font-medium py-3 px-4 rounded-lg ${
                            item.className || "text-gray-200 hover:text-white"
                          } hover:bg-gray-700/50 transition-all duration-200`}
                        >
                          {item.icon}
                          <span>{item.name}</span>
                        </a>
                      ) : (
                        <Link
                          to={item.path}
                          onClick={() => setIsSidebarOpen(false)}
                          className={`flex items-center gap-3 font-medium py-3 px-4 rounded-lg ${
                            activeRoute === item.path
                              ? "bg-gray-700/70 text-white font-semibold"
                              : item.className ||
                                "text-gray-200 hover:text-white"
                          } hover:bg-gray-700/50 transition-all duration-200`}
                        >
                          {item.icon}
                          <span>{item.name}</span>
                          {activeRoute === item.path && (
                            <motion.div
                              className="ml-auto w-1.5 h-5 bg-blue-500 rounded-full"
                              layoutId="activeIndicator"
                            />
                          )}
                        </Link>
                      )}
                    </motion.li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto pt-4 text-center text-gray-400 text-xs">
                <p>© 2025 Property Management</p>
              </div>
            </div>
          </motion.div>

          {/* Toggle Button */}
          <motion.button
            onClick={() => setIsSidebarOpen(true)}
            className={`fixed top-4 left-6 z-20 text-gray-800 hover:text-gray-700 text-xl  ${
              isSidebarOpen || isLoginPage ? "hidden" : "flex"
            } items-center justify-center`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </motion.button>
        </>
      )}

      {/* Main Page Content */}
      <div>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <PageWrapper>
                  <Home />
                </PageWrapper>
              </ProtectedRoute>
            }
          />
          <Route
            path="/property/:id"
            element={
              <ProtectedRoute>
                <PageWrapper>
                  <PropertyDetails />
                </PageWrapper>
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-property"
            element={
              <ProtectedRoute>
                <PageWrapper>
                  <AddProperty />
                </PageWrapper>
              </ProtectedRoute>
            }
          />
          <Route
            path="/onboard-properties"
            element={
              <ProtectedRoute>
                <PageWrapper>
                  <OnBoardProperties />
                </PageWrapper>
              </ProtectedRoute>
            }
          />
          <Route
            path="/recycle-bin"
            element={
              <ProtectedRoute>
                <PageWrapper>
                  <RecycleBin />
                </PageWrapper>
              </ProtectedRoute>
            }
          />
          <Route
            path="/brokers"
            element={
              <ProtectedRoute>
                <PageWrapper>
                  <BrokerManagement />
                </PageWrapper>
              </ProtectedRoute>
            }
          />
          <Route
            path="/buyers"
            element={
              <ProtectedRoute>
                <PageWrapper>
                  <BuyerManagement />
                </PageWrapper>
              </ProtectedRoute>
            }
          />
          <Route
            path="/mywallet"
            element={
              <ProtectedRoute>
                <PageWrapper>
                  <MyWallet />
                </PageWrapper>
              </ProtectedRoute>
            }
          />
          <Route
            path="/allmaps"
            element={
              <ProtectedRoute>
                <PageWrapper>
                  <AllMaps />
                </PageWrapper>
              </ProtectedRoute>
            }
          />
          <Route
            path="/allproperties/:slug"
            element={
              <ProtectedRoute>
                <PageWrapper>
                  <PropertyPage />
                </PageWrapper>
              </ProtectedRoute>
            }
          />
          <Route
            path="/change-password"
            element={
              <ProtectedRoute>
                <PageWrapper>
                  <ChangePassword />
                </PageWrapper>
              </ProtectedRoute>
            }
          />
          <Route path="/logout" element={<Logout />} />
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
