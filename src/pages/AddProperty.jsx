"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { X, Loader2, AlertCircle, CheckCircle, Upload } from "lucide-react"
import PropertyAPI from "../services/PropertyApi"

const AddProperty = () => {
  const navigate = useNavigate()
  const navigationTimeoutRef = useRef(null)
  const pollIntervalRef = useRef(null)
  const [formData, setFormData] = useState({
    fileType: "",
    landType: "",
    tenure: "",
    personWhoShared: "",
    contactNumber: "",
    village: "",
    taluko: "",
    district: "",
    serNoNew: "",
    serNoOld: "",
    fpNo: "",
    tp: "",
    zone: "",
    srArea: "",
    fpArea: "",
    srRate: "",
    fpRate: "",
    mtrRoad: "",
    nearByLandmark: "",
    notes: "",
    mapLink: "",
  })

  const [images, setImages] = useState([])
  const [pdfs, setPdfs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [uploadStatus, setUploadStatus] = useState(null)
  const [createdPropertyId, setCreatedPropertyId] = useState(null)
  const [isNavigating, setIsNavigating] = useState(false)
  const [countdown, setCountdown] = useState(0)

  // Field mapping for form inputs
  const inputFields = [
    {
      key: "personWhoShared",
      placeholder: "Person Who Shared",
      required: true,
    },
    { key: "contactNumber", placeholder: "Contact Number", required: true },
    { key: "village", placeholder: "Village" },
    { key: "taluko", placeholder: "Taluko" },
    { key: "district", placeholder: "District" },
    { key: "serNoNew", placeholder: "SerNo (New)" },
    { key: "serNoOld", placeholder: "SerNo (Old)" },
    { key: "fpNo", placeholder: "FP.NO" },
    { key: "tp", placeholder: "T P" },
    { key: "zone", placeholder: "Zone" },
    { key: "srArea", placeholder: "Sr.Area" },
    { key: "fpArea", placeholder: "FP.Area" },
    { key: "srRate", placeholder: "SR.Rate (₹)", type: "number" },
    { key: "fpRate", placeholder: "FP.Rate (₹)", type: "number" },
    { key: "mtrRoad", placeholder: "MTR.Road" },
    { key: "nearByLandmark", placeholder: "NearBy(land mark)" },
  ]

  // Handle input changes
  const handleInputChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
    if (error) setError("")
  }

  // Handle dropdown changes
  const handleSelectChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
    if (error) setError("")
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    const newImages = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      name: file.name,
    }))
    setImages((prev) => [...prev, ...newImages])
  }

  const handlePdfUpload = (e) => {
    const files = Array.from(e.target.files)
    const newPdfs = files.map((file) => ({
      file,
      name: file.name,
      url: URL.createObjectURL(file),
    }))
    setPdfs((prev) => [...prev, ...newPdfs])
  }

  const removeImage = (index) => {
    const updated = [...images]
    if (updated[index].url.startsWith("blob:")) {
      URL.revokeObjectURL(updated[index].url)
    }
    updated.splice(index, 1)
    setImages(updated)
  }

  const removePdf = (index) => {
    const updated = [...pdfs]
    if (updated[index].url.startsWith("blob:")) {
      URL.revokeObjectURL(updated[index].url)
    }
    updated.splice(index, 1)
    setPdfs(updated)
  }

  // Form validation
  const validateForm = () => {
    if (!formData.fileType) {
      setError("Please select a file type")
      return false
    }
    if (!formData.landType) {
      setError("Please select a land type")
      return false
    }
    if (!formData.tenure) {
      setError("Please select a tenure")
      return false
    }
    if (!formData.personWhoShared.trim()) {
      setError("Person who shared is required")
      return false
    }
    if (!formData.contactNumber.trim()) {
      setError("Contact number is required")
      return false
    }

    const phoneRegex = /^[0-9]{10,15}$/
    if (!phoneRegex.test(formData.contactNumber.replace(/\s+/g, ""))) {
      setError("Please enter a valid contact number")
      return false
    }

    return true
  }

  // Guaranteed navigation function
  const forceNavigateToHome = () => {
    console.log("🚀 FORCE NAVIGATE TO HOME")

    // Clear any existing timeouts/intervals
    if (navigationTimeoutRef.current) {
      clearTimeout(navigationTimeoutRef.current)
    }
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current)
    }

    setIsNavigating(true)
    setSuccess("Upload completed! Redirecting to home page...")

    // Cleanup blob URLs
    images.forEach((img) => {
      if (img.url && img.url.startsWith("blob:")) {
        URL.revokeObjectURL(img.url)
      }
    })
    pdfs.forEach((pdf) => {
      if (pdf.url && pdf.url.startsWith("blob:")) {
        URL.revokeObjectURL(pdf.url)
      }
    })

    // Navigate with multiple fallbacks
    setTimeout(() => {
      try {
        navigate("/home", { replace: true })
        console.log("✅ Navigation executed")
      } catch (error) {
        console.error("❌ Navigation failed, using window.location:", error)
        window.location.href = "/home"
      }
    }, 500)
  }

  // Enhanced upload status checking with multiple methods
  const checkUploadCompletion = async (propertyId) => {
    try {
      console.log(`🔍 Checking upload status for property ${propertyId}`)

      // Method 1: Check upload status endpoint
      try {
        const status = await PropertyAPI.getUploadStatus(propertyId)
        console.log("📊 Upload status response:", status)

        if (status.uploadStatus === "completed") {
          console.log("✅ Upload completed via status endpoint")
          return { completed: true, method: "status" }
        }

        if (status.uploadStatus === "failed") {
          console.log("❌ Upload failed via status endpoint")
          return { completed: true, method: "status", failed: true }
        }

        // Update progress if available
        setUploadStatus(status)
      } catch (statusError) {
        console.error("❌ Status endpoint error:", statusError)
      }

      // Method 2: Check property directly to see if files exist
      try {
        const property = await PropertyAPI.getPropertyById(propertyId)
        console.log("🏠 Property data:", property)

        if (property.data) {
          const hasImages = property.data.images && property.data.images.length > 0
          const hasPdfs = property.data.pdfs && property.data.pdfs.length > 0
          const expectedFiles = images.length + pdfs.length

          console.log(
            `📁 Files check: expected ${expectedFiles}, found ${(property.data.images?.length || 0) + (property.data.pdfs?.length || 0)}`,
          )

          // If we have files in the database, consider upload complete
          if ((hasImages || hasPdfs) && expectedFiles > 0) {
            const actualFiles = (property.data.images?.length || 0) + (property.data.pdfs?.length || 0)
            if (actualFiles >= expectedFiles) {
              console.log("✅ Upload completed via property check")
              return { completed: true, method: "property" }
            }
          }

          // Check if uploadStatus in property indicates completion
          if (property.data.uploadStatus === "completed") {
            console.log("✅ Upload completed via property uploadStatus")
            return { completed: true, method: "property-status" }
          }
        }
      } catch (propertyError) {
        console.error("❌ Property check error:", propertyError)
      }

      return { completed: false }
    } catch (error) {
      console.error("💥 Upload check error:", error)
      return { completed: false, error: true }
    }
  }

  // Enhanced polling with multiple detection methods
  useEffect(() => {
    if (createdPropertyId && uploadStatus?.uploadStatus === "uploading") {
      console.log(`🔄 Starting enhanced upload polling for property ${createdPropertyId}`)

      let pollCount = 0
      const maxPolls = 30 // 1 minute max (30 * 2 seconds)
      let consecutiveErrors = 0
      const maxConsecutiveErrors = 3

      pollIntervalRef.current = setInterval(async () => {
        pollCount++
        console.log(`📊 Upload poll ${pollCount}/${maxPolls}`)

        const result = await checkUploadCompletion(createdPropertyId)

        if (result.completed) {
          console.log(`🎉 Upload completed via ${result.method}`)
          clearInterval(pollIntervalRef.current)

          if (result.failed) {
            setError("Some files failed to upload, but property was created. Redirecting...")
          }

          forceNavigateToHome()
          return
        }

        if (result.error) {
          consecutiveErrors++
          console.log(`💥 Consecutive errors: ${consecutiveErrors}/${maxConsecutiveErrors}`)

          if (consecutiveErrors >= maxConsecutiveErrors) {
            console.log("🔄 Too many errors - assuming upload completed")
            clearInterval(pollIntervalRef.current)
            setSuccess("Upload status unclear. Redirecting to home...")
            forceNavigateToHome()
            return
          }
        } else {
          consecutiveErrors = 0 // Reset on success
        }

        // Force navigation after max polls
        if (pollCount >= maxPolls) {
          console.log("⏰ Max polls reached - forcing navigation")
          clearInterval(pollIntervalRef.current)
          setSuccess("Upload is taking longer than expected. Redirecting...")
          forceNavigateToHome()
          return
        }
      }, 2000)

      // Absolute fallback - force navigation after 2 minutes
      navigationTimeoutRef.current = setTimeout(() => {
        console.log("🚨 ABSOLUTE TIMEOUT - Force navigating after 2 minutes")
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current)
        }
        setSuccess("Upload timeout reached. Redirecting to home...")
        forceNavigateToHome()
      }, 120000) // 2 minutes
    }

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current)
      }
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current)
      }
    }
  }, [createdPropertyId, uploadStatus?.uploadStatus, images.length, pdfs.length])

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!validateForm()) {
      return
    }

    setLoading(true)
    console.log("🚀 Submitting property...")

    try {
      const propertyData = {
        ...formData,
        images,
        pdfs,
      }

      const response = await PropertyAPI.createProperty(propertyData)
      console.log("✅ Property created:", response)

      const hasFiles = images.length > 0 || pdfs.length > 0

      if (hasFiles) {
        console.log(`📁 Files detected - setting up upload tracking`)
        setCreatedPropertyId(response.property._id)
        setUploadStatus({
          uploadStatus: "uploading",
          totalFiles: images.length + pdfs.length,
          uploadedFiles: 0,
          progress: 0,
        })
        setSuccess("Property created! Files are uploading...")

        // Start a shorter timeout for file uploads (30 seconds)
        setTimeout(() => {
          console.log("⏰ Short timeout - checking if upload completed")
          checkUploadCompletion(response.property._id).then((result) => {
            if (result.completed) {
              console.log("✅ Upload completed via short timeout check")
              forceNavigateToHome()
            }
          })
        }, 30000)
      } else {
        console.log("📄 No files - immediate navigation")
        setSuccess("Property created successfully!")
        setTimeout(forceNavigateToHome, 2000)
      }
    } catch (err) {
      console.error("💥 Submit error:", err)
      setError(err.message || "Failed to add property. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Manual navigation
  const handleManualNavigation = () => {
    console.log("👆 Manual navigation triggered")
    forceNavigateToHome()
  }

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gray-200 border shadow-lg rounded-xl">
      <h2 className="text-3xl font-bold mb-6 text-gray-700">Upload Property Details</h2>

      {/* Success/Error Messages */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center gap-2">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 flex items-center gap-2">
          <CheckCircle size={20} />
          {success}
          {countdown > 0 && <span className="ml-2 font-bold">({countdown}s)</span>}
        </div>
      )}

      {/* Navigation Status */}
      {isNavigating && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4 flex items-center gap-2">
          <Loader2 className="animate-spin" size={20} />
          <span>Redirecting to home page...</span>
        </div>
      )}

      {/* Upload Progress with Manual Override */}
      {uploadStatus && uploadStatus.uploadStatus === "uploading" && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Upload className="animate-pulse" size={20} />
              <span className="font-medium">Uploading to Cloudinary...</span>
            </div>
            <button
              onClick={handleManualNavigation}
              className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 font-medium"
            >
              ✅ Upload Done? Go Home
            </button>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadStatus.progress || 0}%` }}
            ></div>
          </div>
          <p className="text-sm mt-1">
            {uploadStatus.uploadedFiles || 0} of {uploadStatus.totalFiles || 0} files uploaded (
            {uploadStatus.progress || 0}%)
          </p>
          <p className="text-xs mt-1 text-blue-600">If upload seems stuck, click "Upload Done? Go Home" above</p>
        </div>
      )}

      {/* Rest of the form remains the same */}
      <div className="flex items-center justify-center gap-2 w-full flex-wrap">
        <div className="w-full sm:w-[50%] max-w-xs my-3">
          <select
            value={formData.fileType}
            onChange={(e) => handleSelectChange("fileType", e.target.value)}
            className="block w-full rounded-xl border border-gray-300 bg-white p-3 text-gray-700 shadow-sm focus:border-gray-500 focus:ring focus:ring-gray-200 focus:outline-none"
            required
            disabled={loading || isNavigating}
          >
            <option value="">--Select file Type --</option>
            <option value="Title Clear Lands">Title Clear Lands</option>
            <option value="Dispute Lands">Dispute Lands</option>
            <option value="Govt. Dispute Lands">Govt. Dispute Lands</option>
            <option value="FP / NA">FP / NA</option>
            <option value="Others">Others</option>
          </select>
        </div>

        <div className="w-full sm:w-[50%] max-w-xs">
          <select
            value={formData.landType}
            onChange={(e) => handleSelectChange("landType", e.target.value)}
            className="block w-full rounded-xl border border-gray-300 bg-white p-3 text-gray-700 shadow-sm focus:border-gray-500 focus:ring focus:ring-gray-200 focus:outline-none"
            required
            disabled={loading || isNavigating}
          >
            <option value="">-- Select Land Type --</option>
            <option value="Agriculture">Agriculture</option>
            <option value="None Agriculture">None Agriculture</option>
          </select>
        </div>

        <div className="w-full sm:w-[50%] max-w-xs">
          <select
            value={formData.tenure}
            onChange={(e) => handleSelectChange("tenure", e.target.value)}
            className="block w-full rounded-xl border border-gray-300 bg-white p-3 text-gray-700 shadow-sm focus:border-gray-500 focus:ring focus:ring-gray-200 focus:outline-none"
            required
            disabled={loading || isNavigating}
          >
            <option value="">-- Select Tenure--</option>
            <option value="Old Tenure">Old Tenure</option>
            <option value="New Tenure">New Tenure</option>
            <option value="Premium">Premium</option>
          </select>
        </div>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Form fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {inputFields.map((field) => (
            <input
              key={field.key}
              type={field.type || "text"}
              placeholder={field.placeholder}
              value={formData[field.key]}
              onChange={(e) => handleInputChange(field.key, e.target.value)}
              className="w-full px-4 py-2 border border-gray-500 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-600 bg-white text-gray-700 disabled:opacity-50"
              required={field.required}
              disabled={loading || isNavigating}
            />
          ))}
        </div>

        <textarea
          placeholder="Notes"
          rows={3}
          value={formData.notes}
          onChange={(e) => handleInputChange("notes", e.target.value)}
          className="w-full px-4 py-2 border border-gray-500 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-600 bg-white text-gray-700 disabled:opacity-50"
          disabled={loading || isNavigating}
        />

        <input
          type="url"
          placeholder="Google Map Embed Link"
          value={formData.mapLink}
          onChange={(e) => handleInputChange("mapLink", e.target.value)}
          className="w-full px-4 py-2 border border-gray-500 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-600 bg-white text-gray-700 disabled:opacity-50"
          disabled={loading || isNavigating}
        />

        {/* Image Upload */}
        <div>
          <label className="font-medium block mb-2 text-gray-600">
            Upload Property Images
            {images.length > 0 && <span className="text-sm text-gray-500 ml-2">({images.length} selected)</span>}
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="w-full px-3 py-2 border border-gray-500 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-600 disabled:opacity-50"
            disabled={loading || isNavigating}
          />
          <div className="flex flex-wrap gap-4 mt-4">
            {images.map((img, idx) => (
              <div key={idx} className="relative w-32 h-32 rounded-xl overflow-hidden border shadow">
                <img
                  src={img.url || "/placeholder.svg"}
                  alt={`Property Image ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-red-50 transition-colors disabled:opacity-50"
                  onClick={() => removeImage(idx)}
                  disabled={loading || isNavigating}
                >
                  <X size={16} className="text-red-500" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* PDF Upload */}
        <div>
          <label className="font-medium block mb-2 mt-4 text-gray-600">
            Upload PDFs
            {pdfs.length > 0 && <span className="text-sm text-gray-500 ml-2">({pdfs.length} selected)</span>}
          </label>
          <input
            type="file"
            accept=".pdf"
            multiple
            onChange={handlePdfUpload}
            className="w-full px-3 py-2 border border-gray-500 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-600 disabled:opacity-50"
            disabled={loading || isNavigating}
          />
          <div className="flex flex-col gap-2 mt-4">
            {pdfs.map((pdf, idx) => (
              <div key={idx} className="flex items-center justify-between border rounded-xl px-3 py-2 bg-gray-100">
                <span className="truncate text-sm text-gray-700">{pdf.name}</span>
                <button
                  type="button"
                  className="text-red-500 hover:text-red-700 p-1 rounded transition-colors disabled:opacity-50"
                  onClick={() => removePdf(idx)}
                  disabled={loading || isNavigating}
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading || isNavigating}
            className="border-2 border-gray-600 bg-gray-600 text-white py-3 px-6 rounded-xl hover:bg-white hover:text-gray-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading && <Loader2 className="animate-spin" size={16} />}
            {loading ? "Submitting..." : "Submit Property"}
          </button>

          <button
            type="button"
            onClick={handleManualNavigation}
            disabled={loading}
            className="text-gray-600 border-2 border-gray-600 rounded-xl px-6 py-3 hover:bg-gray-600 hover:text-white transition-all disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </form>

      {/* Manual Navigation Button */}
      <div className="mt-6 flex gap-4">
        <button
          onClick={handleManualNavigation}
          className="text-gray-600 border-2 border-gray-600 rounded-md px-4 py-2 hover:bg-gray-600 hover:text-white transition-all"
        >
          ← Back to Home
        </button>

        {uploadStatus?.uploadStatus === "uploading" && (
          <button
            onClick={handleManualNavigation}
            className="bg-green-600 text-white border-2 border-green-600 rounded-md px-4 py-2 hover:bg-green-700 transition-all font-medium"
          >
            🏠 Files Uploaded? Go Home Now!
          </button>
        )}
      </div>
    </div>
  )
}

export default AddProperty
