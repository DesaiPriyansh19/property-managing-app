import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const mockProperties = [
  {
    id: "1",
    title: "Luxury Villa in Ahmedabad",
    price: "Rs 85,00,000",
    type: "Sale",
    location: "SG Highway, Ahmedabad",
    description: "5 BHK villa with garden, pool, and private parking.",
  },
  {
    id: "2",
    title: "2BHK Flat for Rent",
    price: "Rs 20,000/month",
    type: "Rent",
    location: "Satellite, Ahmedabad",
    description: "Fully furnished flat in a gated society.",
  },
];

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);

  useEffect(() => {
    const found = mockProperties.find((p) => p.id === id);
    setProperty(found);
  }, [id]);

  if (!property) return <p className="p-6">Loading...</p>;

  const message = `🏡 *${property.title}*\n📍 ${property.location}\n💰 ${property.price}\n📌 ${property.description}`;

  const shareLink = `https://wa.me/?text=${encodeURIComponent(message)}`;

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white shadow-md rounded-xl mt-8">
      <h2 className="text-2xl font-bold mb-4 text-green-700">{property.title}</h2>
      <p className="mb-2"><strong>Location:</strong> {property.location}</p>
      <p className="mb-2"><strong>Type:</strong> {property.type}</p>
      <p className="mb-2"><strong>Price:</strong> {property.price}</p>
      <p className="mb-4"><strong>Description:</strong> {property.description}</p>

      <a
        href={shareLink}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
      >
        📤 Share on WhatsApp
      </a>
    </div>
  );
};

export default PropertyDetails;
