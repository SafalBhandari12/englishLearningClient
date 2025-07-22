"use client";

import { getChatHistory, getResponse } from "@/actions/dashboardAction";
import AudioRecorder from "@/components/AudioRecorder";
import { GetChatHistoryResponseSchema, UserInfoResponse } from "@/lib/api";
import { useCallback, useEffect, useState } from "react";

export default function DashboardPage() {
  const [scores, setScores] = useState<UserInfoResponse | null>(null);
  const [chatHistory, setHistory] =
    useState<GetChatHistoryResponseSchema | null>(null);

  // 1️⃣ Extract your fetch logic into a stable callback
  const fetchData = useCallback(async () => {
    try {
      const [scoresResponse, chatHistoryResponse] = await Promise.all([
        getResponse(),
        getChatHistory(),
      ]);
      setScores(scoresResponse);
      setHistory(chatHistoryResponse);
    } catch (err) {
      console.error("Failed to load dashboard data", err);
    }
  }, []);

  // 2️⃣ Call it on mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className='flex flex-col'>
      {scores ? (
        <div className='flex justify-center gap-10'>
          <p>Accuracy Score: {scores.user?.candidate?.accuracyScore}</p>
          <p>
            Pronunciation Score: {scores.user?.candidate?.pronounciationScore}
          </p>
          <p>Fluency Score: {scores.user?.candidate?.fluencyScore}</p>
          <p>Completeness Score: {scores.user?.candidate?.completenessScore}</p>
        </div>
      ) : (
        <p>Loading…</p>
      )}

      {chatHistory?.data && chatHistory.data.length > 0 && (
        <div className='mt-8 flex flex-col gap-4 px-9'>
          <h2 className='text-xl font-semibold mb-2'>Conversation History</h2>
          {chatHistory.data.map((item) => (
            <div
              key={item.id}
              className='border rounded-lg p-4 bg-white shadow'
            >
              <div className='mb-2'>
                <span className='font-bold text-blue-700'>Bot:</span> {item.bot}
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

      {scores && (
        <div className='flex flex-col px-9 gap-y-2 my-2'>
          <p className='self-end bg-gray-600 rounded-md max-w-max px-3 py-1 text-right text-white'>
            {scores.user?.candidate?.nextQuestion}
          </p>
        </div>
      )}

      {/* 3️⃣ Pass fetchData down as onUploadComplete */}
      <AudioRecorder onUploadComplete={fetchData} />
    </div>
  );
}