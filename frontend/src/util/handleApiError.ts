import axios from "axios"

export const handleApiError = (error: any) => {
  if (axios.isAxiosError(error)){
    throw new Error(error.response?.data.message || "Something went wrong");
  }
  throw error;
}