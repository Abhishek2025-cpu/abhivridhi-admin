import axios from "axios";
import API_URL from "./API_URL";



export const addBanner = async (formData) => {
  try {
    const token = localStorage.getItem("adminToken");
    
    
    const response = await axios.post(`${API_URL}/app/add_benners`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data", 
      },
    });
    
    return response.data;
  } catch (error) {
    console.error("Add Banner API Error:", error);
    throw error.response?.data || { status: false, message: "Server Error" };
  }
};