import axios from "axios";

export const configApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL!,
});
