"use client";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  FaArrowRight,
  FaUpload,
  FaBrain,
  FaStethoscope,
  FaShieldAlt,
  FaPaperPlane,
} from "react-icons/fa";

function Workflow() {
  // Mouse parallax effect for the hero section
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate normalized position for parallax effects
      setMousePosition({
        x: e.clientX / window.innerWidth - 0.5,
        y: e.clientY / window.innerHeight - 0.5,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const workflowSteps = [
    {
      number: 1,
      title: "Image Upload",
      description:
        "Secure upload of DICOM images via our encrypted cloud-based platform, ensuring compliance transmission and rapid accessibility.",
      icon: FaUpload,
      gradient: "from-purple-500 to-indigo-600",
      borderGradient: "from-purple-600 to-indigo-600",
    },
    {
      number: 2,
      title: "Smart Case Assignment",
      description:
        "AI-powered triaging assigns each case to the most suitable radiologist based on subspeciality and urgency.",
      icon: FaBrain,
      gradient: "from-cyan-500 to-blue-600",
      borderGradient: "from-cyan-600 to-blue-600",
    },
    {
      number: 3,
      title: "Diagnosis & Reporting",
      description:
        "Comprehensive analysis by expert radiologists, enhanced with AI decision, ensuring precision and consistency in every report.",
      icon: FaStethoscope,
      gradient: "from-emerald-500 to-teal-600",
      borderGradient: "from-emerald-600 to-teal-600",
    },
    {
      number: 4,
      title: "Quality Assurance",
      description:
        "Multi-layered peer review and QA protocols to maintain high diagnostic standards, minimize errors, and build provider trust.",
      icon: FaShieldAlt,
      gradient: "from-orange-500 to-red-600",
      borderGradient: "from-orange-600 to-red-600",
    },
    {
      number: 5,
      title: "Instant Report Delivery",
      description:
        "Reports are delivered instantly through secure digital channels with real-time alerts to the referring clinicians and healthcare teams.",
      icon: FaPaperPlane,
      gradient: "from-pink-500 to-purple-600",
      borderGradient: "from-pink-600 to-purple-600",
    },
  ];

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
    <div id="workflow" className="relative overflow-hidden">
  {/* Background decorative elements */}
  <div
    className="absolute top-1/4 left-1/4 w-32 sm:w-48 md:w-64 h-32 sm:h-48 md:h-64 bg-purple-500/10 rounded-full blur-3xl"
    style={{
      transform: `translate(${mousePosition.x * 20}px, ${
        mousePosition.y * 20
      }px)`,
    }}
  />
  <div
    className="absolute bottom-1/4 right-1/4 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-cyan-500/10 rounded-full blur-3xl"
    style={{
      transform: `translate(${mousePosition.x * -30}px, ${
        mousePosition.y * -30
      }px)`,
    }}
  />

  <div className="mt-4 pt-8 sm:pt-10 md:pt-14 flex flex-col justify-center items-center gap-3 sm:gap-4 relative z-10 px-4">
    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent leading-tight">
      Our Streamlined Workflow
    </h2>
    <h3 className="text-center text-sm sm:text-base md:text-lg lg:text-xl font-light text-slate-300 max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-3xl px-2 leading-relaxed">
      Delivering a fast, secure, and intelligent diagnostic workflow -
      designed to optimize patient outcomes and accelerate clinical
      decision-making.
    </h3>
  </div>

  <div className="max-w-7xl mx-auto px-2 sm:px-4 py-8 sm:py-10 md:py-12">
    <div className="relative">
      {/* Central timeline line */}
      <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-purple-500 via-cyan-500 to-purple-500 opacity-30" />

      {workflowSteps.map((step, index) => {
        const isLeft = index % 2 === 0; // Step 1, 3, 5 on left; Step 2, 4 on right

        return (
          <div key={step.number} className="relative mb-8 sm:mb-12 md:mb-16">
            {/* Desktop Layout */}
            <div className="hidden lg:block">
              <div className="flex items-center relative">
                {/* Left side content */}
                <div className="w-1/2 pr-8">
                  {isLeft && (
                    <div className="group relative">
                      <div
                        className={`absolute -inset-0.5 bg-gradient-to-r ${step.borderGradient} rounded-lg blur opacity-20 group-hover:opacity-60 transition duration-500`}
                      />

                      <div className="relative bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 shadow-2xl px-6 xl:px-8 py-6 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2">
                        {/* Icon and title */}
                        <div className="flex items-center gap-3 xl:gap-4 mb-4">
                          <div
                            className={`p-2 xl:p-3 bg-gradient-to-r ${step.gradient} rounded-full shadow-lg flex-shrink-0`}
                          >
                            <step.icon className="h-5 w-5 xl:h-6 xl:w-6 text-white" />
                          </div>
                          <h3 className="text-lg xl:text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent leading-tight">
                            {step.title}
                          </h3>
                        </div>

                        {/* Description */}
                        <p className="text-slate-300 leading-relaxed text-sm xl:text-base">
                          {step.description}
                        </p>

                        {/* Decorative gradient line */}
                        <div
                          className={`mt-4 xl:mt-6 h-1 bg-gradient-to-r ${step.gradient} rounded-full opacity-50`}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Timeline marker - always centered */}
                <div className="absolute left-1/2 transform -translate-x-1/2 z-10">
                  <div className="group relative">
                    <div
                      className={`absolute -inset-2 bg-gradient-to-r ${step.borderGradient} rounded-full blur opacity-50 group-hover:opacity-100 transition duration-500`}
                    />
                    <div
                      className={`relative h-14 w-14 xl:h-16 xl:w-16 bg-gradient-to-r ${step.gradient} flex items-center justify-center rounded-full shadow-2xl border-2 border-white/20`}
                    >
                      <span className="text-white text-lg xl:text-xl font-bold">
                        {step.number}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right side content */}
                <div className="w-1/2 pl-8">
                  {!isLeft && (
                    <div className="group relative">
                      <div
                        className={`absolute -inset-0.5 bg-gradient-to-r ${step.borderGradient} rounded-lg blur opacity-20 group-hover:opacity-60 transition duration-500`}
                      />

                      <div className="relative bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 shadow-2xl px-6 xl:px-8 py-6 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2">
                        {/* Icon and title */}
                        <div className="flex items-center gap-3 xl:gap-4 mb-4 justify-end">
                          <h3 className="text-lg xl:text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent text-right leading-tight">
                            {step.title}
                          </h3>
                          <div
                            className={`p-2 xl:p-3 bg-gradient-to-r ${step.gradient} rounded-full shadow-lg flex-shrink-0`}
                          >
                            <step.icon className="h-5 w-5 xl:h-6 xl:w-6 text-white" />
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-slate-300 leading-relaxed text-right text-sm xl:text-base">
                          {step.description}
                        </p>

                        {/* Decorative gradient line */}
                        <div
                          className={`mt-4 xl:mt-6 h-1 bg-gradient-to-r ${step.gradient} rounded-full opacity-50 ml-auto`}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile and Tablet layout - single column */}
            <div className="lg:hidden">
              {/* Mobile timeline marker */}
              <div className="flex justify-center mb-3 sm:mb-4">
                <div className="group relative">
                  <div
                    className={`absolute -inset-1 sm:-inset-2 bg-gradient-to-r ${step.borderGradient} rounded-full blur opacity-50 group-hover:opacity-100 transition duration-500`}
                  />
                  <div
                    className={`relative h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 bg-gradient-to-r ${step.gradient} flex items-center justify-center rounded-full shadow-2xl border-2 border-white/20`}
                  >
                    <span className="text-white text-lg sm:text-xl font-bold">
                      {step.number}
                    </span>
                  </div>
                </div>
              </div>

              {/* Mobile content card */}
              <div className="mx-2 sm:mx-4">
                <div className="group relative">
                  <div
                    className={`absolute -inset-0.5 bg-gradient-to-r ${step.borderGradient} rounded-lg blur opacity-20 group-hover:opacity-60 transition duration-500`}
                  />

                  <div className="relative bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 shadow-2xl p-4 sm:p-6 md:p-8 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2">
                    {/* Icon and title */}
                    <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                      <div
                        className={`p-2 sm:p-3 bg-gradient-to-r ${step.gradient} rounded-full shadow-lg flex-shrink-0`}
                      >
                        <step.icon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
                      </div>
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent leading-tight">
                        {step.title}
                      </h3>
                    </div>

                    {/* Description */}
                    <p className="text-slate-300 leading-relaxed text-sm sm:text-base md:text-lg">
                      {step.description}
                    </p>

                    {/* Decorative gradient line */}
                    <div
                      className={`mt-4 sm:mt-6 h-1 bg-gradient-to-r ${step.gradient} rounded-full opacity-50`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </div>

  {/* Enhanced CTA Button - Responsive */}
  <div className="flex justify-center items-center pb-8 sm:pb-10 md:pb-14 -mt-6 sm:-mt-8 md:-mt-12 relative z-10 px-4">
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
            <span className="block sm:hidden">Start Journey</span>
            <span className="hidden sm:block">Start your Journey</span>
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

export default Workflow;
