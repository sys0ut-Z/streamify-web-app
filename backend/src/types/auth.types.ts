export type SignupRequest = {
  fullName: string;
  email: string;
  password: string;
}

export type LoginRequest = {
  email: string;
  password: string;
};

export type OnboardRequest = {
  fullName: string;
  bio: string;
  nativeLanguage: string;
  learningLanguage: string;
  location: string;
}