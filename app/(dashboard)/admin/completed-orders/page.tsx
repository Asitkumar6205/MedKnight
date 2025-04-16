"use client";
import { ChevronLeft, ChevronRight, FileCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { RxCaretSort } from "react-icons/rx";
import DateRangeSelector from "../../../(dashboard)/admin/_components/DateRangeSelector";
import Link from "next/link";

interface Case {
  id: string;
  patientName: string;
  patientId: string;
  doctor: string;
  gender: string;
  studyDescription: string;
  studyDate: string;
  studyTime: string;
  radiologist: string;
  modality: string;
  studies: Study[];
  priority: string;
  history: string;
  report: Report;
  series: number;
  reportTime: string;
  reviewCase: boolean;
}

interface Study {
  id: string;
  name: string;
  studyType: string[];
  studyView: string[];
  studySide: string[];
}

interface Report {
  id: string;
  filename: string;
  path: string;
  uploadedAt: string;
}

interface DateRangeSelectorProps {
  fromDate: string;
  setFromDate: (e: { target: { value: string } }) => void;
  toDate: string;
  setToDate: (e: { target: { value: string } }) => void;
}

export default function ActiveCasesPage() {
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [studies, setStudies] = useState<Case[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string>("");
  const rowsPerPage = 6;

  const fetchStudies = async () => {
    try {
      const response = await fetch("/api/getCompletedCases");

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${await response.text()}`);
      }

      const data = await response.json();

      // Check if we got cases data before setting the state
      if (data.cases && Array.isArray(data.cases)) {
        setStudies(data.cases);
      } else {
        console.error("Unexpected data format received:", data);
        setError("Failed to fetch studies: Unexpected data format");
      }
    } catch (error) {
      console.error("Error fetching active cases:", error);
      setError(
        error instanceof Error ? error.message : "Failed to fetch studies"
      );
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
    const matchesSearch =
      searchQuery === ""
        ? true
        : study.patientName.toLowerCase().includes(lowerQuery) ||
          study.patientId.toLowerCase().includes(lowerQuery) ||
          study.studyDescription.toLowerCase().includes(lowerQuery) ||
          study.studyDate.includes(searchQuery) ||
          study.studyTime.includes(searchQuery) ||
          study.modality.toLowerCase().includes(lowerQuery);

    // If we're not filtering by date or search query is empty, skip date parsing
    if ((!fromDate && !toDate) || !matchesSearch) {
      return matchesSearch;
    }

    // Parse studyDate (DD/MM/YYYY) to Date object
    try {
      // Split the date parts
      const [day, month, year] = study.studyDate
        .split("/")
        .map((part) => parseInt(part, 10));

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
          <div className="w-12 h-12 border-4 border-stone-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <h1 className="text-2xl font-semibold mb-4">Completed Studies </h1>

      {/* Search Bar & Date Filters */}
      <div className="w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-1">
          {/* Left side: Search input and Date range selector */}
          <div className="flex flex-col sm:flex-row items-start gap-4 w-full md:w-auto">
            {/* Search input - wider than date pickers */}
            <div className="w-full sm:w-60 md:w-72 lg:w-96">
              <input
                type="text"
                placeholder="Search by Order Id, Patient, Modality ..."
                className="w-full border placeholder:text-sm text-stone-700 bg-white py-1 px-2 ml-1 rounded focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all"
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
            <div className="relative group p-1 hover:bg-stone-200 rounded-full">
              {/* Sort Icon */}
              <RxCaretSort className="h-6 w-6 text-stone-800" />

              {/* Tooltip - Positioned just above the icon */}
              <span className="absolute left-1/2 -translate-x-1/2 -top-8 bg-stone-950 text-stone-100 text-sm px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                Sort
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <table className="w-full mt-2">
        <thead>
          <tr>
            {[
              "Study Id",
              "Patient Name",
              "Study",
              "Gender",
              "Study Date",
              "Radiologist",
              "Status",
              "Action",
            ].map((col, index, arr) => (
              <th
                key={col}
                className={`
            bg-stone-800 text-stone-100 text-xs px-4 py-3 text-center 
            whitespace-nowrap uppercase tracking-wider font-medium
            ${index === 0 ? "rounded-tl-md" : ""} 
            ${index === arr.length - 1 ? "rounded-tr-md" : ""}
          `}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="">
          {displayedOrders.length > 0
            ? displayedOrders.map((study, index) => {
                const dicomPath = `C:/Users/asit_/Downloads/case${index + 1}`;
                const weasisUrl = `weasis://${encodeURIComponent(
                  `$dicom:get -l "${dicomPath}"`
                )}`;
                return (
                  <tr
                    key={study.id}
                    className="hover:bg-stone-50 bg-white shadow-xs text-sm text-stone-700"
                  >
                    <td className="border-b border-stone-300 px-4 py-4 text-center whitespace-nowrap">
                      {study.patientId}
                    </td>
                    <td className="border-b border-stone-300 px-2 py-4 text-center">
                      {study.patientName}
                    </td>
                    <td className="border-b border-stone-300 px-2 py-4 text-center">
                      {study.studies.length > 0 && (
                        <div>
                          {study.studies.map((studyItem, index) => (
                            <span key={studyItem.id || index}>
                              {studyItem.name}
                              {(studyItem.studySide.length > 0 ||
                                studyItem.studyView.length > 0 ||
                                studyItem.studyType.length > 0) &&
                                " - "}
                              {studyItem.studySide.length > 0
                                ? studyItem.studySide.join(", ")
                                : studyItem.studyView.length > 0
                                ? studyItem.studyView.join(", ")
                                : studyItem.studyType.length > 0
                                ? studyItem.studyType.join(", ")
                                : ""}
                              {index < study.studies.length - 1 && ", "}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="border-b border-stone-300 px-2 py-4 text-center">
                      {study.gender}
                    </td>
                    <td className="border-b border-stone-300 px-2 py-4 text-center">
                      {study.studyDate}
                    </td>
                    <td className="border-b border-stone-300 px-2 py-4 text-center">
                      {study.radiologist}
                    </td>
                    <td className="border-b border-stone-300 px-2 py-4 text-center">
                      {study.reviewCase ? (
                        <h2 className="text-sm bg-blue-100 py-1 px-2 rounded font-bold mt-2 text-blue-400 animate-pulse mb-2">
                          Under Review
                        </h2>
                      ) : (
                        <h2 className="text-sm bg-green-100 py-1 px-2 rounded font-bold mt-2 text-green-400 mb-2">
                          Final
                        </h2>
                      )}
                    </td>
                    <td className="border-b border-stone-300 px-2 py-4 text-center">
                      <div className="flex items-center justify-center">
                        <div>
                          <Link
                            href={study.report?.path || ""}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-400 hover:text-purple-600"
                          >
                            <FileCheck strokeWidth={1} size={24} />
                          </Link>
                        </div>
                        <div>
                          <Link
                            href={{
                              pathname: "/admin/completed-orders/case-review",
                              query: {
                                id: study.id,
                                patientId: study.patientId,
                                doctor: study.doctor,
                                patientName: study.patientName,
                                history: study.history,
                                studies: study.studies
                                  .map((study) => study.name)
                                  .join(", "),
                                gender: study.gender,
                                modality: study.modality,
                                studyType:
                                  study.studies
                                    .flatMap((study) => study.studyType)
                                    .join(", ") || "",
                                studySide:
                                  study.studies
                                    .flatMap((study) => study.studySide)
                                    .join(", ") || "",
                                studyView:
                                  study.studies
                                    .flatMap((study) => study.studyView)
                                    .join(", ") || "",
                                radiologist: study.radiologist,
                                series: study.series,
                                report: study.report.path,
                                reportTime: study.reportTime || "",
                                reviewCase: study.reviewCase,
                              },
                            }}
                          >
                            <ChevronRight
                              className="text-stone-600 hover:text-stone-800 m-2 p-1 h-8 w-8 rounded-full"
                              onClick={() => {
                                setLoading(true);
                              }}
                            />
                          </Link>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })
            : !loading && (
                <tr>
                  <td colSpan={8} className="text-center py-4 text-gray-500">
                    No completed studies found
                  </td>
                </tr>
              )}
        </tbody>
      </table>

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
