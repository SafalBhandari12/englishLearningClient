import { AuthTokens, tokenPayload } from "@/types/authType";
import { cookies } from "next/headers";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";
class AuthService {
  private async makeRequest(endPoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}/auth/${endPoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "An error occurred");
    }
    return response.json();
  }

  async register(data: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
  }) {
    return this.makeRequest("register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async verifyEmail(token: string) {
    return this.makeRequest(`verify-email/${token}`, {
      method: "GET",
    });
  }

  async resendVerificationEmail(email: string) {
    return this.makeRequest(`resend-verification-email`, {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }
  async login(data: { email: string; password: string }) {
    return this.makeRequest("login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }
  async refreshToken(refreshToken: string) {
    return this.makeRequest("refresh-token", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    });
  }
  async logout(data: { refreshToken: string }) {
    return this.makeRequest("logout", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }
}

export const authService = new AuthService();

export async function setToken(tokens: AuthTokens) {
  const cookieStore = cookies();
  (await cookieStore).set("accessToken", tokens.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60, //15 mins
  });
  (await cookieStore).set("refreshToken", tokens.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60,
  });
}

export async function getToken(): Promise<AuthTokens | null> {
  const cookie = cookies();
  const accessToken = (await cookie).get("accessToken")?.value;
  const refreshToken = (await cookie).get("refreshToken")?.value;
  if (!accessToken || !refreshToken) return null;
  return { accessToken, refreshToken };
}

export async function removeToken() {
  const cookie = cookies();
  (await cookie).delete("accessToken");
  (await cookie).delete("refreshToken");
}

export async function getCurrentUser() {
  const tokens = await getToken();

  if (!tokens) return null;

  try {
    const payload = JSON.parse(
      atob(tokens.accessToken.split(".")[1])
    ) as tokenPayload;
    if (payload.exp * 1000 < Date.now()) {
      const newTokens = await authService.refreshToken(tokens.refreshToken);

      await setToken(newTokens);
      const newPayload = JSON.parse(
        atob(newTokens.accessToken.split(".")[1])
      ) as tokenPayload;

      return newPayload.userId;
    }
    return payload.userId;
  } catch (error) {
    console.error("Error decoding access token:", error);
    await removeToken();
    return null;
  }
}
