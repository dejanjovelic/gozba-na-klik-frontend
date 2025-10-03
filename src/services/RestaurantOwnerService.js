import React from "react";
import AxiosConfig from "../config/AxiosConfig";
const RESOURCE = "/api/restaurantowners";

export async function createRestaurantOwner(data) {
    const response = await AxiosConfig.post(`${RESOURCE}`, data,
        {headers:{"Content-Type":"application/json"}})
    return response.data;
}