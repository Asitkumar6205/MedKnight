"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import SideNavbar from "./_components/SideNavbar";
import clsx from "clsx";

export default function Page({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeComponent, setActiveComponent] = useState("Dashboard");
  const { data: session } = useSession();
  const Image = session?.user?.image;
  const userRole = session?.user?.role || ""; // Extract the role from session

  useEffect(() => {
    const storedSidebarState = window.localStorage.getItem("sidebarOpen");
    if (storedSidebarState !== null) {
      setIsOpen(JSON.parse(storedSidebarState));
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("sidebarOpen", JSON.stringify(isOpen));
  }, [isOpen]);

  return (
    <div className="flex h-screen bg-stone-100">
      {/* Sidebar */}
      <div className="z-10">
        <SideNavbar
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          activeComponent={activeComponent}
          setActiveComponent={setActiveComponent}
          Image={Image}
          role={userRole} // Pass the role to SideNavbar
        />
      </div>

      {/* Main Content Area */}
      <main
        className={clsx(
          "flex-1 max-sm:ml-12 max-sm:p-0 p-0 transition-all duration-300 z-0",
          isOpen ? "ml-56" : "ml-16"
        )}
      >
        {children}
      </main>
    </div>
  );
}