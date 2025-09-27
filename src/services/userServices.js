import AxiosConfig from "../config/axiosConfig";

export const login = async (username, password) => {
  try {
    const response = await AxiosConfig.post("/api/User/login", { username, password });
    return response.data;
  } catch (error) {
    console.error("Login failed:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};