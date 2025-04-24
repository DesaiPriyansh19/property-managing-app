import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PropertyCard from "../components/PropertyCard.jsx";
import companyLogo from "../../public/logo final PNG.png"; // Replace with your logo path

const Home = () => {
  const [showLogo, setShowLogo] = useState(true);
  const [startFadeOut, setStartFadeOut] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setStartFadeOut(true); // Start fade out
    }, 2000);

    const timer2 = setTimeout(() => {
      setShowLogo(false); // Then hide
    }, 2800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const properties = [
    {
      id: "1",
      title: "3BHK Flat in Ahmedabad",
      location: "Satellite",
      price: "Rs 50,00,000",
    },
    {
      id: "2",
      title: "Villa for Rent",
      location: "Thaltej",
      price: "Rs 35,000/month",
    },
  ];

  return (
    <>
      {showLogo ? (
        <div
          className={`h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-black to-black ${
            startFadeOut ? "fade-out" : ""
          }`}
        >
          <img
            src={companyLogo}
            alt="Company Logo"
            className="w-40 h-40 fade-zoom"
          />
          <h1 className="text-3xl font-bold mt-6 text-gray-200 fade-slide">
            Welcome to Millenuime Properties
          </h1>
        </div>
      ) : (
        <div className="p-4">
          {/* Top: Logo + Company Name */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <img src={companyLogo} alt="Logo" className="w-28 h-28" />
              <h1 className="text-3xl lg:text-5xl font-extralight text-start lg:mt-16">
                Millenuime Properties
              </h1>
            </div>
            <Link
              to="/add-property"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Add +
            </Link>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center mb-6">
            <input
              type="text"
              placeholder="Search properties..."
              className="flex-1 border p-2 rounded w-full"
            />

            <select className="border p-2 rounded w-full sm:w-auto">
              <option>Property Type</option>
              <option>Apartment</option>
              <option>Villa</option>
              <option>Plot</option>
            </select>

            <select className="border p-2 rounded w-full sm:w-auto">
              <option>Sale / Rent</option>
              <option>Sale</option>
              <option>Rent</option>
            </select>

            <select className="border p-2 rounded w-full sm:w-auto">
              <option>Location</option>
              <option>Ahmedabad</option>
              <option>Mumbai</option>
              <option>Delhi</option>
            </select>

            <select className="border p-2 rounded w-full sm:w-auto">
              <option>Price Range</option>
              <option>Below ₹20L</option>
              <option>₹20L - ₹50L</option>
              <option>₹50L - ₹1Cr</option>
            </select>
          </div>

          {/* Property Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {properties.map((property) => (
              <Link key={property.id} to={`/property/${property.id}`}>
                <PropertyCard property={property} />
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
