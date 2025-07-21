"use client";
import uploadAnswer from "@/actions/dashboardAction";
import React, { useEffect, useRef, useState } from "react";

const AudioRecorder: React.FC = () => {
  const [recording, setRecording] = useState<boolean>(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [audioURL, setAudioURL] = useState<string | null>(null);
  // Remove audioChunks state, use a ref for chunk collection
  const audioChunksRef = useRef<Blob[]>([]);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Upload audio to backend
  const uploadAudio = async (audioBlob: Blob) => {
    try {
      // Send as webm since that's the actual format from MediaRecorder
      const file = new File([audioBlob], "pronunciation_input.webm", {
        type: "audio/webm",
      });
      const formData = new FormData();
      formData.append("audio", file); // Changed from "wav" to "audio"
      const response = await uploadAnswer(formData);
      console.log(response);
    } catch (error) {
      console.error("Error uploading audio:", error);
      alert("Failed to upload audio. Please try again.");
    }
  };

  const startRecording = async (): Promise<void> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        if (blob.size === 0) {
          console.error("Recording failed: Blob is empty or invalid", blob);
          alert("Recording failed. Please try again.");
          return;
        }
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
        // Send to backend after recording stops
        uploadAudio(blob);
      };

      setMediaRecorder(recorder);
      recorder.start();
      setRecording(true);
    } catch (err) {
      console.error("Failed to start recording", err);
      alert(
        "Failed to start recording. Please check microphone permissions and try again."
      );
    }
  };

  const stopRecording = async (): Promise<void> => {
    if (!mediaRecorder) return;
    setRecording(false);
    mediaRecorder.stop();
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
    }
  };

  return (
    <div className='p-4'>
      <button
        type='button'
        onClick={recording ? stopRecording : startRecording}
        className={`px-4 py-2 rounded-lg shadow ${
          recording ? "bg-red-500 text-white" : "bg-green-500 text-white"
        }`}
      >
        {recording ? "Stop Recording" : "Start Recording"}
      </button>

      {audioURL && (
        <div className='mt-4'>
          <h4 className='mb-2'>Playback</h4>
          <audio controls src={audioURL} />
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
