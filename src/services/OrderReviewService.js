import React from "react";
import AxiosConfig from "../config/axiosConfig";

const RESOURCE = "/api/OrderReview";

export async function fetchRestaurantReviewsPaginated(restaurantId, page) {
  const response = await AxiosConfig.post(`${RESOURCE}/paging`, { restaurantId, page })
  return response.data;
}

export async function createOrderReviewAsync(data) {
  const response = await AxiosConfig.post(RESOURCE, data);
  return response.data;
}
