"use client";

import { healthCheck } from "@/lib/clientApi";
import { useEffect, useState } from "react";

export const HealthChecker = () => {
  const [healthStatus, setHealthStatus] = useState<
    "checking" | "healthy" | "error" | "hidden"
  >("checking");

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const result = await healthCheck();
        if (result.status === "ok" || result.status === "healthy") {
          setHealthStatus("healthy");
        } else {
          setHealthStatus("error");
        }
      } catch (error) {
        console.error("Health check failed:", error);
        setHealthStatus("error");
      }
    };

    checkHealth();
  }, []);

  // Hide the notification after 3 seconds
  useEffect(() => {
    if (healthStatus === "healthy" || healthStatus === "error") {
      const timer = setTimeout(() => {
        setHealthStatus("hidden");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [healthStatus]);

  // Don't render anything if hidden
  if (healthStatus === "hidden") {
    return null;
  }

  if (healthStatus === "checking") {
    return (
      <div className='fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg transition-all duration-300'>
        <div className='flex items-center space-x-2'>
          <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
          <span>Checking API connection...</span>
        </div>
      </div>
    );
  }

  if (healthStatus === "healthy") {
    return (
      <div className='fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg transition-all duration-300 animate-in slide-in-from-top-2'>
        <div className='flex items-center space-x-2'>
          <svg
            className='h-4 w-4'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M5 13l4 4L19 7'
            />
          </svg>
          <span>API Connected</span>
        </div>
      </div>
    );
  }

  if (healthStatus === "error") {
    return (
      <div className='fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg transition-all duration-300 animate-in slide-in-from-top-2'>
        <div className='flex items-center space-x-2'>
          <svg
            className='h-4 w-4'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M6 18L18 6M6 6l12 12'
            />
          </svg>
          <span>API Connection Failed</span>
        </div>
      </div>
    );
  }

  return null;
};
