"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

import { User as UserIcon } from "lucide-react";
import UserInfo from "./UserInfo"; 
import AdminDashboard from "./AdminDashboard";

export default function Users() {
  const { data: session, status } = useSession({ required: true });
  const [user, setUser] = useState<{
    image: string;
    name: string;
    role?: string;
    email?: string; // Added email to the user state
  } | null>(null);
  const [isUserInfoOpen, setIsUserInfoOpen] = useState(false); // State to control modal visibility

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      setUser({
        image: session.user.image || "",
        name: session.user.name || (session.user.username as string),
        role: session.user.role || "",
        email: session.user.email || "", // Store the email from session
      });
    }
  }, [session, status]);

  // Toggle the user info modal
  const toggleUserInfo = () => {
    setIsUserInfoOpen(!isUserInfoOpen);
  };

  return (
    <div>
      <div className="flex justify-between">
        <h1 className="pt-4 pl-3 text-4xl font-semibold">
          {user?.role === "HOSPITAL"
            ? "Hospital Dashboard"
            : user?.role === "RADIOLOGIST"
            ? "Radiologist Dashboard"
            : user?.role === "ADMIN"
            ? "Admin Dashboard"
            : "Dashboard"}
        </h1>
        <div className="flex gap-4 pt-4 pl-4 pr-4 items-end">
          <h2 className="text-lg text-stone-500 ">
            Welcome <span className="text-purple-600 font-bold">{user?.name || "Guest"}</span>
          </h2>
          <div 
            className="bg-purple-100 border border-purple-300 p-2 rounded-full text-purple-900 cursor-pointer hover:bg-purple-200 transition-colors"
            onClick={toggleUserInfo}
          >
            <UserIcon strokeWidth={1}/>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center h-screen gap-2">
        {user?.image && (
          <img
            src={user.image}
            alt="User Image"
            className="w-24 h-24 rounded-full border"
          />
        )}
        {/* Only render AdminDashboard if user has ADMIN role */}
        {user?.role === "ADMIN" && <AdminDashboard />}
      </div>

      {/* Render the UserInfo component when isUserInfoOpen is true */}
      {isUserInfoOpen && (
        <UserInfo user={user} onClose={() => setIsUserInfoOpen(false)} />
      )}
    </div>
  );
}