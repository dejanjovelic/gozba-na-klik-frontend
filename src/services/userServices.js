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
    // Axios network error
    if (!error.response) {
      console.error("Network/server error:", error.message);
      throw new Error("Cannot reach server. Please try again later.");
    }

    // Axios response error (4xx/5xx)
    const message = error.response.data?.message || "Login failed";
    console.error("Login failed:", message);
    throw new Error(message);
  }
};

export async function GetAllUsers() {
  const response = await AxiosConfig.get(RESOURCE);
  return response.data;
}
