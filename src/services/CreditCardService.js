import AxiosConfig from "../config/axiosConfig";

const RESOURCE = "/api/customers";

export async function getCreditCards(customerId) {
    const response = await AxiosConfig.get(`${RESOURCE}/${customerId}/credit-cards`);
    return response.data;
}

export async function createCreditCard(customerId, data) {
    const response = await AxiosConfig.post(`${RESOURCE}/${customerId}/credit-cards`, data);
    return response.data;
}

export async function updateCreditCard(customerId, creditCardId, data) {
    const response = await AxiosConfig.put(`${RESOURCE}/${customerId}/credit-cards/${creditCardId}`, data);
    return response.data;
}

export async function deleteCreditCard(customerId, creditCardId) {
    const response = await AxiosConfig.delete(`${RESOURCE}/${customerId}/credit-cards/${creditCardId}`);
    return response.data;
}
