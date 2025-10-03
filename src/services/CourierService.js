import React from "react";
import AxiosConfig from "../config/AxiosConfig";
const RESOURCE = "/api/couriers";

export async function createCourier(data) {
    const response = await AxiosConfig.post(`${RESOURCE}`, data,
        {headers:{"Content-Type":"application/json"}})
    return response.data;
}