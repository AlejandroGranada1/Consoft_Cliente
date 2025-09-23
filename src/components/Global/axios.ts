import axios from "axios";

const base_url = "https://consoft-api.onrender.com";
const dev_url = "http://localhost:3001"

const api = axios.create({
    baseURL: dev_url,
    withCredentials: true,
})

export default api;