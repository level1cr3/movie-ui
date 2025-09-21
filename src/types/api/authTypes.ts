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

export type ResendVerifyEmailRequest = {
  email: string;
};

export type ForgotPasswordRequest = {
  email: string;
};

/*
hey represent different intentions in your API:
ResendVerifyEmailRequest → tied to account verification flow.
ForgotPasswordRequest → tied to password recovery flow.

*/
