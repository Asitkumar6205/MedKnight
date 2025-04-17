// app/admin/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { RotateCw } from "lucide-react";

// Define the User type
type User = {
  id: string;
  username: string | null;
  email: string | null;
  role: string;
  status: string;
  name: string | null;
  createdAt?: string;
  emailVerified?: string | null;
};

export default function AdminDashboard() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("PENDING_APPROVAL");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(
    null
  );
  const [selectedRole, setSelectedRole] = useState<string>("RADIOLOGIST");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<{ [key: string]: boolean }>({});

  const statusOptions = [
    {
      value: "PENDING_APPROVAL",
      label: "Pending Approval",
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      value: "ACTIVE",
      label: "Active Users",
      color: "bg-green-100 text-green-800",
    },
    {
      value: "SUSPENDED",
      label: "Suspended Users",
      color: "bg-red-100 text-red-800",
    },
    { value: "", label: "All Users", color: "bg-gray-100 text-gray-800" },
  ];

  useEffect(() => {
    fetchUsers();
  }, [statusFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/users?status=${statusFilter}`);

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/signin");
          return;
        }
        if (response.status === 403) {
          router.push("/unauthorized");
          return;
        }
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      setUsers(data.users);
    } catch (err) {
      setError("Failed to load users");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveUser = async (userId: string, role: string) => {
    setIsLoading({ ...isLoading, [userId]: true });
    try {
      // First, approve the user
      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          status: "ACTIVE",
          role,
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to approve user");
      }
  
      // Then, send approval notification email
      const emailResponse = await fetch("/api/send-approval-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          userEmail: selectedUser?.email,
          userName: selectedUser?.name || selectedUser?.username || "User",
          role,
        }),
      });
  
      if (!emailResponse.ok) {
        console.error("Email notification failed to send");
        // You might want to show a warning that the user was approved but email failed
      }
  
      // Refresh the user list
      fetchUsers();
      setShowModal(false);
    } catch (err) {
      setError("Failed to approve user");
      console.error(err);
    } finally {
      setIsLoading({ ...isLoading, [userId]: false });
    }
  };

const handleRejectUser = async (userId: string) => {
  setIsLoading({ ...isLoading, [userId]: true });
  try {
    const response = await fetch("/api/user", {
      method: "DELETE", 
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to reject user");
    }

    // Refresh the user list
    fetchUsers();
    setShowModal(false);
  } catch (err) {
    setError("Failed to reject user");
    console.error(err);
  } finally {
    setIsLoading({ ...isLoading, [userId]: false });
  }
};

  const openModal = (user: User, type: "approve" | "reject") => {
    setSelectedUser(user);
    setActionType(type);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
    setActionType(null);
  };

  const confirmAction = () => {
    if (!selectedUser) return;

    if (actionType === "approve") {
      handleApproveUser(selectedUser.id, selectedRole);
    } else if (actionType === "reject") {
      handleRejectUser(selectedUser.id);
    }
  };

  const filteredUsers = users.filter((user) => {
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase();
    return (
      user.username?.toLowerCase().includes(query) ||
      false ||
      user.email?.toLowerCase().includes(query) ||
      false ||
      user.name?.toLowerCase().includes(query) ||
      false
    );
  });

  const getStatusBadgeClasses = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "PENDING_APPROVAL":
        return "bg-yellow-100 text-yellow-800";
      case "SUSPENDED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleBadgeClasses = (role: string) => {
    switch (role) {
      case "RADIOLOGIST":
        return "bg-purple-100 text-purple-800";
      case "HOSPITAL":
        return "bg-blue-100 text-blue-800";
      case "ADMIN":
        return "bg-indigo-100 text-indigo-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";

    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="w-full mt-7">
      <div className="mx-auto max-w-7xl px-4 sm:px-2 lg:px-8 ">
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="border-b border-gray-200 bg-white px-8 py-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Approve & Assign Roles
            </h1>
            <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
              <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
                <div>
                  <label
                    htmlFor="status"
                    className="mr-2 text-sm font-medium text-gray-700"
                  >
                    Filter by status:
                  </label>
                  <div className="mt-1">
                    <select
                      id="status"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="block w-full border border-stone-300 rounded-md py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-indigo-500"
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="search"
                    className="mr-2 text-sm font-medium text-gray-700"
                  >
                    Search:
                  </label>
                  <div className="mt-1 relative rounded-md border">
                    <input
                      type="text"
                      id="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by name, email, username"
                      className="block w-80 rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                      >
                        <span className="text-gray-400 hover:text-gray-500">
                          ×
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-end justify-end gap-2">
                <div className="text-sm items-end flex text-gray-500">
                  {filteredUsers.length}{" "}
                  {filteredUsers.length === 1 ? "user" : "users"} found
                </div>
                <div className="flex">
                  <button
                    onClick={() => fetchUsers()}
                    className="hover:text-indigo-500"
                  >
                    <RotateCw size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
                <div className="ml-auto pl-3">
                  <div className="-mx-1.5 -my-1.5">
                    <button
                      onClick={() => setError(null)}
                      className="inline-flex rounded-md p-1.5 text-red-500 hover:bg-red-100"
                    >
                      <span className="sr-only">Dismiss</span>
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-600"></div>
              <span className="ml-2">Loading users...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                    >
                      User
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                    >
                      Role
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                    >
                      Registered
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-10 text-center text-sm text-gray-500"
                      >
                        No users found with the selected criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-600">
                                {user.name?.charAt(0) ||
                                  user.username?.charAt(0) ||
                                  user.email?.charAt(0) ||
                                  "?"}
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.name || "N/A"}
                              </div>
                              <div className="text-sm text-gray-500">
                                {user.username || "No username"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          {user.email || "No email"}
                          {user.emailVerified && (
                            <span className="ml-2 inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                              Verified
                            </span>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeClasses(
                              user.status
                            )}`}
                          >
                            {user.status.replace("_", " ")}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                          {user.role && (
                            <span
                              className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${getRoleBadgeClasses(
                                user.role
                              )}`}
                            >
                              {user.role}
                            </span>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          {formatDate(user.createdAt)}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                          {user.status === "PENDING_APPROVAL" && (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => openModal(user, "approve")}
                                disabled={isLoading[user.id]}
                                className="rounded bg-green-500 px-3 py-1 text-xs text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                              >
                                {isLoading[user.id]
                                  ? "Processing..."
                                  : "Approve"}
                              </button>
                              <button
                                onClick={() => openModal(user, "reject")}
                                disabled={isLoading[user.id]}
                                className="rounded bg-red-500 px-3 py-1 text-xs text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                              >
                                {isLoading[user.id]
                                  ? "Processing..."
                                  : "Reject"}
                              </button>
                            </div>
                          )}
                          {user.status === "ACTIVE" && (
                            <button
                              onClick={() => openModal(user, "reject")}
                              disabled={isLoading[user.id]}
                              className="rounded bg-red-500 px-3 py-1 text-xs text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                            >
                              {isLoading[user.id] ? "Processing..." : "Suspend"}
                            </button>
                          )}
                          {user.status === "SUSPENDED" && (
                            <button
                              onClick={() => openModal(user, "approve")}
                              disabled={isLoading[user.id]}
                              className="rounded bg-green-500 px-3 py-1 text-xs text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                            >
                              {isLoading[user.id]
                                ? "Processing..."
                                : "Activate"}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span
              className="hidden sm:inline-block sm:h-screen sm:align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div
                    className={`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${
                      actionType === "approve" ? "bg-green-100" : "bg-red-100"
                    } sm:mx-0 sm:h-10 sm:w-10`}
                  >
                    {actionType === "approve" ? (
                      <svg
                        className="h-6 w-6 text-green-600"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-6 w-6 text-red-600"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                      {actionType === "approve"
                        ? selectedUser.status === "SUSPENDED"
                          ? "Activate User"
                          : "Approve User"
                        : selectedUser.status === "ACTIVE"
                        ? "Suspend User"
                        : "Reject User"}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        {actionType === "approve"
                          ? selectedUser.status === "SUSPENDED"
                            ? `Are you sure you want to activate ${
                                selectedUser.name ||
                                selectedUser.username ||
                                selectedUser.email ||
                                "this user"
                              }?`
                            : `Are you sure you want to approve ${
                                selectedUser.name ||
                                selectedUser.username ||
                                selectedUser.email ||
                                "this user"
                              }?`
                          : selectedUser.status === "ACTIVE"
                          ? `Are you sure you want to suspend ${
                              selectedUser.name ||
                              selectedUser.username ||
                              selectedUser.email ||
                              "this user"
                            }?`
                          : `Are you sure you want to reject ${
                              selectedUser.name ||
                              selectedUser.username ||
                              selectedUser.email ||
                              "this user"
                            }?`}
                      </p>
                    </div>

                    {actionType === "approve" &&
                      selectedUser.status === "PENDING_APPROVAL" && (
                        <div className="mt-4">
                          <label
                            htmlFor="role"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Select Role:
                          </label>
                          <select
                            id="role"
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                          >
                            <option value="RADIOLOGIST">Radiologist</option>
                            <option value="HOSPITAL">Hospital</option>
                          </select>
                        </div>
                      )}
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  onClick={confirmAction}
                  className={`inline-flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-base font-medium text-white shadow-sm sm:ml-3 sm:w-auto sm:text-sm ${
                    actionType === "approve"
                      ? "bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                      : "bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  }`}
                >
                  {actionType === "approve"
                    ? selectedUser.status === "SUSPENDED"
                      ? "Activate"
                      : "Approve"
                    : selectedUser.status === "ACTIVE"
                    ? "Suspend"
                    : "Reject"}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
