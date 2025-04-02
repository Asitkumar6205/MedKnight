"use client"
import { useEffect, useState } from "react";

interface CompletedOrder {
  id: number;
  patientName: string;
  gender: string;
  study: string;
  modality: string;
  assignedTo: string;
  date: string;
  priority: string;
  report: string;
  files: string[];
  image: string;
}

export default function page() {
  const [completedOrders, setCompletedOrders] = useState<CompletedOrder[]>([]);

//   useEffect(() => {
//     // Fetch completed cases from API (Replace with your actual API endpoint)
//     fetch("/api/completed-orders")
//       .then((res) => res.json())
//       .then((data) => setCompletedOrders(data))
//       .catch((error) => console.error("Error fetching completed orders:", error));
//   }, []);

  return (
    <div className="overflow-x-auto p-4">
      <h1 className="text-2xl font-semibold">Completed Cases</h1>
      <table className="w-full border-collapse border border-stone-300 shadow-lg">
        <thead className="bg-stone-200">
          <tr>
            {[
              "Order Id",
              "Patient Name",
              "Gender",
              "Study",
              "Modality",
              "Assigned To",
              "Date",
              "Priority",
              "Report",
              "Files",
              "Image",
              "Action",
            ].map((col) => (
              <th key={col} className="border border-stone-300 px-4 py-2 text-left">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {completedOrders.length > 0 ? (
            completedOrders.map((order) => (
              <tr key={order.id} className="hover:bg-stone-100">
                <td className="border border-stone-300 px-4 py-2">{order.id}</td>
                <td className="border border-stone-300 px-4 py-2">{order.patientName}</td>
                <td className="border border-stone-300 px-4 py-2">{order.gender}</td>
                <td className="border border-stone-300 px-4 py-2">{order.study}</td>
                <td className="border border-stone-300 px-4 py-2">{order.modality}</td>
                <td className="border border-stone-300 px-4 py-2">{order.assignedTo}</td>
                <td className="border border-stone-300 px-4 py-2">{order.date}</td>
                <td className="border border-stone-300 px-4 py-2">{order.priority}</td>
                <td className="border border-stone-300 px-4 py-2">{order.report}</td>
                <td className="border border-stone-300 px-4 py-2">
                  {order.files.length} files
                </td>
                <td className="border border-stone-300 px-4 py-2">
                  <img src={order.image} alt="Scan" className="w-10 h-10 object-cover" />
                </td>
                <td className="border border-stone-300 px-4 py-2">
                  <button className="bg-green-500 text-white px-3 py-1 rounded">View Report</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={12} className="text-center py-4">No Completed Cases Found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
