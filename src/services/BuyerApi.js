import axios from "axios";

// Create axios instance with base configuration
const base = import.meta.env.VITE_API_URL || "http://localhost:4000";

const api = axios.create({
  baseURL: `${base}/api`,
  timeout: 30000, // 30 seconds timeout for file uploads
});

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

class BuyerAPI {
  // Create a new buyer
  static async createBuyer(buyerData) {
    try {
      const response = await api.post("/buyers", buyerData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to create buyer"
      );
    }
  }

  // Get all buyers with optional filters
  static async getAllBuyers(params = {}) {
    try {
      const response = await api.get("/buyers", { params });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch buyers"
      );
    }
  }

  // Get buyer by ID
  static async getBuyerById(id) {
    try {
      const response = await api.get(`/buyers/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch buyer");
    }
  }

  // Update buyer
  static async updateBuyer(id, buyerData) {
    try {
      const response = await api.put(`/buyers/${id}`, buyerData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to update buyer"
      );
    }
  }

  // Delete buyer
  static async deleteBuyer(id) {
    try {
      const response = await api.delete(`/buyers/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to delete buyer"
      );
    }
  }
}

export default BuyerAPI;
