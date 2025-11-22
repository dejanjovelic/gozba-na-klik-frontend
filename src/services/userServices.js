import AxiosConfig from "../config/AxiosConfig";

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
