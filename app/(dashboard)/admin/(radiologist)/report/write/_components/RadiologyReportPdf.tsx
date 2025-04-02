import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  Font,
  Link,
} from "@react-pdf/renderer";
import HtmlToPdfComponents from "./HtmlToPdfComponents";
import { pdfStyles as styles } from "./pdfStyles";

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

interface DateTime {
  date: string;
  time: string;
}

// Register fonts
Font.register({
  family: "Helvetica",
  fonts: [
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/Helvetica/1.0.0/Helvetica.ttf",
      fontWeight: "normal",
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/Helvetica/1.0.0/Helvetica-Bold.ttf",
      fontWeight: "bold",
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/Helvetica/1.0.0/Helvetica-Oblique.ttf",
      fontStyle: "italic",
    },
  ],
});

interface RadiologyReportPDFProps {
  patientData: PatientData;
  observations: string;
  impression: string;
  qrCode: string | null;
  radiologist: Radiologist | null;
  currentDateTime: DateTime;
}

export const RadiologyReportPDF: React.FC<RadiologyReportPDFProps> = ({
  patientData,
  observations,
  impression,
  qrCode,
  radiologist,
  currentDateTime,
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
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
            <Text style={styles.valueCell}>26 March 2025</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.labelCell}>Reported Time :</Text>
            <Text style={styles.valueCell}>25 March 2025</Text>
          </View>
        </View>

        {/* QR Code Section */}
        <View style={styles.qrCodeSection}>
          {qrCode && <Image src={qrCode} style={styles.qrCodeSection} />}
        </View>
      </View>

      {/* Study Title */}
      <Text style={styles.studyTitle}>
        <Text style={{ color: "black" }}>Study - </Text>
        {patientData.studyNames}
      </Text>

      {/* Observations Section */}
      <Text style={styles.sectionTitle}>Observations</Text>
      <HtmlToPdfComponents htmlContent={observations} />

      {/* Impression Section */}
      <Text style={styles.sectionTitle}>Impression</Text>
      <HtmlToPdfComponents htmlContent={impression} />

      {/* Radiologist Information Section */}
      <View style={styles.radiologistSection}>
        <View style={styles.horizontalRule} />
        {radiologist && (
          <>
            <View style={styles.signatureContainer}>
              <Text style={styles.radiologistName}>Reported By,</Text>
              {radiologist.signatureUrl && (
                <Image
                  src={radiologist.signatureUrl}
                  style={styles.signatureImage}
                />
              )}
            </View>
            <View style={styles.radiologistInfo}>
              <Text style={styles.radiologistName}>{radiologist.name}</Text>
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
    </Page>
  </Document>
);
