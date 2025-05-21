import Link from "next/link";
import React from "react";
import { FaArrowRight, FaCheck, FaUserDoctor } from "react-icons/fa6";

function Ourteam() {
  return (
    <div id="ourteam" className="lg:mx-40 lg:pr-4">
      <div className="p-14 flex flex-col justify-center items-center gap-4">
        <h2 className="pt-8 text-4xl font-bold text-center text-stone-100">
          Expert Radiologists Team
        </h2>
        <h3 className="text-center text-xl font-light text-stone-400 lg:max-w-3xl">
          At MedKnight, our dedicated team of certified radiologists brings
          global expertise and deep specialization across every imaging modality
          - ensuring accurate and timely diagnoses.
        </h3>
      </div>
      <div className="max-lg:mx-4 lg:mx-14 mb-10 grid lg:grid-cols-3 md:grid-cols-2 gap-8 relative">
        <div className="bg-stone-800 shadow-md p-8 rounded-lg flex flex-col gap-2">
          <div className="flex flex-col text-center items-center">
            <FaUserDoctor className="p-6 rounded-full h-20 w-20 bg-purple-900 text-purple-400 mb-2 bg-opacity-50" />
            <h2 className="text-stone-100 text-xl font-bold pb-1">
              Dr. ..... ........
            </h2>
            <h3 className="text-purple-400 pb-3 text-sm">
              Lead Neuroradiologist | AI-Enabled Neurological Diagnostics
            </h3>
          </div>

          <div className="flex flex-row gap-2 justify-start items-center">
            <span className="text-green-400">
              <FaCheck />
            </span>
            <span className="text-stone-100 font-light text-sm">
              15+ years of clinical and academic experience
            </span>
          </div>
          <div className="flex flex-row gap-2 justify-start items-center">
            <span className="text-green-400">
              <FaCheck />
            </span>
            <span className="text-stone-100 font-light text-sm">
              Board Certified in Neuroradiology
            </span>
          </div>
          <div className="flex flex-row gap-2 justify-start items-center">
            <span className="text-green-400">
              <FaCheck />
            </span>
            <span className="text-stone-100 font-light text-sm">
              Specialized in AI-assisted stroke and trauma diagnosis
            </span>
          </div>
        </div>
        <div className="bg-stone-800 shadow-md p-8 rounded-lg flex flex-col gap-2">
          <div className="flex flex-col text-center items-center">
            <FaUserDoctor className="p-6 rounded-full h-20 w-20 bg-purple-900 text-purple-400 mb-2 bg-opacity-50" />
            <h2 className="text-stone-100 text-xl font-bold pb-1">
              Dr. ..... ......
            </h2>
            <h3 className="text-purple-400 pb-3 text-sm">
              Musculoskeletal Imaging Expert | Orthopedic & Sports Injuries
            </h3>
          </div>
          <div className="flex flex-row gap-2 justify-start items-center">
            <span className="text-green-400">
              <FaCheck />
            </span>
            <span className="text-stone-100 font-light text-sm">
              12+ years of diagnostic excellence
            </span>
          </div>
          <div className="flex flex-row gap-2 justify-start items-center">
            <span className="text-green-400">
              <FaCheck />
            </span>
            <span className="text-stone-100 font-light text-sm">
              Fellowship in Musculoskeletal Imaging
            </span>
          </div>
          <div className="flex flex-row gap-2 justify-start items-center">
            <span className="text-green-400">
              <FaCheck />
            </span>
            <span className="text-stone-100 font-light text-sm">
              Expertise in dynamic joint analysis and trauma assessments
            </span>
          </div>
        </div>
        <div className="bg-stone-800 shadow-md p-8 rounded-lg flex flex-col gap-2">
          <div className="flex flex-col text-center items-center">
            <FaUserDoctor className="p-6 rounded-full h-20 w-20 bg-purple-900 text-purple-400 mb-2 bg-opacity-50" />
            <h2 className="text-stone-100 text-xl font-bold pb-1">
              Dr. ..... ....
            </h2>
            <h3 className="text-purple-400 pb-3 text-sm">
              Emergency Radiology Consultant | Rapid-Care Diagnostics
            </h3>
          </div>
          <div className="flex flex-row gap-2 justify-start items-center">
            <span className="text-green-400">
              <FaCheck />
            </span>
            <span className="text-stone-100 font-light text-sm">
              10+ years of frontline emergency radiology experience
            </span>
          </div>
          <div className="flex flex-row gap-2 justify-start items-center">
            <span className="text-green-400">
              <FaCheck />
            </span>
            <span className="text-stone-100 font-light text-sm">
              Certified in Emergency Radiology & Acute Imaging
            </span>
          </div>
          <div className="flex flex-row gap-2 justify-start items-center">
            <span className="text-green-400">
              <FaCheck />
            </span>
            <span className="text-stone-100 font-light text-sm">
              Focused on high-speed, life-critical case reporting
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-row max-sm:flex-col justify-between rounded-lg gap-4 max-lg:mx-4 mx-14 p-8 bg-stone-800">
        {/* <div className="bg-none">
          <h2 className="text-5xl font-bold text-center text-purple-400">
            XX+
          </h2>
          <h3 className="text-lg text-center text-stone-100">
            Expert Radiologists
          </h3>
        </div> */}
        <div className="bg-none">
          <h2 className="text-5xl font-bold text-center text-purple-400">
            24/7
          </h2>
          <h3 className="text-lg text-center text-stone-100">
            Real-Time Reporting
          </h3>
        </div>
        <div className="bg-none">
          <h2 className="text-5xl font-bold text-center text-purple-400">
            15+
          </h2>
          <h3 className="text-lg text-center text-stone-100">
            Specializations
          </h3>
        </div>
        <div className="bg-none">
          <h2 className="text-5xl font-bold text-center text-purple-400">
            99%
          </h2>
          <h3 className="text-lg text-center text-stone-100">
            Diagnostic Accuracy
          </h3>
        </div>
      </div>
      <div className="flex justify-center items-center mt-8">
        <Link href={"/signin"} className="mt-6 flex justify-center items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-lg h-[50px] text-white font-bold hover:from-purple-600 hover:to-indigo-700 shadow-lg shadow-purple-500/20 px-10 rounded-full transition-all duration-300 transform hover:scale-105">
          Work with Our Experts
          <span>
            <FaArrowRight />
          </span>
        </Link>
      </div>
    </div>
  );
}

export default Ourteam;
