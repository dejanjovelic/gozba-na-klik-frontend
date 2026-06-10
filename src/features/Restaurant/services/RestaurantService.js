import React from "react";
import AxiosConfig from "../../../config/AxiosConfig";
import axios from "axios";

const RESOURCE = "api/restaurants"

export async function fetchPaginatedFilteredAndSortedRestaurants(chosenFilters, sortType, page, pageSize) {
    const response = await AxiosConfig.post(
        `${RESOURCE}/filterAndSortAndPaging?sortType=${sortType}&page=${page}&pageSize=${pageSize}`,
        chosenFilters
    )
    return response.data;
};

export async function fetchRestaurantSortType() {
    const response = await AxiosConfig.get(`${RESOURCE}/sortTypes`)
    return response.data;
};

export async function getRestaurantWithMeals(id) {
    const response = await AxiosConfig.get(`${RESOURCE}/${id}/meals`);
    return response.data;
};

export async function fetchTopRatedRestaurants() {
    const response = await AxiosConfig.get(`${RESOURCE}/top-rated`);
    return response.data;
};

export async function fetchAllRestaurants() {
    const response = await AxiosConfig.get(`${RESOURCE}`);
    return response.data;
};

export async function deleteRestaurant(id) {
    const response = await AxiosConfig.delete(`${RESOURCE}/${id}`);
    return response.data;
}

export async function fetchDaysOfTheWeek() {
    const response = await AxiosConfig.get(`${RESOURCE}/days-of-the-week`);
    return response.data;
}

export async function createRestaurant(restaurant) {
    const response = await AxiosConfig.post(`${RESOURCE}`, restaurant);
    return response.data;
}

export async function fetchRestaurantBasicData(restaurantId) {
    const response = await AxiosConfig.get(`${RESOURCE}/${restaurantId}/basic-data`);
    return response.data;
}

export async function updateRestaurant(restaurantId, restaurantData) {
    const response = await AxiosConfig.put(`${RESOURCE}/${restaurantId}`, restaurantData);
    return response.data;
}

export async function fetchAllRestaurantsFromOwner(userId) {
    const response = await AxiosConfig.get(`${RESOURCE}/by-owner?ownerId=${userId}`);
    return response.data;
}

export async function fetchRestaurantWithWorkingHoursAndNonWorkingDates(restaurantId) {
    const response = await AxiosConfig.get(`${RESOURCE}/${restaurantId}/with-working-time`);
    return response.data;
}

export async function updateRestaurantImageUrl(imageUrl, restaurantId) {
    const response = await AxiosConfig.patch(`${RESOURCE}/${restaurantId}/image-url`, imageUrl);
    return response.data;
}

export async function updateRestaurantBasicData(restaurantData, restaurantId) {
    const response = await AxiosConfig.put(`${RESOURCE}/${restaurantId}/basic-data`, restaurantData);
    return response.data;
}

export async function updateRestaurantWorkingHours(workingHors, restaurantId) {
    const response = await AxiosConfig.put(`${RESOURCE}/${restaurantId}/working-hours`, workingHors);
    return response.data;
}

export async function updateRestaurantNonWorkingDates(nonWorkingDates, restaurantId) {
    const response = await AxiosConfig.put(`${RESOURCE}/${restaurantId}/non-working-dates`, nonWorkingDates)
    return response.data;
}
