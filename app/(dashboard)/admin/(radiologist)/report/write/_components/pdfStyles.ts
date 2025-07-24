import { StyleSheet } from "@react-pdf/renderer";

export const pdfStyles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 40,
    fontFamily: "Times-Roman",
    fontSize: 11,
    lineHeight: 1.4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    border: "0.5px solid #737373",
    borderRadius: "3",
    padding: 8,
  },
  patientDetailsSection: {
    paddingTop: 4,
    flex: 1,
    marginRight: 10,
  },
  reportDetailsSection: {
    paddingTop: 4,
    flex: 1,
    marginLeft: 10,
  },
  tableRow: {
    flexDirection: "row",
    marginBottom: 4,
    minHeight: 18,
  },
  labelCell: {
    width: "40%",
    fontFamily: "Times-Roman",
    fontSize: 11,
    fontWeight: "bold",
    color: "#000",
    paddingRight: 5,
  },
  valueCell: {
    width: "60%",
    fontFamily: "Times-Roman",
    fontSize: 11,
    color: "#000",
    fontWeight: "bold",
  },
  studyTitle: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    marginTop: 10,
    fontFamily: "Times-Roman",
    color: "#000",
    textTransform: "uppercase",
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 8,
    fontFamily: "Times-Roman",
    color: "#000",
  },
  contentText: {
    fontSize: 11,
    lineHeight: 1.5,
    marginBottom: 10,
    fontFamily: "Times-Roman",
    color: "#000",
    textAlign: "justify",
  },
  radiologistSection: {
    marginTop: 30,
    flexDirection: "column", // Changed from "row" to "column"
    alignItems: "flex-end", // Center align everything
  },
  radiologistInfo: {
    alignItems: "flex-end",
    marginTop: 10, // Add some space between signature and info
  },
  radiologistName: {
    fontSize: 12,
    fontWeight: "bold",
    fontFamily: "Times-Roman",
    color: "#000",
    marginBottom: 2,
    textAlign: "right", // Ensure text is centered
  },
  radiologistDetail: {
    fontSize: 10,
    fontFamily: "Times-Roman",
    color: "#000",
    marginBottom: 1,
    textAlign: "right",
  },
  signatureSpace: {
    height: 60,
    marginBottom: 10,
  },
  horizontalRule: {
    borderBottom: "1px solid #000",
    marginBottom: 15,
    marginTop: 20,
    width: "100%", // Make sure the line spans full width
  },
  reportedBy: {
    fontSize: 11,
    fontFamily: "Times-Roman",
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
    textAlign: "center", // Center the "Reported By" text
  },
  signatureContainer: {
    alignItems: "center", // Changed from "flex-end" to "center"
    marginTop: 10,
    marginBottom: 5,
  },
  signatureImage: {
    color: "black",
    width: 100,
    height: 40,
    objectFit: "contain",
  },
  disclaimer: {
    fontSize: 8,
    fontFamily: "Times-Roman",
    color: "#666",
    marginTop: 30,
    paddingTop: 15,
    borderTop: "1px solid #ccc",
    lineHeight: 1.3,
    textAlign: "justify",
  },
  section: {
    margin: 10,
    padding: 10,
  },
  content: {
    fontSize: 8,
    lineHeight: 1.5,
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  contentContainer: {
    marginHorizontal: 10,
  },
  sectionHeader: {
    fontSize: 10,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
  },
  logo: {
    display: "flex",
    flexDirection: "column", // Change this from "row" to "column"
    justifyContent: "center",
    alignItems: "center",
    marginTop: "auto",
    marginBottom: 16,
  },
  query: {
    fontSize: "10",
    color: "#374151 ",
    textAlign: "justify",
    alignItems: "flex-start",
    display: "flex",
    marginBottom: 8, // Optional spacing between query and logos
  },
  logoImage: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
