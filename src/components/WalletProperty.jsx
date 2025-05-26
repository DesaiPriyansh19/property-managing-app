"use client";

import { useState, useEffect } from "react";
import { X, Loader2, Trash2, Edit, AlertCircle } from "lucide-react";
import WalletPropertyAPI from "../services/WalletPropertyApi";

const initialFormState = {
  fileType: "",
  landType: "",
  tenure: "",
  fields: Array(16).fill(""),
  notes: "",
  mapLink: "",
  images: [],
  pdfs: [],
};

const WalletProperty = ({ propertyCategory }) => {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialFormState);
  const [properties, setProperties] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingProperty, setEditingProperty] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProperties: 0,
  });
  const [deletingFiles, setDeletingFiles] = useState(new Set());

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
  ];

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
  };

  const config = categoryConfig[propertyCategory] || categoryConfig.myproperies;

  // Load properties on component mount and when category changes
  useEffect(() => {
    fetchProperties();
  }, [propertyCategory]);

  // Handle search with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm !== "") {
        fetchProperties(1, searchTerm);
      } else {
        fetchProperties();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

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

  // Fetch properties from API
  const fetchProperties = async (page = 1, search = "") => {
    setLoading(true);
    setError("");

    try {
      const params = {
        page,
        limit: 10,
        propertyCategory,
        ...(search && { search }),
      };

      const response = await WalletPropertyAPI.getAllWalletProperties(params);
      setProperties(response.data || []);
      setPagination(
        response.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalProperties: 0,
        }
      );
    } catch (err) {
      setError(err.message);
      console.error("Error fetching wallet properties:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (index, value) => {
    const updatedFields = [...form.fields];
    updatedFields[index] = value;
    setForm((prev) => ({ ...prev, fields: updatedFields }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      name: file.name,
    }));
    setForm((prev) => ({ ...prev, images: [...prev.images, ...newImages] }));
  };

  const handlePdfUpload = (e) => {
    const files = Array.from(e.target.files);
    const newPdfs = files.map((file) => ({
      file,
      name: file.name,
      url: URL.createObjectURL(file),
    }));
    setForm((prev) => ({ ...prev, pdfs: [...prev.pdfs, ...newPdfs] }));
  };

  const removeImage = async (index) => {
    // Check if this is an existing image (has publicId) or a new one
    const image = form.images[index];

    if (image.isExisting && image.publicId && editingProperty) {
      // This is an existing image, delete from Cloudinary
      await removeExistingFile("image", image.publicId, index);
    } else {
      // This is a new image, just remove from local state
      const updated = [...form.images];
      if (updated[index].url && updated[index].url.startsWith("blob:")) {
        URL.revokeObjectURL(updated[index].url);
      }
      updated.splice(index, 1);
      setForm((prev) => ({ ...prev, images: updated }));
    }
  };

  const removePdf = async (index) => {
    // Check if this is an existing PDF (has publicId) or a new one
    const pdf = form.pdfs[index];

    if (pdf.isExisting && pdf.publicId && editingProperty) {
      // This is an existing PDF, delete from Cloudinary
      await removeExistingFile("pdf", pdf.publicId, index);
    } else {
      // This is a new PDF, just remove from local state
      const updated = [...form.pdfs];
      if (updated[index].url && updated[index].url.startsWith("blob:")) {
        URL.revokeObjectURL(updated[index].url);
      }
      updated.splice(index, 1);
      setForm((prev) => ({ ...prev, pdfs: updated }));
    }
  };

  const removeExistingFile = async (fileType, publicId, index) => {
    if (
      window.confirm(
        `Are you sure you want to delete this ${fileType}? This action cannot be undone.`
      )
    ) {
      try {
        setDeletingFiles((prev) => new Set([...prev, `${fileType}-${index}`]));

        // Call API to delete file from Cloudinary and database
        await WalletPropertyAPI.deleteWalletPropertyFile(
          editingProperty._id,
          fileType,
          publicId
        );

        // Update local state
        if (fileType === "image") {
          const updatedImages = [...form.images];
          updatedImages.splice(index, 1);
          setForm((prev) => ({ ...prev, images: updatedImages }));
        } else {
          const updatedPdfs = [...form.pdfs];
          updatedPdfs.splice(index, 1);
          setForm((prev) => ({ ...prev, pdfs: updatedPdfs }));
        }

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    const isEmpty =
      !form.fileType &&
      !form.landType &&
      !form.tenure &&
      form.fields.every((f) => f.trim() === "") &&
      !form.notes &&
      !form.mapLink &&
      form.images.length === 0 &&
      form.pdfs.length === 0;

    if (isEmpty) {
      setError("Form cannot be submitted empty.");
      return;
    }

    const requiredFilled =
      form.fileType &&
      form.landType &&
      form.tenure &&
      form.fields[0] &&
      form.fields[1];

    if (!requiredFilled) {
      setError(
        "Please fill all required fields: File Type, Land Type, Tenure, Person Who Shared, and Contact Number."
      );
      return;
    }

    setSubmitLoading(true);

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
        images: form.images,
        pdfs: form.pdfs,
      };

      if (editingProperty) {
        await WalletPropertyAPI.updateWalletProperty(
          editingProperty._id,
          propertyData
        );
        setSuccess("Property updated successfully!");
        setEditingProperty(null);
      } else {
        await WalletPropertyAPI.createWalletProperty(propertyData);
        setSuccess("Property created successfully!");
      }

      // Reset form and refresh properties
      setForm(initialFormState);
      setShowForm(false);
      await fetchProperties();
    } catch (err) {
      setError(err.message);
      console.error("Error submitting wallet property:", err);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEdit = (property) => {
    setEditingProperty(property);
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
      images:
        property.images?.map((img) => ({
          url: img.url,
          name: img.originalName,
          publicId: img.publicId, // Add publicId for deletion
          isExisting: true,
        })) || [],
      pdfs:
        property.pdfs?.map((pdf) => ({
          url: pdf.url,
          name: pdf.originalName,
          publicId: pdf.publicId, // Add publicId for deletion
          isExisting: true,
        })) || [],
    });
    setShowForm(true);
  };

  const handleDelete = async (propertyId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this property? This action cannot be undone."
      )
    ) {
      try {
        await WalletPropertyAPI.deleteWalletProperty(propertyId);
        setSuccess("Property deleted successfully!");
        await fetchProperties();
      } catch (err) {
        setError(err.message);
        console.error("Error deleting wallet property:", err);
      }
    }
  };

  const handlePageChange = (newPage) => {
    fetchProperties(newPage, searchTerm);
  };

  const resetForm = () => {
    setForm(initialFormState);
    setEditingProperty(null);
    setShowForm(false);
    setError("");
    setSuccess("");
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gray-200 min-h-screen rounded-md">
      <h1 className="text-lg text-gray-700 font-bold mb-1">{config.title}</h1>
      <div className="h-[1px] w-[30%] md:w-[20%] bg-gray-600 mb-5 mx-auto"></div>

      <div className="flex flex-col justify-end items-end gap-5 pb-6">
        <button
          onClick={() =>
            (window.location.href = "https://drive.google.com/drive/home")
          }
          className="px-4 py-2 text-sm border-2 border-gray-800 rounded-md hover:text-gray-800 shadow-2xl bg-gray-800 hover:bg-transparent text-white transition-all"
        >
          {config.driveLabel}
        </button>

        <button
          onClick={() =>
            (window.location.href = "https://docs.google.com/spreadsheets/u/0/")
          }
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
          <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
          {success}
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
          className="bg-gray-700 text-white px-4 py-2 rounded-xl hover:bg-gray-600 flex items-center gap-2 transition-all"
          onClick={() => {
            if (showForm) {
              resetForm();
            } else {
              setShowForm(true);
            }
          }}
        >
          {showForm ? "Close Form" : "Add Property"}
        </button>
      </div>

      {showForm && (
        <div className="p-6 bg-white border shadow-lg mb-10 rounded-xl">
          <h2 className="text-3xl font-bold mb-6 text-gray-700">
            {editingProperty
              ? "Edit Property Details"
              : "Upload Property Details"}
          </h2>

          <div className="flex items-center justify-center gap-2 flex-wrap">
            {[
              {
                label: "--Select file Type --",
                options: [
                  "Title Clear Lands",
                  "Dispute Lands",
                  "Govt. Dispute Lands",
                  "FP / NA",
                  "Others",
                ],
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
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, [key]: e.target.value }))
                }
                className="block w-[250px] rounded-xl border border-gray-300 bg-white p-3 text-gray-700 shadow-sm focus:border-gray-500 focus:outline-none"
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
                />
              ))}
            </div>

            <textarea
              placeholder="Notes"
              rows={3}
              className="w-full px-4 py-2 border border-gray-500 rounded-lg shadow-sm focus:border-gray-700 focus:outline-none"
              value={form.notes}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, notes: e.target.value }))
              }
            />

            <input
              type="text"
              placeholder="Google Map Embed Link"
              className="w-full px-4 py-2 border border-gray-500 rounded-lg shadow-sm focus:border-gray-700 focus:outline-none"
              value={form.mapLink}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, mapLink: e.target.value }))
              }
            />

            <div>
              <label className="block font-medium mb-2 text-gray-600">
                Upload Property Images
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="w-full px-3 py-2 border border-gray-500 rounded-lg shadow-sm focus:border-gray-700 focus:outline-none"
              />
              <div className="flex flex-wrap gap-4 mt-4">
                {form.images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative w-32 h-32 rounded-xl overflow-hidden border shadow"
                  >
                    <img
                      src={img.url || "/placeholder.svg"}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      disabled={deletingFiles.has(`image-${idx}`)}
                      className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-red-50 disabled:opacity-50"
                    >
                      {deletingFiles.has(`image-${idx}`) ? (
                        <Loader2 className="animate-spin" size={16} />
                      ) : (
                        <X size={16} />
                      )}
                    </button>
                    {img.isExisting && (
                      <div className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-1 rounded">
                        Saved
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-medium mb-2 mt-4 text-gray-600">
                Upload PDFs
              </label>
              <input
                type="file"
                accept=".pdf"
                multiple
                onChange={handlePdfUpload}
                className="w-full px-3 py-2 border border-gray-500 rounded-lg shadow-sm focus:border-gray-700 focus:outline-none"
              />
              <div className="flex flex-col gap-2 mt-4">
                {form.pdfs.map((pdf, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center px-3 py-2 border rounded-xl bg-gray-100"
                  >
                    <span className="truncate flex items-center gap-2">
                      {pdf.name}
                      {pdf.isExisting && (
                        <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">
                          Saved
                        </span>
                      )}
                    </span>
                    <button
                      type="button"
                      onClick={() => removePdf(idx)}
                      disabled={deletingFiles.has(`pdf-${idx}`)}
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
                disabled={submitLoading}
                className="bg-gray-600 text-white px-6 py-3 rounded-xl hover:bg-gray-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitLoading && (
                  <Loader2 className="animate-spin" size={16} />
                )}
                {editingProperty ? "Update Property" : "Submit Property"}
              </button>

              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-300 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-400 transition-all"
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
                onClick={() =>
                  setExpandedIndex(expandedIndex === idx ? null : idx)
                }
              >
                <div>
                  <h3 className="font-bold text-lg text-gray-800">
                    {property.personWhoShared}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {property.contactNumber}
                  </p>
                  <p className="text-xs text-gray-500">
                    {property.fileType} • {property.landType} •{" "}
                    {property.tenure}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(property);
                    }}
                    className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-50 transition-all"
                    title="Edit Property"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(property._id);
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

                  {property.images && property.images.length > 0 && (
                    <div className="mb-4">
                      <strong className="text-sm">Images:</strong>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                        {property.images.map((img, i) => (
                          <img
                            key={i}
                            src={img.url || "/placeholder.svg"}
                            alt="Property"
                            className="w-full h-32 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => window.open(img.url, "_blank")}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {property.pdfs && property.pdfs.length > 0 && (
                    <div className="mt-2 text-sm text-gray-800">
                      <strong>PDFs:</strong>
                      <ul className="list-disc list-inside mt-1">
                        {property.pdfs.map((pdf, i) => (
                          <li key={i}>
                            <a
                              href={pdf.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 underline hover:text-blue-800"
                            >
                              {pdf.originalName}
                            </a>
                          </li>
                        ))}
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
                          <strong>Nearby Landmark:</strong>{" "}
                          {property.nearByLandmark}
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
                {searchTerm
                  ? "Try adjusting your search terms."
                  : "Start by adding your first property."}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default WalletProperty;
