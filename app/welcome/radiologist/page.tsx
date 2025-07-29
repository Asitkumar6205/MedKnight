"use client";

import { useEffect, useState } from "react";
import RadiologistFormModal from "./RadiologistFormModal";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Stethoscope, X } from "lucide-react"; // Added icons for radiologist welcome modal

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

// Welcome Modal Props
interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
}

// Welcome Modal Component
const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose, userName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Stethoscope className="h-8 w-8 text-blue-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Welcome, Doctor!</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            Welcome to the platform, <span className="font-semibold text-blue-600">Dr. {userName}</span>!
          </p>
          <p className="text-gray-600 mb-4">
            To get started, we need to set up your radiologist profile. This includes your 
            professional information, qualifications, and digital signature for reports.
          </p>
          <p className="text-sm text-gray-500">
            This is a one-time setup process that will enable you to create and sign radiology reports.
          </p>
        </div>
        
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Set Up Profile
          </button>
        </div>
      </div>
    </div>
  );
};

function RadiologistManagement() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [radiologists, setRadiologists] = useState<Radiologist[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showSuccessAdded, setShowSuccessAdded] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false); // Added welcome modal state

  useEffect(() => {
    if (status === 'loading') return; // Still loading

    if (!session) {
      router.push('/auth/signin');
      return;
    }

    // Check if user is a radiologist
    if (session.user?.role !== 'RADIOLOGIST') {
      router.push('/admin');
      return;
    }

    // Optional: Check if setup is already completed
    const checkSetupStatus = async () => {
      try {
        const response = await fetch('/api/radiologist/check-setup');
        const data = await response.json();
        
        if (data.hasCompleted) {
          router.push('/admin');
        } else {
          // Show welcome modal if setup is not completed
          setShowWelcomeModal(true);
        }
      } catch (error) {
        console.error('Error checking setup status:', error);
        // Show welcome modal if there's an error checking status
        setShowWelcomeModal(true);
      }
    };

    checkSetupStatus();
  }, [session, status, router]);

  // Load the file conversion utility on component mount
  useEffect(() => {
    // Import the function only on the client side
    import("../../utils/signatureConverter").then((module) => {
      handleFileConversion = module.handleFileConversion;
    });
  }, []);

  // Handle welcome modal close
  const handleWelcomeModalClose = () => {
    setShowWelcomeModal(false);
  };

  // Handle form submission
  const handleFormSubmit = async (data: RadiologistFormData, signatureFile: File | null) => {
    if (!signatureFile) {
      throw new Error("Signature file is required");
    }

    // Make sure handleFileConversion is loaded
    if (!handleFileConversion) {
      await import("../../utils/signatureConverter").then((module) => {
        handleFileConversion = module.handleFileConversion;
      });
    }

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
      setRadiologists((prev) => prev.filter((radiologist) => radiologist.id !== id));

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

      {/* Welcome Modal */}
      <WelcomeModal
        isOpen={showWelcomeModal}
        onClose={handleWelcomeModalClose}
        userName={session?.user?.name || "Doctor"}
      />

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

      {/* Form Modal */}
      <RadiologistFormModal
        onSubmit={handleFormSubmit}
        isLoading={loading}
        showMRNField={true}
      />
    </div>
  );
}

export default RadiologistManagement;