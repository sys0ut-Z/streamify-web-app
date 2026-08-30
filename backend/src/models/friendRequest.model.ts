import mongoose, { InferSchemaType } from "mongoose";

const friendRequestSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending"
  }
}, { timestamps: true });

export type FriendRequest = InferSchemaType<typeof friendRequestSchema>;
const FriendRequestModel = mongoose.model<FriendRequest>("FriendRequest", friendRequestSchema);

export default FriendRequestModel;