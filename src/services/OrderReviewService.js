import AxiosConfig from "../config/axiosConfig";

const RESOURCE = "api/OrderReview";

export async function createOrderReviewAsync(data) {
  const response = await AxiosConfig.post(RESOURCE, data);
  return response.data;
}
