import 'dotenv/config';
import { StreamChat } from "stream-chat";

const getStreamClient = () => {
  const apiKey = process.env.STREAM_API_KEY;
  const apiSecret = process.env.STREAM_API_SECRET;

  if (!apiKey || !apiSecret) {
    throw new Error("Missing Stream API key or secret");
  }

  return StreamChat.getInstance(apiKey, apiSecret);
};

export const streamClient = getStreamClient();
