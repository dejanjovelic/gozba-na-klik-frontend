import axios from "axios";

let AxiosConfig = axios.create({
    baseURL:"https://localhost:7251",
})
export default AxiosConfig;