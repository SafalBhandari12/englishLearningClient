"use client";

import { completeRegistrationAction } from "@/actions/completeRegistrationAction";
import { formState } from "@/types/completeRegistration";
import { useActionState } from "react";

const initialState: formState = {
  success: false,
  conversaton: [
    {
      bot: "",
      human: "",
    },
  ],
  message: "Write something about you.What are you interest and hobbies",
};

export default function CompleteRegistrationForm() {
  const [state, formAction] = useActionState<formState, FormData>(
    completeRegistrationAction,
    initialState
  );

  return (
    <div>
      <p className='text-blue-700 text-base font-medium mb-4 text-center'>
        {state.message}
      </p>
      <form action={formAction} className='flex flex-col gap-4'>
        <textarea
          name='info'
          placeholder='Write about your interests, hobbies, goals...'
          className='border border-blue-200 rounded-lg p-4 w-full h-32 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none text-gray-800 bg-blue-50/30 shadow-sm transition'
        />
        <button
          type='submit'
          className='w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg shadow hover:from-blue-700 hover:to-purple-700 transition-colors'
        >
          Submit
        </button>
      </form>
    </div>
  );
}
