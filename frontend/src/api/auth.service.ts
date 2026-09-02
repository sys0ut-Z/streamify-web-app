import { axiosInstance } from "../lib/axios";
import type { SignupRequest } from "../schema/auth.schema";
import { type User } from "../types/auth.types";
import type { ApiResponse } from "../types/index.types";

export const checkAuth = async () => {
  try {
    const res = await axiosInstance.get<User>("/auth/me");
    // console.log(res.data);
    return res.data;
  } catch (error) {
    console.error("Error checking auth: ", error);
    throw error;
  }
}

export const signup = async (request: SignupRequest) => {
  try {
    const res = await axiosInstance.post<ApiResponse<Omit<User, "password">>>("/auth/signup", request);
    return res.data;
  } catch (error) {
    console.error("Error signing up: ", error);
    throw error;
  }
}