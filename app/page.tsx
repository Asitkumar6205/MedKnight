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
import Impact from "./(landingpage)/Impact";
import Getintouch from "./(landingpage)/Getintouch";
import Footer from "./(landingpage)/Footer";
import { BrainCircuit, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const [scrollY, setScrollY] = useState(0);
  // Add grid animation properties
  const [gridOpacity, setGridOpacity] = useState(0.9);

  useEffect(() => {
    if (loading && pathname === "/signin") {
      setLoading(false);
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
  }, [pathname, loading]);

  const handleClick = () => {
    setLoading(true);
    router.push("/signin");
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
    const glowElement = document.querySelector('.glow-effect') as HTMLElement;
    if (glowElement) {
      glowElement.style.transform = `translate(-50%, -50%) translate(${mousePosition.x * 40}px, ${mousePosition.y * 40}px)`;
    }
  }, [mousePosition]);

  return (
    <div
      id="home"
      className="bg-gradient-to-b from-stone-950 to-stone-900 relative overflow-hidden"
    >
      {/* Animated background gradient blobs */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full filter blur-3xl animate-blob"></div>
        <div className="absolute top-1/3 right-1/3 w-96 h-96 bg-blue-600/20 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-600/20 rounded-full filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Mesh gradient overlay */}
      <div className="fixed inset-0 bg-cover opacity-30 z-0 mix-blend-overlay">
        <Image
          src="/images/mesh-gradient.svg"
          alt="Background gradient"
          fill
          priority
          sizes="100vw"
          style={{ objectFit: "cover" }}
        />
      </div>

      {/* Tic Tac Toe Grid Background - Dense pattern with more lines */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Grid Container with many horizontal and vertical lines */}
        <div className="grid-background" style={{ opacity: gridOpacity }}></div>
      </div>

      {/* Noise texture overlay */}
      <div className="fixed inset-0 bg-repeat opacity-5 z-0">
        <Image
          src="/images/noise.png"
          alt="Noise texture"
          fill
          priority
          sizes="100vw"
          style={{ objectFit: "cover" }}
        />
      </div>

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
        {/* Glassmorphism card in the background */}
        <div className="absolute z-0 w-11/12 max-w-5xl h-3/4 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 shadow-2xl"></div>

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

        <h1
          className="fade-in-up text-center max-w-3xl font-extrabold text-4xl md:text-5xl lg:text-6xl mb-6 bg-gradient-to-r from-purple-400 via-indigo-300 to-stone-200 bg-clip-text text-transparent drop-shadow-lg px-4"
          style={{ animationDelay: "0.2s" }}
        >
          AI-Powered Radiology, 24/7 - Because Every Second Counts.
        </h1>

        <h2
          className="fade-in-up text-center max-w-3xl text-xl md:text-2xl mb-8 text-stone-300 px-4 z-10"
          style={{ animationDelay: "0.4s" }}
        >
          Delivering accurate, emergency-prioritized teleradiology reports with
          the power of AI and expert radiologists - available anytime, anywhere.
        </h2>

        <div
          className="fade-in-up flex flex-wrap justify-center gap-4 px-4"
          style={{ animationDelay: "0.6s" }}
        >
          <button
            onClick={handleClick}
            disabled={loading}
            className="bg-gradient-to-r from-purple-500 to-indigo-600 text-lg h-[50px] text-white font-bold hover:from-purple-600 hover:to-indigo-700 shadow-lg shadow-purple-500/20 px-10 rounded-full transition-all duration-300 transform hover:scale-105"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={24} />
            ) : (
              "Get Started"
            )}
          </button>

          <Link
            href={"/learn-more"}
            className="text-lg flex items-center justify-center h-[50px] px-10 text-center text-stone-200 border-purple-400 border-solid border-[1px] bg-stone-800/40 hover:bg-purple-400/20 backdrop-blur-md rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-400/10"
          >
            Learn More
          </Link>
        </div>

        {/* Scrolling indicator with improved animation */}
        <div
          className="fade-in absolute bottom-10 left-1/2 transform -translate-x-1/2"
          style={{ animationDelay: "1.2s" }}
        >
          <div className="scroll-indicator w-6 h-10 rounded-full border-2 border-purple-400/50 flex justify-center pt-2">
            <div className="scroll-dot w-1.5 h-1.5 rounded-full bg-purple-400"></div>
          </div>
        </div>
      </div>

      {/* Features Section with Glassmorphism Cards - Improved responsive layout */}
      <div className="relative z-10 py-16 md:py-20 lg:py-24 px-4 md:px-8 lg:px-16 overflow-hidden">
        <div className="container mx-40 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <div
              className="feature-card fade-in-up bg-gradient-to-br from-stone-800/80 to-stone-900/80 p-8 rounded-2xl backdrop-blur-lg border border-white/5 shadow-lg group hover:shadow-purple-500/10 transition-all duration-500 hover:-translate-y-1 relative overflow-hidden"
              style={{ animationDelay: "0.1s" }}
            >
              {/* Hover glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* Card content */}
              <div className="relative flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-purple-500/10">
                <PiLightningBold className="h-6 w-6 text-purple-400" />
              </div>
              <h2 className="text-stone-100 text-lg font-bold mb-2 group-hover:text-purple-300 transition-colors duration-300">
                Quick Turnaround
              </h2>
              <p className="text-stone-300 group-hover:text-stone-200 transition-colors duration-300">
                Lightning-fast, AI-assisted reporting for all imaging modalities
                - optimized for emergency and routine diagnostics.
              </p>
            </div>

            <div
              className="feature-card fade-in-up bg-gradient-to-br from-stone-800/80 to-stone-900/80 p-8 rounded-2xl backdrop-blur-lg border border-white/5 shadow-lg group hover:shadow-purple-500/10 transition-all duration-500 hover:-translate-y-1 relative overflow-hidden"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-purple-500/10">
                <FaRegClock className="h-5 w-5 text-purple-400" />
              </div>
              <h2 className="text-stone-100 text-lg font-bold mb-2 group-hover:text-purple-300 transition-colors duration-300">
                24/7 Availability
              </h2>
              <p className="text-stone-300 group-hover:text-stone-200 transition-colors duration-300">
                Round-the-clock expert radiologist support - ensuring no
                critical case goes unreported, ever.
              </p>
            </div>

            <div
              className="feature-card fade-in-up bg-gradient-to-br from-stone-800/80 to-stone-900/80 p-8 rounded-2xl backdrop-blur-lg border border-white/5 shadow-lg group hover:shadow-purple-500/10 transition-all duration-500 hover:-translate-y-1 relative overflow-hidden"
              style={{ animationDelay: "0.5s" }}
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-purple-500/10">
                <BrainCircuit className="h-5 w-5 text-purple-400" />
              </div>
              <h2 className="text-stone-100 text-lg font-bold mb-2 group-hover:text-purple-300 transition-colors duration-300">
                Expert + AI Precision
              </h2>
              <p className="text-stone-300 group-hover:text-stone-200 transition-colors duration-300">
                Dual-layer diagnostics combining expert radiologists and
                cutting-edge AI for faster, more accurate and reliable reports.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add custom styling for remaining sections */}
      <div className="relative z-10">
        <Services />
        <Workflow />
        <Technology />
        <Ourteam />
        {/* <Impact /> */}
        <Getintouch />
        <Footer />
      </div>

      {/* Add required styles */}
      <style jsx global>{`
        body {
          overflow-x: hidden;
          margin: 0;
          padding: 0;
        }

        /* Animation keyframes */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scrollUp {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(5px);
          }
        }

        @keyframes scrollDown {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        /* Animation classes */
        .fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }

        .fade-in {
          animation: fadeIn 1s ease-out forwards;
          opacity: 0;
        }

        .scroll-indicator {
          animation: scrollDown 2s ease-in-out infinite;
        }

        .scroll-dot {
          animation: scrollUp 1.5s ease-in-out infinite;
        }

        /* Feature cards with intersection observer support */
        .feature-card {
          opacity: 0;
          transform: translateY(30px);
        }

        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
          100% {
            transform: translateY(0px);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 0.6;
          }
          50% {
            opacity: 0.3;
          }
        }

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

        @keyframes gridPulse {
          0%,
          100% {
            opacity: 0.1;
          }
          50% {
            opacity: 0.2;
          }
        }

        .animate-grid {
          animation: gridPulse 8s infinite ease-in-out;
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

        /* Dense Grid Background */
        .grid-background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-size: 40px 40px;
          background-image: linear-gradient(
              to right,
              rgba(139, 92, 246, 0.2) 1.5px,
              transparent 1.5px
            ),
            linear-gradient(
              to bottom,
              rgba(139, 92, 246, 0.2) 1.5px,
              transparent 1.5px
            );
          animation: gridPulse 8s infinite ease-in-out;
          transition: opacity 0.5s ease-in-out;
        }

        /* Prevent content overflow */
        .container {
          width: 100%;
          max-width: 100%;
          padding-left: 1rem;
          padding-right: 1rem;
          margin-left: auto;
          margin-right: auto;
        }

        @media (min-width: 640px) {
          .container {
            max-width: 640px;
          }
        }

        @media (min-width: 768px) {
          .container {
            max-width: 768px;
          }
        }

        @media (min-width: 1024px) {
          .container {
            max-width: 1024px;
          }
        }

        @media (min-width: 1280px) {
          .container {
            max-width: 1280px;
          }
        }

        @media (min-width: 1536px) {
          .container {
            max-width: 1536px;
          }
        }
      `}</style>

      {/* Add Intersection Observer for feature cards */}
      <script dangerouslySetInnerHTML={{
        __html: `
          document.addEventListener('DOMContentLoaded', function() {
            const cards = document.querySelectorAll('.feature-card');
            
            const observer = new IntersectionObserver((entries) => {
              entries.forEach(entry => {
                if (entry.isIntersecting) {
                  entry.target.classList.add('fade-in-up');
                  observer.unobserve(entry.target);
                }
              });
            }, {
              root: null,
              rootMargin: '-100px',
              threshold: 0.1
            });
            
            cards.forEach(card => {
              observer.observe(card);
            });
          });
        `
      }} />
    </div>
  );
}