import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React, { useState } from "react";

export default function Navbar() {
  const [activeLink, setActiveLink] = useState("home");
  
  // Handle link hover state
  const handleLinkHover = (linkName: string) => {
    setActiveLink(linkName);
  };

  const navLinks = [
    { name: "home", label: "Home" },
    { name: "services", label: "Services" },
    { name: "workflow", label: "Workflow" },
    { name: "technology", label: "Technology" },
    { name: "ourteam", label: "Our Team" },
    { name: "careers", label: "Careers", href: "#" },
  ];

  return (
    <header className="flex h-16 w-full shrink-0 items-center px-4 md:px-6 fixed bg-stone-900/90 backdrop-blur-sm z-20 border-b border-white/5">
      <div className="lg:mx-20 font-bold text-2xl bg-transparent flex items-center">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              size="icon"
              className="lg:hidden bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 transition-all duration-300"
            >
              <MenuIcon className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="bg-stone-900/95 backdrop-blur-lg text-white border-r border-white/10"
          >
            <SheetTitle className="sr-only" />
            <div className="py-4">
              <Logo />
            </div>
            <div className="grid gap-2 py-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href || `/#${link.name}`}
                  className="group flex w-full items-center py-2 text-lg font-semibold transition-all duration-300"
                  prefetch={false}
                  onMouseEnter={() => handleLinkHover(link.name)}
                  onMouseLeave={() => handleLinkHover("")}
                >
                  <span className="relative inline-block">
                    {link.label}
                    <span className={`absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 transition-transform duration-300 group-hover:scale-x-100`}></span>
                    <span className="absolute inset-0 bg-gradient-to-r from-purple-400 via-indigo-300 to-purple-500 bg-clip-text text-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">{link.label}</span>
                  </span>
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>
        <Link href={"/#"} className="hidden lg:flex" prefetch={false}>
          <Logo />
        </Link>
      </div>

      <nav className="ml-auto hidden lg:flex gap-3 mr-10 items-center">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            href={link.href || `/#${link.name}`}
            className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-none px-3 py-2 text-sm font-medium transition-all duration-300 relative overflow-hidden"
            prefetch={false}
            onMouseEnter={() => handleLinkHover(link.name)}
            onMouseLeave={() => handleLinkHover("")}
          >
            <span className="relative text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:via-indigo-300 group-hover:to-purple-500 group-hover:bg-clip-text transition-all duration-300">
              {link.label}
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-600 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </span>
          </Link>
        ))}
        <button className="bg-gradient-to-r from-purple-500 to-indigo-600 text-sm h-[40px] text-white font-bold hover:from-purple-600 hover:to-indigo-700 shadow-lg shadow-purple-500/20 px-8 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-purple-500/30 whitespace-nowrap">
          <Link href={"/#getintouch"} prefetch={false}>
            Contact Us
          </Link>
        </button>
      </nav>
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
      <img src="LOGO-MEDKNIGHT.png" height={60} width={60} alt="logo" className="mr-2" />
      <h2 className="flex items-center relative">
        <span className="relative inline-block transition-all duration-300">
          <span className="bg-gradient-to-r from-stone-200 to-stone-400 bg-clip-text text-transparent  transition-all duration-300">Med</span>
          <span className="absolute left-0 top-0 opacity-0 bg-gradient-to-r from-purple-400 via-indigo-300 to-purple-500 bg-clip-text text-transparent transition-all duration-300">Med</span>
        </span>
        <span className="relative inline-block transition-all duration-300">
          <span className="bg-gradient-to-r from-purple-500 to-stone-600 bg-clip-text text-transparent  transition-all duration-300">Knight</span>
          <span className="absolute left-0 top-0 opacity-0 bg-gradient-to-r from-indigo-400 to-purple-600 bg-clip-text text-transparent transition-all duration-300">Knight</span>
        </span>
      </h2>
    </div>
  );
}