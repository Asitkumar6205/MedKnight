"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";

const FormSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
});

type FormData = z.infer<typeof FormSchema>;

export default function ForgotPassword() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit = async (values: FormData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      // Redirect to sign-in with success message
      router.push("/signin?passwordResetSent=true");
    } catch (err: unknown) {
      console.error("Error:", err);
      setError(
        err instanceof Error ? err.message : "Failed to send password reset email"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-stone-100 p-6">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center text-stone-800 mb-6">
          Forgot Password
        </h2>

        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}

        <p className="text-stone-600 text-center mb-6">
          Enter your email address and we&apos;ll send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-stone-700">Email</label>
            <Input
              type="email"
              placeholder="Email"
              {...register("email")}
              className="w-full px-3 py-2 border rounded-md"
            />
            {errors.email?.message && (
              <p className="text-red-500 text-sm">
                {String(errors.email.message)}
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
                Sending...
              </div>
            ) : (
              "Send Reset Link"
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
    </div>
  );
}