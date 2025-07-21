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

  // Tasks
  // 1) Allow user to record the wav audio
  // 2) Upload the audio to the answer endpoint and get next questions.
  // 3) Also upload the score charts

  console.log("Dashboard Response ");
  console.log(response);
  return (
    <AuthGuard requireAuth={true}>
      <div className='flex flex-col '>
        <div className='flex justify-center gap-10'>
          <p>Accuracy Score: {response.user?.candidate?.accuracyScore}</p>
          <p>
            Pronounciation Score:{" "}
            {response.user?.candidate?.pronounciationScore}
          </p>
          <p>Fleuncy Score: {response.user?.candidate?.fluencyScore}</p>
          <p>
            Completeness Score: {response.user?.candidate?.completenessScore}
          </p>
        </div>
        <div className='flex flex-col px-9 gap-y-2 my-2'>
          <p className='self-end bg-gray-600 rounded-md max-w-max px-3 py-1 text-right text-white'>
            {response.user?.candidate?.nextQuestion}
          </p>
          <input className=' border-2' placeholder='Answer..' />
        </div>
      </div>
    </AuthGuard>
  );
}
