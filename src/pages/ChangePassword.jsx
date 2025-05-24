"use client";

import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import companyLogo from "../../public/WhatsApp Image 2025-05-01 at 16.53.33_ce5a9459.jpg";

const ChangePassword = () => {
  const { user } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const validateForm = () => {
    if (!currentPassword.trim()) {
      setError("Current password is required");
      return false;
    }
    if (!newPassword.trim()) {
      setError("New password is required");
      return false;
    }
    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters long");
      return false;
    }
    if (!confirmPassword.trim()) {
      setError("Please confirm your new password");
      return false;
    }
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return false;
    }
    if (currentPassword === newPassword) {
      setError("New password must be different from current password");
      return false;
    }
    return true;
  };

  console.log(user);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("authToken");
      const userId = user?._id;

      const response = await fetch(
        `${API_URL}/api/users/password/change-password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId,
            currentPassword,
            newPassword,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccess("Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");

        // Redirect to home after 2 seconds
        setTimeout(() => {
          navigate("/home");
        }, 2000);
      } else {
        setError(
          data.message || "Failed to change password. Please try again."
        );
      }
    } catch (error) {
      console.error("Change password error:", error);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans bg-[#fffaf3]">
      {/* Left Panel */}
      <div className="w-full md:w-1/2 bg-gray-300 text-[#7B3F00] p-6 flex flex-col justify-center relative overflow-hidden rounded-b-3xl md:rounded-r-[3rem] md:rounded-bl-none">
        {/* Logo */}
        <div className=" items-center mx-auto  mb-8 z-10">
          <div className="p-2  rounded-xl mx-auto animate-float">
            <img
              src={companyLogo || "/placeholder.svg"}
              alt="Logo"
              className="w-60 xl:w-[28rem] h-60 xl:h-96 object-cover rounded-3xl xl:rounded-[80px]"
            />
          </div>
          <div>
            <h1 className="text-3xl text-gray-500 md:text-4xl lg:text-5xl font-bold leading-tight mb-2">
              Secure Your
            </h1>
            <p className="bg-clip-text text-gray-600 bg-gradient-to-r from-white to-orange-200 font-semibold text-lg md:text-xl lg:text-2xl">
              Account Access
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
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-2 text-gray-800 text-center md:text-left">
            Change Password
          </h2>
          {user && (
            <p className="text-gray-600 text-center md:text-left">
              Welcome, {user.FullName}
            </p>
          )}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Current Password */}
          <div className="relative">
            <input
              type={showCurrentPassword ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => {
                setCurrentPassword(e.target.value);
                clearMessages();
              }}
              placeholder="Current Password"
              className="border border-gray-300 rounded-full px-5 py-3 w-full pr-16 focus:outline-none focus:ring-2 focus:ring-gray-600 text-lg md:text-xl"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-5 top-1/2 transform -translate-y-1/2 text-sm text-gray-700 focus:outline-none"
              disabled={loading}
            >
              {showCurrentPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* New Password */}
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                clearMessages();
              }}
              placeholder="New Password"
              className="border border-gray-300 rounded-full px-5 py-3 w-full pr-16 focus:outline-none focus:ring-2 focus:ring-gray-600 text-lg md:text-xl"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-5 top-1/2 transform -translate-y-1/2 text-sm text-gray-700 focus:outline-none"
              disabled={loading}
            >
              {showNewPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* Confirm New Password */}
          <div className="relative mb-4">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                clearMessages();
              }}
              placeholder="Confirm New Password"
              className="border border-gray-300 rounded-full px-5 py-3 w-full pr-16 focus:outline-none focus:ring-2 focus:ring-gray-600 text-lg md:text-xl"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-5 top-1/2 transform -translate-y-1/2 text-sm text-gray-700 focus:outline-none"
              disabled={loading}
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* Password Requirements */}
          <div className="text-sm text-gray-600 mb-4">
            <p>Password requirements:</p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>At least 6 characters long</li>
              <li>Different from current password</li>
            </ul>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate("/home")}
              className="bg-gray-300 text-gray-700 py-3 rounded-full w-full font-semibold hover:bg-gray-400 transition text-lg md:text-xl"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-gray-700 text-white py-3 rounded-full w-full font-semibold hover:opacity-90 transition text-lg md:text-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Changing...
                </>
              ) : (
                "Change Password"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
