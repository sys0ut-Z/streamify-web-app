import 'dotenv/config';
import { StreamChat } from "stream-chat";
import { AppError } from '../utils/AppError';

const getStreamClient = () => {
  const apiKey = process.env.STREAM_API_KEY;
  const apiSecret = process.env.STREAM_API_SECRET;

  if (!apiKey || !apiSecret) {
    throw new AppError("Missing Stream API key or secret");
  }

  return StreamChat.getInstance(apiKey, apiSecret);
};

// ! without tokens, you cannot actually send messages, do audio calls, video calls
const generateStreamToken = (userId: string) => {
  try {
    return streamClient.createToken(userId);
  } catch (error) {
    console.error("Error creating Stream token: ", error);
    throw error;
  }
}
export const streamClient = getStreamClient();
