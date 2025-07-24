import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React, { useState, useEffect } from "react";

export default function Navbar() {
  const [activeLink, setActiveLink] = useState("home");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      
      // Calculate scroll progress
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(Math.min(100, scrollPercent));
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle link hover state
  const handleLinkHover = (linkName: string) => {
    setActiveLink(linkName);
  };

  const navLinks = [
    { name: "home", label: "Home", href: "/#home" },
    { name: "services", label: "Services", href: "/#services" },
    { name: "workflow", label: "Workflow", href: "/#workflow" },
    { name: "technology", label: "Technology", href: "/#technology" },
    { name: "partnership", label: "Team", href: "/#partnership" },
    { name: "careers", label: "Careers", href: "#careers" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-slate-900/95 backdrop-blur-lg border-b border-white/10 shadow-lg shadow-purple-500/5"
          : "bg-slate-900/90 backdrop-blur-sm border-b border-white/5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  size="icon"
                  className="relative bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 hover:scale-105"
                >
                  <div
                    className={`transition-all duration-300 ${
                      isMobileOpen ? "rotate-90" : ""
                    }`}
                  >
                    <MenuIcon className="h-5 w-5" />
                  </div>
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="bg-slate-900/98 backdrop-blur-xl text-white border-r border-white/10 w-80"
              >
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

                {/* Mobile Logo */}
                <div className="py-6 border-b border-white/10">
                  <Logo />
                </div>

                {/* Mobile Navigation Links */}
                <div className="py-6 space-y-1">
                  {navLinks.map((link, index) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="group flex items-center py-3 px-4 text-base font-medium transition-all duration-300 rounded-lg hover:bg-white/5"
                      prefetch={false}
                      onClick={() => setIsMobileOpen(false)}
                    >
                      <span className="relative flex items-center">
                        <span className="w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-0 group-hover:scale-100"></span>
                        <span className="relative">
                          {link.label}
                          <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-600 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                        </span>
                      </span>
                    </Link>
                  ))}
                </div>

                {/* Mobile Contact Button */}
                <div className="pt-6 border-t border-white/10">
                  <Link
                    href="/#getintouch"
                    className="flex items-center justify-center w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25"
                    onClick={() => setIsMobileOpen(false)}
                  >
                    Contact Us
                  </Link>
                </div>

                {/* Mobile Footer Info */}
                <div className="absolute bottom-6 left-6 right-6 text-center">
                  <div className="text-xs text-slate-400 space-y-1">
                    <p>24/7 Diagnostic Reporting</p>
                    <p className="text-purple-400">+91-6205400732</p>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Logo */}
          <div className="flex items-center">
            <Link
              href="/#home"
              className="flex items-center transition-all duration-300 hover:scale-105"
              prefetch={false}
            >
              <Logo />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link, index) => (
              <Link
                key={link.name}
                href={link.href}
                className="group relative px-4 py-2 text-sm font-medium text-white/90 hover:text-white transition-all duration-300 rounded-lg hover:bg-white/5"
                prefetch={false}
                onMouseEnter={() => handleLinkHover(link.name)}
                onMouseLeave={() => handleLinkHover("home")}
              >
                <span className="relative z-10">
                  {link.label}

                  {/* Bottom border animation */}
                  <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full transition-all duration-300 group-hover:w-full"></span>
                </span>

                {/* Hover effect background */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-95 group-hover:scale-100"></div>

                {/* Active indicator */}
                {activeLink === link.name && (
                  <div className="absolute -top-1 left-1/2 w-1 h-1 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full transform -translate-x-1/2 animate-pulse"></div>
                )}
              </Link>
            ))}

            {/* CTA Button */}
            <div className="ml-6 pl-6 border-l border-white/10">
              <Link
                href="/#getintouch"
                className="relative inline-flex items-center px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold text-sm rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25 group overflow-hidden"
                prefetch={false}
              >
                {/* Background animation */}
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <span className="relative z-10 flex items-center">
                  Contact Us
                </span>

                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </Link>
            </div>
          </nav>
        </div>
      </div>

      {/* Progress bar (optional - shows scroll progress) */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-800">
        <div
          className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 transition-all duration-300"
          style={{
            width: `${scrollProgress}%`,
          }}
        ></div>
      </div>
    </header>
  );
}

function MenuIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

function Logo() {
  return (
    <div className="flex items-center group transition-all duration-300">
      <div className="relative">
        <img
          src="logo.png"
          height={50}
          width={50}
          alt="MedKnight Logo"
          className="transition-all duration-300 group-hover:drop-shadow-lg group-hover:drop-shadow-purple-500/25"
        />
        {/* Subtle glow effect on logo */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
      </div>
      <div className="ml-1">
        <img
          src="name-img.png"
          height={140}
          width={160}
          alt="MedKnight"
          className="pt-1 transition-all duration-300"
        />
      </div>
    </div>
  );
}