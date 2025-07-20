"use client";
import { loginAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { initialLoginState } from "@/lib/authHelper";

export default function CardDemo() {
  const router = useRouter();
  const [state, formAction] = useActionState(loginAction, initialLoginState);

  useEffect(() => {
    if (state.success) {
      router.push("/dashboard");
    }
  }, [state.success, router]);
  return (
    <div className='min-h-[calc(100vh-4rem)] flex items-center justify-center bg-background px-4'>
      <form action={formAction} className='w-full max-w-sm'>
        {state.success && (
          <div className='text-green-500 text-center mb-4'>{state.message}</div>
        )}
        {state.errors?.general && (
          <div className='text-red-500 text-center mb-4'>
            {state.errors.general[0]}
          </div>
        )}
        <Card>
          <CardHeader>
            <CardTitle>Login </CardTitle>
            <CardDescription>
              Enter your email and password to Login
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='flex flex-col gap-3'>
              <div className='grid gap-2'>
                <Label htmlFor='email'>Email</Label>
                <Input
                  id='email'
                  name='email'
                  type='email'
                  placeholder='m@example.com'
                  required
                  defaultValue={state?.values?.email}
                />
                {state.errors?.email && !state.success && (
                  <div className='text-red-500 text-sm'>
                    {state.success}
                    {state.errors.email[0]}
                  </div>
                )}
              </div>

              <div className='grid gap-2'>
                <div className='flex items-center'>
                  <Label htmlFor='password'>Password</Label>
                </div>
                <Input id='password' type='password' name='password' required />
                {state.errors?.password && (
                  <div className='text-red-500 text-sm'>
                    {state.errors.password[0]}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className='flex-col gap-2'>
            <Button type='submit' className='w-full'>
              Login
            </Button>
            <div className='mt-4 text-center text-sm'>
              Don&apos;t have an account?{" "}
              <Link href='/register' className='underline underline-offset-4'>
                Register
              </Link>
            </div>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
