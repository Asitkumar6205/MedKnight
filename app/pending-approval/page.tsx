// app/pending-approval/page.tsx
import Link from "next/link";

export default function PendingApprovalPage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-slate-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold">Email Verified Successfully</h1>
        <div className="mb-4 rounded-md bg-blue-50 p-4 text-sm">
          <div className="flex">
            <div className="ml-3">
              <p className="font-medium text-blue-800">Account Pending Approval</p>
              <p className="mt-2 text-blue-700">
                Your email has been verified successfully. Your account is now pending administrator
                approval. You will receive an email notification once your account has been
                approved.
              </p>
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