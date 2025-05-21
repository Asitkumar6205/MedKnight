import React from "react";
import { FaArrowRight, FaCheck } from "react-icons/fa6";
import { HiOutlineDatabase } from "react-icons/hi";
import { RiLock2Line } from "react-icons/ri";
import { TbDeviceDesktopAnalytics } from "react-icons/tb";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function Technology() {
  return (
    <div id="technology" className="lg:px-44 lg:-ml-4">
      <div className="p-14 flex flex-col justify-center items-center gap-4">
        <h2 className="pt-8 text-4xl font-bold text-stone-100 text-center">
          Advanced Technology Stack
        </h2>
        <h3 className="text-center text-xl font-light text-stone-400 lg:max-w-3xl">
          Empowering next-gen diagnostics with a robust, AI-driven
          infrastructure designed for precision, speed, and scalability in
          teleradiology.
        </h3>
      </div>
      <div className="max-lg:mx-4 lg:mx-14 mb-14 grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-8 relative">
        <div className="bg-stone-100 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
          <div className="h-48 overflow-hidden relative">
            <img
              src="/dicom-engine.png"
              alt="DICOM medical imaging visualization"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-stone-900/80"></div>
            <div className="absolute bottom-0 left-0 w-full p-4 flex items-center">
              <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full p-3 shadow-lg shadow-purple-500/20 mr-3">
                <HiOutlineDatabase className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-white text-xl font-bold">
                Intelligent DICOM Engine
              </h2>
            </div>
          </div>
          {/* Glassmorphic content section */}
          <div className="backdrop-blur-md bg-white/30 p-6 border border-white/20 shadow-inner">
            <h3 className="text-stone-700 font-medium leading-relaxed mb-2">
              Seamless handling of complex imaging data across all modalities
              with multi-format support, lossless compression, and secure
              transmission.
            </h3>
            <div className="flex flex-row gap-2 justify-start items-center">
              <span className="text-green-500">
                <FaCheck />
              </span>
              <span>Multi-format support</span>
            </div>
            <div className="flex flex-row gap-2 justify-start items-center">
              <span className="text-green-500">
                <FaCheck />
              </span>
              <span>Lossless compression</span>
            </div>
            <div className="flex flex-row gap-2 justify-start items-center">
              <span className="text-green-500">
                <FaCheck />
              </span>
              <span>Rapid processing</span>
            </div>
            <div className="flex flex-row gap-2 justify-start items-center">
              <span className="text-green-500">
                <FaCheck />
              </span>
              <span>Secure transmission & Storage</span>
            </div>
          </div>
        </div>

        <div className="bg-stone-100 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
          <div className="h-48 overflow-hidden relative">
            <img
              src="/ai-diagnostics.png"
              alt="AI-assisted medical diagnosis interface"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-stone-900/80"></div>
            <div className="absolute bottom-0 left-0 w-full p-4 flex items-center">
              <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full p-3 shadow-lg shadow-purple-500/20 mr-3">
                <TbDeviceDesktopAnalytics className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-white text-xl font-bold">
                AI-Driven Diagnostics
              </h2>
            </div>
          </div>
          <div className="p-6">
            <h3 className="text-stone-600 font-medium leading-relaxed mb-2">
              Amplify your diagnostic capabilities with MedKnight's embedded AI
              layer to supercharge efficiency, accuracy, and decision-making
              power.
            </h3>
            <div className="flex flex-row gap-2 justify-start items-center">
              <span className="text-green-500">
                <FaCheck />
              </span>
              <span>Smart triaging & prioritization</span>
            </div>
            <div className="flex flex-row gap-2 justify-start items-center">
              <span className="text-green-500">
                <FaCheck />
              </span>
              <span>Automated abnormality detection</span>
            </div>
            <div className="flex flex-row gap-2 justify-start items-center">
              <span className="text-green-500">
                <FaCheck />
              </span>
              <span>Continuous quality assurance</span>
            </div>
            <div className="flex flex-row gap-2 justify-start items-center">
              <span className="text-green-500">
                <FaCheck />
              </span>
              <span>Handling high volumes</span>
            </div>
          </div>
        </div>

        <div className="bg-stone-100 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
          <div className="h-48 overflow-hidden relative">
            <img
              src="/real-time-access.png"
              alt="Real-time collaborative medical platform"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-stone-900/80"></div>
            <div className="absolute bottom-0 left-0 w-full p-4 flex items-center">
              <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full p-3 shadow-lg shadow-purple-500/20 mr-3">
                <RiLock2Line className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-white text-xl font-bold">
                Real-time Accessibility
              </h2>
            </div>
          </div>
          <div className="p-6">
            <h3 className="text-stone-600 font-medium leading-relaxed mb-2">
              Built for modern teams, MedKnight ensures every stakeholder stays
              connected with real-time case syncing and secure, role-based
              access control.
            </h3>
            <div className="flex flex-row gap-2 justify-start items-center">
              <span className="text-green-500">
                <FaCheck />
              </span>
              <span>Real-time case syncing</span>
            </div>
            <div className="flex flex-row gap-2 justify-start items-center">
              <span className="text-green-500">
                <FaCheck />
              </span>
              <span>Web-based viewer with annotation</span>
            </div>
            <div className="flex flex-row gap-2 justify-start items-center">
              <span className="text-green-500">
                <FaCheck />
              </span>
              <span>24/7 infrastructure monitoring</span>
            </div>
            <div className="flex flex-row gap-2 justify-start items-center">
              <span className="text-green-500">
                <FaCheck />
              </span>
              <span>Role-based access control</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center">
        <Link href={"/signin"} className="flex justify-center items-center bg-gradient-to-r mb-14 from-purple-500 to-indigo-600 text-lg h-[50px] text-white font-bold hover:from-purple-600 hover:to-indigo-700 shadow-lg shadow-purple-500/20 px-10 rounded-full transition-all duration-300 transform hover:scale-105">
          Explore Our Technology
          <span className="ml-2">
            <FaArrowRight />
          </span>
        </Link>
      </div>
    </div>
  );
}

export default Technology;
