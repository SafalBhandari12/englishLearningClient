import { redirect } from "next/navigation";
import { authService } from "./auth";
import { getToken, removeToken } from "./serverAuth";

export type UserInfoResponse = {
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
};

export type sendAnswerApiResponse = {
  success: boolean;
  url: string;
  recognizedText: string;
  assessment: Assessment;
};

export type Assessment = {
  recognizedText: string;
  accuracyScore: number;
  pronunciationScore: number;
  fluencyScore: number;
  completenessScore: number;
};

export type ChatHistoryItemSchema = {
  bot: string;
  createdAt: string;
  user: string;
  userAudio: string;
  id: string;
};

export type GetChatHistoryResponseSchema = {
  success: boolean;
  data: ChatHistoryItemSchema[];
  nextCursor: string | null;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

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
