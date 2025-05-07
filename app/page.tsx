"use client";
import { useEffect, useState, useRef, ReactElement } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "./landingpage/Navbar";
import { Button } from "@/components/ui/button";
import { PiLightningBold } from "react-icons/pi";
import { FaRegClock } from "react-icons/fa6";
import { RiVerifiedBadgeLine } from "react-icons/ri";
import Services from "./landingpage/Services";
import Workflow from "./landingpage/Workflow";
import Technology from "./landingpage/Technology";
import Ourteam from "./landingpage/Ourteam";
import Impact from "./landingpage/Impact";
import Getintouch from "./landingpage/Getintouch";
import Footer from "./landingpage/Footer";
import { BrainCircuit, Loader2 } from "lucide-react";

export default function Home(): ReactElement {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const heroRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    if (loading && pathname === "/signin") {
      setLoading(false);
    }

    const handleScroll = (): void => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname, loading]);

  const handleClick = (): void => {
    setLoading(true);
    router.push("/signin");
  };

  // Mouse parallax effect for the hero section
  type MousePositionType = {
    x: number;
    y: number;
  };
  
  const [mousePosition, setMousePosition] = useState<MousePositionType>({ x: 0, y: 0 });
  const [cursorPosition, setCursorPosition] = useState<MousePositionType>({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Get cursor exact position
      setCursorPosition({
        x: e.clientX,
        y: e.clientY
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
      const cursorElements = document.querySelectorAll('.cursor-follow');
      cursorElements.forEach((el) => {
        const element = el as HTMLElement;
        const speed = element.dataset.speed ? parseFloat(element.dataset.speed) : 0.2;
        
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

  return (
    <div id="home" className="bg-gradient-to-b from-stone-950 to-stone-900 relative overflow-hidden">
      {/* Animated background gradient blobs */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full filter blur-3xl animate-blob"></div>
        <div className="absolute top-1/3 right-1/3 w-96 h-96 bg-blue-600/20 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-600/20 rounded-full filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Mesh gradient overlay */}
      <div className="fixed inset-0 bg-[url('/mesh-gradient.svg')] bg-cover opacity-30 z-0 mix-blend-overlay"></div>

      {/* Noise texture overlay */}
      <div className="fixed inset-0 bg-[url('/noise.png')] bg-repeat opacity-5 z-0"></div>
      
      {/* Cursor following glow */}
      <div 
        className="cursor-follow fixed w-32 h-32 rounded-full pointer-events-none z-10"
        style={{ 
          background: "radial-gradient(circle, rgba(168,85,247,0.2) 0%, rgba(168,85,247,0) 70%)",
          transform: "translate(-50%, -50%)",
          transition: "transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)"
        }}
      ></div>

      <Navbar />

      {/* Hero Section */}
      <div 
        ref={heroRef} 
        className="relative z-10 min-h-screen flex flex-col justify-center items-center px-4 md:px-8 lg:px-16 pt-16 overflow-hidden"
      >
        {/* Glassmorphism card in the background */}
        <div className="absolute z-0 w-11/12 max-w-5xl h-3/4 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 shadow-2xl"></div>
        
        {/* Moving glow elements with improved positioning */}
        <motion.div 
          animate={{
            x: mousePosition.x * 40,
            y: mousePosition.y * 40,
          }}
          transition={{ type: "spring", stiffness: 75, damping: 15, mass: 0.5 }}
          className="absolute w-64 h-64 rounded-full pointer-events-none"
          style={{ 
            background: "radial-gradient(circle, rgba(168,85,247,0.4) 0%, rgba(168,85,247,0) 70%)",
            left: "50%",
            top: "40%",
            transform: "translate(-50%, -50%)"
          }}
        ></motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center max-w-3xl font-extrabold text-4xl md:text-5xl lg:text-6xl mb-6 bg-gradient-to-r from-purple-400 via-indigo-300 to-stone-200 bg-clip-text text-transparent drop-shadow-lg px-4"
        >
          AI-Powered Radiology, 24/7 - Because Every Second Counts.
        </motion.h1>
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center max-w-3xl text-xl md:text-2xl mb-8 text-stone-300 px-4 z-10"
        >
          Delivering accurate, emergency-prioritized teleradiology reports with
          the power of AI and expert radiologists - available anytime, anywhere.
        </motion.h2>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-wrap justify-center gap-4 px-4"
        >
          <Button
            onClick={handleClick}
            disabled={loading}
            className="bg-gradient-to-r from-purple-500 to-indigo-600 text-lg h-[50px] text-white font-bold hover:from-purple-600 hover:to-indigo-700 shadow-lg shadow-purple-500/20 px-10 rounded-full transition-all duration-300 transform hover:scale-105"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={24} />
            ) : (
              "Get Started"
            )}
          </Button>
          
          <Button className="text-lg h-[50px] px-10 border-purple-400 border-solid border-[1px] bg-stone-800/40 hover:bg-purple-400/20 backdrop-blur-md rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-400/10">
            Learn More
          </Button>
        </motion.div>

        {/* Scrolling indicator with improved animation */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-6 h-10 rounded-full border-2 border-purple-400/50 flex justify-center pt-2"
          >
            <motion.div 
              animate={{ y: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }} 
              className="w-1.5 h-1.5 rounded-full bg-purple-400"
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Features Section with Glassmorphism Cards - Improved responsive layout */}
      <div className="relative z-10 py-16 md:py-20 lg:py-24 px-4 md:px-8 lg:px-16 overflow-hidden">
        <div className="container mx-auto max-w-7xl mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
              className="bg-gradient-to-br from-stone-800/80 to-stone-900/80 p-8 rounded-2xl backdrop-blur-lg border border-white/5 shadow-lg group hover:shadow-purple-500/10 transition-all duration-500 hover:-translate-y-1 relative overflow-hidden"
            >
              {/* Hover glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Card content */}
              <div className="relative flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-purple-500/10">
                <PiLightningBold className="h-6 w-6 text-purple-400" />
              </div>
              <h2 className="text-stone-100 text-lg font-bold mb-2 group-hover:text-purple-300 transition-colors duration-300">Quick Turnaround</h2>
              <p className="text-stone-300 group-hover:text-stone-200 transition-colors duration-300">
                Lightning-fast, AI-assisted reporting for all imaging modalities - optimized for emergency and routine diagnostics.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true, margin: "-100px" }}
              className="bg-gradient-to-br from-stone-800/80 to-stone-900/80 p-8 rounded-2xl backdrop-blur-lg border border-white/5 shadow-lg group hover:shadow-purple-500/10 transition-all duration-500 hover:-translate-y-1 relative overflow-hidden"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-purple-500/10">
                <FaRegClock className="h-5 w-5 text-purple-400" />
              </div>
              <h2 className="text-stone-100 text-lg font-bold mb-2 group-hover:text-purple-300 transition-colors duration-300">24/7 Availability</h2>
              <p className="text-stone-300 group-hover:text-stone-200 transition-colors duration-300">
                Round-the-clock expert radiologist support - ensuring no critical case goes unreported, ever.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true, margin: "-100px" }}
              className="bg-gradient-to-br from-stone-800/80 to-stone-900/80 p-8 rounded-2xl backdrop-blur-lg border border-white/5 shadow-lg group hover:shadow-purple-500/10 transition-all duration-500 hover:-translate-y-1 relative overflow-hidden"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-purple-500/10">
                <BrainCircuit className="h-5 w-5 text-purple-400" />
              </div>
              <h2 className="text-stone-100 text-lg font-bold mb-2 group-hover:text-purple-300 transition-colors duration-300">Expert + AI Precision</h2>
              <p className="text-stone-300 group-hover:text-stone-200 transition-colors duration-300">
                Dual-layer diagnostics combining expert radiologists and cutting-edge AI for faster, more accurate and reliable reports.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Add custom styling for remaining sections */}
      <div className="relative z-10">
        <Services />
        <Workflow />
        <Technology />
        <Ourteam />
        <Impact />
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
        
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.3; }
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
        
        .animate-blob {
          animation: blob 15s infinite alternate;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
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
    </div>
  );
}