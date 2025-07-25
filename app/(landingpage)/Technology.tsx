"use client";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaArrowRight, FaCheck } from "react-icons/fa6";
import { HiOutlineDatabase } from "react-icons/hi";
import { RiLock2Line } from "react-icons/ri";
import { TbDeviceDesktopAnalytics } from "react-icons/tb";

function Technology() {
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
    <div id="technology" className="px-4 sm:px-6 md:px-12 lg:px-24">
      <div className="p-4 sm:p-6 md:p-10 lg:p-14 flex flex-col justify-center items-center gap-3 sm:gap-4">
        <h2 className="pt-4 sm:pt-6 md:pt-8 text-2xl sm:text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight">
          Advanced Technology Stack
        </h2>
        <h3 className="text-center text-sm sm:text-base md:text-lg lg:text-xl font-light text-slate-300 max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-3xl px-2 leading-relaxed">
          Empowering next-gen diagnostics with a robust, AI-driven
          infrastructure designed for precision, speed, and scalability in
          teleradiology.
        </h3>
      </div>

      <div className="mx-2 sm:mx-4 lg:mx-8 mb-8 sm:mb-10 md:mb-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 relative">
        {/* Card 1 - DICOM Engine */}
        <div className="group relative">
          {/* Animated border lighting */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-500"></div>

          <div className="relative bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 shadow-2xl overflow-hidden hover:shadow-purple-500/25 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2">
            <div className="h-36 sm:h-40 md:h-48 overflow-hidden relative">
              <div className="w-full h-full bg-gradient-to-br from-purple-500/20 to-indigo-600/20 flex items-center justify-center">
                <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full p-4 sm:p-6 md:p-8 shadow-2xl shadow-purple-500/50">
                  <HiOutlineDatabase className="h-8 w-8 sm:h-12 sm:w-12 md:h-16 md:w-16 text-white" />
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60"></div>
              <div className="absolute bottom-0 left-0 w-full p-3 sm:p-4 md:p-6 flex items-center">
                <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full p-2 sm:p-2.5 md:p-3 shadow-lg shadow-purple-500/50 mr-2 sm:mr-3 md:mr-4 flex-shrink-0">
                  <HiOutlineDatabase className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
                </div>
                <h2 className="text-white text-sm sm:text-base md:text-lg lg:text-xl font-bold leading-tight">
                  Intelligent DICOM Engine
                </h2>
              </div>
            </div>

            {/* Enhanced glassmorphic content section */}
            <div className="backdrop-blur-md bg-white/10 p-4 sm:p-5 md:p-6 border-t border-white/10">
              <h3 className="text-slate-200 font-medium leading-relaxed mb-3 sm:mb-4 text-xs sm:text-sm md:text-base">
                Seamless handling of complex imaging data across all modalities
                with multi-format support, lossless compression, and secure
                transmission.
              </h3>
              <div className="space-y-2 sm:space-y-3">
                {[
                  "Multi-format support",
                  "Lossless compression",
                  "Rapid processing",
                  "Secure transmission & Storage",
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="flex flex-row gap-2 sm:gap-3 justify-start items-center group/item"
                  >
                    <div className="bg-gradient-to-r from-green-400 to-emerald-500 rounded-full p-0.5 sm:p-1 shadow-lg shadow-green-400/30 flex-shrink-0">
                      <FaCheck className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                    </div>
                    <span className="text-slate-300 group-hover/item:text-white transition-colors duration-200 text-xs sm:text-sm md:text-base">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Card 2 - AI Diagnostics */}
        <div className="group relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-600 to-pink-600 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-500"></div>

          <div className="relative bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 shadow-2xl overflow-hidden hover:shadow-cyan-500/25 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2">
            <div className="h-36 sm:h-40 md:h-48 overflow-hidden relative">
              <div className="w-full h-full bg-gradient-to-br from-cyan-500/20 to-pink-600/20 flex items-center justify-center">
                <div className="bg-gradient-to-r from-cyan-500 to-pink-600 rounded-full p-4 sm:p-6 md:p-8 shadow-2xl shadow-cyan-500/50">
                  <TbDeviceDesktopAnalytics className="h-8 w-8 sm:h-12 sm:w-12 md:h-16 md:w-16 text-white" />
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60"></div>
              <div className="absolute bottom-0 left-0 w-full p-3 sm:p-4 md:p-6 flex items-center">
                <div className="bg-gradient-to-r from-cyan-500 to-pink-600 rounded-full p-2 sm:p-2.5 md:p-3 shadow-lg shadow-cyan-500/50 mr-2 sm:mr-3 md:mr-4 flex-shrink-0">
                  <TbDeviceDesktopAnalytics className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
                </div>
                <h2 className="text-white text-sm sm:text-base md:text-lg lg:text-xl font-bold leading-tight">
                  AI-Driven Diagnostics
                </h2>
              </div>
            </div>

            <div className="backdrop-blur-md bg-white/10 p-4 sm:p-5 md:p-6 border-t border-white/10">
              <h3 className="text-slate-200 font-medium leading-relaxed mb-3 sm:mb-4 text-xs sm:text-sm md:text-base">
                Amplify your diagnostic capabilities with MedKnight's embedded
                AI layer to supercharge efficiency, accuracy, and
                decision-making power.
              </h3>
              <div className="space-y-2 sm:space-y-3">
                {[
                  "Smart triaging & prioritization",
                  "Automated abnormality detection",
                  "Continuous quality assurance",
                  "Handling high volumes",
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="flex flex-row gap-2 sm:gap-3 justify-start items-center group/item"
                  >
                    <div className="bg-gradient-to-r from-green-400 to-emerald-500 rounded-full p-0.5 sm:p-1 shadow-lg shadow-green-400/30 flex-shrink-0">
                      <FaCheck className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                    </div>
                    <span className="text-slate-300 group-hover/item:text-white transition-colors duration-200 text-xs sm:text-sm md:text-base">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Card 3 - Real-time Access */}
        <div className="group relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-500"></div>

          <div className="relative bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 shadow-2xl overflow-hidden hover:shadow-pink-500/25 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2">
            <div className="h-36 sm:h-40 md:h-48 overflow-hidden relative">
              <div className="w-full h-full bg-gradient-to-br from-pink-500/20 to-purple-600/20 flex items-center justify-center">
                <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-full p-4 sm:p-6 md:p-8 shadow-2xl shadow-pink-500/50">
                  <RiLock2Line className="h-8 w-8 sm:h-12 sm:w-12 md:h-16 md:w-16 text-white" />
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60"></div>
              <div className="absolute bottom-0 left-0 w-full p-3 sm:p-4 md:p-6 flex items-center">
                <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-full p-2 sm:p-2.5 md:p-3 shadow-lg shadow-pink-500/50 mr-2 sm:mr-3 md:mr-4 flex-shrink-0">
                  <RiLock2Line className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
                </div>
                <h2 className="text-white text-sm sm:text-base md:text-lg lg:text-xl font-bold leading-tight">
                  Real-time Accessibility
                </h2>
              </div>
            </div>

            <div className="backdrop-blur-md bg-white/10 p-4 sm:p-5 md:p-6 border-t border-white/10">
              <h3 className="text-slate-200 font-medium leading-relaxed mb-3 sm:mb-4 text-xs sm:text-sm md:text-base">
                Built for modern teams, ensuring every stakeholder stays
                connected with real-time case syncing and secure role-based
                access control.
              </h3>
              <div className="space-y-2 sm:space-y-3">
                {[
                  "Real-time case syncing",
                  "Web-based viewer with annotation",
                  "24/7 infrastructure monitoring",
                  "Role-based access control",
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="flex flex-row gap-2 sm:gap-3 justify-start items-center group/item"
                  >
                    <div className="bg-gradient-to-r from-green-400 to-emerald-500 rounded-full p-0.5 sm:p-1 shadow-lg shadow-green-400/30 flex-shrink-0">
                      <FaCheck className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                    </div>
                    <span className="text-slate-300 group-hover/item:text-white transition-colors duration-200 text-xs sm:text-sm md:text-base">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced CTA Button - Responsive */}
      <div className="flex justify-center items-center pb-8 sm:pb-10 md:pb-14 mt-6 sm:mt-8 md:mt-12 relative z-10 px-4">
        <Link
          href="/signup"
          onClick={handleClick}
          className="group flex justify-center items-center bg-gradient-to-r from-purple-500 to-indigo-600 text-sm sm:text-base md:text-lg h-12 sm:h-13 md:h-14 text-white font-bold hover:from-purple-600 hover:to-indigo-700 shadow-xl shadow-purple-500/30 px-6 sm:px-8 md:px-12 rounded-full transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 w-full max-w-xs sm:max-w-sm md:max-w-none md:w-auto"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              <span className="text-center">
                <span className="block sm:hidden">Explore Tech</span>
                <span className="hidden sm:block">Explore Our Technology</span>
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

export default Technology;
