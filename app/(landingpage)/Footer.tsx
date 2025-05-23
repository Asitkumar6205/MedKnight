import Link from "next/link";
import React from "react";
import { FaInstagramSquare, FaPhoneAlt } from "react-icons/fa";
import { FaFacebook, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { MdOutlineMailOutline } from "react-icons/md";

function Footer() {
  return (
    <div className="lg:mx-40">
      <div className="max-lg:mx-4 lg:mx-14 grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 bg-none">
        <div className="bg-none pl-0 pt-8 pb-8 pr-8 rounded-lg shadow-md flex flex-col gap-4">
          <div className="cursor-pointer">
            <h2 className="text-stone-100 text-2xl font-bold bg-none">
              <Link href={"/#home"} className="transition-all duration-300 transform hover:scale-105">
                <span>Med</span>
                <span className="bg-gradient-to-r from-purple-500 to-stone-700 bg-clip-text text-transparent">
                  Knight
                </span>
              </Link>
            </h2>
            <h3 className="text-stone-500 font-medium">
              Fast, Accurate, 24/7 Diagnostic Reporting
            </h3>
          </div>
                   <ul className="flex gap-2">
            <li>
              <div className="cursor-pointer rounded-md transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20">
                <FaInstagramSquare className="h-8 w-8 text-pink-700 hover:text-purple-500" />
              </div>
            </li>
            <li>
              <div className="cursor-pointer rounded-md transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20">
                <FaFacebook className="h-8 w-8 text-sky-700 hover:text-indigo-600" />
              </div>
            </li>
            <li>
              <div className="cursor-pointer rounded-md transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20">
                <FaXTwitter className="h-8 w-8 text-black hover:text-purple-500" />
              </div>
            </li>
            <li>
              <Link
                href={"https://www.linkedin.com/company/medknight/about/"}
                rel="noopener noreferrer"
                target="_blank"
                className="cursor-pointer rounded-md transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20"
              >
                <FaLinkedin className="h-8 w-8 text-cyan-700 hover:text-indigo-600" />
              </Link>
            </li>
          </ul>
        </div>
        <div className="bg-none p-8 rounded-lg shadow-md">
          <h2 className="text-stone-100 text-lg font-bold mb-2">Quick Links</h2>
          <ul className="flex flex-col gap-1">
            <li>
              <Link
                href={"/#services"}
                className="text-stone-500 hover:bg-gradient-to-r hover:from-purple-500 hover:to-indigo-600 hover:text-transparent hover:bg-clip-text transition-all duration-300 transform hover:scale-105 inline-block"
              >
                Services
              </Link>
            </li>
            <li>
              <Link
                href={"/#workflow"}
                className="text-stone-500 hover:bg-gradient-to-r hover:from-purple-500 hover:to-indigo-600 hover:text-transparent hover:bg-clip-text transition-all duration-300 transform hover:scale-105 inline-block"
              >
                Workflow
              </Link>
            </li>
            <li>
              <Link
                href={"/#technology"}
                className="text-stone-500 hover:bg-gradient-to-r hover:from-purple-500 hover:to-indigo-600 hover:text-transparent hover:bg-clip-text transition-all duration-300 transform hover:scale-105 inline-block"
              >
                Technology
              </Link>
            </li>
            <li>
              <Link
                href={"/#ourteam"}
                className="text-stone-500 hover:bg-gradient-to-r hover:from-purple-500 hover:to-indigo-600 hover:text-transparent hover:bg-clip-text transition-all duration-300 transform hover:scale-105 inline-block"
              >
                Our Team
              </Link>
            </li>
            {/* <li>
              <Link href={"./"} className="text-stone-500 hover:bg-gradient-to-r hover:from-purple-500 hover:to-indigo-600 hover:text-transparent hover:bg-clip-text transition-all duration-300 transform hover:scale-105 inline-block">
                Testimonials
              </Link>
            </li> */}
          </ul>
        </div>
        <div className="bg-none p-8 rounded-lg shadow-md">
          <h2 className="text-stone-100 text-lg font-bold mb-2">
            Our Services
          </h2>
          <ul className="flex flex-col gap-1">
            <li>
              <Link
                href={"/#services"}
                className="text-stone-500 hover:bg-gradient-to-r hover:from-purple-500 hover:to-indigo-600 hover:text-transparent hover:bg-clip-text transition-all duration-300 transform hover:scale-105 inline-block"
              >
                X-Ray Reporting
              </Link>
            </li>
            <li>
              <Link
                href={"/#services"}
                className="text-stone-500 hover:bg-gradient-to-r hover:from-purple-500 hover:to-indigo-600 hover:text-transparent hover:bg-clip-text transition-all duration-300 transform hover:scale-105 inline-block"
              >
                CT Scan Analysis
              </Link>
            </li>
            <li>
              <Link
                href={"/#services"}
                className="text-stone-500 hover:bg-gradient-to-r hover:from-purple-500 hover:to-indigo-600 hover:text-transparent hover:bg-clip-text transition-all duration-300 transform hover:scale-105 inline-block"
              >
                MRI Interpretation
              </Link>
            </li>
            {/* <li>
              <Link
                href={"/#services"}
                className="text-stone-500 hover:bg-gradient-to-r hover:from-purple-500 hover:to-indigo-600 hover:text-transparent hover:bg-clip-text transition-all duration-300 transform hover:scale-105 inline-block"
              >
                Ultrasound Reports
              </Link>
            </li> */}
          </ul>
        </div>
        <div className="bg-none p-8 rounded-lg shadow-md">
          <h2 className="text-stone-100 text-lg font-bold mb-2">Contact Us</h2>
          <ul className="flex flex-col gap-6">
            <li>
              <div className="flex flex-row gap-5 items-center">
                <div className="h-12 w-12 px-4 bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center text-lg font-bold hover:from-purple-600 hover:to-indigo-700 shadow-lg shadow-purple-500/20 rounded-full transition-all duration-300 transform hover:scale-105">
                  <FaPhoneAlt className="h-4 w-4 text-stone-100" />
                </div>
                <div>
                  <p className="text-stone-500 text-sm mb-1">Call us at</p>
                  <h3 className="text-stone-300">
                    <span className="whitespace-nowrap">+91-6205400732</span>,{" "}
                    <span className="whitespace-nowrap">+91-8789573665</span>
                  </h3>
                </div>
              </div>
            </li>
            <li>
              <div className="flex flex-row gap-5 items-center">
                <div className="h-12 w-12 px-3 bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center text-lg font-bold hover:from-purple-600 hover:to-indigo-700 shadow-lg shadow-purple-500/20 rounded-full transition-all duration-300 transform hover:scale-105">
                  <MdOutlineMailOutline className="h-6 w-6 text-stone-100" />
                </div>
                <div>
                  <p className="text-stone-500 text-sm mb-1">Email us at</p>
                  <h3 className="text-stone-300">
                    contact@medknight.in
                  </h3>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div className="lg:mx-14 md:mx-7 max-md:mx-4 sm-lg:4 max-sm:mx-4">
        <div className="w-full h-[1px] rounded-lg bg-stone-700"></div>
      </div>
      <div className="my-7 mx-14 py-4 flex flex-row justify-between ">
        <div className="text-stone-500 max-sm:text-xs">
          © 2025 MedKnight. All rights reserved.
        </div>
        <div className="flex flex-row gap-4">
          <Link
            href={"/privacy-policy"}
            className="text-stone-500 max-sm:text-xs hover:bg-gradient-to-r hover:from-purple-500 hover:to-indigo-600 hover:text-transparent hover:bg-clip-text transition-all duration-300 transform hover:scale-105 inline-block"
          >
            Privacy Policy
          </Link>
          <Link
            href={"/terms-of-service"}
            className="text-stone-500 max-sm:text-xs hover:bg-gradient-to-r hover:from-purple-500 hover:to-indigo-600 hover:text-transparent hover:bg-clip-text transition-all duration-300 transform hover:scale-105 inline-block"
          >
            Terms of Service
          </Link>
          <Link
            href={"/cookies-policy"}
            className="text-stone-500 max-sm:text-xs hover:bg-gradient-to-r hover:from-purple-500 hover:to-indigo-600 hover:text-transparent hover:bg-clip-text transition-all duration-300 transform hover:scale-105 inline-block"
          >
            Cookies Policy
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Footer;