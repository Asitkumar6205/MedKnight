// app/error/page.tsx
'use client'

import { useSearchParams } from 'next/navigation'
import Link from "next/link";

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const message = searchParams?.get('message') || 'An error occurred';

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-red-600">
            Error
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {message}
          </p>
        </div>
        <div className="mt-5 text-center">
          <Link href="/signin" className="font-medium text-blue-600 hover:text-blue-500">
            Return to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}