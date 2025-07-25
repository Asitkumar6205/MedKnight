"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Navbar from "./(landingpage)/Navbar";
import { PiLightningBold } from "react-icons/pi";
import { FaRegClock } from "react-icons/fa6";
import Services from "./(landingpage)/Services";
import Workflow from "./(landingpage)/Workflow";
import Technology from "./(landingpage)/Technology";
import Ourteam from "./(landingpage)/Ourteam";
import Getintouch from "./(landingpage)/Getintouch";
import Footer from "./(landingpage)/Footer";
import { BrainCircuit, Loader2 } from "lucide-react";
import Image from "next/image";

export default function Home() {
  const [loadingGetStarted, setLoadingGetStarted] = useState(false);
  const [loadingLearnMore, setLoadingLearnMore] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const [scrollY, setScrollY] = useState(0);
  // Add grid animation properties
  const [gridOpacity, setGridOpacity] = useState(0.9);

  useEffect(() => {
    if (loadingGetStarted && pathname === "/signin") {
      setLoadingGetStarted(false);
    }
    if (loadingLearnMore && pathname === "/learn-more") {
      setLoadingLearnMore(false);
    }
    const handleScroll = () => {
      setScrollY(window.scrollY);
      // Adjust grid opacity based on scroll position
      const newOpacity = Math.max(
        0.4,
        Math.min(0.9, 0.9 - window.scrollY * 0.0005)
      );
      setGridOpacity(newOpacity);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname, loadingGetStarted, loadingLearnMore]);

  const handleClick1 = () => {
    setLoadingGetStarted(true);
    router.push("/signup");
  };
  const handleClick2 = () => {
    setLoadingLearnMore(true);
    router.push("/learn-more");
  };

  // Mouse parallax effect for the hero section
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Get cursor exact position
      setCursorPosition({
        x: e.clientX,
        y: e.clientY,
      });

      // Calculate normalized position for parallax effects
      setMousePosition({
        x: e.clientX / window.innerWidth - 0.5,
        y: e.clientY / window.innerHeight - 0.5,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Add smooth animation to cursor-following elements
  useEffect(() => {
    const animateCursor = () => {
      const cursorElements = document.querySelectorAll(".cursor-follow");
      cursorElements.forEach((el) => {
        const element = el as HTMLElement;
        const speed =
          element.dataset && element.dataset.speed
            ? parseFloat(element.dataset.speed)
            : 0.2;

        if (element && cursorPosition.x && cursorPosition.y) {
          const x = cursorPosition.x;
          const y = cursorPosition.y;

          element.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
        }
      });

      requestAnimationFrame(animateCursor);
    };

    const animationId = requestAnimationFrame(animateCursor);
    return () => cancelAnimationFrame(animationId);
  }, [cursorPosition]);

  // Effect to handle mouse movement parallax for glow
  useEffect(() => {
    const glowElement = document.querySelector(".glow-effect") as HTMLElement;
    if (glowElement) {
      glowElement.style.transform = `translate(-50%, -50%) translate(${
        mousePosition.x * 40
      }px, ${mousePosition.y * 40}px)`;
    }
  }, [mousePosition]);

  return (
    <div
      id="home"
      className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden"
    >
      {/* Animated background gradient blobs */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full filter blur-3xl animate-blob"></div>
        <div className="absolute top-1/3 right-1/3 w-96 h-96 bg-blue-600/20 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-600/20 rounded-full filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Mesh gradient overlay */}
      {/* <div className="fixed inset-0 bg-cover opacity-30 z-0 mix-blend-overlay">
        <Image
          src="/images/mesh-gradient.svg"
          alt="Background gradient"
          fill
          priority
          sizes="100vw"
          style={{ objectFit: "cover" }}
        />
      </div> */}

      {/* Tic Tac Toe Grid Background - Dense pattern with more lines */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Grid Container with many horizontal and vertical lines */}
        <div className="grid-background" style={{ opacity: gridOpacity }}></div>
      </div>

      {/* Noise texture overlay */}
      {/* <div className="fixed inset-0 bg-repeat opacity-5 z-0">
        <Image
          src="/images/noise.png"
          alt="Noise texture"
          fill
          priority
          sizes="100vw"
          style={{ objectFit: "cover" }}
        />
      </div> */}

      {/* Cursor following glow */}
      <div
        className="cursor-follow fixed w-32 h-32 rounded-full pointer-events-none z-10"
        style={{
          background:
            "radial-gradient(circle, rgba(168,85,247,0.2) 0%, rgba(168,85,247,0) 70%)",
          transform: "translate(-50%, -50%)",
          transition: "transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)",
        }}
      ></div>

      <Navbar />

      {/* Hero Section */}
      <div className="relative z-10 min-h-screen flex flex-col justify-center items-center px-4 md:px-8 lg:px-16 pt-16 overflow-hidden">
        {/* Glassmorphism card in the background - responsive height */}
        <div className="absolute z-0 w-11/12 max-w-7xl min-h-[85vh] sm:min-h-[80vh] md:h-3/4 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl"></div>

        {/* Moving glow elements with improved positioning */}
        <div
          className="absolute w-64 h-64 rounded-full pointer-events-none glow-effect"
          style={{
            background:
              "radial-gradient(circle, rgba(168,85,247,0.4) 0%, rgba(168,85,247,0) 70%)",
            left: "50%",
            top: "40%",
            transform: "translate(-50%, -50%)",
            transition: "transform 0.75s ease-out",
          }}
        ></div>

        {/* Content container with proper z-index and spacing */}
        <div className="relative z-10 flex flex-col items-center justify-center max-w-6xl mx-auto py-8 sm:py-16">
          <h1
            className="fade-in-up text-center max-w-4xl font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 sm:mb-6 bg-gradient-to-r from-purple-400 via-indigo-300 to-stone-200 bg-clip-text text-transparent drop-shadow-lg px-2 sm:px-4 leading-tight"
            style={{ animationDelay: "0.2s" }}
          >
            AI-Powered Radiology, 24/7 - Because Every Second Counts.
          </h1>

          <h2
            className="fade-in-up text-center max-w-4xl text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 text-stone-300 px-2 sm:px-4 leading-relaxed"
            style={{ animationDelay: "0.4s" }}
          >
            Delivering accurate, emergency-prioritized teleradiology reports
            with the power of AI and expert radiologists - available anytime,
            anywhere.
          </h2>

          <div
            className="fade-in-up flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-2 sm:px-4 w-full max-w-lg sm:max-w-none"
            style={{ animationDelay: "0.6s" }}
          >
            <button
              onClick={handleClick1}
              disabled={loadingGetStarted}
              className="bg-gradient-to-r from-purple-500 to-indigo-600 text-base sm:text-lg h-[45px] sm:h-[50px] text-white font-bold hover:from-purple-600 hover:to-indigo-700 shadow-lg shadow-purple-500/20 px-8 sm:px-10 rounded-full transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
            >
              {loadingGetStarted ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                "Get Started"
              )}
            </button>

            <button
              onClick={handleClick2}
              disabled={loadingLearnMore}
              className="text-base sm:text-lg flex items-center justify-center h-[45px] sm:h-[50px] px-8 sm:px-10 text-center text-stone-200 border-purple-400 border-solid border-[1px] bg-stone-800/40 hover:bg-purple-400/20 backdrop-blur-md rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-400/10 w-full sm:w-auto"
            >
              {loadingLearnMore ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                "Learn More"
              )}
            </button>
          </div>
        </div>

        {/* Scrolling indicator with improved animation */}
        <div
          className="fade-in absolute bottom-6 sm:bottom-10 left-1/2 transform -translate-x-1/2 z-10"
          style={{ animationDelay: "1.2s" }}
        >
          <div className="scroll-indicator w-6 h-10 rounded-full border-2 border-purple-400/50 flex justify-center pt-2">
            <div className="scroll-dot w-1.5 h-1.5 rounded-full bg-purple-400"></div>
          </div>
        </div>
      </div>

      {/* Features Section with Enhanced Cards - Matching overall UI */}
      <div className="relative z-10 py-16 md:py-20 lg:py-24 px-4 md:px-8 lg:px-16 overflow-hidden">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 lg:gap-10 justify-items-center">
            {/* Quick Turnaround Card */}
            <div
              className="feature-card fade-in-up relative p-8 rounded-xl backdrop-blur-lg border border-white/10 shadow-2xl group hover:shadow-purple-500/20 transition-all duration-700 hover:-translate-y-2 w-full max-w-sm overflow-hidden bg-gradient-to-br from-purple-500/10 via-purple-600/90 to-purple-800/10"
              style={{ animationDelay: "0.1s" }}
            >
              {/* Animated gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-indigo-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700"></div>

              {/* Glowing orb effect */}
              <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-radial from-purple-400/30 to-transparent rounded-full blur-xl opacity-50 group-hover:opacity-80 transition-opacity duration-500"></div>

              {/* Enhanced icon container */}
              <div className="relative mb-6">
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-400/20 group-hover:scale-110 transition-transform duration-500">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-400 to-purple-500 flex items-center justify-center">
                    <PiLightningBold className="h-5 w-5 text-white" />
                  </div>
                </div>
              </div>

              <div className="relative z-10">
                <h3 className="text-white text-xl font-bold mb-4 group-hover:text-purple-200 transition-colors duration-300">
                  Quick Turnaround
                </h3>
                <p className="text-stone-300 text-sm leading-relaxed group-hover:text-stone-200 transition-colors duration-300 mb-4">
                  Lightning-fast, AI-assisted reporting for all imaging
                  modalities - optimized for emergency and routine diagnostics.
                </p>

                {/* Feature highlights */}
                <div className="space-y-2">
                  <div className="flex items-center text-xs text-stone-400 group-hover:text-stone-300 transition-colors duration-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 mr-2"></div>
                    AI-powered analysis acceleration
                  </div>
                  <div className="flex items-center text-xs text-stone-400 group-hover:text-stone-300 transition-colors duration-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 mr-2"></div>
                    Priority emergency handling
                  </div>
                </div>
              </div>
            </div>

            {/* 24/7 Availability Card */}
            <div
              className="feature-card fade-in-up relative p-8 rounded-xl backdrop-blur-lg border border-white/10 shadow-2xl group hover:shadow-blue-500/20 transition-all duration-700 hover:-translate-y-2 w-full max-w-sm overflow-hidden bg-gradient-to-br from-blue-500/10 via-blue-600/90 to-blue-800/10"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-cyan-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700"></div>

              <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-radial from-blue-400/30 to-transparent rounded-full blur-xl opacity-50 group-hover:opacity-80 transition-opacity duration-500"></div>

              <div className="relative mb-6">
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-400/20 group-hover:scale-110 transition-transform duration-500">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center">
                    <FaRegClock className="h-4 w-4 text-white" />
                  </div>
                </div>
              </div>

              <div className="relative z-10">
                <h3 className="text-white text-xl font-bold mb-4 group-hover:text-blue-200 transition-colors duration-300">
                  24/7 Availability
                </h3>
                <p className="text-stone-300 text-sm leading-relaxed group-hover:text-stone-200 transition-colors duration-300 mb-4">
                  Round-the-clock expert radiologist support - ensuring no
                  critical case goes unreported, ever.
                </p>

                <div className="space-y-2">
                  <div className="flex items-center text-xs text-stone-400 group-hover:text-stone-300 transition-colors duration-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 mr-2"></div>
                    Global radiologist network
                  </div>
                  <div className="flex items-center text-xs text-stone-400 group-hover:text-stone-300 transition-colors duration-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 mr-2"></div>
                    Instant case assignment
                  </div>
                </div>
              </div>
            </div>

            {/* Expert + AI Precision Card */}
            <div
              className="feature-card fade-in-up relative p-8 rounded-xl backdrop-blur-lg border border-white/10 shadow-2xl group hover:shadow-pink-500/20 transition-all duration-700 hover:-translate-y-2 w-full max-w-sm overflow-hidden bg-gradient-to-br from-pink-500/10 via-pink-600/90 to-pink-800/10 md:col-span-2 xl:col-span-1 md:mx-auto xl:mx-0"
              style={{ animationDelay: "0.5s" }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-pink-600/20 via-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700"></div>

              <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-radial from-pink-400/30 to-transparent rounded-full blur-xl opacity-50 group-hover:opacity-80 transition-opacity duration-500"></div>

              <div className="relative mb-6">
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500/20 to-pink-600/10 border border-pink-400/20 group-hover:scale-110 transition-transform duration-500">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-400 to-pink-500 flex items-center justify-center">
                    <BrainCircuit className="h-4 w-4 text-white" />
                  </div>
                </div>
              </div>

              <div className="relative z-10">
                <h3 className="text-white text-xl font-bold mb-4 group-hover:text-pink-200 transition-colors duration-300">
                  Expert + AI Precision
                </h3>
                <p className="text-stone-300 text-sm leading-relaxed group-hover:text-stone-200 transition-colors duration-300 mb-4">
                  Dual-layer diagnostics combining expert radiologists and
                  cutting-edge AI for faster, more accurate and reliable
                  reports.
                </p>

                <div className="space-y-2">
                  <div className="flex items-center text-xs text-stone-400 group-hover:text-stone-300 transition-colors duration-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 mr-2"></div>
                    Machine learning enhancement
                  </div>
                  <div className="flex items-center text-xs text-stone-400 group-hover:text-stone-300 transition-colors duration-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 mr-2"></div>
                    Expert validation process
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Other sections */}
      <Services />
      <Workflow />
      <Technology />
      <Ourteam />
      <Getintouch />
      <Footer />
    </div>
  );
}
