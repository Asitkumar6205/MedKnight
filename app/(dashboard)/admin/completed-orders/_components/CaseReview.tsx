"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FileText, Send, Users, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Define Zod Schema for validation
const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  reason: z.string().min(2, "Reason Must be at least 2 characters"),
  phone: z.string().min(10, "Phone must be at least 10 digits"),
  isDefault: z.boolean().optional(),
});

type UserFormData = z.infer<typeof userSchema>;

type User = {
  id: string; // Ensure ID exists
  name: string;
  reason: string;
  phone: string;
  isDefault?: boolean;
};

interface ReviewFormData {
  name: string; // technician name/id
  phone: string; // doctor phone number
  reason: string; // review reason
  isDefault?: boolean; // connect ref doctor checkbox
}

function CaseReview() {
  const searchParams = useSearchParams();

  const patientId = searchParams?.get("patientId");
  const doctor = searchParams?.get("doctor");
  const patientName = searchParams?.get("patientName");
  const history = searchParams?.get("history");
  const radiologist = searchParams?.get("radiologist");
  const modality = searchParams?.get("modality");
  const studies = searchParams?.get("studies");
  const studyType = searchParams?.get("studyType");
  const studySide = searchParams?.get("studySide");
  const studyView = searchParams?.get("studyView");
  const series = searchParams?.get("series");
  const report = searchParams?.get("report");
  const reportTime = searchParams?.get("reportTime");
  const reviewCase = searchParams?.get("reviewCase");
  const [loading, setLoading] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [showSuccessSent, setShowSuccessSent] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });

  const onReviewSubmit = async (data: ReviewFormData) => {
    setIsReviewModalOpen(false);
    setShowSuccessSent(false);
    setLoading(true);

    try {
      // Get the selected technician name from the options
      const selectedTechnician = users.find((tech) => tech.id === data.name);
      const technicianName = selectedTechnician ? selectedTechnician.name : "";

      // Prepare the data to be sent to the API
      const updateData = {
        patientId: patientId, // You'll need to get the case ID from props or state
        doctorPhNo: data.phone,
        technicianName: technicianName,
        reviewReason: data.reason,
      };

      // Send the update request
      const response = await fetch(`/api/caseReview`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      console.log("API Response:", response);

      if (!response.ok) {
        throw new Error("Failed to update case review information");
      }

      // Reset the form or close the modal/redirect as needed
      setShowSuccessSent(true);
      reset();
      setTimeout(() => {
        setShowSuccessSent(false);
        router.push("/admin/completed-orders");
      }, 2000); // Assuming you have a function to close the modal/form
    } catch (error) {
      console.error("Error updating review information:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/hospital/getuser");
      const data = await response.json();
      console.log("Fetched Users:", data);

      if (response.ok) {
        setUsers(data.users);
      } else {
        throw new Error(data.message || "Failed to fetch users");
      }
    } catch (error) {
      console.error("Fetch Users Error:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-4 h-auto min-h-screen bg-stone-100">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-60 z-50">
          <div className="w-12 h-12 border-4 border-stone-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      {showSuccessSent && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white py-1 px-4 rounded-sm shadow-lg text-center transition-opacity duration-500 z-10">
          ✅ User Added Successfully!
        </div>
      )}

      <table className="text-stone-700 w-full rounded-t-md overflow-hidden">
        <thead
          className="
          bg-stone-800 text-stone-100 text-xs text-center 
          whitespace-nowrap uppercase tracking-wider
          rounded-t-md"
        >
          <tr>
            <th className="px-4 py-3 font-normal">Patient ID</th>
            <th className="px-4 py-3 font-normal">Patient Name</th>
            <th className="px-4 py-3 font-normal">Clinical History</th>
            <th className="px-4 py-3 font-normal">Refering Doctor</th>
            <th className="px-4 py-3 font-normal">Radiologist</th>
            <th className="px-4 py-3 font-normal">Modality</th>
            <th className="px-4 py-3 font-normal">Series</th>
          </tr>
        </thead>
        <tbody className="bg-white">
          <tr>
            <td className="px-4 py-2 text-center">{patientId}</td>
            <td className="px-4 py-2 text-center">{patientName}</td>
            <td className="px-4 py-2 text-center">{history}</td>
            <td className="px-4 py-2 text-center">{doctor}</td>
            <td className="px-4 py-2 text-center">{radiologist}</td>
            <td className="px-4 py-2 text-center">{modality}</td>
            <td className="px-4 py-2 text-center">{series}</td>
          </tr>
        </tbody>
      </table>
      <h2 className="text-2xl font-bold text-stone-700 mt-8 mb-2">
        Send for Review
      </h2>
      <div className="my-2 p-6 border rounded shadow-xs bg-white ">
        <div className="flex justify-between bg-white">
          <h3 className="text-lg font-bold text-stone-700 justify-center flex">
            Study
          </h3>
          {reviewCase == "true" ? (
            <h2 className="text-sm bg-blue-100 py-2 px-8 rounded font-bold text-blue-600 animate-pulse mb-2">
              Under Review
            </h2>
          ) : (
            <h2 className="text-sm bg-green-100 py-1 px-6 rounded font-bold text-green-400 mb-2">
              Final
            </h2>
          )}
        </div>
        <div className="mb-8 mt-4 p-5 border-t border-b rounded">
          {studies ? (
            <ul className="px-2 gap-2 items-start justify-start flex flex-col">
              {studies.split(",").map((study, index) => (
                <li key={index} className="font-normal list-none border px-4 py-2 text-stone-700 border-stone-200 rounded bg-stone-50">
                  {study.trim()}
                  {(studyType || studySide || studyView) && index === 0 ? (
                    <span className="text-stone-500 ml-1">
                      - {studyType || studySide || studyView}
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-stone-500">No studies available</p>
          )}
        </div>
        <h1 className="font-bold text-lg text-stone-700">Report</h1>
        <div className="grid grid-cols-2 gap-2">
          <div className="pl-2 pt-5 mr-2 flex justify-start -ml-2">
            <button className="border rounded text-sm flex justify-center items-center px-3 my-2  hover:bg-stone-100 text-stone-500">
              <span className="mr-1">
                <Link
                  href={report || ""}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View
                </Link>
              </span>
              <FileText size={15} strokeWidth={1} className="text-stone-700" />
            </button>
            <span className="ml-2 mb-1 pb-1 flex items-end text-xs italic underline text-stone-500">
              Reported On: {reportTime}
            </span>
          </div>
          <div className="p-2 flex gap-4 justify-end">
            {/* Add User Button */}
            <div className="flex justify-center mt-2 ">
              <button
                onClick={() =>
                  reviewCase !== "true" && setIsReviewModalOpen(true)
                }
                disabled={reviewCase == "true"}
                className={`py-2 pl-6 px-8 rounded flex gap-2 items-center ${
                  reviewCase == "true"
                    ? "bg-stone-100 text-stone-300 border cursor-not-allowed"
                    : "bg-stone-700 text-stone-100 hover:bg-stone-800"
                }`}
              >
                <span>
                  <Send size={20} strokeWidth={1} />
                </span>
                <span> Send for Review </span>
              </button>
            </div>

            {/* Review Modal */}
            {isReviewModalOpen && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-10">
                <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
                  {/* Close Button */}
                  <button
                    className="absolute top-2 right-2 text-stone-600 hover:text-stone-500"
                    onClick={() => setIsReviewModalOpen(false)}
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <h2 className="text-xl font-semibold mb-4">
                    Send Report for Review
                  </h2>

                  {/* Form */}
                  <form
                    onSubmit={handleSubmit(onReviewSubmit)}
                    className="space-y-3"
                  >
                    <div>
                      <label className="block text-sm font-medium">
                        Technician<span className="text-red-500">*</span>
                      </label>
                      <select
                        {...register("name")}
                        className="w-full border rounded px-2 py-1"
                      >
                        {users.map((technician) => (
                          <option key={technician.id} value={technician.id}>
                            {technician.name}
                          </option>
                        ))}
                      </select>
                      {errors.name && (
                        <p className="text-red-500 text-sm">
                          {errors.name.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium">
                        Ref. Doctor Phone No.
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        {...register("phone")}
                        className="w-full border rounded px-2 py-1"
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm">
                          {errors.phone.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium">
                        Reason for Review<span className="text-red-500">*</span>
                      </label>
                      <textarea
                        {...register("reason")}
                        className="w-full border rounded px-2 py-1 resize-none h-28 -mb-2"
                      />
                      {errors.reason && (
                        <p className="text-red-500 text-sm">
                          {errors.reason.message}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center ">
                      <input
                        type="checkbox"
                        {...register("isDefault")}
                        className="mr-1 items-end"
                      />
                      <label className="items-end text-sm">
                        Connect Ref Doctor
                      </label>
                    </div>

                    <div className="flex justify-center">
                      <button
                        type="submit"
                        className="bg-stone-700 text-white px-8 py-2 rounded hover:bg-stone-800"
                      >
                        Send
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
            {/* Add User Button */}
            <div className="flex justify-center mt-2">
              <button
                onClick={() => setIsConnectModalOpen(true)}
                className=" bg-white text-blue-500 py-[7px] pl-6 px-8 rounded border border-blue-400 hover:bg-blue-50 flex gap-2 items-center"
              >
                <span className="">
                  <Users size={20} strokeWidth={1} />
                </span>
                <span className="">Connect Ref Doctor</span>
              </button>
            </div>

            {/* Review Modal */}
            {isConnectModalOpen && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-10">
                <div className="bg-white px-6 py-8 rounded-lg shadow-lg  relative">
                  {/* Close Button */}
                  <button
                    className="absolute top-2 right-2 text-stone-600 hover:text-stone-500"
                    onClick={() => setIsConnectModalOpen(false)}
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <h2 className="text-xl font-semibold mb-4">
                    Connect your Referring Doctor with our Radiologist
                  </h2>

                  {/* Form */}
                  <form className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium">
                        Referring Doctor Phone No.
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        {...register("phone")}
                        className="w-full border rounded px-2 py-1"
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm">
                          {errors.phone.message}
                        </p>
                      )}
                    </div>

                    <div className="flex justify-center">
                      <button
                        type="submit"
                        className="bg-stone-600 text-white px-4 py-2 rounded hover:bg-stone-700"
                      >
                        Connect
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CaseReview;
