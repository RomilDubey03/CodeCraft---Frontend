import axios from "axios";

const axiosClient = axios.create({
    baseURL: "https://code-craft-frontend-hwrf.vercel.app/api/v1",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
});

export default axiosClient;
