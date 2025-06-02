"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  FaMapMarkerAlt,
  FaFilePdf,
  FaImages,
  FaPhone,
  FaEdit,
  FaSpinner,
  FaEye,
  FaSave,
  FaTimes,
  FaToggleOn,
} from "react-icons/fa"
import { FiSearch, FiCheck, FiAlertCircle, FiX } from "react-icons/fi"
import PropertyAPI from "../services/PropertyApi"
import MapsAPI from "../services/MapsApi"

const OnBoardProperties = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("properties")
  const [properties, setProperties] = useState([])
  const [maps, setMaps] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [previewImage, setPreviewImage] = useState(null)

  // Maps editing states
  const [editingMapId, setEditingMapId] = useState(null)
  const [editingMapData, setEditingMapData] = useState({})
  const [savingMap, setSavingMap] = useState(false)

  // Pagination states
  const [propertiesPagination, setPropertiesPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  })
  const [mapsPagination, setMapsPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  })

  useEffect(() => {
    if (activeTab === "properties") {
      fetchProperties()
    } else {
      fetchMaps()
    }
  }, [activeTab, searchQuery])

  // Clear messages after 5 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError("")
        setSuccess("")
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [error, success])

  const fetchProperties = async (page = 1) => {
    setLoading(true)
    setError("")

    try {
      const params = {
        page,
        limit: 12,
        onBoard: true, // Only fetch onBoard properties
        ...(searchQuery && { search: searchQuery }),
      }

      const response = await PropertyAPI.getAllProperties(params)
      setProperties(response.data || [])
      setPropertiesPagination(response.pagination || { currentPage: 1, totalPages: 1, totalItems: 0 })
    } catch (err) {
      setError(err.message)
      console.error("Error fetching properties:", err)
    } finally {
      setLoading(false)
    }
  }

  const fetchMaps = async (page = 1) => {
    setLoading(true)
    setError("")

    try {
      const params = {
        page,
        limit: 12,
        onBoard: true, // Only fetch onBoard maps
        ...(searchQuery && { search: searchQuery }),
      }

      const response = await MapsAPI.getAllMaps(params)
      setMaps(response.data || [])
      setMapsPagination(response.pagination || { currentPage: 1, totalPages: 1, totalItems: 0 })
    } catch (err) {
      setError(err.message)
      console.error("Error fetching maps:", err)
    } finally {
      setLoading(false)
    }
  }

  const handlePropertyClick = (propertyId) => {
    navigate(`/property/${propertyId}`)
  }

  const handleEditMap = (map) => {
    setEditingMapId(map._id)
    setEditingMapData({
      area: map.area || "",
      notes: map.notes || "",
    })
  }

  const handleCancelEdit = () => {
    setEditingMapId(null)
    setEditingMapData({})
  }

  const handleSaveMap = async () => {
    try {
      setSavingMap(true)
      setError("")

      await MapsAPI.updateMaps(editingMapId, editingMapData)

      // Update local state
      setMaps((prev) =>
        prev.map((map) =>
          map._id === editingMapId ? { ...map, area: editingMapData.area, notes: editingMapData.notes } : map,
        ),
      )

      setSuccess("Map updated successfully!")
      setEditingMapId(null)
      setEditingMapData({})
    } catch (err) {
      setError(err.message)
      console.error("Error updating map:", err)
    } finally {
      setSavingMap(false)
    }
  }

  const handlePageChange = (newPage, type) => {
    if (type === "properties") {
      fetchProperties(newPage)
    } else {
      fetchMaps(newPage)
    }
  }

  const renderPropertyCard = (property) => (
    <motion.div
      key={property._id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-300 cursor-pointer"
      onClick={() => handlePropertyClick(property._id)}
    >
      <div className="p-6">
        {/* Header with OnBoard Badge */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800 mb-1">{property.personWhoShared}</h3>
            <p className="text-gray-600 text-sm">{property.fileType}</p>
          </div>
          <div className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
            <FaToggleOn className="text-green-600" />
            On Board
          </div>
        </div>

        {/* Location Info */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <FaMapMarkerAlt className="text-gray-600" size={14} />
            <span className="text-sm font-medium text-gray-700">Location</span>
          </div>
          <p className="text-gray-600 text-sm">
            {[property.village, property.taluko, property.district].filter(Boolean).join(", ") ||
              "Location not specified"}
          </p>
        </div>

        {/* Contact Info */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <FaPhone className="text-gray-600" size={14} />
            <span className="text-sm font-medium text-gray-700">Contact</span>
          </div>
          <p className="text-gray-600 text-sm">{property.contactNumber}</p>
        </div>

        {/* Property Details */}
        <div className="mb-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">Land Type:</span>
            <p className="text-gray-600">{property.landType}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Tenure:</span>
            <p className="text-gray-600">{property.tenure}</p>
          </div>
        </div>

        {/* Images */}
        {property.images && property.images.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-3">
              <FaImages className="text-gray-600" size={16} />
              <span className="text-sm font-medium text-gray-700">Images ({property.images.length})</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {property.images.slice(0, 3).map((img, imgIndex) => (
                <motion.div
                  key={imgIndex}
                  whileHover={{ scale: 1.05 }}
                  className="relative group"
                  onClick={(e) => {
                    e.stopPropagation()
                    setPreviewImage(img.url)
                  }}
                >
                  <img
                    src={img.url || "/placeholder.svg"}
                    className="w-full h-16 object-cover rounded-lg"
                    alt="Property"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg flex items-center justify-center">
                    <FaEye className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </motion.div>
              ))}
              {property.images.length > 3 && (
                <div className="w-full h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 text-sm font-medium">
                  +{property.images.length - 3} more
                </div>
              )}
            </div>
          </div>
        )}

        {/* PDFs */}
        {property.pdfs && property.pdfs.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-3">
              <FaFilePdf className="text-red-500" size={16} />
              <span className="text-sm font-medium text-gray-700">Documents ({property.pdfs.length})</span>
            </div>
          </div>
        )}

        {/* View Details Button */}
        <div className="pt-4 border-t border-gray-200">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            <FaEye size={14} />
            View Details
          </motion.div>
        </div>
      </div>
    </motion.div>
  )

  const renderMapCard = (map) => (
    <motion.div
      key={map._id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-300"
    >
      <div className="p-6">
        {/* Header with OnBoard Badge */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            {editingMapId === map._id ? (
              <input
                type="text"
                value={editingMapData.area}
                onChange={(e) => setEditingMapData((prev) => ({ ...prev, area: e.target.value }))}
                className="text-xl font-bold text-gray-800 mb-1 w-full border border-gray-300 rounded px-2 py-1"
                placeholder="Area name"
              />
            ) : (
              <h3 className="text-xl font-bold text-gray-800 mb-1">Area: {map.area}</h3>
            )}
            {editingMapId === map._id ? (
              <textarea
                value={editingMapData.notes}
                onChange={(e) => setEditingMapData((prev) => ({ ...prev, notes: e.target.value }))}
                className="text-gray-600 text-sm w-full border border-gray-300 rounded px-2 py-1 resize-none"
                rows={2}
                placeholder="Notes"
              />
            ) : (
              map.notes && <p className="text-gray-600 text-sm line-clamp-2">-- {map.notes}</p>
            )}
          </div>
          <div className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium ml-4">
            <FaToggleOn className="text-green-600" />
            On Board
          </div>
        </div>

        {/* Images */}
        {map.images && map.images.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-3">
              <FaImages className="text-gray-600" size={16} />
              <span className="text-sm font-medium text-gray-700">Images ({map.images.length})</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {map.images.slice(0, 3).map((img, imgIndex) => (
                <motion.div
                  key={imgIndex}
                  whileHover={{ scale: 1.05 }}
                  className="relative group cursor-pointer"
                  onClick={() => setPreviewImage(img.url)}
                >
                  <img src={img.url || "/placeholder.svg"} className="w-full h-16 object-cover rounded-lg" alt="Map" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg flex items-center justify-center">
                    <FaEye className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </motion.div>
              ))}
              {map.images.length > 3 && (
                <div className="w-full h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 text-sm font-medium">
                  +{map.images.length - 3} more
                </div>
              )}
            </div>
          </div>
        )}

        {/* PDFs */}
        {map.pdfs && map.pdfs.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-3">
              <FaFilePdf className="text-red-500" size={16} />
              <span className="text-sm font-medium text-gray-700">PDFs ({map.pdfs.length})</span>
            </div>
            <div className="space-y-2">
              {map.pdfs.slice(0, 2).map((pdf, pdfIndex) => (
                <motion.a
                  key={pdfIndex}
                  href={pdf.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  className="block bg-gray-100 border border-gray-300 rounded-lg p-3 hover:bg-gray-200 transition-colors"
                >
                  <div className="text-xs text-gray-600 truncate">{pdf.originalName || pdf.name}</div>
                  <div className="text-xs text-gray-600 font-medium mt-1">View PDF</div>
                </motion.a>
              ))}
              {map.pdfs.length > 2 && (
                <div className="text-xs text-gray-500 text-center py-2">+{map.pdfs.length - 2} more PDFs</div>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="pt-4 border-t border-gray-200">
          {editingMapId === map._id ? (
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSaveMap}
                disabled={savingMap}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {savingMap ? <FaSpinner className="animate-spin" size={14} /> : <FaSave size={14} />}
                {savingMap ? "Saving..." : "Save"}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCancelEdit}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                <FaTimes size={14} />
                Cancel
              </motion.button>
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleEditMap(map)}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              <FaEdit size={14} />
              Edit Map
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  )

  const renderPagination = (pagination, type) => {
    if (pagination.totalPages <= 1) return null

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center items-center gap-4 mt-8"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handlePageChange(pagination.currentPage - 1, type)}
          disabled={pagination.currentPage === 1}
          className="px-6 py-3 bg-white border border-gray-300 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all shadow-sm"
        >
          Previous
        </motion.button>

        <div className="flex items-center gap-2">
          {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
            const page = i + 1
            return (
              <motion.button
                key={page}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handlePageChange(page, type)}
                className={`w-10 h-10 rounded-lg font-medium transition-all ${
                  page === pagination.currentPage
                    ? "bg-gray-700 text-white shadow-lg"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-300"
                }`}
              >
                {page}
              </motion.button>
            )
          })}
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handlePageChange(pagination.currentPage + 1, type)}
          disabled={pagination.currentPage === pagination.totalPages}
          className="px-6 py-3 bg-white border border-gray-300 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all shadow-sm"
        >
          Next
        </motion.button>
      </motion.div>
    )
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-100 font-sans text-gray-900 p-8">
      {/* Animated Background Blobs */}
      <div className="absolute top-[-80px] left-[-80px] w-72 h-72 bg-gray-700 rounded-full opacity-10 animate-blob2 z-0"></div>
      <div
        className="absolute bottom-[-100px] right-[-100px] w-96 h-96 bg-gray-700 rounded-full opacity-10 animate-blob2 z-0"
        style={{ animationDelay: "2s" }}
      ></div>
      <div
        className="absolute top-[30%] left-[60%] w-64 h-64 bg-gray-700 rounded-full opacity-10 animate-blob2 z-0"
        style={{ animationDelay: "4s" }}
      ></div>

      <div className="relative z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-700 mb-4">OnBoard Properties & Maps</h1>
          <p className="text-gray-600 text-lg">Manage your onboarded properties and maps</p>
        </motion.div>

        {/* Notifications */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2"
            >
              <FiAlertCircle size={20} />
              <span>{error}</span>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2"
            >
              <FiCheck size={20} />
              <span>{success}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tabs */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center mb-8">
          <div className="bg-white rounded-2xl p-2 shadow-lg border border-gray-300">
            <button
              onClick={() => setActiveTab("properties")}
              className={`px-8 py-3 rounded-xl font-medium transition-all duration-200 ${
                activeTab === "properties" ? "bg-gray-700 text-white shadow-md" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Properties
            </button>
            <button
              onClick={() => setActiveTab("maps")}
              className={`px-8 py-3 rounded-xl font-medium transition-all duration-200 ${
                activeTab === "maps" ? "bg-gray-700 text-white shadow-md" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Maps
            </button>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex justify-center">
          <div className="relative max-w-md w-full">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-600 bg-white shadow-sm text-lg"
            />
          </div>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-16"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                className="w-12 h-12 border-4 border-gray-300 border-t-gray-600 rounded-full mb-4"
              />
              <p className="text-gray-600 text-lg">Loading {activeTab}...</p>
            </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === "properties" ? (
                <>
                  {properties.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center py-16"
                    >
                      <div className="text-8xl mb-6">🏠</div>
                      <h3 className="text-2xl font-semibold text-gray-700 mb-4">No onboard properties found</h3>
                      <p className="text-gray-500 text-lg">
                        {searchQuery ? "Try adjusting your search criteria" : "No properties are currently onboard"}
                      </p>
                    </motion.div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {properties.map(renderPropertyCard)}
                      </div>
                      {renderPagination(propertiesPagination, "properties")}
                    </>
                  )}
                </>
              ) : (
                <>
                  {maps.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center py-16"
                    >
                      <div className="text-8xl mb-6">🗺️</div>
                      <h3 className="text-2xl font-semibold text-gray-700 mb-4">No onboard maps found</h3>
                      <p className="text-gray-500 text-lg">
                        {searchQuery ? "Try adjusting your search criteria" : "No maps are currently onboard"}
                      </p>
                    </motion.div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {maps.map(renderMapCard)}
                      </div>
                      {renderPagination(mapsPagination, "maps")}
                    </>
                  )}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Image Preview Modal */}
        <AnimatePresence>
          {previewImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
              onClick={() => setPreviewImage(null)}
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                className="relative max-w-4xl max-h-[90vh]"
              >
                <img
                  src={previewImage || "/placeholder.svg"}
                  className="max-w-full max-h-full object-contain rounded-lg"
                  alt="Preview"
                />
                <button
                  onClick={() => setPreviewImage(null)}
                  className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors"
                >
                  <FiX size={24} />
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Info */}
        {((activeTab === "properties" && properties.length > 0) || (activeTab === "maps" && maps.length > 0)) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-600 text-sm mt-6"
          >
            {activeTab === "properties" ? (
              <>
                Showing {(propertiesPagination.currentPage - 1) * 12 + 1} to{" "}
                {Math.min(propertiesPagination.currentPage * 12, propertiesPagination.totalItems)} of{" "}
                {propertiesPagination.totalItems} onboard properties
              </>
            ) : (
              <>
                Showing {(mapsPagination.currentPage - 1) * 12 + 1} to{" "}
                {Math.min(mapsPagination.currentPage * 12, mapsPagination.totalItems)} of {mapsPagination.totalItems}{" "}
                onboard maps
              </>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default OnBoardProperties
