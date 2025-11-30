import React from "react";
import AxiosConfig from "../config/axiosConfig";
import { Axios } from "axios";

const RESOUSRCE = "/api/orderReview";

export async function fetchRestaurantReviewsPaginated(restaurantId, page) {
    const response = await AxiosConfig.post(`${RESOUSRCE}/paging`, {restaurantId, page})
    return response.data;
}