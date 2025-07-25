import React from "react";
import { FaUserMd, FaStar, FaQuoteLeft } from "react-icons/fa";

function SuccessStories() {
  const testimonials = [
    {
      id: 1,
      name: "Dr. Sarah M.",
      title: "Neuroradiologist",
      location: "Mumbai",
      quote: "MedKnight doubled my monthly income while maintaining my hospital position. The flexibility to work evenings has been game-changing for my work-life balance.",
      rating: 5,
      gradient: "from-purple-500/30 to-pink-600/30",
      borderColor: "border-purple-500/20",
      hoverBorder: "hover:border-purple-400/40",
      hoverShadow: "hover:shadow-[0_0_30px_rgba(147,51,234,0.3)]"
    },
    {
      id: 2,
      name: "Dr. Raj K.",
      title: "Radiologist",
      location: "Delhi",
      quote: "The diverse case exposure and advanced tools have significantly enhanced my diagnostic skills. Plus, the additional income supports my family's goals.",
      rating: 5,
      gradient: "from-blue-500/30 to-cyan-600/30",
      borderColor: "border-blue-500/20",
      hoverBorder: "hover:border-blue-400/40",
      hoverShadow: "hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]"
    },
    {
      id: 3,
      name: "Dr. Priya S.",
      title: "Chest Radiologist",
      location: "Bangalore",
      quote: "Working with MedKnight has expanded my expertise across different modalities. The platform's AI assistance makes complex cases more manageable and efficient.",
      rating: 5,
      gradient: "from-green-500/30 to-emerald-600/30",
      borderColor: "border-green-500/20",
      hoverBorder: "hover:border-green-400/40",
      hoverShadow: "hover:shadow-[0_0_30px_rgba(34,197,94,0.3)]"
    },
    {
      id: 4,
      name: "Dr. Arjun T.",
      title: "Interventional Radiologist",
      location: "Chennai",
      quote: "The quality of cases and instant feedback system helped me refine my reporting skills. It's like having a continuous learning environment.",
      rating: 5,
      gradient: "from-orange-500/30 to-red-600/30",
      borderColor: "border-orange-500/20",
      hoverBorder: "hover:border-orange-400/40",
      hoverShadow: "hover:shadow-[0_0_30px_rgba(249,115,22,0.3)]"
    },
    {
      id: 5,
      name: "Dr. Meera L.",
      title: "Pediatric Radiologist",
      location: "Hyderabad",
      quote: "The 24/7 flexibility allows me to balance my practice with family time. MedKnight's technology stack is truly impressive and user-friendly.",
      rating: 5,
      gradient: "from-indigo-500/30 to-purple-600/30",
      borderColor: "border-indigo-500/20",
      hoverBorder: "hover:border-indigo-400/40",
      hoverShadow: "hover:shadow-[0_0_30px_rgba(99,102,241,0.3)]"
    },
    {
      id: 6,
      name: "Dr. Vikram N.",
      title: "Musculoskeletal Radiologist",
      location: "Pune",
      quote: "The peer review system and continuous education opportunities have elevated my diagnostic confidence. Plus, the earnings are substantial!",
      rating: 5,
      gradient: "from-teal-500/30 to-blue-600/30",
      borderColor: "border-teal-500/20",
      hoverBorder: "hover:border-teal-400/40",
      hoverShadow: "hover:shadow-[0_0_30px_rgba(20,184,166,0.3)]"
    }
  ];

  // Duplicate testimonials for seamless loop
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  return (
    <div className="max-lg:mx-4 lg:mx-10 mt-12 mb-8 elative overflow-hidden">
      {/* Section Header */}
      <div className="text-center mb-12">
        <h3 className="sm:pt-6 md:pt-8 text-2xl sm:text-3xl md:text-4xl font-bold text-stone-100 mb-4 drop-shadow-lg">
          What Our Partners Say
        </h3>
        <p className="text-stone-400 sm:text-base md:text-lg lg:text-xl max-w-2xl mx-auto text-sm font-light">
          Join hundreds of radiologists who have transformed their practice with MedKnight
        </p>
      </div>

      {/* Marquee Container */}
      <div className="relative overflow-hidden pt-4">
        
        {/* Marquee Animation */}
        <div className="flex animate-marquee space-x-6 hover:pause-animation">
          {duplicatedTestimonials.map((testimonial, index) => (
            <div
              key={`${testimonial.id}-${index}`}
              className={`relative group min-w-[400px] bg-gradient-to-br from-stone-800/40 via-stone-800/20 to-stone-900/40 backdrop-blur-xl border ${testimonial.borderColor} shadow-2xl p-8 rounded-2xl transition-all duration-500 transform hover:scale-105 ${testimonial.hoverBorder} ${testimonial.hoverShadow} before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-r before:${testimonial.gradient} before:opacity-0 before:transition-opacity before:duration-500 hover:before:opacity-100`}
            >
              {/* Quote Icon */}
              <div className="absolute top-4 right-6 opacity-20">
                <FaQuoteLeft className="text-4xl text-purple-400" />
              </div>

              {/* Doctor Info */}
              <div className="relative z-10 flex items-center mb-6">
                <div className="relative">
                  <div className={`p-4 rounded-full bg-gradient-to-br ${testimonial.gradient} backdrop-blur-sm border ${testimonial.borderColor} shadow-lg`}>
                    <FaUserMd className="text-purple-400 text-2xl drop-shadow-lg" />
                  </div>
                  <div className="absolute inset-0 rounded-full bg-purple-400/10 blur-xl animate-pulse"></div>
                </div>
                <div className="ml-4">
                  <h4 className="text-stone-100 font-bold text-lg drop-shadow-md">
                    {testimonial.name}
                  </h4>
                  <p className="text-purple-400 text-sm font-medium drop-shadow-sm">
                    {testimonial.title}
                  </p>
                  <p className="text-stone-500 text-xs">
                    {testimonial.location}
                  </p>
                </div>
              </div>

              {/* Testimonial Quote */}
              <blockquote className="relative z-10 text-stone-300 italic text-sm leading-relaxed mb-6 drop-shadow-sm">
                "{testimonial.quote}"
              </blockquote>

              {/* Rating Stars */}
              <div className="relative z-10 flex justify-between items-center">
                <div className="flex text-yellow-400 drop-shadow-lg">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className="text-sm mr-1 animate-pulse" style={{
                      animationDelay: `${i * 0.1}s`
                    }} />
                  ))}
                </div>
                <div className="text-xs text-stone-500 font-medium">
                  Verified Partner
                </div>
              </div>

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/5 via-blue-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Stats Bar
      <div className="mt-12 flex flex-row max-sm:flex-col justify-center items-center gap-8 p-6 bg-gradient-to-r from-stone-800/40 via-stone-800/30 to-stone-800/40 backdrop-blur-xl border border-stone-600/20 shadow-2xl rounded-2xl relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-purple-500/5 before:via-blue-500/5 before:to-green-500/5 before:opacity-50">
        <div className="text-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg">
            2000+
          </div>
          <div className="text-sm text-stone-400">Active Partners</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-lg">
            4.9/5
          </div>
          <div className="text-sm text-stone-400">Average Rating</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent drop-shadow-lg">
            95%
          </div>
          <div className="text-sm text-stone-400">Recommend Us</div>
        </div>
      </div> */}

      {/* Custom CSS for marquee animation */}
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        
        .pause-animation:hover .animate-marquee {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}

export default SuccessStories;