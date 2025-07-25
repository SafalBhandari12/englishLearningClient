"use server";

import { apiClient } from "@/lib/api";
import { formState } from "@/types/completeRegistration";
import { redirect } from "next/navigation";

export async function completeRegistrationAction(
  prevState: formState,
  formData: FormData
): Promise<formState> {
  "use server";

  const info = formData.get("info") as string;

  // Copy previous conversation to avoid mutation
  const updatedConversation = [...prevState.conversaton];

  // Add the last bot/human exchange
  updatedConversation[updatedConversation.length - 1] = {
    bot: prevState.message,
    human: info,
  };

  // Call API
  const response = await apiClient.completeRegistration(info);
  console.log(response);

  if (response.success === true) {
    redirect("/dashboard");
  }

  // Prepare next bot prompt (response.message) for next round
  updatedConversation.push({
    bot: response.message,
    human: "",
  });

  return {
    success: response.success,
    message: response.message,
    conversaton: updatedConversation,
  };
}
