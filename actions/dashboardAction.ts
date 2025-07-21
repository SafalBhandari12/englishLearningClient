"use server";

import { apiClient } from "@/lib/api";
import { redirect } from "next/navigation";

export async function uploadAnswer(file: FormData) {
  console.log("Before response");
  const response = await apiClient.sendAnswerForm(file);
  console.log(response);
  console.log("After ressponse");
}

export async function getResponse() {
  const response = await apiClient.userInfo();

  if (
    response.success === false &&
    response.message === "User not registered"
  ) {
    redirect("/completeRegistration");
  }
  return response;
}

export async function getChatHistory() {
  return await apiClient.getChatHistory();
}
