import { getCurrentUser } from "@/lib/serverAuth";
import { redirect } from "next/navigation";

export default async function AuthGuard({
  children,
  requireAuth = false,
}: {
  children: React.ReactNode;
  requireAuth?: boolean;
}) {
  const user = await getCurrentUser();
  console.log("AuthGuard user:", user);
  if (requireAuth && !user) {
    redirect("/login");
  }
  return <>{children}</>;
}
