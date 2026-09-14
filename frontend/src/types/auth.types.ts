export type User = {
  _id: string;
  fullName: string;
  email: string;
  bio: string;
  profilePic: string;
  isOnboarded: boolean;
  nativeLanguage: string;
  learningLanguage: string;
  location: string;
  friends?: string[];
}

export type OnboardRequest = {
  fullName: string;
  bio: string;
  nativeLanguage: string;
  learningLanguage: string;
  location: string;
  profilePic: string;
};