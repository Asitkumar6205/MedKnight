"use client";
import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import formattedOutput from "./formatted_output.json";
import * as z from "zod";
import { X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useActiveCase } from "@/app/context/ActiveCaseContext";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  doctor: z.string().min(1, "Doctor name is required"),
  priority: z.enum(["Routine", "Urgent", "Stat"]).default("Routine"),
  history: z.string().min(1, "Clinical history is required"),

  // Study details - simpler validation
  study: z.string().refine((val) => {
    try {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) && parsed.length > 0;
    } catch (e) {
      // If it's not empty but can't be parsed, consider it valid
      // This handles cases where the value is an empty array string "[]"
      return val !== "[]" && val !== "";
    }
  }, "At least one study must be selected"),

  // File Upload Validation
  files: z
    .array(
      z.object({
        filename: z.string().min(1, "Filename is required"),
        path: z.string().min(1, "File path is required"),
        uploadedAt: z.string().optional(), // ✅ Accepts ISO string format
      })
    )
    // .min(1, "At least one file must be uploaded"),
    .optional() // This makes the entire array optional
    .default([]),
});

type StudyData = {
  [studyName: string]: {
    price?: number;
    // format?: string;
    [field: string]: string[] | number | undefined;
  };
};

type FileObject = {
  filename: string;
  path: string;
  uploadedAt?: string;
};

export default function PatientUploadForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);
  const [rFiles, setRFiles] = useState<FileObject[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [studies, setStudies] = useState<StudyData>({});
  const [search, setSearch] = useState("");
  const [selectedStudies, setSelectedStudies] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(true);
  const searchRef = useRef<HTMLDivElement | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string[]>
  >({});
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [structuredStudiesCheck, setStructuredStudiesCheck] = useState<
    Record<string, Record<string, Record<string, string[]>>>
  >({});

  const router = useRouter();

  const { setActiveCase } = useActiveCase();

  const searchParams = useSearchParams();
  const patientId = searchParams?.get("patientId");
  const studyUID = searchParams?.get("studyUID");
  const patientName = searchParams?.get("name");
  const studyDescription = searchParams?.get("description");
  const gender = searchParams?.get("gender");
  const modality = searchParams?.get("modality");
  const studyDate = searchParams?.get("studyDate");
  const studyTime = searchParams?.get("time");
  const series = searchParams?.get("series");

  useEffect(() => {
    setStudies(formattedOutput); // Set data directly
  }, []);

  const studyNames = Object.keys(studies);

  // Filter studies based on search input
  const filteredStudies = studyNames.filter((study) =>
    study.toLowerCase().includes(search.toLowerCase())
  );

  // Handle study selection (multi-select)
  const handleSelectStudy = (study: string) => {
    if (!selectedStudies.includes(study)) {
      setSelectedStudies((prev) => [...prev, study]);
    }

    if (!selectedStudies.includes(study)) {
      setSelectedStudies([...selectedStudies, study]);
      setSearch("");
      setIsDropdownOpen(false); // Close the dropdown after selection
    }
    setSearch(""); // Clear search after selection
  };

  // Handle removing a selected study
  const handleRemoveStudy = (study: string) => {
    setSelectedStudies((prev) => prev.filter((s) => s !== study));

    // Remove corresponding checkboxes when a study is removed
    setSelectedOptions((prev) => {
      const updatedOptions = { ...prev };
      delete updatedOptions[study];
      return updatedOptions;
    });
  };

  // Modified handleCheckboxChange function
  const handleCheckboxChange = (
    study: string,
    field: string,
    value: string
  ) => {
    setSelectedOptions((prevOptions) => {
      const updatedOptions = { ...prevOptions };

      // Ensure study key exists
      updatedOptions[study] = updatedOptions[study]
        ? [...updatedOptions[study]]
        : [];

      if (field === "Select Gender") {
        // ✅ Remove any previously selected gender before adding the new one
        updatedOptions[study] = updatedOptions[study].filter(
          (option) => !["Male", "Female"].includes(option)
        );
        updatedOptions[study].push(value);
      } else {
        // ✅ Handle checkboxes normally (Add/Remove selection)
        if (updatedOptions[study].includes(value)) {
          updatedOptions[study] = updatedOptions[study].filter(
            (v) => v !== value
          );
        } else {
          updatedOptions[study].push(value);
        }
      }

      // ✅ Initialize arrays for storing selected options
      let studyViews: string[] = [];
      let studySides: string[] = [];
      let studyTypes: string[] = [];

      // ✅ Initialize sets to track selected fields & values
      let selectedFieldsSet = new Set(selectedFields);
      let selectedValuesSet = new Set(selectedValues);

      // ✅ Process selected options
      selectedStudies.forEach((studyKey) => {
        if (updatedOptions[studyKey]) {
          const studyFields = studies[studyKey] || {}; // Ensure study fields exist

          Object.entries(studyFields).forEach(([fieldName, values]) => {
            // Check if values is an array before filtering
            if (Array.isArray(values)) {
              const selectedForField = updatedOptions[studyKey].filter(
                (option) => values.includes(option)
              );

              // ✅ Categorize selected options
              if (["Study View", "View Type"].includes(fieldName)) {
                studyViews = [...new Set([...studyViews, ...selectedForField])];
              } else if (["Side", "Study Side"].includes(fieldName)) {
                studySides = [...new Set([...studySides, ...selectedForField])];
              } else {
                studyTypes = [...new Set([...studyTypes, ...selectedForField])];
              }

              // ✅ Track selected fields & values
              if (
                ["Select Type", "Select Side", "Select View"].includes(
                  fieldName
                )
              ) {
                selectedFieldsSet.add(fieldName);
                selectedValuesSet = new Set([
                  ...selectedValuesSet,
                  ...selectedForField,
                ]);
              }
            }
          });
        }
      });

      // ✅ Ensure empty arrays are explicitly set
      setValue("studyView", studyViews.length > 0 ? studyViews : []);
      setValue("studySide", studySides.length > 0 ? studySides : []);
      setValue("studyType", studyTypes.length > 0 ? studyTypes : []);

      // ✅ Update selectedFields & selectedValues states
      setSelectedFields(Array.from(selectedFieldsSet));
      setSelectedValues(Array.from(selectedValuesSet));

      return updatedOptions; // ✅ Update state correctly
    });
  };

  // Toggle dropdown visibility when clicking on the search bar
  const handleSearchClick = () => {
    if (!isDropdownOpen) {
      setIsDropdownOpen(true);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const handleReport = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles: FileObject[] = Array.from(e.target.files).map((file) => ({
        filename: file.name,
        path: URL.createObjectURL(file), // Temporary preview URL
        uploadedAt: new Date().toISOString(), // ✅ Convert Date to String (ISO format)
      }));

      // Update React Hook Form & Local State
      const updatedFiles = [...rFiles, ...newFiles];
      setRFiles(updatedFiles); // Update local state for UI rendering
      setValue("files", updatedFiles, { shouldValidate: true }); // Update form state
    }
  };

  useEffect(() => {
    console.log("Studies Data Loaded:", studies);
  }, [studies]);

  useEffect(() => {
    console.log("Selected Studies:", selectedStudies);
  }, [selectedStudies]);

  useEffect(() => {
    const structuredStudies: Record<
      string,
      Record<string, Record<string, string[]>>
    > = {};

    selectedStudies.forEach((study) => {
      structuredStudies[study] = {};

      Object.entries(studies[study] || {}).forEach(([field, values]) => {
        structuredStudies[study][field] = {};

        // Check if values is an array before calling forEach
        if (Array.isArray(values)) {
          values.forEach((value) => {
            if (selectedOptions[study]?.includes(value)) {
              if (!structuredStudies[study][field][value]) {
                structuredStudies[study][field][value] = [];
              }
              structuredStudies[study][field][value].push(value);
            }
          });
        }
        // If values is not an array (like 'price' which is a number), skip it
        else if (field !== "price") {
          // Handle non-array values if needed
          console.log(`Field ${field} has non-array value:`, values);
        }
      });
    });

    // Update state only once after processing is complete
    setStructuredStudiesCheck(structuredStudies);

    console.log("Selected Options:", structuredStudies);
  }, [selectedStudies, selectedOptions, studies]); // Dependencies that trigger recalculation

  useEffect(() => {
    console.log("Uploaded Files:", rFiles);
  }, [rFiles]);

  useEffect(() => {
    if (selectedStudies.length > 0) {
      setValue("study", JSON.stringify(selectedStudies), {
        shouldValidate: true,
      });
    }
  }, [selectedStudies, setValue]);

  const handleRemoveFile = (index: number) => {
    const updatedFiles = rFiles.filter((_, i) => i !== index);
    setRFiles(updatedFiles);
    setValue("files", updatedFiles, { shouldValidate: true }); // Sync form state
  };

  const onSubmit = async (data: any) => {
    console.log("onSubmit function called!");
    if (isSubmitting) return;
    setLoading(true);
    setIsSubmitting(true);

    try {
      const formData = new FormData();

      if (patientId) {
        formData.append("patientId", patientId);
        setActiveCase(patientId, true, true);
      }
      if (studyUID) {
        formData.append("studyUID", studyUID);
      }
      if (patientName) {
        formData.append("patientName", patientName);
      }
      if (studyDescription) {
        formData.append("studyDescription", studyDescription);
      }
      if (gender) {
        formData.append("gender", gender);
      }
      if (modality) {
        formData.append("modality", modality);
      }

      if (studyDate) {
        formData.append("studyDate", studyDate);
      }
      if (studyTime) {
        formData.append("studyTime", studyTime);
      }
      if (series) {
        formData.append("series", series);
      }

      // Add text fields
      formData.append("doctor", data.doctor);
      formData.append("priority", data.priority || "Routine");
      formData.append("history", data.history);

      // Transform selected options into structured format
      const structuredStudies: Record<
        string,
        Record<string, Record<string, string[]>>
      > = {};

      // Collect prices for selected studies
      const studyPrices: Record<string, number> = {};
      let totalAmount = 0;

      selectedStudies.forEach((studyName) => {
        structuredStudies[studyName] = {};

        // Extract price if available
        const price = studies[studyName]?.price;
        if (typeof price === "number") {
          studyPrices[studyName] = price;

          // Count the number of SELECTED options in each category, not all available options
          const selectedViewCount =
            Array.isArray(studies[studyName]?.["Select View"]) &&
            Array.isArray(selectedOptions[studyName])
              ? studies[studyName]["Select View"].filter((view) =>
                  selectedOptions[studyName].includes(view)
                ).length
              : Array.isArray(studies[studyName]?.["Study View"]) &&
                Array.isArray(selectedOptions[studyName])
              ? studies[studyName]["Study View"].filter((view) =>
                  selectedOptions[studyName].includes(view)
                ).length
              : Array.isArray(studies[studyName]?.["View Type"]) &&
                Array.isArray(selectedOptions[studyName])
              ? studies[studyName]["View Type"].filter((view) =>
                  selectedOptions[studyName].includes(view)
                ).length
              : 0;

          const selectedSideCount =
            Array.isArray(studies[studyName]?.["Select Side"]) &&
            Array.isArray(selectedOptions[studyName])
              ? studies[studyName]["Select Side"].filter((side) =>
                  selectedOptions[studyName].includes(side)
                ).length
              : Array.isArray(studies[studyName]?.["Study Side"]) &&
                Array.isArray(selectedOptions[studyName])
              ? studies[studyName]["Study Side"].filter((side) =>
                  selectedOptions[studyName].includes(side)
                ).length
              : Array.isArray(studies[studyName]?.["Side"]) &&
                Array.isArray(selectedOptions[studyName])
              ? studies[studyName]["Side"].filter((side) =>
                  selectedOptions[studyName].includes(side)
                ).length
              : 0;

          const selectedTypeCount =
            Array.isArray(studies[studyName]?.["Select Type"]) &&
            Array.isArray(selectedOptions[studyName])
              ? studies[studyName]["Select Type"].filter((type) =>
                  selectedOptions[studyName].includes(type)
                ).length
              : Array.isArray(studies[studyName]?.["Study Type"]) &&
                Array.isArray(selectedOptions[studyName])
              ? studies[studyName]["Study Type"].filter((type) =>
                  selectedOptions[studyName].includes(type)
                ).length
              : 0;

          // Calculate total selected options count
          const selectedOptionsCount =
            selectedViewCount + selectedSideCount + selectedTypeCount;

          // If there are no selected options, multiply by 1, otherwise by the count
          const multiplier =
            selectedOptionsCount > 0 ? selectedOptionsCount : 1;

          // Add to total amount
          totalAmount += price * multiplier;
        }

        // Continue with your existing code for structuring studies
        Object.entries(studies[studyName] || {}).forEach(([field, values]) => {
          structuredStudies[studyName][field] = {};

          // Check if values is an array before calling forEach
          if (Array.isArray(values)) {
            values.forEach((value) => {
              if (selectedOptions[studyName]?.includes(value)) {
                if (!structuredStudies[studyName][field][value]) {
                  structuredStudies[studyName][field][value] = [];
                }
                structuredStudies[studyName][field][value].push(value);
              }
            });
          }
        });
      });

      // Add prices data to formData
      formData.append("studyPrices", JSON.stringify(studyPrices));
      formData.append("totalAmount", totalAmount.toString());
      formData.append("selectedStudies", JSON.stringify(structuredStudies));

      // Add files
      if (rFiles && rFiles.length > 0) {
        for (const file of rFiles) {
          try {
            const response = await fetch(file.path);
            const blob = await response.blob();
            const fileObj = new File([blob], file.filename, {
              type: blob.type,
            });
            formData.append("files", fileObj);
          } catch (error) {
            console.error("Error processing file:", error);
          }
        }
      }

      // Send data to backend
      const response = await fetch("/api/postCase", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json", // Add this to ensure proper response parsing
        },
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Form submitted successfully", result);
        reset();
        setSelectedStudies([]);
        setSelectedOptions({});
        setRFiles([]);
        setShowSuccess(true);

        // Show success message briefly before navigating back
        setTimeout(() => {
          setShowSuccess(false);
          router.push("/admin/active-orders");
        }, 1000); // Reduced timeout to 1 second for faster navigation
      } else {
        const errorData = await response.json();
        setError(errorData.error);
        setShowError(true);
        console.warn("Error submitting form:", errorData);
        setTimeout(() => setShowError(false), 3000);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full mx-auto max-sm:p-4 relative mt-8 rounded-br-md rounded-bl-md">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-60 z-50">
          <div className="w-12 h-12 border-4 border-stone-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white py-2 px-4 shadow-lg text-center transition-opacity duration-500 rounded">
          ✅ Case submitted successfully!
        </div>
      )}

      {showError && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white py-2 px-4 shadow-lg text-center transition-opacity duration-500 rounded">
          ❌ {error}!
        </div>
      )}

      <h2 className="text-2xl font-semibold text-stone-800 mb-2">
        Draft Case
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 max-sm:space-y-4"
      >
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 -mb-2">
          {/* 1. Referring Doctor/Physician */}
          <div className="bg-white rounded p-4">
            <h3 className="font-medium text-stone-700 mb-3">
              1. Referring Doctor
            </h3>
            <div className="flex max-sm:flex-col flex-row items-start">
              <label className="text-stone-700 min-w-36 p-1 mt-1">
                Doctor Name <span className="text-red-500 font-bold"> *</span>
              </label>
              <div className="w-full">
                <input
                  placeholder="Doctor Name"
                  className="w-full text-stone-600 p-2 border border-stone-300 hover:border-stone-500 focus:border-stone-500 focus:outline-none rounded"
                  {...register("doctor")}
                />
                {errors?.doctor && (
                  <p className="text-red-500 text-xs">
                    {String(errors.doctor.message)}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* 2. Reporting Preferences */}
          <div className="bg-white rounded p-4">
            <h3 className="font-medium text-stone-700 mb-3">
              2. Reporting Preferences
            </h3>
            <div className="flex max-sm:flex-col flex-row items-start">
              <label className="text-stone-700 w-32 lg:w-36 flex-none p-1">
                Report Priority
                <span className="text-red-500 font-bold"> *</span>
              </label>
              <div className="flex flex-wrap gap-3 mt-1">
                {["Routine", "Urgent", "Stat"].map((priority) => (
                  <label
                    key={priority}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      value={priority}
                      {...register("priority")}
                      className="accent-stone-700"
                      defaultChecked={priority === "Routine"}
                    />
                    <span className="text-stone-700">{priority}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* 3. Clinical History/Report with File Upload */}
          <div className="bg-white rounded p-4">
            <h3 className="font-medium text-stone-700 mb-3">
              3. Clinical History
              <span className="text-red-500 font-bold"> *</span>
            </h3>
            <textarea
              className="w-full text-stone-700 h-32 border border-stone-300 rounded p-2 resize-none focus:outline-none hover:border-stone-500 focus:border-stone-500"
              placeholder="Enter clinical history or additional notes here..."
              {...register("history")}
            ></textarea>
            {errors?.history && (
              <p className="text-red-500 text-xs -mt-1">
                {String(errors.history.message)}
              </p>
            )}

            {/* File Upload/Drag & Drop Section */}
            <div className="">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-stone-600">
                  Documents
                </span>
                <span className="text-xs text-stone-500">
                  Drag files or click to upload
                </span>
              </div>

              <div className="relative">
                <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-stone-300 rounded-md hover:bg-stone-50 hover:border-purple-300 transition-colors cursor-pointer bg-stone-50">
                  <div className="flex flex-col items-center justify-center ">
                    <svg
                      className="w-8 h-8 text-stone-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      ></path>
                    </svg>
                    <p className="text-xs text-stone-500">
                      Upload files or drag and drop
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleReport}
                    multiple
                  />
                </label>
                {/* {errors?.files && (
                  <p className="text-red-500 text-xs">
                    {String(errors.files.message)}
                  </p>
                )} */}
              </div>

              {/* File List */}
              <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {rFiles.map((file, index) => (
                  <li
                    key={index}
                    className="mt-1 flex items-center justify-between text-sm bg-purple-100 text-purple-800 px-3 py-1 rounded relative"
                    title={file.filename} // Changed from file.name
                  >
                    <div className="flex items-center truncate">
                      <svg
                        className="w-4 h-4 mr-2 flex-shrink-0 text-purple-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        ></path>
                      </svg>
                      <span className="truncate">{file.filename}</span>{" "}
                      {/* Fixed property */}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(index)}
                      className="ml-2 text-purple-700 hover:text-purple-900"
                      title="Remove file"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        ></path>
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 4. Select Study */}
          <div className="bg-white rounded p-4 ">
            <h3 className="font-medium text-stone-700 mb-3">
              4. Select Study <span className="text-red-500 font-bold"> *</span>
            </h3>

            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search for a study..."
                className={`border hover:border-stone-500 text-stone-700 ${
                  errors?.study ? "border-red-500" : "border-stone-300"
                } p-2 w-full rounded focus:outline-none focus:border-stone-500`}
                value={search}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearch(e.target.value)
                }
                onClick={handleSearchClick}
              />

              {/* Display error message */}
              {errors?.study && (
                <p className="text-red-500 text-xs mb-1">
                  {String(errors.study.message)}
                </p>
              )}

              {/* Dropdown */}
              {isDropdownOpen && (
                <div className="absolute z-10 left-0 right-0 top-full border border-stone-300 bg-white max-h-[205px] overflow-auto rounded shadow-md">
                  {filteredStudies.length > 0 ? (
                    filteredStudies.map((study) => (
                      <div
                        key={study}
                        className="p-2 cursor-pointer border-b text-md hover:bg-stone-100 text-stone-700"
                        onClick={() => handleSelectStudy(study)}
                      >
                        {study}
                      </div>
                    ))
                  ) : (
                    <div className="p-2 text-stone-500">No matches found</div>
                  )}
                </div>
              )}
            </div>

            {/* Hidden input to store the selected studies for React Hook Form */}
            <input
              type="hidden"
              {...register("study")}
              value={JSON.stringify(selectedStudies)}
            />

            {/* Selected Studies Pills */}
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedStudies.map((study) => (
                <span
                  key={study}
                  className="bg-stone-700 text-white px-3 py-1 rounded-sm flex items-center text-sm"
                >
                  {study}
                  <button
                    onClick={() => handleRemoveStudy(study)}
                    className="ml-2 text-white font-bold"
                    type="button"
                  >
                    <X size={16} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Study Options (Only shown when studies are selected) */}
        {selectedStudies.filter(
          (study) => Object.keys(studies[study] || {}).length > 0
        ).length > 0 && (
          <div className="bg-white rounded p-4">
            <h3 className="font-medium text-stone-700 mb-2">Study Details</h3>
            <div className="space-y-4">
              {selectedStudies
                .filter((study) => Object.keys(studies[study] || {}).length > 0)
                .map((study, index) => (
                  <div
                    key={study}
                    className="bg-stone-50 rounded p-3 shadow-sm"
                  >
                    <h4 className="text-md font-semibold text-stone-800 mb-2">
                      {`${index + 1}. ${study}`}
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {Object.entries(studies[study] || {})
                        // Filter out 'price' and 'Additional studies' fields
                        .filter(
                          ([field]) =>
                            field !== "price" && field !== "Additional studies"
                        )
                        .map(([field, values]) => (
                          <div
                            key={field}
                            className="bg-white p-2 rounded border border-stone-100 flex-grow"
                          >
                            <h5 className="text-sm text-stone-600 font-medium mb-1">
                              {field}
                              {field != "Select Gender" && (
                                <span className="text-red-500 font-bold">
                                  *
                                </span>
                              )}
                            </h5>
                            <div className="flex flex-row flex-wrap items-center">
                              {Array.isArray(values) &&
                                values.map((value) => (
                                  <label
                                    key={value}
                                    className="flex items-center mr-4 mb-2 text-sm text-stone-700 whitespace-nowrap"
                                  >
                                    <input
                                      type={
                                        field == "Select Gender"
                                          ? "radio"
                                          : "checkbox"
                                      }
                                      name={
                                        field == "Select Gender"
                                          ? `${study}-gender`
                                          : undefined
                                      }
                                      className="accent-stone-700 mr-1"
                                      checked={
                                        selectedOptions[study]?.includes(
                                          value
                                        ) || false
                                      }
                                      onChange={() =>
                                        handleCheckboxChange(
                                          study,
                                          field,
                                          value
                                        )
                                      }
                                    />
                                    <span>{value}</span>
                                  </label>
                                ))}
                            </div>
                          </div>
                        ))}
                    </div>
                    <div className="flex flex-row gap-4">
                      {errors?.study && (
                        <div className="text-red-500 text-xs">
                          {String(errors.study.message)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="px-8 py-2 bg-stone-700 rounded text-white hover:bg-stone-800 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-300 disabled:opacity-70"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-100"
                    fill="currentColor"
                    d="M12 2a10 10 0 00-10 10h4a6 6 0 016-6V2z"
                  ></path>
                </svg>
                Processing...
              </div>
            ) : (
              "Send for Reporting"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
