"use client"

import { useState, useEffect } from "react"
import { X, Loader2, Trash2, Edit, AlertCircle, Upload, CheckCircle } from "lucide-react"
import WalletPropertyAPI from "../services/WalletPropertyApi"

const initialFormState = {
  fileType: "",
  landType: "",
  tenure: "",
  fields: Array(16).fill(""),
  notes: "",
  mapLink: "",
  images: [],
  pdfs: [],
}

const WalletProperty = ({ propertyCategory }) => {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(initialFormState)
  const [properties, setProperties] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedIndex, setExpandedIndex] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [editingProperty, setEditingProperty] = useState(null)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProperties: 0,
  })
  const [deletingFiles, setDeletingFiles] = useState(new Set())

  // Upload status tracking states
  const [uploadStatus, setUploadStatus] = useState(null)
  const [createdPropertyId, setCreatedPropertyId] = useState(null)

  // Field labels mapping for better display
  const fieldLabels = [
    "Person Who Shared",
    "Contact Number",
    "Village",
    "Taluko",
    "District",
    "SerNo (New)",
    "SerNo (Old)",
    "FP.NO",
    "T P",
    "Zone",
    "Sr.Area",
    "FP.Area",
    "SR.Rate (₹)",
    "FP.Rate (₹)",
    "MTR.Road",
    "NearBy(land mark)",
  ]

  // Category-specific configurations
  const categoryConfig = {
    rd: {
      title: "R.D. Legal Properties",
      driveLabel: "R.D Google Drive",
      sheetLabel: "R.D Excel Sheet",
    },
    temple: {
      title: "Temple Properties",
      driveLabel: "Temple Google Drive",
      sheetLabel: "Temple Excel Sheet",
    },
    myproperies: {
      title: "My Properties",
      driveLabel: "M.D. Google Drive",
      sheetLabel: "M.D. Excel Sheet",
    },
  }

  const config = categoryConfig[propertyCategory] || categoryConfig.myproperies

  // Load properties on component mount and when category changes
  useEffect(() => {
    console.log(`🔄 Component mounted/category changed: ${propertyCategory}`)
    fetchProperties()
  }, [propertyCategory])

  // Handle search with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm !== "") {
        fetchProperties(1, searchTerm)
      } else {
        fetchProperties()
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [searchTerm])

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

  // Upload status polling effect
  useEffect(() => {
    if (createdPropertyId && uploadStatus?.uploadStatus === "uploading") {
      const interval = setInterval(async () => {
        try {
          const status = await WalletPropertyAPI.getUploadStatus(createdPropertyId)
          setUploadStatus(status)

          if (status.uploadStatus === "completed" || status.uploadStatus === "failed") {
            clearInterval(interval)

            // Force fresh data fetch after upload completes
            await fetchProperties(pagination.currentPage, "", true) // true = bypass cache

            if (status.uploadStatus === "completed") {
              setSuccess("Property created successfully! All files have been uploaded.")

              // Update the specific property in real-time
              try {
                const updatedProperty = await WalletPropertyAPI.getWalletPropertyById(createdPropertyId)
                console.log(`🔄 Updated property data:`, updatedProperty.data)
                setProperties((prev) =>
                  prev.map((item) => (item._id === createdPropertyId ? updatedProperty.data : item)),
                )
              } catch (err) {
                console.error("Error fetching updated property:", err)
              }
            } else {
              setError("Property created but some files failed to upload.")
            }
            setCreatedPropertyId(null)
          }
        } catch (err) {
          console.error("Error fetching upload status:", err)
          clearInterval(interval)
        }
      }, 2000)

      return () => clearInterval(interval)
    }
  }, [createdPropertyId, uploadStatus, pagination.currentPage])

  // ENHANCED: Fetch properties with better debugging
  const fetchProperties = async (page = 1, search = "", bypassCache = false) => {
    console.log(`🔍 Fetching properties - Page: ${page}, Search: "${search}", Bypass: ${bypassCache}`)
    setLoading(true)
    setError("")

    try {
      const params = {
        page,
        limit: 10,
        propertyCategory,
        ...(search && { search }),
        ...(bypassCache && { bypassCache: "true" }),
      }

      console.log(`📊 API params:`, params)

      const response = await WalletPropertyAPI.getAllWalletProperties(params)

      console.log(`📋 Received response:`, {
        dataLength: response.data?.length || 0,
        pagination: response.pagination,
      })

      // CRITICAL: Debug each property's file data
      if (response.data && response.data.length > 0) {
        response.data.forEach((property, index) => {
          console.log(`🔍 Property ${index + 1} (${property._id}):`, {
            personWhoShared: property.personWhoShared,
            images: property.images?.length || 0,
            pdfs: property.pdfs?.length || 0,
            uploadStatus: property.uploadStatus,
            imageUrls: property.images?.map((img) => img.url) || [],
            pdfUrls: property.pdfs?.map((pdf) => pdf.url) || [],
          })
        })
      }

      setProperties(response.data || [])
      setPagination(
        response.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalProperties: 0,
        },
      )
    } catch (err) {
      console.error("❌ Error fetching wallet properties:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (index, value) => {
    const updatedFields = [...form.fields]
    updatedFields[index] = value
    setForm((prev) => ({ ...prev, fields: updatedFields }))
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    const newImages = files.map((file) => ({
      id: Date.now() + Math.random(),
      file,
      url: URL.createObjectURL(file),
      name: file.name,
      isNew: true,
    }))
    console.log(`📸 Added ${newImages.length} new images to form`)
    setForm((prev) => ({ ...prev, images: [...prev.images, ...newImages] }))
  }

  const handlePdfUpload = (e) => {
    const files = Array.from(e.target.files)
    const newPdfs = files.map((file) => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      url: URL.createObjectURL(file),
      isNew: true,
    }))
    console.log(`📄 Added ${newPdfs.length} new PDFs to form`)
    setForm((prev) => ({ ...prev, pdfs: [...prev.pdfs, ...newPdfs] }))
  }

  const removeImage = async (index) => {
    const image = form.images[index]

    if (image.isExisting && image.publicId && editingProperty) {
      await removeExistingFile("image", image.publicId, index)
    } else {
      const updated = [...form.images]
      if (updated[index].url && updated[index].url.startsWith("blob:")) {
        URL.revokeObjectURL(updated[index].url)
      }
      updated.splice(index, 1)
      setForm((prev) => ({ ...prev, images: updated }))
    }
  }

  const removePdf = async (index) => {
    const pdf = form.pdfs[index]

    if (pdf.isExisting && pdf.publicId && editingProperty) {
      await removeExistingFile("pdf", pdf.publicId, index)
    } else {
      const updated = [...form.pdfs]
      if (updated[index].url && updated[index].url.startsWith("blob:")) {
        URL.revokeObjectURL(updated[index].url)
      }
      updated.splice(index, 1)
      setForm((prev) => ({ ...prev, pdfs: updated }))
    }
  }

  // Enhanced existing file removal with real-time updates
  const removeExistingFile = async (fileType, publicId, index) => {
    if (window.confirm(`Are you sure you want to delete this ${fileType}? This action cannot be undone.`)) {
      try {
        setDeletingFiles((prev) => new Set([...prev, `${fileType}-${index}`]))

        await WalletPropertyAPI.deleteWalletPropertyFile(editingProperty._id, fileType, publicId)

        // Update local state immediately
        if (fileType === "image") {
          const updatedImages = [...form.images]
          updatedImages.splice(index, 1)
          setForm((prev) => ({ ...prev, images: updatedImages }))
        } else {
          const updatedPdfs = [...form.pdfs]
          updatedPdfs.splice(index, 1)
          setForm((prev) => ({ ...prev, pdfs: updatedPdfs }))
        }

        // Update properties list in real-time
        setProperties((prev) =>
          prev.map((item) => {
            if (item._id === editingProperty._id) {
              const updatedItem = { ...item }
              if (fileType === "image") {
                updatedItem.images = updatedItem.images.filter((_, i) => i !== index)
              } else {
                updatedItem.pdfs = updatedItem.pdfs.filter((_, i) => i !== index)
              }
              return updatedItem
            }
            return item
          }),
        )

        setSuccess(`${fileType} deleted successfully!`)
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

  // Enhanced submit handler with async upload support
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    // Validation
    const isEmpty =
      !form.fileType &&
      !form.landType &&
      !form.tenure &&
      form.fields.every((f) => f.trim() === "") &&
      !form.notes &&
      !form.mapLink &&
      form.images.length === 0 &&
      form.pdfs.length === 0

    if (isEmpty) {
      setError("Form cannot be submitted empty.")
      return
    }

    const requiredFilled = form.fileType && form.landType && form.tenure && form.fields[0] && form.fields[1]

    if (!requiredFilled) {
      setError("Please fill all required fields: File Type, Land Type, Tenure, Person Who Shared, and Contact Number.")
      return
    }

    setSubmitLoading(true)

    try {
      // Prepare data for API
      const propertyData = {
        propertyCategory,
        fileType: form.fileType,
        landType: form.landType,
        tenure: form.tenure,
        personWhoShared: form.fields[0],
        contactNumber: form.fields[1],
        village: form.fields[2],
        taluko: form.fields[3],
        district: form.fields[4],
        serNoNew: form.fields[5],
        serNoOld: form.fields[6],
        fpNo: form.fields[7],
        tp: form.fields[8],
        zone: form.fields[9],
        srArea: form.fields[10],
        fpArea: form.fields[11],
        srRate: form.fields[12],
        fpRate: form.fields[13],
        mtrRoad: form.fields[14],
        nearByLandmark: form.fields[15],
        notes: form.notes,
        mapLink: form.mapLink,
        images: form.images.filter((img) => img.isNew || img.file), // Only new images
        pdfs: form.pdfs.filter((pdf) => pdf.isNew || pdf.file), // Only new PDFs
      }

      console.log(`🚀 Submitting property data:`, {
        ...propertyData,
        images: propertyData.images.length,
        pdfs: propertyData.pdfs.length,
      })

      if (editingProperty) {
        const response = await WalletPropertyAPI.updateWalletProperty(editingProperty._id, propertyData)
        const hasFiles = propertyData.images.length > 0 || propertyData.pdfs.length > 0

        // Update the specific item in properties list immediately
        setProperties((prev) =>
          prev.map((item) =>
            item._id === editingProperty._id
              ? { ...item, ...response.data, personWhoShared: form.fields[0], contactNumber: form.fields[1] }
              : item,
          ),
        )

        setSuccess(
          hasFiles
            ? "Property updated successfully! Files are being uploaded in the background."
            : "Property updated successfully!",
        )
        setEditingProperty(null)
      } else {
        const response = await WalletPropertyAPI.createWalletProperty(propertyData)
        const hasFiles = propertyData.images.length > 0 || propertyData.pdfs.length > 0

        if (hasFiles) {
          // Set up upload tracking
          setCreatedPropertyId(response.walletProperty._id)
          setUploadStatus({
            uploadStatus: "uploading",
            totalFiles: propertyData.images.length + propertyData.pdfs.length,
            uploadedFiles: 0,
            progress: 0,
          })
          setSuccess("Property created successfully! Files are being uploaded in the background...")
        } else {
          setSuccess("Property created successfully!")
          await fetchProperties(pagination.currentPage, searchTerm, true) // Bypass cache
        }
      }

      // Reset form
      setForm(initialFormState)
      setShowForm(false)

      if (!createdPropertyId && !editingProperty) {
        await fetchProperties(pagination.currentPage, searchTerm, true) // Bypass cache
      }
    } catch (err) {
      setError(err.message)
      console.error("Error submitting wallet property:", err)
    } finally {
      setSubmitLoading(false)
    }
  }

  // ENHANCED: Handle edit with better debugging
  const handleEdit = (property) => {
    console.log(`✏️ Editing property:`, {
      id: property._id,
      personWhoShared: property.personWhoShared,
      images: property.images?.length || 0,
      pdfs: property.pdfs?.length || 0,
      imageData: property.images || [],
      pdfData: property.pdfs || [],
    })

    setEditingProperty(property)
    setForm({
      fileType: property.fileType || "",
      landType: property.landType || "",
      tenure: property.tenure || "",
      fields: [
        property.personWhoShared || "",
        property.contactNumber || "",
        property.village || "",
        property.taluko || "",
        property.district || "",
        property.serNoNew || "",
        property.serNoOld || "",
        property.fpNo || "",
        property.tp || "",
        property.zone || "",
        property.srArea || "",
        property.fpArea || "",
        property.srRate || "",
        property.fpRate || "",
        property.mtrRoad || "",
        property.nearByLandmark || "",
      ],
      notes: property.notes || "",
      mapLink: property.mapLink || "",
      // CRITICAL FIX: Properly map existing files
      images:
        property.images?.map((img, index) => {
          console.log(`📸 Mapping existing image ${index + 1}:`, img)
          return {
            id: `existing-img-${index}`,
            url: img.url,
            name: img.originalName || img.name || `Image ${index + 1}`,
            publicId: img.publicId,
            isExisting: true,
          }
        }) || [],
      pdfs:
        property.pdfs?.map((pdf, index) => {
          console.log(`📄 Mapping existing PDF ${index + 1}:`, pdf)
          return {
            id: `existing-pdf-${index}`,
            url: pdf.url,
            name: pdf.originalName || pdf.name || `PDF ${index + 1}`,
            publicId: pdf.publicId,
            isExisting: true,
          }
        }) || [],
    })

    console.log(`📋 Form populated with:`, {
      images: property.images?.length || 0,
      pdfs: property.pdfs?.length || 0,
    })

    setShowForm(true)
  }

  const handleDelete = async (propertyId) => {
    if (window.confirm("Are you sure you want to delete this property? This action cannot be undone.")) {
      try {
        await WalletPropertyAPI.deleteWalletProperty(propertyId)

        // Remove from local state immediately
        setProperties((prev) => prev.filter((item) => item._id !== propertyId))

        setSuccess("Property deleted successfully!")
        await fetchProperties(pagination.currentPage, searchTerm, true) // Bypass cache
      } catch (err) {
        setError(err.message)
        console.error("Error deleting wallet property:", err)
      }
    }
  }

  const handlePageChange = (newPage) => {
    fetchProperties(newPage, searchTerm, true) // Bypass cache for fresh data
  }

  const resetForm = () => {
    setForm(initialFormState)
    setEditingProperty(null)
    setShowForm(false)
    setError("")
    setSuccess("")
    setUploadStatus(null)
    setCreatedPropertyId(null)
  }

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gray-200 min-h-screen rounded-md">
      <h1 className="text-lg text-gray-700 font-bold mb-1">{config.title}</h1>
      <div className="h-[1px] w-[30%] md:w-[20%] bg-gray-600 mb-5 mx-auto"></div>

      <div className="flex flex-col justify-end items-end gap-5 pb-6">
        <button
          onClick={() => (window.location.href = "https://drive.google.com/drive/home")}
          className="px-4 py-2 text-sm border-2 border-gray-800 rounded-md hover:text-gray-800 shadow-2xl bg-gray-800 hover:bg-transparent text-white transition-all"
        >
          {config.driveLabel}
        </button>

        <button
          onClick={() => (window.location.href = "https://docs.google.com/spreadsheets/u/0/")}
          className="px-5 text-sm py-2 border-2 border-gray-800 rounded-md hover:text-gray-800 hover:shadow-2xl bg-gray-800 hover:bg-transparent text-white transition-all"
        >
          {config.sheetLabel}
        </button>
      </div>

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
        </div>
      )}

      {/* Upload Progress Indicator */}
      {uploadStatus && uploadStatus.uploadStatus === "uploading" && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Upload className="animate-pulse" size={20} />
            <span className="font-medium">Uploading files...</span>
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
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Search by person who shared..."
          className="px-4 py-2 border rounded-xl w-1/2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className="bg-gray-700 text-white px-4 py-2 rounded-xl hover:bg-gray-600 flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => {
            if (showForm) {
              resetForm()
            } else {
              setShowForm(true)
            }
          }}
          disabled={uploadStatus && uploadStatus.uploadStatus === "uploading"}
        >
          {showForm ? "Close Form" : "Add Property"}
        </button>
      </div>

      {showForm && (
        <div className="p-6 bg-white border shadow-lg mb-10 rounded-xl">
          <h2 className="text-3xl font-bold mb-6 text-gray-700">
            {editingProperty ? "Edit Property Details" : "Upload Property Details"}
          </h2>

          <div className="flex items-center justify-center gap-2 flex-wrap">
            {[
              {
                label: "--Select file Type --",
                options: ["Title Clear Lands", "Dispute Lands", "Govt. Dispute Lands", "FP / NA", "Others"],
                key: "fileType",
              },
              {
                label: "-- Select Land Type --",
                options: ["Agriculture", "None Agriculture"],
                key: "landType",
              },
              {
                label: "-- Select Tenure--",
                options: ["Old Tenure", "New Tenure", "Premium"],
                key: "tenure",
              },
            ].map(({ label, options, key }) => (
              <select
                key={key}
                value={form[key]}
                onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
                className="block w-[250px] rounded-xl border border-gray-300 bg-white p-3 text-gray-700 shadow-sm focus:border-gray-500 focus:outline-none"
                disabled={submitLoading || (uploadStatus && uploadStatus.uploadStatus === "uploading")}
              >
                <option value="">{label}</option>
                {options.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            ))}
          </div>

          <form className="space-y-6 mt-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fieldLabels.map((placeholder, i) => (
                <input
                  key={i}
                  type="text"
                  placeholder={placeholder}
                  className="w-full px-4 py-2 border border-gray-500 rounded-lg shadow-sm focus:border-gray-700 focus:outline-none"
                  value={form.fields[i]}
                  onChange={(e) => handleInputChange(i, e.target.value)}
                  disabled={submitLoading || (uploadStatus && uploadStatus.uploadStatus === "uploading")}
                />
              ))}
            </div>

            <textarea
              placeholder="Notes"
              rows={3}
              className="w-full px-4 py-2 border border-gray-500 rounded-lg shadow-sm focus:border-gray-700 focus:outline-none"
              value={form.notes}
              onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
              disabled={submitLoading || (uploadStatus && uploadStatus.uploadStatus === "uploading")}
            />

            <input
              type="text"
              placeholder="Google Map Embed Link"
              className="w-full px-4 py-2 border border-gray-500 rounded-lg shadow-sm focus:border-gray-700 focus:outline-none"
              value={form.mapLink}
              onChange={(e) => setForm((prev) => ({ ...prev, mapLink: e.target.value }))}
              disabled={submitLoading || (uploadStatus && uploadStatus.uploadStatus === "uploading")}
            />

            <div>
              <label className="block font-medium mb-2 text-gray-600">Upload Property Images</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="w-full px-3 py-2 border border-gray-500 rounded-lg shadow-sm focus:border-gray-700 focus:outline-none"
                disabled={submitLoading || (uploadStatus && uploadStatus.uploadStatus === "uploading")}
              />
              <div className="flex flex-wrap gap-4 mt-4">
                {form.images.map((img, idx) => (
                  <div key={img.id || idx} className="relative w-32 h-32 rounded-xl overflow-hidden border shadow">
                    <img src={img.url || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      disabled={
                        deletingFiles.has(`image-${idx}`) ||
                        submitLoading ||
                        (uploadStatus && uploadStatus.uploadStatus === "uploading")
                      }
                      className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-red-50 disabled:opacity-50"
                    >
                      {deletingFiles.has(`image-${idx}`) ? (
                        <Loader2 className="animate-spin" size={16} />
                      ) : (
                        <X size={16} />
                      )}
                    </button>
                    {img.isExisting && (
                      <div className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-1 rounded">Saved</div>
                    )}
                    {img.isNew && (
                      <div className="absolute bottom-1 left-1 bg-green-500 text-white text-xs px-1 rounded">New</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-medium mb-2 mt-4 text-gray-600">Upload PDFs</label>
              <input
                type="file"
                accept=".pdf"
                multiple
                onChange={handlePdfUpload}
                className="w-full px-3 py-2 border border-gray-500 rounded-lg shadow-sm focus:border-gray-700 focus:outline-none"
                disabled={submitLoading || (uploadStatus && uploadStatus.uploadStatus === "uploading")}
              />
              <div className="flex flex-col gap-2 mt-4">
                {form.pdfs.map((pdf, idx) => (
                  <div
                    key={pdf.id || idx}
                    className="flex justify-between items-center px-3 py-2 border rounded-xl bg-gray-100"
                  >
                    <span className="truncate flex items-center gap-2">
                      {pdf.name}
                      {pdf.isExisting && (
                        <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">Saved</span>
                      )}
                      {pdf.isNew && <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">New</span>}
                    </span>
                    <button
                      type="button"
                      onClick={() => removePdf(idx)}
                      disabled={
                        deletingFiles.has(`pdf-${idx}`) ||
                        submitLoading ||
                        (uploadStatus && uploadStatus.uploadStatus === "uploading")
                      }
                      className="text-red-500 hover:text-red-700 ml-2 disabled:opacity-50"
                    >
                      {deletingFiles.has(`pdf-${idx}`) ? (
                        <Loader2 className="animate-spin" size={16} />
                      ) : (
                        <X size={16} />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={submitLoading || (uploadStatus && uploadStatus.uploadStatus === "uploading")}
                className="bg-gray-600 text-white px-6 py-3 rounded-xl hover:bg-gray-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitLoading && <Loader2 className="animate-spin" size={16} />}
                {editingProperty ? "Update Property" : "Submit Property"}
              </button>

              <button
                type="button"
                onClick={resetForm}
                disabled={uploadStatus && uploadStatus.uploadStatus === "uploading"}
                className="bg-gray-300 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="animate-spin" size={32} />
          <span className="ml-2">Loading properties...</span>
        </div>
      ) : (
        <>
          {properties.map((property, idx) => (
            <div
              key={property._id || idx}
              className="bg-white p-4 mb-4 border rounded-xl shadow transition-all hover:shadow-lg"
            >
              <div
                className="cursor-pointer flex justify-between items-center"
                onClick={() => setExpandedIndex(expandedIndex === idx ? null : idx)}
              >
                <div>
                  <h3 className="font-bold text-lg text-gray-800">{property.personWhoShared}</h3>
                  <p className="text-sm text-gray-600">{property.contactNumber}</p>
                  <p className="text-xs text-gray-500">
                    {property.fileType} • {property.landType} • {property.tenure}
                  </p>
                  {/* Show upload status for properties */}
                  {property.uploadStatus === "uploading" && (
                    <p className="text-xs text-blue-600 flex items-center gap-1">
                      <Upload size={12} className="animate-pulse" />
                      Files uploading...
                    </p>
                  )}
                  {/* ENHANCED: Show file counts */}
                  {(property.images?.length > 0 || property.pdfs?.length > 0) && (
                    <p className="text-xs text-green-600 flex items-center gap-2 mt-1">
                      {property.images?.length > 0 && (
                        <span className="flex items-center gap-1">
                          📸 {property.images.length} image{property.images.length !== 1 ? "s" : ""}
                        </span>
                      )}
                      {property.pdfs?.length > 0 && (
                        <span className="flex items-center gap-1">
                          📄 {property.pdfs.length} PDF{property.pdfs.length !== 1 ? "s" : ""}
                        </span>
                      )}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleEdit(property)
                    }}
                    className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-50 transition-all"
                    title="Edit Property"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(property._id)
                    }}
                    className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-all"
                    title="Delete Property"
                  >
                    <Trash2 size={16} />
                  </button>
                  <button className="text-blue-500 text-sm underline">
                    {expandedIndex === idx ? "Hide Details" : "View Details"}
                  </button>
                </div>
              </div>

              {expandedIndex === idx && (
                <div className="mt-4 border-t pt-4">
                  {property.notes && (
                    <p className="text-sm mb-2 text-gray-800">
                      <strong>Notes:</strong> {property.notes}
                    </p>
                  )}

                  {property.mapLink && (
                    <p className="text-sm mb-2">
                      <strong>Map:</strong>
                      <a
                        href={property.mapLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline ml-1"
                      >
                        View Location
                      </a>
                    </p>
                  )}

                  {/* ENHANCED: Better image display with debugging */}
                  {property.images && property.images.length > 0 && (
                    <div className="mb-4">
                      <strong className="text-sm">Images ({property.images.length}):</strong>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                        {property.images.map((img, i) => {
                          console.log(`🖼️ Rendering image ${i + 1}:`, img)
                          return (
                            <div key={i} className="relative group">
                              <img
                                src={img.url || "/placeholder.svg"}
                                alt={`Property Image ${i + 1}`}
                                className="w-full h-32 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={() => window.open(img.url, "_blank")}
                                onError={(e) => {
                                  console.error(`❌ Failed to load image ${i + 1}:`, img.url)
                                  e.target.src = "/placeholder.svg"
                                }}
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded flex items-center justify-center">
                                <span className="text-white opacity-0 group-hover:opacity-100 text-sm font-medium">
                                  Click to view
                                </span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* ENHANCED: Better PDF display with debugging */}
                  {property.pdfs && property.pdfs.length > 0 && (
                    <div className="mt-2 text-sm text-gray-800">
                      <strong>PDFs ({property.pdfs.length}):</strong>
                      <ul className="list-disc list-inside mt-1 space-y-1">
                        {property.pdfs.map((pdf, i) => {
                          console.log(`📄 Rendering PDF ${i + 1}:`, pdf)
                          return (
                            <li key={i} className="flex items-center gap-2">
                              <a
                                href={pdf.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline hover:text-blue-800 flex items-center gap-1"
                              >
                                📄 {pdf.originalName || pdf.name || `PDF ${i + 1}`}
                              </a>
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  )}

                  <div className="mt-4 text-sm text-gray-700">
                    <strong>Property Details:</strong>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                      {property.village && (
                        <p>
                          <strong>Village:</strong> {property.village}
                        </p>
                      )}
                      {property.taluko && (
                        <p>
                          <strong>Taluko:</strong> {property.taluko}
                        </p>
                      )}
                      {property.district && (
                        <p>
                          <strong>District:</strong> {property.district}
                        </p>
                      )}
                      {property.srArea && (
                        <p>
                          <strong>SR Area:</strong> {property.srArea}
                        </p>
                      )}
                      {property.fpArea && (
                        <p>
                          <strong>FP Area:</strong> {property.fpArea}
                        </p>
                      )}
                      {property.srRate && (
                        <p>
                          <strong>SR Rate:</strong> ₹{property.srRate}
                        </p>
                      )}
                      {property.fpRate && (
                        <p>
                          <strong>FP Rate:</strong> ₹{property.fpRate}
                        </p>
                      )}
                      {property.mtrRoad && (
                        <p>
                          <strong>MTR Road:</strong> {property.mtrRoad}
                        </p>
                      )}
                      {property.nearByLandmark && (
                        <p>
                          <strong>Nearby Landmark:</strong> {property.nearByLandmark}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPrev}
                className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all"
              >
                Previous
              </button>

              <span className="px-4 py-2 text-gray-600">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>

              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={!pagination.hasNext}
                className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all"
              >
                Next
              </button>
            </div>
          )}

          {properties.length === 0 && !loading && (
            <div className="text-center py-8 text-gray-500">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-lg font-medium mb-2">No properties found</h3>
              <p className="text-sm">
                {searchTerm ? "Try adjusting your search terms." : "Start by adding your first property."}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default WalletProperty
