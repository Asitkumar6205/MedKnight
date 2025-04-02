"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { QRCodeCanvas } from "qrcode.react";
import QRCode from "qrcode";
import { pdf } from "@react-pdf/renderer";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useSearchParams } from "next/navigation";
import { Save, Printer } from "lucide-react";

// Import components
import PatientHeader from "./_components/PatientHeader";
import ObservationsEditor from "./_components/ObservationsEditor"
import ImpressionEditor from "./_components/ImpressionEditor";
import { RadiologyReportPDF } from "./_components/RadiologyReportPdf";

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
    uploadedAt: string;
  } | null;
  signatureUrl?: string | null;
}

export default function RadiologyReportPage() {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [currentDateTime, setCurrentDateTime] = useState({
    date: "",
    time: "",
  });
  const [users, setUsers] = useState<Radiologist[]>([]);
  const [selectedRadiologist, setSelectedRadiologist] =
    useState<Radiologist | null>(null);
  const [observations, setObservations] = useState("");
  const [impression, setImpression] = useState("");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

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
          radiologist={selectedRadiologist}
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

  return (
    <div className="container mx-auto p-6 bg-white shadow-md rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-1 gap-2">
        <PatientHeader 
          patientData={patientData} 
          currentDateTime={currentDateTime} 
        />

        <div className="space-y-4 p-4 bg-white shadow-lg rounded-lg">
          <div className="flex justify-center">
            <h2 className="text-2xl font-bold text-purple-700">
              <span className="text-stone-700">Study -</span> {studyNames}
            </h2>
          </div>

          <ObservationsEditor 
            setObservations={setObservations} 
          />

          <ImpressionEditor 
            setImpression={setImpression} 
          />
        </div>

        <div className="flex space-x-4 pb-8 pt-1 justify-center items-center">
          <Button
            onClick={handleGeneratePDF}
            className="bg-green-500 px-8 hover:bg-green-600 text-md font-bold text-white"
            disabled={isGeneratingPDF}
          >
            <Save strokeWidth="2.5" className="mr-2" />
            {isGeneratingPDF ? "Generating..." : "Save Report"}
          </Button>

          {!isGeneratingPDF && observations && impression && (
            <PDFDownloadLink
              document={
                <RadiologyReportPDF
                  patientData={patientData}
                  observations={observations}
                  impression={impression}
                  qrCode={qrCode}
                  radiologist={selectedRadiologist}
                  currentDateTime={currentDateTime}
                />
              }
              fileName={`Radiology_Report_${patientId}.pdf`}
              className="hidden"
            >
              {({ loading }) => (loading ? "Loading..." : "Download PDF")}
            </PDFDownloadLink>
          )}
          
          <Button
            variant="outline"
            className="text-md px-8"
            onClick={() => window.print()}
          >
            <Printer className="mr-2" />
            Print Report
          </Button>
        </div>
      </div>
    </div>
  );
}