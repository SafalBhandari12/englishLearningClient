"use client";
import { registerAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import LoadingButton from "@/components/LoadingButton";
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
import { initialRegisterState } from "@/lib/authHelper";
import Link from "next/link";
import { useActionState, useState, useEffect } from "react";

export default function CardDemo() {
  const [isLoading, setIsLoading] = useState(false);
  const [state, formAction] = useActionState(
    registerAction,
    initialRegisterState,
  );

  const handleSubmit = (formData: FormData) => {
    setIsLoading(true);
    formAction(formData);
  };

  useEffect(() => {
    if (state.success || state.errors) {
      setIsLoading(false);
    }
  }, [state.success, state.errors]);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-background px-4">
      <form action={handleSubmit} className="w-full max-w-sm">
        {state.success && (
          <div className="text-green-500 text-center mb-4">{state.message}</div>
        )}
        {state.errors?.general && (
          <div className="text-red-500 text-center mb-4">
            {state.errors.general[0]}
          </div>
        )}
        <Card>
          <CardHeader>
            <CardTitle>Register </CardTitle>
            <CardDescription>
              Enter your email below to create a new account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  defaultValue={state?.values?.email}
                />
                {state.errors?.email && !state.success && (
                  <div className="text-red-500 text-sm">
                    {state.success}
                    {state.errors.email[0]}
                  </div>
                )}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="name">Name</Label>
                </div>
                <Input
                  id="name"
                  type="text"
                  name="name"
                  required
                  defaultValue={state?.values?.name}
                />
                {state.errors?.name && (
                  <div className="text-red-500 text-sm">
                    {state.errors.name[0]}
                  </div>
                )}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input id="password" type="password" name="password" required />
                {state.errors?.password && (
                  <div className="text-red-500 text-sm">
                    {state.errors.password[0]}
                  </div>
                )}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password_confirmation">
                    Confirm Password
                  </Label>
                </div>
                <Input
                  id="password_confirmation"
                  type="password"
                  name="password_confirmation"
                  required
                />
                {state.errors?.password_confirmation && (
                  <div className="text-red-500 text-sm">
                    {state.errors.password_confirmation[0]}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <LoadingButton
              isLoading={isLoading}
              type="submit"
              className="w-full py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 font-semibold"
            >
              Register
            </LoadingButton>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="underline underline-offset-4">
                Login
              </Link>
            </div>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
