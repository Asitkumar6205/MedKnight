"use client";

import { useEffect, useState } from "react";
import { UserPlus } from "lucide-react";
import RadiologistFormModal from "./RadiologistFormModal";
import RadiologistTable from "./RadiologistTable";

// Create a type definition for the imported function
type HandleFileConversionFunction = (
  signatureFile: File,
  setConversionStatus?: (status: string) => void
) => Promise<{
  originalFile: File;
  svgBlob: Blob | null;
  svgFileName: string | null;
}>;

// Use dynamic import for the file conversion utility
let handleFileConversion: HandleFileConversionFunction;

type Radiologist = {
  id: string;
  name: string;
  email: string;
  phone: string;
  subspeciality: string;
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

type RadiologistFormData = {
  name: string;
  email: string;
  phone: string;
  subspeciality: string;
  qualifications: string;
  designation: string;
  mrn: string;
  signature?: any;
};

function RadiologistManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [radiologists, setRadiologists] = useState<Radiologist[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showSuccessAdded, setShowSuccessAdded] = useState(false);

  // Load the file conversion utility on component mount
  useEffect(() => {
    // Import the function only on the client side
    import("../../../../utils/signatureConverter").then((module) => {
      handleFileConversion = module.handleFileConversion;
    });
  }, []);

  // Handle form submission
  const handleFormSubmit = async (
    data: RadiologistFormData,
    signatureFile: File | null
  ) => {
    if (!signatureFile) {
      throw new Error("Signature file is required");
    }

    // Make sure handleFileConversion is loaded
    if (!handleFileConversion) {
      await import("../../../../utils/signatureConverter").then((module) => {
        handleFileConversion = module.handleFileConversion;
      });
    }

    setIsModalOpen(false);
    setShowSuccessAdded(false);
    setLoading(true);

    try {
      // Convert signature image to SVG first
      const conversionResult = await handleFileConversion(
        signatureFile,
        (status) => console.log("Conversion status:", status)
      );

      // Create form data for file upload
      const formData = new FormData();

      // Add original signature file
      formData.append("signature", signatureFile);

      // Add SVG file if conversion was successful
      if (conversionResult.svgBlob) {
        const svgFile = new File(
          [conversionResult.svgBlob],
          conversionResult.svgFileName || "signature.svg",
          { type: "image/svg+xml" }
        );
        formData.append("signatureSvg", svgFile);
      }

      // Add form fields
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("phone", data.phone);
      formData.append("subspeciality", data.subspeciality);
      formData.append("qualifications", data.qualifications);
      formData.append("designation", data.designation);
      formData.append("mrn", data.mrn);

      // Also add the SVG data as string if needed by your backend
      if (conversionResult.svgBlob) {
        const svgText = await conversionResult.svgBlob.text();
        formData.append("svgData", svgText);
      }

      const response = await fetch("/api/radiologist/postuser", {
        method: "POST",
        body: formData,
      });

      const responseData = await response.json();
      console.log("API Response:", responseData);

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to add radiologist");
      }

      // Fetch users after successful addition to update the table
      await fetchRadiologists();

      setShowSuccessAdded(true);

      setTimeout(() => {
        setShowSuccessAdded(false);
      }, 2000);
    } catch (error) {
      console.error("Error adding radiologist:", error);
      throw error; // Re-throw to be handled by the modal
    } finally {
      setLoading(false);
    }
  };

  const fetchRadiologists = async () => {
    try {
      const response = await fetch("/api/radiologist/getuser");
      const data = await response.json();
      console.log("Fetched Radiologists:", data);

      if (response.ok) {
        setRadiologists(data.users);
      } else {
        throw new Error(data.message || "Failed to fetch radiologists");
      }
    } catch (error) {
      console.error("Fetch Radiologists Error:", error);
    }
  };

  useEffect(() => {
    fetchRadiologists();
  }, []);

  const handleDelete = async (id: string) => {
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
      setRadiologists((prev) =>
        prev.filter((radiologist) => radiologist.id !== id)
      );

      setTimeout(() => {
        setShowSuccess(false);
      }, 2000);
    } catch (error) {
      console.error("Delete Radiologist Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-60 z-50">
          <div className="w-12 h-12 border-4 border-stone-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white py-2 px-4 rounded-md shadow-lg text-center transition-opacity duration-500 z-50">
          ✅ Deletion Successful!
        </div>
      )}

      {showSuccessAdded && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white py-2 px-4 rounded-md shadow-lg text-center transition-opacity duration-500 z-50">
          ✅ Radiologist Added Successfully!
        </div>
      )}

      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">
            Radiologists Overview
          </h1>
        </div>
        {/* <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-stone-700 text-white px-4 py-2 rounded-md hover:bg-stone-800 transition-colors"
          disabled={loading}
        >
          <UserPlus size={18} />
          Add Radiologist
        </button> */}
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-stone-600">Total Radiologists</p>
              <p className="text-2xl font-bold text-stone-800">
                {radiologists.length}
              </p>
            </div>
            <div className="bg-stone-100 p-3 rounded-full">
              <UserPlus className="w-6 h-6 text-stone-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-stone-600">Active Radiologists</p>
              <p className="text-2xl font-bold text-green-600">
                {radiologists.filter((r) => !r.isDefault).length}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <div className="w-6 h-6 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-stone-600">Subspecialities</p>
              <p className="text-2xl font-bold text-blue-600">
                {new Set(radiologists.map((r) => r.subspeciality)).size}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Radiologist Table */}
      <RadiologistTable
        radiologists={radiologists}
        onDelete={handleDelete}
        isLoading={loading}
        showMRNColumn={true}
      />

      {/* Form Modal */}
      <RadiologistFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        isLoading={loading}
        showMRNField={true}
      />
    </div>
  );
}

export default RadiologistManagement;
