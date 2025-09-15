import axios from "axios";

// Create an axios instance
const API = axios.create({
  baseURL: "http://localhost:8000", 
  headers: {
    "Content-Type": "application/json",
  },
});


export default API;