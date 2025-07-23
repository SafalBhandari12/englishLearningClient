"use client";

import { getChatHistory, getResponse } from "@/actions/dashboardAction";
import AudioRecorder from "@/components/AudioRecorder";
import ScoreCard from "@/components/ScoreCards";
import {
  GetChatHistoryResponseSchema,
  UserInfoResponse,
} from "@/types/apiTypes";
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
    <div className='min-h-screen'>
      <div className='container mx-auto px-4 py-8 max-w-6xl'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>
            Learning Dashboard
          </h1>
        </div>

        {/* Score Cards */}
        <div className='mb-8'>
          {scores ? (
            <ScoreCard candidate={scores.user?.candidate} />
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className='bg-white rounded-xl p-6 shadow-sm border animate-pulse'
                >
                  <div className='h-4 bg-gray-200 rounded mb-2'></div>
                  <div className='h-8 bg-gray-200 rounded'></div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Current Question */}
        {scores && (
          <div className='mb-8'>
            <div className='bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow'>
              <h2 className='text-xl font-semibold mb-3 flex items-center text-gray-900'>
                <div className='w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3'>
                  <svg
                    className='w-4 h-4 text-blue-600'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                    />
                  </svg>
                </div>
                Next Question
              </h2>
              <p className='text-lg leading-relaxed text-gray-700'>
                {scores.user?.candidate?.nextQuestion}
              </p>
            </div>
          </div>
        )}

        {/* Audio Recorder */}
        <div className='mb-8'>
          <AudioRecorder onUploadComplete={fetchData} />
        </div>

        {/* Conversation History */}
        {chatHistory?.data && chatHistory.data.length > 0 && (
          <div className='bg-white rounded-xl shadow-sm border'>
            <div className='p-6 border-b border-gray-200'>
              <h2 className='text-xl font-semibold text-gray-900 flex items-center'>
                <svg
                  className='w-5 h-5 mr-2'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
                Conversation History
              </h2>
              <p className='text-gray-600 mt-1'>
                Review your recent practice sessions
              </p>
            </div>

            <div className='p-6 space-y-4 max-h-96 overflow-y-auto'>
              {[...chatHistory.data]
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((item, index) => (
                <div
                  key={item.id}
                  className='border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow'
                >
                  <div className='flex items-start space-x-3 mb-3'>
                    <div className='w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0'>
                      <svg
                        className='w-4 h-4 text-blue-600'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                        />
                      </svg>
                    </div>
                    <div className='flex-1'>
                      <div className='flex items-center mb-1'>
                        <span className='font-semibold text-blue-600 text-sm'>
                          AI Tutor
                        </span>
                      </div>
                      <p className='text-gray-800 leading-relaxed'>
                        {item.bot}
                      </p>
                    </div>
                  </div>

                  <div className='flex items-start space-x-3 mb-3'>
                    <div className='w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0'>
                      <svg
                        className='w-4 h-4 text-green-600'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                        />
                      </svg>
                    </div>
                    <div className='flex-1'>
                      <div className='flex items-center mb-1'>
                        <span className='font-semibold text-green-600 text-sm'>
                          You
                        </span>
                      </div>
                      <p className='text-gray-800 leading-relaxed mb-2'>
                        {item.user}
                      </p>
                      {item.userAudio && (
                        <audio controls src={item.userAudio} className='w-full'>
                          Your browser does not support the audio element.
                        </audio>
                      )}
                    </div>
                  </div>

                  <div className='flex items-center justify-between text-xs text-gray-500 mt-3 pt-3 border-t border-gray-100'>
                    <span>Session #{chatHistory.data.length - index}</span>
                    <span>{new Date(item.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
