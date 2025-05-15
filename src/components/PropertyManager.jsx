import React, { useState } from "react";
import { X } from "lucide-react";

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

const PropertyManager = () => {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialFormState);
  const [properties, setProperties] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedIndex, setExpandedIndex] = useState(null);

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

  const removeImage = (index) => {
    const updated = [...form.images];
    updated.splice(index, 1);
    setForm((prev) => ({ ...prev, images: updated }));
  };

  const removePdf = (index) => {
    const updated = [...form.pdfs];
    updated.splice(index, 1);
    setForm((prev) => ({ ...prev, pdfs: updated }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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
      alert("Form cannot be submitted empty.");
      return;
    }

    const requiredFilled =
      form.fileType && form.landType && form.tenure && form.fields[0] && form.fields[1];

    if (!requiredFilled) {
      alert("Please fill all required fields.");
      return;
    }

    setProperties([...properties, form]);
    setForm(initialFormState);
    setShowForm(false);
  };

  const filteredProperties = properties.filter((prop) =>
    prop.fields[0]?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Search by person who shared..."
          className="px-4 py-2 border rounded-xl w-1/2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className="bg-gray-700 text-white px-4 py-2 rounded-xl hover:bg-gray-600"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Close Form" : "Add Property"}
        </button>
      </div>

      {showForm && (
        <div className="p-6 bg-gray-200 border shadow-lg mb-10">
          <h2 className="text-3xl font-bold mb-6 text-gray-700">Upload Property Details</h2>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {[
              {
                label: "--Select file Type --",
                options: ["Title Clear Lands", "Dispute Lands", "Govt. Dispute Lands", "FP / NA", "Others"],
                key: "fileType",
              },
              {
                label: "-- Select Land Type --",
                options: ["Agriculutre", "None Agriculture"],
                key: "landType",
              },
              {
                label: "-- Select Tenure--",
                options: ["Old Tenure", "New Tenure", "Premume"],
                key: "tenure",
              },
            ].map(({ label, options, key }) => (
              <select
                key={key}
                value={form[key]}
                onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
                className="block w-[250px] rounded-xl border border-gray-300 bg-white p-3 text-gray-700 shadow-sm"
              >
                <option value="">{label}</option>
                {options.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            ))}
          </div>

          <form className="space-y-6 mt-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["Person Who Shared", "Contact Number", "Village", "Taluko", "District", "SerNo (New)", "SerNo (Old)", "FP.NO", "T P", "Zone", "Sr.Area", "FP.Area", "SR.Rate (₹)", "FP.Rate (₹)", "MTR.Road", "NearBy(land mark)"].map((placeholder, i) => (
                <input
                  key={i}
                  type="text"
                  placeholder={placeholder}
                  className="w-full px-4 py-2 border border-gray-500 rounded-lg shadow-sm"
                  value={form.fields[i]}
                  onChange={(e) => handleInputChange(i, e.target.value)}
                />
              ))}
            </div>

            <textarea
              placeholder="Notes"
              rows={3}
              className="w-full px-4 py-2 border border-gray-500 rounded-lg shadow-sm"
              value={form.notes}
              onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
            />
            <input
              type="text"
              placeholder="Google Map Embed Link"
              className="w-full px-4 py-2 border border-gray-500 rounded-lg shadow-sm"
              value={form.mapLink}
              onChange={(e) => setForm((prev) => ({ ...prev, mapLink: e.target.value }))}
            />

            <div>
              <label className="block font-medium mb-2 text-gray-600">Upload Property Images</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="w-full px-3 py-2 border border-gray-500 rounded-lg shadow-sm"
              />
              <div className="flex flex-wrap gap-4 mt-4">
                {form.images.map((img, idx) => (
                  <div key={idx} className="relative w-32 h-32 rounded-xl overflow-hidden border shadow">
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 bg-white rounded-full p-1 shadow"
                    >
                      <X size={16} />
                    </button>
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
                className="w-full px-3 py-2 border border-gray-500 rounded-lg shadow-sm"
              />
              <div className="flex flex-col gap-2 mt-4">
                {form.pdfs.map((pdf, idx) => (
                  <div key={idx} className="flex justify-between items-center px-3 py-2 border rounded-xl bg-gray-100">
                    <span>{pdf.name}</span>
                    <button
                      type="button"
                      onClick={() => removePdf(idx)}
                      className="text-red-500"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="bg-gray-600 text-white px-6 py-3 rounded-xl hover:bg-white hover:text-gray-600 hover:border hover:border-gray-600 transition-all mt-4"
            >
              Submit
            </button>
          </form>
        </div>
      )}

      {filteredProperties.map((property, idx) => (
        <div key={idx} className="bg-white p-4 mb-4 border rounded-xl shadow transition-all">
          <div
            className="cursor-pointer flex justify-between items-center"
            onClick={() => setExpandedIndex(expandedIndex === idx ? null : idx)}
          >
            <div>
              <h3 className="font-bold text-lg text-gray-800">{property.fields[0]}</h3>
              <p className="text-sm text-gray-600">{property.fields[1]}</p>
            </div>
            <button className="text-blue-500 text-sm underline">
              {expandedIndex === idx ? "Hide Details" : "View Details"}
            </button>
          </div>

          {expandedIndex === idx && (
            <div className="mt-4 border-t pt-4">
              <p className="text-sm mb-2 text-gray-800">{property.notes}</p>
              <p className="text-sm mb-2 text-blue-600">{property.mapLink}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                {property.images.map((img, i) => (
                  <img key={i} src={img.url} alt="Property" className="w-full h-32 object-cover rounded" />
                ))}
              </div>
              {property.pdfs.length > 0 && (
                <div className="mt-2 text-sm text-gray-800">
                  <strong>PDFs:</strong>
                  <ul className="list-disc list-inside">
                    {property.pdfs.map((pdf, i) => (
                      <li key={i}>
                        <a href={pdf.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                          {pdf.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="mt-4 text-sm text-gray-700">
                <strong>Details:</strong>
                <ul className="list-disc list-inside grid grid-cols-2 gap-1">
                  {property.fields.map((f, i) => (
                    f && <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PropertyManager;
