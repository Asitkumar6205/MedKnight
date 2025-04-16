import * as React from "react";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import { Button } from "@/components/ui/button";
import { FaArrowRight } from "react-icons/fa6";

function Workflow() {
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
              <div className="text-stone-100 bg-stone-800 rounded-md lg:max-w-md p-6">
                <h2 className="text-xl pb-2 font-bold text-purple-400">
                  Image Upload
                </h2>
                Secure upload of DICOM images via our encrypted cloud-based
                platform, ensuring HIPAA-compliant transmission and rapid
                accessibility.
              </div>
              <div className="flex justify-center items-center">
                <h2 className="bg-purple-400 h-12 w-12 flex justify-center items-center font-bold text-lg text-stone-100 px-2 rounded-full">
                  1
                </h2>
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
              <div className="flex justify-center items-center">
                <h2 className="bg-purple-400 h-12 w-12 flex justify-center items-center font-bold text-lg text-stone-100 px-2 rounded-full">
                  2
                </h2>
              </div>
              <div className="text-stone-100 bg-stone-800 rounded-md lg:max-w-md p-6 text-left">
                <h2 className="text-xl pb-2 font-bold text-purple-400">
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
              <div className="text-stone-100 bg-stone-800 rounded-md lg:max-w-md p-6">
                <h2 className="text-xl pb-2 font-bold text-purple-400">
                  Diagnosis & Reporting
                </h2>
                Comprehensive analysis by expert radiologists, enhanced with AI
                decision support tools, ensuring precision and consistency in
                every report.
              </div>
              <div className="flex justify-center items-center">
                <h2 className="bg-purple-400 h-12 w-12 flex justify-center items-center font-bold text-lg text-stone-100 px-2 rounded-full">
                  3
                </h2>
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
              <div className="flex justify-center items-center">
                <h2 className="bg-purple-400 h-12 w-12 flex justify-center items-center font-bold text-lg text-stone-100 px-2 rounded-full">
                  4
                </h2>
              </div>
              <div className="text-stone-100 bg-stone-800 rounded-md lg:max-w-md p-6 text-left">
                <h2 className="text-xl pb-2 font-bold text-purple-400">
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
              <div className="text-stone-100 bg-stone-800 rounded-md lg:max-w-md p-6">
                <h2 className="text-xl pb-2 font-bold text-purple-400">
                  Instant Report Delivery
                </h2>
                Reports are delivered instantly through secure digital channels
                with real-time alerts to the referring clinicians and healthcare
                teams.
              </div>
              <div className="flex justify-center items-center">
                <h2 className="bg-purple-400 h-12 w-12 flex justify-center items-center font-bold text-lg text-stone-100 px-2 rounded-full">
                  5
                </h2>
              </div>
            </div>
          </TimelineContent>
        </TimelineItem>
      </Timeline>
      <div className="flex justify-center items-center">
        <Button className="mb-14 bg-purple-400 text-stone-700 text-md h-[52px] lg:px-9 font-bold hover:bg-purple-400">
          Start Your Journey
          <span>
            <FaArrowRight />
          </span>
        </Button>
      </div>
    </div>
  );
}

export default Workflow;
