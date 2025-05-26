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

class BrokerAPI {
  // Create a new Broker
  static async createBroker(BrokerData) {
    try {
      const response = await api.post("/brokers", BrokerData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to create Broker"
      );
    }
  }

  // Get all brokers with optional filters
  static async getAllBrokers(params = {}) {
    try {
      const response = await api.get("/brokers", { params });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch brokers"
      );
    }
  }

  // Get Broker by ID
  static async getBrokerById(id) {
    try {
      const response = await api.get(`/brokers/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch Broker");
    }
  }

  // Update Broker
  static async updateBroker(id, BrokerData) {
    try {
      const response = await api.put(`/brokers/${id}`, BrokerData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to update Broker"
      );
    }
  }

  // Delete Broker
  static async deleteBroker(id) {
    try {
      const response = await api.delete(`/brokers/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to delete Broker"
      );
    }
  }
}

export default BrokerAPI;
