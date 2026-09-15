import { axiosInstance } from "../lib/axios";
import type { User } from "../types/auth.types";
import type { ApiResponse } from "../types/index.types";
import type { FriendRequestsResponse, FriendRequestUser, OutgoingFriendRequestsResponse } from "../types/user.types";
import { handleApiError } from "../util/handleApiError"

export const getRecommendedUsers = async () => {
  try {
    const res = await axiosInstance.get<ApiResponse<User[]>>("/users/recommended");
    return res.data.data;
  } catch (error) {
    handleApiError(error);
  }
}

export const getUserFriends = async () => {
  try {
    const res = await axiosInstance.get<ApiResponse<FriendRequestUser[]>>("/users/friends");
    return res.data.data;
  } catch (error) {
    handleApiError(error);
  }
}

export const getFriendRequests = async () => {
  try {
    const res = await axiosInstance.get<ApiResponse<FriendRequestsResponse>>("/users/friend-requests");
    return res.data.data;
  } catch (error) {
    handleApiError(error);
  }
}

export const getOutgoingFriendRequests = async () => {
  try {
    const res = await axiosInstance.get<ApiResponse<OutgoingFriendRequestsResponse>>("/users/outgoing-friend-requests");
    return res.data.data.outgoingRequests;
  } catch (error) {
    handleApiError(error);
  }
}

export const sendFriendRequest = async (recipientId: string) => {
  try {
    await axiosInstance.post<void>(`/users/friend-request/${recipientId}`);
  } catch (error) {
    handleApiError(error);
  }
}

export const acceptFriendRequest = async (recipientId: string) => {
  try {
    const res = await axiosInstance.put<ApiResponse<null>>(`/users/friend-request/accept/${recipientId}`);
    return res.data.message;
  } catch (error) {
    handleApiError(error);
  }
}

export const rejectFriendRequest = async (recipientId: string) => {
  try {
    await axiosInstance.put<void>(`/users/friend-request/reject/${recipientId}`);
  } catch (error) {
    handleApiError(error);
  }
}