"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Trash, UserPlus, X } from "lucide-react";

// Define Zod Schema for validation
const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone must be at least 10 digits"),
  isDefault: z.boolean().optional(),
});

type UserFormData = z.infer<typeof userSchema>;

type User = {
  id: string; // Ensure ID exists
  name: string;
  email: string;
  phone: string;
  isDefault?: boolean;
};

export default function page() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showSuccessAdded, setShowSuccessAdded] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");

  // Form Handling
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });

  // Handle form submission
  const onSubmit = async (data: UserFormData) => {
    setIsModalOpen(false);
    setShowSuccessAdded(false);
    setLoading(true);
    try {
      const response = await fetch("/api/hospital/postuser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      console.log("API Response:", responseData); // Debugging

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to add user");
      }

      // Fetch users after successful addition to update the table
      await fetchUsers();
      
      setShowSuccessAdded(true);
      reset();

      setTimeout(() => {
        setShowSuccessAdded(false);
      }, 2000);
    } catch (error) {
      console.error("Error adding user:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/hospital/getuser");
      const data = await response.json();
      console.log("Fetched Users:", data);

      if (response.ok) {
        setUsers(data.users);
      } else {
        throw new Error(data.message || "Failed to fetch users");
      }
    } catch (error) {
      console.error("Fetch Users Error:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  
  useEffect(() => {
    if (!showDeleteConfirm) {
      console.log("Modal is now closed.");
    }
  }, [showDeleteConfirm]);

  const handleDelete = async (id: string) => {
    setShowDeleteConfirm(false)
    setShowSuccess(false);
    setLoading(true);

    try {
      const response = await fetch(`/api/hospital/deleteuser?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete user");
      setShowSuccess(true);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
      setTimeout(() => {
        setShowSuccess(false);
      }, 2000);
    } catch (error) {
      console.error("Delete User Error:", error);
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false); // Ensure modal closes regardless of success or failure
    }
  };

  return (
    <div className="p-4 ">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-60 z-50">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white py-1 px-4 rounded-sm shadow-lg text-center transition-opacity duration-500 z-10">
          ✅ Deletion Successfull!
        </div>
      )}

      {showSuccessAdded && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white py-1 px-4 rounded-sm shadow-lg text-center transition-opacity duration-500 z-10">
          ✅ User Added Successfully!
        </div>
      )}

      {/* Add User Button */}
      <div className="flex justify-center mt-2 relative group">
        <button
          onClick={() => setIsModalOpen(true)}
          className=" bg-purple-600 text-purple-100 p-4 rounded-full shadow-lg hover:bg-purple-700"
        >
          <UserPlus size={28} strokeWidth={3} />
        </button>
        <span className="absolute left-1/2 -translate-x-1/2 top-16 bg-stone-700 text-white z-10 px-4 py-[5px] rounded-sm opacity-0 group-hover:opacity-100 transition-opacity">
          Add New User
        </span>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-10">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
            {/* Close Button */}
            <button
              className="absolute top-2 right-2 text-stone-600 hover:text-stone-500"
              onClick={() => setIsModalOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-semibold mb-4">Add User</h2>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <div>
                <label className="block text-sm font-medium">User Name<span className="text-red-500">*</span></label>
                <input
                  {...register("name")}
                  className="w-full border rounded-md px-2 py-1"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium">Email<span className="text-red-500">*</span></label>
                <input
                  {...register("email")}
                  className="w-full border rounded-md px-2 py-1"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium">Phone No.<span className="text-red-500">*</span></label>
                <input
                  {...register("phone")}
                  className="w-full border rounded-md px-2 py-1"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm">{errors.phone.message}</p>
                )}
              </div>

              <div className="flex items-center ">
                <input
                  type="checkbox"
                  {...register("isDefault")}
                  className="mr-2"
                />
                <label className="text-xs">Mark As Default User</label>
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="mt-10 z-0">
        <table className="w-full border-collapse border border-stone-300">
          <thead style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.4)" }}>
            <tr className="bg-stone-200">
              <th className="border-separate drop-shadow-lg bg-purple-600 text-white shadow-lg border-stone-300 px-2 py-2 text-center whitespace-nowrap">
                Serial No.
              </th>
              <th className="border-separate drop-shadow-lg bg-purple-600 text-white shadow-lg border-stone-300 px-2 py-2 text-center whitespace-nowrap">
                User Name
              </th>
              <th className="border-separate drop-shadow-lg bg-purple-600 text-white shadow-lg border-stone-300 px-2 py-2 text-center whitespace-nowrap">
                Email
              </th>
              <th className="border-separate drop-shadow-lg bg-purple-600 text-white shadow-lg border-stone-300 px-2 py-2 text-center whitespace-nowrap">
                Phone No.
              </th>
              <th className="border-separate drop-shadow-lg bg-purple-600 text-white shadow-lg border-stone-300 px-2 py-2 text-center whitespace-nowrap">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index} className="text-center">
                <td className="border px-4 py-2">{index + 1}</td>
                <td className="border px-4 py-2  items-center whitespace-nowrap">
                  <span>{user.name}</span>
                  {user.isDefault && (
                    <span className="ml-2 text-xs bg-purple-600 text-white px-2 py-1 rounded whitespace-nowrap">
                      Default User
                    </span>
                  )}
                </td>
                <td className="border px-4 py-2">{user.email}</td>
                <td className="border px-4 py-2">{user.phone}</td>
                <td className="border px-4 py-2">
                  <button
                    className="text-red-500 hover:underline"
                    onClick={() => {
                      setShowDeleteConfirm(true);
                      setSelectedUser(user.id);
                    }}
                  >
                    <Trash/>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && !loading && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 backdrop-blur-sm">
            <div className="bg-purple-50 bg-opacity-50 text-black p-6 rounded-sm shadow-md">
              <p className="mb-4">
                Are you sure you want to delete this study?
              </p>
              <div className="flex space-x-4 justify-center">
                <button
                  className="px-4 py-2 bg-stone-200 rounded-sm shadow-sm hover:bg-stone-400"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded-sm shadow-sm hover:bg-red-600"
                  onClick={() => handleDelete(selectedUser)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}