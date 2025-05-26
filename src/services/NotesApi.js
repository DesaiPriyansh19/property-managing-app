import axios from "axios"

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

class NotesAPI {
  // Create a new note
  static async createNote(noteData) {
    try {
      const response = await api.post("/notes", noteData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to create note")
    }
  }

  // Get all notes with optional filters
  static async getAllNotes(params = {}) {
    try {
      const response = await api.get("/notes", { params })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch notes")
    }
  }

  // Get note by ID
  static async getNoteById(id) {
    try {
      const response = await api.get(`/notes/${id}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch note")
    }
  }

  // Update note
  static async updateNote(id, noteData) {
    try {
      const response = await api.put(`/notes/${id}`, noteData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to update note")
    }
  }

  // Delete note
  static async deleteNote(id) {
    try {
      const response = await api.delete(`/notes/${id}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to delete note")
    }
  }
}

export default NotesAPI
