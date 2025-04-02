"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import OrderData from "./_components/OrderData";
import { useState } from "react";

function Page() {
  const searchParams = useSearchParams();

  const patientId = searchParams?.get("patientId");
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
        </div>)
      }
      <table className="text-stone-700 w-full border-b border-l border-r border-stone-300 shadow-lg">
        <thead
          className="bg-purple-600 text-white shadow-lg px-2 py-2 text-center whitespace-nowrap"
          style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.4)" }}
        >
          <tr>
            <th className="px-4 py-2">Patient ID</th>
            <th className="px-4 py-2">Patient Name</th>
            <th className="px-4 py-2">Study Description</th>
            <th className="px-4 py-2">Gender</th>
            <th className="px-4 py-2">Modality</th>
            <th className="px-4 py-2">Study Date</th>
            <th className="px-4 py-2">Series</th>
          </tr>
        </thead>
        <tbody className="bg-stone-100 hover:bg-stone-200">
          <tr>
            <td className="px-4 py-2 text-center">{patientId}</td>
            <td className="px-4 py-2 text-center">{patientName}</td>
            <td className="px-4 py-2 text-center">{studyDescription}</td>
            <td className="px-4 py-2 text-center">{gender}</td>
            <td className="px-4 py-2 text-center">{modality}</td>
            <td className="px-4 py-2 text-center">
              {studyDate} {studyTime}
            </td>
            <td className="px-4 py-2 text-center">{series}</td>
          </tr>
        </tbody>
      </table>
      <OrderData patientId={patientId as string} patientName={patientName as string} gender={gender as string} />
    </div>
  );
}

export default Page;
