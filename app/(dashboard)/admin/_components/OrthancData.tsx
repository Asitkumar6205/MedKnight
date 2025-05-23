"use client";

import { useEffect, useState } from "react";

interface Study {
  ID: string;
  PatientName: string;
  StudyInstanceUID: string;
  PatientID: string;
  PatientSex: string;
  StudyDescription: string;
  StudyDate: string;
  StudyTime: string;
  Modality: string;
  Series: number;
}

export default function StudiesList() {
  const [studies, setStudies] = useState<Study[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStudies = async () => {
    try {
      const response = await fetch("/api/studies");
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${await response.text()}`);
      }
      const data: Study[] = await response.json();

      // Only update state if new studies are found (without reloading the page)
      if (data.length > studies.length) {
        setStudies(data);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudies(); // Initial fetch

    const interval = setInterval(fetchStudies, 5000); // Poll every 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  if (loading) return <p>Loading studies...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Studies List</h2>
      {studies.length === 0 ? (
        <p>No studies found.</p>
      ) : (
        <ul className="space-y-4">
          {studies.map((study) => (
            <li key={study.ID} className="p-4 border rounded-lg shadow-md">
              <p><strong>Patient Name:</strong> {study.PatientName}</p>
              <p><strong>Patient Name:</strong> {study.StudyInstanceUID}</p>
              <p><strong>Patient ID:</strong> {study.PatientID}</p>
              <p><strong>Description:</strong> {study.StudyDescription}</p>
              <p><strong>Date:</strong> {study.StudyDate}</p>
              <p><strong>Modality:</strong> {study.Modality}</p>
              <p><strong>Series Count:</strong> {study.Series}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
