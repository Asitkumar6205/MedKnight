import React, { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";

export interface PatientData {
  patientName: string | null | undefined;
  gender: string | null | undefined;
  patientId: string | null | undefined;
  doctor: string | null | undefined;
  studyNames: string | null | undefined;
}

export interface DateTime {
  date: string;
  time: string;
}

interface PatientHeaderProps {
  patientData: PatientData;
  currentDateTime: DateTime;
}

const PatientHeader: React.FC<PatientHeaderProps> = ({ 
  patientData, 
  currentDateTime 
}) => {
  const gridRef = useRef<HTMLDivElement>(null);
  
  const { patientName, gender, patientId, doctor } = patientData;

  return (
    <div
      ref={gridRef}
      className="grid grid-cols-5 gap-4 border border-gray-300 p-4 rounded-md"
    >
      {/* Patient Details */}
      <div className="col-span-2 border-r border-gray-300">
        <table className="w-full text-sm">
          <tbody>
            <tr>
              <td className="font-semibold">Patient Name :</td>
              <td>{patientName}</td>
            </tr>
            <tr>
              <td className="font-semibold">Age/Gender :</td>
              <td>{gender}</td>
            </tr>
            <tr>
              <td className="font-semibold">Patient ID :</td>
              <td>{patientId}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Report Details */}
      <div className="col-span-2 border-r border-gray-300">
        <table className="w-full text-sm">
          <tbody>
            <tr>
              <td className="font-semibold">Referred By :</td>
              <td>{doctor}</td>
            </tr>
            <tr>
              <td className="font-semibold">Reported Date :</td>
              <td>{currentDateTime.date}</td>
            </tr>
            <tr>
              <td className="font-semibold">Reported Time :</td>
              <td>{currentDateTime.time}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* QR Code */}
      <div className="col-span-1 flex items-center justify-center">
        <QRCodeCanvas value="http://localhost:3000" size={60} />
      </div>
    </div>
  );
};

export default PatientHeader;