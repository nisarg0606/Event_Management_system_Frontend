import axios from "axios";

//To call un-authenticated APIs
const instance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}`,
  headers: {
    "Content-Type": "application/json",
  },
});

//To call authenticated APIs
export const axiosAuth = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}`,
  headers: { "Content-Type": "application/json" },
});

export default instance;
