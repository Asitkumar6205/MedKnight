import React from "react";
import { AiOutlineLock } from "react-icons/ai";
import { FaCheck } from "react-icons/fa6";
import { HiOutlineDatabase } from "react-icons/hi";
import { RiLock2Line } from "react-icons/ri";
import { TbDeviceDesktopAnalytics } from "react-icons/tb";

function Technology() {
  return (
    <div id="technology" className="bg-white pb-16 lg:px-44 lg:-ml-4">
      <div className="p-14 flex flex-col justify-center items-center gap-4">
        <h2 className="text-center pt-8 text-4xl font-bold text-stone-800">
          Advanced Technology Stack
        </h2>
        <h3 className="text-center text-xl font-light text-stone-500 lg:max-w-3xl">
          Empowering next-gen diagnostics with a robust, AI-driven
          infrastructure designed for precision, speed, and scalability in
          teleradiology.
        </h3>
      </div>
      <div className="max-lg:mx-4 lg:mx-14 mb-10 grid lg:grid-cols-3 md:grid-cols-2 gap-8 relative">
        <div className="bg-stone-100 shadow-md p-8 rounded-lg flex flex-col gap-2">
          <HiOutlineDatabase className="p-2 rounded-md h-12 w-12 bg-purple-100 text-purple-400 mb-2" />
          <h2 className="text-stone-800 text-xl font-bold pb-2">
            DICOM Intelligence
          </h2>
          <h3 className="text-stone-500 pb-2">
            Advanced DICOM processing capabilities with support for all imaging
            modalities and formats.
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
        <div className="bg-stone-100 shadow-md p-8 rounded-lg flex flex-col gap-2">
          <RiLock2Line className="p-2 rounded-md h-12 w-12 bg-purple-100 text-purple-400 mb-2" />
          <h2 className="text-stone-800 text-xl font-bold pb-2">
            Enterprise-Grade Security
          </h2>
          <h3 className="text-stone-500 pb-2">
            Enterprise-grade security measures ensuring complete data protection
            and privacy.
          </h3>
          <div className="flex flex-row gap-2 justify-start items-center">
            <span className="text-green-500">
              <FaCheck />
            </span>
            <span>256-bit encryption</span>
          </div>
          <div className="flex flex-row gap-2 justify-start items-center">
            <span className="text-green-500">
              <FaCheck />
            </span>
            <span>Fully HIPAA & DICOM compliant</span>
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
            <span>Role-based access control & Audit trails</span>
          </div>
        </div>
        <div className="bg-stone-100 shadow-md p-8 rounded-lg flex flex-col gap-2">
          <TbDeviceDesktopAnalytics className="p-2 rounded-md h-12 w-12 bg-purple-100 text-purple-400 mb-2" />
          <h2 className="text-stone-800 text-xl font-bold pb-2">
            AI-Enhanced Diagnostics
          </h2>
          <h3 className="text-stone-500 pb-2">
            Integrated AI solutions to supercharge radiologist's efficiency,
            accuracy, and decision-making power.
          </h3>
          <div className="flex flex-row gap-2 justify-start items-center">
            <span className="text-green-500">
              <FaCheck />
            </span>
            <span>Smart prioritization</span>
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
    </div>
  );
}

export default Technology;
