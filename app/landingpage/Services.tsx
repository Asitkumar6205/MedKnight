import { Button } from "@/components/ui/button";
import React from "react";
import { FaArrowRight, FaRegClock } from "react-icons/fa6";
import { HiOutlineChip } from "react-icons/hi";
import { LuScanText } from "react-icons/lu";
import { TbCube3dSphere, TbReportMedical } from "react-icons/tb";

function Services() {
  return (
    <div id="services" className="bg-stone-100 lg:px-44 lg:-ml-4">
      <div className="p-14 flex flex-col justify-center items-center gap-4">
        <h2 className="pt-8 text-4xl font-bold text-stone-800 text-center ">
          Our Comprehensive Services
        </h2>
        <h3 className="text-center text-xl font-light text-stone-500 lg:max-w-3xl">
          End-to-end AI-powered teleradiology solutions across all imaging
          modalities — enabling accurate, rapid, and accessible diagnostics for
          healthcare providers, anytime.
        </h3>
      </div>
      <div className="max-lg:mx-4 lg:mx-14 mb-14 grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-8 relative">
        <div className="bg-stone-100 p-8 rounded-lg shadow-md">
          <HiOutlineChip className="h-14 w-14 text-purple-400 mb-4" />
          <h2 className="text-stone-800 text-lg font-bold mb-2">
            X-Ray Reporting
          </h2>
          <h3 className="text-stone-500 font-medium">
            Swift and accurate interpretation of routine and emergency X-rays,
            powered by AI and radiologist expertise - with a focus on clarity
            and clinical value.
          </h3>
        </div>
        <div className="bg-stone-100 p-8 rounded-lg shadow-md">
          <TbCube3dSphere className="h-14 w-14 text-purple-400 mb-4" />
          <h2 className="text-stone-800 text-lg font-bold mb-2">
            CT Scan Analysis
          </h2>
          <h3 className="text-stone-500 font-medium">
            In-depth CT reporting with AI-assisted detection, 3D reconstruction,
            and rapid emergency turnaround, tailored for trauma, stroke, and
            critical cases.
          </h3>
        </div>
        <div className="bg-stone-100 p-8 rounded-lg shadow-md">
          <LuScanText className="h-14 w-14 text-purple-400 mb-4" />
          <h2 className="text-stone-800 text-lg font-bold mb-2">
            MRI Interpretation
          </h2>
          <h3 className="text-stone-500 font-medium">
            High-precision MRI analysis, with specialization in neurological and
            musculoskeletal studies, ensuring diagnostic depth and timely
            reporting.
          </h3>
        </div>
        <div className="bg-stone-100 p-8 rounded-lg shadow-md">
          <TbReportMedical className="h-14 w-14 text-purple-400 mb-4" />
          <h2 className="text-stone-800 text-lg font-bold mb-2">
            Ultrasound Reports
          </h2>
          <h3 className="text-stone-500 font-medium">
            Detailed and reliable interpretation of general, vascular,
            abdominal, obstetric, and specialty sonography, guided by
            radiologist insights and AI validation.
          </h3>
        </div>
      </div>
      <div className="flex justify-center items-center">
        <Button className="mb-14 bg-purple-400 text-md h-[52px] lg:px-9 font-bold hover:bg-purple-400">
          Get Started with Our Services
          <span>
            <FaArrowRight />
          </span>
        </Button>
      </div>
    </div>
  );
}

export default Services;
