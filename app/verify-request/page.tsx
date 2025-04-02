import React from "react";
import Link from "next/link";

export default function VerifyRequest() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight">
            Check your email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            A sign in link has been sent to your email address.
          </p>
        </div>
        <div className="mt-5 text-center">
          <p className="text-sm text-gray-500">
            Please check your email (including spam folder) for a verification link.
          </p>
          <p className="mt-4 text-sm">
            <Link href="/signin" className="font-medium text-blue-600 hover:text-blue-500">
              Return to sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}