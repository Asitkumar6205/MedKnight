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
    <div id="technology" className="lg:px-24">
      <div className="p-14 flex flex-col justify-center items-center gap-4">
        <h2 className="pt-8 text-4xl font-bold text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Advanced Technology Stack
        </h2>
        <h3 className="text-center text-xl font-light text-slate-300 lg:max-w-3xl">
          Empowering next-gen diagnostics with a robust, AI-driven
          infrastructure designed for precision, speed, and scalability in
          teleradiology.
        </h3>
      </div>

      <div className="max-lg:mx-4 lg:mx-8 mb-14 grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-8 relative">
        {/* Card 1 - DICOM Engine */}
        <div className="group relative">
          {/* Animated border lighting */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-500"></div>

          <div className="relative bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 shadow-2xl overflow-hidden hover:shadow-purple-500/25 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2">
            <div className="h-48 overflow-hidden relative">
              <div className="w-full h-full bg-gradient-to-br from-purple-500/20 to-indigo-600/20 flex items-center justify-center">
                <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full p-8 shadow-2xl shadow-purple-500/50">
                  <HiOutlineDatabase className="h-16 w-16 text-white" />
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60"></div>
              <div className="absolute bottom-0 left-0 w-full p-6 flex items-center">
                <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full p-3 shadow-lg shadow-purple-500/50 mr-4">
                  <HiOutlineDatabase className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-white text-xl font-bold">
                  Intelligent DICOM Engine
                </h2>
              </div>
            </div>

            {/* Enhanced glassmorphic content section */}
            <div className="backdrop-blur-md bg-white/10 p-6 border-t border-white/10">
              <h3 className="text-slate-200 font-medium leading-relaxed mb-4">
                Seamless handling of complex imaging data across all modalities
                with multi-format support, lossless compression, and secure
                transmission.
              </h3>
              <div className="space-y-3">
                {[
                  "Multi-format support",
                  "Lossless compression",
                  "Rapid processing",
                  "Secure transmission & Storage",
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="flex flex-row gap-3 justify-start items-center group/item"
                  >
                    <div className="bg-gradient-to-r from-green-400 to-emerald-500 rounded-full p-1 shadow-lg shadow-green-400/30">
                      <FaCheck className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-slate-300 group-hover/item:text-white transition-colors duration-200">
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
            <div className="h-48 overflow-hidden relative">
              <div className="w-full h-full bg-gradient-to-br from-cyan-500/20 to-pink-600/20 flex items-center justify-center">
                <div className="bg-gradient-to-r from-cyan-500 to-pink-600 rounded-full p-8 shadow-2xl shadow-cyan-500/50">
                  <TbDeviceDesktopAnalytics className="h-16 w-16 text-white" />
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60"></div>
              <div className="absolute bottom-0 left-0 w-full p-6 flex items-center">
                <div className="bg-gradient-to-r from-cyan-500 to-pink-600 rounded-full p-3 shadow-lg shadow-cyan-500/50 mr-4">
                  <TbDeviceDesktopAnalytics className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-white text-xl font-bold">
                  AI-Driven Diagnostics
                </h2>
              </div>
            </div>

            <div className="backdrop-blur-md bg-white/10 p-6 border-t border-white/10">
              <h3 className="text-slate-200 font-medium leading-relaxed mb-4">
                Amplify your diagnostic capabilities with MedKnight's embedded
                AI layer to supercharge efficiency, accuracy, and
                decision-making power.
              </h3>
              <div className="space-y-3">
                {[
                  "Smart triaging & prioritization",
                  "Automated abnormality detection",
                  "Continuous quality assurance",
                  "Handling high volumes",
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="flex flex-row gap-3 justify-start items-center group/item"
                  >
                    <div className="bg-gradient-to-r from-green-400 to-emerald-500 rounded-full p-1 shadow-lg shadow-green-400/30">
                      <FaCheck className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-slate-300 group-hover/item:text-white transition-colors duration-200">
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
            <div className="h-48 overflow-hidden relative">
              <div className="w-full h-full bg-gradient-to-br from-pink-500/20 to-purple-600/20 flex items-center justify-center">
                <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-full p-8 shadow-2xl shadow-pink-500/50">
                  <RiLock2Line className="h-16 w-16 text-white" />
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60"></div>
              <div className="absolute bottom-0 left-0 w-full p-6 flex items-center">
                <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-full p-3 shadow-lg shadow-pink-500/50 mr-4">
                  <RiLock2Line className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-white text-xl font-bold">
                  Real-time Accessibility
                </h2>
              </div>
            </div>

            <div className="backdrop-blur-md bg-white/10 p-6 border-t border-white/10">
              <h3 className="text-slate-200 font-medium leading-relaxed mb-4">
                Built for modern teams, ensuring every stakeholder stays
                connected with real-time case syncing and secure role-based
                access control.
              </h3>
              <div className="space-y-3">
                {[
                  "Real-time case syncing",
                  "Web-based viewer with annotation",
                  "24/7 infrastructure monitoring",
                  "Role-based access control",
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="flex flex-row gap-3 justify-start items-center group/item"
                  >
                    <div className="bg-gradient-to-r from-green-400 to-emerald-500 rounded-full p-1 shadow-lg shadow-green-400/30">
                      <FaCheck className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-slate-300 group-hover/item:text-white transition-colors duration-200">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced CTA Button */}
      <div className="flex justify-center items-center pb-14 mt-12 relative z-10">
        <Link
          href="/signin"
          onClick={handleClick}
          className="group flex justify-center items-center bg-gradient-to-r from-purple-500 to-indigo-600 text-lg h-14 text-white font-bold hover:from-purple-600 hover:to-indigo-700 shadow-xl shadow-purple-500/30 px-12 rounded-full transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={24} />
          ) : (
            <>
              Explore Our Technology
              <span className="ml-3 group-hover:translate-x-1 transition-transform duration-200">
                <FaArrowRight />
              </span>
            </>
          )}
        </Link>
      </div>
    </div>
  );
}

export default Technology;
