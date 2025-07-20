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
      <p className='text-red-800 text-2xl'>{state.message}</p>
      <form action={formAction} className='flex items-center gap-1'>
        <div>
          <textarea
            name='info'
            placeholder='..'
            className='border-2 w-72 h-44'
          />
        </div>
        <button type='submit'>Submit</button>
      </form>
    </div>
  );
}
