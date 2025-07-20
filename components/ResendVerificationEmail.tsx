"use client";

import {
  resendVerificationEmailAction,
  verifyEmailAction,
} from "@/actions/auth";
import { useActionState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

type VerifyEmailResult = Awaited<ReturnType<typeof verifyEmailAction>>;

const initialVerifyEmailState = {
  success: false,
  message: "",
  errors: {} as Record<string, string[]>,
};
export default function ResendVerificationEmail({
  result,
}: {
  result?: VerifyEmailResult;
}) {
  const [state, setState] = useActionState(
    resendVerificationEmailAction,
    initialVerifyEmailState
  );
  return (
    <div className='space-y-4'>
      {!state.success &&
        state.errors &&
        Object.keys(state.errors).length == 0 && (
          <p className='text-red-900'>{result?.message}</p>
        )}
      {state.success && <div className='text-green-500'>{state.message}</div>}
      {state.errors?.general && (
        <div className='text-red-500 text-sm'>{state.errors.general[0]}</div>
      )}

      <div className='border-t pt-4'>
        <h2 className='text-lg font-semibold mb-2'>
          Resend Verification Email
        </h2>
        <form action={setState} className='space-y-4'>
          <div>
            <Input
              name='email'
              type='email'
              placeholder='Enter your email address'
              required
              className='w-full'
            />
          </div>
          {state.errors?.email && (
            <div className='text-red-500 text-sm'>{state.errors.email[0]}</div>
          )}
          <Button type='submit' className='w-full'>
            Resend Verification Email
          </Button>
        </form>
      </div>
    </div>
  );
}
