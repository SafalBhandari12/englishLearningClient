// Client-safe API functions that don't require server-side cookies

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
// Health check API function (no authentication required)
export const healthCheck = async (): Promise<{
  status: string;
  message?: string;
}> => {
  try {
    const url = `${API_BASE_URL}/health`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    // Transform the actual API response to match expected format
    if (result.success === true) {
      return { status: "healthy", message: result.message };
    } else {
      return {
        status: "error",
        message: result.message || "Health check failed",
      };
    }
  } catch (error) {
    console.error("Health check failed:", error);
    return { status: "error", message: "Health check failed" };
  }
};
