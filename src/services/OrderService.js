import AxiosConfig from "../config/axiosConfig";

const RESOURCE = "/api/orders";

export async function fetchCourierActiveOrder(courierId) {
    const response = await AxiosConfig.get(`${RESOURCE}/active?courierId=${courierId}`)
    return response.data;
}

export async function updateCourierActiveOrder(orderId, data) {
    const response = await AxiosConfig.put(`${RESOURCE}/${orderId}/status`, data)
    return response.data;
}

export async function getOrdersByOwnerId(ownerId) {
  const response = await AxiosConfig.get(`${RESOURCE}/orders/${ownerId}`);
  return response.data;
}

export async function editOrdersStatus(orderId, newStatus, newTime) {
  const payload = {
    newStatus,
    newTime: newTime || null,
  };
  const response = await AxiosConfig.put(
    `${RESOURCE}/orders/${orderId}`,
    payload
  );
  return response.data;
}

export async function createOrder(data) {
    const response = await AxiosConfig.post(RESOURCE, data);
    return response.data;
}

export async function cancelOrder(id) {
    const response = await AxiosConfig.patch(`${RESOURCE}/${id}/cancel`);
    return response.data;
}

export async function fetchCustomerActiveOrders() {
  const response = await AxiosConfig.get(`${RESOURCE}/active/customer`);
  return response.data;
}

export async function fetchCustomerInactiveOrders(page, pageSize) {
  const response = await AxiosConfig.get(`${RESOURCE}/inactive/customer?page=${page}&pageSize=${pageSize}`);
  return response.data;
}