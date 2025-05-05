import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import companyLogo from "../../public/WhatsApp Image 2025-05-01 at 16.53.33_ce5a9459.jpg";

const Home = () => {
  const [showLogo, setShowLogo] = useState(false);
  const [startFadeOut, setStartFadeOut] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const hasSeenLogo = localStorage.getItem("hasSeenLogo");
    if (!hasSeenLogo) {
      setShowLogo(true);
      localStorage.setItem("hasSeenLogo", "true");

      const timer1 = setTimeout(() => setStartFadeOut(true), 2000);
      const timer2 = setTimeout(() => setShowLogo(false), 2800);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, []);

  const handleToggle = () => setShowDetails((prev) => !prev);

  const spotlightCards = [
    { title: "Title Clear Lands", value: "1,234", width: "w-3/4" },
    { title: "Dispute Lands", value: "789", width: "w-2/3" },
    { title: "Govt.Dispute Lands", value: "530", width: "w-1/2" },
    { title: "City FP NA", value: "98", width: "w-1/3" },
    { title: "Others", value: "98", width: "w-1/3" },
  ];

  const properties = [
    { id: "1", title: "Dabhoda Dakho Land", location: "Satellite", price: "Rs 50,00,000" },
    { id: "2", title: "Thaltej Plot", location: "Thaltej", price: "Rs 35,000/month" },
    { id: "3", title: "Sabarmati Big Land", location: "Sabarmati", price: "Rs 40,000/month" },
    { id: "4", title: "Agriculture Land", location: "Thaltej", price: "Rs 35,000/month" },
  ];

  if (showLogo) {
    return (
      <div
        className={`h-screen w-full flex flex-col items-center justify-center bg-black transition-opacity duration-1000 ${startFadeOut ? "opacity-0" : "opacity-100"}`}
      >
        <img src={companyLogo} alt="Company Logo" className="w-40 h-40" />
        <h1 className="text-3xl font-bold mt-6 text-white">Welcome to Millenuime Properties</h1>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#fffaf3] font-sans text-gray-900 p-8">
 {/* ✨ Animated Background Blobs */}
<div className="absolute top-[-80px] left-[-80px] w-72 h-72 bg-[#A0522D] rounded-full opacity-10 animate-blob2 z-0"></div>
<div className="absolute bottom-[-100px] right-[-100px] w-96 h-96 bg-[#7B3F00] rounded-full opacity-10 animate-blob2 z-0" style={{ animationDelay: '2s' }}></div>
<div className="absolute top-[30%] left-[60%] w-64 h-64 bg-[#CFA97E] rounded-full opacity-10 animate-blob2 z-0" style={{ animationDelay: '4s' }}></div>
<div className="absolute top-[10%] right-[10%] w-52 h-52 bg-[#5C4033] rounded-full opacity-20 animate-blob2 z-0" style={{ animationDelay: '1.5s' }}></div>
<div className="absolute bottom-[20%] left-[15%] w-40 h-40 bg-[#8B5E3C] rounded-full opacity-15 animate-blob2 z-0" style={{ animationDelay: '3s' }}></div>
<div className="absolute top-[70%] right-[25%] w-60 h-60 bg-[#D2B48C] rounded-full opacity-10 animate-blob2 z-0" style={{ animationDelay: '5s' }}></div>
<div className="absolute top-[45%] left-[5%] w-56 h-56 bg-[#EEE5DE] rounded-full opacity-10 animate-blob2 z-0" style={{ animationDelay: '6s' }}></div>

  
    {/* ✅ Your UI wrapped inside z-10 */}
    <div className="relative z-10">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-center mb-16">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-10">
  {/* Logo */}
  <div className="bg-gradient-to-br from-[#7B3F00] to-[#A0522D] p-1.5 rounded-2xl shadow-lg">
    <img
      src={companyLogo}
      alt="Company Logo"
      className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover shadow-md bg-white"
    />
  </div>

  {/* Text */}
  <div className="text-center sm:text-left">
    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-wide  text-gray-600 ">
      RD Revenue
    </h1>
    <p className="text-lg sm:text-xl font-medium italic text-transparent bg-gradient-to-r from-[#7B3F00] to-[#A0522D] bg-clip-text">
      Legal Consulting
    </p>
  </div>
</div>


        <div className="flex flex-wrap gap-4 justify-center items-center mt-4">
          <Link
            to="/add-property"
            className="relative overflow-hidden bg-white border border-[#D0B49F] rounded-2xl shadow-md px-6 py-3 font-semibold text-[#5C4033] hover:bg-[#f3e6dc] transition-all duration-300"
          >
            + Add Property
          </Link>
          <Link
            to="/brokers"
            className="relative overflow-hidden bg-white border border-[#D0B49F] rounded-2xl shadow-md px-6 py-3 font-semibold text-[#5C4033] hover:bg-[#f3e6dc] transition-all duration-300"
          >
            Brokers
          </Link>
          <Link
            to="/buyers"
            className="relative overflow-hidden bg-white border border-[#D0B49F] rounded-2xl shadow-md px-6 py-3 font-semibold text-[#5C4033] hover:bg-[#f3e6dc] transition-all duration-300"
          >
            Buyers
          </Link>
          <Link
            to="/allmaps"
            className="relative overflow-hidden bg-white border border-[#D0B49F] rounded-2xl shadow-md px-6 py-3 font-semibold text-[#5C4033] hover:bg-[#f3e6dc] transition-all duration-300"
          >
          All Maps
          </Link>
        </div>
      </div>
  
      {/* Total + Toggleable Cards */}
      <div className="w-full max-w-[1440px] mx-auto mb-16 px-4">
        <div className="bg-white rounded-3xl shadow-md p-8 border border-[#E7D3C1]">
          <h3 className="text-2xl font-bold mb-4 text-center">All Properties</h3>
          <p className="text-5xl font-extrabold bg-gradient-to-r from-[#7B3F00] to-[#A0522D] text-transparent bg-clip-text mb-6 text-center">
            2,749
          </p>
          <div className="flex justify-center mb-4">
            <button
              onClick={handleToggle}
              className="bg-gradient-to-r from-[#7B3F00] to-[#A0522D] text-white px-6 py-3 rounded-xl text-lg hover:opacity-90 transition"
            >
              {showDetails ? "Hide Details" : "View Details"}
            </button>
          </div>
  
          {/* Animated Slide/Fade Section */}
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-700 overflow-hidden ${
              showDetails ? "max-h-[1000px] opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-4"
            }`}
          >
            {spotlightCards.map((item, index) => (
              <div
                key={index}
                className="bg-[#fdf8f2] rounded-2xl border border-[#E7D3C1] shadow p-6 transition hover:shadow-lg"
              >
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-3xl font-bold bg-gradient-to-r from-[#7B3F00] to-[#A0522D] text-transparent bg-clip-text mb-4">
                  {item.value}
                </p>
                <div className="w-full bg-[#f0e3d2] h-2 rounded-full overflow-hidden">
                  <div className={`${item.width} h-full bg-gradient-to-r from-[#7B3F00] to-[#A0522D] rounded-full`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
  
      {/* Search */}
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
            <div className="relative bg-white rounded-3xl shadow-md overflow-hidden border border-[#e7d3c1] p-6">
              <h2 className="text-xl font-bold mb-2">{property.title}</h2>
              <p className="text-gray-600 mb-1">{property.location}</p>
              <p className="text-[#7B3F00] font-semibold">{property.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  </div>
  
  );
};

export default Home;
