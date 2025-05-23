// pages/learn-more.tsx
import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ChevronRight, Check, Shield, Clock, Brain, Globe, Settings, FileText, BarChart2, MessageCircle, FileOutput } from 'lucide-react';

const LearnMorePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Head>
        <title>Learn More About MedKnight - Next-Gen Teleradiology Platform</title>
        <meta name="description" content="MedKnight is a next-generation Teleradiology SaaS Platform designed to transform how diagnostic imaging and radiology reporting are delivered in India and beyond." />
      </Head>

      {/* Hero Section */}
      <header className="bg-indigo-600 text-white py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Learn More About MedKnight</h1>
          <p className="text-xl md:text-2xl max-w-3xl">
            A next-generation Teleradiology SaaS Platform designed to transform how diagnostic imaging and radiology reporting are delivered in India and beyond.
          </p>
        </div>
      </header>

      {/* Introduction */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <p className="text-lg text-gray-700 mb-6">
             We bridge the gap between diagnostic centers, radiologists, and healthcare providers by offering an intelligent, secure, and scalable cloud-based solution. Our platform streamlines imaging workflows, enhances collaboration, and enables faster, more accurate diagnostic reporting — all while ensuring full compliance with medical data standards and privacy protocols.
            </p>
            
            <div className="mt-8 bg-indigo-50 p-6 rounded-lg border border-indigo-200">
              <h3 className="text-xl font-semibold text-indigo-800 mb-4">Our Mission</h3>
              <p className="text-lg italic font-medium text-indigo-700">
                "No life should be lost due to delayed radiology."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What is MedKnight */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">🧭 What is MedKnight?</h2>
          <div className="bg-white rounded-lg shadow-lg p-8">
            <p className="text-lg text-gray-700 mb-6">
              MedKnight is a cloud-native teleradiology platform that enables medical institutions to:
            </p>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <ChevronRight className="h-6 w-6 text-indigo-500 mr-2 flex-shrink-0 mt-1" />
                <span>Upload and manage DICOM medical imaging (CT, MRI, X-Ray, Ultrasound, PET, etc.)</span>
              </li>
              <li className="flex items-start">
                <ChevronRight className="h-6 w-6 text-indigo-500 mr-2 flex-shrink-0 mt-1" />
                <span>Connect instantly to a verified network of expert radiologists across India</span>
              </li>
              <li className="flex items-start">
                <ChevronRight className="h-6 w-6 text-indigo-500 mr-2 flex-shrink-0 mt-1" />
                <span>Leverage AI-powered tools for preliminary diagnostics</span>
              </li>
              <li className="flex items-start">
                <ChevronRight className="h-6 w-6 text-indigo-500 mr-2 flex-shrink-0 mt-1" />
                <span>Provide secure, fast, and compliant reporting turnaround</span>
              </li>
              <li className="flex items-start">
                <ChevronRight className="h-6 w-6 text-indigo-500 mr-2 flex-shrink-0 mt-1" />
                <span>Store, archive, and retrieve reports and patient history with ease</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Why MedKnight */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">🚀 Why MedKnight?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-lg shadow p-6 border-t-4 border-indigo-500">
              <div className="flex items-center mb-4">
                <Clock className="h-8 w-8 text-indigo-500 mr-3" />
                <h3 className="text-xl font-semibold">Instant Turnaround Times</h3>
              </div>
              <p className="text-gray-600">
                We understand that time is critical. MedKnight enables instant notification and reporting workflows to minimize diagnosis delay and improve patient outcomes.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-lg shadow p-6 border-t-4 border-purple-500">
              <div className="flex items-center mb-4">
                <Brain className="h-8 w-8 text-purple-500 mr-3" />
                <h3 className="text-xl font-semibold">AI-Powered Reporting</h3>
              </div>
              <p className="text-gray-600">
                Use MedKnight's integrated AI-based anomaly detection tools to auto-highlight potential concerns like fractures, tumors, and infections — acting as a second set of eyes for radiologists.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-lg shadow p-6 border-t-4 border-green-500">
              <div className="flex items-center mb-4">
                <Globe className="h-8 w-8 text-green-500 mr-3" />
                <h3 className="text-xl font-semibold">Nationwide Access</h3>
              </div>
              <p className="text-gray-600">
                No in-house radiologist? No problem. MedKnight lets you connect with verified and onboarded radiologists across India, allowing 24x7 reporting capabilities — even in rural or underserved areas.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-lg shadow p-6 border-t-4 border-yellow-500">
              <div className="flex items-center mb-4">
                <Settings className="h-8 w-8 text-yellow-500 mr-3" />
                <h3 className="text-xl font-semibold">Customizable SaaS Solution</h3>
              </div>
              <p className="text-gray-600">
                We don't believe in one-size-fits-all. Our system is modular — institutions can enable/disable AI assistance, set custom TAT workflows, and create role-based access.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white rounded-lg shadow p-6 border-t-4 border-red-500">
              <div className="flex items-center mb-4">
                <Shield className="h-8 w-8 text-red-500 mr-3" />
                <h3 className="text-xl font-semibold">Secure and Compliant</h3>
              </div>
              <p className="text-gray-600">
                We adhere to the highest standards in data security and privacy with HIPAA-ready practices, end-to-end encryption, secure storage, and comprehensive audit logging.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Who is MedKnight for */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">🏥 Who is MedKnight for?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* User Type 1 */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold text-indigo-700 mb-4">🏨 Diagnostic Centres</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Upload scans in seconds</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Get expert reports faster</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Maintain secure digital archives</span>
                </li>
              </ul>
            </div>

            {/* User Type 2 */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold text-indigo-700 mb-4">🏥 Hospitals</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Plug-and-play radiologist network</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>24/7 emergency reporting</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Reduce dependency on in-house staff</span>
                </li>
              </ul>
            </div>

            {/* User Type 3 */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold text-indigo-700 mb-4">🧑‍⚕️ Radiologists</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Work remotely from anywhere</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Get assigned cases in real-time</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Use AI tools to assist workflow</span>
                </li>
              </ul>
            </div>

            {/* User Type 4 */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold text-indigo-700 mb-4">🧪 Research Institutions</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Archive anonymized DICOM data</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Train and test AI models</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">⚙️ Key Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-start p-4 bg-white rounded shadow">
              <FileText className="h-6 w-6 text-indigo-500 mr-3 flex-shrink-0" />
              <span>Smart DICOM Viewer with Pan, Zoom, Window/Level Adjustments</span>
            </div>
            <div className="flex items-start p-4 bg-white rounded shadow">
              <FileText className="h-6 w-6 text-indigo-500 mr-3 flex-shrink-0" />
              <span>Customizable Reporting Templates</span>
            </div>
            <div className="flex items-start p-4 bg-white rounded shadow">
              <Shield className="h-6 w-6 text-indigo-500 mr-3 flex-shrink-0" />
              <span>Compliant Cloud Storage & Audit Logs</span>
            </div>
            <div className="flex items-start p-4 bg-white rounded shadow">
              <FileText className="h-6 w-6 text-indigo-500 mr-3 flex-shrink-0" />
              <span>Third-party PACS Integration</span>
            </div>
            <div className="flex items-start p-4 bg-white rounded shadow">
              <Clock className="h-6 w-6 text-indigo-500 mr-3 flex-shrink-0" />
              <span>24x7 Reporting & Emergency Workflow</span>
            </div>
            <div className="flex items-start p-4 bg-white rounded shadow">
              <FileText className="h-6 w-6 text-indigo-500 mr-3 flex-shrink-0" />
              <span>Multi-role User Management (Admin, Radiologist, Technician)</span>
            </div>
            <div className="flex items-start p-4 bg-white rounded shadow">
              <BarChart2 className="h-6 w-6 text-indigo-500 mr-3 flex-shrink-0" />
              <span>Analytics Dashboard for TAT, Case Volume, Status</span>
            </div>
            <div className="flex items-start p-4 bg-white rounded shadow">
              <MessageCircle className="h-6 w-6 text-indigo-500 mr-3 flex-shrink-0" />
              <span>In-App Chat Between Radiologists and Hospital Staff</span>
            </div>
            <div className="flex items-start p-4 bg-white rounded shadow">
              <FileOutput className="h-6 w-6 text-indigo-500 mr-3 flex-shrink-0" />
              <span>PDF Report Export with Hospital Branding</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing & Plans */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">📦 Pricing & Plans</h2>
          
          <div className="bg-white rounded-lg shadow-lg p-8">
            <p className="text-lg text-gray-700 mb-6">
              We offer a flexible subscription model based on your size and usage:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="border rounded-lg p-6 text-center">
                <h3 className="text-xl font-bold mb-2">Startup Plan</h3>
                <p className="text-gray-600">Ideal for small labs</p>
              </div>
              
              <div className="border rounded-lg p-6 text-center border-indigo-500 shadow-md bg-indigo-50">
                <h3 className="text-xl font-bold mb-2 text-indigo-700">Professional Plan</h3>
                <p className="text-gray-600">For multi-location hospitals</p>
              </div>
              
              <div className="border rounded-lg p-6 text-center">
                <h3 className="text-xl font-bold mb-2">Enterprise Plan</h3>
                <p className="text-gray-600">For large institutions or government partners</p>
              </div>
            </div>
            
            <p className="text-gray-700 italic">
              Custom quotes are available for NGOs, public health programs, and academic institutions.
            </p>
          </div>
        </div>
      </section>

      {/* Support & Vision */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Support & Onboarding */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">🧑‍💻 Support & Onboarding</h2>
              <p className="mb-4">MedKnight provides:</p>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Dedicated Onboarding Specialist</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Product Training & Documentation</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>24x7 Technical Support</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Annual Security & Compliance Audit</span>
                </li>
              </ul>
            </div>
            
            {/* Our Vision */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">💡 Our Vision</h2>
              <p className="text-lg text-gray-700">
                To build India's most trusted digital radiology backbone — where access to quality, timely imaging is not a luxury, but a right.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-indigo-600 text-white">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <h2 className="text-3xl font-bold mb-8">✨ Get Started with MedKnight Today</h2>
          <p className="text-xl mb-8">
            Whether you're a hospital, lab, or radiologist, MedKnight can upgrade how you deliver care.
          </p>
          
          <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-6">
            <Link href="/schedule-demo" className="bg-white text-indigo-600 hover:bg-indigo-100 font-bold py-3 px-8 rounded-full transition duration-300">
              👉 Schedule a Demo
            </Link>
            <Link href="/request-callback" className="bg-transparent hover:bg-indigo-700 border-2 border-white font-bold py-3 px-8 rounded-full transition duration-300">
              👉 Request a Callback
            </Link>
            <Link href="/contact" className="bg-transparent hover:bg-indigo-700 border-2 border-white font-bold py-3 px-8 rounded-full transition duration-300">
              👉 Contact Our Team
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <h3 className="text-xl font-bold mb-4">MedKnight</h3>
              <p className="text-gray-300 max-w-md">
                Next-generation Teleradiology SaaS Platform transforming diagnostic imaging and radiology reporting in India and beyond.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="/" className="text-gray-300 hover:text-white transition">Home</Link></li>
                <li><Link href="/#getintouch" className="text-gray-300 hover:text-white transition">Contact Us</Link></li>
                <li><Link href="/privacy-policy" className="text-gray-300 hover:text-white transition">Privacy Policy</Link></li>
                <li><Link href="/terms-of-service" className="text-gray-300 hover:text-white transition">Terms of Service</Link></li>
                <li><Link href="/cookies-policy" className="text-gray-300 hover:text-white transition">Cookies Policy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} MedKnight. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LearnMorePage;