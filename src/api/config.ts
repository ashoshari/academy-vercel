import { getStoredTokens } from "@/services/auth";
import axios from "axios";

const axiosInstance = axios.create({
  // headers: {
  //   "Content-Type": "application/json",
  //   Accept: "application/json",
  // },
  // baseURL: "https://lms.vision-jo.com/",
});

const getBaseURL = () => {
  const hostname = window.location.hostname;

  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return "http://lms.vision-jo.com/"; // 🛠️ عدل البورت حسب الباك اند عندك
  }

  const cleanHost = hostname.replace(/^www\./, "");
  return `https://back.${cleanHost}/`;
};

axiosInstance.interceptors.request.use(
  (config) => {
    config.baseURL = getBaseURL();

    const token = getStoredTokens();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.log("Request Error:", error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error?.response?.data?.code === "token_not_valid") {
      localStorage.removeItem("auth_tokens");
      window.location.href = "/login";
    }

    if (error?.response?.data?.code === "user_not_found") {
      localStorage.removeItem("auth_tokens");
      window.location.href = "/login";
    }

    console.error("Response Error:", error?.response?.data?.code);
    return Promise.reject(error);
  }
);

export default axiosInstance;
