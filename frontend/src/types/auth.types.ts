export type User = {
  _id: string;
  fullName: string;
  email: string;
  password: string;
  bio: string;
  profilePic: string;
  isOnboarded: boolean;
  nativeLanguage: string;
  learningLanguage: string;
  friends?: string[];
}