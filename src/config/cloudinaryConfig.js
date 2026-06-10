import axios from "axios";

const clodinaryConfig = axios.create({
  baseURL: "https://api.cloudinary.com/",
});

export default clodinaryConfig;
