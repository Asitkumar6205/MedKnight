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
              <Link href={"/#home"}>
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
              <FaInstagramSquare className="cursor-pointer h-8 w-8 hover:text-purple-500 text-pink-700" />
            </li>
            <li>
              <FaFacebook className="cursor-pointer h-8 w-8 hover:text-purple-500 text-sky-700" />
            </li>
            <li>
              <FaXTwitter className="cursor-pointer h-8 w-8 hover:text-purple-500 text-black" />
            </li>
            <li>
              <Link
                href={"https://www.linkedin.com/company/medknight/about/"}
                rel="noopener noreferrer"
                target="_blank"
              >
                <FaLinkedin className="cursor-pointer h-8 w-8 hover:text-purple-500 text-cyan-700 re" />
              </Link>
            </li>
          </ul>
        </div>
        <div className="bg-none p-8 rounded-lg shadow-md">
          <h2 className="text-stone-100 text-lg font-bold mb-2">Quick Links</h2>
          <ul>
            <li>
              <Link
                href={"/#services"}
                className="text-stone-500 hover:text-purple-500 "
              >
                Services
              </Link>
            </li>
            <li>
              <Link
                href={"/#workflow"}
                className="text-stone-500 hover:text-purple-500"
              >
                Workflow
              </Link>
            </li>
            <li>
              <Link
                href={"/#technology"}
                className="text-stone-500 hover:text-purple-500"
              >
                Technology
              </Link>
            </li>
            <li>
              <Link
                href={"/#ourteam"}
                className="text-stone-500 hover:text-purple-500"
              >
                Our Team
              </Link>
            </li>
            {/* <li>
              <Link href={"./"} className="text-stone-500 hover:text-purple-500">
                Testimonials
              </Link>
            </li> */}
          </ul>
        </div>
        <div className="bg-none p-8 rounded-lg shadow-md">
          <h2 className="text-stone-100 text-lg font-bold mb-2">
            Our Services
          </h2>
          <ul>
            <li>
              <Link
                href={"/#services"}
                className="text-stone-500 hover:text-purple-500"
              >
                X-Ray Reporting
              </Link>
            </li>
            <li>
              <Link
                href={"/#services"}
                className="text-stone-500 hover:text-purple-500"
              >
                CT Scan Analysis
              </Link>
            </li>
            <li>
              <Link
                href={"/#services"}
                className="text-stone-500 hover:text-purple-500"
              >
                MRI Interpretation
              </Link>
            </li>
            <li>
              <Link
                href={"/#services"}
                className="text-stone-500 hover:text-purple-500"
              >
                Ultrasound Reports
              </Link>
            </li>
          </ul>
        </div>
        <div className="bg-none p-8 rounded-lg shadow-md">
          <h2 className="text-stone-100 text-lg font-bold mb-2">Contact Us</h2>
          <ul className="flex flex-col gap-2">
            <li>
              <div className="flex flex-row gap-4 items-center">
                <FaPhoneAlt className="h-8 w-8 p-2 flex-none text-stone-100 bg-purple-400 rounded-lg" />
                <h2 className="text-stone-400 text-sm">
                  <span className="whitespace-nowrap">+91-6205400732</span>,{" "}
                  <span className="whitespace-nowrap">+91-8789573665</span>
                </h2>
              </div>
            </li>
            <li>
              <div className="flex flex-row gap-4 items-center">
                <MdOutlineMailOutline className="h-8 w-8 p-1 text-stone-100 bg-purple-400 rounded-lg flex-none" />
                <h2 className="text-stone-400 text-sm">contact@medknight.in</h2>
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
          © 2025 MedKnight Healthcare. All rights reserved.
        </div>
        <div className="flex flex-row gap-4">
          <Link
            href={"#"}
            className="text-stone-500 max-sm:text-xs hover:text-purple-500"
          >
            Privacy Policy
          </Link>
          <Link
            href={"#"}
            className="text-stone-500 max-sm:text-xs hover:text-purple-500"
          >
            Terms of Service
          </Link>
          <Link
            href={"#"}
            className="text-stone-500 max-sm:text-xs hover:text-purple-500"
          >
            Cookie Policy
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Footer;
