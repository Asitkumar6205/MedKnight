"use client";

import React from "react";
import Navbar from "../(landingpage)/Navbar";
import Link from "next/link";

const PrivacyPolicy = () => {
  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden min-h-screen flex flex-col">
      {/* Main content */}
      <Navbar />

      <div className="relative z-10 flex-grow">
        <div className="max-w-4xl mx-auto py-32 px-4">
          <div className="p-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-100">
              🔐 Privacy Policy
            </h1>
            <p className="text-lg mb-2 text-gray-200">
              <strong>Effective Date:</strong> May 17, 2025
            </p>

            <p className="mb-6 text-gray-300">
              Welcome to
              <span className="bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">
                <strong> MedKnight</strong>
              </span>
              ("Company", "we", "our", or "us"). Your privacy is critically
              important to us. This Privacy Policy explains how we collect, use,
              disclose, and safeguard your information when you visit our
              website or use our services.
            </p>

            <p className="mb-6 text-gray-300">
              By accessing or using MedKnight's services, you agree to the
              collection and use of information in accordance with this Privacy
              Policy.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-100">
              1. Information We Collect
            </h2>

            <h3 className="text-xl font-semibold mb-2">
              <span className="bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">
                a. Personal Information
              </span>
            </h3>
            <p className="mb-2 text-gray-300">
              We may collect personally identifiable information such as:
            </p>
            <ul className="list-disc ml-6 mb-4 text-gray-300">
              <li className="mb-2">Full name</li>
              <li className="mb-2">Email address</li>
              <li className="mb-2">Phone number</li>
              <li className="mb-2">
                Medical or diagnostic details (if submitted)
              </li>
              <li className="mb-2">
                Organization or healthcare facility details
              </li>
              <li className="mb-2">Payment or billing information</li>
            </ul>

            <h3 className="text-xl font-semibold mb-2">
              <span className="bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">
                b. Technical Information
              </span>
            </h3>
            <p className="mb-2 text-gray-300">We automatically collect:</p>
            <ul className="list-disc ml-6 mb-4 text-gray-300">
              <li className="mb-2">IP address</li>
              <li className="mb-2">Device type and browser</li>
              <li className="mb-2">Operating system</li>
              <li className="mb-2">
                Usage data (pages visited, actions taken)
              </li>
            </ul>

            <h3 className="text-xl font-semibold mb-2">
              <span className="bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">
                c. DICOM and Medical Data
              </span>
            </h3>
            <p className="mb-2 text-gray-300">
              If you upload DICOM images or patient information:
            </p>
            <ul className="list-disc ml-6 mb-6 text-gray-300">
              <li className="mb-2">
                All data is processed securely and is used only for
                diagnostic/reporting purposes
              </li>
              <li className="mb-2">
                We do <strong>not</strong> use patient data for advertising or
                profiling
              </li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-100">
              2. How We Use Your Information
            </h2>
            <p className="mb-3 text-gray-300">
              We may use your information to:
            </p>
            <ul className="list-disc ml-6 mb-6 text-gray-300">
              <li className="mb-2">
                Provide and manage our SaaS platform and services
              </li>
              <li className="mb-2">
                Improve platform functionality and user experience
              </li>
              <li className="mb-2">
                Facilitate communication between radiologists and healthcare
                providers
              </li>
              <li className="mb-2">Respond to customer support requests</li>
              <li className="mb-2">
                Ensure compliance with applicable laws and healthcare standards
              </li>
              <li className="mb-2">
                Send administrative messages or product updates
              </li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-100">
              3. Sharing and Disclosure
            </h2>
            <p className="mb-2 text-gray-300">
              We <strong>do not sell</strong> your personal data.
            </p>
            <p className="mb-2 text-gray-300">We may share data only with:</p>
            <ul className="list-disc ml-6 mb-4 text-gray-300">
              <li className="mb-2">
                Authorized radiologists and reporting professionals (only when
                required)
              </li>
              <li className="mb-2">
                Service providers assisting in hosting, analytics, or payment
                processing
              </li>
              <li className="mb-2">Legal authorities, if required by law</li>
            </ul>
            <p className="mb-6 text-gray-300">
              All third parties are bound by confidentiality agreements.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-100">
              4. Data Security
            </h2>
            <p className="mb-2 text-gray-300">
              We implement industry-standard security measures including:
            </p>
            <ul className="list-disc ml-6 mb-6 text-gray-300">
              <li className="mb-2">SSL encryption</li>
              <li className="mb-2">Role-based access control</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-100">
              5. Data Retention
            </h2>
            <p className="mb-2 text-gray-300">
              We retain your data only for as long as necessary for:
            </p>
            <ul className="list-disc ml-6 mb-6 text-gray-300">
              <li className="mb-2">Providing the services</li>
              <li className="mb-2">Legal and regulatory compliance</li>
              <li className="mb-2">Internal analytics</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-100">
              6. Your Rights
            </h2>
            <p className="mb-2 text-gray-300">
              Depending on your location, you may have the right to:
            </p>
            <ul className="list-disc ml-6 mb-4 text-gray-300">
              <li className="mb-2">Access your personal data</li>
              <li className="mb-2">Request correction or deletion</li>
              <li className="mb-2">Object to or restrict processing</li>
              <li className="mb-2">Withdraw consent at any time</li>
            </ul>
            <p className="mb-6 text-gray-300">
              To exercise your rights, email:
              <span className="bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">
                <strong> support@medknight.in</strong>
              </span>
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-100">
              7. Cookies and Tracking
            </h2>
            <p className="mb-2 text-gray-300">We use cookies to:</p>
            <ul className="list-disc ml-6 mb-6 text-gray-300">
              <li className="mb-2">Remember user sessions</li>
              <li className="mb-2">Track site performance</li>
              <li className="mb-2">
                Analyze user behavior (e.g., via Google Analytics)
              </li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-100">
              8. Changes to This Policy
            </h2>
            <p className="mb-6 text-gray-300">
              We may update this Privacy Policy from time to time. Any changes
              will be reflected with a new "Effective Date" at the top of this
              page.
            </p>
          </div>
        </div>
      </div>

      {/* Footer section */}
      <div className="relative z-10 mt-auto">
        {/* Divider line */}
        <div className="mx-4 md:mx-7 lg:mx-14">
          <div className="w-full h-[1px] rounded-lg bg-gray-300"></div>
        </div>

        {/* Footer content */}
        <div className="py-6 px-4 md:px-8 lg:px-16 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-500 max-sm:text-xs mb-4 md:mb-0">
            © 2025 MedKnight. All rights reserved.
          </div>
          <div className="flex flex-row gap-4">
            <Link
              href={"/privacy-policy"}
              className="text-gray-500 max-sm:text-xs hover:text-purple-500 transition-colors duration-200"
            >
              Privacy Policy
            </Link>
            <Link
              href={"/terms-of-service"}
              className="text-gray-500 max-sm:text-xs hover:text-purple-500 transition-colors duration-200"
            >
              Terms of Service
            </Link>
            <Link
              href={"/cookies-policy"}
              className="text-gray-500 max-sm:text-xs hover:text-purple-500 transition-colors duration-200"
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>

      {/* Add required styles */}
      <style jsx global>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }

        .animate-blob {
          animation: blob 15s infinite alternate;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        html,
        body {
          background: white;
          min-height: 100vh;
          margin: 0;
          padding: 0;
        }
      `}</style>
    </div>
  );
};

export default PrivacyPolicy;
