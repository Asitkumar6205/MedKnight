"use client";
import { ChevronLeft, ChevronRight, FileSpreadsheet } from "lucide-react";
import { useEffect, useState } from "react";
import { RxCaretSort } from "react-icons/rx";
import DateRangeSelector from "../../../(dashboard)/admin/_components/DateRangeSelector";
import InvoiceGenerator from "./InvoiceGenerator";

interface Payment {
  id: string;
  patientName: string;
  patientId: string;
  modality: string;
  studyDescription: string;
  reportTime: string;
  activatedDateTime?: string;
  completedDateTime?: string;
  urgentPremium?: boolean;
  nightHawk?: boolean;
  oms?: boolean;
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
  price: number; // Changed from Number to number for consistency
}

// Helper function to get individual study price
const getStudyPrice = (study: Study, numberOfViews: number): number => {
  const basePrice = study.price || 0;
  return basePrice * numberOfViews;
};

// Helper function to flatten payments into individual study rows
const flattenPaymentsToStudyRows = (payments: Payment[]) => {
  const flattenedRows: Array<{
    paymentId: string;
    studyId: string;
    patientName: string;
    patientId: string;
    studyDescription: string;
    reportTime: string;
    activatedDateTime?: string;
    completedDateTime?: string;
    urgentPremium?: boolean;
    nightHawk?: boolean;
    oms?: boolean;
    modality?: string;
    study: Study;
    studyPrice: number;
    studyViews: number;
  }> = [];

  payments.forEach((payment) => {
    if (payment.studies.length > 0) {
      payment.studies.forEach((study) => {
        const studyViews =
          study.studySide.length +
          study.studyType.length +
          study.studyView.length;

        const actualViews = studyViews > 0 ? studyViews : 1;

        flattenedRows.push({
          paymentId: payment.id,
          studyId: study.id,
          patientName: payment.patientName,
          patientId: payment.patientId,
          studyDescription: payment.studyDescription,
          reportTime: payment.reportTime,
          activatedDateTime: payment.activatedDateTime,
          completedDateTime: payment.completedDateTime,
          urgentPremium: payment.urgentPremium,
          nightHawk: payment.nightHawk,
          oms: payment.oms,
          modality: payment.modality,
          study: study,
          studyPrice: getStudyPrice(study, actualViews), // FIXED: Now multiplies by views
          studyViews: actualViews,
        });
      });
    } else {
      // If no studies array, fallback to total amount (legacy support)
      const views = payment.numberOfViews || 1;
      flattenedRows.push({
        paymentId: payment.id,
        studyId: `${payment.id}-default`,
        patientName: payment.patientName,
        patientId: payment.patientId,
        studyDescription: payment.studyDescription,
        reportTime: payment.reportTime,
        activatedDateTime: payment.activatedDateTime,
        completedDateTime: payment.completedDateTime,
        urgentPremium: payment.urgentPremium,
        nightHawk: payment.nightHawk,
        oms: payment.oms,
        modality: payment.modality,
        study: {
          id: `${payment.id}-default`,
          name: payment.studyDescription,
          studyType: [],
          studyView: [],
          studySide: [],
          price: payment.totalAmount / views, // Base price per view
        },
        studyPrice: payment.totalAmount, // Total already calculated
        studyViews: views,
      });
    }
  });

  return flattenedRows;
};

// Excel export utility function
const exportToExcel = (data: Payment[], fromDate: string, toDate: string) => {
  // Flatten the data first
  const flattenedData = flattenPaymentsToStudyRows(data);

  // Create CSV content
  const headers = [
    "Date",
    "Order ID",
    "Patient Name",
    "Modality",
    "Study",
    "Activated Date & Time",
    "Completed Date & Time",
    "Urgent Premium",
    "Night Hawk",
    "OMS",
    "No.of Views",
    "No.of Report",
    "Cost",
  ];

  const csvContent = [
    headers.join(","),
    ...flattenedData.map((row) => {
      const studyDetails = [
        ...row.study.studySide,
        ...row.study.studyView,
        ...row.study.studyType,
      ].join(" ");

      const studyName = `${row.study.name}${
        studyDetails ? ` - ${studyDetails}` : ""
      }`;

      return [
        `"${row.reportTime}"`,
        `"${row.patientId}"`,
        `"${row.patientName}"`,
        `"${row.modality || "N/A"}"`,
        `"${studyName}"`,
        `"${row.activatedDateTime || "N/A"}"`,
        `"${row.completedDateTime || row.reportTime}"`,
        `"${row.urgentPremium ? "Yes" : "No"}"`,
        `"${row.nightHawk ? "Yes" : "No"}"`,
        `"${row.oms ? "Yes" : "No"}"`,
        row.studyViews,
        1, // numberOfReports is 1 per study row
        row.studyPrice,
      ].join(",");
    }),
  ].join("\n");

  // Create blob and download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);

  const dateRange =
    fromDate && toDate
      ? `_${fromDate}_to_${toDate}`
      : fromDate
      ? `_from_${fromDate}`
      : toDate
      ? `_to_${toDate}`
      : "";

  link.setAttribute("download", `transaction_history${dateRange}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default function PaymentsPage() {
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [payments, setPayments] = useState<Payment[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string>("");
  const [isExporting, setIsExporting] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("transaction");
  const rowsPerPage = 8;

  const fetchStudies = async () => {
    try {
      const response = await fetch("/api/getCompletedCases");

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${await response.text()}`);
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

  // Flatten filtered payments to study rows for display
  const flattenedStudyRows = flattenPaymentsToStudyRows(filteredPayments);

  // Calculate Pagination based on flattened rows
  const totalPages = Math.ceil(flattenedStudyRows.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const displayedStudyRows = flattenedStudyRows.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  useEffect(() => {
    if (displayedStudyRows.length === 0 && flattenedStudyRows.length > 0) {
      setCurrentPage(1); // Redirect to first page if empty
    }
  }, [displayedStudyRows, flattenedStudyRows]);

  // Calculate total amount for displayed study rows using actual study prices
  const totalAmount = flattenedStudyRows.reduce(
    (sum, row) => sum + row.studyPrice,
    0
  );

  // Handle Excel export
  const handleExcelExport = async () => {
    if (filteredPayments.length === 0) {
      alert("No data to export. Please adjust your filters.");
      return;
    }

    setIsExporting(true);
    try {
      // Add a small delay to show the loading state
      await new Promise((resolve) => setTimeout(resolve, 500));
      exportToExcel(filteredPayments, fromDate, toDate);
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      alert("Failed to export data. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="p-4 relative h-auto min-h-screen">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-60 z-50">
          <div className="w-12 h-12 border-4 border-stone-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <div className="flex justify-between items-center mb-1">
        <h1 className="text-2xl font-semibold">Payments</h1>
        <div className="text-sm px-3 py-1 rounded">
          <span className="text-indigo-500">
            <span className="text-stone-700">Total:</span> ₹
            {totalAmount.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-4">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              className={`${
                activeTab === "transaction"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm`}
              onClick={() => setActiveTab("transaction")}
            >
              Transaction
            </button>
            <button
              className={`${
                activeTab === "invoice"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm`}
              onClick={() => setActiveTab("invoice")}
            >
              Invoice
            </button>
          </nav>
        </div>
      </div>

      {/* Search Bar & Date Filters */}
      <div className="w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
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

          {/* Right side: Sort icon, Filter, Export Excel, and Export buttons */}
          <div className="flex gap-2 items-center self-end md:self-auto mr-1 mt-2 md:mt-0">
            <div className="relative group p-1 hover:bg-purple-200 rounded-full">
              {/* Sort Icon */}
              <RxCaretSort className="h-6 w-6 text-stone-700" />
              <span className="absolute left-1/2 -translate-x-1/2 -top-8 bg-stone-950 text-white text-sm px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                Sort
              </span>
            </div>

            {/* Excel Export Button */}
            <button
              onClick={handleExcelExport}
              disabled={isExporting || filteredPayments.length === 0}
              className={`relative group p-2 rounded-full transition-all ${
                isExporting || filteredPayments.length === 0
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-green-200"
              }`}
              title="Export to Excel"
            >
              {isExporting ? (
                <div className="w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <FileSpreadsheet size={18} className="text-green-600" />
              )}
              <span className="absolute left-1/2 -translate-x-1/2 -top-8 bg-stone-950 text-white text-sm px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Export Excel
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Export Info Banner */}
      {(fromDate || toDate) && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileSpreadsheet size={16} className="text-blue-600" />
              <span className="text-sm text-blue-700">
                Excel export ready: {filteredPayments.length} records
                {fromDate && ` from ${fromDate}`}
                {toDate && ` to ${toDate}`}
              </span>
            </div>
            <button
              onClick={handleExcelExport}
              disabled={isExporting || filteredPayments.length === 0}
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isExporting ? "Exporting..." : "Download Excel"}
            </button>
          </div>
        </div>
      )}

      {/* Content based on active tab */}
      {activeTab === "transaction" && (
        <>
          {/* Main Content - Transaction Table */}
          <table className="w-full">
            <thead>
              <tr>
                {[
                  "Date",
                  "Patient ID",
                  "Patient Name",
                  "Modality",
                  "Study",
                  "No. of Reports",
                  "No. of Views",
                  "Total Cost",
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
              {displayedStudyRows.length > 0
                ? displayedStudyRows.map((row, index) => (
                    <tr
                      key={`${row.paymentId}-${row.studyId}-${index}`}
                      className="hover:bg-stone-50 bg-white shadow-xs text-sm text-stone-700"
                    >
                      <td className="border-b border-stone-300 px-4 py-4 text-center whitespace-nowrap">
                        {row.reportTime
                          ? new Date(
                              row.reportTime.replace("-", " ")
                            ).toLocaleDateString("en-US", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })
                          : ""}
                      </td>
                      <td className="border-b border-stone-300 px-2 py-4 text-center">
                        {row.patientId}
                      </td>
                      <td className="border-b border-stone-300 px-2 py-4 text-center">
                        {row.patientName}
                      </td>
                      <td className="border-b border-stone-300 px-2 py-4 text-center">
                        {row.modality}
                      </td>
                      <td className="border-b border-stone-300 px-2 py-4 text-center">
                        <div>
                          {row.study.name}
                          {(() => {
                            const allDetails = [
                              ...row.study.studySide,
                              ...row.study.studyView,
                              ...row.study.studyType,
                            ].filter(Boolean);

                            return allDetails.length > 0
                              ? ` - ${allDetails.join(", ")}`
                              : "";
                          })()}
                        </div>
                      </td>
                      <td className="border-b border-stone-300 px-2 py-4 text-center">
                        1
                      </td>
                      <td className="border-b border-stone-300 px-2 py-4 text-center">
                        {row.studyViews}
                      </td>
                      <td className="border-b border-stone-300 px-2 py-4 text-center text-indigo-500">
                        ₹{row.studyPrice.toFixed(2)}
                      </td>
                    </tr>
                  ))
                : !loading && (
                    <tr>
                      <td
                        colSpan={8}
                        className="text-center py-4 text-gray-500"
                      >
                        No payment records found
                      </td>
                    </tr>
                  )}
            </tbody>
          </table>
        </>
      )}

      {activeTab === "invoice" && (
        <div>
          <InvoiceGenerator payments={payments} />
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && activeTab === "transaction" && (
        <div className="fixed bottom-4 right-4 flex items-center space-x-2 p-2">
          {/* Previous Button */}
          <button
            className={`p-1 rounded-full ${
              currentPage === 1
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-stone-200 text-stone-800"
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
                    ? "bg-stone-600 text-white"
                    : "bg-stone-100 hover:bg-stone-200"
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
                : "hover:bg-stone-200 text-stone-800"
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
