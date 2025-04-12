"use client";
import { Check, ChevronLeft, ChevronRight, Ticket, Trash } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { RxCaretSort } from "react-icons/rx";
import DateRangeSelector from "../_components/DateRangeSelector";
import { useActiveCase } from "@/app/context/ActiveCaseContext";
import { useCompletedCase } from "@/app/context/CompletedCaseContext";

interface Study {
  ID: string;
  PatientName: string;
  PatientID: string;
  PatientSex: string;
  StudyDescription: string;
  StudyDate: string;
  StudyTime: string;
  Modality: string;
  Series: number;
}

interface DateRangeSelectorProps {
  fromDate: string;
  setFromDate: (e: { target: { value: string } }) => void;
  toDate: string;
  setToDate: (e: { target: { value: string } }) => void;
}

export default function ActiveCasesPage() {
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedStudyID, setSelectedStudyID] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [studies, setStudies] = useState<Study[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPatientID, setSelectedPatientID] = useState<string>("");
  const rowsPerPage = 6;
  
  const { isActiveCase } = useActiveCase();
  const { setActiveCase } = useActiveCase();
  const { setCompletedCase } = useCompletedCase();

  const fetchStudies = async () => {
    try {
      const response = await fetch("/api/studies");
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${await response.text()}`);
      }
      const data: Study[] = await response.json();

      // Only update state if new studies are found (without reloading the page)
      if (data.length !== studies.length) {
        setStudies(data);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudies(); // Initial fetch
    const interval = setInterval(fetchStudies, 5000); // Poll every 5 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  // Then update your handleDeleteStudy function:
  const handleDeleteStudy = async (studyId: string | null) => {
    setShowSuccess(false);
    setLoading(true);
    setErrorMessage("");
  
    try {
      // First find the patient ID associated with this study before deleting
      const studyToDelete = studies.find(study => study.ID === studyId);
      const patientIdToUpdate = studyToDelete?.PatientID;
      
      const response = await fetch("/api/deleteCase", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studyId }),
      });
  
      const data = await response.json();
      console.log(data);
  
      if (response.ok) {
        // Remove from local storage first
        if (patientIdToUpdate) {
          // Remove from active case tracking
          setActiveCase(patientIdToUpdate, false, true);
          
          // Reset completed case status - add this line
          setCompletedCase(patientIdToUpdate, false, true);
          
          // Also explicitly remove from localStorage
          const activeCasesStr = localStorage.getItem('activeCases');
          if (activeCasesStr) {
            const activeCases: string[] = JSON.parse(activeCasesStr);
            const updatedActiveCases = activeCases.filter((id: string) => id !== patientIdToUpdate);
            localStorage.setItem('activeCases', JSON.stringify(updatedActiveCases));
          }
        }
        
        setShowDeleteConfirm(false);
        setShowSuccess(true);
  
        // Update the study list without refreshing the page
        setStudies((prevStudies) =>
          prevStudies.filter((study) => study.ID !== studyId)
        );
  
        setTimeout(() => {
          setShowSuccess(false);
        }, 2000);
      } else {
        setErrorMessage(data.message || "Failed to delete study.");
      }
    } catch (error) {
      console.error("Error deleting study:", error);
      setErrorMessage("An error occurred while deleting the study.");
    } finally {
      setLoading(false);
    }
  };
  
  // And update your handleDeleteAllStudies function:
  const handleDeleteAllStudies = async () => {
    setShowSuccess(false);
    setLoading(true);
    setErrorMessage("");
  
    try {
      // Extract all patient IDs from studies before deleting
      const patientIds: string[] = studies
        .map(study => study.PatientID)
        .filter((id): id is string => Boolean(id)); // Type guard to ensure non-null
      
      const response = await fetch("/api/deleteAllStudies", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
  
      const data = await response.json();
      
      if (response.ok) {
        // Set active case to false for all patient IDs
        patientIds.forEach((patientId: string) => {
          setActiveCase(patientId, false, true);
          // Reset completed case status for each patient - add this line
          setCompletedCase(patientId, false, true);
        });
        
        // Also clear the entire activeCases array in localStorage
        localStorage.setItem('activeCases', JSON.stringify([]));
        
        // Clear all completedCase entries from localStorage
        for (let i = localStorage.length - 1; i >= 0; i--) {
          const key = localStorage.key(i);
          if (key && key.startsWith('completedCase_')) {
            localStorage.removeItem(key);
          }
        }
        
        setShowSuccess(true);
        setStudies([]); // Clear the studies list after deletion
  
        setTimeout(() => {
          setShowSuccess(false);
        }, 2000);
      } else {
        setErrorMessage(data.message || "Failed to delete studies.");
      }
    } catch (error) {
      console.error("Error deleting all studies:", error);
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
      setShowConfirmModal(false);
    }
  };

  const parseStudyDate = (
    studyDate: string
  ): { dateObj: Date | null; formattedDate: string | null } => {
    if (!/^\d{8}$/.test(studyDate))
      return { dateObj: null, formattedDate: null }; // Ensure valid format

    const year = parseInt(studyDate.substring(0, 4));
    const month = parseInt(studyDate.substring(4, 6)) - 1;
    const day = parseInt(studyDate.substring(6, 8));

    const dateObj = new Date(year, month, day);
    const formattedDate = `${day.toString().padStart(2, "0")}/${(month + 1)
      .toString()
      .padStart(2, "0")}/${year}`; // DD/MM/YYYY

    return { dateObj, formattedDate };
  };

  // Filter Orders Based on Search & Date Range
  const filteredStudies = studies.filter((study) => {
    const { dateObj: createdAt, formattedDate } = parseStudyDate(
      study.StudyDate
    );

    // If parsing fails, exclude this study from filtering
    if (!createdAt) return false;

    const matchesSearch =
      study.PatientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      study.PatientID.toLowerCase().includes(searchQuery.toLowerCase()) ||
      study.StudyDescription.includes(searchQuery) ||
      (formattedDate && formattedDate.includes(searchQuery)) || // Check formatted date
      study.Modality.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDateRange =
      (!fromDate || createdAt >= new Date(fromDate)) &&
      (!toDate || createdAt <= new Date(toDate));

    return matchesSearch && matchesDateRange;
  });

  // Calculate Pagination
  const totalPages = Math.ceil(filteredStudies.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const displayedOrders = filteredStudies.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  useEffect(() => {
    if (displayedOrders.length === 0 && filteredStudies.length > 0) {
      setCurrentPage(1); // Redirect to first page if empty
    }
  }, [displayedOrders, filteredStudies]);

  const formatStudyTime = (studyTime: string): string | null => {
    if (!/^\d{6}(\.\d+)?$/.test(studyTime)) return null;
    const hours = studyTime.substring(0, 2);
    const minutes = studyTime.substring(2, 4);
    const seconds = studyTime.substring(4, 6);
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="p-4 relative h-auto min-h-screen">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-60 z-50">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white py-1 px-4 rounded-sm shadow-lg text-center transition-opacity duration-500">
          ✅ Deletion Successfull!
        </div>
      )}

      {/* Error Notification */}
      {errorMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white py-2 px-4 rounded-sm shadow-lg text-center transition-opacity duration-500">
          ❌ {errorMessage}
        </div>
      )}

      <h1 className="text-2xl font-semibold mb-4">Active Orders </h1>

      {/* Search Bar & Date Filters */}
      <div className="w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-1">
          {/* Left side: Search input and Date range selector */}
          <div className="flex flex-col sm:flex-row items-start gap-4 w-full md:w-auto">
            {/* Search input - wider than date pickers */}
            <div className="w-full sm:w-60 md:w-72 lg:w-80">
              <input
                type="text"
                placeholder="Search by Order Id, Patient, Modality ..."
                className="w-full border bg-stone-50 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Date range selector */}
            <div className="w-full sm:w-auto">
              <DateRangeSelector
                fromDate={fromDate}
                setFromDate={(e) => setFromDate(e.target.value)}
                toDate={toDate}
                setToDate={(e) => setToDate(e.target.value)}
              />
            </div>
          </div>

          {/* Right side: Sort icon and Clear All button */}
          <div className="flex items-center gap-4 self-end md:self-auto mt-2 md:mt-0">
            <div className="relative group p-1 hover:bg-purple-200 rounded-full">
              {/* Sort Icon */}
              <RxCaretSort className="h-6 w-6 text-purple-800" />

              {/* Tooltip - Positioned just above the icon */}
              <span className="absolute left-1/2 -translate-x-1/2 -top-8 bg-stone-950 text-white text-sm px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                Sort
              </span>
            </div>

            {/* Button */}
            <button
              style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.4)" }}
              onClick={() => setShowConfirmModal(true)}
              disabled={loading}
              className="bg-red-500 text-white px-4 py-2 rounded-sm shadow-md hover:bg-red-600 disabled:opacity-50 whitespace-nowrap"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <table className="w-full border-separate border-spacing-y-2">
        <thead>
          <tr>
            {[
              "Order Id",
              "Patient Name",
              "Study Description",
              "Gender",
              "Modality",
              "Study Date",
              "Series",
              "Action",
            ].map((col) => (
              <th
                key={col}
                className="bg-purple-600 text-white shadow-lg border-stone-300 px-2 py-2 text-center whitespace-nowrap "
                style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.4)" }}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {displayedOrders.length > 0
            ? displayedOrders.map((study) => (
                <tr
                  key={study.ID}
                  className={
                    isActiveCase(study.PatientID)
                      ? "bg-green-100 shadow-md text-purple-950"
                      : "hover:bg-stone-50 bg-stone-100 shadow-md text-purple-950"
                  }
                >
                  <td className="border-l border-b border-t border-stone-300 pl-4 pr-2 py-3 text-center">
                    {study.PatientID}
                  </td>
                  <td className="border-b border-t border-stone-300 px-2 py-3 text-center">
                    {study.PatientName}
                  </td>
                  <td className="border-b border-t border-stone-300 px-2 py-3 text-center">
                    {study.StudyDescription}
                  </td>
                  <td className="border-b border-t border-stone-300 px-2 py-3 text-center">
                    {study.PatientSex}
                  </td>
                  <td className="border-b border-t border-stone-300 px-2 py-3 text-center">
                    {study.Modality}
                  </td>
                  <td className="border-b border-t border-stone-300 px-2 py-3 text-center">
                    {parseStudyDate(study.StudyDate).formattedDate}{" "}
                    {formatStudyTime(study.StudyTime)}
                  </td>
                  <td className="border-b border-t border-stone-300 px-2 py-3 text-center">
                    {study.Series}
                  </td>
                  <td className="border-t border-b border-r border-stone-300 px-2 py-3 items-center justify-center flex">
                    {isActiveCase(study.PatientID) ? (
                      <div className="flex -ml-1 gap-4">
                        <button
                          onClick={() => {
                            setShowDeleteConfirm(true);
                            setSelectedStudyID(study.ID);
                            setSelectedPatientID(study.PatientID);
                          }}
                          disabled={loading}
                          className="text-white py-2"
                        >
                          <Trash className="text-red-500 hover:text-red-600" />
                        </button>
                        <Check
                          size={36}
                          strokeWidth={2}
                          className="my-[6px]  text-green-500"
                        />
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setShowDeleteConfirm(true);
                            setSelectedStudyID(study.ID);
                          }}
                          disabled={loading}
                          className="text-white py-2 mr-2"
                        >
                          <Trash className="text-red-500 hover:text-red-600" />
                        </button>
                        <Link
                          href={{
                            pathname: "/admin/create-order",
                            query: {
                              id: study.ID,
                              patientId: study.PatientID,
                              name: study.PatientName,
                              description: study.StudyDescription,
                              gender: study.PatientSex,
                              modality: study.Modality,
                              studyDate: parseStudyDate(study.StudyDate)
                                .formattedDate,
                              time: formatStudyTime(study.StudyTime),
                              series: study.Series,
                            },
                          }}
                        >
                          <ChevronRight
                            className="bg-purple-500 text-white m-2 p-1 h-8 w-8 rounded-full"
                            onClick={() => {
                              setLoading(true);
                            }}
                          />
                        </Link>
                      </>
                    )}
                  </td>
                </tr>
              ))
            : !loading && (
              <tr>
                <td colSpan={9} className="text-center py-3 text-gray-500">
                  No active orders found
                </td>
              </tr>
            )}
        </tbody>
      </table>

      {/* Confirmation Modal */}
      {showConfirmModal && !loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-purple-50 bg-opacity-50 p-6 rounded-sm shadow-lg w-96 text-center">
            <p className="mb-4">
              Are you sure you want to delete all studies? This action cannot be
              undone.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="bg-stone-200 px-4 py-2 rounded-sm shadow-sm hover:bg-stone-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAllStudies}
                disabled={loading}
                className="bg-red-500 text-white px-4 py-2 rounded-sm shadow-sm hover:bg-red-600 disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && !loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 backdrop-blur-sm">
          <div className="bg-purple-50 bg-opacity-50 text-black p-6 rounded-sm shadow-md">
            <p className="mb-4">Are you sure you want to delete this study?</p>
            <div className="flex space-x-4 justify-center">
              <button
                className="px-4 py-2 bg-stone-200 rounded-sm shadow-sm hover:bg-stone-300"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-sm shadow-sm hover:bg-red-600"
                onClick={() => handleDeleteStudy(selectedStudyID)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && ( // Hide pagination if there's only 1 page
        <div className="fixed bottom-4 right-4 flex items-center space-x-2 p-2">
          {/* Previous Button */}
          <button
            className={`p-1 rounded-full ${
              currentPage === 1
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-purple-200 text-purple-800"
            }`}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft />
          </button>

          {/* Page Numbers (Only show up to 5 pages at a time) */}
          {(() => {
            const pages = [];
            let startPage = Math.max(1, currentPage - 2);
            let endPage = Math.min(totalPages, startPage + 4);

            if (endPage - startPage < 4) {
              startPage = Math.max(1, endPage - 4);
            }

            for (let i = startPage; i <= endPage; i++) {
              pages.push(i);
            }

            return pages.map((page) => (
              <button
                key={page}
                className={`px-2 py-[2px] rounded-full text-sm ${
                  currentPage === page
                    ? "bg-purple-500 text-white"
                    : "bg-purple-100 hover:bg-purple-200"
                }`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ));
          })()}

          {/* Next Button */}
          <button
            className={`p-1 rounded-full ${
              currentPage === totalPages
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-purple-200 text-purple-800"
            }`}
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            <ChevronRight />
          </button>
        </div>
      )}
    </div>
  );
}
