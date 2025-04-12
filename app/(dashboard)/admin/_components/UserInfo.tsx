// UserInfo.tsx
import { X } from "lucide-react";

type UserInfoProps = {
  user: {
    name: string;
    image?: string;
    role?: string;
    email?: string;
  } | null;
  onClose: () => void;
};

export default function UserInfo({ user, onClose }: UserInfoProps) {
  if (!user) return null;

  // Function to determine role badge colors based on user role
  const getRoleBadgeClasses = (role?: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-100 text-red-800";
      case "RADIOLOGIST":
        return "bg-orange-100 text-orange-800";
      case "HOSPITAL":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-medium">User Profile</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          <div className="flex flex-col items-center mb-6">
            {user.image ? (
              <img
                src={user.image}
                alt="Profile"
                className="w-24 h-24 rounded-full border-2 border-purple-300 mb-4"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-purple-600">
                  {user.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm font-medium text-gray-500">Role</p>
              <p className="text-gray-900 font-medium">
                <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold mt-1 ${getRoleBadgeClasses(user.role)}`}>
                  {user.role || "User"}
                </span>
              </p>
            </div>
            
            {user.email && (
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-gray-900">{user.email}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}