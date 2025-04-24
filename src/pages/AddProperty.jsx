import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

const AddProperty = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [pdfs, setPdfs] = useState([]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages]);
  };

  const handlePdfUpload = (e) => {
    const files = Array.from(e.target.files);
    const newPdfs = files.map((file) => ({
      file,
      name: file.name,
    }));
    setPdfs((prev) => [...prev, ...newPdfs]);
  };

  const removeImage = (index) => {
    const updated = [...images];
    updated.splice(index, 1);
    setImages(updated);
  };

  const removePdf = (index) => {
    const updated = [...pdfs];
    updated.splice(index, 1);
    setPdfs(updated);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white border rounded-2xl shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-green-700">
        Upload Property Details
      </h2>

      <form className="space-y-6">
        {/* 2-Column Grid Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "Person Who Shared",
            "Contact Number",
            "Village",
            "District",
            "Tehsil",
            "SerNo (Old)",
            "SerNo (New)",
            "Area",
            "Rate (₹)",
          ].map((placeholder, i) => (
            <input
              key={i}
              type="text"
              placeholder={placeholder}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          ))}
        </div>

        {/* Notes and Map Link */}
        <textarea
          placeholder="Notes"
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <input
          type="text"
          placeholder="Google Map Embed Link"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        {/* Image Upload */}
        <div>
          <label className="font-medium block mb-2">Upload Property Images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm"
          />
          <div className="flex flex-wrap gap-4 mt-4">
            {images.map((img, idx) => (
              <div
                key={idx}
                className="relative w-32 h-32 rounded-xl overflow-hidden border shadow"
              >
                <img
                  src={img.url}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  className="absolute top-1 right-1 bg-white rounded-full p-1 shadow"
                  onClick={() => removeImage(idx)}
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* PDF Upload */}
        <div>
          <label className="font-medium block mb-2 mt-4">Upload PDFs</label>
          <input
            type="file"
            accept=".pdf"
            multiple
            onChange={handlePdfUpload}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm"
          />
          <div className="flex flex-col gap-2 mt-4">
            {pdfs.map((pdf, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between border rounded-xl px-3 py-2 bg-gray-100"
              >
                <span className="truncate text-sm">{pdf.name}</span>
                <button
                  type="button"
                  className="text-red-500"
                  onClick={() => removePdf(idx)}
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-green-600 text-white py-3 px-6 rounded-xl hover:bg-green-700 transition-all mt-4"
        >
          Submit
        </button>
      </form>

      <button
        onClick={() => navigate("/home")}
        className="mt-6 text-green-600 underline text-sm"
      >
        ← Back to Home
      </button>
    </div>
  );
};

export default AddProperty;
