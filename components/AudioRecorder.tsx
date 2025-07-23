"use client";
import { uploadAnswer } from "@/actions/dashboardAction";
import React, { useEffect, useRef, useState } from "react";

interface AudioRecorderProps {
  onUploadComplete: () => void;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ onUploadComplete }) => {
  const [recording, setRecording] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [duration, setDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const uploadAudio = async (blob: Blob) => {
    setUploading(true);
    try {
      const file = new File([blob], "pronunciation_input.webm", {
        type: "audio/webm",
      });
      const formData = new FormData();
      formData.append("audio", file);
      await uploadAnswer(formData);

      // 🔄 Trigger a parent re‑fetch
      onUploadComplete();
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        uploadAudio(blob);
        setDuration(0);
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setRecording(true);

      // Start duration timer
      intervalRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Cannot start recording:", err);
      alert("Please check your microphone permissions and try again.");
    }
  };

  const stopRecording = () => {
    if (!mediaRecorderRef.current) return;
    mediaRecorderRef.current.stop();
    setRecording(false);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className='bg-white rounded-xl shadow-sm border p-6'>
      <div className='text-center'>
        <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center justify-center'>
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
              d='M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z'
            />
          </svg>
          Voice Practice
        </h3>

        {recording && (
          <div className='mb-4'>
            <div className='inline-flex items-center space-x-2 bg-red-50 text-red-700 px-4 py-2 rounded-full'>
              <div className='w-3 h-3 bg-red-500 rounded-full animate-pulse'></div>
              <span className='font-medium'>
                Recording: {formatDuration(duration)}
              </span>
            </div>
          </div>
        )}

        {uploading && (
          <div className='mb-4'>
            <div className='inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full'>
              <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600'></div>
              <span className='font-medium'>Processing your answer...</span>
            </div>
          </div>
        )}

        <div className='flex justify-center space-x-4'>
          <button
            onClick={recording ? stopRecording : startRecording}
            disabled={uploading}
            className={`
              flex items-center space-x-2 px-6 py-3 rounded-full font-semibold transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
              ${
                recording
                  ? "bg-red-500 hover:bg-red-600 text-white shadow-lg ring-2 ring-red-200"
                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg ring-2 ring-blue-200 hover:ring-blue-300"
              }
            `}
          >
            {recording ? (
              <>
                <svg
                  className='w-5 h-5'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 10h6v4H9z'
                  />
                </svg>
                <span>Stop Recording</span>
              </>
            ) : (
              <>
                <svg
                  className='w-5 h-5'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z'
                  />
                </svg>
                <span>Start Recording</span>
              </>
            )}
          </button>
        </div>

        <p className='text-sm text-gray-500 mt-4'>
          {recording
            ? "Speak clearly into your microphone. Click stop when finished."
            : "Click the button above to start recording your answer."}
        </p>
      </div>
    </div>
  );
};

export default AudioRecorder;
