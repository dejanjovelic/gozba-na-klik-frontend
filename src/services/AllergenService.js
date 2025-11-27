import React from "react";
import AxiosConfig from "../config/axiosConfig";

const RESOURCE = "api/allergens";

export async function getAllAllergens() {
  const response = await AxiosConfig.get(RESOURCE);
  return response.data;
}
