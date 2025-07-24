import React from "react";
import { Document, Page, Text, View, Image, Font } from "@react-pdf/renderer";
import HtmlToPdfComponents from "./HtmlToPdfComponents";
import { pdfStyles as styles } from "./pdfStyles";

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
  signaturePngUrl?: string | null;
}

interface DateTime {
  date: string;
  time: string;
}

// Register fonts
Font.register({
  family: "Times-Roman",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/times/v1/Times-Roman.ttf",
      fontWeight: "normal",
    },
    {
      src: "https://fonts.gstatic.com/s/times/v1/Times-Bold.ttf",
      fontWeight: "bold",
    },
  ],
});

interface RadiologyReportPDFProps {
  patientData: PatientData;
  observations: string;
  qrCode: string | null;
  radiologist: Radiologist | null;
  currentDateTime: DateTime;
}

// Alternative approach using larger sizes to maintain quality
const svgToPngHighQuality = async (svgString: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      // Parse the SVG to get its dimensions
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(svgString, "image/svg+xml");
      const svgElement = svgDoc.documentElement;

      // Get or set SVG dimensions
      let width = parseInt(svgElement.getAttribute("width") || "300");
      let height = parseInt(svgElement.getAttribute("height") || "150");

      // If viewBox is present, use it for dimensions if width/height not explicitly set
      if (
        (!svgElement.hasAttribute("width") ||
          !svgElement.hasAttribute("height")) &&
        svgElement.hasAttribute("viewBox")
      ) {
        const viewBox = svgElement.getAttribute("viewBox")?.split(" ") || [];
        if (viewBox.length === 4) {
          if (!svgElement.hasAttribute("width")) width = parseInt(viewBox[2]);
          if (!svgElement.hasAttribute("height")) height = parseInt(viewBox[3]);
        }
      }

      // Set explicit dimensions for rendering
      svgElement.setAttribute("width", width.toString());
      svgElement.setAttribute("height", height.toString());

      // Convert to string
      const serializer = new XMLSerializer();
      const svgStr = serializer.serializeToString(svgDoc);

      // Create a blob with the properly dimensioned SVG
      const svgBlob = new Blob([svgStr], { type: "image/svg+xml" });
      const url = URL.createObjectURL(svgBlob);

      // Create an image element
      const img = new window.Image();
      img.addEventListener("load", () => {
        // Create a canvas with 3x the dimensions for high quality
        const canvas = document.createElement("canvas");
        canvas.width = width * 3;
        canvas.height = height * 3;

        const ctx = canvas.getContext("2d");
        if (ctx) {
          // Set high quality settings
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";

          // Scale up for higher resolution
          ctx.scale(3, 3);

          // Draw the image
          ctx.drawImage(img, 0, 0, width, height);

          // Get the PNG data URL at maximum quality
          const pngUrl = canvas.toDataURL("image/png", 1.0);
          URL.revokeObjectURL(url);
          resolve(pngUrl);
        } else {
          reject(new Error("Failed to get canvas context"));
        }
      });

      img.addEventListener("error", (error) => {
        URL.revokeObjectURL(url);
        reject(error);
      });

      img.src = url;
    } catch (error) {
      reject(error);
    }
  });
};

export const prepareRadiologistWithSvg = async (
  radiologist: Radiologist | null
): Promise<Radiologist | null> => {
  if (!radiologist) return null;

  try {
    // If signature exists and has svgPath
    if (radiologist.signature?.svgPath) {
      const svgPath = `${radiologist.signature.svgPath}`;
      console.log("Fetching SVG signature from:", svgPath);

      // Fetch SVG content
      const response = await fetch(svgPath);

      if (response.ok) {
        const svgContent = await response.text();
        console.log(
          "SVG content fetched successfully, length:",
          svgContent.length
        );

        // Store the SVG data URL
        const base64 = btoa(unescape(encodeURIComponent(svgContent)));
        const svgDataUrl = `data:image/svg+xml;base64,${base64}`;

        try {
          // Use the high-quality conversion
          const pngDataUrl = await svgToPngHighQuality(svgContent);
          console.log("Successfully converted SVG to high-quality PNG");

          return {
            ...radiologist,
            signatureSvgUrl: svgDataUrl,
            signaturePngUrl: pngDataUrl,
          };
        } catch (conversionError) {
          console.error("Error converting SVG to PNG:", conversionError);

          // Fall back to SVG URL only
          return {
            ...radiologist,
            signatureSvgUrl: svgDataUrl,
          };
        }
      } else {
        console.error(
          "Failed to fetch SVG:",
          response.status,
          response.statusText
        );
      }
    }

    // If no SVG or fetching failed, return original radiologist
    return radiologist;
  } catch (error) {
    console.error("Error preparing radiologist SVG signature:", error);
    return radiologist;
  }
};

export const RadiologyReportPDF: React.FC<RadiologyReportPDFProps> = ({
  patientData,
  observations,
  qrCode,
  radiologist,
  currentDateTime,
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={{ height: 100 }} />
      {/* Header with patient info */}
      <View style={styles.header}>
        {/* Patient Details */}
        <View style={styles.patientDetailsSection}>
          <View style={styles.tableRow}>
            <Text style={styles.labelCell}>Patient Name :</Text>
            <Text style={styles.valueCell}>{patientData.patientName}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.labelCell}>Age/Gender :</Text>
            <Text style={styles.valueCell}>{patientData.gender}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.labelCell}>Patient ID :</Text>
            <Text style={styles.valueCell}>{patientData.patientId}</Text>
          </View>
        </View>

        {/* Report Details */}
        <View style={styles.reportDetailsSection}>
          <View style={styles.tableRow}>
            <Text style={styles.labelCell}>Referred By :</Text>
            <Text style={styles.valueCell}>{patientData.doctor}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.labelCell}>Reported Date :</Text>
            <Text style={styles.valueCell}>{currentDateTime.date}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.labelCell}>Reported Time :</Text>
            <Text style={styles.valueCell}>{currentDateTime.time}</Text>
          </View>
        </View>
      </View>

      {/* Study Title */}
      <Text style={styles.studyTitle}>
        <Text style={{ color: "black" }}>Study - </Text>
        {patientData.studyNames}
      </Text>
      
      <HtmlToPdfComponents htmlContent={observations} history={patientData.history as string}/>

      {/* Updated Radiologist Information Section */}
      <View style={styles.radiologistSection}>
        <View style={styles.horizontalRule} />
        {radiologist && (
          <>
            <Text style={styles.reportedBy}>Reported By,</Text>

            <View style={styles.signatureContainer}>
              {radiologist.signaturePngUrl ? (
                // Use PNG converted from SVG - more compatible with react-pdf
                <Image
                  src={radiologist.signaturePngUrl}
                  style={{
                    ...styles.signatureImage,
                    width: 140,
                    height: 70,
                  }}
                />
              ) : radiologist.signatureUrl ? (
                // Fallback to regular image if PNG not available
                <Image
                  src={radiologist.signatureUrl}
                  style={styles.signatureImage}
                />
              ) : null}
            </View>

            <View style={styles.radiologistInfo}>
              <Text style={styles.radiologistName}>Dr. {radiologist.name}</Text>
              <Text style={styles.radiologistDetail}>
                {radiologist.qualifications}
              </Text>
              <Text style={styles.radiologistDetail}>
                {radiologist.designation}
              </Text>
              <Text style={styles.radiologistDetail}>
                MRN: {radiologist.mrn}
              </Text>
            </View>
          </>
        )}
      </View>
      <View style={styles.disclaimer}>
        <Text>
          Disclaimer: This medical diagnostic report is generated based on the
          image and patient information obtained from the source of origin,
          MedKnight assumes no responsibility for errors or omission of or in
          the image, or in the contents of the report, which are a direct
          interpretation of the image sent from source. In no event shall
          MedKnight be liable for any special, direct, indirect, consequential,
          or incidental damages or any damages whatsoever, whether in an action
          of negligence or other tort, arising out of or in connection with the
          use of the 5C Network Service or the contents of the Service. This
          report does not replace professional medical advice, additional
          diagnoses, or treatment.
        </Text>
      </View>
      <View style={styles.logo}>
        <View style={styles.query}>
          <Text>
            For any report-related query, please reach out to us at
            +91-8789573665 or contact@medknight.in.
          </Text>
          <Text>Powered by MedKnight. All Rights Reserved.</Text>
        </View>
        <View style={styles.logoImage}>
          <Image
            src={"/logo.png"}
            style={{ width: 34, height: 34, marginRight: -2 }}
          />
          <Image
            src={"/pdf-logo-typo2.png"}
            style={{ width: 90, height: 24, marginTop: 4 }}
          />
        </View>
      </View>
    </Page>
  </Document>
);
