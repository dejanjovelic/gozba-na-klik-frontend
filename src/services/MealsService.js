import React from "react";
import AxiosConfig from "../config/axiosConfig";

const RESOUSRCE = "/api/meals";

export async function fetchFilteredMeals(request, page, pageSize) {
    const response = await AxiosConfig.post(`${RESOUSRCE}/filter?page=${page}&pageSize=${pageSize}` ,request)
    return response.data;
}

export async function fetchAllMeals() {
    const response = await AxiosConfig.get(`${RESOUSRCE}`)
    return response.data;
}