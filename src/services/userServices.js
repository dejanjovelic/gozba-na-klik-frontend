import AxiosConfig from "../config/axiosConfig";

const RESOURCE = "/api/users";
const RESOURCE1 = "api/auth"

export const login = async (username, password) => {
  const response = await AxiosConfig.post(`${RESOURCE1}/login`, {
    username,
    password,
  });
  return response.data;
};

export async function GetAllUsers() {
  const response = await AxiosConfig.get(RESOURCE);
  return response.data;
}

export async function resendActivatonEmail(username) {
  const response = await AxiosConfig.post(`${RESOURCE1}/resend-confirmation-email?username=${username}`);
  return response.data;
}

export async function forgotPassword(data) {
  const response = await AxiosConfig.post(`${RESOURCE1}/forgot-password`, data);
  return response.data;
}

export async function resetPassword(data) {
  const response = await AxiosConfig.post(`${RESOURCE1}/reset-password`, data);
  return response.data;
}
