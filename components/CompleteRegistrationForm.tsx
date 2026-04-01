"use client";

import { completeRegistrationAction } from "@/actions/completeRegistrationAction";
import { formState } from "@/types/completeRegistration";
import { useActionState, useEffect, useState } from "react";
import LoadingButton from "@/components/LoadingButton";

const initialState: formState = {
  success: false,
  conversaton: [
    {
      bot: "",
      human: "",
    },
  ],
  message:
    "Write something about you. What are you interested in and what are your hobbies?",
};

export default function CompleteRegistrationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [state, formAction] = useActionState<formState, FormData>(
    completeRegistrationAction,
    initialState,
  );

  useEffect(() => {
    if (state.success || state.message !== initialState.message) {
      setIsLoading(false);
    }
  }, [state.success, state.message]);

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    formAction(formData);
  };

  return (
    <div className="space-y-6 animate-form-in">
      {/* Status message */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-200/20 to-amber-100/20 rounded-xl blur group-hover:blur-md transition-all duration-300" />
        <div className="relative bg-gradient-to-r from-orange-50/80 to-amber-50/80 backdrop-blur-sm rounded-xl p-4 border border-orange-100/40">
          <p
            className="text-amber-900/75 text-center font-medium text-sm md:text-base"
            style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
          >
            {state.message}
          </p>
        </div>
      </div>

      {/* Form */}
      <form action={handleSubmit} className="space-y-5">
        <div className="relative group">
          {/* Animated gradient border effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-orange-300/40 via-amber-200/20 to-orange-200/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />

          <textarea
            name="info"
            placeholder="Share your story... What lights you up? What languages do you speak? What are your goals? Tell us everything!"
            className="relative w-full h-40 p-6 bg-white/90 backdrop-blur-sm rounded-lg border-4 border-amber-900 focus:border-orange-600 focus:outline-none resize-none text-amber-900 placeholder-amber-700 transition-all duration-200 font-light leading-relaxed text-base"
            style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
          />

          {/* Character counter */}
          <div className="absolute bottom-3 right-4 text-xs text-orange-400/60 font-medium">
            {state.message.length}/1000
          </div>
        </div>

        {/* Submit button */}
        <LoadingButton
          isLoading={isLoading}
          type="submit"
          className="w-full py-4 px-6 relative group overflow-hidden rounded-lg border-4 border-amber-900 font-black text-lg text-white transition-all duration-200 hover:translate-y-1 active:scale-95"
          style={{
            background: "#eb6f0f",
            fontFamily: '"Plus Jakarta Sans", sans-serif',
          }}
        >
          <span className="relative flex items-center justify-center gap-2">
            Continue to Learning
            <span className="text-xl">→</span>
          </span>
        </LoadingButton>

        {/* Encouragement text */}
        <p
          className="text-center text-xs text-orange-800/50 pt-2"
          style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
        >
          ✨ Your information helps us create a personalized learning experience
          just for you
        </p>
      </form>

      <style jsx>{`
        @keyframes form-in {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-form-in {
          animation: form-in 0.6s ease-out 0.2s both;
        }
      `}</style>
    </div>
  );
}
