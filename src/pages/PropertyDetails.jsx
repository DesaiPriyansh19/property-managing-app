import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  FaMapMarkerAlt,
  FaFilePdf,
  FaImages,
  FaPhone,
  FaMapMarkedAlt,
  FaShareAlt,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

const mockProperties = [
  {
    id: "1",
    title: "Title Clear Lands - Agriculture",
    fileType: "Title Clear Lands",
    landType: "Agriculture",
    tenure: "Old Tenure",
    personWhoShared: "Ramesh Patel",
    contactNumber: "9876543210",
    village: "Satva",
    taluko: "Daskroi",
    district: "Ahmedabad",
    serNoNew: "12345",
    serNoOld: "54321",
    fpNo: "6789",
    tp: "345",
    zone: "Zone A",
    srArea: "10 Acres",
    fpArea: "8 Acres",
    srRate: "₹5000",
    fpRate: "₹4800",
    mtrRoad: "Yes",
    nearby: "Near Main Market",
    notes: "Land is well maintained, suitable for farming.",
    googleMapLink: "https://maps.google.com/?q=23.0225,72.5714&output=embed",
    images: [
      "https://images.unsplash.com/photo-1600585154194-c6a5b55cc7b1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1560448074-cd48dbd4a691?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    ],
    pdfs: [
      { name: "Document1.pdf", url: "#" },
      { name: "SurveyPlan.pdf", url: "#" },
    ],
  },
];

const InfoCard = ({ title, children }) => (
  <div className="bg-gray-200 p-5 rounded-lg shadow-md border border-gray-200">
    <h4 className="text-lg font-semibold mb-3 text-gray-700 border-b border-gray-300 pb-1">{title}</h4>
    <div className="text-gray-700 space-y-2">{children}</div>
  </div>
);

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [currentImgIdx, setCurrentImgIdx] = useState(0);

  useEffect(() => {
    const found = mockProperties.find((p) => p.id === id);
    setProperty(found);
  }, [id]);

  if (!property) return <p className="p-6 text-center text-gray-600">Loading...</p>;

  // Prepare WhatsApp share message without personWhoShared
  const shareMessage = `
🏡 ${property.title}
📂 File Type: ${property.fileType}
🌾 Land Type: ${property.landType}
📜 Tenure: ${property.tenure}
📞 Contact Number: ${property.contactNumber}
📍 Location: ${property.village}, ${property.taluko}, ${property.district}
🆔 SerNo (New): ${property.serNoNew}
🆔 SerNo (Old): ${property.serNoOld}
📄 FP.NO: ${property.fpNo}
🗺️ T P: ${property.tp}
🛣️ Zone: ${property.zone}
🌳 Sr.Area: ${property.srArea}
🌳 FP.Area: ${property.fpArea}
💰 SR.Rate (₹): ${property.srRate}
💰 FP.Rate (₹): ${property.fpRate}
🛣️ MTR Road: ${property.mtrRoad}
📌 Nearby: ${property.nearby}
📝 Notes: ${property.notes}
`;

  const shareLink = `https://wa.me/?text=${encodeURIComponent(shareMessage)}`;

  const prevImage = () => {
    setCurrentImgIdx((idx) => (idx === 0 ? property.images.length - 1 : idx - 1));
  };

  const nextImage = () => {
    setCurrentImgIdx((idx) => (idx === property.images.length - 1 ? 0 : idx + 1));
  };

  return (
    <div className="bg-gray-200 min-h-screen py-12 px-4">
      <div className="max-w-5xl mx-auto bg-gray-200 rounded-xl shadow-xl p-8">
        <h1 className="text-4xl font-extrabold text-gray-700 mb-8 border-b border-gray-300 pb-4">
          {property.title}
        </h1>

        {/* Info Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <InfoCard title="Land Details">
            <p><strong>File Type:</strong> {property.fileType}</p>
            <p><strong>Land Type:</strong> {property.landType}</p>
            <p><strong>Tenure:</strong> {property.tenure}</p>
            <p><strong>MTR Road:</strong> {property.mtrRoad}</p>
            <p><strong>Nearby:</strong> {property.nearby}</p>
          </InfoCard>

          <InfoCard title="Location & Contacts">
            <p><FaPhone className="inline mr-2 text-gray-700" /> <strong>Contact Number:</strong> {property.contactNumber}</p>
            <p><FaMapMarkerAlt className="inline mr-2 text-gray-700" /> <strong>Village:</strong> {property.village}</p>
            <p><strong>Taluko:</strong> {property.taluko}</p>
            <p><strong>District:</strong> {property.district}</p>
          </InfoCard>

          <InfoCard title="Registration Details">
            <p><strong>SerNo (New):</strong> {property.serNoNew}</p>
            <p><strong>SerNo (Old):</strong> {property.serNoOld}</p>
            <p><strong>FP.NO:</strong> {property.fpNo}</p>
            <p><strong>T P:</strong> {property.tp}</p>
            <p><strong>Zone:</strong> {property.zone}</p>
          </InfoCard>
        </div>

        {/* Area & Rates */}
        <InfoCard title="Area & Rates" className="mb-24">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <p><strong>Sr.Area:</strong> {property.srArea}</p>
            <p><strong>FP.Area:</strong> {property.fpArea}</p>
            <p><strong>SR.Rate (₹):</strong> {property.srRate}</p>
            <p><strong>FP.Rate (₹):</strong> {property.fpRate}</p>
          </div>
        </InfoCard>

        {/* Notes */}
        <InfoCard title="Notes" className="mb-8">
          <p className="whitespace-pre-line">{property.notes}</p>
        </InfoCard>

        {/* Google Map */}
        {property.googleMapLink && (
          <div className="mb-8 rounded-lg overflow-hidden shadow-lg border border-gray-200">
            <iframe
              src={property.googleMapLink}
              title="Google Map"
              width="100%"
              height="350"
              className="block"
              allowFullScreen
              loading="lazy"
              frameBorder="0"
            />
          </div>
        )}

        {/* Image Slider */}
        {property.images?.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4 flex items-center gap-3">
              <FaImages /> Property Images
            </h2>
            <div className="relative w-full max-w-3xl mx-auto rounded-lg overflow-hidden shadow-md border border-gray-200">
              <img
                src={property.images[currentImgIdx]}
                alt={`Property Image ${currentImgIdx + 1}`}
                className="w-full h-72 object-cover"
              />
              <button
                onClick={prevImage}
                aria-label="Previous Image"
                className="absolute top-1/2 left-2 -translate-y-1/2 bg-gray-200 bg-opacity-70 rounded-full p-2 hover:bg-opacity-100 transition"
              >
                <FaChevronLeft className="text-gray-700" size={24} />
              </button>
              <button
                onClick={nextImage}
                aria-label="Next Image"
                className="absolute top-1/2 right-2 -translate-y-1/2 bg-gray-200 bg-opacity-70 rounded-full p-2 hover:bg-opacity-100 transition"
              >
                <FaChevronRight className="text-gray-700" size={24} />
              </button>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2">
                {property.images.map((_, i) => (
                  <span
                    key={i}
                    onClick={() => setCurrentImgIdx(i)}
                    className={`w-3 h-3 rounded-full cursor-pointer ${
                      i === currentImgIdx ? "bg-[#7B3F00]" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PDFs */}
        {property.pdfs?.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-3 flex items-center gap-3">
              <FaFilePdf /> Property Documents
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              {property.pdfs.map((pdf, idx) => (
                <li key={idx}>
                  <a
                    href={pdf.url}
                    className="text-gray-700 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {pdf.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Share Button */}
        <a
          href={shareLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-green-900 text-white font-semibold rounded-lg hover:bg-green-800 transition shadow-md"
          aria-label="Share on WhatsApp"
        >
          <FaShareAlt className="text-xl" />
          Share on WhatsApp
        </a>
      </div>
    </div>
  );
};

export default PropertyDetails;
