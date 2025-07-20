export type RegisterFormState = {
  success: boolean;
  message?: string;
  errors: {
    name?: string[];
    email?: string[];
    password?: string[];
    password_confirmation?: string[];
    general?: string[];
  };
  values?: {
    name?: string;
    email?: string;
  };
};

export type LoginFormState = {
  success: boolean;
  message?: string;
  errors: {
    email?: string[];
    password?: string[];
    general?: string[];
  };
  values?: {
    email?: string;
  };
};

export type resendVerificationEmailActionType = {
  success: boolean;
  message?: string;
  errors?: {
    email?: string[];
    general?: string[];
  };
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type User = {
  id: string;
  email: string;
  name: string;
  role: "CANDIDATE" | "COMPANY";
};

export type tokenPayload = {
  userId: string;
  type: "access" | "refresh";
  role: "CANDIDATE"|"COMPANY";
  iat: number;
  exp: number;
};
