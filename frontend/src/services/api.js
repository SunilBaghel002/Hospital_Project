const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const fetchAPI = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  const config = {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const appointmentAPI = {
  // Create appointment
  create: async (appointmentData) => {
    return fetchAPI("/appointments", {
      method: "POST",
      body: JSON.stringify(appointmentData),
    });
  },

  // Get available slots
  getAvailableSlots: async (date, doctor) => {
    const params = new URLSearchParams({ date });
    if (doctor) params.append("doctor", doctor);
    return fetchAPI(`/appointments/available-slots?${params}`);
  },

  // Get all appointments
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return fetchAPI(`/appointments${queryString ? `?${queryString}` : ""}`);
  },

  // Get single appointment
  getById: async (id) => {
    return fetchAPI(`/appointments/${id}`);
  },

  // Update status
  updateStatus: async (id, status) => {
    return fetchAPI(`/appointments/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },
};

export default appointmentAPI;
