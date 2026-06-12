import React from "react";
import AxiosConfig from "../config/axiosConfig";
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