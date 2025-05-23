import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { FaArrowRight } from "react-icons/fa6";
import { HiOutlineChip } from "react-icons/hi";
import { LuScanText } from "react-icons/lu";
import { TbCube3dSphere } from "react-icons/tb";

function Services() {
  return (
    <div id="services" className="lg:px-44 lg:-ml-4 ">
      <div className="p-14 flex flex-col justify-center items-center gap-4">
        <h2 className="pt-8 text-4xl font-bold text-stone-100 text-center ">
          Our Comprehensive Services
        </h2>
        <h3 className="text-center text-xl font-light text-stone-400 lg:max-w-3xl">
          End-to-end AI-powered teleradiology solutions across all imaging
          modalities — enabling accurate, rapid, and accessible diagnostics for
          healthcare providers, anytime.
        </h3>
      </div>
      <div className="max-lg:mx-4 lg:mx-14 mb-14 grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-8 relative">
        <div className="bg-stone-100 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
          <div className="h-48 overflow-hidden relative">
            <img
              src="/xray.png"
              alt="X-ray image showing chest radiograph"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-stone-900/80"></div>
            <div className="absolute bottom-0 left-0 w-full p-4 flex items-center">
              <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full p-3 shadow-lg shadow-purple-500/20 mr-3">
                <HiOutlineChip className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-white text-xl font-bold">X-Ray Reporting</h2>
            </div>
          </div>
          {/* Glassmorphic content section */}
          <div className="backdrop-blur-md bg-white/30 p-6 border border-white/20 shadow-inner">
            <h3 className="text-stone-700 font-medium leading-relaxed">
              Swift and accurate interpretation of routine and emergency X-rays,
              powered by AI and radiologist expertise - with a focus on clarity
              and clinical value.
            </h3>
          </div>
        </div>

        <div className="bg-stone-100 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
          <div className="h-48 overflow-hidden relative">
            <img
              src="/ct.png"
              alt="CT scan 3D rendering of brain"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-stone-900/80"></div>
            <div className="absolute bottom-0 left-0 w-full p-4 flex items-center">
              <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full p-3 shadow-lg shadow-purple-500/20 mr-3">
                <TbCube3dSphere className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-white text-xl font-bold">CT Scan Analysis</h2>
            </div>
          </div>
          <div className="p-6">
            <h3 className="text-stone-600 font-medium leading-relaxed">
              In-depth CT reporting with AI-assisted detection, 3D
              reconstruction, and rapid emergency turnaround, tailored for
              trauma, stroke, and critical cases.
            </h3>
          </div>
        </div>

        <div className="bg-stone-100 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
          <div className="h-48 overflow-hidden relative">
            <img
              src="/mri.png"
              alt="MRI scan of knee joint"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-stone-900/80"></div>
            <div className="absolute bottom-0 left-0 w-full p-4 flex items-center">
              <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full p-3 shadow-lg shadow-purple-500/20 mr-3">
                <LuScanText className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-white text-xl font-bold">
                MRI Interpretation
              </h2>
            </div>
          </div>
          <div className="p-6">
            <h3 className="text-stone-600 font-medium leading-relaxed">
              High-precision MRI analysis, with specialization in neurological
              and musculoskeletal studies, ensuring diagnostic depth and timely
              reporting.
            </h3>
          </div>
        </div>
        {/* <div className="bg-stone-100 p-8 rounded-lg shadow-md">
          <TbReportMedical className="h-14 w-14 text-purple-400 mb-4" />
          <h2 className="text-stone-800 text-lg font-bold mb-2">
            Ultrasound Reports
          </h2>
          <h3 className="text-stone-500 font-medium">
            Detailed and reliable interpretation of general, vascular,
            abdominal, obstetric, and specialty sonography, guided by
            radiologist insights and AI validation.
          </h3>
        </div> */}
      </div>
      <div className="flex justify-center items-center">
        <Link href={"/signin"} className="flex justify-center items-center bg-gradient-to-r mb-14 from-purple-500 to-indigo-600 text-lg h-[50px] text-white font-bold hover:from-purple-600 hover:to-indigo-700 shadow-lg shadow-purple-500/20 px-10 rounded-full transition-all duration-300 transform hover:scale-105">
          Get Started with Our Services
          <span>
            <FaArrowRight className="ml-2"/>
          </span>
        </Link>
      </div>
    </div>
  );
}

export default Services;
