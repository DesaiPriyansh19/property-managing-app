"use client"

import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import {
  FaMapMarkerAlt,
  FaFilePdf,
  FaImages,
  FaPhone,
  FaShareAlt,
  FaChevronLeft,
  FaChevronRight,
  FaEdit,
  FaSave,
  FaTimes,
  FaTrash,
  FaPlus,
  FaSpinner,
  FaToggleOn,
  FaToggleOff,
  FaChevronUp,
  FaChevronDown,
} from "react-icons/fa"
import PropertyAPI from "../services/PropertyApi"

const InfoCard = ({ title, children, isEditing = false }) => (
  <div className="bg-white p-5 rounded-lg shadow-md border border-gray-200">
    <h4 className="text-lg font-semibold mb-3 text-gray-700 border-b border-gray-300 pb-1 flex items-center justify-between">
      {title}
      {isEditing && <span className="text-sm text-blue-600 font-normal">Editing Mode</span>}
    </h4>
    <div className="text-gray-700 space-y-2">{children}</div>
  </div>
)

const PropertyDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [property, setProperty] = useState(null)

  const [currentImgIdx, setCurrentImgIdx] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({})
  const [showDetails, setShowDetails] = useState({})
  const [saving, setSaving] = useState(false)
  const [newImages, setNewImages] = useState([])
  const [newPdfs, setNewPdfs] = useState([])
  const [deletingFiles, setDeletingFiles] = useState(new Set())
  const [togglingOnBoard, setTogglingOnBoard] = useState(false)

  useEffect(() => {
    fetchProperty()
  }, [id])

  const fetchProperty = async () => {
    try {
      setLoading(true)
      setError("")
      const response = await PropertyAPI.getPropertyById(id)
      setProperty(response.data)
      setEditData(response.data)
    } catch (err) {
      setError(err.message)
      console.error("Error fetching property:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleOnBoardToggle = async () => {
    try {
      setTogglingOnBoard(true)
      setError("")

      const newOnBoardStatus = !property.onBoard
      const response = await PropertyAPI.toggleOnBoard(property._id, newOnBoardStatus)

      // Update both property and editData states
      setProperty((prev) => ({ ...prev, onBoard: newOnBoardStatus }))
      setEditData((prev) => ({ ...prev, onBoard: newOnBoardStatus }))
    } catch (err) {
      setError(err.message)
      console.error("Error toggling onBoard status:", err)
    } finally {
      setTogglingOnBoard(false)
    }
  }

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing - reset edit data
      setEditData(property)
      setNewImages([])
      setNewPdfs([])
    }
    setIsEditing(!isEditing)
  }

  const handleInputChange = (field, value) => {
    setEditData((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    const imageFiles = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      name: file.name,
      isNew: true,
    }))
    setNewImages((prev) => [...prev, ...imageFiles])
  }

  const handlePdfUpload = (e) => {
    const files = Array.from(e.target.files)
    const pdfFiles = files.map((file) => ({
      file,
      name: file.name,
      url: URL.createObjectURL(file),
      isNew: true,
    }))
    setNewPdfs((prev) => [...prev, ...pdfFiles])
  }

  const removeNewImage = (index) => {
    const updated = [...newImages]
    if (updated[index].url.startsWith("blob:")) {
      URL.revokeObjectURL(updated[index].url)
    }
    updated.splice(index, 1)
    setNewImages(updated)
  }

  const removeNewPdf = (index) => {
    const updated = [...newPdfs]
    if (updated[index].url.startsWith("blob:")) {
      URL.revokeObjectURL(updated[index].url)
    }
    updated.splice(index, 1)
    setNewPdfs(updated)
  }

  const removeExistingFile = async (fileType, publicId, index) => {
    if (window.confirm(`Are you sure you want to delete this ${fileType}? This action cannot be undone.`)) {
      try {
        setDeletingFiles((prev) => new Set([...prev, `${fileType}-${index}`]))

        // Call API to delete file from Cloudinary and database
        await PropertyAPI.deletePropertyFile(property._id, fileType, publicId)

        // Update local state
        const updatedProperty = { ...property }
        if (fileType === "image") {
          updatedProperty.images.splice(index, 1)
          // Adjust current image index if necessary
          if (currentImgIdx >= updatedProperty.images.length && updatedProperty.images.length > 0) {
            setCurrentImgIdx(updatedProperty.images.length - 1)
          } else if (updatedProperty.images.length === 0) {
            setCurrentImgIdx(0)
          }
        } else {
          updatedProperty.pdfs.splice(index, 1)
        }

        setProperty(updatedProperty)
        setEditData(updatedProperty)
      } catch (err) {
        setError(`Failed to delete ${fileType}: ${err.message}`)
      } finally {
        setDeletingFiles((prev) => {
          const newSet = new Set(prev)
          newSet.delete(`${fileType}-${index}`)
          return newSet
        })
      }
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setError("")

      // Prepare update data
      const updateData = {
        ...editData,
        images: newImages,
        pdfs: newPdfs,
      }

      const response = await PropertyAPI.updateProperty(property._id, updateData)
      setProperty(response.data)
      setEditData(response.data)
      setNewImages([])
      setNewPdfs([])
      setIsEditing(false)
    } catch (err) {
      setError(err.message)
      console.error("Error updating property:", err)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteProperty = async () => {
    if (window.confirm("Are you sure you want to move this property to the recycle bin?")) {
      try {
        setSaving(true)
        setError("")

        // Instead of deleting, move to recycle bin
        await PropertyAPI.moveToRecycleBin(property._id, true)

        // Navigate back to properties list after successful operation
        navigate("/allproperties/all-properties", {
          state: { message: "Property moved to recycle bin!" },
        })
      } catch (err) {
        setError(err.message)
        console.error("Error moving property to recycle bin:", err)
      } finally {
        setSaving(false)
      }
    }
  }

  if (loading) {
    return (
      <div className="bg-gray-100 min-h-screen py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-gray-600 mb-4 mx-auto" />
          <p className="text-gray-600">Loading property details...</p>
        </div>
      </div>
    )
  }

  if (error && !property) {
    return (
      <div className="bg-gray-100 min-h-screen py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate("/allproperties/all-properties")}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
          >
            Back to Properties
          </button>
        </div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="bg-gray-100 min-h-screen py-12 px-4 flex items-center justify-center">
        <p className="text-gray-600">Property not found</p>
      </div>
    )
  }

  const shareMessage = `
🏡 ${property.personWhoShared || "Property Owner"}
📂 File Type: ${property.fileType}
🌾 Land Type: ${property.landType}
📜 Tenure: ${property.tenure}
📞 Contact Number: ${property.contactNumber}
📍 Location: ${property.village}, ${property.taluko}, ${property.district}
🆔 SerNo (New): ${property.serNoNew || "N/A"}
🆔 SerNo (Old): ${property.serNoOld || "N/A"}
📄 FP.NO: ${property.fpNo || "N/A"}
🗺️ T P: ${property.tp || "N/A"}
🛣️ Zone: ${property.zone || "N/A"}
🌳 Sr.Area: ${property.srArea || "N/A"}
🌳 FP.Area: ${property.fpArea || "N/A"}
💰 SR.Rate (₹): ${property.srRate || "N/A"}
💰 FP.Rate (₹): ${property.fpRate || "N/A"}
🛣️ MTR Road: ${property.mtrRoad || "N/A"}
📌 Nearby: ${property.nearByLandmark || "N/A"}
📝 Notes: ${property.notes || "N/A"}
  `
  const shareLink = `https://wa.me/?text=${encodeURIComponent(shareMessage)}`

  const prevImage = () => {
    const totalImages = (property.images?.length || 0) + newImages.length
    setCurrentImgIdx((idx) => (idx === 0 ? totalImages - 1 : idx - 1))
  }

  const nextImage = () => {
    const totalImages = (property.images?.length || 0) + newImages.length
    setCurrentImgIdx((idx) => (idx === totalImages - 1 ? 0 : idx + 1))
  }

  const allImages = [...(property.images || []), ...newImages]
  const allPdfs = [...(property.pdfs || []), ...newPdfs]

  const handleToggleDetails = () => {
    setShowDetails(!showDetails)
  }
  return (
    <div className="bg-gray-100 min-h-screen py-12 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-xl p-8">
        {/* Header with OnBoard Toggle and Action Buttons */}
        {/* Header with OnBoard Toggle and Action Buttons */}
        <div className="flex justify-between items-start mb-8">
          <div className="flex-1">
            <h1 className="text-4xl font-extrabold text-gray-700 border-b border-gray-300 pb-4">
              {property.personWhoShared || "Property Details"}
            </h1>

            {/* OnBoard Status Toggle */}
            <div className="mt-4 flex items-center gap-3">
              <span className="text-lg font-medium text-gray-700">OnBoard Status:</span>
              <button
                onClick={handleOnBoardToggle}
                disabled={togglingOnBoard}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  property.onBoard === true
                    ? "bg-green-100 text-green-800 hover:bg-green-200"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {togglingOnBoard ? (
                  <FaSpinner className="animate-spin text-lg" />
                ) : property.onBoard ? (
                  <FaToggleOn className="text-2xl text-green-600" />
                ) : (
                  <FaToggleOff className="text-2xl text-gray-400" />
                )}
                <span className="font-semibold">
                  {togglingOnBoard ? "Updating..." : property.onBoard === true ? "On Board" : "Not On Board"}
                </span>
              </button>
            </div>
          </div>

          <div className="flex gap-2 ml-4">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
                  {saving ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={handleEditToggle}
                  className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                >
                  <FaTimes />
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleEditToggle}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  <FaEdit />
                  Edit
                </button>
                <button
                  onClick={handleDeleteProperty}
                  disabled={saving}
                  className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                >
                  {saving ? <FaSpinner className="animate-spin" /> : <FaTrash />}
                  {saving ? "Moving..." : "Move to Recycle Bin"}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}

        {/* Info Grid */}
        <div className="grid grid-cols-1 gap-6 mb-8 text-start">
          <InfoCard title="Land Location" isEditing={isEditing}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <p>
                <FaMapMarkerAlt className="inline mr-2" />
                <strong>Village:</strong>{" "}
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.village || ""}
                    onChange={(e) => handleInputChange("village", e.target.value)}
                    className="border rounded px-2 py-1 ml-2 w-full mt-1"
                  />
                ) : (
                  property.village || "N/A"
                )}
              </p>
              <p>
                <strong>Taluko:</strong>{" "}
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.taluko || ""}
                    onChange={(e) => handleInputChange("taluko", e.target.value)}
                    className="border rounded px-2 py-1 ml-2 w-full mt-1"
                  />
                ) : (
                  property.taluko || "N/A"
                )}
              </p>
              <p>
                <strong>District:</strong>{" "}
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.district || ""}
                    onChange={(e) => handleInputChange("district", e.target.value)}
                    className="border rounded px-2 py-1 ml-2 w-full mt-1"
                  />
                ) : (
                  property.district || "N/A"
                )}
              </p>
            </div>
          </InfoCard>

          <InfoCard title="Land Details" isEditing={isEditing}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <p>
                <strong>File Type:</strong>{" "}
                {isEditing ? (
                  <select
                    value={editData.fileType || ""}
                    onChange={(e) => handleInputChange("fileType", e.target.value)}
                    className="border rounded px-2 py-1 ml-2 w-full mt-1"
                  >
                    <option value="">Select</option>
                    <option value="Title Clear Lands">Title Clear Lands</option>
                    <option value="Dispute Lands">Dispute Lands</option>
                    <option value="Govt. Dispute Lands">Govt. Dispute Lands</option>
                    <option value="FP / NA">FP / NA</option>
                    <option value="Others">Others</option>
                  </select>
                ) : (
                  property.fileType
                )}
              </p>
              <p>
                <strong>Land Type:</strong>{" "}
                {isEditing ? (
                  <select
                    value={editData.landType || ""}
                    onChange={(e) => handleInputChange("landType", e.target.value)}
                    className="border rounded px-2 py-1 ml-2 w-full mt-1"
                  >
                    <option value="">Select</option>
                    <option value="Agriculture">Agriculture</option>
                    <option value="None Agriculture">None Agriculture</option>
                  </select>
                ) : (
                  property.landType
                )}
              </p>
              <p>
                <strong>Tenure:</strong>{" "}
                {isEditing ? (
                  <select
                    value={editData.tenure || ""}
                    onChange={(e) => handleInputChange("tenure", e.target.value)}
                    className="border rounded px-2 py-1 ml-2 w-full mt-1"
                  >
                    <option value="">Select</option>
                    <option value="Old Tenure">Old Tenure</option>
                    <option value="New Tenure">New Tenure</option>
                    <option value="Premium">Premium</option>
                  </select>
                ) : (
                  property.tenure
                )}
              </p>
              <p>
                <strong>MTR Road:</strong>{" "}
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.mtrRoad || ""}
                    onChange={(e) => handleInputChange("mtrRoad", e.target.value)}
                    className="border rounded px-2 py-1 ml-2 w-full mt-1"
                  />
                ) : (
                  property.mtrRoad || "N/A"
                )}
              </p>
            </div>
          </InfoCard>

          {/* Person Contact Details  */}
          <InfoCard title="Person Contact Details" isEditing={isEditing}>
            {/* Toggle Button */}
            <div className="flex justify-start mb-2">
              <button
                onClick={() => setShowDetails((prev) => !prev)}
                className="text-gray-600 hover:text-black transition duration-200"
              >
                {showDetails ? <FaChevronUp /> : <FaChevronDown />}
              </button>
            </div>

            {/* Contact Info - Only show if toggled */}
            {showDetails && (
              <>
                <p>
                  <strong>Name:</strong>{" "}
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.personWhoShared || ""}
                      onChange={(e) => handleInputChange("personWhoShared", e.target.value)}
                      className="border rounded px-2 py-1 ml-2 w-full mt-1"
                    />
                  ) : (
                    property.personWhoShared
                  )}
                </p>
                <p>
                  <strong>Contact:</strong> <FaPhone className="inline mr-2" />
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.contactNumber || ""}
                      onChange={(e) => handleInputChange("contactNumber", e.target.value)}
                      className="border rounded px-2 py-1 ml-2 w-full mt-1"
                    />
                  ) : (
                    property.contactNumber
                  )}
                </p>
              </>
            )}
          </InfoCard>

          <InfoCard title="Registration Details" isEditing={isEditing}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <p>
                <strong>SerNo (New):</strong>{" "}
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.serNoNew || ""}
                    onChange={(e) => handleInputChange("serNoNew", e.target.value)}
                    className="border rounded px-2 py-1 ml-2 w-full mt-1"
                  />
                ) : (
                  property.serNoNew || "N/A"
                )}
              </p>
              <p>
                <strong>SerNo (Old):</strong>{" "}
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.serNoOld || ""}
                    onChange={(e) => handleInputChange("serNoOld", e.target.value)}
                    className="border rounded px-2 py-1 ml-2 w-full mt-1"
                  />
                ) : (
                  property.serNoOld || "N/A"
                )}
              </p>
              <p>
                <strong>FP.NO:</strong>{" "}
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.fpNo || ""}
                    onChange={(e) => handleInputChange("fpNo", e.target.value)}
                    className="border rounded px-2 py-1 ml-2 w-full mt-1"
                  />
                ) : (
                  property.fpNo || "N/A"
                )}
              </p>
              <p>
                <strong>T P:</strong>{" "}
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.tp || ""}
                    onChange={(e) => handleInputChange("tp", e.target.value)}
                    className="border rounded px-2 py-1 ml-2 w-full mt-1"
                  />
                ) : (
                  property.tp || "N/A"
                )}
              </p>
              <p>
                <strong>Zone:</strong>{" "}
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.zone || ""}
                    onChange={(e) => handleInputChange("zone", e.target.value)}
                    className="border rounded px-2 py-1 ml-2 w-full mt-1"
                  />
                ) : (
                  property.zone || "N/A"
                )}
              </p>
            </div>
          </InfoCard>
        </div>

        {/* Area & Rates */}
        <div className="text-start">
          <InfoCard title="Area & Rates" isEditing={isEditing}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-start">
              <p>
                <strong>Sr.Area:</strong>{" "}
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.srArea || ""}
                    onChange={(e) => handleInputChange("srArea", e.target.value)}
                    className="border rounded px-2 py-1 ml-2 w-full mt-1"
                  />
                ) : (
                  property.srArea || "N/A"
                )}
              </p>
              <p>
                <strong>FP.Area:</strong>{" "}
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.fpArea || ""}
                    onChange={(e) => handleInputChange("fpArea", e.target.value)}
                    className="border rounded px-2 py-1 ml-2 w-full mt-1"
                  />
                ) : (
                  property.fpArea || "N/A"
                )}
              </p>
              <p>
                <strong>SR.Rate (₹):</strong>{" "}
                {isEditing ? (
                  <input
                    type="number"
                    value={editData.srRate || ""}
                    onChange={(e) => handleInputChange("srRate", e.target.value)}
                    className="border rounded px-2 py-1 ml-2 w-full mt-1"
                  />
                ) : property.srRate ? (
                  `₹${property.srRate}`
                ) : (
                  "N/A"
                )}
              </p>
              <p>
                <strong>FP.Rate (₹):</strong>{" "}
                {isEditing ? (
                  <input
                    type="number"
                    value={editData.fpRate || ""}
                    onChange={(e) => handleInputChange("fpRate", e.target.value)}
                    className="border rounded px-2 py-1 ml-2 w-full mt-1"
                  />
                ) : property.fpRate ? (
                  `₹${property.fpRate}`
                ) : (
                  "N/A"
                )}
              </p>
            </div>
          </InfoCard>
        </div>

        {/* Notes */}
        <div className="my-8 text-start">
          <InfoCard title="Notes" isEditing={isEditing}>
            {isEditing ? (
              <textarea
                value={editData.notes || ""}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                rows={4}
                className="w-full border rounded px-3 py-2"
                placeholder="Enter notes..."
              />
            ) : (
              <p className="whitespace-pre-line">{property.notes || "No notes available"}</p>
            )}
          </InfoCard>
        </div>

        {/* Map */}
        <div className="my-8 text-start">
          <InfoCard title="Google Map" isEditing={isEditing}>
            <p>
              <strong>Nearby:</strong>{" "}
              {isEditing ? (
                <input
                  type="text"
                  value={editData.nearByLandmark || ""}
                  onChange={(e) => handleInputChange("nearByLandmark", e.target.value)}
                  className="border rounded px-2 py-1 ml-2 w-full mt-1"
                />
              ) : (
                property.nearByLandmark || "N/A"
              )}
            </p>
            {isEditing ? (
              <input
                type="url"
                value={editData.mapLink || ""}
                onChange={(e) => handleInputChange("mapLink", e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="Enter Google Map embed link..."
              />
            ) : property.mapLink ? (
              <div className="border rounded-lg overflow-hidden shadow-md">
                <iframe
                  src={property.mapLink}
                  title="Google Map"
                  width="100%"
                  height="350"
                  loading="lazy"
                  allowFullScreen
                  frameBorder="0"
                  className="w-full"
                />
              </div>
            ) : (
              <p className="text-gray-500">No map link available</p>
            )}
          </InfoCard>
        </div>

        {/* Image Carousel */}
        {(allImages.length > 0 || isEditing) && (
          <div className="my-10">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4 flex items-center gap-3">
              <FaImages /> Property Images
              {isEditing && (
                <label className="ml-auto cursor-pointer bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                  <FaPlus className="inline mr-1" />
                  Add Images
                  <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                </label>
              )}
            </h2>

            {allImages.length > 0 && (
              <div className="relative w-full max-w-3xl mx-auto rounded-lg overflow-hidden shadow-md border">
                <img
                  src={allImages[currentImgIdx]?.url || "/placeholder.svg"}
                  alt={`Image ${currentImgIdx + 1}`}
                  className="w-full h-72 object-cover"
                />
                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute top-1/2 left-2 -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-100"
                    >
                      <FaChevronLeft />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute top-1/2 right-2 -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-100"
                    >
                      <FaChevronRight />
                    </button>
                  </>
                )}

                {/* Delete button for current image */}
                {isEditing && (
                  <button
                    onClick={() => {
                      if (currentImgIdx < (property.images?.length || 0)) {
                        // Existing image
                        const image = property.images[currentImgIdx]
                        removeExistingFile("image", image.publicId, currentImgIdx)
                      } else {
                        // New image
                        const newIndex = currentImgIdx - (property.images?.length || 0)
                        removeNewImage(newIndex)
                        if (currentImgIdx > 0) setCurrentImgIdx(currentImgIdx - 1)
                      }
                    }}
                    disabled={deletingFiles.has(`image-${currentImgIdx}`)}
                    className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full shadow hover:bg-red-700 disabled:opacity-50"
                  >
                    {deletingFiles.has(`image-${currentImgIdx}`) ? <FaSpinner className="animate-spin" /> : <FaTrash />}
                  </button>
                )}

                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
                  {allImages.map((_, i) => (
                    <span
                      key={i}
                      onClick={() => setCurrentImgIdx(i)}
                      className={`w-3 h-3 rounded-full cursor-pointer ${
                        i === currentImgIdx ? "bg-green-800" : "bg-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* New Images Preview */}
            {isEditing && newImages.length > 0 && (
              <div className="mt-4">
                <h4 className="text-lg font-medium mb-2">New Images to be Added:</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {newImages.map((img, idx) => (
                    <div key={idx} className="relative">
                      <img
                        src={img.url || "/placeholder.svg"}
                        alt={`New ${idx + 1}`}
                        className="w-full h-24 object-cover rounded border"
                      />
                      <button
                        onClick={() => removeNewImage(idx)}
                        className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-700"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* PDF Section */}
        {(allPdfs.length > 0 || isEditing) && (
          <div className="my-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-3 flex items-center gap-3">
              <FaFilePdf /> Property Documents
              {isEditing && (
                <label className="ml-auto cursor-pointer bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                  <FaPlus className="inline mr-1" />
                  Add PDFs
                  <input type="file" accept=".pdf" multiple onChange={handlePdfUpload} className="hidden" />
                </label>
              )}
            </h2>

            {allPdfs.length > 0 ? (
              <div className="space-y-2">
                {/* Existing PDFs */}
                {property.pdfs?.map((pdf, i) => (
                  <div key={i} className="flex items-center justify-between bg-gray-50 p-3 rounded border">
                    <a
                      href={pdf.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline text-blue-600 flex-1"
                    >
                      {pdf.originalName || pdf.name}
                    </a>
                    {isEditing && (
                      <button
                        onClick={() => removeExistingFile("pdf", pdf.publicId, i)}
                        disabled={deletingFiles.has(`pdf-${i}`)}
                        className="ml-2 text-red-600 hover:text-red-800 disabled:opacity-50"
                      >
                        {deletingFiles.has(`pdf-${i}`) ? <FaSpinner className="animate-spin" /> : <FaTrash />}
                      </button>
                    )}
                  </div>
                ))}

                {/* New PDFs */}
                {newPdfs.map((pdf, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between bg-blue-50 p-3 rounded border border-blue-200"
                  >
                    <span className="text-blue-800 flex-1">{pdf.name} (New)</span>
                    {isEditing && (
                      <button onClick={() => removeNewPdf(i)} className="ml-2 text-red-600 hover:text-red-800">
                        <FaTimes />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No documents available</p>
            )}
          </div>
        )}

        {/* Navigation and Actions */}
        {!isEditing && (
          <div className="mt-10 flex justify-between items-center">
            <button
              onClick={() => navigate("/allproperties/all-properties")}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition shadow-md"
            >
              <FaChevronLeft />
              Back to Properties
            </button>

            <a
              href={shareLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-900 text-white font-semibold rounded-lg hover:bg-green-800 transition shadow-md"
            >
              <FaShareAlt className="text-xl" />
              Share on WhatsApp
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

export default PropertyDetails
