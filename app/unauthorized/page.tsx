// app/unauthorized/page.tsx
import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-slate-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold text-red-600">Unauthorized Access</h1>
        <div className="mb-4 rounded-md bg-red-50 p-4 text-sm">
          <div className="flex">
            <div className="ml-3">
              <p className="font-medium text-red-800">Access Denied</p>
              <p className="mt-2 text-red-700">
                You do not have permission to access this page. If you believe this is an error,
                please contact an administrator.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 hover:underline"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}