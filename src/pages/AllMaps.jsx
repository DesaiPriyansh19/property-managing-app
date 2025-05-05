import React, { useState } from "react";
import { FaUpload, FaEdit, FaTrash } from "react-icons/fa";
import { FiShare2 } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
const AllMaps = () => {
  const [imageFiles, setImageFiles] = useState([]);
  const [pdfFiles, setPdfFiles] = useState([]);
  const [area, setArea] = useState("");
  const [notes, setNotes] = useState("");
  const [uploadedData, setUploadedData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      id: Date.now() + Math.random(),
      file,
      url: URL.createObjectURL(file),
    }));
    setImageFiles((prev) => [...prev, ...newImages]);
  };

  const handlePdfChange = (e) => {
    const files = Array.from(e.target.files);
    const newPdfs = files.map((file) => ({
      id: Date.now() + Math.random(),
      file,
      url: URL.createObjectURL(file),
    }));
    setPdfFiles((prev) => [...prev, ...newPdfs]);
  };

  const removeFile = (type, id) => {
    if (type === "image") {
      setImageFiles(imageFiles.filter((f) => f.id !== id));
    } else {
      setPdfFiles(pdfFiles.filter((f) => f.id !== id));
    }
  };

  const handleSubmit = () => {
    const newUpload = { area, notes, images: imageFiles, pdfs: pdfFiles };

    if (editingIndex !== null) {
      const updatedData = [...uploadedData];
      updatedData[editingIndex] = newUpload;
      setUploadedData(updatedData);
      setEditingIndex(null);
    } else {
      setUploadedData([...uploadedData, newUpload]);
    }

    setArea("");
    setNotes("");
    setImageFiles([]);
    setPdfFiles([]);
    setShowForm(false);
  };

  const toggleForm = () => {
    setShowForm(!showForm);
    setEditingIndex(null);
    setArea("");
    setNotes("");
    setImageFiles([]);
    setPdfFiles([]);
  };

  const handleEdit = (index) => {
    const item = uploadedData[index];
    setEditingIndex(index);
    setArea(item.area);
    setNotes(item.notes);
    setImageFiles(item.images);
    setPdfFiles(item.pdfs);
    setShowForm(true);
  };

  const handleDelete = (index) => {
    const updated = [...uploadedData];
    updated.splice(index, 1);
    setUploadedData(updated);
  };

  const handleShare = (images, pdfs) => {
    const files = [...images.map((file) => file.url), ...pdfs.map((file) => file.url)];
    const message = `Check out these maps: ${files.join(", ")}`;
    const whatsappLink = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappLink, "_blank");
  };

  const filteredData = uploadedData.filter(
    (data) =>
      data.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
      data.notes.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col bg-[#fffaf3] p-6">
        {/* ✨ Animated Background Blobs */}
<div className="absolute top-[-80px] left-[-80px] w-72 h-72 bg-[#A0522D] rounded-full opacity-10 animate-blob2 z-0"></div>
<div className="absolute bottom-[-100px] right-[-100px] w-96 h-96 bg-[#7B3F00] rounded-full opacity-10 animate-blob2 z-0" style={{ animationDelay: '2s' }}></div>
<div className="absolute top-[30%] left-[60%] w-64 h-64 bg-[#CFA97E] rounded-full opacity-10 animate-blob2 z-0" style={{ animationDelay: '4s' }}></div>
<div className="absolute top-[10%] right-[10%] w-52 h-52 bg-[#5C4033] rounded-full opacity-20 animate-blob2 z-0" style={{ animationDelay: '1.5s' }}></div>
<div className="absolute bottom-[20%] left-[15%] w-40 h-40 bg-[#8B5E3C] rounded-full opacity-15 animate-blob2 z-0" style={{ animationDelay: '3s' }}></div>
<div className="absolute top-[70%] right-[25%] w-60 h-60 bg-[#D2B48C] rounded-full opacity-10 animate-blob2 z-0" style={{ animationDelay: '5s' }}></div>
<div className="absolute top-[45%] left-[5%] w-56 h-56 bg-[#EEE5DE] rounded-full opacity-10 animate-blob2 z-0" style={{ animationDelay: '6s' }}></div>
<div className="relative z-10">
      <h1 className="text-4xl font-bold text-center text-[#A0522D] mb-6">All Maps</h1>

      {/* Search Bar */}
      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Search by area or notes"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-2 border border-[#A0522D] rounded-2xl w-full sm:w-1/2 text-lg"
        />
      </div>

      {/* Upload Button */}
      <button
        onClick={toggleForm}
        className="bg-gradient-to-r from-[#7B3F00] to-[#A0522D] text-white py-2 px-4 rounded-full flex items-center gap-2 mx-auto mb-6"
      >
        <FaUpload /> {editingIndex !== null ? "Edit Map" : "Upload Maps"}
      </button>

      {/* Upload Form */}
    
<AnimatePresence>
  {showForm && (
    <motion.form
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      onSubmit={(e) => e.preventDefault()}
      className="bg-white p-6 rounded-lg shadow-md"
    >
          <div className="mb-4">
            <label className="block mb-2 font-medium">Area</label>
            <input
              type="text"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
              placeholder="Enter area name"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 font-medium">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
              placeholder="Enter notes"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 font-medium">Images</label>
            <input type="file" multiple accept="image/*" onChange={handleImageChange} />
          </div>

          <div className="flex gap-2 flex-wrap mb-4">
            {imageFiles.map((img) => (
              <div key={img.id} className="relative">
                <img src={img.url} className="h-20 w-20 rounded object-cover" />
                <button
                  onClick={() => removeFile("image", img.id)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="mb-4">
            <label className="block mb-2 font-medium">PDFs</label>
            <input type="file" multiple accept=".pdf" onChange={handlePdfChange} />
          </div>

          <div className="flex gap-2 flex-wrap mb-4">
            {pdfFiles.map((pdf) => (
              <div key={pdf.id} className="relative w-32 h-28">
                <embed src={pdf.url} className="w-full h-full rounded border" />
                <button
                  onClick={() => removeFile("pdf", pdf.id)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-green-600 text-white py-2 px-4 rounded-full"
            >
              {editingIndex !== null ? "Update" : "Upload"}
            </button>
            <button
              type="button"
              onClick={toggleForm}
              className="bg-gray-500 text-white py-2 px-4 rounded-full"
            >
              Cancel
            </button>
          </div>
          </motion.form>
  )}
</AnimatePresence>
      {/* Uploaded Data Cards */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-3 gap-6">
        {filteredData.map((data, index) => (
          <div key={index} className="bg-white border border-[#A0522D] p-4 rounded-2xl shadow-md">
            <h3 className="text-xl text-start font-semibold">Area: {data.area}</h3>
            <p className="mb-2 text-start">-- {data.notes}</p>

            <p className="font-bold">Images:</p>
            <div className="flex gap-2 flex-wrap mb-2">
              {data.images.map((img) => (
                <img
                  key={img.id}
                  src={img.url}
                  className="h-20 w-20 rounded object-cover"
                  alt="Uploaded"
                />
              ))}
            </div>

            <p className="font-bold">PDFs:</p>
            <div className="flex gap-2 flex-wrap mb-4">
              {data.pdfs.map((pdf) => (
                <embed key={pdf.id} src={pdf.url} className="w-32 h-28 rounded border" />
              ))}
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => handleShare(data.images, data.pdfs)}
                className="bg-yellow-500 text-white py-1 px-3 rounded-full flex items-center gap-2"
              >
                <FiShare2 /> Share
              </button>
              <button
                onClick={() => handleEdit(index)}
                className="bg-blue-500 text-white py-1 px-3 rounded-full flex items-center gap-2"
              >
                <FaEdit /> Edit
              </button>
              <button
                onClick={() => handleDelete(index)}
                className="bg-red-600 text-white py-1 px-3 rounded-full flex items-center gap-2"
              >
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
};

export default AllMaps;
