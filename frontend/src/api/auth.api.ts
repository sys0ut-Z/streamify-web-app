import { axiosInstance } from "../lib/axios";
import type { LoginRequest, SignupRequest } from "../schema/auth.schema";
import { type OnboardRequest, type User } from "../types/auth.types";
import type { ApiResponse } from "../types/index.types";
import { handleApiError } from "../util/handleApiError";

export const checkAuth = async () => {
  try {
    const res = await axiosInstance.get<User>("/auth/me");
    // console.log(res.data);
    return res.data;
  } catch (error) {
    handleApiError(error);
  }
}

export const signup = async (request: SignupRequest) => {
  try {
    const res = await axiosInstance.post<ApiResponse<Omit<User, "password">>>("/auth/signup", request);
    return res.data;
  } catch (error) {
    handleApiError(error);
  }
}

export const login = async (request: LoginRequest) => {
  try {
    const res = await axiosInstance.post<ApiResponse<Omit<User, "password">>>("/auth/login", request);
    return res.data;
  } catch (error) {
    handleApiError(error);
  }
}

export const onboard = async (userData: OnboardRequest) => {
  try {
    const formData = new FormData();

    formData.append('fullName', userData.fullName);
    formData.append('bio', userData.bio ?? '');
    formData.append('nativeLanguage', userData.nativeLanguage);
    formData.append('learningLanguage', userData.learningLanguage);
    formData.append('location', userData.location);

    if(userData.profilePic) {
      formData.append('profilePic', userData.profilePic);
    }

    await axiosInstance.post('/auth/onboard', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  } catch (error) {
    handleApiError(error);
  }
}