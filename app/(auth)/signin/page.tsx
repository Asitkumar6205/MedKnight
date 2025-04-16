"use client";
import Link from "next/link";
import { useState, Suspense, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

const FormSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z.string().min(8, "Password must have at least 8 characters"),
  rememberMe: z.boolean().optional(),
});

type FormData = z.infer<typeof FormSchema>;

// Loading fallback component
function SignInFallback() {
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
function SignInContent() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [signUpLoading, setSignUpLoading] = useState(false);
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      rememberMe: false,
    },
  });

  const searchParams = useSearchParams();
  const verified = searchParams?.get("verified") === "true";
  const needsVerification = searchParams?.get("needsVerification") === "true";
  const passwordResetSent = searchParams?.get("passwordResetSent") === "true";

  const onSubmit = async (values: FormData) => {
    setLoading(true);
    setError(null);
    try {
      // Store email in localStorage if rememberMe is checked
      if (values.rememberMe) {
        localStorage.setItem("rememberedEmail", values.email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      const signInData = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
        // Pass the rememberMe value to the signIn function
        callbackUrl: "/admin",
        remember: values.rememberMe,
      });

      if (signInData?.error) {
        if (signInData.error.includes("pending_approval")) {
          router.push("/auth/error?error=pending_approval");
          return;
        } else if (signInData.error.includes("account_suspended")) {
          router.push("/auth/error?error=account_suspended");
          return;
        } else if (signInData.error.includes("CredentialsSignin")) {
          setError("Invalid email or password. Please try again.");
        } else {
          setError("An unexpected error occurred. Please try again later.");
        }
      } else {
        router.refresh();
        // Redirect based on user role
        const userData = await fetch("/api/me").then((res) => res.json());
        if (userData?.user?.role === "ADMIN") {
          router.push("/admin");
        } else {
          router.push("/admin");
        }
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Load remembered email on component mount
  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      setValue("email", rememberedEmail);
    }
  }, []);

  useEffect(() => {
    const callbackUrl = searchParams?.get("callbackUrl");
    
    // Check if the callbackUrl is exactly http://localhost:3000
    if (callbackUrl === "http://localhost:3000") {
      // Remove the callbackUrl parameter by redirecting to /signin without it
      router.replace("/signin");
    }
  }, [searchParams, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-stone-100 p-6 relative">
      {verified && (
        <div className="rounded-md bg-green-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-green-400"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">
                Email verified successfully
              </h3>
              <div className="mt-2 text-sm text-green-700">
                <p>Your account has been created. You can now sign in.</p>
              </div>
            </div>
          </div>
        </div>
      )}
      {needsVerification && (
        <div className="rounded-md bg-blue-50 p-4 mb-4 w-full max-w-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-blue-400"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Email verification required
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  Please check your email inbox and verify your account before
                  signing in.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      {passwordResetSent && (
        <div className="rounded-md bg-blue-50 p-4 mb-4 w-full max-w-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-blue-400"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Password reset email sent
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  Please check your email for instructions to reset your
                  password.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      {(signUpLoading || forgotPasswordLoading) && (
        <div className="absolute inset-0 flex items-center justify-center bg-stone-200 bg-opacity-75 z-10">
          <Loader2 className="animate-spin text-blue-500" size={40} />
        </div>
      )}
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-stone-800 mb-6">
          Sign In
        </h2>

        {error && (
          <p className="text-red-500 text-sm text-center mb-2">{error}</p>
        )}

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
          <div className="relative">
            <label className="block text-stone-700">Password</label>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              {...register("password")}
              className="w-full px-3 py-2 border rounded-md"
            />
            <span
              className="absolute right-3 top-8 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff
                  className="text-stone-500 hover:text-stone-700"
                  size={20}
                />
              ) : (
                <Eye
                  className="text-stone-500 hover:text-stone-700"
                  size={20}
                />
              )}
            </span>
            {errors.password?.message && (
              <p className="text-red-500 text-sm">
                {String(errors.password.message)}
              </p>
            )}
          </div>
          <div className="flex flex-row justify-between w-full items-center">
            <div className="flex flex-row gap-2 items-center">
              <input
                type="checkbox"
                id="rememberMe"
                {...register("rememberMe")}
                className="h-4 w-4 text-blue-600 border border-stone-400 rounded focus:ring-blue-500"
              />
              <label
                htmlFor="rememberMe"
                className="text-sm text-stone-600 cursor-pointer"
              >
                Remember me
              </label>
            </div>
            <div className="text-sm text-blue-600">
              <Link
                href="/forgot-password"
                onClick={(e) => {
                  e.preventDefault();
                  setForgotPasswordLoading(true);
                  router.push("/forgot-password");
                }}
              >
                Forgot Password?
              </Link>
            </div>
          </div>
          <Button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-100"
                    fill="currentColor"
                    d="M12 2a10 10 0 00-10 10h4a6 6 0 016-6V2z"
                  ></path>
                </svg>
                Processing...
              </div>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        <p className="text-sm text-center text-stone-600 mt-4">
          If you don't have an account, please 
          <Link
            href="/signup"
            className="text-blue-500 hover:underline ml-1"
            onClick={(e) => {
              e.preventDefault();
              setSignUpLoading(true);
              router.push("/signup");
            }}
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

// Main component that provides the Suspense boundary
export default function SignIn() {
  return (
    <Suspense fallback={<SignInFallback />}>
      <SignInContent />
    </Suspense>
  );
}


{
  /* <button
  className="w-full flex items-center justify-center gap-2 border py-2 rounded-lg text-stone-700 hover:bg-stone-100"
  onClick={SignInWithGoogle}
>
  {googleLoading ? (
    <Loader2 className="animate-spin text-stone-500" size={24} />
  ) : (
    <FcGoogle size={20} />
  )}
  Sign In with Google
</button>
<div className="flex items-center my-6">
  <div className="flex-grow h-px bg-stone-300"></div>
  <span className="px-2 text-stone-500 text-sm">Or</span>
  <div className="flex-grow h-px bg-stone-300"></div>
</div> */
}
