import AuthGuard from "@/components/AuthGuard";
import Dashboard from "@/components/Dashboard";
import { apiClient } from "@/lib/api";
import { redirect } from "next/navigation";

const apiUrl = process.env.NEXT_PUBLIC_API_URL!;

export default async function dashboardPage() {
  const user = await apiClient.protectedEndpoint();
  const response = await apiClient.userInfo();

  if (
    response.success === false &&
    response.message === "User not registered"
  ) {
    redirect("/completeRegistration");
  }


  return (
    <AuthGuard requireAuth={true}>
      <Dashboard response={response} />
    </AuthGuard>
  );
}
