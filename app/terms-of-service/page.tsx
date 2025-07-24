"use client";

import React from "react";
import Navbar from "../(landingpage)/Navbar";
import Link from "next/link";

const TermsOfService = () => {
  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden min-h-screen flex flex-col">
      {/* Main content */}
      <Navbar />

      <div className="relative z-10 flex-grow">
        <div className="max-w-4xl mx-auto py-32 px-4">
          <div className="p-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-100">
              📄 Terms of Service
            </h1>
            <p className="text-lg mb-2 text-gray-200">
              <strong>Effective Date:</strong> May 18, 2025
            </p>

            <p className="mb-6 text-gray-300">
              Welcome to
              <span className="bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">
                <strong> MedKnight</strong>
              </span>
              ! These Terms of Service ("<strong>Terms</strong>") govern your
              access to and use of our website, platform, services, and
              applications (collectively, the "<strong>Service</strong>"). By
              using MedKnight, you agree to be bound by these Terms.
            </p>

            <p className="mb-6 text-gray-300">
              If you do not agree, please do not use our Service.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-100">
              1. Who We Are
            </h2>
            <p className="mb-3 text-gray-300">
              <span className="bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">
                <strong>MedKnight </strong>
              </span>
              is a healthcare SaaS platform that provides AI-enhanced radiology
              reporting and diagnostic workflow support to hospitals, diagnostic
              centers, and healthcare providers.
            </p>
            <ul className="list-disc ml-6 mb-6 text-gray-300">
              <li className="mb-2">
                <span className="bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">
                  <strong>Business Type: </strong>
                </span>
                Proprietorship
              </li>
              <li className="mb-2">
                <span className="bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">
                  <strong>Registered in: </strong>
                </span>
                India
              </li>
              <li className="mb-2">
                <span className="bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">
                  <strong>GST No.: </strong>
                </span>
                20JZOPK1181E1ZH
              </li>
              <li className="mb-2">
                <span className="bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">
                  <strong>Contact: </strong>
                </span>
                contact@medknight.in
              </li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-100">
              2. Eligibility
            </h2>
            <p className="mb-3 text-gray-300">
              By using MedKnight, you confirm that:
            </p>
            <ul className="list-disc ml-6 mb-6 text-gray-300">
              <li className="mb-2">You are at least 18 years old.</li>
              <li className="mb-2">
                You have the authority to enter into these Terms (on behalf of
                your organization, if applicable).
              </li>
              <li className="mb-2">
                You are not barred from using our services under applicable
                laws.
              </li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-100">
              3. User Accounts
            </h2>
            <p className="mb-3 text-gray-300">
              To access certain features, you may need to create an account. You
              agree to:
            </p>
            <ul className="list-disc ml-6 mb-4 text-gray-300">
              <li className="mb-2">
                Provide accurate and complete information.
              </li>
              <li className="mb-2">Keep your login credentials secure.</li>
              <li className="mb-2">
                Notify us immediately of any unauthorized use of your account.
              </li>
            </ul>
            <p className="mb-6 text-gray-300">
              We are not responsible for any loss or damage from your failure to
              safeguard your account.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-100">
              4. Use of Services
            </h2>
            <p className="mb-3 text-gray-300">You agree to use MedKnight:</p>
            <ul className="list-disc ml-6 mb-4 text-gray-300">
              <li className="mb-2">Only for lawful purposes.</li>
              <li className="mb-2">
                In accordance with all applicable regulations (e.g., medical
                data privacy laws).
              </li>
              <li className="mb-2">
                Without engaging in unauthorized access, data scraping, or
                platform abuse.
              </li>
            </ul>
            <p className="mb-3 text-gray-300">
              You may not use the Service for:
            </p>
            <ul className="list-disc ml-6 mb-6 text-gray-300">
              <li className="mb-2">Sending malicious files or viruses.</li>
              <li className="mb-2">Violating intellectual property rights.</li>
              <li className="mb-2">
                Reselling or sublicensing MedKnight without permission.
              </li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-100">
              5. Intellectual Property
            </h2>
            <p className="mb-3 text-gray-300">
              All content, branding, software, and features on MedKnight are
              owned by or licensed to MedKnight and protected by applicable
              intellectual property laws.
            </p>
            <p className="mb-6 text-gray-300">
              You are granted a limited, non-transferable, revocable license to
              use our platform. You may not copy, modify, or distribute any part
              of the Service without prior written permission.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-100">
              6. Privacy
            </h2>
            <p className="mb-3 text-gray-300">
              Your use of the Service is also governed by our{" "}
              <Link
                href="/privacy-policy"
                className="bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent hover:underline"
              >
                Privacy Policy
              </Link>
              , which describes how we collect, use, and store your data.
            </p>
            <p className="mb-6 text-gray-300">
              For more information, refer to our Privacy and Cookie Policies.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-100">
              7. Payment & Subscription
            </h2>
            <p className="mb-3 text-gray-300">
              If applicable, paid plans will be clearly indicated before
              purchase. You agree to:
            </p>
            <ul className="list-disc ml-6 mb-4 text-gray-300">
              <li className="mb-2">Pay fees on time.</li>
              <li className="mb-2">
                Authorize us to charge your selected payment method.
              </li>
              <li className="mb-2">
                Understand that failure to pay may result in suspension of
                service.
              </li>
            </ul>
            <p className="mb-6 text-gray-300">
              Prices are exclusive of applicable taxes unless stated otherwise.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-100">
              8. Service Availability & Changes
            </h2>
            <p className="mb-3 text-gray-300">
              We strive to maintain high availability but do not guarantee
              uninterrupted access. We reserve the right to:
            </p>
            <ul className="list-disc ml-6 mb-6 text-gray-300">
              <li className="mb-2">
                Modify or discontinue features with or without notice.
              </li>
              <li className="mb-2">
                Apply updates and patches to the Service.
              </li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-100">
              9. Termination
            </h2>
            <p className="mb-3 text-gray-300">
              We may suspend or terminate your access to MedKnight:
            </p>
            <ul className="list-disc ml-6 mb-4 text-gray-300">
              <li className="mb-2">For violation of these Terms.</li>
              <li className="mb-2">If required by law.</li>
              <li className="mb-2">Upon your request.</li>
            </ul>
            <p className="mb-6 text-gray-300">
              Termination may result in loss of access to your data unless
              otherwise agreed.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-100">
              10. Limitation of Liability
            </h2>
            <p className="mb-3 text-gray-300">
              To the maximum extent permitted by law, MedKnight and its
              representatives will not be liable for:
            </p>
            <ul className="list-disc ml-6 mb-4 text-gray-300">
              <li className="mb-2">
                Indirect, incidental, or consequential damages.
              </li>
              <li className="mb-2">Loss of data, profits, or goodwill.</li>
              <li className="mb-2">Platform downtime or errors.</li>
            </ul>
            <p className="mb-6 text-gray-300">
              Our total liability in any case will not exceed the amount paid by
              you in the last 6 months (if applicable).
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-100">
              11. Changes to Terms
            </h2>
            <p className="mb-6 text-gray-300">
              We may update these Terms from time to time. Continued use of the
              Service after changes implies acceptance of the updated Terms. You
              are encouraged to review them periodically.
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

export default TermsOfService;
