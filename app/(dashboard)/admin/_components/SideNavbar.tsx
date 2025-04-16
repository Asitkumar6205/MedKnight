"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Menu,
  X,
  Settings,
  LogOut,
  ClipboardCheck,
  MonitorDot,
  CircleUserRound,
  IndianRupee,
  LayoutDashboard,
} from "lucide-react";
import clsx from "clsx";

interface SideNavbarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  activeComponent: string;
  setActiveComponent: (component: string) => void;
  Image?: string | null;
  role: string; // Add role prop
}

const SideNavbar: React.FC<SideNavbarProps> = ({
  isOpen,
  setIsOpen,
  activeComponent,
  setActiveComponent,
  Image,
  role,
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const pathname = usePathname();

  // Detect route change using pathname
  useEffect(() => {
    setLoading(false);
  }, [pathname]); // This will trigger when the URL path changes

  // Define all menu items
  const allMenuItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: <LayoutDashboard className="w-5 h-5" />,
      roles: ["ADMIN", "HOSPITAL", "RADIOLOGIST"],
    },
    {
      name: "Orders",
      path: "/admin/active-orders",
      icon: <MonitorDot className="w-5 h-5" />,
      roles: ["ADMIN", "HOSPITAL"],
    },
    {
      name: "Completed",
      path: "/admin/completed-orders",
      icon: <ClipboardCheck className="w-5 h-5" />,
      roles: ["ADMIN", "HOSPITAL", "RADIOLOGIST"],
    },
    {
      name: "Users",
      path: "/admin/hospital-users",
      icon: <CircleUserRound className="w-5 h-5" />,
      roles: ["ADMIN", "HOSPITAL"],
    },
    {
      name: "Payments",
      path: "/admin/payments",
      icon: <IndianRupee className="w-5 h-5" />,
      roles: ["ADMIN", "HOSPITAL"],
    },
    {
      name: "Settings",
      path: "/admin/settings",
      icon: <Settings className="w-5 h-5" />,
      roles: ["ADMIN", "HOSPITAL", "RADIOLOGIST"],
    },
    {
      name: "Active Studies",
      path: "/admin/active-studies",
      icon: <MonitorDot className="w-5 h-5" />,
      roles: ["ADMIN", "RADIOLOGIST"],
    },
    {
      name: "Radiologists",
      path: "/admin/radiologists",
      icon: <CircleUserRound className="w-5 h-5" />,
      roles: ["ADMIN", "RADIOLOGIST"],
    },
  ];

  // Filter menu items based on the user's role
  const menuItems = allMenuItems.filter((item) => item.roles.includes(role));

  const handleNavigation = (path: string) => {
    if (pathname === path) return;
    setLoading(true);
    router.push(path);
  };

  const handleLogout = async () => {
    setLoading(true);
    setShowLogoutConfirm(false);
    try {
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      await signOut({ redirect: true, callbackUrl: "/signin" });
      router.push("/signin");
    } catch (error) {
      console.error("Logout failed:", error);
      setLoading(false);
    }
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-stone-900 text-white max-lg:p-3 lg:p-5 flex flex-col transition-all duration-300 ${
        isOpen ? "w-56" : "max-lg:w-12 lg:w-16"
      }`}
    >
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-60 z-50">
          <div className="w-12 h-12 border-4 border-stone-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {!loading && (
        <>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="mb-4 text-stone-400 hover:text-stone-100"
          >
            {isOpen ? (
              <X className="lg:w-6 lg:h-6 max-lg:-ml-[2px] lg:-ml-[2px] hover:text-stone-100" />
            ) : (
              <Menu className="lg-max:w-5 lg-max:h-5 lg:w-6 lg:h-6 " />
            )}
          </button>

          <nav className="flex-1">
            <ul>
              {menuItems.map((item) => (
                <li
                  key={item.name}
                  className={clsx(
                    "mb-4 flex items-center space-x-3 space-y-1 cursor-pointer",
                    !isOpen && "justify-center",
                    activeComponent === item.name
                      ? "text-stone-100"
                      : "text-stone-400 hover:text-stone-100"
                  )}
                  onClick={() => {
                    handleNavigation(item.path);
                    setActiveComponent(item.name);
                  }}
                >
                  {item.icon}
                  {isOpen && <span>{item.name}</span>}
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-row items-center justify-between space-x-3">
            <div className="flex-none -m-[2px]">
              {Image && (
                <img
                  src={Image}
                  alt="User Avatar"
                  className="w-7 h-7 rounded-full"
                />
              )}
            </div>
            <div className="flex space-x-3 items-center">
              <div
                className="flex gap-1 items-center cursor-pointer text-stone-400 hover:text-stone-100"
                onClick={() => setShowLogoutConfirm(true)}
              >
                {isOpen && <LogOut className="w-5 h-5" />}
                {isOpen && <span>Logout</span>}
              </div>
            </div>
          </div>
        </>
      )}

      {showLogoutConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-stone-50 bg-opacity-50 text-black p-6 rounded-sm shadow-md">
            <p className="mb-4">Are you sure you want to logout?</p>
            <div className="flex space-x-4 justify-center">
              <button
                className="px-4 py-2 bg-stone-200 rounded-sm hover:bg-stone-300"
                onClick={() => setShowLogoutConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default SideNavbar;
