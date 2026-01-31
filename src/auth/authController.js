import axios from "axios";

const API_URL = "https://test.pearl-developer.com/abhivriti/public/api";

// Helper to get headers with the correct 'adminToken'
const getAuthHeaders = () => {
    const token = localStorage.getItem("adminToken");
    return {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    };
};

export const loginAdmin = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/admin/login`, { email, password });

    if (response.data.status === true) {
      const { id, name, email: adminEmail, token } = response.data.data;

      localStorage.setItem("adminId", id);
      localStorage.setItem("adminName", name);
      localStorage.setItem("adminEmail", adminEmail);
      localStorage.setItem("adminToken", token);

      return { success: true, message: response.data.message };
    }
    
    return { success: false, message: response.data.message || "Login Failed" };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Something went wrong.",
    };
  }
};

export const getAdminProfile = async () => {
  try {
    const token = localStorage.getItem("adminToken");
    const response = await axios.get(`${API_URL}/admin/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    return { status: false, message: "Failed to fetch profile" };
  }
};

export const updateAdminProfile = async (formData) => {
  try {
    const token = localStorage.getItem("adminToken");
    const response = await axios.post(`${API_URL}/admin/update-profile`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data?.message || "Failed to update profile",
    };
  }
};

export const getAllComplaints = async () => {
    try {
        const response = await axios.get(`${API_URL}/app/get-all-user-messages`, getAuthHeaders());
        return response.data;
    } catch (error) {
        throw error.response?.data || "Error fetching messages";
    }
};

export const getMessageById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/app/get-masage-details/${id}`, getAuthHeaders());
        return response.data;
    } catch (error) {
        throw error.response?.data || "Error fetching message details";
    }
};


export const updateUserMessageStatus = async (id, payload) => {
    try {
    
        const response = await axios.post(`${API_URL}/app/user-massage/${id}`, payload, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error("API Error:", error);
        throw error.response?.data || { status: false, message: "Error updating status" };
    }
};

export const deleteUserMessage = async (id) => {
    try {
  
        const response = await axios.delete(`${API_URL}/app/delete-user-massage/${id}`, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error("Delete API Error:", error);
        throw error.response?.data || { status: false, message: "Error deleting message" };
    }
};