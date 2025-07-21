import { redirect } from "next/navigation";
import { authService } from "./auth";
import { getToken, removeToken } from "./serverAuth";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";

class ApiClient {
  private async makeRequest(endPoint: string, options: RequestInit = {}) {
    const tokens = await getToken();
    if (!tokens) {
      redirect("/login");
    }

    const url = `${API_BASE_URL}/${endPoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokens.accessToken}`,
        ...options.headers,
      },
    });
    if (response.status === 401) {
      try {
        const newTokens = await authService.refreshToken(tokens.refreshToken);
        return fetch(url, {
          ...options,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${newTokens.accessToken}`,
            ...options.headers,
          },
        });
      } catch {
        await removeToken();
        window.location.href = "/login";
      }
    }
    return response.json();
  }
  async protectedEndpoint(): Promise<{
    success: boolean;
    message: string;
    user?: {
      userId: string;
      type: string;
      role: "CANDIDATE" | "COMPANY";
    };
  }> {
    return this.makeRequest("protected");
  }
  async userInfo(): Promise<{
    success: boolean;
    message: string;
    user?: {
      email: string;
      name: string;
      emailVerified: boolean;
      role: string;
      candidate: {
        context: string;
        accuracyScore: number;
        pronounciationScore: number;
        fluencyScore: number;
        completenessScore: number;
        nextQuestion: string;
      } | null;
    };
  }> {
    return this.makeRequest("user");
  }

  async completeRegistration(info: string): Promise<{
    success: boolean;
    message: string;
  }> {
    return this.makeRequest("user/register", {
      method: "POST",
      body: JSON.stringify({ info }),
    });
  }
}

export const apiClient = new ApiClient();
