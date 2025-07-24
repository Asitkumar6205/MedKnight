"use client";

import { useState } from "react";
import { Trash } from "lucide-react";

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

interface RadiologistTableProps {
  radiologists: Radiologist[];
  onDelete: (id: string) => Promise<void>;
  isLoading?: boolean;
  showMRNColumn?: boolean; // Optional prop to show/hide MRN column
}

export default function RadiologistTable({
  radiologists,
  onDelete,
  isLoading = false,
  showMRNColumn = true
}: RadiologistTableProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");

  const handleDeleteClick = (id: string) => {
    setSelectedUserId(id);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedUserId) {
      await onDelete(selectedUserId);
      setShowDeleteConfirm(false);
      setSelectedUserId("");
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setSelectedUserId("");
  };

  // Dynamic table headers based on props
  const headers = [
    "Serial No.",
    "Radiologist Name",
    "Email",
    "Phone No.",
    "Qualifications",
    "Designation",
    ...(showMRNColumn ? ["MRN"] : []),
    "Signature",
    "Action",
  ];

  return (
    <>
      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-full bg-white shadow-sm rounded-lg overflow-hidden">
          <thead>
            <tr>
              {headers.map((col, index, arr) => (
                <th
                  key={col}
                  className={`
                    bg-stone-800 text-stone-100 text-xs px-4 py-3 text-center 
                    whitespace-nowrap uppercase tracking-wider font-medium
                    ${index === 0 ? "rounded-tl-lg" : ""} 
                    ${index === arr.length - 1 ? "rounded-tr-lg" : ""}
                  `}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200">
            {radiologists.length === 0 ? (
              <tr>
                <td 
                  colSpan={headers.length} 
                  className="px-4 py-8 text-center text-stone-500"
                >
                  No radiologists found
                </td>
              </tr>
            ) : (
              radiologists.map((radiologist, index) => (
                <tr key={radiologist.id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-4 py-4 text-center text-sm text-stone-900">
                    {index + 1}
                  </td>
                  <td className="px-4 py-4 text-center text-sm text-stone-900 whitespace-nowrap font-medium">
                    {radiologist.name}
                  </td>
                  <td className="px-4 py-4 text-center text-sm text-stone-600">
                    {radiologist.email}
                  </td>
                  <td className="px-4 py-4 text-center text-sm text-stone-600">
                    {radiologist.phone}
                  </td>
                  <td className="px-4 py-4 text-center text-sm text-stone-600 max-w-xs truncate">
                    {radiologist.qualifications}
                  </td>
                  <td className="px-4 py-4 text-center text-sm text-stone-600">
                    {radiologist.designation}
                  </td>
                  {showMRNColumn && (
                    <td className="px-4 py-4 text-center text-sm text-stone-600">
                      {radiologist.mrn}
                    </td>
                  )}
                  <td className="px-4 py-4 text-center">
                    {radiologist.signatureUrl || radiologist.signature?.path ? (
                      <div className="flex justify-center">
                        <img
                          src={radiologist.signatureUrl || radiologist.signature?.path}
                          alt={`${radiologist.name}'s signature`}
                          className="max-w-20 max-h-12 object-contain border border-stone-200 rounded"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.parentElement!.innerHTML = '<span class="text-stone-400 text-xs">No signature</span>';
                          }}
                        />
                      </div>
                    ) : (
                      <span className="text-stone-400 text-xs">No signature</span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <button
                      className="text-red-400 hover:text-red-600 transition-colors p-1 disabled:opacity-50"
                      onClick={() => handleDeleteClick(radiologist.id)}
                      disabled={isLoading}
                    >
                      <Trash strokeWidth={2} size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && !isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm mx-4">
            <h3 className="text-lg font-semibold text-stone-800 mb-3">
              Confirm Deletion
            </h3>
            <p className="text-stone-600 mb-6">
              Are you sure you want to delete this radiologist? This action cannot be
              undone.
            </p>
            <div className="flex space-x-3 justify-end">
              <button
                className="px-4 py-2 bg-stone-100 text-stone-700 rounded-md hover:bg-stone-200 transition-colors"
                onClick={handleDeleteCancel}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                onClick={handleDeleteConfirm}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}