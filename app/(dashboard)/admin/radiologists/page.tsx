"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Trash, UserPlus, X } from "lucide-react";

// Updated schema with better file handling
const radiologistSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone must be at least 10 digits"),
  qualifications: z
    .string()
    .min(2, "Qualifications must be at least 2 characters"),
  designation: z.string().min(2, "Designation must be at least 2 characters"),
  mrn: z.string().min(2, "MRN must be at least 2 characters"),
  isDefault: z.boolean().optional(),
  // Changed to optional - we'll validate the file manually
  signature: z.any().optional(),
});

type RadiologistFormData = z.infer<typeof radiologistSchema>;

type Radiologist = {
  id: string;
  name: string;
  email: string;
  phone: string;
  qualifications: string;
  designation: string;
  mrn: string;
  isDefault?: boolean;
  signature: {
    id: string;
    filename: string;
    path: string;
    uploadedAt: string;
  } | null;
  signatureUrl?: string | null;
};

export default function RadiologistManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState<Radiologist[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showSuccessAdded, setShowSuccessAdded] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  // Form Handling
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RadiologistFormData>({
    resolver: zodResolver(radiologistSchema),
  });

  // Handle form submission
  const onSubmit = async (data: RadiologistFormData) => {
    // Manual file validation
    if (!signatureFile) {
      setFileError("Signature file is required");
      return;
    }

    if (signatureFile.size > 5 * 1024 * 1024) {
      setFileError("Signature must be less than 5MB");
      return;
    }

    setFileError(null);
    setIsModalOpen(false);
    setShowSuccessAdded(false);
    setLoading(true);
    
    try {
      // Create form data for file upload
      const formData = new FormData();
      if (signatureFile) {
        formData.append("signature", signatureFile);
      }
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("phone", data.phone);
      formData.append("qualifications", data.qualifications);
      formData.append("designation", data.designation);
      formData.append("mrn", data.mrn);
      formData.append("isDefault", data.isDefault ? "true" : "false");

      const response = await fetch("/api/radiologist/postuser", {
        method: "POST",
        body: formData, // Use FormData instead of JSON.stringify
      });

      const responseData = await response.json();
      console.log("API Response:", responseData);

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to add radiologist");
      }

      // Fetch users after successful addition to update the table
      await fetchUsers();

      setShowSuccessAdded(true);
      reset();
      setSignatureFile(null);
      setSelectedFileName(null);

      setTimeout(() => {
        setShowSuccessAdded(false);
      }, 2000);
    } catch (error) {
      console.error("Error adding radiologist:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/radiologist/getuser");
      const data = await response.json();
      console.log("Fetched Users:", data);

      if (response.ok) {
        setUsers(data.users);
      } else {
        throw new Error(data.message || "Failed to fetch radiologists");
      }
    } catch (error) {
      console.error("Fetch Radiologists Error:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: string) => {
    setShowDeleteConfirm(false);
    setShowSuccess(false);
    setLoading(true);

    try {
      const response = await fetch(`/api/radiologist/deleteuser?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete radiologist");
      }
      
      setShowSuccess(true);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
      
      setTimeout(() => {
        setShowSuccess(false);
      }, 2000);
    } catch (error) {
      console.error("Delete Radiologist Error:", error);
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const openDeleteConfirm = (id: string) => {
    setSelectedUser(id);
    setShowDeleteConfirm(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSignatureFile(file);
      setSelectedFileName(file.name);
      
      // Clear file error when a file is selected
      if (fileError) setFileError(null);
      
      // Validate file size
      if (file.size > 5 * 1024 * 1024) {
        setFileError("Signature must be less than 5MB");
      }
    } else {
      setSignatureFile(null);
      setSelectedFileName(null);
      setFileError("Signature file is required");
    }
  };
  
  const resetForm = () => {
    reset();
    setSelectedFileName(null);
    setSignatureFile(null);
    setFileError(null);
    setIsModalOpen(false);
  };
  
  return (
    <div className="p-4">
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
          className="bg-purple-600 text-purple-100 p-4 rounded-full shadow-lg hover:bg-purple-700"
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
          <div className="bg-white p-6 rounded-lg shadow-lg w-4/12 relative">
            {/* Close Button */}
            <button
              className="absolute top-2 right-2 text-stone-600 hover:text-stone-500"
              onClick={resetForm}
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-semibold mb-4">Add User</h2>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <div>
                <label className="block text-sm font-medium">
                  Radiologist Name<span className="text-red-500">*</span>
                </label>
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

              <div>
                <label className="block text-sm font-medium">
                  Qualifications<span className="text-red-500">*</span>
                </label>
                <input
                  {...register("qualifications")}
                  className="w-full border rounded-md px-2 py-1"
                />
                {errors.qualifications && (
                  <p className="text-red-500 text-sm">
                    {errors.qualifications.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium">Designation<span className="text-red-500">*</span></label>
                <input
                  {...register("designation")}
                  className="w-full border rounded-md px-2 py-1"
                />
                {errors.designation && (
                  <p className="text-red-500 text-sm">
                    {errors.designation.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium">MRN<span className="text-red-500">*</span></label>
                <input
                  {...register("mrn")}
                  className="w-full border rounded-md px-2 py-1"
                />
                {errors.mrn && (
                  <p className="text-red-500 text-sm">{errors.mrn.message}</p>
                )}
              </div>

              {/* Signature Upload */}
              <div>
                <label className="block text-sm font-medium">
                  Upload Signature<span className="text-red-500">*</span>
                </label>
                <div className="flex items-center space-x-2">
                  <label
                    htmlFor="file-upload"
                    className="w-auto mt-[1px] mr-1 text-sm cursor-pointer bg-stone-200 border border-stone-500 rounded-[2px] px-3 py-[1]"
                  >
                    Choose File
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    {...register("signature")}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {selectedFileName && (
                    <span className="w-[350px] text-sm text-gray-700 truncate">
                      {selectedFileName}
                    </span>
                  )}
                </div>
                {fileError && (
                  <p className="text-red-500 text-sm">{fileError}</p>
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
                Serial No
              </th>
              <th className="border-separate drop-shadow-lg bg-purple-600 text-white shadow-lg border-stone-300 px-2 py-2 text-center whitespace-nowrap">
                Radiologist Name
              </th>
              <th className="border-separate drop-shadow-lg bg-purple-600 text-white shadow-lg border-stone-300 px-2 py-2 text-center whitespace-nowrap">
                Email
              </th>
              <th className="border-separate drop-shadow-lg bg-purple-600 text-white shadow-lg border-stone-300 px-2 py-2 text-center whitespace-nowrap">
                Phone No.
              </th>
              <th className="border-separate drop-shadow-lg bg-purple-600 text-white shadow-lg border-stone-300 px-2 py-2 text-center whitespace-nowrap">
                Qualifications
              </th>
              <th className="border-separate drop-shadow-lg bg-purple-600 text-white shadow-lg border-stone-300 px-2 py-2 text-center whitespace-nowrap">
                Designation
              </th>
              <th className="border-separate drop-shadow-lg bg-purple-600 text-white shadow-lg border-stone-300 px-2 py-2 text-center whitespace-nowrap">
                MRN 
              </th>
              {/* <th className="border-separate drop-shadow-lg bg-purple-600 text-white shadow-lg border-stone-300 px-2 py-2 text-center whitespace-nowrap">
                Signature
              </th> */}
              <th className="border-separate drop-shadow-lg bg-purple-600 text-white shadow-lg border-stone-300 px-2 py-2 text-center whitespace-nowrap">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id} className="text-center">
                <td className="border px-4 py-2">{index + 1}</td>
                <td className="border px-4 py-2 items-center whitespace-nowrap">
                  <span>{user.name}</span>
                  {user.isDefault && (
                    <span className="ml-2 text-xs bg-purple-600 text-white px-2 py-1 rounded whitespace-nowrap">
                      Default User
                    </span>
                  )}
                </td>
                <td className="border px-4 py-2">{user.email}</td>
                <td className="border px-4 py-2">{user.phone}</td>
                <td className="border px-4 py-2">{user.qualifications}</td>
                <td className="border px-4 py-2">{user.designation}</td>
                <td className="border px-4 py-2">{user.mrn}</td>
                {/* <td className="border px-4 py-2">
                  {user.signatureUrl && (
                    <img 
                      src={user.signatureUrl} 
                      alt="Signature" 
                      className="h-12 object-contain mx-auto"
                    />
                  )}
                </td> */}
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
                Are you sure you want to delete this user?
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