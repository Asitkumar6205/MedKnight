"use client";
import { useSearchParams } from "next/navigation";
import OrderData from "./_components/OrderData";
import { useState, Suspense } from "react";

// Create a client component that uses useSearchParams
function ReportContent() {
  const searchParams = useSearchParams();

  const patientId = searchParams?.get("patientId");
  const studyUID = searchParams?.get("studyUID");
  const patientName = searchParams?.get("name");
  const studyDescription = searchParams?.get("description");
  const gender = searchParams?.get("gender");
  const modality = searchParams?.get("modality");
  const studyDate = searchParams?.get("studyDate");
  const studyTime = searchParams?.get("time");
  const series = searchParams?.get("series");

  const [loading, setLoading] = useState(false);

  return (
    <div className="p-4 h-auto min-h-screen bg-stone-100">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-60 z-50">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <table className="w-full">
        <thead>
          <tr>
            {[
              "Patient ID",
              "Patient Name",
              "Study Description",
              "Gender",
              "Modality",
              "Study Date",
              "Series",
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
        <tbody>
          <tr className="hover:bg-stone-50 bg-white shadow-xs text-stone-700">
            <td className="border-stone-300 px-4 py-2 text-center">
              {patientId}
            </td>
            <td className="border-stone-300 px-4 py-2 text-center">
              {patientName}
            </td>
            <td className="border-stone-300 px-4 py-2 text-center">
              {studyDescription}
            </td>
            <td className="border-stone-300 px-4 py-2 text-center">{gender}</td>
            <td className="border-stone-300 px-4 py-2 text-center">
              {modality}
            </td>
            <td className="border-stone-300 px-4 py-2 text-center">
              {studyDate} {studyTime}
            </td>
            <td className="border-stone-300 px-4 py-2 text-center">{series}</td>
          </tr>
        </tbody>
      </table>
      <OrderData
        patientId={patientId as string}
        studyUID={studyUID as string}
        patientName={patientName as string}
        gender={gender as string}
      />
    </div>
  );
}

// Main page component that wraps the client component with Suspense
function Page() {
  return (
    <Suspense fallback={<div className="p-4">Loading report data...</div>}>
      <ReportContent />
    </Suspense>
  );
}

export default Page;