import React from "react";
import AxiosConfig from "../config/AxiosConfig";

const RESOURCE = "api/restaurants"

export async function fetchPaginatedFilteredAndSortedRestaurants(chosenFilters, sortType, page, pageSize) {
    const response = await AxiosConfig.post(
        `${RESOURCE}/filterAndSortAndPaging?sortType=${sortType}&page=${page}&pageSize=${pageSize}`,
        chosenFilters
    )
    return response.data;
}

export async function fetchRestaurantSortType() {
    const response = await AxiosConfig.get(`${RESOURCE}/sortTypes`)
    return response.data;
}

export async function getRestaurantWithMeals(id) {
    const response = await AxiosConfig.get(`${RESOURCE}/${id}/meals`);
    return response.data;
}