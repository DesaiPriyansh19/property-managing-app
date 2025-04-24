import { useNavigate } from "react-router-dom";

const PropertyCard = ({ property, onClick }) => {
  if (!property) return null; // Prevent crash if property is undefined

  return (
    <div
      onClick={onClick}
      className="bg-white p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition"
    >
      <h3 className="text-xl font-semibold">{property.title}</h3>
      <p>{property.location}</p>
      <p className="text-green-600">{property.price}</p>
    </div>
  );
};

export default PropertyCard;
