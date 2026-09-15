import { axiosInstance } from "../lib/axios";
import type { LoginRequest, SignupRequest } from "../schema/auth.schema";
import { type OnboardRequest, type User } from "../types/auth.types";
import type { ApiResponse } from "../types/index.types";
import { handleApiError } from "../util/handleApiError";

export const checkAuth = async () => {
  try {
    const res = await axiosInstance.get<ApiResponse<User>>("/auth/me");
    return res.data.data;
  } catch (error) {
    handleApiError(error);
  }
}

export const signup = async (request: SignupRequest) => {
  try {
    const res = await axiosInstance.post<ApiResponse<User>>("/auth/signup", request);
    return res.data.data;
  } catch (error) {
    handleApiError(error);
  }
}

export const login = async (request: LoginRequest) => {
  try {
    const res = await axiosInstance.post<ApiResponse<User>>("/auth/login", request);
    return res.data.data;
  } catch (error) {
    handleApiError(error);
  }
}

export const logout = async () => {
  try {
    await axiosInstance.post<ApiResponse<null>>("/auth/logout");
  } catch (error) {
    handleApiError(error);
  }
}

export const onboard = async (userData: OnboardRequest) => {
  try {
    await axiosInstance.post<void>('/auth/onboard', userData);
  } catch (error) {
    handleApiError(error);
  }
}