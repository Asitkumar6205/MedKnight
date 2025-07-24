"use client";

import RichTextEditor from "./_components/index";
import React, { useState, useEffect, Suspense, useCallback } from "react";
import QRCode from "qrcode";
import { pdf } from "@react-pdf/renderer";
import { useSearchParams, useRouter } from "next/navigation";
import { Save, FileCheck } from "lucide-react";
import { toast } from "react-hot-toast";

// Import components
import PatientHeader from "./_components/PatientHeader";
import {
  RadiologyReportPDF,
  prepareRadiologistWithSvg,
} from "./_components/RadiologyReportPdf";

import DocumentExtractor from "./_components/DocumentExtractor";

// Import templates
import templates from "./_components/templates.json"; // Adjust path as needed
import { useSession } from "next-auth/react";

interface PatientData {
  patientName: string | null | undefined;
  gender: string | null | undefined;
  history: string | null | undefined;
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
  const { data: session } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
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
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreparingRadiologist, setIsPreparingRadiologist] = useState(false);
  const [reportContent, setReportContent] = useState("");

  const searchParams = useSearchParams();
  const patientId = searchParams?.get("patientId");
  const patientName = searchParams?.get("patientName");
  const gender = searchParams?.get("gender");
  const history = searchParams?.get("history");
  const doctor = searchParams?.get("doctor");
  const studyNames = searchParams?.get("studyNames");
  const [editorContent, setEditorContent] = useState<string>("");

  // Function to format template text to HTML with bullet points for FINDINGS and IMPRESSION
  const formatTemplateToHtml = useCallback((template: string) => {
    // Split template into sections
    let formattedTemplate = template;

    // Convert markdown-style bold text to HTML
    formattedTemplate = formattedTemplate.replace(
      /\*\*(.*?)\*\*/g,
      "<strong>$1</strong>"
    );

    // Fix spacing: Add line after TECHNIQUE section (change \n\n to \n\n\n after TECHNIQUE)
    formattedTemplate = formattedTemplate.replace(
      /(\*\*TECHNIQUE:\*\*\n\nLateral nasopharyngeal soft tissue radiograph\.)\n\n/g,
      "$1\n\n\n"
    );

    // Fix spacing: Reduce spacing before IMPRESSION (change \n\n to \n before IMPRESSION)
    formattedTemplate = formattedTemplate.replace(
      /\n\n(\*\*IMPRESSION:\*\*)/g,
      "\n$1"
    );

    // Process FINDINGS section
    formattedTemplate = formattedTemplate.replace(
      /(<strong>FINDINGS:<\/strong>|FINDINGS:)([\s\S]*?)(?=(<strong>IMPRESSION:<\/strong>|IMPRESSION:|\n\n<strong>|\n\n\*\*|$))/gi,
      (match, findingsTitle, findingsContent, nextSection) => {
        const lines = findingsContent
          .trim()
          .split("\n")
          .map((line: string) => line.trim())
          .filter((line: string) => line && line !== "");

        if (lines.length === 0) return match;

        const bulletPoints = lines
          .map((line: string) => `<li>${line}</li>`)
          .join("");
        const result = `<p><strong>FINDINGS:</strong></p><ul>${bulletPoints}</ul>\n\n`;

        return nextSection ? result + nextSection : result;
      }
    );

    // Process IMPRESSION section
    formattedTemplate = formattedTemplate.replace(
      /(<strong>IMPRESSION:<\/strong>|IMPRESSION:)([\s\S]*?)(?=(\n\n<strong>|\n\n\*\*|$))/gi,
      (match, impressionTitle, impressionContent) => {
        const lines = impressionContent
          .trim()
          .split("\n")
          .map((line: string) => line.trim())
          .filter((line: string) => line && line !== "");

        if (lines.length === 0) return match;

        const bulletPoints = lines
          .map((line: string) => `<li>${line}</li>`)
          .join("");
        return `<p><strong>IMPRESSION:</strong></p><ul>${bulletPoints}</ul>`;
      }
    );

    // Handle remaining content (non-FINDINGS/IMPRESSION sections)
    formattedTemplate = formattedTemplate
      // Convert double line breaks to paragraphs
      .replace(/\n\n/g, "</p><p>")
      // Convert single line breaks to br tags
      .replace(/\n/g, "<br/>")
      // Wrap in paragraph tags if not already wrapped
      .replace(/^(?!<[pu])/gm, "<p>")
      .replace(/(?<!>)$/gm, "</p>")
      // Clean up any empty paragraphs
      .replace(/<p><\/p>/g, "")
      // Clean up malformed paragraphs around existing elements
      .replace(/<p>(<[pu][^>]*>)/g, "$1")
      .replace(/(<\/[pu]>)<\/p>/g, "$1");

    return formattedTemplate;
  }, []);

  const addClinicalHistoryToHtml = useCallback(
    (htmlContent: string, history: string) => {
      if (!history?.trim()) return htmlContent;

      // Check if HTML already contains clinical history section
      const htmlUpperCase = htmlContent.toUpperCase();
      if (
        htmlUpperCase.includes("CLINICAL HISTORY") ||
        htmlUpperCase.includes("CLINICAL DETAILS")
      ) {
        return htmlContent; // Return as-is if clinical history already exists
      }

      // Create clinical history HTML
      const clinicalHistoryHtml = `
  <div style="margin-bottom: 15px; margin-top: 10px;">
    <div style="padding-left: 12px; padding-right: 12px; padding-top: 8px; padding-bottom: 8px; background-color: #f8fafc; border-left: 3px solid #3b82f6; font-size: 12px; font-weight: bold; color: #1e40af; text-transform: uppercase;">
      CLINICAL HISTORY
    </div>
    <div style="padding-left: 12px; padding-right: 12px; padding-top: 10px; padding-bottom: 10px; font-size: 11px; line-height: 1.6; color: #374151;">
      ${history}
    </div>
  </div>
`;

      // Parse HTML content to find the right insertion point
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = htmlContent;

      // Find study title elements (h3, h2, h1, or elements with study title text)
      const studyTitleElements = Array.from(tempDiv.children).filter(
        (element) => {
          const tagName = element.tagName?.toLowerCase();
          const textContent = element.textContent?.trim() || "";

          return (
            tagName === "h1" ||
            tagName === "h2" ||
            tagName === "h3" ||
            isStudyTitleText(textContent)
          );
        }
      );

      if (studyTitleElements.length > 0) {
        // Insert clinical history after the last study title
        const lastStudyTitle =
          studyTitleElements[studyTitleElements.length - 1];
        lastStudyTitle.insertAdjacentHTML("afterend", clinicalHistoryHtml);
      } else {
        // If no study title found, insert at the beginning
        tempDiv.insertAdjacentHTML("afterbegin", clinicalHistoryHtml);
      }

      return tempDiv.innerHTML;
    },
    []
  );

  // Helper function to check if text is a study title
  const isStudyTitleText = (textContent: string): boolean => {
    const upperText = textContent.toUpperCase().trim();

    const exactStudyTitlePatterns = [
      /^CT\s+PNS$/i,
      /^CECT\s+[A-Z\s]+$/i,
      /^MRI\s+SCREENING\s+SI\s+JOINT$/i,
      /^X-?RAY\s+[A-Z\s]+$/i,
      /^ULTRASOUND\s+[A-Z\s]+$/i,
      /^MAMMOGRAPHY$/i,
      /^BONE\s+SCAN$/i,
      /^PET\s+SCAN$/i,
      /^DEXA\s+SCAN$/i,
    ];

    const isShortAndSimple =
      upperText.length < 50 &&
      !upperText.includes("WITH") &&
      !upperText.includes("OF");

    return (
      exactStudyTitlePatterns.some((pattern) => pattern.test(upperText)) &&
      isShortAndSimple
    );
  };

  // Update your existing useEffect for auto-loading templates
  useEffect(() => {
    if (mounted && studyNames) {
      // Split multiple study names by comma and trim whitespace
      const studyNamesArray = studyNames.split(",").map((name) => name.trim());

      // Find templates for each study
      const foundTemplates: string[] = [];
      const missingStudies: string[] = [];

      studyNamesArray.forEach((studyName) => {
        const template = (templates as Record<string, string>)[studyName];
        if (template) {
          foundTemplates.push(
            `<h3><strong>${studyName}</strong></h3>\n${template}`
          );
        } else {
          missingStudies.push(studyName);
        }
      });

      if (foundTemplates.length > 0) {
        // Combine all found templates with separators
        const combinedTemplate = foundTemplates.join("\n\n<hr/>\n\n");

        // Convert template text to proper HTML format
        let htmlTemplate = formatTemplateToHtml(combinedTemplate);

        // Add clinical history to the HTML template if history exists
        htmlTemplate = addClinicalHistoryToHtml(htmlTemplate, history || "");

        setEditorContent(htmlTemplate);
        setReportContent(htmlTemplate);

        console.log(
          `Templates loaded for studies: ${foundTemplates.length}/${studyNamesArray.length}`,
          htmlTemplate
        );
      }

      // Show warning for missing templates
      if (missingStudies.length > 0) {
        console.warn(
          `Templates not found for studies: ${missingStudies.join(", ")}`
        );
        if (toast) {
          toast.error(`Templates not found for: ${missingStudies.join(", ")}`);
        }
      }

      // If no templates found at all
      if (foundTemplates.length === 0) {
        console.warn(`No templates found for any studies: ${studyNames}`);
        if (toast) {
          toast.error(`No templates found for any of the studies`);
        }
      }
    }
  }, [
    mounted,
    studyNames,
    formatTemplateToHtml,
    history,
    addClinicalHistoryToHtml,
  ]);

  // Update your handleContentExtracted function
  const handleContentExtracted = (html: string) => {
    // Add clinical history to the extracted content
    const htmlWithHistory = addClinicalHistoryToHtml(html, history || "");

    // Set the extracted content to the editor (REPLACE existing content)
    setEditorContent(htmlWithHistory);

    // Also update the report content since they should be the same
    setReportContent(htmlWithHistory);

    console.log(
      "Content extracted and loaded into editor (replaced):",
      htmlWithHistory
    );
  };

  // Updated handleContentAppended function
  const handleContentAppended = (html: string) => {
    // Add clinical history to the new content
    const htmlWithHistory = addClinicalHistoryToHtml(html, history || "");

    // Append the extracted content to the existing editor content
    setEditorContent((prevContent) => {
      // Add some spacing between existing content and new content
      const separator = prevContent ? "<br><br><hr><br>" : "";
      return prevContent + separator + htmlWithHistory;
    });

    // Also update the report content
    setReportContent((prevContent) => {
      const separator = prevContent ? "<br><br><hr><br>" : "";
      return prevContent + separator + htmlWithHistory;
    });

    console.log("Content extracted and appended to editor:", htmlWithHistory);
  };

  const handleReportContentChange = (content: string) => {
    setReportContent(content);
    console.log("Report content updated:", content);
  };

  const patientData: PatientData = {
    patientId,
    patientName,
    gender,
    history,
    doctor,
    studyNames,
  };

  // Static report URL - avoid using process.env on client side for hydration consistency
  const reportUrl = typeof window !== "undefined" ? window.location.origin : "";

  // Initialize date/time only on client side to avoid hydration mismatch
  const initializeDateTime = useCallback(() => {
    if (typeof window === "undefined") return;

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
  }, []);

  // Mark component as mounted to avoid hydration issues
  useEffect(() => {
    setMounted(true);
    initializeDateTime();
  }, [initializeDateTime]);

  // Update date/time every minute, but only after mount
  useEffect(() => {
    if (!mounted) return;

    const interval = setInterval(initializeDateTime, 60000);
    return () => clearInterval(interval);
  }, [mounted, initializeDateTime]);

  // Fetch users and generate QR code only after mount
  useEffect(() => {
    if (!mounted) return;

    const initializeData = async () => {
      try {
        // Fetch users
        await fetchUsers();

        // Generate QR code if reportUrl is available
        if (reportUrl) {
          try {
            const qrDataUrl = await QRCode.toDataURL(reportUrl, { width: 100 });
            setQrCode(qrDataUrl);
          } catch (err) {
            console.error("QR Code generation error:", err);
          }
        }
      } catch (error) {
        console.error("Error initializing data:", error);
      }
    };

    initializeData();
  }, [mounted, reportUrl]);

  // Select radiologist based on session user email
  useEffect(() => {
    if (users.length > 0 && !selectedRadiologist && session?.user?.email) {
      // Find radiologist matching the current session user's email
      const matchingUser = users.find(
        (user) => user.email === session.user.email
      );

      if (matchingUser) {
        setSelectedRadiologist(matchingUser);
        console.log(
          "Selected radiologist based on session email:",
          matchingUser
        );
      } else {
        // Fallback to first user if no matching email found
        setSelectedRadiologist(users[0]);
        console.log(
          "No matching radiologist found, selected first user:",
          users[0]
        );
      }
    }
  }, [users, selectedRadiologist, session?.user?.email]);

  // Prepare radiologist with SVG signature
  useEffect(() => {
    if (!mounted || !selectedRadiologist) {
      setPreparedRadiologist(null);
      return;
    }

    const prepareRadiologist = async () => {
      setIsPreparingRadiologist(true);
      try {
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
      } catch (error) {
        console.error("Error preparing radiologist:", error);
        setPreparedRadiologist(selectedRadiologist); // Fallback to original
      } finally {
        setIsPreparingRadiologist(false);
      }
    };

    prepareRadiologist();
  }, [mounted, selectedRadiologist]);

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
        console.log("Fetched radiologists:", processedUsers);
      } else {
        throw new Error(data.message || "Failed to fetch radiologists");
      }
    } catch (error) {
      console.error("Fetch Radiologists Error:", error);
    }
  };

  const handleGeneratePDF = async () => {
    if (!mounted) return;

    setIsGeneratingPDF(true);

    try {
      const pdfBlob = await pdf(
        <RadiologyReportPDF
          patientData={patientData}
          observations={reportContent}
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
      if (toast) {
        toast.error("Failed to generate PDF");
      }
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleCompleteReport = async () => {
    if (!mounted) return;

    if (!reportContent) {
      if (toast) {
        toast.error("Please write report before completing the report.");
      } else {
        alert("Please write report before completing the report.");
      }
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // 1. Generate the PDF blob
      const pdfBlob = await pdf(
        <RadiologyReportPDF
          patientData={patientData}
          observations={reportContent}
          qrCode={qrCode}
          radiologist={preparedRadiologist}
          currentDateTime={currentDateTime}
        />
      ).toBlob();

      // 2. Create a File object from the blob
      const pdfFile = new File([pdfBlob], `Radiology_Report_${patientId}.pdf`, {
        type: "application/pdf",
      });

      // 3. Create a FormData object to send the radiologist, file and case ID
      const formData = new FormData();
      formData.append("radiologist", preparedRadiologist?.name || "");
      formData.append("file", pdfFile);
      formData.append("patientId", patientId || "");
      formData.append(
        "reportDT",
        currentDateTime.date + "-" + currentDateTime.time
      );

      // 4. Send the report to the server
      const response = await fetch("/api/saveReport", {
        method: "POST",
        body: formData,
      });

      console.log("Response status:", response.status);
      const result = await response.json();
      console.log("Response data:", result);

      if (response.ok) {
        console.log("Report saved successfully:", result);

        if (toast) {
          toast.success("Report completed successfully!");
        } else {
          alert("Report completed successfully!");
        }

        router.push("/admin/active-studies");
      } else {
        throw new Error(result.error || "Failed to save report");
      }
    } catch (error) {
      console.error("Error completing report:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      if (toast) {
        toast.error(`Failed to complete report: ${errorMessage}`);
      } else {
        alert(`Failed to complete report: ${errorMessage}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state until component is mounted and initial data is loaded
  if (!mounted) {
    return (
      <div className="container mx-auto p-6 bg-white rounded-lg">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading report data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-1 gap-2">
        <PatientHeader
          patientData={patientData}
          currentDateTime={currentDateTime}
        />
        <div className="flex justify-center">
          <h2 className="text-2xl font-bold text-purple-700 pt-4">
            <span className="text-stone-700">Study -</span> {studyNames}
          </h2>
        </div>
        <div className="flex w-full mx-auto py-4 gap-4">
          <div className="w-1/5">
            <DocumentExtractor
              onContentExtracted={handleContentExtracted}
              onContentAppended={handleContentAppended}
              showCopyButton={true}
            />
          </div>
          <div className="w-4/5">
            <RichTextEditor
              content={editorContent}
              onChange={handleReportContentChange}
            />
          </div>
        </div>

        <div className="flex space-x-2 pb-1 pt-2 justify-center items-center">
          <button
            onClick={handleGeneratePDF}
            className="flex items-center px-8 py-2 text-stone-500 hover:bg-stone-100 border border-stone-300 font-bold rounded disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isGeneratingPDF || isSubmitting || isPreparingRadiologist}
          >
            <span>
              {isGeneratingPDF
                ? "Generating..."
                : isPreparingRadiologist
                ? "Preparing..."
                : "View Report"}
            </span>
            <Save size={20} className="ml-1" />
          </button>

          <button
            onClick={handleCompleteReport}
            disabled={isSubmitting || !reportContent || isPreparingRadiologist}
            className="flex items-center bg-purple-500 px-8 py-2 hover:bg-purple-600 text-md font-bold text-white rounded disabled:bg-purple-300 disabled:cursor-not-allowed"
          >
            {isSubmitting
              ? "Saving..."
              : isPreparingRadiologist
              ? "Preparing..."
              : "Complete Report"}
            <FileCheck size={20} className="ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
}

function Page() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto p-6 bg-white rounded-lg">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading report data...</p>
            </div>
          </div>
        </div>
      }
    >
      <RadiologyReportPage />
    </Suspense>
  );
}

export default Page;
