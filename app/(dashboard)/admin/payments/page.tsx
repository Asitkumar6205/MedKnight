"use client";
import { ChevronLeft, ChevronRight, Download, Filter } from "lucide-react";
import { useEffect, useState } from "react";
import { RxCaretSort } from "react-icons/rx";
import DateRangeSelector from "../../../(dashboard)/admin/_components/DateRangeSelector";

interface Payment {
  id: string;
  patientName: string;
  patientId: string;
  studyDescription: string;
  reportTime: string;
  totalAmount: number;
  numberOfReports: number;
  numberOfViews: number;
  studies: Study[];
}

interface Study {
  id: string;
  name: string;
  studyType: string[];
  studyView: string[];
  studySide: string[];
}

export default function PaymentsPage() {
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [payments, setPayments] = useState<Payment[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string>("");
  const rowsPerPage = 5;

  const fetchStudies = async () => {
    try {
      const response = await fetch("/api/getCompletedCases");

      if (!response.ok) {
        throw new Error(`Error ₹{response.status}: ₹{await response.text()}`);
      }

      const data = await response.json();

      // Check if we got cases data before setting the state
      if (data.cases && Array.isArray(data.cases)) {
        setPayments(data.cases);
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

  // Filter Payments Based on Search & Date Range
  const filteredPayments = payments.filter((payment) => {
    // For search filtering (case-insensitive)
    const lowerQuery = searchQuery.toLowerCase();
    const matchesSearch =
      searchQuery === ""
        ? true
        : payment.patientName.toLowerCase().includes(lowerQuery) ||
          payment.patientId.toLowerCase().includes(lowerQuery) ||
          payment.studyDescription.toLowerCase().includes(lowerQuery) ||
          payment.reportTime.includes(searchQuery);

    // If we're not filtering by date or search query is empty, skip date parsing
    if ((!fromDate && !toDate) || !matchesSearch) {
      return matchesSearch;
    }

    // Parse reportedDate (DD/MM/YYYY) to Date object
    try {
      // Split the date parts
      const [day, month, year] = payment.reportTime
        .split("/")
        .map((part) => parseInt(part, 10));

      // Create Date object (months are 0-indexed in JavaScript)
      const reportedDateObj = new Date(year, month - 1, day);

      // Create Date objects from fromDate and toDate (which are in YYYY-MM-DD format)
      const fromDateObj = fromDate ? new Date(fromDate) : null;
      const toDateObj = toDate ? new Date(toDate) : null;

      // Ensure beginning and end of day for proper comparison
      if (fromDateObj) fromDateObj.setHours(0, 0, 0, 0);
      if (toDateObj) toDateObj.setHours(23, 59, 59, 999);

      // Check if date is in range
      const afterFromDate = !fromDateObj || reportedDateObj >= fromDateObj;
      const beforeToDate = !toDateObj || reportedDateObj <= toDateObj;

      return afterFromDate && beforeToDate;
    } catch (e) {
      // If date parsing fails, exclude from results when date filtering is active
      console.log("Date parsing error for payment:", payment.id, e);
      return false;
    }
  });

  // Calculate Pagination
  const totalPages = Math.ceil(filteredPayments.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const displayedPayments = filteredPayments.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  useEffect(() => {
    if (displayedPayments.length === 0 && filteredPayments.length > 0) {
      setCurrentPage(1); // Redirect to first page if empty
    }
  }, [displayedPayments, filteredPayments]);

  // Calculate total amount for displayed payments
  const totalAmount = filteredPayments.reduce(
    (sum, payment) => sum + payment.totalAmount,
    0
  );

  return (
    <div className="p-4 relative h-auto min-h-screen">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-60 z-50">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Payments</h1>
        <div className="bg-purple-100 p-2 rounded-md">
          <span className="font-bold text-purple-800">
            Total: ₹{totalAmount.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Search Bar & Date Filters */}
      <div className="w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          {/* Left side: Search input and Date range selector */}
          <div className="flex flex-col sm:flex-row items-start gap-4 w-full md:w-auto">
            {/* Search input - wider than date pickers */}
            <div className="w-full sm:w-60 md:w-72 lg:w-80">
              <input
                type="text"
                placeholder="Search by Patient ID, Name, Study..."
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

          {/* Right side: Sort icon, Filter, and Export buttons */}
          <div className="flex items-center gap-4 self-end md:self-auto mt-2 md:mt-0">
            <div className="relative group p-1 hover:bg-purple-200 rounded-full">
              {/* Sort Icon */}
              <RxCaretSort className="h-6 w-6 text-purple-800" />
              <span className="absolute left-1/2 -translate-x-1/2 -top-8 bg-stone-950 text-white text-sm px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                Sort
              </span>
            </div>
            <div className="relative group p-1 hover:bg-purple-200 rounded-full">
              {/* Filter Icon */}
              <Filter className="h-6 w-6 text-purple-800" />
              <span className="absolute left-1/2 -translate-x-1/2 -top-8 bg-stone-950 text-white text-sm px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                Filter
              </span>
            </div>
            <button className="flex items-center gap-1 bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700 transition-all">
              <Download size={16} />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <table className="w-full border-separate border-spacing-y-3">
        <thead>
          <tr>
            {[
              "Reported Date",
              "Patient ID",
              "Patient Name",
              "Study",
              "Total Cost",
              "No. of Reports",
              "No. of Views",
            ].map((col) => (
              <th
                key={col}
                className="bg-purple-600 text-white shadow-lg border-stone-300 px-2 py-2 text-center whitespace-nowrap"
                style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.4)" }}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {displayedPayments.length > 0
            ? displayedPayments.map((payment) => (
                <tr
                  key={payment.id}
                  className="hover:bg-stone-50 bg-stone-100 shadow-md text-purple-950"
                >
                  <td className="border-l border-b border-t border-stone-300 px-2 py-4 text-center">
                    {payment.reportTime
                      ? new Date(
                          payment.reportTime.replace("-", " ")
                        ).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      : ""}
                  </td>
                  <td className="border-b border-t border-stone-300 px-2 py-4 text-center">
                    {payment.patientId}
                  </td>
                  <td className="border-b border-t border-stone-300 px-2 py-4 text-center">
                    {payment.patientName}
                  </td>
                  <td className="border-b border-t border-stone-300 px-2 py-4 text-center">
                    {payment.studies.length > 0 && (
                      <div>
                        {payment.studies.map((studyItem, index) => (
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
                            {index < payment.studies.length - 1 && ", "}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="border-b border-t border-stone-300 px-2 py-4 text-center font-semibold">
                    ₹{payment.totalAmount}
                  </td>
                  <td className="border-b border-t border-stone-300 px-2 py-4 text-center">
                    {/* {payment.numberOfReports} */}1
                  </td>
                  <td className="border-b border-t border-stone-300 px-2 py-4 text-center">
                    {payment.studies
                      .map((study) => {
                        const totalLength =
                          study.studySide.length +
                          study.studyType.length +
                          study.studyView.length;
                        return totalLength > 0 ? totalLength : 1;
                      })
                      .join(",")}
                  </td>
                </tr>
              ))
            : !loading && (
                <tr>
                  <td colSpan={8} className="text-center py-4 text-gray-500">
                    No payment records found
                  </td>
                </tr>
              )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="fixed bottom-4 right-4 flex items-center space-x-2 p-2">
          {/* Previous Button */}
          <button
            className={`p-1 rounded-full ₹{
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
                className={`px-2 py-[2px] rounded-full text-sm ₹{
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
            className={`p-1 rounded-full ₹{
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
