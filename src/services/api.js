// Use environment variable for API URL, fallback to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_URL?.trim() || "http://localhost:5000/api";

// Helper function to get auth token
const getAuthToken = () => localStorage.getItem("authToken");

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();

  const config = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(options.headers || {}),
    },
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      let errorMsg = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMsg = errorData.error || errorMsg;
      } catch {
        const text = await response.text();
        if (text) errorMsg = text;
      }
      throw new Error(errorMsg);
    }

    return await response.json();
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
};

// ================== AUTH API ==================
export const authAPI = {
  signup: (userData) =>
    apiRequest("/auth/signup", {
      method: "POST",
      body: JSON.stringify(userData),
    }),

  login: (credentials) =>
    apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  updateProfile: (profileData) =>
    apiRequest("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    }),
};

// ================== PROJECTS API ==================
export const projectsAPI = {
  getAll: () => apiRequest("/projects"),

  create: (projectData) =>
    apiRequest("/projects", {
      method: "POST",
      body: JSON.stringify(projectData),
    }),

  update: (projectId, updates) =>
    apiRequest(`/projects/${projectId}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    }),

  delete: (projectId) =>
    apiRequest(`/projects/${projectId}`, {
      method: "DELETE",
    }),

  search: (query) =>
    apiRequest(`/projects/search?query=${encodeURIComponent(query)}`),
};

// ================== AI CODE GENERATION API ==================
export const aiAPI = {
  generateCode: (prompt, language, projectType) =>
    apiRequest("/generate", {
      method: "POST",
      body: JSON.stringify({ prompt, language, projectType }),
    }),
};
