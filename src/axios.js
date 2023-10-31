import axios from "axios";

const apiHost = process.env.REACT_APP_API_HOST;

// Create an Axios instance with a base URL
export const axiosAPI = axios.create({
  baseURL: apiHost,
  withCredentials: true,
});

