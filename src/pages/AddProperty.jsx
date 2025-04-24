import { useNavigate } from "react-router-dom";

const AddProperty = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Handle form data
    alert("Form submitted!");
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-green-700">Add New Property</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Person Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="Person Name" className="border p-2 rounded w-full" />
          <input type="text" placeholder="Contact Number" className="border p-2 rounded w-full" />
        </div>

        {/* Property Location Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input type="text" placeholder="Village" className="border p-2 rounded w-full" />
          <input type="text" placeholder="District" className="border p-2 rounded w-full" />
          <input type="text" placeholder="Tehsil" className="border p-2 rounded w-full" />
        </div>

        {/* Survey Numbers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="SerNo (Old)" className="border p-2 rounded w-full" />
          <input type="text" placeholder="SerNo (New)" className="border p-2 rounded w-full" />
        </div>

        {/* Area and Rate */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="Area (e.g., in Bigha, Sq ft)" className="border p-2 rounded w-full" />
          <input type="text" placeholder="Rate (e.g., Rs per Bigha)" className="border p-2 rounded w-full" />
        </div>

        {/* Upload PDF and Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Upload PDF</label>
            <input type="file" accept=".pdf" className="border p-2 rounded w-full" />
          </div>
          <div>
            <label className="block mb-1 font-medium">Upload Images</label>
            <input type="file" accept="image/*" multiple className="border p-2 rounded w-full" />
          </div>
        </div>

        {/* Notes */}
        <textarea
          placeholder="Additional Notes"
          className="w-full border p-2 rounded h-28 resize-none"
        ></textarea>

        {/* Google Map Embed Link */}
        <input
          type="text"
          placeholder="Embed Location Link (Google Maps)"
          className="w-full border p-2 rounded"
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          Submit
        </button>
      </form>

      <button
        onClick={() => navigate("/home")}
        className="mt-6 text-green-700 underline block"
      >
        ← Back to Home
      </button>
    </div>
  );
};

export default AddProperty;
