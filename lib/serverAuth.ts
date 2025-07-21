import { AuthTokens, tokenPayload } from "@/types/authType";
import { cookies } from "next/headers";
import { authService } from "./auth";

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
