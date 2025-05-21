"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronsRight, PencilLine } from "lucide-react";

interface Study {
  id: string;
  name: string;
  studyType: string[];
  studyView: string[];
  studySide: string[];
}

interface FileData {
  id: string;
  filename: string;
  path: string;
  uploadedAt: string;
}

interface Case {
  id: string;
  patientId: string;
  doctor: string;
  priority: string;
  history: string;
  createdAt: string;
  studies: Study[];
  files: FileData[];
}

export default function OrderData({
  patientId,
  studyUID,
  patientName,
  gender,
}: {
  patientId: string;
  studyUID: string;
  patientName: string;
  gender: string;
}) {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingReport, setLoadingReport] = useState(false);

  // // For Local Use
  // const dicomPath = `C:/Users/asit_/Downloads/democases/${patientId}`;
  // const weasisUrl = `weasis://${encodeURIComponent(
  //   `$dicom:get -l "${dicomPath}"`
  // )}`;

  // For Production Use
  const weasisUrl = `weasis://${encodeURIComponent(`$dicom:rs --url "https://archive-x1r8.medknight.in/dicom-web" --header "Authorization: Basic c2VydmVyYWRtaW46TWVkS25pZ2h0YXJjaGl2ZUFJQjAwMw==" -r "patientID=${patientId}"`)}`

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const response = await fetch("/api/getCases");
        const data = await response.json();
        setCases(data.cases);
      } catch (error) {
        console.error("Error fetching cases:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCases();
  }, []);

  const handleStartReporting = (e: React.MouseEvent<HTMLAnchorElement>) => {
    setLoadingReport(true);
  };

  // Filter cases by patient ID
  const filteredCases = cases.filter(
    (caseItem) => caseItem.patientId === patientId
  );

  return (
    <div className="">
      {loadingReport && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-60 z-50">
          <div className="w-12 h-12 border-4 border-stone-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      {loading ? (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-60 z-50">
          <div className="w-12 h-12 border-4 border-stone-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredCases.length === 0 ? (
        <div className="bg-white rounded shadow-sm p-4 text-center">
          <p className="text-stone-700">No cases found for this patient.</p>
        </div>
      ) : (
        <div className="space-y-4 mt-4">
          {filteredCases.map((caseItem) => (
            <div key={caseItem.id} className="bg-white rounded shadow-lg p-5">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-stone-700">
                  Patient Case Records
                </h1>
                <span
                  className={`px-3 py-1 rounded text-xs font-bold
                        ${
                          caseItem.priority === "Urgent"
                            ? "bg-yellow-100 text-yellow-500"
                            : caseItem.priority === "Stat"
                            ? "bg-red-100 text-red-500"
                            : "bg-green-100 text-green-500"
                        }`}
                >
                  {caseItem.priority} Priority
                </span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                {/* Patient Details Column */}

                <div className="p-2 mr-2">
                  <div className="flex flex-row items-center">
                    <label className="text-stone-700 font-bold min-w-36 p-1">
                      Refering Doctor
                    </label>
                    <div className="w-full text-stone-600">
                      {caseItem.doctor}
                    </div>
                  </div>

                  <div className="flex flex-row items-center">
                    <label className="text-stone-700 font-bold min-w-36 p-1">
                      Created At
                    </label>
                    <div className="w-full text-stone-600">
                      {new Date(caseItem.createdAt).toLocaleString()}
                    </div>
                  </div>

                  <div className="flex flex-row items-center">
                    <label className="text-stone-700 font-bold min-w-36 p-1">
                      Clinical History
                    </label>
                    <div className="w-full text-stone-600">
                      {caseItem.history}
                    </div>
                  </div>
                </div>

                {/* Studies Column */}
                <div className="p-2">
                  <h3 className="text-stone-700 font-bold mb-2">Studies</h3>
                  {caseItem.studies.length > 0 ? (
                    <ul className="space-y-2">
                      {caseItem.studies.map((study) => (
                        <li
                          key={study.id}
                          className="bg-stone-50 p-2 rounded border border-stone-300 "
                        >
                          <div className="flex justify-between items-center">
                            <strong className="text-stone-700 ">
                              {study.name}
                            </strong>
                          </div>
                          <div className="text-sm text-stone-600 space-y-1 mt-1 ">
                            {study.studyType.length > 0 && (
                              <p>
                                <span className="font-bold">Type:</span>{" "}
                                {study.studyType.join(", ")}
                              </p>
                            )}
                            {study.studyView.length > 0 && (
                              <p>
                                <span className="font-bold">View:</span>{" "}
                                {study.studyView.join(", ")}
                              </p>
                            )}
                            {study.studySide.length > 0 && (
                              <p>
                                <span className="font-bold">Side:</span>{" "}
                                {study.studySide.join(", ")}
                              </p>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-stone-500 italic">
                      No studies available.
                    </p>
                  )}
                </div>
              </div>

              {/* Files Section - Full Width */}
              <div className="mt-4 border-t border-stone-200 pt-4">
                <h3 className="font-bold text-stone-700 mb-3">
                  Attached Files
                </h3>
                {caseItem.files.length > 0 ? (
                  <ul className="flex flex-row flex-wrap justify-start gap-2 mb-4 ">
                    {caseItem.files.map((file) => (
                      <li
                        key={file.id}
                        className="mt-1 max-w-[200px] flex items-center justify-center text-sm bg-stone-100 text-stone-700 px-3 py-1 rounded relative"
                        title={file.filename}
                      >
                        <div className="flex items-center justify-center truncate">
                          <svg
                            className="w-4 h-4 mr-1 flex-shrink-0 text-purple-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            ></path>
                          </svg>
                          <a
                            href={file.path}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="truncate text-purple-800 hover:underline"
                          >
                            {file.filename}
                          </a>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-stone-500 italic text-sm">
                    No files uploaded.
                  </p>
                )}
              </div>

              {/* Thin Divider */}
              <div className="border-t border-stone-300 my-4"></div>

              {/* Start Reporting Link */}
              <div className="flex justify-center items-center gap-2">
                {/* <Link
                  href={viewerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-2 font-medium bg-blue-500 text-stone-100 rounded hover:bg-blue-600 transition-colors duration-300 text-center flex items-center"
                >
                  View Study
                </Link> */}
                <a
                  // href={viewerUrl}
                  href={weasisUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-2 font-bold bg-orange-500 text-stone-100 rounded hover:bg-orange-600 transition-colors duration-300 text-center flex items-center"
                >
                  View Study in  <span className="text-stone-800 ml-1 font-bold"> Weasis </span> 
                  <span className="ml-1">
                    <img
                      src="/Weasis-512.svg.png"
                      className="h-6 w-6"
                      alt="Weasis Logo"
                    />
                  </span>
                </a>
                <Link
                  href={{
                    pathname: "/admin/report/write",
                    query: {
                      patientId: patientId,
                      patientName: patientName,
                      gender: gender,
                      doctor: caseItem.doctor,
                      studyNames: caseItem.studies
                        .map((study) => study.name)
                        .join(", "),
                    },
                  }}
                  onClick={handleStartReporting}
                  className="px-8 py-2 font-bold bg-stone-700 text-stone-100 rounded hover:bg-stone-800 transition-colors duration-300 text-center flex items-center"
                >
                  Start Reporting
                  <PencilLine className="ml-1 w-5 h-5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
