import axios from "axios";

const axiosClient = axios.create({
    baseURL: "https://code-craft-frontend-hwrf.vercel.app/",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
});

export default axiosClient;
