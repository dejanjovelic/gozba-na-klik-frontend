import React from "react";
import AxiosConfig from "../config/AxiosConfig";


const RESOURCE = "/api/customers";

export async function createCustomer(data) {
    const response = await AxiosConfig.post(`${RESOURCE}`, data,
        { headers: { "Content-Type": "application/json" } })
    return response.data;
}

export async function getCustomerAllergens(id) {
    const response = await AxiosConfig.get(`${RESOURCE}/${id}/allergens`);
    return response.data;
}

export async function updateCustomersAllergens(id, allergenIds) {
    const response = await AxiosConfig.put(`${RESOURCE}/${id}/allergens`, allergenIds);
    return response.data;
}
