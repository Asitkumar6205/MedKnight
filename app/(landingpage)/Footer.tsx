import Link from "next/link";
import React from "react";
import { FaInstagramSquare, FaPhoneAlt } from "react-icons/fa";
import { FaFacebook, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { MdOutlineMailOutline, MdLocationOn } from "react-icons/md";

function Footer() {
  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent"></div>
      
      {/* Main footer content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Company Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="space-y-4">
              <Link
                href="/#home"
                className="inline-flex items-center space-x-2 group transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-center space-x-1">
                  <img 
                    src="logo.png" 
                    height={45} 
                    width={55} 
                    alt="MedKnight Logo"
                    className="transition-transform duration-300 group-hover:rotate-12"
                  />
                  <img
                    src="name-img.png"
                    height={140}
                    width={160}
                    alt="MedKnight"
                    className="pt-1"
                  />
                </div>
              </Link>
              
              <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
                Fast, Accurate, 24/7 Diagnostic Reporting with cutting-edge AI technology 
                and expert medical professionals.
              </p>
            </div>
            
            {/* Social Media Links */}
            <div className="space-y-3">
              <h4 className="text-white font-semibold text-sm uppercase tracking-wider">
                Follow Us
              </h4>
              <div className="flex space-x-3">
                {[
                  { icon: FaInstagramSquare, color: "hover:text-pink-400", bg: "hover:bg-pink-500/10" },
                  { icon: FaFacebook, color: "hover:text-blue-400", bg: "hover:bg-blue-500/10" },
                  { icon: FaXTwitter, color: "hover:text-gray-300", bg: "hover:bg-gray-500/10" },
                ].map((social, index) => (
                  <div
                    key={index}
                    className={`p-2 rounded-lg bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 cursor-pointer transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 ${social.color} ${social.bg} hover:border-slate-600`}
                  >
                    <social.icon className="h-5 w-5" />
                  </div>
                ))}
                <Link
                  href="https://www.linkedin.com/company/medknight/about/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 cursor-pointer transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 hover:text-blue-400 hover:bg-blue-500/10 hover:border-slate-600"
                >
                  <FaLinkedin className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-white text-lg font-bold relative inline-block">
              Quick Links
              <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full"></div>
            </h3>
            <ul className="space-y-3">
              {[
                { name: "Services", href: "/#services" },
                { name: "Workflow", href: "/#workflow" },
                { name: "Technology", href: "/#technology" },
                // { name: "Our Team", href: "/#partnership" },
                { name: "About Us", href: "/#about" }
              ].map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-white transition-all duration-300 inline-flex items-center group text-sm"
                  >
                    <span className="w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Our Services */}
          <div className="space-y-6">
            <h3 className="text-white text-lg font-bold relative inline-block">
              Our Services
              <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full"></div>
            </h3>
            <ul className="space-y-3">
              {[
                "X-Ray Reporting",
                "CT Scan Analysis", 
                "MRI Interpretation",
                // "Ultrasound Reports",
                "24/7 Support"
              ].map((service, index) => (
                <li key={index}>
                  <Link
                    href="/#services"
                    className="text-slate-400 hover:text-white transition-all duration-300 inline-flex items-center group text-sm"
                  >
                    <span className="w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <h3 className="text-white text-lg font-bold relative inline-block">
              Contact Us
              <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full"></div>
            </h3>
            <div className="space-y-4">
              
              {/* Phone */}
              <div className="flex items-start space-x-4 group">
                <div className="flex-shrink-0 p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg group-hover:shadow-purple-500/25 transition-all duration-300 group-hover:scale-110">
                  <FaPhoneAlt className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-400 text-xs uppercase tracking-wider font-medium mb-1">
                    Call us at
                  </p>
                  <div className="space-y-1">
                    <p className="text-white text-sm font-medium">+91-6205400732</p>
                    <p className="text-white text-sm font-medium">+91-8789573665</p>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start space-x-4 group">
                <div className="flex-shrink-0 p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg group-hover:shadow-purple-500/25 transition-all duration-300 group-hover:scale-110">
                  <MdOutlineMailOutline className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-400 text-xs uppercase tracking-wider font-medium mb-1">
                    Email us at
                  </p>
                  <p className="text-white text-sm font-medium break-all">
                    contact@medknight.in
                  </p>
                </div>
              </div>

              {/* Location (Optional - you can add this) */}
              {/* <div className="flex items-start space-x-4 group">
                <div className="flex-shrink-0 p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg group-hover:shadow-purple-500/25 transition-all duration-300 group-hover:scale-110">
                  <MdLocationOn className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-400 text-xs uppercase tracking-wider font-medium mb-1">
                    Visit us
                  </p>
                  <p className="text-white text-sm font-medium">
                    Bengaluru, Karnataka, India
                  </p>
                </div>
              </div> */}

            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-12 pt-8 border-t border-slate-700/50">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            
            {/* Copyright */}
            <div className="text-slate-400 text-sm">
              © 2025 MedKnight. All rights reserved.
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap items-center space-x-6">
              {[
                { name: "Privacy Policy", href: "/privacy-policy" },
                { name: "Terms of Service", href: "/terms-of-service" },
                { name: "Cookies Policy", href: "/cookies-policy" }
              ].map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className="text-slate-400 hover:text-white text-sm transition-colors duration-300 hover:underline underline-offset-4"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Additional decorative element */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-2 text-slate-500 text-xs">
            <div className="w-8 h-px bg-gradient-to-r from-transparent via-slate-500 to-transparent"></div>
            <span>Powered by Advanced AI Technology</span>
            <div className="w-8 h-px bg-gradient-to-r from-transparent via-slate-500 to-transparent"></div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;