import React, { useState, useEffect } from "react";
import { Download } from "lucide-react";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

interface Payment {
  id: string;
  patientName: string;
  patientId: string;
  orderId?: string;
  studyDescription: string;
  reportTime: string;
  activatedDateTime?: string;
  completedDateTime?: string;
  urgentPremium?: boolean;
  nightHawk?: boolean;
  oms?: boolean;
  totalAmount: number;
  numberOfReports: number;
  numberOfViews: number;
  studies: Study[];
}

interface Study {
  id: string;
  name: string;
  studyType: string[];
  studyView: string[];
  studySide: string[];
  price?: number; // Individual study price
}

// New interface for flattened payment rows
interface PaymentRow {
  id: string;
  patientName: string;
  patientId: string;
  orderId?: string;
  studyDescription: string;
  reportTime: string;
  activatedDateTime?: string;
  completedDateTime?: string;
  urgentPremium?: boolean;
  nightHawk?: boolean;
  oms?: boolean;
  totalAmount: number; // This will be the individual study price multiplied by views
  numberOfReports: number; // Should be 1 for each study row
  numberOfViews: number; // Should be the actual views for this study
  study: Study; // Single study instead of array
  originalPaymentId: string; // Reference to original payment
  studyViews: number; // Number of views for this specific study
}

interface InvoiceData {
  invoiceNumber: string;
  month: string;
  startDate: string;
  invoiceDate: string;
  invoiceAmount: number;
  payments: PaymentRow[]; // Now using PaymentRow instead of Payment
}

interface InvoicePDFProps {
  payments: PaymentRow[];
  invoiceNumber: string;
  invoiceDate: string;
}

// PDF Styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 30,
    fontSize: 9,
  },
  logo: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#1f2937",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  invoiceTitle: {
    paddingLeft: 4,
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#374151",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  addressSection: {
    width: "60%",
  },
  invoiceDetails: {
    width: "35%",
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 5,
  },
  addressText: {
    fontSize: 9,
    lineHeight: 1.4,
  },
  tableContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#d6d3d1",
    backgroundColor: "#fafaf9",
  },
  tableRow: {
    flexDirection: "row",
  },
  tableColHeader: {
    flex: 1,
    backgroundColor: "#f5f5f4",
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: "#d6d3d1",
    borderBottomWidth: 1,
    borderBottomColor: "#d6d3d1",
    justifyContent: "center",
    alignItems: "center",
    minHeight: 30,
  },
  tableColHeaderLast: {
    flex: 1,
    backgroundColor: "#f5f5f4",
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#d6d3d1",
    justifyContent: "center",
    alignItems: "center",
    minHeight: 30,
  },
  tableCol: {
    flex: 1,
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: "#d6d3d1",
    borderBottomWidth: 1,
    borderBottomColor: "#d6d3d1",
    justifyContent: "center",
    alignItems: "center",
    minHeight: 30,
    backgroundColor: "#fafaf9",
  },
  tableColLast: {
    flex: 1,
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#d6d3d1",
    justifyContent: "center",
    alignItems: "center",
    minHeight: 30,
    backgroundColor: "#fafaf9",
  },
  tableColLastRow: {
    flex: 1,
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: "#d6d3d1",
    justifyContent: "center",
    alignItems: "center",
    minHeight: 30,
    backgroundColor: "#fafaf9",
  },
  tableColLastRowLast: {
    flex: 1,
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 30,
    backgroundColor: "#fafaf9",
  },
  tableCellHeader: {
    fontSize: 8,
    fontWeight: "bold",
    textAlign: "center",
    color: "#1c1917",
  },
  tableCell: {
    fontSize: 7,
    textAlign: "center",
    color: "#292524",
  },
  totalRowBg: {
    backgroundColor: "#f0efee",
  },
  boldText: {
    fontWeight: "bold",
    color: "#0c0a09",
  },
  declaration: {
    fontSize: 7,
    marginTop: 15,
    marginBottom: 15,
    lineHeight: 1.3,
    textAlign: "justify",
  },
  signature: {
    marginTop: 20,
    marginBottom: 20,
  },
  footer: {
    fontSize: 6,
    textAlign: "center",
    marginTop: 20,
    lineHeight: 1.2,
    color: "#6b7280",
  },
});

// PDF Document Component
const InvoicePDF: React.FC<InvoicePDFProps> = ({
  payments,
  invoiceNumber,
  invoiceDate,
}) => {
  const totalAmount = payments.reduce(
    (sum: number, payment: PaymentRow) => sum + payment.totalAmount,
    0
  );

  // Calculate totals for the footer
  const totalReports = payments.reduce(
    (sum: number, payment: PaymentRow) => sum + payment.numberOfReports,
    0
  );

  const totalViews = payments.reduce(
    (sum: number, payment: PaymentRow) => sum + payment.numberOfViews,
    0
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.logo}>
          <Image
            src={"/logo.png"}
            style={{ width: 40, height: 40, marginRight: -2 }}
          />
          <Image
            src={"/pdf-logo-typo2.png"}
            style={{ width: 96, height: 24, marginTop: 5 }}
          />
        </View>
        <Text style={styles.invoiceTitle}>INVOICE</Text>

        {/* Address and Invoice Details */}
        <View style={styles.headerRow}>
          <View style={styles.addressSection}>
            <Text style={styles.sectionTitle}>To,</Text>
            <Text style={styles.addressText}>
              Gunjan Diagnostic Utkal Autocoach Pvt Ltd (Mahindra Showroom),
              {"\n"}
              Tata Kandra Road, Shridungri, Adityapur, Jamshedpur,{"\n"}
              Seraikela Kharsawan, Jharkhand 831013, India{"\n"}
              Seraikela Kharsawan- 831013{"\n\n"}
            </Text>
          </View>

          <View style={styles.invoiceDetails}>
            <Text style={styles.addressText}>
              Date: {invoiceDate}
              {"\n"}
              Invoice No: {invoiceNumber}
              {"\n"}
              SAC/HSN Code: 9{"\n"}
              GSTIN Number - NO
              {"\n"}
              TAN number - Unregistered
            </Text>
          </View>
        </View>

        {/* Table */}
        <View style={styles.tableContainer}>
          {/* Table Header */}
          <View style={styles.tableRow}>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Patient ID</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Patient Name</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Study</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Date</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>No of Reports</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>No of Views</Text>
            </View>
            <View style={styles.tableColHeaderLast}>
              <Text style={styles.tableCellHeader}>Cost</Text>
            </View>
          </View>

          {/* Table Rows */}
          {payments.map((payment: PaymentRow, index: number) => (
            <View
              key={`${payment.originalPaymentId}-${payment.study.id}`}
              style={styles.tableRow}
            >
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{payment.patientId}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{payment.patientName}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  {payment.study.name}
                  {(() => {
                    const allDetails = [
                      ...payment.study.studySide,
                      ...payment.study.studyView,
                      ...payment.study.studyType,
                    ].filter(Boolean);
                    
                    return allDetails.length > 0 ? ` - ${allDetails.join(", ")}` : "";
                  })()}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  {new Date(payment.reportTime).toLocaleDateString("en-GB")}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{payment.numberOfReports}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{payment.numberOfViews}</Text>
              </View>
              <View style={styles.tableColLast}>
                <Text style={styles.tableCell}>{payment.totalAmount.toFixed(2)}</Text>
              </View>
            </View>
          ))}

          {/* Total Row */}
          <View style={[styles.tableRow, styles.totalRowBg]}>
            <View style={[styles.tableColLastRow, styles.totalRowBg]}>
              <Text style={[styles.tableCell, styles.boldText]}>TOTAL</Text>
            </View>
            <View style={[styles.tableColLastRow, styles.totalRowBg]}>
              <Text style={styles.tableCell}></Text>
            </View>
            <View style={[styles.tableColLastRow, styles.totalRowBg]}>
              <Text style={styles.tableCell}></Text>
            </View>
            <View style={[styles.tableColLastRow, styles.totalRowBg]}>
              <Text style={styles.tableCell}></Text>
            </View>
            <View style={[styles.tableColLastRow, styles.totalRowBg]}>
              <Text style={[styles.tableCell, styles.boldText]}>
                {totalReports}
              </Text>
            </View>
            <View style={[styles.tableColLastRow, styles.totalRowBg]}>
              <Text style={[styles.tableCell, styles.boldText]}>
                {totalViews}
              </Text>
            </View>
            <View style={[styles.tableColLastRowLast, styles.totalRowBg]}>
              <Text style={[styles.tableCell, styles.boldText]}>
                {totalAmount.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        {/* Declaration */}
        <Text style={styles.declaration}>
          <Text style={styles.boldText}>Declaration: </Text>
          We hereby declare that the services rendered under this invoice are
          subject to a reduced Tax Deducted at Source (TDS) rate of 1.5% under
          Section 194J of the Income Tax Act, as per Certificate No: 1AF0524GTE,
          dated 17-05-2024, issued by the Income Tax Department (ITD). The
          applicable PAN for this deduction is XXXXXXXXXXX.{"\n"}
          Payment Terms and Conditions: Please ensure that you make a payment
          towards the MedKnight Designated Bank Account. The Payment details
          have been intimated to you via email. Kindly make the payment within
          15 days of the receipt of this invoice. For any queries and
          clarification please do reach out to the below mentioned contact
          details. We are MSME certified, protected under the MSMED act. UAM
          No:JH02200022302. For failure to pay within the specified duration
          kindly refer to the link below.
          https://www.indiafilings.com/learn/msme-payment-terms/
        </Text>

        <View style={styles.signature}>
          <Text>Yours Sincerely,</Text>
          <Text style={[styles.boldText, { marginTop: 5 }]}>MedKnight</Text>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          This is computer generated invoice no signature required. Make all
          checks payable to MedKnight (India){"\n"}
          MedKnight Account Details: A/c no :-XXXXXXXXXXXXXXXX IFSC Code
          XXXX00000XX SBI Bank Adityapur Branch{"\n"}
          PAN : XXXXXXX0X, GST: 20JZOPK1181E1ZH Thank You for Your Business!
          {"\n"}
          MedKnight, 54/1/3, Adityapur-2, Jamshedpur, Jharkhand-831013,{"\n"}
        </Text>
      </Page>
    </Document>
  );
};

// Helper function to calculate study price based on views
const getStudyPrice = (study: Study, numberOfViews: number): number => {
  const basePrice = study.price || 0;
  return basePrice * numberOfViews;
};

// Function to calculate individual study price (legacy function for backward compatibility)
const calculateStudyPrice = (payment: Payment, study: Study): number => {
  // If the study has an individual price, use it
  if (study.price && study.price > 0) {
    return study.price;
  }

  // Otherwise, divide the total payment amount by number of studies
  const numberOfStudies = payment.studies.length;
  return numberOfStudies > 0
    ? Math.round(payment.totalAmount / numberOfStudies)
    : payment.totalAmount;
};

// Function to flatten payments into individual study rows
const flattenPaymentsToRows = (payments: Payment[]): PaymentRow[] => {
  const rows: PaymentRow[] = [];

  payments.forEach((payment) => {
    if (payment.studies.length > 0) {
      payment.studies.forEach((study) => {
        // Calculate the number of views for this specific study
        const studyViews =
          study.studySide.length +
          study.studyType.length +
          study.studyView.length;
        const actualViews = studyViews > 0 ? studyViews : 1;

        // Calculate price: base price * number of views
        const studyPrice = getStudyPrice(study, actualViews);

        const row: PaymentRow = {
          id: `${payment.id}-${study.id}`,
          patientName: payment.patientName,
          patientId: payment.patientId,
          orderId: payment.orderId,
          studyDescription: payment.studyDescription,
          reportTime: payment.reportTime,
          activatedDateTime: payment.activatedDateTime,
          completedDateTime: payment.completedDateTime,
          urgentPremium: payment.urgentPremium,
          nightHawk: payment.nightHawk,
          oms: payment.oms,
          totalAmount: studyPrice, // Now correctly multiplied by views
          numberOfReports: 1, // Each study row represents 1 report
          numberOfViews: actualViews, // Actual views for this specific study
          study: study,
          originalPaymentId: payment.id,
          studyViews: actualViews,
        };

        rows.push(row);
      });
    } else {
      // If no studies array, fallback to total amount (legacy support)
      const views = payment.numberOfViews || 1;
      const row: PaymentRow = {
        id: `${payment.id}-default`,
        patientName: payment.patientName,
        patientId: payment.patientId,
        orderId: payment.orderId,
        studyDescription: payment.studyDescription,
        reportTime: payment.reportTime,
        activatedDateTime: payment.activatedDateTime,
        completedDateTime: payment.completedDateTime,
        urgentPremium: payment.urgentPremium,
        nightHawk: payment.nightHawk,
        oms: payment.oms,
        totalAmount: payment.totalAmount, // Total already calculated
        numberOfReports: 1, // Each flattened row is 1 report
        numberOfViews: views, // Use the original numberOfViews
        study: {
          id: `${payment.id}-default`,
          name: payment.studyDescription,
          studyType: [],
          studyView: [],
          studySide: [],
          price: payment.totalAmount / views, // Base price per view
        },
        originalPaymentId: payment.id,
        studyViews: views,
      };

      rows.push(row);
    }
  });

  return rows;
};

// Main Invoice Generator Component with Table
const InvoiceGenerator: React.FC<{ payments?: Payment[] }> = ({
  payments = [],
}) => {
  const [invoiceData, setInvoiceData] = useState<InvoiceData[]>([]);

  // Function to parse date from different formats
  const parseDate = (dateStr: string): Date | null => {
    console.log("Parsing date string:", dateStr, "Type:", typeof dateStr);

    if (!dateStr || typeof dateStr !== "string") {
      console.error("Invalid date string:", dateStr);
      return null;
    }

    try {
      // Clean the date string
      const cleanDateStr = dateStr.trim();

      // Handle "DD Month YYYY-HH:MM" format (e.g., "08 June 2025-17:49")
      if (cleanDateStr.match(/^\d{1,2}\s+\w+\s+\d{4}-\d{2}:\d{2}$/)) {
        const datePart = cleanDateStr.split("-")[0]; // Get "08 June 2025" part
        const date = new Date(datePart);
        if (!isNaN(date.getTime())) {
          console.log(`Parsed ${cleanDateStr} as date with time:`, date);
          return date;
        }
      }

      // Handle DD/MM/YYYY format
      else if (cleanDateStr.includes("/")) {
        const parts = cleanDateStr.split("/");
        if (parts.length === 3) {
          const [day, month, year] = parts.map(Number);
          if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
            const date = new Date(year, month - 1, day);
            console.log(`Parsed ${cleanDateStr} as DD/MM/YYYY:`, date);
            return date;
          }
        }
      }

      // Handle YYYY-MM-DD and DD-MM-YYYY formats (without time)
      else if (cleanDateStr.includes("-") && !cleanDateStr.includes(":")) {
        const parts = cleanDateStr.split("-");
        if (parts.length === 3) {
          const numParts = parts.map(Number);
          if (numParts.every((num) => !isNaN(num))) {
            let date;
            if (numParts[0] > 31) {
              // YYYY-MM-DD format
              date = new Date(numParts[0], numParts[1] - 1, numParts[2]);
            } else {
              // DD-MM-YYYY format
              date = new Date(numParts[2], numParts[1] - 1, numParts[0]);
            }
            console.log(`Parsed ${cleanDateStr} as date with dashes:`, date);
            return date;
          }
        }
      }

      // Try to parse as regular date string
      else {
        const date = new Date(cleanDateStr);
        if (!isNaN(date.getTime())) {
          console.log(`Parsed ${cleanDateStr} as regular date:`, date);
          return date;
        }
      }

      console.error("Failed to parse date string:", cleanDateStr);
      return null;
    } catch (error) {
      console.error("Error parsing date:", dateStr, error);
      return null;
    }
  };

  // Function to get month-year key for grouping
  const getMonthYearKey = (dateStr: string): string => {
    const date = parseDate(dateStr);
    if (!date || isNaN(date.getTime())) {
      console.error("Invalid date for grouping:", dateStr);
      return "Unknown";
    }

    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  // Function to format date for display
  const formatDateForDisplay = (dateStr: string): string => {
    // Handle "DD Month YYYY-HH:MM" format
    if (dateStr.includes("-") && dateStr.includes(":")) {
      const datePart = dateStr.split("-")[0].trim(); // Get "08 June 2025" part
      const date = new Date(datePart);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString("en-GB"); // Convert to DD/MM/YYYY
      }
    }

    const date = parseDate(dateStr);
    if (!date || isNaN(date.getTime())) {
      return dateStr; // Return original string if parsing fails
    }
    return date.toLocaleDateString("en-GB"); // DD/MM/YYYY format
  };

  // Group flattened payment rows by month to create invoice records
  useEffect(() => {
    if (payments.length > 0) {
      console.log("Processing payments:", payments);

      // First, flatten the payments into individual study rows
      const flattenedRows = flattenPaymentsToRows(payments);
      console.log("Flattened payment rows:", flattenedRows);

      const groupedByMonth = flattenedRows.reduce((acc, paymentRow) => {
        const monthYear = getMonthYearKey(paymentRow.reportTime);
        console.log(
          `Payment row ${paymentRow.id} (${paymentRow.reportTime}) -> ${monthYear}`
        );

        if (!acc[monthYear]) {
          acc[monthYear] = [];
        }
        acc[monthYear].push(paymentRow);
        return acc;
      }, {} as Record<string, PaymentRow[]>);

      console.log("Grouped by month:", groupedByMonth);

      // Create invoice data for each month
      const invoices = Object.entries(groupedByMonth).map(
        ([month, monthPaymentRows], index) => {
          const totalAmount = monthPaymentRows.reduce(
            (sum, p) => sum + p.totalAmount,
            0
          );

          // Sort payment rows by date to get the earliest date
          const sortedPaymentRows = monthPaymentRows.sort((a, b) => {
            const dateA = parseDate(a.reportTime);
            const dateB = parseDate(b.reportTime);
            if (!dateA || !dateB) return 0;
            return dateA.getTime() - dateB.getTime();
          });

          const startDate = sortedPaymentRows[0]?.reportTime || "";

          // Generate invoice number based on month and year
          const monthName = month.split(" ")[0];
          const year =
            month.split(" ")[1] || new Date().getFullYear().toString();
          const monthAbbr = monthName.toUpperCase().slice(0, 3);
          const yearAbbr = year.slice(-2);
          const invoiceIndex = 2025 + index;

          const invoiceNumber = `MK/${monthAbbr}${yearAbbr}/I${invoiceIndex}`;

          return {
            invoiceNumber,
            month,
            startDate,
            invoiceDate: new Date().toLocaleDateString("en-GB"),
            invoiceAmount: totalAmount,
            payments: monthPaymentRows, // Now using flattened rows
            isStored: false,
          };
        }
      );

      console.log("Generated invoices:", invoices);
      setInvoiceData(invoices);
    }
  }, [payments]);

  return (
    <div className="w-full">
      {/* Invoice Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              {[
                "Invoice Number",
                "Month",
                "Start Date",
                "Invoice Date",
                "Invoice Amount",
                "Action",
              ].map((col, index, arr) => (
                <th
                  key={col}
                  className={`
                    bg-stone-800 text-stone-100 text-xs px-4 py-3 text-center 
                    whitespace-nowrap uppercase tracking-wider font-medium
                    ${index === 0 ? "rounded-tl-md" : ""} 
                    ${index === arr.length - 1 ? "rounded-tr-md" : ""}
                  `}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {invoiceData.length > 0 ? (
              invoiceData.map((invoice, index) => (
                <tr
                  key={index}
                  className="hover:bg-stone-50 bg-white shadow-xs text-sm text-stone-700"
                >
                  <td className="border-b border-stone-300 px-4 py-4 text-center whitespace-nowrap">
                    {invoice.invoiceNumber}
                  </td>
                  <td className="border-b border-stone-300 px-2 py-4 text-center">
                    {invoice.month}
                  </td>
                  <td className="border-b border-stone-300 px-2 py-4 text-center">
                    {formatDateForDisplay(invoice.startDate)}
                  </td>
                  <td className="border-b border-stone-300 px-2 py-4 text-center">
                    {invoice.invoiceDate}
                  </td>
                  <td className="border-b border-stone-300 px-2 py-4 text-center text-indigo-500">
                    {invoice.invoiceAmount.toFixed(2)}
                  </td>
                  <td className="border-b border-stone-300 px-2 py-4 text-center">
                    <div className="flex justify-center">
                      <PDFDownloadLink
                        document={
                          <InvoicePDF
                            payments={invoice.payments}
                            invoiceNumber={invoice.invoiceNumber}
                            invoiceDate={invoice.invoiceDate}
                          />
                        }
                        fileName={`invoice-${invoice.invoiceNumber.replace(
                          /\//g,
                          "-"
                        )}.pdf`}
                        className="inline-flex items-center justify-center p-2 rounded-full hover:bg-green-100 transition-colors group"
                        title="Download Invoice PDF"
                      >
                        <button className="flex items-center gap-2 group">
                          <Download
                            size={16}
                            className="text-green-600 group-hover:text-green-700"
                          />
                        </button>
                      </PDFDownloadLink>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500">
                  No invoice data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InvoiceGenerator;