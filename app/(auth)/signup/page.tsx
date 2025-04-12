"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FcGoogle } from "react-icons/fc";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";

const FormSchema = z
  .object({
    username: z.string().min(1, "Username is required").max(100),
    email: z.string().min(1, "Email is required").email("Invalid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Password confirmation is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

  export default function SignUp() {
    const router = useRouter();
    const {
      register,
      handleSubmit,
      setError,
      formState: { errors },
    } = useForm<z.infer<typeof FormSchema>>({
      resolver: zodResolver(FormSchema),
    });
  
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
  
    const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
    const toggleConfirmPasswordVisibility = () =>
      setShowConfirmPassword((prev) => !prev);
  
    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
      setLoading(true);
      try {
        const response = await fetch("/api/user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: data.username,
            email: data.email,
            password: data.password,
          }),
        });
  
        const responseData = await response.json();
  
        if (response.ok) {
          // Redirect to signin page with a query parameter to show verification message
          router.push("/signin?needsVerification=true");
        } else if (response.status === 409) {
          if (responseData.error === "email_exists") {
            setError("email", { type: "manual", message: responseData.message });
          } else if (responseData.error === "username_exists") {
            setError("username", {
              type: "manual",
              message: responseData.message,
            });
          } else {
            setError("root", {
              type: "manual",
              message: "Something went wrong. Please try again.",
            });
          }
        }
      } catch (error) {
        setError("root", {
          type: "manual",
          message: "Network error. Please try again later.",
        });
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-stone-100 p-6">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center text-stone-800 mb-6">
          Sign Up
        </h2>

        <button className="w-full flex items-center justify-center gap-2 border py-2 rounded-lg text-stone-700 hover:bg-stone-100">
          <FcGoogle size={20} /> Sign Up with Google
        </button>

        <div className="flex items-center my-6">
          <div className="flex-grow h-px bg-stone-300"></div>
          <span className="px-2 text-stone-500 text-sm">Or</span>
          <div className="flex-grow h-px bg-stone-300"></div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-stone-700">Username</label>
            <Input
              {...register("username")}
              placeholder="Username"
              className="w-full px-3 py-2 border rounded-md"
            />
            {errors.username && (
              <p className="text-red-500 text-sm">{errors.username.message}</p>
            )}
          </div>
          <div>
            <label className="block text-stone-700">Email</label>
            <Input
              {...register("email")}
              type="email"
              placeholder="Email"
              className="w-full px-3 py-2 border rounded-md"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
            {errors.root && (
              <p className="text-red-500 text-sm">{errors.root.message}</p>
            )}
          </div>
          <div className="relative">
            <label className="block text-stone-700">Password</label>
            <Input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full px-3 py-2 border rounded-md"
            />
            <span
              className="absolute right-3 top-8 cursor-pointer"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
                <EyeOff
                  size={20}
                  className="text-stone-500 hover:text-stone-700"
                />
              ) : (
                <Eye size={20} className="text-stone-500 hover:text-stone-700" />
              )}
            </span>
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>
          <div className="relative">
            <label className="block text-stone-700">Confirm Password</label>
            <Input
              {...register("confirmPassword")}
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              className="w-full px-3 py-2 border rounded-md"
            />
            <span
              className="absolute right-3 top-8 cursor-pointer"
              onClick={toggleConfirmPasswordVisibility}
            >
              {showConfirmPassword ? (
                <EyeOff
                  size={20}
                  className="text-stone-500 hover:text-stone-700"
                />
              ) : (
                <Eye size={20} className="text-stone-500 hover:text-stone-700" />
              )}
            </span>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center">
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
              "Sign Up"
            )}
          </Button>
        </form>

        <p className="text-sm text-center text-stone-600 mt-4">
          If you have an account, please{" "}
          <Link href="/signin" className="text-blue-500 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}











// "use client";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { FcGoogle } from "react-icons/fc";
// import { Eye, EyeIcon, EyeOff, EyeOffIcon } from "lucide-react";
// import { useForm } from "react-hook-form";
// import * as z from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useRouter } from "next/navigation";
// import { useState } from "react";

// const FormSchema = z.object({
//   username: z
//     .string()
//     .min(3, "Username must be at least 3 characters")
//     .max(50, "Username cannot exceed 50 characters")
//     .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
//   email: z
//     .string()
//     .email("Please enter a valid email address"),
//   password: z
//     .string()
//     .min(8, "Password must be at least 8 characters")
//     .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
//     .regex(/[a-z]/, "Password must contain at least one lowercase letter")
//     .regex(/[0-9]/, "Password must contain at least one number")
//     .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
//   confirmPassword: z
//     .string(),
//   requestedRole: z
//     .enum(["HOSPITAL", "RADIOLOGIST"])
//     .default("HOSPITAL")
// }).refine(data => data.password === data.confirmPassword, {
//   message: "Passwords do not match",
//   path: ["confirmPassword"]
// });

//   export default function SignUp() {
//     const router = useRouter();
//     const {
//       register,
//       handleSubmit,
//       setError,
//       formState: { errors },
//     } = useForm<z.infer<typeof FormSchema>>({
//       resolver: zodResolver(FormSchema),
//       defaultValues: {
//         requestedRole: "HOSPITAL" // Default role
//       }
//     });
  
//     const [showPassword, setShowPassword] = useState(false);
//     const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//     const [loading, setLoading] = useState(false);
  
//     const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
//     const toggleConfirmPasswordVisibility = () =>
//       setShowConfirmPassword((prev) => !prev);
  
//     const onSubmit = async (data: z.infer<typeof FormSchema>) => {
//       setLoading(true);
//       try {
//         const response = await fetch("/api/user", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             username: data.username,
//             email: data.email,
//             password: data.password,
//             requestedRole: data.requestedRole,
//           }),
//         });
  
//         const responseData = await response.json();
  
//         if (response.ok) {
//           router.push("/signin?needsVerification=true");
//         } else if (response.status === 409) {
//           if (responseData.error === "email_exists") {
//             setError("email", { type: "manual", message: responseData.message });
//           } else if (responseData.error === "username_exists") {
//             setError("username", {
//               type: "manual",
//               message: responseData.message,
//             });
//           } else {
//             setError("root", {
//               type: "manual",
//               message: "Something went wrong. Please try again.",
//             });
//           }
//         }
//       } catch (error) {
//         setError("root", {
//           type: "manual",
//           message: "Network error. Please try again later.",
//         });
//       } finally {
//         setLoading(false);
//       }
//     };
  
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-100">
//         <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
//           <div className="text-center">
//             <h1 className="text-2xl font-bold">Create an Account</h1>
//             <p className="mt-2 text-gray-600">Sign up to access our platform</p>
//             <p className="mt-1 text-sm text-gray-500">
//               Your account will require admin approval after email verification
//             </p>
//           </div>
          
//           {errors.root && (
//             <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg">
//               {errors.root.message}
//             </div>
//           )}
          
//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//             {/* Username field */}
//             <div>
//               <label htmlFor="username" className="block text-sm font-medium text-gray-700">
//                 Username
//               </label>
//               <input
//                 id="username"
//                 type="text"
//                 {...register("username")}
//                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//               />
//               {errors.username && (
//                 <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
//               )}
//             </div>
            
//             {/* Email field */}
//             <div>
//               <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//                 Email
//               </label>
//               <input
//                 id="email"
//                 type="email"
//                 {...register("email")}
//                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//               />
//               {errors.email && (
//                 <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
//               )}
//             </div>
            
//             {/* Password field */}
//             <div>
//               <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//                 Password
//               </label>
//               <div className="relative">
//                 <input
//                   id="password"
//                   type={showPassword ? "text" : "password"}
//                   {...register("password")}
//                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                 />
//                 <button
//                   type="button"
//                   onClick={togglePasswordVisibility}
//                   className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                 >
//                   {showPassword ? (
//                     <EyeOffIcon className="h-5 w-5 text-gray-400" />
//                   ) : (
//                     <EyeIcon className="h-5 w-5 text-gray-400" />
//                   )}
//                 </button>
//               </div>
//               {errors.password && (
//                 <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
//               )}
//             </div>
            
//             {/* Confirm Password field */}
//             <div>
//               <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
//                 Confirm Password
//               </label>
//               <div className="relative">
//                 <input
//                   id="confirmPassword"
//                   type={showConfirmPassword ? "text" : "password"}
//                   {...register("confirmPassword")}
//                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                 />
//                 <button
//                   type="button"
//                   onClick={toggleConfirmPasswordVisibility}
//                   className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                 >
//                   {showConfirmPassword ? (
//                     <EyeOffIcon className="h-5 w-5 text-gray-400" />
//                   ) : (
//                     <EyeIcon className="h-5 w-5 text-gray-400" />
//                   )}
//                 </button>
//               </div>
//               {errors.confirmPassword && (
//                 <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
//               )}
//             </div>
            
//             {/* Role selection field */}
//             <div>
//               <label htmlFor="requestedRole" className="block text-sm font-medium text-gray-700">
//                 Account Type
//               </label>
//               <select
//                 id="requestedRole"
//                 {...register("requestedRole")}
//                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//               >
//                 <option value="HOSPITAL">Hospital</option>
//                 <option value="RADIOLOGIST">Radiologist</option>
//               </select>
//               {errors.requestedRole && (
//                 <p className="mt-1 text-sm text-red-600">{errors.requestedRole.message}</p>
//               )}
//               <p className="mt-1 text-xs text-gray-500">
//                 Your requested role will be reviewed by an administrator
//               </p>
//             </div>
            
//             {/* Submit button */}
//             <div>
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
//               >
//                 {loading ? "Creating account..." : "Sign Up"}
//               </button>
//             </div>
//           </form>
          
//           <div className="text-center mt-4">
//             <p className="text-sm text-gray-600">
//               Already have an account?{" "}
//               <Link href="/signin" className="font-medium text-indigo-600 hover:text-indigo-500">
//                 Sign in
//               </Link>
//             </p>
//           </div>
//         </div>
//       </div>
//     );
//   }