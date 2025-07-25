"use client";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaArrowRight } from "react-icons/fa6";
import { HiOutlineChip } from "react-icons/hi";
import { LuScanText } from "react-icons/lu";
import { TbCube3dSphere } from "react-icons/tb";

function Services() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClick = async (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    e.preventDefault();
    setLoading(true);
    router.push("/signup");
  };

  return (
    <div id="services" className="lg:px-24 relative">
      {/* Background gradient overlay */}
      <div className="absolute inset-0"></div>

      <div className="relative z-10 p-4 sm:p-6 md:p-10 lg:p-14 flex flex-col justify-center items-center gap-3 sm:gap-4">
        <h2 className="pt-4 sm:pt-6 md:pt-8 text-2xl sm:text-3xl md:text-4xl font-bold text-stone-100 text-center bg-gradient-to-r from-purple-300 to-indigo-300 bg-clip-text text-transparent leading-tight px-2">
          Our Comprehensive Services
        </h2>
        <h3 className="text-center text-sm sm:text-base md:text-lg lg:text-xl font-light text-stone-300 max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-3xl leading-relaxed px-2">
          End-to-end AI-powered teleradiology solutions across all imaging
          modalities — enabling accurate, rapid, and accessible diagnostics for
          healthcare providers, anytime.
        </h3>
      </div>

      <div className="relative z-10 max-lg:mx-4 lg:mx-8 mb-14 grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-12">
        {/* X-Ray Reporting Card */}
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-2xl overflow-hidden hover:shadow-purple-500/20 hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 group">
          <div className="h-48 overflow-hidden relative">
            <img
              src="/xray.png"
              alt="X-ray image showing chest radiograph"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="absolute bottom-0 left-0 w-full p-6 flex items-center">
              <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full p-3 shadow-lg shadow-purple-500/30 mr-4 group-hover:shadow-purple-500/50 transition-all duration-300">
                <HiOutlineChip className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-white text-xl font-bold drop-shadow-lg">
                X-Ray Reporting
              </h2>
            </div>
          </div>

          {/* Enhanced glassmorphic content section */}
          <div className="backdrop-blur-lg bg-gradient-to-br from-white/15 to-white/5 p-6 border-t border-white/20">
            <h3 className="text-stone-200 font-medium leading-relaxed text-sm">
              Swift and accurate interpretation of routine and emergency X-rays,
              powered by AI and radiologist expertise - with a focus on clarity
              and clinical value.
            </h3>

            {/* Feature highlights */}
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-purple-500/20 border border-purple-400/30 rounded-full text-xs text-purple-200 backdrop-blur-sm">
                AI-Powered
              </span>
              <span className="px-3 py-1 bg-indigo-500/20 border border-indigo-400/30 rounded-full text-xs text-indigo-200 backdrop-blur-sm">
                24/7 Available
              </span>
            </div>
          </div>
        </div>

        {/* CT Scan Analysis Card */}
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-2xl overflow-hidden hover:shadow-blue-500/20 hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 group">
          <div className="h-48 overflow-hidden relative">
            <img
              src="/ct.png"
              alt="CT scan 3D rendering of brain"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="absolute bottom-0 left-0 w-full p-6 flex items-center">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full p-3 shadow-lg shadow-blue-500/30 mr-4 group-hover:shadow-blue-500/50 transition-all duration-300">
                <TbCube3dSphere className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-white text-xl font-bold drop-shadow-lg">
                CT Scan Analysis
              </h2>
            </div>
          </div>

          <div className="backdrop-blur-lg bg-gradient-to-br from-white/15 to-white/5 p-6 border-t border-white/20">
            <h3 className="text-stone-200 font-medium leading-relaxed text-sm">
              In-depth CT reporting with AI-assisted detection, 3D
              reconstruction, and rapid emergency turnaround, tailored for
              trauma, stroke, and critical cases.
            </h3>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-blue-500/20 border border-blue-400/30 rounded-full text-xs text-blue-200 backdrop-blur-sm">
                3D Analysis
              </span>
              <span className="px-3 py-1 bg-cyan-500/20 border border-cyan-400/30 rounded-full text-xs text-cyan-200 backdrop-blur-sm">
                Emergency Ready
              </span>
            </div>
          </div>
        </div>

        {/* MRI Interpretation Card */}
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-2xl overflow-hidden hover:shadow-pink-500/20 hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 group">
          <div className="h-48 overflow-hidden relative">
            <img
              src="/mri.png"
              alt="MRI scan of knee joint"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-pink-600/20 to-rose-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="absolute bottom-0 left-0 w-full p-6 flex items-center">
              <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-full p-3 shadow-lg shadow-pink-500/30 mr-4 group-hover:shadow-pink-500/50 transition-all duration-300">
                <LuScanText className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-white text-xl font-bold drop-shadow-lg">
                MRI Interpretation
              </h2>
            </div>
          </div>

          <div className="backdrop-blur-lg bg-gradient-to-br from-white/15 to-white/5 p-6 border-t border-white/20">
            <h3 className="text-stone-200 font-medium leading-relaxed text-sm">
              High-precision MRI analysis, with specialization in neurological
              and musculoskeletal studies, ensuring diagnostic depth and timely
              reporting.
            </h3>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-pink-500/20 border border-pink-400/30 rounded-full text-xs text-pink-200 backdrop-blur-sm">
                High Precision
              </span>
              <span className="px-3 py-1 bg-rose-500/20 border border-rose-400/30 rounded-full text-xs text-rose-200 backdrop-blur-sm">
                Specialized
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced CTA Button */}
      <div className="flex justify-center items-center pb-6 sm:pb-10 md:pb-14 mt-6 sm:mt-8 md:mt-12 relative z-10 px-4">
        <Link
          href="/signin"
          onClick={handleClick}
          className="group flex justify-center items-center bg-gradient-to-r from-purple-500 to-indigo-600 text-sm sm:text-base md:text-lg h-12 sm:h-13 md:h-14 text-white font-bold hover:from-purple-600 hover:to-indigo-700 shadow-xl shadow-purple-500/30 px-6 sm:px-8 md:px-12 rounded-full transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 w-full max-w-xs sm:max-w-sm md:max-w-none md:w-auto"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              <span className="text-center">
                <span className="block sm:hidden">Get Started</span>
                <span className="hidden sm:block">
                  Get Started with Our Services
                </span>
              </span>
              <span className="ml-2 sm:ml-3 group-hover:translate-x-1 transition-transform duration-200">
                <FaArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </span>
            </>
          )}
        </Link>
      </div>
    </div>
  );
}

export default Services;
