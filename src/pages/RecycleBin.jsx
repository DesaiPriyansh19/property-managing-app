"use client"

import { useState, useEffect } from "react"
import { FaTrash, FaUndo, FaSpinner, FaExclamationTriangle, FaSearch, FaMapMarkedAlt, FaBuilding, FaImage, FaFilePdf, FaEye } from "react-icons/fa"
import { FiX } from "react-icons/fi"
import PropertyAPI from "../services/PropertyApi"
import MapsAPI from "../services/MapsApi"
import { motion, AnimatePresence } from "framer-motion"

const RecycleBin = () => {
  const [properties, setProperties] = useState([])
  const [maps, setMaps] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [activeTab, setActiveTab] = useState("properties")
  const [searchTerm, setSearchTerm] = useState("")
  const [processingItems, setProcessingItems] = useState(new Set())
  const [previewImage, setPreviewImage] = useState(null)

  useEffect(() => {
    fetchRecycleBinItems()
  }, [])

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

  const fetchRecycleBinItems = async () => {
    try {
      setLoading(true)
      setError("")

      // Fetch properties with recycleBin=true
      const propertiesResponse = await PropertyAPI.getAllProperties({ recycleBin: true })
      setProperties(propertiesResponse.data || [])

      // Fetch maps with recycleBin=true
      const mapsResponse = await MapsAPI.getAllMaps({ recycleBin: true })
      setMaps(mapsResponse.data || [])
    } catch (err) {
      setError(err.message || "Failed to fetch recycle bin items")
      console.error("Error fetching recycle bin items:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleRestoreProperty = async (id) => {
    if (window.confirm("Are you sure you want to restore this property?")) {
      try {
        setProcessingItems((prev) => new Set([...prev, id]))

        // Move property back from recycle bin
        await PropertyAPI.moveToRecycleBin(id, false)

        // Update local state
        setProperties((prev) => prev.filter((item) => item._id !== id))
        setSuccess("Property restored successfully!")
      } catch (err) {
        setError(err.message || "Failed to restore property")
        console.error("Error restoring property:", err)
      } finally {
        setProcessingItems((prev) => {
          const newSet = new Set(prev)
          newSet.delete(id)
          return newSet
        })
      }
    }
  }

  const handlePermanentDeleteProperty = async (id) => {
    if (window.confirm("Are you sure you want to PERMANENTLY delete this property? This action cannot be undone!")) {
      try {
        setProcessingItems((prev) => new Set([...prev, id]))

        // Permanently delete the property
        await PropertyAPI.deleteProperty(id)

        // Update local state
        setProperties((prev) => prev.filter((item) => item._id !== id))
        setSuccess("Property permanently deleted!")
      } catch (err) {
        setError(err.message || "Failed to delete property")
        console.error("Error deleting property:", err)
      } finally {
        setProcessingItems((prev) => {
          const newSet = new Set(prev)
          newSet.delete(id)
          return newSet
        })
      }
    }
  }

  const handleRestoreMap = async (id) => {
    if (window.confirm("Are you sure you want to restore this map?")) {
      try {
        setProcessingItems((prev) => new Set([...prev, id]))

        // Move map back from recycle bin
        await MapsAPI.moveToRecycleBin(id, false)

        // Update local state
        setMaps((prev) => prev.filter((item) => item._id !== id))
        setSuccess("Map restored successfully!")
      } catch (err) {
        setError(err.message || "Failed to restore map")
        console.error("Error restoring map:", err)
      } finally {
        setProcessingItems((prev) => {
          const newSet = new Set(prev)
          newSet.delete(id)
          return newSet
        })
      }
    }
  }

  const handlePermanentDeleteMap = async (id) => {
    if (window.confirm("Are you sure you want to PERMANENTLY delete this map? This action cannot be undone!")) {
      try {
        setProcessingItems((prev) => new Set([...prev, id]))

        // Permanently delete the map
        await MapsAPI.deleteMaps(id)

        // Update local state
        setMaps((prev) => prev.filter((item) => item._id !== id))
        setSuccess("Map permanently deleted!")
      } catch (err) {
        setError(err.message || "Failed to delete map")
        console.error("Error deleting map:", err)
      } finally {
        setProcessingItems((prev) => {
          const newSet = new Set(prev)
          newSet.delete(id)
          return newSet
        })
      }
    }
  }

  const filteredProperties = properties.filter((property) => {
    const searchFields = [
      property.personWhoShared,
      property.village,
      property.taluko,
      property.district,
      property.fileType,
      property.landType,
    ]

    return searchFields.some((field) => field && field.toLowerCase().includes(searchTerm.toLowerCase()))
  })

  const filteredMaps = maps.filter((map) => {
    const searchFields = [map.area, map.notes]
    return searchFields.some((field) => field && field.toLowerCase().includes(searchTerm.toLowerCase()))
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
            className="w-12 h-12 border-4 border-gray-300 border-t-gray-600 rounded-full mb-4 mx-auto"
          />
          <p className="text-gray-600">Loading recycle bin items...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-100 font-sans text-gray-900 p-8">
      {/* Background Blobs */}
      <div className="absolute top-[-80px] left-[-80px] w-72 h-72 bg-gray-700 rounded-full opacity-10 animate-blob2 z-0"></div>
      <div
        className="absolute bottom-[-100px] right-[-100px] w-96 h-96 bg-gray-700 rounded-full opacity-10 animate-blob2 z-0"
        style={{ animationDelay: "2s" }}
      ></div>
      <div
        className="absolute top-[30%] left-[60%] w-64 h-64 bg-gray-700 rounded-full opacity-10 animate-blob2 z-0"
        style={{ animationDelay: "4s" }}
      ></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-6"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
            <FaTrash className="mr-3 text-red-500" /> Recycle Bin
          </h1>
          <p className="text-gray-600 mb-6">Items moved to the recycle bin can be restored or permanently deleted.</p>

          {/* Notifications */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6"
              >
                <div className="flex items-center">
                  <FaExclamationTriangle className="mr-2" />
                  <p>{error}</p>
                </div>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6"
              >
                <div className="flex items-center">
                  <FaUndo className="mr-2" />
                  <p>{success}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Search and Filter */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search in recycle bin..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab("properties")}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === "properties"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <FaBuilding className="mr-2" />
                Properties ({properties.length})
              </button>
              <button
                onClick={() => setActiveTab("maps")}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === "maps"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <FaMapMarkedAlt className="mr-2" />
                Maps ({maps.length})
              </button>
            </div>
          </div>

          {/* Content based on active tab */}
          {activeTab === "properties" && (
            <>
              {filteredProperties.length === 0 ? (
                <div className="text-center py-12">
                  <FaTrash className="mx-auto text-4xl text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-500">No properties in recycle bin</h3>
                  <p className="text-gray-400">Deleted properties will appear here</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Property
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Location
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contact
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredProperties.map((property) => (
                        <tr key={property._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {property.personWhoShared || "Unnamed Property"}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {property.serNoNew ? `SerNo: ${property.serNoNew}` : ""}
                                  {property.serNoOld ? ` / ${property.serNoOld}` : ""}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{property.village || "N/A"}</div>
                            <div className="text-sm text-gray-500">
                              {property.taluko}
                              {property.district ? `, ${property.district}` : ""}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {property.fileType || "N/A"}
                            </span>
                            <div className="text-xs text-gray-500 mt-1">{property.landType || ""}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {property.contactNumber || "No contact"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleRestoreProperty(property._id)}
                                disabled={processingItems.has(property._id)}
                                className="text-blue-600 hover:text-blue-900 disabled:opacity-50"
                                title="Restore"
                              >
                                {processingItems.has(property._id) ? (
                                  <FaSpinner className="animate-spin" />
                                ) : (
                                  <FaUndo />
                                )}
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handlePermanentDeleteProperty(property._id)}
                                disabled={processingItems.has(property._id)}
                                className="text-red-600 hover:text-red-900 disabled:opacity-50"
                                title="Delete Permanently"
                              >
                                {processingItems.has(property._id) ? (
                                  <FaSpinner className="animate-spin" />
                                ) : (
                                  <FaTrash />
                                )}
                              </motion.button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {activeTab === "maps" && (
            <>
              {filteredMaps.length === 0 ? (
                <div className="text-center py-12">
                  <FaMapMarkedAlt className="mx-auto text-4xl text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-500">No maps in recycle bin</h3>
                  <p className="text-gray-400">Deleted maps will appear here</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredMaps.map((map) => (
                    <motion.div
                      key={map._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ y: -5 }}
                      className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-300"
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-gray-800 mb-1">Area: {map.area}</h3>
                            {map.notes && <p className="text-gray-600 text-sm line-clamp-2">-- {map.notes}</p>}
                          </div>
                        </div>

                        {/* Images */}
                        {map.images && map.images.length > 0 && (
                          <div className="mb-4">
                            <div className="flex items-center gap-2 mb-3">
                              <FaImage className="text-gray-600" size={16} />
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
                                  <img
                                    src={img.url || "/placeholder.svg"}
                                    className="w-full h-16 object-cover rounded-lg"
                                    alt="Map"
                                  />
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
                                  <div className="text-xs text-gray-600 truncate">
                                    {pdf.originalName || pdf.name}
                                  </div>
                                  <div className="text-xs text-gray-600 font-medium mt-1">View PDF</div>
                                </motion.a>
                              ))}
                              {map.pdfs.length > 2 && (
                                <div className="text-xs text-gray-500 text-center py-2">
                                  +{map.pdfs.length - 2} more PDFs
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-2 pt-4 border-t border-gray-200">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleRestoreMap(map._id)}
                            disabled={processingItems.has(map._id)}
                            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                          >
                            {processingItems.has(map._id) ? (
                              <FaSpinner className="animate-spin" size={14} />
                            ) : (
                              <FaUndo size={14} />
                            )}
                            Restore
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handlePermanentDeleteMap(map._id)}
                            disabled={processingItems.has(map._id)}
                            className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                          >
                            {processingItems.has(map._id) ? (
                              <FaSpinner className="animate-spin" size={14} />
                            ) : (
                              <FaTrash size={14} />
                            )}
                            Delete
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>

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
    </div>
  )
}

export default RecycleBin
