import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import companyLogo from "../../public/WhatsApp Image 2025-05-01 at 16.53.33_ce5a9459.jpg";
import { FaUserTie, FaHandshake ,} from "react-icons/fa"; // Import icons
import { FaWallet } from "react-icons/fa";

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
    { title: "Title Clear Lands", value: "0", width: "w-0" },
    { title: "Dispute Lands", value: "0", width: "w-0" },
    { title: "Govt.Dispute Lands", value: "0", width: "w-0" },
    { title: " FP / NA", value: "0", width: "w-0" },
    { title: "Others", value: "0", width: "w-0" },
    { title: "All Maps", value: "0", width: "w-0" },
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
        className={`h-screen w-full flex flex-col items-center justify-center bg-#CFA97E transition-opacity duration-1000 ${startFadeOut ? "opacity-0" : "opacity-100"}`}
      >
        <img src={companyLogo} alt="Company Logo" className="w-40 h-40" />
        <h1 className="text-3xl font-bold mt-6 text-[#7B3F00]">Welcome to  RD Revenue Legal Consulting </h1>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-300 font-sans text-gray-900 p-8">
 {/* ✨ Animated Background Blobs */}
<div className="absolute top-[-80px] left-[-80px] w-72 h-72 bg-gray-700 rounded-full opacity-10 animate-blob2 z-0"></div>
<div className="absolute bottom-[-100px] right-[-100px] w-96 h-96 bg-gray-700 rounded-full opacity-10 animate-blob2 z-0" style={{ animationDelay: '2s' }}></div>
<div className="absolute top-[30%] left-[60%] w-64 h-64 bg-gray-700 rounded-full opacity-10 animate-blob2 z-0" style={{ animationDelay: '4s' }}></div>
<div className="absolute top-[10%] right-[10%] w-52 h-52 bg-gray-700 rounded-full opacity-20 animate-blob2 z-0" style={{ animationDelay: '1.5s' }}></div>
<div className="absolute bottom-[20%] left-[15%] w-40 h-40 bg-gray-700 rounded-full opacity-15 animate-blob2 z-0" style={{ animationDelay: '3s' }}></div>
<div className="absolute top-[70%] right-[25%] w-60 h-60 bg-gray-700 rounded-full opacity-10 animate-blob2 z-0" style={{ animationDelay: '5s' }}></div>
<div className="absolute top-[45%] left-[5%] w-56 h-56 bg-gray-700 rounded-full opacity-10 animate-blob2 z-0" style={{ animationDelay: '6s' }}></div>

  
    {/* ✅ Your UI wrapped inside z-10 */}
    <div className="relative z-10">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-center mb-16">
  <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-10 xl:mb-0">
    {/* Logo */}
    <div className="rounded-2xl shadow-lg">
      <img
        src={companyLogo}
        alt="Company Logo"
        className="w-20 h-20 sm:w-24 xl:w-[12rem] sm:h-24 xl:h-[12rem] rounded-xl object-cover shadow-md bg-white"
      />
    </div>

    {/* Heading centered without affecting image */}
    <div className="flex-1 flex justify-center sm:justify-center">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-wide text-gray-600 text-center lg:mt-7">
        RD Legal Consulting
      </h1>
    </div>
  </div>

  <div className="flex flex-wrap gap-4 justify-center items-center mt-4">
    <Link
      to="/add-property"
      className="relative overflow-hidden bg-white border border-gray-500 rounded-2xl shadow-md px-6 py-3 font-semibold text-gray-600 hover:bg-gray-200 transition-all duration-300"
    >
      + Add Property
    </Link>
  </div>
</div>



      <div className=" w-full flex my-5 xl:my-2 mx-auto items-center justify-center gap-5 p-8 border-t-2  border-gray-400">
     <a href="https://anyror.gujarat.gov.in/LandRecordRural.aspx">  
     <button  className="border border-gray-500 bg-gray-700 text-white hover:scale-90 rounded-lg  px-4 py-2 shadow-xl">ANYROR</button></a>  
     <a href="https://ircms.gujarat.gov.in/rcases/">
     <button className="border border-gray-500 bg-gray-700 text-white hover:scale-90 rounded-lg  px-4 py-2 shadow-xl">IRCMS</button></a>  
     <a href="https://jantri.gujarat.gov.in/Reports/ViewRuralAnnualStatementExternal"> 
      <button className="border border-gray-500 bg-gray-700 text-white hover:scale-90 rounded-lg  px-4 py-2 shadow-xl">JANTRI</button></a> 
      <a href="https://services.ecourts.gov.in/ecourtindia_v6/"> 
      <button className="border border-gray-500 bg-gray-700 text-white hover:scale-90 rounded-lg  px-4 py-2 shadow-xl">HC  <span className="">CASE STATUS</span></button></a>  
      <a href="https://townplanmap.com/?lat=23.01458174091309&lng=72.41773087658258"> 
      <button className="border border-gray-500 bg-gray-700 text-white hover:scale-90 rounded-lg  px-4 py-2 shadow-xl">T P MAP</button></a> 
         </div>
      {/* Total + Toggleable Cards */}
      <div className="w-full max-w-[1440px] mx-auto mb-16 px-4">
        <div className=" rounded-3xl shadow-md p-8 border-2 border-gray-400">
          <h3 className="text-2xl font-bold mb-4 text-center">All Properties</h3>
          <p className="text-5xl font-extrabold bg-gray-700 text-transparent bg-clip-text mb-6 text-center">
            00
          </p>
          <div className="flex justify-center mb-4">
            <button
              onClick={handleToggle}
              className="bg-gray-500 text-white px-6 py-3 rounded-xl text-lg hover:opacity-90 transition"
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
                className="bg-gray-100 rounded-2xl border border-gray-400 shadow p-6 transition hover:shadow-lg"
              >
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-3xl font-bold bg-gray-500 text-transparent bg-clip-text mb-4">
                  {item.value}
                </p>
                <div className="w-full bg-gray-400 h-2 rounded-full overflow-hidden">
                  <div className={`${item.width} h-full bg-gray-500 rounded-full`} />
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
            className="w-full pl-16 pr-6 py-5 bg-white border border-gray-600 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#c69c6d] placeholder-gray-400 text-gray-800 text-lg font-medium"
          />
          <svg
            className="w-7 h-7 absolute left-6 top-5 text-gray-700"
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
      <div className="max-w-4xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {properties.map((property) => (
          <Link
            key={property.id}
            to={`/property/${property.id}`}
            className="group relative transform hover:-translate-y-2 transition-all duration-300"
          >
            <div className="relative bg-white rounded-3xl shadow-md overflow-hidden border border-gray-600 p-6">
              <h2 className="text-xl font-bold mb-2">{property.title}</h2>
              <p className="text-gray-600 mb-1">{property.location}</p>
              <p className="text-gray-700 font-semibold">{property.price}</p>
            </div>
          </Link>
        ))}
      </div>
      {/* <div className=" w-full flex my-5 mx-auto items-center justify-center gap-5 p-8 border-t-4  border-[#E7D3C1]">
     <a href="https://anyror.gujarat.gov.in/w">  <button  className="bg-[#7B3F00] rounded-lg text-white px-4 py-2 shadow-xl">ANYROR</button></a>  
     <a href="https://ircms.gujarat.gov.in/rcases/"><button className="bg-[#7B3F00] rounded-lg text-white px-4 py-2 shadow-xl">IRCMS</button></a>  
     <a href="">  <button className="bg-[#7B3F00] rounded-lg text-white px-4 py-2 shadow-xl">JANTRI</button></a>  
         </div> */}
         <div className="flex items-center justify-center gap-6 mt-6 border-gray-400 border-t-2 pt-6">
 <Link to={"/buyers"}> <div className="w-56 h-32 bg-white border border-gray-300 rounded-2xl shadow-md hover:shadow-xl transition duration-300 cursor-pointer flex flex-col items-center justify-center gap-2">
    <FaUserTie className="text-4xl text-gray-600" />
    <h2 className="text-lg font-semibold text-gray-800">Buyers</h2>
  </div></Link>

  <Link to={"/brokers"}><div className="w-56 h-32 bg-white border border-gray-300 rounded-2xl shadow-md hover:shadow-xl transition duration-300 cursor-pointer flex flex-col items-center justify-center gap-2">
    <FaHandshake className="text-4xl text-gray-600" />
    <h2 className="text-lg font-semibold text-gray-800">Brokers</h2>
  </div></Link>
  
  <Link to={"/brokers"}><div className="w-56 h-32 bg-white border border-gray-300 rounded-2xl shadow-md hover:shadow-xl transition duration-300 cursor-pointer flex flex-col items-center justify-center gap-2">
  <FaWallet className="text-4xl text-gray-600" />
    <h2 className="text-lg font-semibold text-gray-800">My Wallet`</h2>
  </div></Link>
</div>
    </div>
  </div>
  
  );
};

export default Home;
