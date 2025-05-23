'use client';

import React from 'react';
import Navbar from '../(landingpage)/Navbar';
import Link from 'next/link';

const CookiePolicy = () => {
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
            <h1 className="text-3xl font-bold mb-6 text-gray-800">🍪 Cookies Policy</h1>
            <p className="text-lg mb-2 text-gray-700"><strong>Effective Date:</strong> May 18, 2025</p>
            
            <p className="mb-6 text-gray-600">
              At <strong className="text-purple-600">MedKnight</strong>, we use cookies and similar technologies to enhance your browsing experience, 
              analyze site traffic, personalize content, and serve targeted services. This Cookie Policy explains how and why 
              cookies are used on our platform and your choices regarding their usage.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-800">1. What Are Cookies?</h2>
            <p className="mb-6 text-gray-600">
              Cookies are small text files stored on your browser or device by websites you visit. They help us recognize you, 
              remember your preferences, and improve your experience on our platform.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-800">2. Why We Use Cookies</h2>
            <p className="mb-3 text-gray-600">We use cookies for several purposes, including:</p>
            <ul className="list-disc ml-6 mb-6 text-gray-600">
              <li className="mb-2"><strong className="text-purple-600">Essential Cookies</strong> – Necessary for the operation of our site (e.g., login, session handling, security).</li>
              <li className="mb-2"><strong className="text-purple-600">Performance Cookies</strong> – Help us analyze how visitors interact with the site (e.g., Google Analytics).</li>
              <li className="mb-2"><strong className="text-purple-600">Functionality Cookies</strong> – Remember your preferences (e.g., language or region).</li>
              {/* <li className="mb-2"><strong className="text-purple-600">Marketing Cookies</strong> – Help us deliver relevant advertisements or track marketing campaigns (if applicable in the future).</li> */}
            </ul>
            
            <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-800">3. Types of Cookies We Use</h2>
            
            <div className="overflow-x-auto mb-6">
              <table className="w-full border-collapse text-gray-600">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="py-3 px-4 text-left text-purple-600">Type</th>
                    <th className="py-3 px-4 text-left text-purple-600">Purpose</th>
                    <th className="py-3 px-4 text-left text-purple-600">Example Tools Used</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4 font-medium">Essential</td>
                    <td className="py-3 px-4">Authentication, access control</td>
                    <td className="py-3 px-4">NextAuth, JWT cookies</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4 font-medium">Performance</td>
                    <td className="py-3 px-4">Site analytics, performance tracking</td>
                    <td className="py-3 px-4">Google Analytics, Vercel stats</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4 font-medium">Functional</td>
                    <td className="py-3 px-4">Remember user settings</td>
                    <td className="py-3 px-4">LocalStorage, SessionStorage</td>
                  </tr>
                  {/* <tr className="border-b border-gray-200">
                    <td className="py-3 px-4 font-medium">Marketing (Optional)</td>
                    <td className="py-3 px-4">Track engagement and conversions</td>
                    <td className="py-3 px-4">Facebook Pixel, Google Ads</td>
                  </tr> */}
                </tbody>
              </table>
            </div>
            
            <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-800">4. Managing Cookie Preferences</h2>
            <p className="mb-3 text-gray-600">You can manage or disable cookies in the following ways:</p>
            <ul className="list-disc ml-6 mb-4 text-gray-600">
              <li className="mb-2"><strong className="text-purple-600">Browser Settings:</strong> Most browsers allow you to control cookies through settings.</li>
              <li className="mb-2"><strong className="text-purple-600">Third-Party Tools:</strong> Use privacy plug-ins or ad blockers to manage cookies.</li>
              <li className="mb-2"><strong className="text-purple-600">On Our Site:</strong> We may provide a cookie banner or preferences center for consent (coming soon).</li>
            </ul>
            <p className="mb-6 text-gray-600">Disabling cookies may affect your experience and some features may not function properly.</p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-800">5. Third-Party Cookies</h2>
            <p className="mb-6 text-gray-600">
              We may allow third-party service providers (e.g., analytics, authentication, cloud services) to set cookies on our site. 
              These third parties are responsible for their own privacy practices.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-800">6. Updates to This Policy</h2>
            <p className="mb-6 text-gray-600">
              We may update this Cookie Policy from time to time to reflect changes in technology, law, or our services. 
              We encourage you to revisit this page regularly.
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

export default CookiePolicy;