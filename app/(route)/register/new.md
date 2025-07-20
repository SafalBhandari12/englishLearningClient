// lib/auth.ts
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface User {
  id: string;
  email: string;
  name: string;
  isVerified: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
  message?: string;
}

class AuthService {
  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}/auth${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'An error occurred');
    }

    return response.json();
  }

  async register(data: { name: string; email: string; password: string }) {
    return this.makeRequest('/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: { email: string; password: string }): Promise<AuthResponse> {
    return this.makeRequest('/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async verifyEmail(token: string) {
    return this.makeRequest(`/verify-email/${token}`, {
      method: 'GET',
    });
  }

  async resendVerificationEmail(email: string) {
    return this.makeRequest('/resend-verification-email', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async forgotPassword(email: string) {
    return this.makeRequest('/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token: string, password: string) {
    return this.makeRequest(`/reset-password/${token}`, {
      method: 'POST',
      body: JSON.stringify({ password }),
    });
  }

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    return this.makeRequest('/refresh-token', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  }

  async logout(refreshToken: string) {
    return this.makeRequest('/logout', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  }
}

export const authService = new AuthService();

// Token management functions
export async function getTokens(): Promise<AuthTokens | null> {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  if (!accessToken || !refreshToken) {
    return null;
  }

  return { accessToken, refreshToken };
}

export async function setTokens(tokens: AuthTokens) {
  const cookieStore = cookies();
  
  cookieStore.set('accessToken', tokens.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60, // 15 minutes
  });
  
  cookieStore.set('refreshToken', tokens.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
}

export async function removeTokens() {
  const cookieStore = cookies();
  cookieStore.delete('accessToken');
  cookieStore.delete('refreshToken');
}

export async function getCurrentUser(): Promise<User | null> {
  const tokens = await getTokens();
  
  if (!tokens) {
    return null;
  }

  try {
    // Decode JWT payload (basic implementation)
    const payload = JSON.parse(atob(tokens.accessToken.split('.')[1]));
    
    // Check if token is expired
    if (payload.exp * 1000 < Date.now()) {
      // Try to refresh token
      const newTokens = await authService.refreshToken(tokens.refreshToken);
      await setTokens(newTokens);
      
      // Decode new token
      const newPayload = JSON.parse(atob(newTokens.accessToken.split('.')[1]));
      return newPayload.user;
    }
    
    return payload.user;
  } catch (error) {
    console.error('Error getting current user:', error);
    await removeTokens();
    return null;
  }
}

export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/login');
  }
  
  return user;
}

// actions/auth.ts
'use server';

import { authService, setTokens, removeTokens, getTokens } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function registerAction(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    await authService.register({ name, email, password });
    return { success: true, message: 'Registration successful. Please check your email to verify your account.' };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Registration failed' };
  }
}

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    const response = await authService.login({ email, password });
    await setTokens(response.tokens);
    revalidatePath('/');
    redirect('/dashboard');
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Login failed' };
  }
}

export async function logoutAction() {
  try {
    const tokens = await getTokens();
    if (tokens) {
      await authService.logout(tokens.refreshToken);
    }
    await removeTokens();
    revalidatePath('/');
    redirect('/login');
  } catch (error) {
    console.error('Logout error:', error);
    await removeTokens();
    redirect('/login');
  }
}

export async function verifyEmailAction(token: string) {
  try {
    const response = await authService.verifyEmail(token);
    return { success: true, message: response.message || 'Email verified successfully' };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Email verification failed' };
  }
}

export async function resendVerificationAction(formData: FormData) {
  const email = formData.get('email') as string;

  try {
    const response = await authService.resendVerificationEmail(email);
    return { success: true, message: response.message || 'Verification email sent' };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to send verification email' };
  }
}

export async function forgotPasswordAction(formData: FormData) {
  const email = formData.get('email') as string;

  try {
    const response = await authService.forgotPassword(email);
    return { success: true, message: response.message || 'Password reset email sent' };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to send password reset email' };
  }
}

export async function resetPasswordAction(token: string, formData: FormData) {
  const password = formData.get('password') as string;

  try {
    const response = await authService.resetPassword(token, password);
    return { success: true, message: response.message || 'Password reset successful' };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Password reset failed' };
  }
}

// components/AuthGuard.tsx
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export default async function AuthGuard({ children, requireAuth = false }: AuthGuardProps) {
  const user = await getCurrentUser();

  if (requireAuth && !user) {
    redirect('/login');
  }

  if (!requireAuth && user) {
    redirect('/dashboard');
  }

  return <>{children}</>;
}

// components/LogoutButton.tsx
import { logoutAction } from '@/actions/auth';

export default function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button 
        type="submit" 
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Logout
      </button>
    </form>
  );
}

// app/register/page.tsx
import { registerAction } from '@/actions/auth';
import AuthGuard from '@/components/AuthGuard';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <AuthGuard requireAuth={false}>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Create your account
            </h2>
          </div>
          <form className="mt-8 space-y-6" action={registerAction}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Password"
              />
            </div>
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Register
              </button>
            </div>
            <div className="text-center">
              <Link href="/login" className="text-indigo-600 hover:text-indigo-500">
                Already have an account? Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </AuthGuard>
  );
}

// app/login/page.tsx
import { loginAction } from '@/actions/auth';
import AuthGuard from '@/components/AuthGuard';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <AuthGuard requireAuth={false}>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Sign in to your account
            </h2>
          </div>
          <form className="mt-8 space-y-6" action={loginAction}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Password"
              />
            </div>
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign in
              </button>
            </div>
            <div className="flex items-center justify-between">
              <Link href="/forgot-password" className="text-indigo-600 hover:text-indigo-500">
                Forgot your password?
              </Link>
              <Link href="/register" className="text-indigo-600 hover:text-indigo-500">
                Create account
              </Link>
            </div>
          </form>
        </div>
      </div>
    </AuthGuard>
  );
}

// app/dashboard/page.tsx
import { getCurrentUser } from '@/lib/auth';
import AuthGuard from '@/components/AuthGuard';
import LogoutButton from '@/components/LogoutButton';

export const revalidate = 0; // ISR: Revalidate on every request

export default async function DashboardPage() {
  const user = await getCurrentUser();

  return (
    <AuthGuard requireAuth={true}>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <LogoutButton />
              </div>
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Welcome back!</h2>
                <div className="space-y-2">
                  <p><strong>Name:</strong> {user?.name}</p>
                  <p><strong>Email:</strong> {user?.email}</p>
                  <p><strong>Verified:</strong> {user?.isVerified ? 'Yes' : 'No'}</p>
                </div>
                {!user?.isVerified && (
                  <div className="mt-4 p-4 bg-yellow-50 rounded-md">
                    <p className="text-yellow-800">
                      Please verify your email address to access all features.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}

// app/verify-email/[token]/page.tsx
import { verifyEmailAction } from '@/actions/auth';
import { redirect } from 'next/navigation';

interface VerifyEmailPageProps {
  params: {
    token: string;
  };
}

export default async function VerifyEmailPage({ params }: VerifyEmailPageProps) {
  const result = await verifyEmailAction(params.token);

  if (result.success) {
    redirect('/dashboard?verified=true');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Email Verification
          </h2>
          <div className="mt-4 p-4 bg-red-50 rounded-md">
            <p className="text-red-800">{result.error}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// app/forgot-password/page.tsx
import { forgotPasswordAction } from '@/actions/auth';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Forgot Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>
        <form className="mt-8 space-y-6" action={forgotPasswordAction}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Email address"
            />
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Send Reset Link
            </button>
          </div>
          <div className="text-center">
            <Link href="/login" className="text-indigo-600 hover:text-indigo-500">
              Back to Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

// app/reset-password/[token]/page.tsx
import { resetPasswordAction } from '@/actions/auth';
import { redirect } from 'next/navigation';

interface ResetPasswordPageProps {
  params: {
    token: string;
  };
}

export default async function ResetPasswordPage({ params }: ResetPasswordPageProps) {
  const handleResetPassword = async (formData: FormData) => {
    'use server';
    const result = await resetPasswordAction(params.token, formData);
    
    if (result.success) {
      redirect('/login?reset=true');
    }
    
    return result;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Reset Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your new password below.
          </p>
        </div>
        <form className="mt-8 space-y-6" action={handleResetPassword}>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="New password"
            />
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Reset Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'JWT Auth App',
  description: 'Next.js JWT Authentication with Access and Refresh Tokens',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}

// app/page.tsx
import { getCurrentUser } from '@/lib/auth';
import Link from 'next/link';

export const revalidate = 0; // ISR: Revalidate on every request

export default async function HomePage() {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">
              Welcome to JWT Auth App
            </h1>
            {user ? (
              <div className="space-y-4">
                <p className="text-xl text-gray-600">
                  Hello, {user.name}! You are logged in.
                </p>
                <Link
                  href="/dashboard"
                  className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Go to Dashboard
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xl text-gray-600">
                  Please sign in to access your account.
                </p>
                <div className="space-x-4">
                  <Link
                    href="/login"
                    className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="inline-block px-6 py-3 bg-gray-200 text-gray-900 rounded-md hover:bg-gray-300"
                  >
                    Create Account
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// app/globals.css
@tailwind base;
@tailwind components;
@tailwind utilities;

// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken');
  const refreshToken = request.cookies.get('refreshToken');
  
  // Protected routes
  const protectedRoutes = ['/dashboard'];
  const authRoutes = ['/login', '/register'];
  
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );
  
  const isAuthRoute = authRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );
  
  // If trying to access protected route without tokens
  if (isProtectedRoute && (!accessToken || !refreshToken)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // If trying to access auth routes while logged in
  if (isAuthRoute && accessToken && refreshToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
    '/register',
  ],
};

// .env.local
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXTAUTH_SECRET=your-secret-key-here