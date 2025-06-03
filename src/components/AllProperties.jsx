"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import {
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";
import PropertyAPI from "../services/PropertyApi";

export default function AllProperties() {
  const [searchTerm, setSearchTerm] = useState("");
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProperties: 0,
  });
  const [counts, setCounts] = useState({});

  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  // Mapping between slugs and fileTypes
  const slugToFileTypeMap = {
    "title-clear-lands": "Title Clear Lands",
    "dispute-lands": "Dispute Lands",
    "govt-dispute-lands": "Govt. Dispute Lands",
    "fp-na": "FP / NA",
    others: "Others",
    "all-maps": null, // Special case for all maps
  };

  const spotlightCards = [
    {
      title: "Title Clear Lands",
      slug: "title-clear-lands",
      color: "bg-green-500",
    },
    {
      title: "Dispute Lands",
      slug: "dispute-lands",
      color: "bg-red-500",
    },
    {
      title: "Govt.Dispute Lands",
      slug: "govt-dispute-lands",
      color: "bg-orange-500",
    },
    {
      title: "FP / NA",
      slug: "fp-na",
      color: "bg-blue-500",
    },
    {
      title: "Others",
      slug: "others",
      color: "bg-purple-500",
    },
    // {
    //   title: "All Maps",
    //   slug: "all-maps",
    //   color: "bg-gray-500",
    // },
  ];

  // Get current filter info
  const currentCard = spotlightCards.find((item) => item.slug === slug);
  const currentFileType = slug ? slugToFileTypeMap[slug] : null;

  // Initialize search term from URL params
  useEffect(() => {
    if (searchQuery) {
      setSearchTerm(searchQuery);
    }
  }, [searchQuery]);

  // Fetch properties based on slug and search
  useEffect(() => {
    fetchProperties(1);
  }, [slug, searchQuery]);

  // Handle search with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm !== searchQuery) {
        fetchProperties(1);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const fetchProperties = async (page = 1) => {
    try {
      setLoading(true);
      setError("");

      const params = {
        page,
        limit: 9,
        recycleBin: false,
        ...(currentFileType && { fileType: currentFileType }),
        ...(searchTerm && { search: searchTerm }),
      };

      // Special handling for "all-maps" - you can customize this logic
      if (slug === "all-maps") {
        // For now, fetch all properties with mapLink
        // You can modify this logic based on your requirements
        delete params.fileType;
      }

      const response = await PropertyAPI.getAllProperties(params);
      setProperties(response.data || []);
      console.log(response)
      setPagination(
        response.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalProperties: 0,
        }
      );
      setCounts(response.counts || {});
    } catch (err) {
      setError(err.message);
      console.error("Error fetching properties:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    fetchProperties(newPage);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProperties(1);
  };

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

  const getFileTypeColor = (fileType) => {
    const colorMap = {
      "Title Clear Lands": "bg-green-100 text-green-800",
      "Dispute Lands": "bg-red-100 text-red-800",
      "Govt. Dispute Lands": "bg-orange-100 text-orange-800",
      "FP / NA": "bg-blue-100 text-blue-800",
      Others: "bg-purple-100 text-purple-800",
    };
    return colorMap[fileType] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="bg-gray-300 min-h-screen py-10 px-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <h1 className="text-4xl font-bold mb-2 text-center text-gray-700">
          All Properties
        </h1>
        {currentCard && (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4 text-gray-600">
              {currentCard.title}
            </h2>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm">
              <div
                className={`w-3 h-3 rounded-full ${currentCard.color}`}
              ></div>
              <span className="text-sm font-medium">
                {loading
                  ? "Loading..."
                  : `${pagination.totalProperties} properties found`}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          <Link
            to="/allproperties/all-properties"
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              slug === "all-properties"
                ? "bg-gray-700 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            All Properties
          </Link>
          {spotlightCards.map((card) => (
            <Link
              key={card.slug}
              to={`/allproperties/${card.slug}`}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                slug === card.slug
                  ? "bg-gray-700 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {card.title}
            </Link>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="max-w-4xl mx-auto mb-8">
        <form
          onSubmit={handleSearchSubmit}
          className="flex flex-col md:flex-row items-center gap-4"
        >
          <div className="relative flex-1 w-full">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search by owner name, location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-500 rounded-xl outline-none shadow-sm bg-white text-gray-800"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition w-full md:w-auto flex items-center justify-center gap-2"
          >
            <Search size={16} />
            Search
          </button>
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-6xl mx-auto mb-6">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center gap-2">
            <AlertCircle size={20} />
            {error}
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="animate-spin" size={48} />
          <span className="ml-3 text-lg">Loading properties...</span>
        </div>
      ) : (
        <>
          {/* Properties Grid */}
          {properties.length > 0 ? (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto mb-8">
              {properties.map((property) => {
                const displayProperty = formatPropertyForDisplay(property);
                return (
                  <Link
                    key={displayProperty.id}
                    to={`/property/${displayProperty.id}`}
                    className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-400 hover:shadow-lg transition-shadow duration-200"
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
                        <div
                          className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium ${getFileTypeColor(
                            displayProperty.fileType
                          )}`}
                        >
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
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏠</div>
              <h3 className="text-xl font-medium text-gray-600 mb-2">
                No properties found
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || currentFileType
                  ? "Try adjusting your search or filter criteria"
                  : "Start by adding your first property"}
              </p>
              <Link
                to="/add-property"
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                Add Property
              </Link>
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPrev}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft size={16} />
                Previous
              </button>

              <div className="flex items-center gap-2">
                {Array.from(
                  { length: Math.min(pagination.totalPages, 5) },
                  (_, i) => {
                    let pageNum;
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1;
                    } else {
                      const start = Math.max(1, pagination.currentPage - 2);
                      pageNum = start + i;
                    }

                    if (pageNum > pagination.totalPages) return null;

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                          pageNum === pagination.currentPage
                            ? "bg-gray-700 text-white"
                            : "border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                )}
              </div>

              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={!pagination.hasNext}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          )}

          {/* Results Info */}
          {properties.length > 0 && (
            <div className="text-center text-gray-600 text-sm mt-4">
              Showing {(pagination.currentPage - 1) * 9 + 1} to{" "}
              {Math.min(pagination.currentPage * 9, pagination.totalProperties)}{" "}
              of {pagination.totalProperties} properties
              {currentCard && ` in ${currentCard.title}`}
            </div>
          )}
        </>
      )}
    </div>
  );
}
