import React from "react";
import AxiosConfig from "../config/AxiosConfig";

const RESOURCE = "/api/orders";

export async function createOrder(data) {
    const response = await AxiosConfig.post(RESOURCE, data);
    return response.data;
}

export async function cancelOrder(id) {
    const response = await AxiosConfig.patch(`${RESOURCE}/${id}/cancel`);
    return response.data;
}