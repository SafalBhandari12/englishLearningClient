"use client";

import { UserInfoResponse } from "@/lib/api";
import AudioRecorder from "./AudioRecorder";

export default function Dashboard({
  response,
}: {
  response: UserInfoResponse;
}) {
  // Tasks
  // 1) Allow user to record the wav audio
  // 2) Upload the audio to the answer endpoint and get next questions.
  // 3) Also update the score cards

  console.log("Dashboard Response ");
  console.log(response);
  return (
    <div className='flex flex-col '>
      <div className='flex justify-center gap-10'>
        <p>Accuracy Score: {response.user?.candidate?.accuracyScore}</p>
        <p>
          Pronounciation Score: {response.user?.candidate?.pronounciationScore}
        </p>
        <p>Fleuncy Score: {response.user?.candidate?.fluencyScore}</p>
        <p>Completeness Score: {response.user?.candidate?.completenessScore}</p>
      </div>
      <div className='flex flex-col px-9 gap-y-2 my-2'>
        <p className='self-end bg-gray-600 rounded-md max-w-max px-3 py-1 text-right text-white'>
          {response.user?.candidate?.nextQuestion}
        </p>
        <input className=' border-2' placeholder='Answer..' />
        <AudioRecorder />
      </div>
    </div>
  );
}
