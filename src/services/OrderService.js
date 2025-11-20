import AxiosConfig from "../config/AxiosConfig";
const RESOURCE = "/api/orders";
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
