import axios, { Axios } from "axios";

const AxiosConfig = axios.create({
    baseURL: "https://localhost:7251/",
});
AxiosConfig.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

AxiosConfig.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.log('You are not authorized, please login again.');
        }
        return Promise.reject(error);
    }
);

export default AxiosConfig;