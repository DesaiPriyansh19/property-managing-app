"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import PropertyAPI from "../services/PropertyApi";

const AddProperty = () => {
  const navigate = useNavigate();
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
  });

  const [images, setImages] = useState([]);
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
  ];

  // Handle input changes
  const handleInputChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  // Handle dropdown changes
  const handleSelectChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (error) setError("");
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      name: file.name,
    }));
    setImages((prev) => [...prev, ...newImages]);
  };

  const handlePdfUpload = (e) => {
    const files = Array.from(e.target.files);
    const newPdfs = files.map((file) => ({
      file,
      name: file.name,
      url: URL.createObjectURL(file),
    }));
    setPdfs((prev) => [...prev, ...newPdfs]);
  };

  const removeImage = (index) => {
    const updated = [...images];
    // Revoke object URL to prevent memory leaks
    if (updated[index].url.startsWith("blob:")) {
      URL.revokeObjectURL(updated[index].url);
    }
    updated.splice(index, 1);
    setImages(updated);
  };

  const removePdf = (index) => {
    const updated = [...pdfs];
    // Revoke object URL to prevent memory leaks
    if (updated[index].url.startsWith("blob:")) {
      URL.revokeObjectURL(updated[index].url);
    }
    updated.splice(index, 1);
    setPdfs(updated);
  };

  // Form validation
  const validateForm = () => {
    if (!formData.fileType) {
      setError("Please select a file type");
      return false;
    }
    if (!formData.landType) {
      setError("Please select a land type");
      return false;
    }
    if (!formData.tenure) {
      setError("Please select a tenure");
      return false;
    }
    if (!formData.personWhoShared.trim()) {
      setError("Person who shared is required");
      return false;
    }
    if (!formData.contactNumber.trim()) {
      setError("Contact number is required");
      return false;
    }

    // Validate contact number format (basic validation)
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(formData.contactNumber.replace(/\s+/g, ""))) {
      setError("Please enter a valid contact number");
      return false;
    }

    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Prepare data for API
      const propertyData = {
        ...formData,
        images,
        pdfs,
      };

      const response = await PropertyAPI.createProperty(propertyData);

      setSuccess("Property added successfully!");

      // Reset form after successful submission
      setTimeout(() => {
        navigate("/home");
      }, 2000);
    } catch (err) {
      setError(err.message || "Failed to add property. Please try again.");
      console.error("Error adding property:", err);
    } finally {
      setLoading(false);
    }
  };

  // Clear messages after 5 seconds
  useState(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError("");
        setSuccess("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gray-200 border shadow-lg rounded-xl">
      <h2 className="text-3xl font-bold mb-6 text-gray-700">
        Upload Property Details
      </h2>

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

      {/* Dropdown Selects */}
      <div className="flex items-center justify-center gap-2 w-full flex-wrap">
        <div className="w-full sm:w-[50%] max-w-xs my-3">
          <select
            value={formData.fileType}
            onChange={(e) => handleSelectChange("fileType", e.target.value)}
            className="block w-full rounded-xl border border-gray-300 bg-white p-3 text-gray-700 shadow-sm focus:border-gray-500 focus:ring focus:ring-gray-200 focus:outline-none"
            required
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
          >
            <option value="">-- Select Tenure--</option>
            <option value="Old Tenure">Old Tenure</option>
            <option value="New Tenure">New Tenure</option>
            <option value="Premium">Premium</option>
          </select>
        </div>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* 2-Column Grid Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {inputFields.map((field) => (
            <input
              key={field.key}
              type={field.type || "text"}
              placeholder={field.placeholder}
              value={formData[field.key]}
              onChange={(e) => handleInputChange(field.key, e.target.value)}
              className="w-full px-4 py-2 border border-gray-500 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-600 bg-white text-gray-700"
              required={field.required}
              aria-label={field.placeholder}
            />
          ))}
        </div>

        {/* Notes and Map Link */}
        <textarea
          placeholder="Notes"
          rows={3}
          value={formData.notes}
          onChange={(e) => handleInputChange("notes", e.target.value)}
          className="w-full px-4 py-2 border border-gray-500 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-600 bg-white text-gray-700"
          aria-label="Notes"
        />

        <input
          type="url"
          placeholder="Google Map Embed Link"
          value={formData.mapLink}
          onChange={(e) => handleInputChange("mapLink", e.target.value)}
          className="w-full px-4 py-2 border border-gray-500 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-600 bg-white text-gray-700"
          aria-label="Google Map Embed Link"
        />

        {/* Image Upload */}
        <div>
          <label className="font-medium block mb-2 text-gray-600">
            Upload Property Images
            {images.length > 0 && (
              <span className="text-sm text-gray-500 ml-2">
                ({images.length} selected)
              </span>
            )}
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="w-full px-3 py-2 border border-gray-500 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-600"
            aria-label="Upload Property Images"
          />
          <div className="flex flex-wrap gap-4 mt-4">
            {images.map((img, idx) => (
              <div
                key={idx}
                className="relative w-32 h-32 rounded-xl overflow-hidden border shadow hover:shadow-lg transition-shadow"
              >
                <img
                  src={img.url || "/placeholder.svg"}
                  alt={`Property Image ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-red-50 transition-colors"
                  onClick={() => removeImage(idx)}
                  aria-label="Remove Image"
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
            {pdfs.length > 0 && (
              <span className="text-sm text-gray-500 ml-2">
                ({pdfs.length} selected)
              </span>
            )}
          </label>
          <input
            type="file"
            accept=".pdf"
            multiple
            onChange={handlePdfUpload}
            className="w-full px-3 py-2 border border-gray-500 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-600"
            aria-label="Upload PDFs"
          />
          <div className="flex flex-col gap-2 mt-4">
            {pdfs.map((pdf, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between border rounded-xl px-3 py-2 bg-gray-100 hover:bg-gray-50 transition-colors"
              >
                <span className="truncate text-sm text-gray-700">
                  {pdf.name}
                </span>
                <button
                  type="button"
                  className="text-red-500 hover:text-red-700 p-1 rounded transition-colors"
                  onClick={() => removePdf(idx)}
                  aria-label="Remove PDF"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="border-2 border-gray-600 bg-gray-600 text-white py-3 px-6 rounded-xl hover:bg-white hover:text-gray-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading && <Loader2 className="animate-spin" size={16} />}
            {loading ? "Submitting..." : "Submit Property"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/home")}
            className="text-gray-600 border-2 border-gray-600 rounded-xl px-6 py-3 hover:bg-gray-600 hover:text-white transition-all"
          >
            Cancel
          </button>
        </div>
      </form>

      <button
        onClick={() => navigate("/home")}
        className="mt-6 text-gray-600 border-2 border-gray-600 rounded-md px-4 py-2 hover:bg-gray-600 hover:text-white transition-all"
      >
        ← Back
      </button>
    </div>
  );
};

export default AddProperty;
