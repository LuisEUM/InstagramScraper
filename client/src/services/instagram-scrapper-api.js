import axios from "axios";

const http = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:4000/api/v1",
  withCredentials: true,
});


http.interceptors.response.use(
  function (response) {
    return response.data;
  },
  function (error) {
    if (error?.response?.status === 401 || window.location.pathname !== "/login") {
      console.error("unauthenticated, redirect to login");
      localStorage.clear();
      window.location.replace("/login");
    }

    return Promise.reject(error);
  }
);