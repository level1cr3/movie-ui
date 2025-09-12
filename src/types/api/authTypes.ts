export type RegisterRequest = {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
};

export type VerifyEmailRequest = {
  userId: string;
  token: string;
};
