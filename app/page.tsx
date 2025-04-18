"use client";
import Navbar from "./landingpage/Navbar";
import { Button } from "@/components/ui/button";
import { PiLightningBold } from "react-icons/pi";
import { FaRegClock } from "react-icons/fa6";
import { RiVerifiedBadgeLine } from "react-icons/ri";
import Services from "./landingpage/Services";
import Workflow from "./landingpage/Workflow";
import Technology from "./landingpage/Technology";
import Ourteam from "./landingpage/Ourteam";
// import Testimonials from "./landingpage/Testimonials";
import Impact from "./landingpage/Impact";
import Getintouch from "./landingpage/Getintouch";
import Footer from "./landingpage/Footer";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { BrainCircuit, Loader2 } from "lucide-react";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname(); // Tracks the current route

  useEffect(() => {
    if (loading && pathname === "/signin") {
      setLoading(false); // Stop loading once on /signin
    }
  }, [pathname, loading]);

  const handleClick = () => {
    setLoading(true);
    router.push("/signin");
  };

  return (
    <div id="home">
      <Navbar />
      <div className="flex flex-col pt-24 lg:px-16">
        <h1 className="lg:mx-40 max-md:mx-6 md:mx-6  max-sm:mx-4 max-w-3xl font-extrabold text-4xl md:text-6xl mb-6 bg-gradient-to-r from-purple-400 to-stone-100 bg-clip-text text-transparent">
          AI-Powered Radiology, 24/7 - Because Every Second Counts.
        </h1>
        <h2 className="lg:mx-40 max-sm:mx-4 max-md:mx-6 md:mx-6  max-w-3xl font-extra-bold lg:text-2xl md:text-2xl mb-8 bg-gradient-to-r from-stone-100 to-stone-500 bg-clip-text text-transparent">
          Delivering accurate, emergency-prioritized teleradiology reports with
          the power of AI and expert radiologists - available anytime, anywhere.
        </h2>
      </div>
      <Button
        onClick={handleClick}
        disabled={loading}
        className="bg-purple-400 text-lg h-[50px] text-stone-700 lg:ml-56 max-md:ml-6 md:ml-6 xs:ml-2 max-sm:ml-4 font-bold hover:bg-purple-500 lg:pl-14 lg:pr-14"
      >
        {loading ? (
          <Loader2 className="animate-spin" size={24} />
        ) : (
          "Get Started"
        )}
      </Button>
      <Button className="mb-10 text-lg border-purple-400 border-solid h-[50px] max-md:ml-6 md:ml-6 xs:ml-2 max-sm:ml-4 max-sm:mt-4 lg:pl-9 lg:pr-9 border-[1px] bg-stone-800 hover:bg-purple-400 font">
        Learn More
      </Button>
      <div className="lg:mx-56 max-md:mx-6 md:mx-6 xs:mx-2 max-sm:mx-4 mb-10 grid lg:grid-cols-3 md:grid-cols-2 gap-8 relative">
        <div className="bg-stone-800 p-8 rounded-lg">
          <PiLightningBold className="h-7 w-7 text-purple-500 mb-2" />
          <h2 className="text-stone-100 text-lg font-bold">Quick Turnaround</h2>
          <h3 className="bg-gradient-to-r from-stone-400 to-stone-100 bg-clip-text text-transparent">
          Lightning-fast, AI-assisted reporting for all imaging modalities - optimized for emergency and routine diagnostics.
          </h3>
        </div>
        <div className="bg-stone-800 p-8 rounded-lg">
          <FaRegClock className="h-7 w-7 text-purple-500 mb-2" />
          <h2 className="text-stone-100 text-lg font-bold">24/7 Availability</h2>
          <h3 className="bg-gradient-to-r from-stone-400 to-stone-100 bg-clip-text text-transparent">
            Round-the-clock expert radiologist support - ensuring no critical case goes unreported, ever.
          </h3>
        </div>
        <div className="bg-stone-800 p-8 rounded-lg">
        <BrainCircuit className="h-7 w-7 text-purple-500 mb-2" />
          <h2 className="text-stone-100 text-lg font-bold"> Expert + AI Precision</h2>
          <h3 className="bg-gradient-to-r from-stone-400 to-stone-100 bg-clip-text text-transparent">
          Dual-layer diagnostics combining expert radiologists and cutting-edge AI for faster, more accurate and reliable reports.
          </h3>
        </div>
      </div>  
      <Services />
      <Workflow />
      <Technology />
      <Ourteam />
      {/* <Testimonials /> */}
      {/* <Impact /> */}
      <Getintouch />
      <Footer />
    </div>
  );
}
