import AxiosConfig from "../config/axiosConfig";

const RESOURCE = "/api/orders";

export async function fetchCourierActiveOrder(courierId) {
    const response = await AxiosConfig.get(`${RESOURCE}/active?courierId=${courierId}`)
    return response.data;
}

export async function updateCourierActiveOrder(orderId, courierId, data) {
    const response = await AxiosConfig.put(`${RESOURCE}/${orderId}/status?courierId=${courierId}`, data)
    return response.data;
}