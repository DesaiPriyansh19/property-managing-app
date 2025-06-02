"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUpload,
  FaEdit,
  FaTrash,
  FaSpinner,
  FaImage,
  FaFilePdf,
  FaEye,
  FaPlus,
  FaToggleOn,
  FaToggleOff,
} from "react-icons/fa";
import { FiSearch, FiX, FiCheck, FiAlertCircle } from "react-icons/fi";
import MapsAPI from "../services/MapsApi";

const AllMaps = () => {
  const [area, setArea] = useState("");
  const [notes, setNotes] = useState("");
  const [images, setImages] = useState([]);
  const [pdfs, setPdfs] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [existingPdfs, setExistingPdfs] = useState([]);
  const [uploadedData, setUploadedData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [uploadStatus, setUploadStatus] = useState(null);
  const [createdMapsId, setCreatedMapsId] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalMaps: 0,
  });
  const [deletingFiles, setDeletingFiles] = useState(new Set());
  const [previewImage, setPreviewImage] = useState(null);
  const [togglingItems, setTogglingItems] = useState(new Set());

  // Load maps on component mount
  useEffect(() => {
    fetchMaps();
  }, []);

  // Handle search with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchMaps(1);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Clear messages after 5 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError("");
        setSuccess("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  // FIXED: Enhanced upload status polling with real-time updates
  useEffect(() => {
    if (createdMapsId && uploadStatus?.uploadStatus === "uploading") {
      const interval = setInterval(async () => {
        try {
          const status = await MapsAPI.getUploadStatus(createdMapsId);
          setUploadStatus(status);

          if (
            status.uploadStatus === "completed" ||
            status.uploadStatus === "failed"
          ) {
            clearInterval(interval);

            // CRITICAL: Force fresh data fetch with cache bypass
            await fetchMaps(pagination.currentPage, true); // true = bypass cache

            if (status.uploadStatus === "completed") {
              setSuccess(
                "Maps created successfully! All files have been uploaded."
              );

              // FIXED: Update the specific map in real-time
              try {
                const updatedMap = await MapsAPI.getMapsById(createdMapsId);
                setUploadedData((prev) =>
                  prev.map((item) =>
                    item._id === createdMapsId ? updatedMap.data : item
                  )
                );
              } catch (err) {
                console.error("Error fetching updated map:", err);
              }
            } else {
              setError("Maps created but some files failed to upload.");
            }
            setCreatedMapsId(null);
          }
        } catch (err) {
          console.error("Error fetching upload status:", err);
          clearInterval(interval);
        }
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [createdMapsId, uploadStatus, pagination.currentPage]);

  // FIXED: Enhanced fetch maps with cache bypass option
  const fetchMaps = async (page = 1, bypassCache = false) => {
    setLoading(true);
    setError("");

    try {
      const params = {
        page,
        limit: 9,
        ...(searchQuery && { search: searchQuery }),
        ...(bypassCache && { bypassCache: "true" }),
      };

      const response = await MapsAPI.getAllMaps(params);
      setUploadedData(response.data || []);
      setPagination(
        response.pagination || { currentPage: 1, totalPages: 1, totalMaps: 0 }
      );
    } catch (err) {
      setError(err.message);
      console.error("Error fetching maps:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      id: Date.now() + Math.random(),
      file,
      url: URL.createObjectURL(file),
      name: file.name,
      isNew: true,
    }));
    setImages((prev) => [...prev, ...newImages]);
  };

  const handlePdfChange = (e) => {
    const files = Array.from(e.target.files);
    const newPdfs = files.map((file) => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      url: URL.createObjectURL(file),
      isNew: true,
    }));
    setPdfs((prev) => [...prev, ...newPdfs]);
  };

  const removeFile = (type, id) => {
    if (type === "image") {
      const updated = images.filter((f) => f.id !== id);
      const fileToRemove = images.find((f) => f.id === id);
      if (fileToRemove && fileToRemove.url.startsWith("blob:")) {
        URL.revokeObjectURL(fileToRemove.url);
      }
      setImages(updated);
    } else {
      const updated = pdfs.filter((f) => f.id !== id);
      const fileToRemove = pdfs.find((f) => f.id === id);
      if (fileToRemove && fileToRemove.url.startsWith("blob:")) {
        URL.revokeObjectURL(fileToRemove.url);
      }
      setPdfs(updated);
    }
  };

  // FIXED: Enhanced existing file removal with real-time updates
  const removeExistingFile = async (fileType, publicId, index, mapsId) => {
    if (
      window.confirm(
        `Are you sure you want to delete this ${fileType}? This action cannot be undone.`
      )
    ) {
      try {
        setDeletingFiles((prev) => new Set([...prev, `${fileType}-${index}`]));

        await MapsAPI.deleteMapsFile(mapsId, fileType, publicId);

        // FIXED: Update existing files state immediately
        if (fileType === "image") {
          setExistingImages((prev) => prev.filter((_, i) => i !== index));
        } else {
          setExistingPdfs((prev) => prev.filter((_, i) => i !== index));
        }

        // FIXED: Update uploaded data in real-time
        setUploadedData((prev) =>
          prev.map((item) => {
            if (item._id === mapsId) {
              const updatedItem = { ...item };
              if (fileType === "image") {
                updatedItem.images = updatedItem.images.filter(
                  (_, i) => i !== index
                );
              } else {
                updatedItem.pdfs = updatedItem.pdfs.filter(
                  (_, i) => i !== index
                );
              }
              return updatedItem;
            }
            return item;
          })
        );

        setSuccess(`${fileType} deleted successfully!`);
      } catch (err) {
        setError(`Failed to delete ${fileType}: ${err.message}`);
      } finally {
        setDeletingFiles((prev) => {
          const newSet = new Set(prev);
          newSet.delete(`${fileType}-${index}`);
          return newSet;
        });
      }
    }
  };

  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    if (!area.trim()) {
      setError("Area is required");
      return;
    }

    setSubmitLoading(true);

    try {
      const mapsData = {
        area: area.trim(),
        notes: notes.trim(),
        images,
        pdfs,
      };

      if (editingId) {
        const response = await MapsAPI.updateMaps(editingId, mapsData);
        const hasFiles = images.length > 0 || pdfs.length > 0;

        // FIXED: Update the specific item in uploadedData immediately
        setUploadedData((prev) =>
          prev.map((item) =>
            item._id === editingId
              ? { ...item, area: area.trim(), notes: notes.trim() }
              : item
          )
        );

        setSuccess(
          hasFiles
            ? "Maps updated successfully! Files are being uploaded in the background."
            : "Maps updated successfully!"
        );
        setEditingIndex(null);
        setEditingId(null);
      } else {
        const response = await MapsAPI.createMaps(mapsData);
        const hasFiles = images.length > 0 || pdfs.length > 0;

        if (hasFiles) {
          setCreatedMapsId(response.maps._id);
          setUploadStatus({
            uploadStatus: "uploading",
            totalFiles: images.length + pdfs.length,
            uploadedFiles: 0,
            progress: 0,
          });
          setSuccess(
            "Maps created successfully! Files are being uploaded in the background..."
          );
        } else {
          setSuccess("Maps created successfully!");
          await fetchMaps(pagination.currentPage, true); // Bypass cache
        }
      }

      // Reset form
      setArea("");
      setNotes("");
      setImages([]);
      setPdfs([]);
      setExistingImages([]);
      setExistingPdfs([]);
      setShowForm(false);

      if (!createdMapsId && !editingId) {
        await fetchMaps(pagination.currentPage, true); // Bypass cache
      }
    } catch (err) {
      setError(err.message);
      console.error("Error submitting maps:", err);
    } finally {
      setSubmitLoading(false);
    }
  };

  const toggleForm = () => {
    setShowForm(!showForm);
    setEditingIndex(null);
    setEditingId(null);
    setArea("");
    setNotes("");
    setImages([]);
    setPdfs([]);
    setExistingImages([]);
    setExistingPdfs([]);
    setError("");
    setSuccess("");
  };

  const handleEdit = (index) => {
    const item = uploadedData[index];
    setEditingIndex(index);
    setEditingId(item._id);
    setArea(item.area || "");
    setNotes(item.notes || "");
    setImages([]);
    setPdfs([]);
    setExistingImages(item.images || []);
    setExistingPdfs(item.pdfs || []);
    setShowForm(true);
  };

  const handleDelete = async (index) => {
    if (
      window.confirm(
        "Are you sure you want to delete this map? This action cannot be undone."
      )
    ) {
      try {
        const item = uploadedData[index];
        await MapsAPI.deleteMaps(item._id);

        // FIXED: Remove from local state immediately
        setUploadedData((prev) => prev.filter((_, i) => i !== index));

        setSuccess("Maps deleted successfully!");
        await fetchMaps(pagination.currentPage, true); // Bypass cache
      } catch (err) {
        setError(err.message);
        console.error("Error deleting maps:", err);
      }
    }
  };

  const handleShare = (item) => {
    const imageUrls = item.images.map((img) => img.url);
    const pdfUrls = item.pdfs.map((pdf) => pdf.url);
    const allFiles = [...imageUrls, ...pdfUrls];

    const message = `Check out these maps for ${item.area}:\n${
      item.notes ? `Notes: ${item.notes}\n` : ""
    }Files: ${allFiles.join(", ")}`;
    const whatsappLink = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappLink, "_blank");
  };

  const handlePageChange = (newPage) => {
    fetchMaps(newPage, true); // Bypass cache for fresh data
  };

  const handleOnBoardToggle = async (item, index) => {
    try {
      setError("");

      // Create a new Set with the current toggling items
      const newTogglingItems = new Set(togglingItems);
      newTogglingItems.add(item._id);
      setTogglingItems(newTogglingItems);

      const newOnBoardStatus = !item.onBoard;
      await MapsAPI.toggleOnBoard(item._id, newOnBoardStatus);

      // Update the local state immediately
      setUploadedData((prev) =>
        prev.map((map, i) =>
          i === index ? { ...map, onBoard: newOnBoardStatus } : map
        )
      );

      setSuccess(
        `Map ${
          newOnBoardStatus ? "added to" : "removed from"
        } onBoard successfully!`
      );
    } catch (err) {
      setError(err.message);
      console.error("Error toggling onBoard status:", err);
    } finally {
      // Remove the item from toggling state
      setTogglingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(item._id);
        return newSet;
      });
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-300 font-sans text-gray-900 p-8">
      {/* ✨ Animated Background Blobs - Same as Home */}
      <div className="absolute top-[-80px] left-[-80px] w-72 h-72 bg-gray-700 rounded-full opacity-10 animate-blob2 z-0"></div>
      <div
        className="absolute bottom-[-100px] right-[-100px] w-96 h-96 bg-gray-700 rounded-full opacity-10 animate-blob2 z-0"
        style={{ animationDelay: "2s" }}
      ></div>
      <div
        className="absolute top-[30%] left-[60%] w-64 h-64 bg-gray-700 rounded-full opacity-10 animate-blob2 z-0"
        style={{ animationDelay: "4s" }}
      ></div>
      <div
        className="absolute top-[10%] right-[10%] w-52 h-52 bg-gray-700 rounded-full opacity-20 animate-blob2 z-0"
        style={{ animationDelay: "1.5s" }}
      ></div>
      <div
        className="absolute bottom-[20%] left-[15%] w-40 h-40 bg-gray-700 rounded-full opacity-15 animate-blob2 z-0"
        style={{ animationDelay: "3s" }}
      ></div>
      <div
        className="absolute top-[70%] right-[25%] w-60 h-60 bg-gray-700 rounded-full opacity-10 animate-blob2 z-0"
        style={{ animationDelay: "5s" }}
      ></div>
      <div
        className="absolute top-[45%] left-[5%] w-56 h-56 bg-gray-700 rounded-full opacity-10 animate-blob2 z-0"
        style={{ animationDelay: "6s" }}
      ></div>

      {/* ✅ Content wrapped inside z-10 */}
      <div className="relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-700 mb-4">All Maps</h1>
          <p className="text-gray-600 text-lg">
            Manage and organize your geographical data
          </p>
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

          {uploadStatus && uploadStatus.uploadStatus === "uploading" && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 bg-gray-100 border border-gray-400 text-gray-700 px-4 py-3 rounded-lg"
            >
              <div className="flex items-center gap-2 mb-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                >
                  <FaUpload size={20} />
                </motion.div>
                <span className="font-medium">Uploading files...</span>
              </div>
              <div className="w-full bg-gray-300 rounded-full h-2 mb-2">
                <motion.div
                  className="bg-gray-600 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${uploadStatus.progress || 0}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <p className="text-sm">
                {uploadStatus.uploadedFiles || 0} of{" "}
                {uploadStatus.totalFiles || 0} files uploaded (
                {uploadStatus.progress || 0}%)
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search and Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between"
        >
          <div className="relative flex-1 max-w-md">
            <FiSearch
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              size={20}
            />
            <input
              type="text"
              placeholder="Search by area or notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-500 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-600 bg-white shadow-sm text-lg"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleForm}
            disabled={uploadStatus && uploadStatus.uploadStatus === "uploading"}
            className="bg-gray-700 text-white px-6 py-3 rounded-2xl font-medium shadow-lg hover:bg-gray-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <FaPlus size={16} />
            {editingIndex !== null ? "Edit Map" : "Upload Maps"}
          </motion.button>
        </motion.div>

        {/* Form Modal */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
              onClick={(e) => e.target === e.currentTarget && toggleForm()}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-300"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800 mb-1">
                        Area: {area}
                      </h2>
                      {notes && (
                        <p className="text-gray-600 text-sm line-clamp-2">
                          -- {notes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Area Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Area <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent"
                      placeholder="Enter area name"
                      required
                      disabled={
                        submitLoading ||
                        (uploadStatus &&
                          uploadStatus.uploadStatus === "uploading")
                      }
                    />
                  </div>

                  {/* Notes Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent resize-none"
                      placeholder="Enter notes"
                      rows={3}
                      disabled={
                        submitLoading ||
                        (uploadStatus &&
                          uploadStatus.uploadStatus === "uploading")
                      }
                    />
                  </div>

                  {/* Existing Images */}
                  {editingId && existingImages.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-3">
                        <FaImage className="inline mr-2" />
                        Current Images
                      </label>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                        {existingImages.map((img, imgIndex) => (
                          <motion.div
                            key={`existing-img-${imgIndex}`}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative group"
                          >
                            <img
                              src={img.url || "/placeholder.svg"}
                              className="w-full h-20 object-cover rounded-lg border-2 border-gray-300 cursor-pointer"
                              alt="Existing Map"
                              onClick={() => setPreviewImage(img.url)}
                            />
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              type="button"
                              onClick={() =>
                                removeExistingFile(
                                  "image",
                                  img.publicId,
                                  imgIndex,
                                  editingId
                                )
                              }
                              disabled={deletingFiles.has(`image-${imgIndex}`)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                            >
                              {deletingFiles.has(`image-${imgIndex}`) ? (
                                <FaSpinner className="animate-spin" size={12} />
                              ) : (
                                <FiX size={12} />
                              )}
                            </motion.button>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* New Images */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaImage className="inline mr-2" />
                      {editingId ? "Add New Images" : "Images"}
                    </label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                      disabled={
                        submitLoading ||
                        (uploadStatus &&
                          uploadStatus.uploadStatus === "uploading")
                      }
                    />
                    {images.length > 0 && (
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-3">
                        {images.map((img) => (
                          <motion.div
                            key={img.id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative group"
                          >
                            <img
                              src={img.url || "/placeholder.svg"}
                              className="w-full h-20 object-cover rounded-lg border-2 border-green-300"
                              alt="New Preview"
                            />
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              type="button"
                              onClick={() => removeFile("image", img.id)}
                              disabled={
                                submitLoading ||
                                (uploadStatus &&
                                  uploadStatus.uploadStatus === "uploading")
                              }
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                            >
                              <FiX size={12} />
                            </motion.button>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Existing PDFs */}
                  {editingId && existingPdfs.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-3">
                        <FaFilePdf className="inline mr-2" />
                        Current PDFs
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {existingPdfs.map((pdf, pdfIndex) => (
                          <motion.div
                            key={`existing-pdf-${pdfIndex}`}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative group"
                          >
                            <div className="bg-gray-100 border-2 border-gray-300 rounded-lg p-3 h-24 flex flex-col justify-between">
                              <div className="text-xs text-gray-600 truncate">
                                {pdf.originalName || pdf.name}
                              </div>
                              <div className="text-xs text-gray-600 font-medium">
                                Current PDF
                              </div>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              type="button"
                              onClick={() =>
                                removeExistingFile(
                                  "pdf",
                                  pdf.publicId,
                                  pdfIndex,
                                  editingId
                                )
                              }
                              disabled={deletingFiles.has(`pdf-${pdfIndex}`)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                            >
                              {deletingFiles.has(`pdf-${pdfIndex}`) ? (
                                <FaSpinner className="animate-spin" size={12} />
                              ) : (
                                <FiX size={12} />
                              )}
                            </motion.button>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* New PDFs */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaFilePdf className="inline mr-2" />
                      {editingId ? "Add New PDFs" : "PDFs"}
                    </label>
                    <input
                      type="file"
                      multiple
                      accept=".pdf"
                      onChange={handlePdfChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                      disabled={
                        submitLoading ||
                        (uploadStatus &&
                          uploadStatus.uploadStatus === "uploading")
                      }
                    />
                    {pdfs.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
                        {pdfs.map((pdf) => (
                          <motion.div
                            key={pdf.id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative group"
                          >
                            <div className="bg-green-100 border-2 border-green-300 rounded-lg p-3 h-24 flex flex-col justify-between">
                              <div className="text-xs text-gray-600 truncate">
                                {pdf.name}
                              </div>
                              <div className="text-xs text-green-600 font-medium">
                                New PDF
                              </div>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              type="button"
                              onClick={() => removeFile("pdf", pdf.id)}
                              disabled={
                                submitLoading ||
                                (uploadStatus &&
                                  uploadStatus.uploadStatus === "uploading")
                              }
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                            >
                              <FiX size={12} />
                            </motion.button>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Form Actions */}
                  <div className="flex gap-4 pt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={handleSubmit}
                      disabled={
                        submitLoading ||
                        (uploadStatus &&
                          uploadStatus.uploadStatus === "uploading")
                      }
                      className="flex-1 bg-gray-700 text-white py-3 px-6 rounded-xl font-medium shadow-lg hover:bg-gray-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {submitLoading && (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "linear",
                          }}
                        >
                          <FaSpinner size={16} />
                        </motion.div>
                      )}
                      {editingIndex !== null ? "Update Map" : "Create Map"}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={toggleForm}
                      disabled={
                        uploadStatus &&
                        uploadStatus.uploadStatus === "uploading"
                      }
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </motion.button>
                  </div>
                </div>
              </motion.div>
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

        {/* Loading State */}
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-16"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
              className="w-12 h-12 border-4 border-gray-300 border-t-gray-600 rounded-full mb-4"
            />
            <p className="text-gray-600 text-lg">Loading maps...</p>
          </motion.div>
        ) : (
          <>
            {/* Maps Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
            >
              {uploadedData.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="col-span-full text-center py-16"
                >
                  <div className="text-8xl mb-6">🗺️</div>
                  <h3 className="text-2xl font-semibold text-gray-700 mb-4">
                    No maps found
                  </h3>
                  <p className="text-gray-500 mb-8 text-lg">
                    {searchQuery
                      ? "Try adjusting your search criteria"
                      : "Start by creating your first map"}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowForm(true)}
                    className="bg-gray-700 text-white px-8 py-4 rounded-2xl font-medium shadow-lg hover:bg-gray-600 transition-all duration-200"
                  >
                    Create Your First Map
                  </motion.button>
                </motion.div>
              ) : (
                uploadedData.map((data, index) => (
                  <motion.div
                    key={data._id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-400"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-800 mb-1">
                            Area: {data.area}
                          </h3>
                          {data.notes && (
                            <p className="text-gray-600 text-sm line-clamp-2">
                              -- {data.notes}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Images */}
                      {data.images && data.images.length > 0 && (
                        <div className="mb-4">
                          <div className="flex items-center gap-2 mb-3">
                            <FaImage className="text-gray-600" size={16} />
                            <span className="text-sm font-medium text-gray-700">
                              Images ({data.images.length})
                            </span>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            {data.images.slice(0, 3).map((img, imgIndex) => (
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
                            {data.images.length > 3 && (
                              <div className="w-full h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 text-sm font-medium">
                                +{data.images.length - 3} more
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* PDFs */}
                      {data.pdfs && data.pdfs.length > 0 && (
                        <div className="mb-4">
                          <div className="flex items-center gap-2 mb-3">
                            <FaFilePdf className="text-red-500" size={16} />
                            <span className="text-sm font-medium text-gray-700">
                              PDFs ({data.pdfs.length})
                            </span>
                          </div>
                          <div className="space-y-2">
                            {data.pdfs.slice(0, 2).map((pdf, pdfIndex) => (
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
                                <div className="text-xs text-gray-600 font-medium mt-1">
                                  View PDF
                                </div>
                              </motion.a>
                            ))}
                            {data.pdfs.length > 2 && (
                              <div className="text-xs text-gray-500 text-center py-2">
                                +{data.pdfs.length - 2} more PDFs
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
                          onClick={() => handleOnBoardToggle(data, index)}
                          disabled={togglingItems.has(data._id)}
                          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                            data.onBoard
                              ? "bg-green-500 hover:bg-green-600 text-white"
                              : "bg-gray-500 hover:bg-gray-600 text-white"
                          }`}
                        >
                          {togglingItems.has(data._id) ? (
                            <FaSpinner className="animate-spin" size={14} />
                          ) : data.onBoard ? (
                            <FaToggleOn size={14} />
                          ) : (
                            <FaToggleOff size={14} />
                          )}
                          {togglingItems.has(data._id)
                            ? "Updating..."
                            : data.onBoard
                            ? "On Board"
                            : "Not On Board"}
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleEdit(index)}
                          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                        >
                          <FaEdit size={14} />
                          Edit
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDelete(index)}
                          className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                        >
                          <FaTrash size={14} />
                          Delete
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-center items-center gap-4"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrev}
                  className="px-6 py-3 bg-white border border-gray-300 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all shadow-sm"
                >
                  Previous
                </motion.button>

                <div className="flex items-center gap-2">
                  {Array.from(
                    { length: Math.min(5, pagination.totalPages) },
                    (_, i) => {
                      const page = i + 1;
                      return (
                        <motion.button
                          key={page}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handlePageChange(page)}
                          className={`w-10 h-10 rounded-lg font-medium transition-all ${
                            page === pagination.currentPage
                              ? "bg-gray-700 text-white shadow-lg"
                              : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-300"
                          }`}
                        >
                          {page}
                        </motion.button>
                      );
                    }
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNext}
                  className="px-6 py-3 bg-white border border-gray-300 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all shadow-sm"
                >
                  Next
                </motion.button>
              </motion.div>
            )}

            {/* Results Info */}
            {uploadedData.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-gray-600 text-sm mt-6"
              >
                Showing {(pagination.currentPage - 1) * 9 + 1} to{" "}
                {Math.min(pagination.currentPage * 9, pagination.totalMaps)} of{" "}
                {pagination.totalMaps} maps
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AllMaps;
