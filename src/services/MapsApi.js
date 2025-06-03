import axios from "axios";

// Create axios instance with base configuration
const base = import.meta.env.VITE_API_URL || "http://localhost:4000";
const api = axios.create({
  baseURL: `${base}/api`,
  timeout: 30000, // 30 seconds timeout for file uploads
});

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

class MapsAPI {
  // Create a new maps entry
  static async createMaps(mapsData) {
    try {
      const formData = new FormData();

      // Add text fields to FormData
      formData.append("area", mapsData.area);
      if (mapsData.notes) formData.append("notes", mapsData.notes);

      // Add image files - FIXED: Check if file exists before appending
      if (mapsData.images && mapsData.images.length > 0) {
        mapsData.images.forEach((image) => {
          if (image.file && image.file instanceof File) {
            formData.append("images", image.file);
          }
        });
      }

      // Add PDF files - FIXED: Check if file exists before appending
      if (mapsData.pdfs && mapsData.pdfs.length > 0) {
        mapsData.pdfs.forEach((pdf) => {
          if (pdf.file && pdf.file instanceof File) {
            formData.append("pdfs", pdf.file);
          }
        });
      }

      const response = await api.post("/maps", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to create maps");
    }
  }

  // Get all maps with optional filters
  static async getAllMaps(params = {}) {
    try {
      const response = await api.get("/maps", { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch maps");
    }
  }

  // Get maps by ID
  static async getMapsById(id) {
    try {
      const response = await api.get(`/maps/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch maps");
    }
  }

  // Update maps
  static async updateMaps(id, mapsData) {
    try {
      const formData = new FormData();

      // Add all fields to FormData
      Object.keys(mapsData).forEach((key) => {
        if (
          key !== "images" &&
          key !== "pdfs" &&
          mapsData[key] !== undefined &&
          mapsData[key] !== ""
        ) {
          formData.append(key, mapsData[key]);
        }
      });

      // Add new image files if any - FIXED: Check if file exists
      if (mapsData.images && mapsData.images.length > 0) {
        mapsData.images.forEach((image) => {
          if (image.file && image.file instanceof File) {
            formData.append("images", image.file);
          }
        });
      }

      // Add new PDF files if any - FIXED: Check if file exists
      if (mapsData.pdfs && mapsData.pdfs.length > 0) {
        mapsData.pdfs.forEach((pdf) => {
          if (pdf.file && pdf.file instanceof File) {
            formData.append("pdfs", pdf.file);
          }
        });
      }

      const response = await api.put(`/maps/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to update maps");
    }
  }

  // Toggle onBoard status
  static async toggleOnBoard(id, onBoardStatus) {
    try {
      const response = await api.patch(`/maps/${id}/onboard`, {
        onBoard: onBoardStatus,
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to toggle onBoard status"
      );
    }
  }

  static async moveToRecycleBin(id, recycleBinStatus) {
    try {
      const response = await api.patch(`/maps/${id}/recycleBin`, {
        recycleBin: recycleBinStatus,
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to toggle onBoard status"
      );
    }
  }

  // Delete maps
  static async deleteMaps(id) {
    try {
      const response = await api.delete(`/maps/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to delete maps");
    }
  }

  // Delete specific file from maps
  static async deleteMapsFile(mapsId, fileType, publicId) {
    try {
      // Encode the publicId to handle special characters and slashes
      const encodedPublicId = encodeURIComponent(publicId);

      const response = await api.delete(
        `/maps/${mapsId}/files/${fileType}/${encodedPublicId}`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to delete file");
    }
  }

  // Get upload status for maps
  static async getUploadStatus(id) {
    try {
      const response = await api.get(`/maps/${id}/upload-status`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch upload status"
      );
    }
  }
}

export default MapsAPI;
