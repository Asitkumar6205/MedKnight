"use client";
import Link from "next/link";
import React, { useState } from "react";
import {
  FaArrowRight,
  FaRupeeSign,
  FaClock,
  FaChartLine,
  FaCheckCircle,
} from "react-icons/fa";
import SuccessStories from "./SucessStories";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

function RadiologistPartnership() {
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
    <div id="partnership" className="px-4 sm:px-6 md:px-12 lg:px-24">
      <div className="p-4 sm:p-6 md:p-10 lg:p-14 flex flex-col justify-center items-center gap-3 sm:gap-4">
        <h2 className="pt-4 sm:pt-6 md:pt-8 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center text-stone-100 leading-tight">
          Earn More. Work Flexibly. Advance Your Career.
        </h2>
        <h3 className="text-center text-sm sm:text-base md:text-lg lg:text-xl font-light text-stone-400 max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-3xl px-2 leading-relaxed">
          Join India's fastest-growing teleradiology network and unlock your
          earning potential. Connect with leading hospitals while building your
          independent practice on your own terms.
        </h3>
      </div>

      {/* Value Proposition Cards */}
      <div className="mx-2 sm:mx-4 lg:mx-10 mb-6 sm:mb-8 md:mb-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 relative">
        {/* Card 1: Maximize Income */}
        <div className="relative group bg-gradient-to-br from-green-600/40 via-green-600/20 to-green-800/40 backdrop-blur-xl border border-green-500/20 shadow-2xl p-4 sm:p-6 md:p-8 rounded-2xl flex flex-col gap-3 sm:gap-4 transition-all duration-500 transform hover:scale-105 hover:border-green-400/40 hover:shadow-[0_0_30px_rgba(34,197,94,0.3)] before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-r before:from-green-500/10 before:to-emerald-500/10 before:opacity-0 before:transition-opacity before:duration-500 hover:before:opacity-100">
          <div className="relative z-10 flex flex-col text-center items-center">
            <div className="relative">
              <FaRupeeSign className="p-3 sm:p-4 md:p-6 rounded-full h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20 bg-gradient-to-br from-green-500/30 to-emerald-600/30 text-green-400 mb-3 sm:mb-4 backdrop-blur-sm border border-green-400/20 shadow-lg shadow-green-500/20" />
              <div className="absolute inset-0 rounded-full bg-green-400/10 blur-xl animate-pulse"></div>
            </div>
            <h2 className="text-stone-100 text-lg sm:text-xl font-bold pb-1 sm:pb-2 drop-shadow-lg leading-tight">
              Maximize Your Income
            </h2>
            <h3 className="text-green-400 pb-3 sm:pb-4 text-xs sm:text-sm font-medium drop-shadow-md">
              Flexible Earnings on Your Schedule
            </h3>
          </div>

          <div className="relative z-10 space-y-2 sm:space-y-3 md:space-y-4">
            <div className="flex flex-row gap-2 sm:gap-3 justify-start items-start">
              <span className="text-green-400 drop-shadow-lg mt-0.5 flex-shrink-0">
                <FaCheckCircle className="text-xs sm:text-sm" />
              </span>
              <span className="text-stone-100 font-light text-xs sm:text-sm drop-shadow-md leading-relaxed">
                Multiple revenue streams: Emergency, second opinions
              </span>
            </div>
            <div className="flex flex-row gap-2 sm:gap-3 justify-start items-start">
              <span className="text-green-400 drop-shadow-lg mt-0.5 flex-shrink-0">
                <FaCheckCircle className="text-xs sm:text-sm" />
              </span>
              <span className="text-stone-100 font-light text-xs sm:text-sm drop-shadow-md leading-relaxed">
                Weekly payouts directly to your account
              </span>
            </div>
            <div className="flex flex-row gap-2 sm:gap-3 justify-start items-start">
              <span className="text-green-400 drop-shadow-lg mt-0.5 flex-shrink-0">
                <FaCheckCircle className="text-xs sm:text-sm" />
              </span>
              <span className="text-stone-100 font-light text-xs sm:text-sm drop-shadow-md leading-relaxed">
                Work evenings, weekends, or between shifts
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Work Flexibility */}
        <div className="relative group bg-gradient-to-br from-blue-800/40 via-blue-800/20 to-blue-900/40 backdrop-blur-xl border border-blue-500/20 shadow-2xl p-4 sm:p-6 md:p-8 rounded-2xl flex flex-col gap-3 sm:gap-4 transition-all duration-500 transform hover:scale-105 hover:border-blue-400/40 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-r before:from-blue-500/10 before:to-cyan-500/10 before:opacity-0 before:transition-opacity before:duration-500 hover:before:opacity-100">
          <div className="relative z-10 flex flex-col text-center items-center">
            <div className="relative">
              <FaClock className="p-3 sm:p-4 md:p-6 rounded-full h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20 bg-gradient-to-br from-blue-500/30 to-cyan-600/30 text-blue-400 mb-3 sm:mb-4 backdrop-blur-sm border border-blue-400/20 shadow-lg shadow-blue-500/20" />
              <div className="absolute inset-0 rounded-full bg-blue-400/10 blur-xl animate-pulse"></div>
            </div>
            <h2 className="text-stone-100 text-lg sm:text-xl font-bold pb-1 sm:pb-2 drop-shadow-lg leading-tight">
              Work on Your Terms
            </h2>
            <h3 className="text-blue-400 pb-3 sm:pb-4 text-xs sm:text-sm font-medium drop-shadow-md">
              Complete Flexibility & Control
            </h3>
          </div>

          <div className="relative z-10 space-y-2 sm:space-y-3 md:space-y-4">
            <div className="flex flex-row gap-2 sm:gap-3 justify-start items-start">
              <span className="text-green-400 drop-shadow-lg mt-0.5 flex-shrink-0">
                <FaCheckCircle className="text-xs sm:text-sm" />
              </span>
              <span className="text-stone-100 font-light text-xs sm:text-sm drop-shadow-md leading-relaxed">
                24/7 case availability - choose your hours
              </span>
            </div>
            <div className="flex flex-row gap-2 sm:gap-3 justify-start items-start">
              <span className="text-green-400 drop-shadow-lg mt-0.5 flex-shrink-0">
                <FaCheckCircle className="text-xs sm:text-sm" />
              </span>
              <span className="text-stone-100 font-light text-xs sm:text-sm drop-shadow-md leading-relaxed">
                Remote reporting from anywhere with secure access
              </span>
            </div>
            <div className="flex flex-row gap-2 sm:gap-3 justify-start items-start">
              <span className="text-green-400 drop-shadow-lg mt-0.5 flex-shrink-0">
                <FaCheckCircle className="text-xs sm:text-sm" />
              </span>
              <span className="text-stone-100 font-light text-xs sm:text-sm drop-shadow-md leading-relaxed">
                No minimum commitments or quotas
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Career Growth */}
        <div className="relative group bg-gradient-to-br from-purple-700/40 via-purple-700/20 to-purple-800/40 backdrop-blur-xl border border-purple-500/20 shadow-2xl p-4 sm:p-6 md:p-8 rounded-2xl flex flex-col gap-3 sm:gap-4 transition-all duration-500 transform hover:scale-105 hover:border-purple-400/40 hover:shadow-[0_0_30px_rgba(147,51,234,0.3)] before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-r before:from-purple-500/10 before:to-pink-500/10 before:opacity-0 before:transition-opacity before:duration-500 hover:before:opacity-100">
          <div className="relative z-10 flex flex-col text-center items-center">
            <div className="relative">
              <FaChartLine className="p-3 sm:p-4 md:p-6 rounded-full h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20 bg-gradient-to-br from-purple-500/30 to-pink-600/30 text-purple-400 mb-3 sm:mb-4 backdrop-blur-sm border border-purple-400/20 shadow-lg shadow-purple-500/20" />
              <div className="absolute inset-0 rounded-full bg-purple-400/10 blur-xl animate-pulse"></div>
            </div>
            <h2 className="text-stone-100 text-lg sm:text-xl font-bold pb-1 sm:pb-2 drop-shadow-lg leading-tight">
              Accelerate Your Career
            </h2>
            <h3 className="text-purple-400 pb-3 sm:pb-4 text-xs sm:text-sm font-medium drop-shadow-md">
              Professional Growth & Recognition
            </h3>
          </div>

          <div className="relative z-10 space-y-2 sm:space-y-3 md:space-y-4">
            <div className="flex flex-row gap-2 sm:gap-3 justify-start items-start">
              <span className="text-green-400 drop-shadow-lg mt-0.5 flex-shrink-0">
                <FaCheckCircle className="text-xs sm:text-sm" />
              </span>
              <span className="text-stone-100 font-light text-xs sm:text-sm drop-shadow-md leading-relaxed">
                Diverse cases from tier-1 hospitals nationwide
              </span>
            </div>
            <div className="flex flex-row gap-2 sm:gap-3 justify-start items-start">
              <span className="text-green-400 drop-shadow-lg mt-0.5 flex-shrink-0">
                <FaCheckCircle className="text-xs sm:text-sm" />
              </span>
              <span className="text-stone-100 font-light text-xs sm:text-sm drop-shadow-md leading-relaxed">
                Connect with leading radiologists and institutions
              </span>
            </div>
            <div className="flex flex-row gap-2 sm:gap-3 justify-start items-start">
              <span className="text-green-400 drop-shadow-lg mt-0.5 flex-shrink-0">
                <FaCheckCircle className="text-xs sm:text-sm" />
              </span>
              <span className="text-stone-100 font-light text-xs sm:text-sm drop-shadow-md leading-relaxed">
                Build reputation through our quality rating system
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Success Stories Section */}
      <SuccessStories />

      {/* Call to Action */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 mt-8 sm:mt-10 md:mt-12 px-4">
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
                <span className="block sm:hidden">Start Earning</span>
                <span className="hidden sm:block">Start Earning Today</span>
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

export default RadiologistPartnership;

{
  /* Statistics Bar */
}
{
  /* <div className="flex flex-row max-sm:flex-col justify-between rounded-2xl gap-4 max-lg:mx-4 mx-14 p-8 bg-gradient-to-r from-stone-800/40 via-stone-800/30 to-stone-800/40 backdrop-blur-xl border border-stone-600/20 shadow-2xl relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-purple-500/5 before:via-blue-500/5 before:to-green-500/5 before:opacity-50">
  <div className="relative z-10 bg-none text-center">
    <h2 className="text-5xl font-bold text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg">
      ₹50L+
    </h2>
    <h3 className="text-lg text-center text-stone-100 drop-shadow-md">
      Average Annual Earnings
    </h3>
    <p className="text-xs text-stone-400 mt-1">for Active Partners</p>
  </div>
  <div className="relative z-10 bg-none text-center">
    <h2 className="text-5xl font-bold text-center bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-lg">
      15min
    </h2>
    <h3 className="text-lg text-center text-stone-100 drop-shadow-md">
      Average Turnaround
    </h3>
    <p className="text-xs text-stone-400 mt-1">Report Delivery Time</p>
  </div>
  <div className="relative z-10 bg-none text-center">
    <h2 className="text-5xl font-bold text-center bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent drop-shadow-lg">
      200+
    </h2>
    <h3 className="text-lg text-center text-stone-100 drop-shadow-md">
      Partner Hospitals
    </h3>
    <p className="text-xs text-stone-400 mt-1">Nationwide Network</p>
  </div>
  <div className="relative z-10 bg-none text-center">
    <h2 className="text-5xl font-bold text-center bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent drop-shadow-lg">
      98%
    </h2>
    <h3 className="text-lg text-center text-stone-100 drop-shadow-md">
      Satisfaction Rate
    </h3>
    <p className="text-xs text-stone-400 mt-1">Radiologist Partners</p>
  </div>
</div> */
}

{
  /* Success Stories Section */
}
<SuccessStories />;
{
  /* <div className="max-lg:mx-4 lg:mx-14 mt-12 mb-8">
  <h3 className="text-2xl font-bold text-center text-stone-100 mb-8">
    What Our Partners Say
  </h3>
  <div className="grid md:grid-cols-2 gap-6">
    <div className="relative bg-gradient-to-br from-stone-800/30 via-stone-800/20 to-stone-900/30 backdrop-blur-xl p-6 rounded-2xl border border-stone-600/20 shadow-2xl hover:border-purple-400/30 transition-all duration-300 hover:shadow-[0_0_20px_rgba(147,51,234,0.2)]">
      <div className="flex items-center mb-4">
        <FaUserMd className="text-purple-400 text-2xl mr-3 drop-shadow-lg" />
        <div>
          <h4 className="text-stone-100 font-semibold drop-shadow-md">Dr. Sarah M.</h4>
          <p className="text-stone-400 text-sm">Neuroradiologist, Mumbai</p>
        </div>
      </div>
      <p className="text-stone-300 italic drop-shadow-sm">
        "MedKnight doubled my monthly income while maintaining my hospital position. 
        The flexibility to work evenings has been game-changing for my work-life balance."
      </p>
      <div className="flex text-yellow-400 mt-3 drop-shadow-lg">
        {[...Array(5)].map((_, i) => (
          <FaStar key={i} className="text-sm" />
        ))}
      </div>
    </div>
    
    <div className="relative bg-gradient-to-br from-stone-800/30 via-stone-800/20 to-stone-900/30 backdrop-blur-xl p-6 rounded-2xl border border-stone-600/20 shadow-2xl hover:border-purple-400/30 transition-all duration-300 hover:shadow-[0_0_20px_rgba(147,51,234,0.2)]">
      <div className="flex items-center mb-4">
        <FaUserMd className="text-purple-400 text-2xl mr-3 drop-shadow-lg" />
        <div>
          <h4 className="text-stone-100 font-semibold drop-shadow-md">Dr. Raj K.</h4>
          <p className="text-stone-400 text-sm">Radiologist, Delhi</p>
        </div>
      </div>
      <p className="text-stone-300 italic drop-shadow-sm">
        "The diverse case exposure and advanced tools have significantly enhanced my diagnostic skills. 
        Plus, the additional income supports my family's goals."
      </p>
      <div className="flex text-yellow-400 mt-3 drop-shadow-lg">
        {[...Array(5)].map((_, i) => (
          <FaStar key={i} className="text-sm" />
        ))}
      </div>
    </div>
  </div>
</div> */
}
