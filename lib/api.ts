import { redirect } from "next/navigation";
import { authService } from "./auth";
import { getToken, removeToken } from "./serverAuth";

// Re-export types for backwards compatibility
export type {
  UserInfoResponse,
  sendAnswerApiResponse,
  Assessment,
  ChatHistoryItemSchema,
  GetChatHistoryResponseSchema,
} from "@/types/apiTypes";

import type {
  UserInfoResponse,
  sendAnswerApiResponse,
  Assessment,
  ChatHistoryItemSchema,
  GetChatHistoryResponseSchema,
} from "@/types/apiTypes";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://englishlearningserver.onrender.com/api";

class ApiClient {
  private async makeRequest(endPoint: string, options: RequestInit = {}) {
    const tokens = await getToken();
    if (!tokens) {
      redirect("/login");
    }

    const url = `${API_BASE_URL}/${endPoint}`;

    // Build headers, omitting Content-Type for FormData bodies
    const headers: Record<string, string> = {
      Authorization: `Bearer ${tokens.accessToken}`,
      ...(options.headers as Record<string, string>),
    };
    if (!(options.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      try {
        const newTokens = await authService.refreshToken(tokens.refreshToken);
        // Retry original request with new access token
        const retryHeaders: Record<string, string> = {
          Authorization: `Bearer ${newTokens.accessToken}`,
          ...(options.headers as Record<string, string>),
        };
        if (!(options.body instanceof FormData)) {
          retryHeaders["Content-Type"] = "application/json";
        }
        const retryResponse = await fetch(url, {
          ...options,
          headers: retryHeaders,
        });
        return retryResponse.json();
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
    user?: { userId: string; type: string; role: "CANDIDATE" | "COMPANY" };
  }> {
    return this.makeRequest("protected");
  }

  async userInfo(): Promise<UserInfoResponse> {
    return this.makeRequest("user");
  }

  async completeRegistration(
    info: string
  ): Promise<{ success: boolean; message: string }> {
    return this.makeRequest("user/register", {
      method: "POST",
      body: JSON.stringify({ info }),
    });
  }

  async sendAnswerForm(formData: FormData): Promise<sendAnswerApiResponse> {
    return this.makeRequest("user/answer", {
      method: "POST",
      body: formData,
    });
  }

  async getChatHistory(): Promise<GetChatHistoryResponseSchema> {
    return this.makeRequest("user/chatHistory");
  }
}

export const apiClient = new ApiClient();
