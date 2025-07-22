"use client";
import { uploadAnswer } from "@/actions/dashboardAction";
import React, { useEffect, useRef, useState } from "react";

interface AudioRecorderProps {
  onUploadComplete: () => void;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ onUploadComplete }) => {
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const uploadAudio = async (blob: Blob) => {
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
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setRecording(true);
    } catch (err) {
      console.error("Cannot start recording:", err);
      alert("Check your microphone and permissions.");
    }
  };

  const stopRecording = () => {
    if (!mediaRecorderRef.current) return;
    mediaRecorderRef.current.stop();
    setRecording(false);
    streamRef.current?.getTracks().forEach((t) => t.stop());
  };

  return (
    <div className='p-4'>
      <button
        onClick={recording ? stopRecording : startRecording}
        className={`px-4 py-2 rounded-lg shadow ${
          recording ? "bg-red-500 text-white" : "bg-green-500 text-white"
        }`}
      >
        {recording ? "Stop Recording" : "Start Recording"}
      </button>
    </div>
  );
};

export default AudioRecorder;