import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:8080",
    headers: {
        "Content-Type": "application/json"
    }
});


// ================================
// REQUEST INTERCEPTOR
// ================================

axiosInstance.interceptors.request.use(
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


// Prevent multiple session-expired popups
let isSessionExpired = false;


// ================================
// RESPONSE INTERCEPTOR
// ================================

axiosInstance.interceptors.response.use(

    (response) => response,

    (error) => {

        if (error.response?.status === 401) {

            const token = localStorage.getItem("token");

            // Only show session expired when
            // user previously had a token
            if (token && !isSessionExpired) {

                isSessionExpired = true;

                localStorage.removeItem("token");

                alert(
                    "Your session has expired. Please login again."
                );

                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);


export default axiosInstance;