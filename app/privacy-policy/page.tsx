'use client';

import React from 'react';
import Navbar from '../(landingpage)/Navbar';
import Link from 'next/link';

const PrivacyPolicy = () => {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen flex flex-col">
      {/* Background elements */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-400/20 rounded-full filter blur-3xl animate-blob"></div>
        <div className="absolute top-1/3 right-1/3 w-96 h-96 bg-blue-400/20 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-400/20 rounded-full filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Mesh gradient overlay */}
      <div className="fixed inset-0 bg-[url('/mesh-gradient-light.svg')] bg-cover opacity-30 z-0 mix-blend-overlay"></div>

      {/* Noise texture overlay */}
      <div className="fixed inset-0 bg-[url('/noise.png')] bg-repeat opacity-5 z-0"></div>
      
      {/* Main content */}
      <Navbar />
      
      <div className="relative z-10 flex-grow">
        <div className="max-w-4xl mx-auto py-32 px-4">
          <div className="bg-white/70 backdrop-blur-lg border border-gray-200 shadow-xl rounded-2xl p-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">🔐 Privacy Policy</h1>
            <p className="text-lg mb-2 text-gray-700"><strong>Effective Date:</strong> May 17, 2025</p>
            
            <p className="mb-6 text-gray-600">
              Welcome to <strong className="text-purple-600">MedKnight</strong> ("Company", "we", "our", or "us"). Your privacy is critically important to us. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our 
              website or use our services.
            </p>
            
            <p className="mb-6 text-gray-600">
              By accessing or using MedKnight's services, you agree to the collection and use of information in accordance 
              with this Privacy Policy.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-800">1. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold mb-2 text-purple-600">a. Personal Information</h3>
            <p className="mb-2 text-gray-600">We may collect personally identifiable information such as:</p>
            <ul className="list-disc ml-6 mb-4 text-gray-600">
              <li>Full name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Medical or diagnostic details (if submitted)</li>
              <li>Organization or healthcare facility details</li>
              <li>Payment or billing information</li>
            </ul>
            
            <h3 className="text-xl font-semibold mb-2 text-purple-600">b. Technical Information</h3>
            <p className="mb-2 text-gray-600">We automatically collect:</p>
            <ul className="list-disc ml-6 mb-4 text-gray-600">
              <li>IP address</li>
              <li>Device type and browser</li>
              <li>Operating system</li>
              <li>Usage data (pages visited, actions taken)</li>
            </ul>
            
            <h3 className="text-xl font-semibold mb-2 text-purple-600">c. DICOM and Medical Data</h3>
            <p className="mb-2 text-gray-600">If you upload DICOM images or patient information:</p>
            <ul className="list-disc ml-6 mb-6 text-gray-600">
              <li>All data is processed securely and is used only for diagnostic/reporting purposes</li>
              <li>We do <strong>not</strong> use patient data for advertising or profiling</li>
            </ul>
            
            <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-800">2. How We Use Your Information</h2>
            <p className="mb-2 text-gray-600">We may use your information to:</p>
            <ul className="list-disc ml-6 mb-6 text-gray-600">
              <li>Provide and manage our SaaS platform and services</li>
              <li>Improve platform functionality and user experience</li>
              <li>Facilitate communication between radiologists and healthcare providers</li>
              <li>Respond to customer support requests</li>
              <li>Ensure compliance with applicable laws and healthcare standards</li>
              <li>Send administrative messages or product updates</li>
            </ul>
            
            <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-800">3. Sharing and Disclosure</h2>
            <p className="mb-2 text-gray-600">We <strong>do not sell</strong> your personal data.</p>
            <p className="mb-2 text-gray-600">We may share data only with:</p>
            <ul className="list-disc ml-6 mb-4 text-gray-600">
              <li>Authorized radiologists and reporting professionals (only when required)</li>
              <li>Service providers assisting in hosting, analytics, or payment processing</li>
              <li>Legal authorities, if required by law</li>
            </ul>
            <p className="mb-6 text-gray-600">All third parties are bound by confidentiality agreements.</p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-800">4. Data Security</h2>
            <p className="mb-2 text-gray-600">We implement industry-standard security measures including:</p>
            <ul className="list-disc ml-6 mb-6 text-gray-600">
              <li>SSL encryption</li>
              <li>Role-based access control</li>
              {/* <li>HIPAA/GDPR-compliant storage where applicable</li>
              <li>Regular audits and security reviews</li> */}
            </ul>
            
            <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-800">5. Data Retention</h2>
            <p className="mb-2 text-gray-600">We retain your data only for as long as necessary for:</p>
            <ul className="list-disc ml-6 mb-4 text-gray-600">
              <li>Providing the services</li>
              <li>Legal and regulatory compliance</li>
              <li>Internal analytics</li>
            </ul>
            {/* <p className="mb-6 text-gray-600">You can request data deletion by contacting us at: <strong className="text-purple-600">support@medknight.in</strong></p> */}
            
            <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-800">6. Your Rights</h2>
            <p className="mb-2 text-gray-600">Depending on your location, you may have the right to:</p>
            <ul className="list-disc ml-6 mb-4 text-gray-600">
              <li>Access your personal data</li>
              <li>Request correction or deletion</li>
              <li>Object to or restrict processing</li>
              <li>Withdraw consent at any time</li>
            </ul>
            <p className="mb-6 text-gray-600">To exercise your rights, email: <strong className="text-purple-600 font-normal">support@medknight.in</strong></p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-800">7. Cookies and Tracking</h2>
            <p className="mb-2 text-gray-600">We use cookies to:</p>
            <ul className="list-disc ml-6 mb-4 text-gray-600">
              <li>Remember user sessions</li>
              <li>Track site performance</li>
              <li>Analyze user behavior (e.g., via Google Analytics)</li>
            </ul>
            {/* <p className="mb-6 text-gray-600">You can disable cookies in your browser settings.</p> */}
            
            <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-800">8. Changes to This Policy</h2>
            <p className="mb-6 text-gray-600">
              We may update this Privacy Policy from time to time. Any changes will be reflected with a new "Effective Date" 
              at the top of this page.
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
        
        html, body {
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