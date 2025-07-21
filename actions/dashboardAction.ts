"use server";

import { apiClient } from "@/lib/api";

export default async function uploadAnswer(file: FormData) {
  console.log("Before response");
  const response = await apiClient.sendAnswerForm(file);
  console.log(response);
  console.log("After ressponse");
}
