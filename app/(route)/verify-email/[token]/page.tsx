import { verifyEmailAction } from "@/actions/auth";
import { redirect } from "next/navigation";
import ResendVerificationEmail from "@/components/ResendVerificationEmail";

interface VerifyEmailPageProps {
  params: Promise<{
    token: string;
  }>;
}
export default async function VerifyEmailPage({
  params,
}: VerifyEmailPageProps) {
  const { token } = await params;
  const result = await verifyEmailAction(token);

  if (result.success) {
    redirect("/login");
  }
  return (
    <div className='container mx-auto px-4 py-8 max-w-md'>
      <h1 className='text-2xl font-bold mb-4'>Verify Email</h1>
      {!result.success && <ResendVerificationEmail result={result} />}
    </div>
  );
}
