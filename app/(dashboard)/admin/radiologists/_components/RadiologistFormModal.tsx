"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X } from "lucide-react";

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

// Updated schema with better file handling
const radiologistSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone must be at least 10 digits"),
  subspeciality: z
    .string()
    .min(2, "Subspeciality must be at least 2 characters"),
  qualifications: z
    .string()
    .min(2, "Qualifications must be at least 2 characters"),
  designation: z.string().min(2, "Designation must be at least 2 characters"),
  mrn: z.string().min(2, "MRN must be at least 2 characters"),
  signature: z.any(),
});

type RadiologistFormData = z.infer<typeof radiologistSchema>;

interface RadiologistFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RadiologistFormData, signatureFile: File | null) => Promise<void>;
  isLoading?: boolean;
  showMRNField?: boolean; // Optional prop to show/hide MRN field
}

export default function RadiologistFormModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  showMRNField = true
}: RadiologistFormModalProps) {
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

  // Load the file conversion utility on component mount
  useEffect(() => {
    // Import the function only on the client side
    import("../../../../utils/signatureConverter").then((module) => {
      handleFileConversion = module.handleFileConversion;
    });
  }, []);

  // Handle form submission
  const handleFormSubmit = async (data: RadiologistFormData) => {
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

    try {
      await onSubmit(data, signatureFile);
      resetForm();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
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
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-40">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto relative">
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-stone-600 hover:text-stone-800 transition-colors"
          onClick={handleClose}
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-semibold mb-6 text-stone-800">
          Add New Radiologist
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Radiologist Name<span className="text-red-500">*</span>
            </label>
            <input
              {...register("name")}
              className="w-full border border-stone-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-stone-500 transition-colors"
              placeholder="Enter radiologist name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Email<span className="text-red-500">*</span>
            </label>
            <input
              {...register("email")}
              type="email"
              className="w-full border border-stone-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-stone-500 transition-colors"
              placeholder="Enter email address"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Phone No.<span className="text-red-500">*</span>
            </label>
            <input
              {...register("phone")}
              type="tel"
              className="w-full border border-stone-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-stone-500 transition-colors"
              placeholder="Enter phone number"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Qualifications<span className="text-red-500">*</span>
            </label>
            <select
              {...register("qualifications")}
              className="w-full border border-stone-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-stone-500 transition-colors bg-white"
              defaultValue=""
            >
              <option value="" disabled>
                Select Qualifications
              </option>
              <option value="MD in Radiodiagnosis">
                MD in Radiodiagnosis
              </option>
              <option value="DNB in Radiodiagnosis">
                DNB in Radiodiagnosis
              </option>
              <option value="DMRD (Diploma in Medical Radiodiagnosis)">
                DMRD (Diploma in Medical Radiodiagnosis)
              </option>
              <option value="MBBS with PG Diploma in Radiodiagnosis">
                MBBS with PG Diploma in Radiodiagnosis
              </option>
              <option value="MD/DNB in Radiodiagnosis with Fellowship in Breast Imaging">
                MD/DNB in Radiodiagnosis with Fellowship in Breast Imaging
              </option>
              <option value="MD/DNB in Radiodiagnosis with Fellowship in Neuroradiology">
                MD/DNB in Radiodiagnosis with Fellowship in Neuroradiology
              </option>
              <option value="MD/DNB in Radiodiagnosis with Fellowship in Musculoskeletal Imaging">
                MD/DNB in Radiodiagnosis with Fellowship in Musculoskeletal
                Imaging
              </option>
              <option value="MD/DNB in Radiodiagnosis with Fellowship in Cardiothoracic Imaging">
                MD/DNB in Radiodiagnosis with Fellowship in Cardiothoracic
                Imaging
              </option>
              <option value="MD/DNB in Radiodiagnosis with Fellowship in Abdominal Imaging">
                MD/DNB in Radiodiagnosis with Fellowship in Abdominal
                Imaging
              </option>
              <option value="MD/DNB in Radiodiagnosis with Fellowship in Head and Neck Imaging">
                MD/DNB in Radiodiagnosis with Fellowship in Head and Neck
                Imaging
              </option>
              <option value="MD/DNB in Radiodiagnosis with Fellowship in Pediatric Radiology">
                MD/DNB in Radiodiagnosis with Fellowship in Pediatric
                Radiology
              </option>
              <option value="MD/DNB in Radiodiagnosis with Fellowship in Nuclear Medicine">
                MD/DNB in Radiodiagnosis with Fellowship in Nuclear Medicine
              </option>
              <option value="MD/DNB in Radiodiagnosis with Fellowship in Interventional Radiology">
                MD/DNB in Radiodiagnosis with Fellowship in Interventional
                Radiology
              </option>
              <option value="DMRD with Fellowship in Cross-Sectional Imaging">
                DMRD with Fellowship in Cross-Sectional Imaging
              </option>
              <option value="DMRD with Fellowship in Neuroimaging">
                DMRD with Fellowship in Neuroimaging
              </option>
              <option value="DMRD with Fellowship in MSK Imaging">
                DMRD with Fellowship in MSK Imaging
              </option>
            </select>
            {errors.qualifications && (
              <p className="text-red-500 text-sm mt-1">
                {errors.qualifications.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Subspeciality<span className="text-red-500">*</span>
            </label>
            <select
              {...register("subspeciality")}
              className="w-full border border-stone-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-stone-500 transition-colors bg-white"
              defaultValue=""
            >
              <option value="" disabled>
                Select Subspeciality
              </option>
              <option value="Neuroradiology">Neuroradiology</option>
              <option value="Musculoskeletal Radiology">
                Musculoskeletal Radiology
              </option>
              <option value="Cardiovascular Radiology">
                Cardiovascular Radiology
              </option>
              <option value="Thoracic Radiology">Thoracic Radiology</option>
              <option value="Abdominal and Pelvic Radiology">
                Abdominal and Pelvic Radiology
              </option>
              <option value="Head and Neck Radiology">
                Head and Neck Radiology
              </option>
              <option value="Pediatric Radiology">
                Pediatric Radiology
              </option>
              <option value="Nuclear Medicine">Nuclear Medicine</option>
              <option value="Breast Imaging">Breast Imaging</option>
              <option value="Obstetric and Gynecologic Imaging">
                Obstetric and Gynecologic Imaging
              </option>
              <option value="Interventional Radiology">
                Interventional Radiology
              </option>
              <option value="General Radiology">General Radiology</option>
            </select>
            {errors.subspeciality && (
              <p className="text-red-500 text-sm mt-1">
                {errors.subspeciality.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Designation<span className="text-red-500">*</span>
            </label>
            <input
              {...register("designation")}
              className="w-full border border-stone-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-stone-500 transition-colors"
              placeholder="Enter designation"
            />
            {errors.designation && (
              <p className="text-red-500 text-sm mt-1">
                {errors.designation.message}
              </p>
            )}
          </div>

          {showMRNField && (
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                MRN<span className="text-red-500">*</span>
              </label>
              <input
                {...register("mrn")}
                className="w-full border border-stone-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-stone-500 transition-colors"
                placeholder="Enter MRN"
              />
              {errors.mrn && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.mrn.message}
                </p>
              )}
            </div>
          )}

          {/* Signature Upload */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Upload Signature<span className="text-red-500">*</span>
            </label>
            <div className="flex items-center space-x-3">
              <label
                htmlFor="file-upload"
                className="cursor-pointer bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-md px-4 py-2 text-sm font-medium text-stone-700 transition-colors"
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
                <span className="flex-1 text-sm text-stone-600 truncate">
                  {selectedFileName}
                </span>
              )}
            </div>
            {fileError && (
              <p className="text-red-500 text-sm mt-1">{fileError}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-stone-300 text-stone-700 rounded-md hover:bg-stone-50 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-stone-700 text-white rounded-md hover:bg-stone-800 transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}