"use client";
import { Suspense } from "react";
import CaseUpload from "./_components/CaseUpload";
import { useSearchParams } from "next/navigation";

function CreateOrder() {
  const searchParams = useSearchParams();

  const patientId = searchParams?.get("patientId");
  const patientName = searchParams?.get("name");
  const studyDescription = searchParams?.get("description");
  const gender = searchParams?.get("gender");
  const modality = searchParams?.get("modality");
  const studyDate = searchParams?.get("studyDate");
  const studyTime = searchParams?.get("time");
  const series = searchParams?.get("series");

  return (
    <div className="p-4 h-auto min-h-screen bg-stone-100">
      <table className="text-stone-700 w-full rounded-t-md overflow-hidden">
        <thead className="
          bg-stone-800 text-stone-100 text-xs text-center 
          whitespace-nowrap uppercase tracking-wider
          rounded-t-md">
            <tr>
              <th className="px-4 py-3 font-normal first:rounded-tl-md">Patient ID</th>
              <th className="px-4 py-3 font-normal">Patient Name</th>
              <th className="px-4 py-3 font-normal">Study Description</th>
              <th className="px-4 py-3 font-normal">Gender</th>
              <th className="px-4 py-3 font-normal">Modality</th>
              <th className="px-4 py-3 font-normal">Study Date</th>
              <th className="px-4 py-3 font-normal last:rounded-tr-md">Series</th>
            </tr>
          </thead>
          <tbody className="">
            <tr className="bg-white">
              <td className="px-4 py-2 text-center">{patientId}</td>
              <td className="px-4 py-2 text-center">{patientName}</td>
              <td className="px-4 py-2 text-center">{studyDescription}</td>
              <td className="px-4 py-2 text-center">{gender}</td>
              <td className="px-4 py-2 text-center">{modality}</td>
              <td className="px-4 py-2 text-center">{studyDate} {studyTime}</td>
              <td className="px-4 py-2 text-center">{series}</td>
            </tr>
          </tbody>
        </table>
      <CaseUpload />
    </div>
  );
}

// Main page component that wraps the client component with Suspense
function Page() {
  return (
    <Suspense fallback={<div className="p-4">Loading report data...</div>}>
      <CreateOrder />
    </Suspense>
  );
}

export default Page;
