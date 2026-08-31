import { streamClient } from "../lib/stream";

interface User {
  id: string;
  name: string;
  image: string;
}

export const upsertStreamUser = async (userData: User) => {
  try {
    await streamClient.upsertUsers([userData]);
    return userData;
  } catch (error) {
    console.error("Error creating Stream user: ", error);
  }
}

export const generateStreamToken = (userId: string) => {
  try {
    const streamToken = streamClient.createToken(userId);
    return streamToken;
  } catch (error) {
    console.error("Error creating Stream token: ", error);
    throw error;
  }
}