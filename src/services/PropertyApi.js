import axios from "axios";

// Create axios instance with base configuration
const base = import.meta.env.VITE_API_URL || "http://localhost:4000";
const api = axios.create({
  baseURL: `${base}/api`,
  timeout: 30000, // 30 seconds timeout for file uploads
});

console.log(base)

// Request interceptor for adding auth tokens if needed
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

class PropertyAPI {
  // Create a new property
  static async createProperty(propertyData) {
    try {
      const formData = new FormData();

      // Add text fields to FormData
      formData.append("fileType", propertyData.fileType);
      formData.append("landType", propertyData.landType);
      formData.append("tenure", propertyData.tenure);
      formData.append("personWhoShared", propertyData.personWhoShared);
      formData.append("contactNumber", propertyData.contactNumber);

      // Add optional fields only if they have values
      if (propertyData.village)
        formData.append("village", propertyData.village);
      if (propertyData.taluko) formData.append("taluko", propertyData.taluko);
      if (propertyData.district)
        formData.append("district", propertyData.district);
      if (propertyData.serNoNew)
        formData.append("serNoNew", propertyData.serNoNew);
      if (propertyData.serNoOld)
        formData.append("serNoOld", propertyData.serNoOld);
      if (propertyData.fpNo) formData.append("fpNo", propertyData.fpNo);
      if (propertyData.tp) formData.append("tp", propertyData.tp);
      if (propertyData.zone) formData.append("zone", propertyData.zone);
      if (propertyData.srArea) formData.append("srArea", propertyData.srArea);
      if (propertyData.fpArea) formData.append("fpArea", propertyData.fpArea);
      if (propertyData.srRate) formData.append("srRate", propertyData.srRate);
      if (propertyData.fpRate) formData.append("fpRate", propertyData.fpRate);
      if (propertyData.mtrRoad)
        formData.append("mtrRoad", propertyData.mtrRoad);
      if (propertyData.nearByLandmark)
        formData.append("nearByLandmark", propertyData.nearByLandmark);
      if (propertyData.notes) formData.append("notes", propertyData.notes);
      if (propertyData.mapLink)
        formData.append("mapLink", propertyData.mapLink);

      // Add image files
      if (propertyData.images && propertyData.images.length > 0) {
        propertyData.images.forEach((image) => {
          if (image.file) {
            formData.append("images", image.file);
          }
        });
      }

      // Add PDF files
      if (propertyData.pdfs && propertyData.pdfs.length > 0) {
        propertyData.pdfs.forEach((pdf) => {
          if (pdf.file) {
            formData.append("pdfs", pdf.file);
          }
        });
      }

      const response = await api.post("/properties", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to create property"
      );
    }
  }

  // Get all properties with optional filters
  static async getAllProperties(params = {}) {
    try {
      const response = await api.get("/properties", {
        params,
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch properties"
      );
    }
  }

  // Get property by ID
  static async getPropertyById(id) {
    try {
      const response = await api.get(`/properties/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch property"
      );
    }
  }

  // Update property
  static async updateProperty(id, propertyData) {
    try {
      const formData = new FormData();

      // Add all fields to FormData
      Object.keys(propertyData).forEach((key) => {
        if (
          key !== "images" &&
          key !== "pdfs" &&
          propertyData[key] !== undefined &&
          propertyData[key] !== ""
        ) {
          formData.append(key, propertyData[key]);
        }
      });

      // Add new image files if any
      if (propertyData.images && propertyData.images.length > 0) {
        propertyData.images.forEach((image) => {
          if (image.file) {
            formData.append("images", image.file);
          }
        });
      }

      // Add new PDF files if any
      if (propertyData.pdfs && propertyData.pdfs.length > 0) {
        propertyData.pdfs.forEach((pdf) => {
          if (pdf.file) {
            formData.append("pdfs", pdf.file);
          }
        });
      }

      const response = await api.put(`/properties/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to update property"
      );
    }
  }

  // Delete property
  static async deleteProperty(id) {
    try {
      const response = await api.delete(`/properties/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to delete property"
      );
    }
  }

  // Delete specific file from property
  static async deletePropertyFile(propertyId, fileType, publicId) {
    try {
      // Encode the publicId to handle special characters and slashes
      const encodedPublicId = encodeURIComponent(publicId);

      const response = await api.delete(
        `/properties/${propertyId}/files/${fileType}/${encodedPublicId}`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to delete file");
    }
  }
}

export default PropertyAPI;
