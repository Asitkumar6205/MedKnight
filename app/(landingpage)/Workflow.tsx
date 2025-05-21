"use client";
import * as React from "react";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import { Button } from "@/components/ui/button";
import { FaArrowRight } from "react-icons/fa6";
import Link from "next/link"; 
import { useEffect } from "react";
import { useState } from "react";

function Workflow() {

    // Mouse parallax effect for the hero section
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  
    useEffect(() => {
      const handleMouseMove = (e: MouseEvent) => {
        // Get cursor exact position
        setCursorPosition({
          x: e.clientX,
          y: e.clientY,
        });
  
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
    // Effect to handle mouse movement parallax for glow
    useEffect(() => {
      const glowElement = document.querySelector('.glow-effect') as HTMLElement;
      if (glowElement) {
        glowElement.style.transform = `translate(-50%, -50%) translate(${mousePosition.x * 40}px, ${mousePosition.y * 40}px)`;
      }
    }, [mousePosition]);
  
  return (
    <div id="workflow">
      <div className="mt-4 pt-14 flex flex-col justify-center items-center gap-4">
        <h2 className="text-4xl font-bold text-stone-100 text-center">
          Our Streamlined Workflow
        </h2>
        <h3 className="text-center text-xl font-light text-stone-400 lg:max-w-3xl">
          Delivering a fast, secure, and intelligent diagnostic workflow -
          designed to optimize patient outcomes and accelerate clinical
          decision-making.
        </h3>
      </div>
      <Timeline position="alternate" className="my-8 lg:mx-40">
        <TimelineItem>
          <TimelineSeparator>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <div className="flex flex-row items-center gap-6">
              <div className="text-stone-100 bg-stone-800 rounded-md lg:max-w-md p-6 feature-card fade-in-up bg-gradient-to-br from-stone-800/80 to-stone-900/80 backdrop-blur-lg border border-white/5 shadow-lg group hover:shadow-purple-500/10 transition-all duration-500 hover:-translate-y-1 relative overflow-hidden">
                <h2 className="text-xl pb-2 font-bold bg-gradient-to-r from-purple-400 via-indigo-300 to-stone-200 bg-clip-text text-transparent">
                  Image Upload
                </h2>
                Secure upload of DICOM images via our encrypted cloud-based
                platform, ensuring HIPAA-compliant transmission and rapid
                accessibility.
              </div>
              <div className="timeline-marker flex justify-center items-center z-20 mx-8">
                <div className="h-12 w-12 text-stone-100 px-2 bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center text-lg font-bold shadow-lg shadow-purple-500/20 rounded-full glow-pulse">
                  1
                </div>
              </div>
            </div>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineSeparator>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <div className="flex flex-row justify-end items-center gap-6">
              <div className="timeline-marker flex justify-center items-center z-20 mx-8">
                <div className="h-12 w-12 text-stone-100 px-2 bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center text-lg font-bold shadow-lg shadow-purple-500/20 rounded-full glow-pulse">
                  2
                </div>
              </div>
              <div className="text-stone-100 bg-stone-800 rounded-md lg:max-w-md p-6 text-left feature-card fade-in-up bg-gradient-to-br from-stone-800/80 to-stone-900/80 backdrop-blur-lg border border-white/5 shadow-lg group hover:shadow-purple-500/10 transition-all duration-500 hover:-translate-y-1 relative overflow-hidden">
                <h2 className="text-xl pb-2 font-bold bg-gradient-to-r from-purple-400 via-indigo-300 to-stone-200 bg-clip-text text-transparent drop-shadow-lg">
                  Smart Case Assignment
                </h2>
                AI-powered triaging assigns each case to the most suitable
                radiologist based on subspecialty and urgency - prioritizing
                emergency and critical care cases.
              </div>
            </div>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineSeparator>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <div className="flex flex-row items-center gap-6">
              <div className="text-stone-100 bg-stone-800 rounded-md lg:max-w-md p-6 feature-card fade-in-up bg-gradient-to-br from-stone-800/80 to-stone-900/80 backdrop-blur-lg border border-white/5 shadow-lg group hover:shadow-purple-500/10 transition-all duration-500 hover:-translate-y-1 relative overflow-hidden">
                <h2 className="text-xl pb-2 font-bold bg-gradient-to-r from-purple-400 via-indigo-300 to-stone-200 bg-clip-text text-transparent drop-shadow-lg">
                  Diagnosis & Reporting
                </h2>
                Comprehensive analysis by expert radiologists, enhanced with AI
                decision support tools, ensuring precision and consistency in
                every report.
              </div>
              <div className="timeline-marker flex justify-center items-center z-20 mx-8">
                <div className="h-12 w-12 text-stone-100 px-2 bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center text-lg font-bold shadow-lg shadow-purple-500/20 rounded-full glow-pulse">
                  3
                </div>
              </div>
            </div>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineSeparator>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <div className="flex flex-row justify-end items-center gap-6">
              <div className="timeline-marker flex justify-center items-center z-20 mx-8">
                <div className="h-12 w-12 text-stone-100 px-2 bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center text-lg font-bold shadow-lg shadow-purple-500/20 rounded-full glow-pulse">
                  4
                </div>
              </div>
              <div className="text-stone-100 bg-stone-800 rounded-md lg:max-w-md p-6 text-left feature-card fade-in-up bg-gradient-to-br from-stone-800/80 to-stone-900/80 backdrop-blur-lg border border-white/5 shadow-lg group hover:shadow-purple-500/10 transition-all duration-500 hover:-translate-y-1 relative overflow-hidden">
                <h2 className="text-xl pb-2 font-bold bg-gradient-to-r from-purple-400 via-indigo-300 to-stone-200 bg-clip-text text-transparent drop-shadow-lg">
                  Quality Assurance
                </h2>
                Multi-layered peer review and QA protocols to maintain high
                diagnostic standards, minimize errors, and build provider trust.
              </div>
            </div>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineSeparator>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <div className="flex flex-row items-center gap-6">
              <div className="text-stone-100 bg-stone-800 rounded-md lg:max-w-md p-6 feature-card fade-in-up bg-gradient-to-br from-stone-800/80 to-stone-900/80 backdrop-blur-lg border border-white/5 shadow-lg group hover:shadow-purple-500/10 transition-all duration-500 hover:-translate-y-1 relative overflow-hidden">
                <h2 className="text-xl pb-2 font-bold bg-gradient-to-r from-purple-400 via-indigo-300 to-stone-200 bg-clip-text text-transparent drop-shadow-lg">
                  Instant Report Delivery
                </h2>
                Reports are delivered instantly through secure digital channels
                with real-time alerts to the referring clinicians and healthcare
                teams.
              </div>
              <div className="timeline-marker flex justify-center items-center z-20 mx-8">
                <div className="h-12 w-12 text-stone-100 px-2 bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center text-lg font-bold shadow-lg shadow-purple-500/20 rounded-full glow-pulse">
                  5
                </div>
              </div>
            </div>
          </TimelineContent>
        </TimelineItem>
      </Timeline>
      <div className="flex justify-center items-center">
        <Link href={"/signin"} className="flex justify-center items-center mb-14 mt-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-lg h-[50px] text-white font-bold hover:from-purple-600 hover:to-indigo-700 shadow-lg shadow-purple-500/20 px-10 rounded-full transition-all duration-300 transform hover:scale-105">
          Start Your Journey
          <span>
            <FaArrowRight className="ml-2"/>
          </span>
        </Link>
      </div>
           {/* CSS for animations */}
      <style jsx>{`
        /* Fade in animations */
        .fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
          

        /* Timeline item animations */
        .animate-timeline-item {
          animation: fadeIn 0.8s ease-out forwards;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        /* Glowing effect for timeline markers */
        .glow-pulse {
          animation: glowPulse 3s infinite;
          position: relative;
        }

        .glow-pulse::after {
          content: '';
          position: absolute;
          top: -5px;
          left: -5px;
          right: -5px;
          bottom: -5px;
          border-radius: 50%;
          background: linear-gradient(45deg, rgba(139, 92, 246, 0.5), rgba(79, 70, 229, 0.5));
          z-index: -1;
          opacity: 0;
          animation: pulse 3s infinite;
        }

        @keyframes glowPulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.4);
          }
          50% {
            box-shadow: 0 0 15px 2px rgba(139, 92, 246, 0.6);
          }
        }

        @keyframes pulse {
          0% {
            transform: scale(0.95);
            opacity: 0.7;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.3;
          }
          100% {
            transform: scale(0.95);
            opacity: 0.7;
          }
        }

        /* Timeline content slide animations */
        @media (min-width: 768px) {
          .timeline-item:nth-child(odd) .fade-slide-right {
            animation: slideInRight 0.8s ease-out forwards;
            animation-delay: 0.2s;
          }

          .timeline-item:nth-child(even) .fade-slide-left {
            animation: slideInLeft 0.8s ease-out forwards; 
            animation-delay: 0.2s;
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        /* Mobile timeline adjustments */
        @media (max-width: 767px) {
          .timeline-container .timeline-item {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }

          .timeline-container .timeline-marker {
            margin: 16px 0;
          }

          .timeline-container .timeline-content {
            width: 100%;
          }
        }

        /* Hover effect for CTA button */
        .cta-button:hover span {
          transform: translateX(4px);
        }
      `}</style>
    </div>
  );
}

export default Workflow;
