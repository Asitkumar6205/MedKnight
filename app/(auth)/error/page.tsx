// app/auth/error/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams?.get('error');

  let errorMessage = 'An unknown error occurred';
  let description = 'Please try again later or contact support.';

  if (error === 'pending_approval') {
    errorMessage = 'Account Pending Approval';
    description = 'Your account has been verified but is still awaiting administrator approval. You will receive an email notification once your account has been approved.';
  } else if (error === 'account_suspended') {
    errorMessage = 'Account Suspended';
    description = 'Your account has been suspended. Please contact an administrator for more information.';
  } else if (error === 'CredentialsSignin') {
    errorMessage = 'Invalid Credentials';
    description = 'The email or password you entered is incorrect. Please try again.';
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-slate-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold text-red-600">{errorMessage}</h1>
        <div className="mb-4 rounded-md bg-red-50 p-4 text-sm">
          <div className="flex">
            <div className="ml-3">
              <p className="mt-2 text-red-700">{description}</p>
            </div>
          </div>
        </div>
        <div className="mt-6 text-center">
          <Link
            href="/signin"
            className="text-blue-600 hover:text-blue-800 hover:underline"
          >
            Return to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}