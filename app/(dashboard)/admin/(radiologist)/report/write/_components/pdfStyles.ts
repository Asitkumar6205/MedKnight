import { StyleSheet } from "@react-pdf/renderer";

export const pdfStyles = StyleSheet.create({
  page: {
    flexDirection: "column",
    padding: 20,
    fontFamily: "Helvetica",
    backgroundColor: "#FFFFFF",
  },
  section: {
    margin: 10,
    padding: 10,
  },
  header: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  patientDetailsSection: {
    width: "44%",
    borderRightWidth: 1,
    borderRightColor: "#e5e7eb",
    paddingRight: 10,
  },
  reportDetailsSection: {
    width: "44%",
    borderRightWidth: 1,
    borderRightColor: "#e5e7eb",
    paddingHorizontal: 10,
  },
  qrCodeSection: {
    width: 52,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 10,
  },
  tableRow: {
    flexDirection: "row",
    marginVertical: 2,
  },
  labelCell: {
    fontWeight: "bold",
    width: "35%",
    fontSize: 8,
    paddingRight: 2,
  },
  valueCell: {
    width: "65%",
    fontSize: 8,
    textOverflow: "ellipsis",
  },
  studyTitle: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 12,
    color: "#7e22ce",
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 5,
    color: "black",
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
  radiologistSection: {
    marginTop: 30,
    marginLeft: 10,
    marginRight: 10,
  },
  signatureContainer: {
    alignItems: "flex-end",
    marginTop: 15,
    marginRight: 20,
  },
  signatureImage: {
    width: 120,
    height: 40,
    objectFit: "contain",
  },
  radiologistInfo: {
    alignItems: "flex-end",
    marginRight: 20,
  },
  radiologistName: {
    fontSize: 10,
    fontWeight: "bold",
  },
  radiologistDetail: {
    fontSize: 8,
    marginTop: 2,
  },
  horizontalRule: {
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    marginVertical: 5,
  },
});