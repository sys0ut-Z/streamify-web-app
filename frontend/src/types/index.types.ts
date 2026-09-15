export type ApiResponse<T> = {
  data: T;
  message: string;
};

export type WithTimestamps<T> = T & {
  createdAt: Date;
  updatedAt: Date;
};