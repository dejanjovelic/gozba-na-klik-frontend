import AxiosConfig from "../config/axiosConfig";

const RESOURCE = "/api/user";

export const login = async (username, password) => {
  try {
    const response = await AxiosConfig.post(`${RESOURCE}/login`, {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Login failed:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

export async function GetAllUsers() {
  const response = await AxiosConfig.get(RESOURCE);
  return response.data;
}
