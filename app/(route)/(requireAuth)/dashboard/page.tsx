"use client";

import { getChatHistory, getResponse } from "@/actions/dashboardAction";
import AudioRecorder from "@/components/AudioRecorder";
import { GetChatHistoryResponseSchema, UserInfoResponse } from "@/lib/api";
import { useEffect, useState } from "react";

export default function dashboardPage() {
  const [scores, setScore] = useState<UserInfoResponse | null>(null);
  const [chatHistory, setHistory] =
    useState<GetChatHistoryResponseSchema | null>(null);
  useEffect(() => {
    const fetchResponse = async () => {
      const scoresResponse = await getResponse();

      const chatHistoryResponse = await getChatHistory();

      setHistory(chatHistoryResponse);
      setScore(scoresResponse);
    };
    fetchResponse();
  }, []);

  return (
    <>
      <div className='flex flex-col '>
        {scores === null ? (
          <p>Loading</p>
        ) : (
          <>
            <div className='flex justify-center gap-10'>
              <p>Accuracy Score: {scores.user?.candidate?.accuracyScore}</p>
              <p>
                Pronounciation Score:
                {scores.user?.candidate?.pronounciationScore}
              </p>
              <p>Fleuncy Score: {scores.user?.candidate?.fluencyScore}</p>
              <p>
                Completeness Score: {scores.user?.candidate?.completenessScore}
              </p>
            </div>
          </>
        )}

        {/* Render chat history */}
        {chatHistory && chatHistory.data && chatHistory.data.length > 0 && (
          <div className='mt-8 flex flex-col gap-4 px-9'>
            <h2 className='text-xl font-semibold mb-2'>Conversation History</h2>
            {chatHistory.data.map((item) => (
              <div
                key={item.id}
                className='border rounded-lg p-4 bg-white shadow'
              >
                <div className='mb-2'>
                  <span className='font-bold text-blue-700'>Bot:</span>{" "}
                  {item.bot}
                </div>
                <div className='mb-2'>
                  <span className='font-bold text-green-700'>You:</span>{" "}
                  {item.user}
                </div>
                {item.userAudio && (
                  <audio controls src={item.userAudio} className='mt-2'>
                    Your browser does not support the audio element.
                  </audio>
                )}
                <div className='text-xs text-gray-400 mt-2'>
                  {new Date(item.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
        {scores !== null && (
          <div className='flex flex-col px-9 gap-y-2 my-2'>
            <p className='self-end bg-gray-600 rounded-md max-w-max px-3 py-1 text-right text-white'>
              {scores.user?.candidate?.nextQuestion}
            </p>
          </div>
        )}
      </div>
      <AudioRecorder />
    </>
  );
}
