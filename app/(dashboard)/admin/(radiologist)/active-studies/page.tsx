"use client";
import { ChevronLeft, ChevronRight, Trash } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { RxCaretSort } from "react-icons/rx";
import DateRangeSelector from "../../_components/DateRangeSelector";

interface Study {
  id: string;
  patientName: string;
  patientId: string;
  gender: string;
  studyDescription: string;
  studyDate: string;
  studyTime: string;
  modality: string;
  series: number;
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
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const fetchStudies = async () => {
    try {
      const response = await fetch("/api/getOrder");
      const data = await response.json();
      setStudies(data.cases);
    } catch (error) {
      console.error("Error fetching cases:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudies(); // Initial fetch
    const interval = setInterval(fetchStudies, 5000); // Poll every 5 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

// Filter Orders Based on Search & Date Range
const filteredStudies = studies.filter((study) => {
  // For search filtering (case-insensitive)
  const lowerQuery = searchQuery.toLowerCase();
  const matchesSearch = searchQuery === "" ? true : (
    study.patientName.toLowerCase().includes(lowerQuery) ||
    study.patientId.toLowerCase().includes(lowerQuery) ||
    study.studyDescription.toLowerCase().includes(lowerQuery) ||
    study.studyDate.includes(searchQuery) ||
    study.studyTime.includes(searchQuery) ||
    study.modality.toLowerCase().includes(lowerQuery)
  );

  // If we're not filtering by date or search query is empty, skip date parsing
  if ((!fromDate && !toDate) || !matchesSearch) {
    return matchesSearch;
  }
  
  // Parse studyDate (DD/MM/YYYY) to Date object
  try {
    // Split the date parts
    const [day, month, year] = study.studyDate.split('/').map(part => parseInt(part, 10));
    
    // Create Date object (months are 0-indexed in JavaScript)
    const studyDateObj = new Date(year, month - 1, day);
    
    // Create Date objects from fromDate and toDate (which are in YYYY-MM-DD format)
    const fromDateObj = fromDate ? new Date(fromDate) : null;
    const toDateObj = toDate ? new Date(toDate) : null;
    
    // Ensure beginning and end of day for proper comparison
    if (fromDateObj) fromDateObj.setHours(0, 0, 0, 0);
    if (toDateObj) toDateObj.setHours(23, 59, 59, 999);
    
    // Check if date is in range
    const afterFromDate = !fromDateObj || studyDateObj >= fromDateObj;
    const beforeToDate = !toDateObj || studyDateObj <= toDateObj;
    
    return afterFromDate && beforeToDate;
  } catch (e) {
    // If date parsing fails, exclude from results when date filtering is active
    console.log("Date parsing error for study:", study.id, e);
    return false;
  }
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

      <h1 className="text-2xl font-semibold mb-4">Active Studies </h1>

      {/* Search Bar & Date Filters */}
      <div className="w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
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
            {/* <button
              style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.4)" }}
              onClick={() => setShowConfirmModal(true)}
              disabled={loading}
              className="bg-red-500 text-white px-4 py-2 rounded-sm shadow-md hover:bg-red-600 disabled:opacity-50 whitespace-nowrap"
            >
              Clear All
            </button> */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <table className="w-full border-separate border-spacing-y-3">
        <thead>
          <tr>
            {[
              "Study Id",
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
            ? displayedOrders.map((study, index) => {
                const dicomPath = `C:/Users/asit_/Downloads/case${index + 1}`;
                const weasisUrl = `weasis://${encodeURIComponent(
                  `$dicom:get -l "${dicomPath}"`
                )}`;
                return (
                  <tr
                    key={study.id}
                    className="hover:bg-stone-50 bg-stone-100 shadow-md text-purple-950"
                  >
                    <td className="border-l border-b border-t border-stone-300 px-2 py-4 text-center">
                      {study.patientId}
                    </td>
                    <td className="border-b border-t border-stone-300 px-2 py-4 text-center">
                      {study.patientName}
                    </td>
                    <td className="border-b border-t border-stone-300 px-2 py-4 text-center">
                      {study.studyDescription}
                    </td>
                    <td className="border-b border-t border-stone-300 px-2 py-4 text-center">
                      {study.gender}
                    </td>
                    <td className="border-b border-t border-stone-300 px-2 py-4 text-center">
                      {study.modality}
                    </td>
                    <td className="border-b border-t border-stone-300 px-2 py-4 text-center">
                      {study.studyDate} {study.studyTime}
                    </td>
                    <td className="border-b border-t border-stone-300 px-2 py-4 text-center">
                      {study.series}
                    </td>
                    <td className="border-t border-b border-r border-stone-300 px-2 py-4 items-center justify-center flex">
                      <button
                        onClick={() => {
                          setShowDeleteConfirm(true);
                          setSelectedStudyID(study.id);
                        }}
                        disabled={loading}
                        className="text-white py-2 mr-2"
                      >
                        <Trash className="text-red-500 hover:text-red-600" />
                      </button>
                      <Link
                        href={{
                          pathname: "/admin/report",
                          query: {
                            id: study.id,
                            patientId: study.patientId,
                            name: study.patientName,
                            description: study.studyDescription,
                            gender: study.gender,
                            modality: study.modality,
                            studyDate: study.studyDate,
                            time: study.studyTime,
                            series: study.series,
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
                    </td>
                  </tr>
                );
              })
            : null}
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
                // onClick={handleDeleteAllStudies}
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
                // onClick={() => handleDeleteStudy(selectedStudyID)}
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
