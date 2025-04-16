"use client";

import React, { useState, useEffect, Suspense } from "react";
import QRCode from "qrcode";
import { pdf } from "@react-pdf/renderer";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useSearchParams, useRouter } from "next/navigation";
import { Save, Printer, FileCheck } from "lucide-react";
import { toast } from "react-hot-toast"; // Add toast for notifications if you have it

// Import components
import PatientHeader from "./_components/PatientHeader";
import ObservationsEditor from "./_components/ObservationsEditor";
import ImpressionEditor from "./_components/ImpressionEditor";
import {
  RadiologyReportPDF,
  prepareRadiologistWithSvg,
} from "./_components/RadiologyReportPdf";
import { useCompletedCase } from "@/app/context/CompletedCaseContext";

interface PatientData {
  patientName: string | null | undefined;
  gender: string | null | undefined;
  patientId: string | null | undefined;
  doctor: string | null | undefined;
  studyNames: string | null | undefined;
}

interface Radiologist {
  id: string;
  name: string;
  email: string;
  phone: string;
  qualifications: string;
  designation: string;
  mrn: string;
  isDefault?: boolean;
  signature: {
    id: string;
    filename: string;
    path: string;
    svgPath?: string;
    uploadedAt: string;
  } | null;
  signatureUrl?: string | null;
  signatureSvgUrl?: string | null;
}

function RadiologyReportPage() {
  const router = useRouter();
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [currentDateTime, setCurrentDateTime] = useState({
    date: "",
    time: "",
  });
  const [users, setUsers] = useState<Radiologist[]>([]);
  const [selectedRadiologist, setSelectedRadiologist] =
    useState<Radiologist | null>(null);
  const [preparedRadiologist, setPreparedRadiologist] =
    useState<Radiologist | null>(null);
  const [observations, setObservations] = useState("");
  const [impression, setImpression] = useState("");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setCompletedCase } = useCompletedCase();

  const searchParams = useSearchParams();
  const patientId = searchParams?.get("patientId");
  const patientName = searchParams?.get("patientName");
  const gender = searchParams?.get("gender");
  const doctor = searchParams?.get("doctor");
  const studyNames = searchParams?.get("studyNames");

  const patientData: PatientData = {
    patientId,
    patientName,
    gender,
    doctor,
    studyNames,
  };

  const reportUrl = `http://localhost:3000`;

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const formattedDate = now.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });

      const formattedTime = now.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      });

      setCurrentDateTime({ date: formattedDate, time: formattedTime });
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchUsers();

    QRCode.toDataURL(reportUrl, { width: 100 })
      .then(setQrCode)
      .catch((err) => console.error("QR Code generation error:", err));
  }, [reportUrl]);

  useEffect(() => {
    if (users.length > 0) {
      const defaultUser = users.find((user) => user.isDefault) || users[0];
      setSelectedRadiologist(defaultUser);
    }
  }, [users]);

  // In your RadiologyReportPage component:
  useEffect(() => {
    const prepareRadiologist = async () => {
      if (selectedRadiologist) {
        console.log(
          "Selected radiologist before preparation:",
          selectedRadiologist
        );

        const prepared = await prepareRadiologistWithSvg(selectedRadiologist);
        console.log("Prepared radiologist with SVG:", prepared);

        if (prepared?.signatureSvgUrl) {
          console.log("SVG URL generated successfully");
        } else {
          console.log("Failed to generate SVG URL");
        }

        setPreparedRadiologist(prepared);
      } else {
        setPreparedRadiologist(null);
      }
    };

    prepareRadiologist();
  }, [selectedRadiologist]);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/radiologist/getuser");
      const data = await response.json();

      if (response.ok) {
        const processedUsers = data.users.map((user: Radiologist) => {
          if (user.signature && user.signature.path) {
            return {
              ...user,
              signatureUrl: user.signature.path,
            };
          }
          return user;
        });

        setUsers(processedUsers);
      } else {
        throw new Error(data.message || "Failed to fetch radiologists");
      }
    } catch (error) {
      console.error("Fetch Radiologists Error:", error);
    }
  };

  const handleGeneratePDF = async () => {
    setIsGeneratingPDF(true);

    try {
      const pdfBlob = await pdf(
        <RadiologyReportPDF
          patientData={patientData}
          observations={observations}
          impression={impression}
          qrCode={qrCode}
          radiologist={preparedRadiologist}
          currentDateTime={currentDateTime}
        />
      ).toBlob();

      const blobUrl = URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `Radiology_Report_${patientId}.pdf`;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleCompleteReport = async () => {
    if (!observations || !impression) {
      alert("Please complete both Observations and Impression sections before completing the report.");
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // 1. Generate the PDF blob
      const pdfBlob = await pdf(
        <RadiologyReportPDF
          patientData={patientData}
          observations={observations}
          impression={impression}
          qrCode={qrCode}
          radiologist={preparedRadiologist}
          currentDateTime={currentDateTime}
        />
      ).toBlob();

      // 2. Create a File object from the blob
      const pdfFile = new File(
        [pdfBlob], 
        `Radiology_Report_${patientId}.pdf`, 
        { type: 'application/pdf' }
      );

      // 3. Create a FormData object to send the radiologist, file and case ID
      const formData = new FormData();
      formData.append('radiologist', preparedRadiologist?.name || "")
      formData.append('file', pdfFile);
      formData.append('patientId', patientId || '');
      formData.append('reportDT', currentDateTime.date + "-" + currentDateTime.time);

      // 4. Send the report to the server
      const response = await fetch('/api/saveReport', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setCompletedCase(patientId as string, true, true)
        console.log("Report saved successfully:", result);
        // Show success message
        if (toast) {
          toast.success("Report completed successfully!");
        } else {
          alert("Report completed successfully!");
        }
        // Navigate back to case list or dashboard
        router.push('/admin/active-studies');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save report');
      }
    } catch (error) {
      console.error("Error completing report:", error);
      if (toast) {
        toast.error("Failed to complete report. Please try again.");
      } else {
        alert("Failed to complete report. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-1 gap-2">
        <PatientHeader
          patientData={patientData}
          currentDateTime={currentDateTime}
        />

        <div className="space-y-4 bg-white">
          <div className="flex justify-center">
            <h2 className="text-2xl font-bold text-purple-700">
              <span className="text-stone-700">Study -</span> {studyNames}
            </h2>
          </div>
          <ObservationsEditor setObservations={setObservations} />
          <ImpressionEditor setImpression={setImpression} />
        </div>

        <div className="flex space-x-2 pb-1 pt-2 justify-center items-center">
          <button
            onClick={handleGeneratePDF}
            className="flex items-center px-8 py-2 text-stone-500 hover:bg-stone-100 border border-stone-300 font-bold rounded"
            disabled={isGeneratingPDF || isSubmitting}
          >
            <span>{isGeneratingPDF ? "Generating..." : "View Report"}</span>
            <Save size={20} className="ml-1" />
          </button>
          {!isGeneratingPDF && observations && impression && (
            <PDFDownloadLink
              document={
                <RadiologyReportPDF
                  patientData={patientData}
                  observations={observations}
                  impression={impression}
                  qrCode={qrCode}
                  radiologist={preparedRadiologist}
                  currentDateTime={currentDateTime}
                />
              }
              fileName={`Radiology_Report_${patientId}.pdf`}
              className="hidden"
            >
              {({ loading }) => (loading ? "Loading..." : "Download PDF")}
            </PDFDownloadLink>
          )}
          <button 
            onClick={handleCompleteReport}
            disabled={isSubmitting || !observations || !impression}
            className="flex items-center bg-purple-500 px-8 py-2 hover:bg-purple-600 text-md font-bold text-white rounded disabled:bg-purple-300"
          >
            {isSubmitting ? "Saving..." : "Complete Report"}
            <FileCheck size={20} className="ml-1"/>
          </button>
        </div>
      </div>
    </div>
  );
}

function Page() {
  return (
    <Suspense fallback={<div className="p-4">Loading report data...</div>}>
      <RadiologyReportPage />
    </Suspense>
  );
}

export default Page;