"use client";
import { useState, Suspense } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";

const FormSchema = z
  .object({
    password: z.string().min(8, "Password must have at least 8 characters"),
    confirmPassword: z.string().min(8, "Password must have at least 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof FormSchema>;

// Loading fallback component
function ResetPasswordFallback() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-stone-100 p-6">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold text-stone-800 mb-4">Loading...</h2>
        <div className="flex justify-center">
          <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
        </div>
      </div>
    </div>
  );
}

// Main component that uses useSearchParams
function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get("token");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit = async (values: FormData) => {
    if (!token) {
      setError("Invalid or expired token");
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password: values.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      // Redirect to sign-in with success message
      router.push("/signin?passwordReset=true");
    } catch (err: unknown) {
      console.error("Error:", err);
      setError(
        err instanceof Error ? err.message : "Failed to reset password"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold text-stone-800 mb-4">Invalid Link</h2>
        <p className="text-stone-600 mb-6">
          The password reset link is invalid or has expired.
        </p>
        <Link
          href="/forgot-password"
          className="text-blue-600 hover:underline"
        >
          Request a new reset link
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-center text-stone-800 mb-6">
        Reset Password
      </h2>

      {error && (
        <p className="text-red-500 text-sm text-center mb-4">{error}</p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="relative">
          <label className="block text-stone-700">New Password</label>
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="New Password"
            {...register("password")}
            className="w-full px-3 py-2 border rounded-md"
          />
          <span
            className="absolute right-3 top-8 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="text-stone-500 hover:text-stone-700" size={20} />
            ) : (
              <Eye className="text-stone-500 hover:text-stone-700" size={20} />
            )}
          </span>
          {errors.password?.message && (
            <p className="text-red-500 text-sm">
              {String(errors.password.message)}
            </p>
          )}
        </div>
        
        <div className="relative">
          <label className="block text-stone-700">Confirm Password</label>
          <Input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            {...register("confirmPassword")}
            className="w-full px-3 py-2 border rounded-md"
          />
          <span
            className="absolute right-3 top-8 cursor-pointer"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? (
              <EyeOff className="text-stone-500 hover:text-stone-700" size={20} />
            ) : (
              <Eye className="text-stone-500 hover:text-stone-700" size={20} />
            )}
          </span>
          {errors.confirmPassword?.message && (
            <p className="text-red-500 text-sm">
              {String(errors.confirmPassword.message)}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <Loader2 className="animate-spin h-5 w-5 mr-2" />
              Resetting...
            </div>
          ) : (
            "Reset Password"
          )}
        </Button>
      </form>

      <div className="text-center mt-4">
        <Link
          href="/signin"
          className="text-blue-600 text-sm hover:underline"
        >
          Back to Sign In
        </Link>
      </div>
    </div>
  );
}

// Main component that provides the Suspense boundary
export default function ResetPassword() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-stone-100 p-6">
      <Suspense fallback={<ResetPasswordFallback />}>
        <ResetPasswordContent />
      </Suspense>
    </div>
  );
}