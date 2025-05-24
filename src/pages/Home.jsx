"use client";

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import companyLogo from "../../public/WhatsApp Image 2025-05-01 at 16.53.33_ce5a9459.jpg";
import { FaUserTie, FaHandshake } from "react-icons/fa"; // Import icons
import { FaWallet } from "react-icons/fa";
import PropertyAPI from "../services/PropertyApi";

const Home = () => {
  const [showLogo, setShowLogo] = useState(false);
  const [startFadeOut, setStartFadeOut] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [counts, setCounts] = useState({
    "Title Clear Lands": 0,
    "Dispute Lands": 0,
    "Govt. Dispute Lands": 0,
    "FP / NA": 0,
    Others: 0,
    "All Properties": 0,
    "All Maps": 0, // Separate count for maps
  });
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [propertiesLoading, setPropertiesLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

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

  // Handle search functionality
  const handleSearch = async (query) => {
    try {
      setIsSearching(true);
      const response = await PropertyAPI.getAllProperties({
        search: query,
        limit: 10, // Limit search results
      });
      setSearchResults(response.data || []);
    } catch (error) {
      console.error("Error searching properties:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Navigate to search results page or show results
      navigate(
        `/allproperties?search=${encodeURIComponent(searchTerm.trim())}`
      );
    }
  };

  // Fetch property counts from API
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        setLoading(true);
        const response = await PropertyAPI.getAllProperties({ limit: 1 }); // Just need counts, not all data
        if (response.counts) {
          // Set separate count for All Maps (you can modify this logic based on your needs)
          const updatedCounts = {
            ...response.counts,
            "All Maps": 0, // For now, keeping same as total, but you can change this
          };
          setCounts(updatedCounts);
        }
      } catch (error) {
        console.error("Error fetching property counts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  // Fetch recent properties for display
  useEffect(() => {
    const fetchRecentProperties = async () => {
      try {
        setPropertiesLoading(true);
        const response = await PropertyAPI.getAllProperties({
          limit: 4, // Get only 4 recent properties for display
          page: 1,
        });
        if (response.data) {
          setProperties(response.data);
        }
      } catch (error) {
        console.error("Error fetching recent properties:", error);
      } finally {
        setPropertiesLoading(false);
      }
    };

    fetchRecentProperties();
  }, []);

  // Handle search with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim()) {
        handleSearch(searchTerm.trim());
      } else {
        setSearchResults([]);
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleToggle = () => setShowDetails((prev) => !prev);

  // Calculate progress width based on total properties
  const getProgressWidth = (count) => {
    const total = counts["All Properties"];
    if (total === 0) return "w-0";
    const percentage = Math.round((count / total) * 100);
    if (percentage === 0) return "w-0";
    if (percentage <= 10) return "w-[10%]";
    if (percentage <= 20) return "w-[20%]";
    if (percentage <= 30) return "w-[30%]";
    if (percentage <= 40) return "w-[40%]";
    if (percentage <= 50) return "w-[50%]";
    if (percentage <= 60) return "w-[60%]";
    if (percentage <= 70) return "w-[70%]";
    if (percentage <= 80) return "w-[80%]";
    if (percentage <= 90) return "w-[90%]";
    return "w-full";
  };

  const spotlightCards = [
    {
      title: "Title Clear Lands",
      value: loading ? "..." : counts["Title Clear Lands"].toString(),
      width: getProgressWidth(counts["Title Clear Lands"]),
    },
    {
      title: "Dispute Lands",
      value: loading ? "..." : counts["Dispute Lands"].toString(),
      width: getProgressWidth(counts["Dispute Lands"]),
    },
    {
      title: "Govt.Dispute Lands",
      value: loading ? "..." : counts["Govt. Dispute Lands"].toString(),
      width: getProgressWidth(counts["Govt. Dispute Lands"]),
    },
    {
      title: " FP / NA",
      value: loading ? "..." : counts["FP / NA"].toString(),
      width: getProgressWidth(counts["FP / NA"]),
    },
    {
      title: "Others",
      value: loading ? "..." : counts["Others"].toString(),
      width: getProgressWidth(counts["Others"]),
    },
    {
      title: "All Maps",
      value: loading ? "..." : counts["All Maps"].toString(),
      width: getProgressWidth(counts["All Maps"]),
    },
  ];

  // Format property data for display
  const formatPropertyForDisplay = (property) => {
    const getDisplayPrice = () => {
      if (property.srRate && property.fpRate) {
        return `SR: ₹${property.srRate} | FP: ₹${property.fpRate}`;
      } else if (property.srRate) {
        return `₹${property.srRate}`;
      } else if (property.fpRate) {
        return `₹${property.fpRate}`;
      }
      return "Price on request";
    };

    const getDisplayLocation = () => {
      const locationParts = [];
      if (property.village) locationParts.push(property.village);
      if (property.district) locationParts.push(property.district);
      return locationParts.join(", ") || "Location not specified";
    };

    return {
      id: property._id,
      title: property.personWhoShared || "Property Owner",
      location: getDisplayLocation(),
      price: getDisplayPrice(),
      image:
        property.images && property.images.length > 0
          ? property.images[0].url
          : null,
      fileType: property.fileType,
      landType: property.landType,
    };
  };

  if (showLogo) {
    return (
      <div
        className={`h-screen w-full flex flex-col items-center justify-center bg-#CFA97E transition-opacity duration-1000 ${
          startFadeOut ? "opacity-0" : "opacity-100"
        }`}
      >
        <img
          src={companyLogo || "/placeholder.svg"}
          alt="Company Logo"
          className="w-40 h-40"
        />
        <h1 className="text-3xl font-bold mt-6 text-[#7B3F00]">
          Welcome to RD Revenue Legal Consulting{" "}
        </h1>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-300 font-sans text-gray-900 p-8">
      {/* ✨ Animated Background Blobs */}
      <div className="absolute top-[-80px] left-[-80px] w-72 h-72 bg-gray-700 rounded-full opacity-10 animate-blob2 z-0"></div>
      <div
        className="absolute bottom-[-100px] right-[-100px] w-96 h-96 bg-gray-700 rounded-full opacity-10 animate-blob2 z-0"
        style={{ animationDelay: "2s" }}
      ></div>
      <div
        className="absolute top-[30%] left-[60%] w-64 h-64 bg-gray-700 rounded-full opacity-10 animate-blob2 z-0"
        style={{ animationDelay: "4s" }}
      ></div>
      <div
        className="absolute top-[10%] right-[10%] w-52 h-52 bg-gray-700 rounded-full opacity-20 animate-blob2 z-0"
        style={{ animationDelay: "1.5s" }}
      ></div>
      <div
        className="absolute bottom-[20%] left-[15%] w-40 h-40 bg-gray-700 rounded-full opacity-15 animate-blob2 z-0"
        style={{ animationDelay: "3s" }}
      ></div>
      <div
        className="absolute top-[70%] right-[25%] w-60 h-60 bg-gray-700 rounded-full opacity-10 animate-blob2 z-0"
        style={{ animationDelay: "5s" }}
      ></div>
      <div
        className="absolute top-[45%] left-[5%] w-56 h-56 bg-gray-700 rounded-full opacity-10 animate-blob2 z-0"
        style={{ animationDelay: "6s" }}
      ></div>

      {/* ✅ Your UI wrapped inside z-10 */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-center mb-16">
          <div className="flex flex-row items-center gap-4 sm:gap-6 mb-10 xl:mb-0">
            {/* Logo */}
            <div className="rounded-2xl shadow-lg ml-5">
              <img
                src={companyLogo || "/placeholder.svg"}
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

        <div className="w-full flex my-5 xl:my-2 mx-auto items-center justify-start lg:justify-center gap-5 p-8 border-t-2 border-gray-400 overflow-x-auto">
          <a href="https://anyror.gujarat.gov.in/LandRecordRural.aspx">
            <button className="border border-gray-500 bg-gray-700 text-white hover:scale-90 rounded-lg px-4 py-2 shadow-xl">
              ANYROR
            </button>
          </a>
          <a href="https://ircms.gujarat.gov.in/rcases/">
            <button className="border border-gray-500 bg-gray-700 text-white hover:scale-90 rounded-lg px-4 py-2 shadow-xl">
              IRCMS
            </button>
          </a>
          <a href="https://jantri.gujarat.gov.in/Reports/ViewRuralAnnualStatementExternal">
            <button className="border border-gray-500 bg-gray-700 text-white hover:scale-90 rounded-lg px-4 py-2 shadow-xl">
              JANTRI
            </button>
          </a>
          <a href="https://services.ecourts.gov.in/ecourtindia_v6/">
            <button className="border border-gray-500 bg-gray-700 text-white hover:scale-90 rounded-lg px-4 py-2 shadow-xl">
              HC <span>CASE STATUS</span>
            </button>
          </a>
          <a href="https://townplanmap.com/?lat=23.01458174091309&lng=72.41773087658258">
            <button className="border border-gray-500 bg-gray-700 text-white hover:scale-90 rounded-lg px-4 py-2 shadow-xl">
              T P MAP
            </button>
          </a>
          <a href="https://tinyurl.com/MEPAN21">
            <button className="border border-gray-500 bg-gray-700 text-white hover:scale-90 rounded-lg px-4 py-2 shadow-xl">
              My State point
            </button>
          </a>
        </div>

        {/* Total + Toggleable Cards */}
        <div className="w-full max-w-[1440px] mx-auto mb-16 px-4">
          <div className=" rounded-3xl shadow-md p-8 border-2 bg-gray-200 border-gray-400">
            <h3 className="text-2xl font-bold mb-4 text-center">
              All Properties
            </h3>
            <p className="text-5xl font-extrabold bg-gray-700 text-transparent bg-clip-text mb-6 text-center">
              {loading
                ? "..."
                : counts["All Properties"].toString().padStart(2, "0")}
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
                showDetails
                  ? "max-h-[1000px] opacity-100 translate-y-0"
                  : "max-h-0 opacity-0 -translate-y-4"
              }`}
            >
              {spotlightCards.map((item, index) => (
                <Link key={index} to={"/allproperties"}>
                  <div
                    key={index}
                    className="bg-gray-100 rounded-2xl border border-gray-400 shadow p-6 transition hover:shadow-lg"
                  >
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-3xl font-bold bg-gray-500 text-transparent bg-clip-text mb-4">
                      {item.value}
                    </p>
                    <div className="w-full bg-gray-400 h-2 rounded-full overflow-hidden">
                      <div
                        className={`${item.width} h-full bg-gray-500 rounded-full transition-all duration-500`}
                      />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="max-w-4xl mx-auto mb-16">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search property records by owner name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-16 pr-6 py-5 bg-white border border-gray-600 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#c69c6d] placeholder-gray-400 text-gray-800 text-lg font-medium"
            />
            <button
              type="submit"
              className="absolute left-6 top-5 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <svg
                className="w-7 h-7"
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
            </button>

            {/* Search Results Dropdown */}
            {searchTerm && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-xl shadow-lg z-50 max-h-96 overflow-y-auto">
                {isSearching ? (
                  <div className="p-4 text-center text-gray-500">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-600 mx-auto mb-2"></div>
                    Searching...
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="p-2">
                    <div className="text-sm text-gray-500 px-3 py-2 border-b">
                      Found {searchResults.length} result(s)
                    </div>
                    {searchResults.map((property) => {
                      const displayProperty =
                        formatPropertyForDisplay(property);
                      return (
                        <Link
                          key={displayProperty.id}
                          to={`/property/${displayProperty.id}`}
                          className="block p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                          onClick={() => {
                            setSearchTerm("");
                            setSearchResults([]);
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                              {displayProperty.image ? (
                                <img
                                  src={
                                    displayProperty.image || "/placeholder.svg"
                                  }
                                  alt={displayProperty.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                  🏠
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-900 truncate">
                                {displayProperty.title}
                              </h4>
                              <p className="text-sm text-gray-500 truncate">
                                {displayProperty.location}
                              </p>
                              <p className="text-sm text-gray-600 truncate">
                                {displayProperty.fileType}
                              </p>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                    <div className="p-3 border-t">
                      <button
                        type="submit"
                        className="w-full text-center text-blue-600 hover:text-blue-800 font-medium"
                      >
                        View all results →
                      </button>
                    </div>
                  </div>
                ) : searchTerm.length > 2 ? (
                  <div className="p-4 text-center text-gray-500">
                    No properties found for "{searchTerm}"
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    Type at least 3 characters to search
                  </div>
                )}
              </div>
            )}
          </form>
        </div>

        {/* Property Cards - Now from Backend */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {propertiesLoading ? (
            // Loading skeleton for property cards
            Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="group block bg-white rounded-2xl shadow-md overflow-hidden border border-gray-400 animate-pulse"
              >
                <div className="w-full h-48 bg-gray-300"></div>
                <div className="p-4">
                  <div className="h-6 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded mb-1 w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            ))
          ) : properties.length > 0 ? (
            properties.map((property) => {
              const displayProperty = formatPropertyForDisplay(property);
              return (
                <Link
                  key={displayProperty.id}
                  to={`/property/${displayProperty.id}`}
                  className="group block bg-white rounded-2xl shadow-md overflow-hidden border border-gray-400 transform hover:-translate-y-2 transition-all duration-300"
                >
                  <div className="w-full h-48 bg-gray-200 relative overflow-hidden">
                    {displayProperty.image ? (
                      <img
                        src={displayProperty.image || "/placeholder.svg"}
                        alt={displayProperty.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg
                          className="w-16 h-16"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}

                    {/* File Type Badge */}
                    {displayProperty.fileType && (
                      <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                        {displayProperty.fileType}
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2 truncate">
                      {displayProperty.title}
                    </h2>
                    <p className="text-gray-600 mb-1 truncate">
                      {displayProperty.location}
                    </p>
                    <p className="text-black font-semibold truncate">
                      {displayProperty.price}
                    </p>
                    {displayProperty.landType && (
                      <p className="text-sm text-gray-500 mt-1">
                        {displayProperty.landType}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })
          ) : (
            // Empty state
            <div className="col-span-full text-center py-12">
              <div className="text-6xl mb-4">🏠</div>
              <h3 className="text-xl font-medium text-gray-600 mb-2">
                No properties found
              </h3>
              <p className="text-gray-500 mb-6">
                Start by adding your first property
              </p>
              <Link
                to="/add-property"
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                Add Your First Property
              </Link>
            </div>
          )}
        </div>

        {/* Show "View All Properties" link if there are more than 4 properties */}
        {!propertiesLoading &&
          properties.length === 4 &&
          counts["All Properties"] > 4 && (
            <div className="text-center mt-8">
              <Link
                to="/allproperties"
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                View All Properties ({counts["All Properties"]})
              </Link>
            </div>
          )}

        <div className="w-full flex items-center justify-start lg:justify-center gap-6 mt-6 border-gray-400 border-t-2 pt-6 overflow-x-auto">
          <Link to={"/buyers"}>
            <div className="w-56 h-32 bg-white border border-gray-300 rounded-2xl shadow-md hover:shadow-xl transition duration-300 cursor-pointer flex flex-col items-center justify-center gap-2">
              <FaUserTie className="text-4xl text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-800">Buyers</h2>
            </div>
          </Link>

          <Link to={"/brokers"}>
            <div className="w-56 h-32 bg-white border border-gray-300 rounded-2xl shadow-md hover:shadow-xl transition duration-300 cursor-pointer flex flex-col items-center justify-center gap-2">
              <FaHandshake className="text-4xl text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-800">Brokers</h2>
            </div>
          </Link>

          <Link to={"/mywallet"}>
            <div className="w-56 h-32 bg-white border border-gray-300 rounded-2xl shadow-md hover:shadow-xl transition duration-300 cursor-pointer flex flex-col items-center justify-center gap-2">
              <FaWallet className="text-4xl text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-800">My Wallet</h2>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
