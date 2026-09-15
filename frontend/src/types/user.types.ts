import type { WithTimestamps } from "./index.types";

export type FriendRequestUser = {
  _id: string;
  fullName: string;
  profilePic: string;
  nativeLanguage: string;
  learningLanguage: string;
}

export type IncomingFriendRequest = {
  _id: string;
  sender: FriendRequestUser;
  receiver: string; // just _id
  status: "pending";
};

export type AcceptedFriendRequest = {
  _id: string;
  sender: Pick<FriendRequestUser, "_id" | "fullName" | "profilePic">;
  receiver: string;
  status: "accepted";
};

export type FriendRequestsResponse = {
  incomingRequests: WithTimestamps<IncomingFriendRequest>[];
  acceptedRequests: WithTimestamps<AcceptedFriendRequest>[];
};

export type OutgoingFriendRequestsResponse = {
  outgoingRequests: WithTimestamps<{
    _id: string;
    sender: string;
    receiver: FriendRequestUser;
    status: "pending"
  }>[];
};