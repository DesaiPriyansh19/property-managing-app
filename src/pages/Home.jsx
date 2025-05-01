import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PropertyCard from "../components/PropertyCard.jsx";
import companyLogo from "../../public/logo final PNG.png";

const Home = () => {
  const [showLogo, setShowLogo] = useState(false);
  const [startFadeOut, setStartFadeOut] = useState(false);

  useEffect(() => {
    const hasSeenLogo = localStorage.getItem("hasSeenLogo");

    if (!hasSeenLogo) {
      setShowLogo(true);
      localStorage.setItem("hasSeenLogo", "true");

      const timer1 = setTimeout(() => {
        setStartFadeOut(true); // Start fade-out effect after 2 seconds
      }, 2000);

      const timer2 = setTimeout(() => {
        setShowLogo(false); // Hide logo after 3 seconds
      }, 2800);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, []);

  const properties = [
    {
      id: "1",
      title: "dabhoda dakho Land ",
      location: "Satellite",
      price: "Rs 50,00,000",
    },
    {
      id: "2",
      title: "Thaltej plot",
      location: "Thaltej",
      price: "Rs 35,000/month",
    },
    {
      id: "3",
      title: "sabarmati big land",
      location: "Thaltej",
      price: "Rs 35,000/month",
    },
    {
      id: "3",
      title: "Thaltej agriculture",
      location: "Thaltej",
      price: "Rs 35,000/month",
    },
  ];

  return (
    <>
      {showLogo ? (
        <div
          className={`h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-black to-black transition-opacity duration-1000 ${
            startFadeOut ? "opacity-0" : "opacity-100"
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
        <div className="p-8 bg-[#fffaf3] min-h-screen font-sans text-gray-900">
        {/* Floating Header */}
        <div className="flex flex-col lg:flex-row justify-between items-center mb-16">
          <div className="flex items-center gap-5 mb-6 lg:mb-0">
            <div className="p-1.5 bg-gradient-to-br from-[#7B3F00] to-[#A0522D] rounded-2xl shadow-2xl animate-float">
              <img 
                src={companyLogo} 
                alt="Logo" 
                className="w-16 h-16 rounded-xl border-4 border-white/20 bg-white/10 backdrop-blur-sm" 
              />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              <span className="block">RD Revenue</span>
              <span className="bg-gradient-to-r from-[#7B3F00] to-[#A0522D] bg-clip-text text-transparent">
                Legal Consulting
              </span>
            </h1>
          </div>
          <Link
            to="/add-property"
            className="relative overflow-hidden bg-white border border-[#D0B49F] rounded-xl shadow-md px-8 py-3.5 font-semibold text-[#5C4033] hover:bg-[#f3e6dc] transition-all duration-300"
          >
            + Add Property
          </Link>
        </div>
      
        {/* Spotlight Card */}
        <div className="w-full max-w-[1440px] mx-auto mb-16 flex flex-wrap justify-between gap-6 px-4">
  {/* Card 1 */}
  <div className="relative bg-white rounded-3xl shadow-md p-8 border border-[#E7D3C1] w-full sm:w-[48%] lg:w-[23%]">
    
    <div className="flex items-center justify-between pl-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2"> Title Clear Lands</h3>
        <p className="text-4xl font-black bg-gradient-to-r from-[#7B3F00] to-[#A0522D] bg-clip-text text-transparent">
          1,234
        </p>
      </div>
     
    </div>
    <div className="mt-6 h-2 bg-[#f0e3d2] rounded-full overflow-hidden">
      <div className="w-3/4 h-full bg-gradient-to-r from-[#7B3F00] to-[#A0522D] rounded-full" />
    </div>
  </div>

  {/* Card 2 */}
  <div className="relative bg-white rounded-3xl shadow-md p-8 border border-[#E7D3C1] w-full sm:w-[48%] lg:w-[23%]">
   
    <div className="flex items-center justify-between pl-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Dispute Lands</h3>
        <p className="text-4xl font-black bg-gradient-to-r from-[#7B3F00] to-[#A0522D] bg-clip-text text-transparent">
          789
        </p>
      </div>
      
    </div>
    <div className="mt-6 h-2 bg-[#f0e3d2] rounded-full overflow-hidden">
      <div className="w-2/3 h-full bg-gradient-to-r from-[#7B3F00] to-[#A0522D] rounded-full" />
    </div>
  </div>

  {/* Card 3 */}
  <div className="relative bg-white rounded-3xl shadow-md p-8 border border-[#E7D3C1] w-full sm:w-[48%] lg:w-[23%]">
   
    <div className="flex items-center justify-between pl-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Govt.Dispute Lands</h3>
        <p className="text-4xl font-black bg-gradient-to-r from-[#7B3F00] to-[#A0522D] bg-clip-text text-transparent">
          530
        </p>
      </div>
    
    </div>
    <div className="mt-6 h-2 bg-[#f0e3d2] rounded-full overflow-hidden">
      <div className="w-1/2 h-full bg-gradient-to-r from-[#7B3F00] to-[#A0522D] rounded-full" />
    </div>
  </div>

  {/* Card 4 */}
  <div className="relative bg-white rounded-3xl shadow-md p-8 border border-[#E7D3C1] w-full sm:w-[48%] lg:w-[23%]">
   
    <div className="flex items-center justify-between pl-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">City FP NA</h3>
        <p className="text-4xl font-black bg-gradient-to-r from-[#7B3F00] to-[#A0522D] bg-clip-text text-transparent">
          98
        </p>
      </div>
   
    </div>
    <div className="mt-6 h-2 bg-[#f0e3d2] rounded-full overflow-hidden">
      <div className="w-1/3 h-full bg-gradient-to-r from-[#7B3F00] to-[#A0522D] rounded-full" />
    </div>
  </div>
</div>

      
        {/* Holographic Search */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="relative">
            <input
              type="text"
              placeholder="Search property records..."
              className="w-full pl-16 pr-6 py-5 bg-white border border-[#d7c0aa] rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#c69c6d] placeholder-gray-400 text-gray-800 text-lg font-medium"
            />
            <svg 
              className="w-7 h-7 absolute left-6 top-5 text-[#7B3F00]"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
              />
            </svg>
          </div>
        </div>
      
        {/* Property Cards */}
        <div className="max-w-4xl mx-auto grid gap-8">
          {properties.map((property) => (
            <Link 
              key={property.id} 
              to={`/property/${property.id}`} 
              className="group relative transform hover:-translate-y-2 transition-all duration-300"
            >
              <div className="relative bg-white rounded-3xl shadow-md overflow-hidden border border-[#e7d3c1]">
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 pr-4">{property.title}</h3>
                    <div className="bg-gradient-to-br from-[#7B3F00] to-[#A0522D] text-white px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                      {property.status}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 text-[#7B3F00] mb-8">
                    <svg 
                      className="w-6 h-6" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="2" 
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
                      />
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="2" 
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
                      />
                    </svg>
                    <span className="font-medium">{property.location}</span>
                  </div>
      
                  <div className="flex justify-between items-center">
                    <div className="text-3xl font-black bg-gradient-to-r from-[#7B3F00] to-[#A0522D] bg-clip-text text-transparent">
                      ₹{property.price}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-600 rounded-full animate-pulse" />
                      <span className="text-sm font-medium text-gray-600">Verified</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      
      
      
      
      )}
    </>
  );
};

export default Home;
