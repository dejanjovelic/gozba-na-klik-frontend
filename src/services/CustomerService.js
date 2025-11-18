import React from "react";
import AxiosConfig from "../config/axiosConfig";


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
export async function getAddresses(customerId) {
    const response = await AxiosConfig.get(`${RESOURCE}/${customerId}/addresses`);
    return response.data;
}

export async function createAddress(customerId, data) {
    const response = await AxiosConfig.post(`${RESOURCE}/${customerId}/addresses`, data);
    return response.data;
}

export async function updateAddress(customerId, addressId, data) {
    const response = await AxiosConfig.put(`${RESOURCE}/${customerId}/addresses/${addressId}`, data);
    return response.data;
}

export async function deleteAddress(customerId, addressId) {
    const response = await AxiosConfig.delete(`${RESOURCE}/${customerId}/addresses/${addressId}`);
    return response.data;
}
