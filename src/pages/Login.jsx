"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext.jsx"
import { useNavigate } from "react-router-dom"
import companyLogo from "../../public/WhatsApp Image 2025-05-01 at 16.53.33_ce5a9459.jpg"

const Login = () => {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [fullName, setFullName] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home")
    }
  }, [isAuthenticated, navigate])

  const validateForm = () => {
    if (!fullName.trim()) {
      setError("Full name is required")
      return false
    }
    if (!password.trim()) {
      setError("Password is required")
      return false
    }
    if (password.length < 3) {
      setError("Password must be at least 3 characters long")
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const result = await login(fullName, password)

      if (result.success) {
        navigate("/home")
      } else {
        setError(result.message || "Login failed. Please try again.")
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

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
            <h1 className="text-3xl text-gray-500 md:text-4xl lg:text-5xl font-bold leading-tight mb-2">Welcome To</h1>
            <p className="bg-clip-text text-gray-600 bg-gradient-to-r from-white to-orange-200 font-semibold text-lg md:text-xl lg:text-2xl">
              RD Legal Consulting
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

        {error && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value)
              setError("") // Clear error when user types
            }}
            placeholder="Full Name"
            className="border border-gray-300 rounded-full px-5 py-3 w-full focus:outline-none focus:ring-2 focus:ring-gray-600 text-lg md:text-xl"
            disabled={loading}
          />

          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError("") // Clear error when user types
              }}
              placeholder="Password"
              className="border border-gray-300 rounded-full px-5 py-3 w-full pr-16 focus:outline-none focus:ring-2 focus:ring-gray-600 text-lg md:text-xl"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-5 top-1/2 transform -translate-y-1/2 text-sm text-gray-700 focus:outline-none"
              disabled={loading}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-gray-700 text-white py-3 rounded-full w-full font-semibold hover:opacity-90 transition text-lg md:text-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
