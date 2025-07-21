"use server";
import { authService } from "@/lib/auth";
import {
  LoginFormState,
  RegisterFormState,
  resendVerificationEmailActionType,
} from "../types/authType";
import {
  emailTokenValidationSchema,
  userLoginSchema,
  userRegistrationSchema,
  verifyEmail,
} from "@/validation/authValidation";
import { error } from "console";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getToken, removeToken, setToken } from "@/lib/serverAuth";
export async function registerAction(
  prevState: RegisterFormState,
  formData: FormData
): Promise<RegisterFormState> {
  const parsed = userRegistrationSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    password_confirmation: formData.get("password_confirmation"),
    role:"CANDIDATE"
  });
  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors,
      values: {
        name: formData.get("name")?.toString() || "",
        email: formData.get("email")?.toString() || "",
      },
    };
  }
  try {
    await authService.register(parsed.data);
    return {
      success: true,
      message:
        "Registration successful. Please check your email to verify your account.",
      errors: {},
      values: {
        name: "",
        email: "",
      },
    };
  } catch (err) {
    return {
      success: false,
      errors: {
        general: [err instanceof Error ? err.message : "Registration failed"],
      },
    };
  }
}
export async function loginAction(
  prevState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  const parsed = userLoginSchema.safeParse({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });
  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error?.flatten().fieldErrors,
      values: {
        email: (formData.get("email") as string) || "",
      },
    };
  }
  try {
    const response = await authService.login(parsed.data);
    await setToken(response.data.token);
    revalidatePath("/");
    return {
      success: true,
      message: "Login successful",
      errors: {},
      values: {
        email: "",
      },
    };
  } catch (err) {
    return {
      success: false,
      errors: {
        general: [err instanceof Error ? err.message : "Registration failed"],
      },
    };
  }
}
export async function verifyEmailAction(token: string) {
  const parsed = emailTokenValidationSchema.safeParse(token);

  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten(),
    };
  }

  try {
    const response = await authService.verifyEmail(token);
    return {
      success: true,
      message: response.message || "Email verified successfully",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Email Verification Failed",
    };
  }
}
export async function resendVerificationEmailAction(
  prevState: resendVerificationEmailActionType,
  formData: FormData
): Promise<resendVerificationEmailActionType> {
  const email = formData.get("email") as string;
  const parsedData = verifyEmail.safeParse({email});
  if (!parsedData.success) {
    return {
      success: false,
      errors: parsedData.error?.flatten().fieldErrors,
    };
  }

  try {
    const response = await authService.resendVerificationEmail(
      parsedData.data.email
    );
    return {
      success: true,
      message: response.message || "Verification email resent successfully",
      errors: {},
    };
  } catch (error) {
    return {
      success: false,
      errors: {
        general: [
          error instanceof Error
            ? error.message
            : "Failed to resend verification email",
        ],
      },
    };
  }
}

export async function logoutAction() {
  const tokens = await getToken();

  if (!tokens) {
    await removeToken();
    revalidatePath("/");
    return redirect("/login");
  }
  try {
    await authService.logout({ refreshToken: tokens.refreshToken });
  } catch (error) {
    console.log("There is some error with logout");
  }
  await removeToken();
  revalidatePath("/");
  return redirect("/");
}
