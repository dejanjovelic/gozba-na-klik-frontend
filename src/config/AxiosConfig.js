import axios from "axios";

const AxiosConfig = axios.create({
  baseURL: "https://localhost:7251/", 
});

export default AxiosConfig;