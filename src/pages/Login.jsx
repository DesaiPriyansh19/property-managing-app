import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

const AddProperty = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [pdfs, setPdfs] = useState([]);

  const handleImageUpload = useCallback((e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      file,
      url: URL.createObjectURL(file),
      id: Date.now() + Math.random().toString(36).substr(2, 9)
    }));
    setImages(prev => [...prev, ...newImages]);
  }, []);

  const handlePdfUpload = useCallback((e) => {
    const files = Array.from(e.target.files);
    const newPdfs = files.map(file => ({
      file,
      name: file.name,
      id: Date.now() + Math.random().toString(36).substr(2, 9)
    }));
    setPdfs(prev => [...prev, ...newPdfs]);
  }, []);

  const removeImage = useCallback((id) => {
    setImages(prev => prev.filter(img => {
      if (img.id === id) {
        URL.revokeObjectURL(img.url); // Clean up memory
        return false;
      }
      return true;
    }));
  }, []);

  const removePdf = useCallback((id) => {
    setPdfs(prev => prev.filter(pdf => pdf.id !== id));
  }, []);

  return (
    <div className="p-8 max-w-4xl mx-auto bg-white border rounded-2xl shadow-lg">
      <h2 className="text-4xl font-semibold mb-6 text-green-800">Upload Property Details</h2>
      <form className="space-y-6">

        {/* Two-column grid layout for large screens */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Each input field with a label */}
          {[
            { label: "Person Who Shared", placeholder: "Enter person who shared" },
            { label: "Contact Number", placeholder: "Enter contact number" },
            { label: "Village", placeholder: "Enter village" },
            { label: "District", placeholder: "Enter district" },
            { label: "Tehsil", placeholder: "Enter tehsil" },
            { label: "SerNo (Old)", placeholder: "Enter old serial number" },
            { label: "SerNo (New)", placeholder: "Enter new serial number" },
            { label: "Area", placeholder: "Enter area" },
            { label: "Rate (₹)", placeholder: "Enter rate in ₹" },
          ].map((field, i) => (
            <div key={i}>
              <label htmlFor={field.label} className="block text-gray-700 font-semibold mb-2">{field.label}</label>
              <input 
                id={field.label} 
                type="text" 
                placeholder={field.placeholder} 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          ))}
        </div>

        {/* Notes Section */}
        <div>
          <label htmlFor="notes" className="block text-gray-700 font-semibold mb-2">Notes</label>
          <textarea 
            id="notes"
            placeholder="Enter any additional notes" 
            rows={4} 
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Google Map Embed Link */}
        <div>
          <label htmlFor="mapLink" className="block text-gray-700 font-semibold mb-2">Google Map Embed Link</label>
          <input 
            id="mapLink"
            type="text" 
            placeholder="Enter Google map embed link" 
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Image Upload */}
        <div className="space-y-4">
          <label className="font-semibold text-lg text-gray-700">Upload Property Images (Multiple)</label>
          <label className="flex flex-col items-center px-6 py-8 bg-white border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition-all">
            <span className="text-base text-gray-600">Click to select images or drag and drop</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
          <div className="flex flex-wrap gap-4 mt-4">
            {images.map((img) => (
              <div key={img.id} className="relative w-32 h-32 rounded-xl overflow-hidden border group shadow-md">
                <img 
                  src={img.url} 
                  alt="preview" 
                  className="w-full h-full object-cover rounded-xl" 
                />
                <button
                  type="button"
                  className="absolute top-2 right-2 bg-white rounded-full p-1 shadow opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeImage(img.id)}
                >
                  <X size={18} className="text-red-600" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs p-2 truncate">{img.file.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* PDF Upload */}
        <div className="space-y-4">
          <label className="font-semibold text-lg text-gray-700">Upload PDFs (Multiple)</label>
          <label className="flex flex-col items-center px-6 py-8 bg-white border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition-all">
            <span className="text-base text-gray-600">Click to select PDFs or drag and drop</span>
            <input
              type="file"
              accept=".pdf"
              multiple
              onChange={handlePdfUpload}
              className="hidden"
            />
          </label>
          <div className="flex flex-col gap-3 mt-4">
            {pdfs.map((pdf) => (
              <div key={pdf.id} className="flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 border rounded-xl shadow-md">
                <div className="flex items-center min-w-0">
                  <span className="material-icons-outlined text-red-500 mr-3">picture_as_pdf</span>
                  <span className="truncate text-sm text-gray-700">{pdf.name}</span>
                </div>
                <button
                  type="button"
                  className="text-red-600 hover:text-red-700"
                  onClick={() => removePdf(pdf.id)}
                >
                  <X size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 px-6 rounded-xl hover:bg-green-700 transition-all font-semibold"
        >
          Submit Property
        </button>
      </form>

      <button
        onClick={() => navigate("/home")}
        className="mt-6 text-green-600 hover:text-green-800 underline text-sm flex items-center"
      >
        <X size={16} className="mr-1" /> Back to Home
      </button>
    </div>
  );
};

export default AddProperty;
