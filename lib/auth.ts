const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL; ;

console.log(API_BASE_URL);
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
