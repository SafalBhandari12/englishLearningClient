import AuthGuard from "@/components/AuthGuard";
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
      <div className='flex flex-col items-center justify-center h-screen'>
        <h1 className='text-4xl font-bold mb-4'>Dashboard</h1>
        <p className='text-lg'>Welcome to your dashboard</p>
        <p className='text-lg'>This is protected route. {user.user?.role}</p>
      </div>
    </AuthGuard>
  );
}
