import { axiosInstance } from "../lib/axios";
import { type User } from "../types/auth.types";

export const checkAuth = async () => {
  try {
    const res = await axiosInstance.get<User>("/api/auth/me");
    return res.data;
  } catch (error) {
    console.error("Error checking auth: ", error);
  }
}