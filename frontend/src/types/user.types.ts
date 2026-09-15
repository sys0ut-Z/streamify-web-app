export type FriendRequestUser = {
  _id: string;
  fullName: string;
  profilePic: string;
  nativeLanguage: string;
  learningLanguage: string;
}

export type IncomingFriendRequest = {
  sender: FriendRequestUser;
  receiver: string; // just _id
  status: "pending";
};

export type AcceptedFriendRequest = {
  sender: Pick<FriendRequestUser, "_id" | "fullName" | "profilePic">;
  receiver: string;
  status: "accepted";
};

export type FriendRequestsResponse = {
  incomingRequests: IncomingFriendRequest[];
  acceptedRequests: AcceptedFriendRequest[];
};

export type OutgoingFriendRequestsResponse = {
  outgoingRequests: {
    sender: string;
    receiver: FriendRequestUser;
    status: "pending"
  }[];
};