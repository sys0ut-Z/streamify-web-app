export type FriendRequestUser = {
  _id: string;
  fullName: string;
  profilePic: string;
  nativeLanguage: string;
  learningLanguage: string;
}

export type IncomingFriendRequest = FriendRequestUser & {
  status: "pending";
};

export type AcceptedFriendRequest = {
  _id: string;
  fullName: string;
  profilePic: string;
  status: "accepted";
};

export type FriendRequestsResponse = {
  incomingRequests: IncomingFriendRequest[];
  acceptedRequests: AcceptedFriendRequest[];
};

export type OutgoingFriendRequestsResponse = {
  outgoingRequests: FriendRequestUser[];
};