import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sprout, ShieldCheck, Wallet } from "lucide-react";

export const Route = createFileRoute("/")({
  component: MobileOnboarding,
});

const onboardingSlides = [
  {
    id: "slide-1",
    icon: <Sprout className="size-20 text-primary" strokeWidth={1.5} />,
    title: "Find Reliable Farm Workers",
    description: "Connect with skilled agricultural labor in your area, or find steady farm work nearby without middlemen.",
  },
  {
    id: "slide-2",
    icon: <ShieldCheck className="size-20 text-primary" strokeWidth={1.5} />,
    title: "Verified & Trusted",
    description: "Every worker and farm owner is verified. Build trust with a transparent rating system.",
  },
  {
    id: "slide-3",
    icon: <Wallet className="size-20 text-primary" strokeWidth={1.5} />,
    title: "Secure Payments",
    description: "Agree on rates upfront. Get paid safely and on time for every job completed.",
  },
];

// Component for subtle floating leaf/light particles
const FloatingParticles = () => {
  return (
    <div className="absolute inset-0 z-40 pointer-events-none">
      {[...Array(15)].map((_, i) => {
        const randomAngle = Math.random() * Math.PI * 2;
        const radius = 160 + Math.random() * 40; // Spawn outside the logo
        const startX = 150 + Math.cos(randomAngle) * radius;
        const startY = 150 + Math.sin(randomAngle) * radius;
        const randomDelay = Math.random() * 2 + 3.0; // Start during "Settle" phase

        return (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{ 
              left: startX, 
              top: startY,
              width: Math.random() * 4 + 2,
              height: Math.random() * 4 + 2,
              backgroundColor: i % 3 === 0 ? "#fef08a" : "#4ade80", // mix of gold and bright green
              filter: "blur(1px)",
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0, 0.8, 0], 
              y: [0, -40], 
              x: [0, Math.sin(i) * 30],
              scale: [0, 1.5, 0],
              rotate: [0, 180]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              delay: randomDelay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        );
      })}
    </div>
  );
};

function MobileOnboarding() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  // Handle splash screen timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 5500); // 5.5s full sequence based on storyboard timing
    return () => clearTimeout(timer);
  }, []);

  const handleNext = () => {
    if (currentSlide < onboardingSlides.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      navigate({ to: "/auth" });
    }
  };

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-background">
      <AnimatePresence mode="wait">
        {showSplash ? (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, filter: "blur(15px)", scale: 1.1 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#041209] overflow-hidden" // Deep dark green background
          >
            {/* Ambient background glow */}
            <motion.div 
              className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(74,222,128,0.15)_0%,transparent_60%)]"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2.5, duration: 2 }}
            />

            <div className="relative flex items-center justify-center size-[320px]">
              
              {/* 1. START: Circle stroke appears with soft glow */}
              <svg className="absolute inset-0 size-full z-10 drop-shadow-[0_0_12px_rgba(74,222,128,0.8)]" viewBox="0 0 320 320">
                <motion.circle
                  cx="160"
                  cy="160"
                  r="145" // Outer badge ring matching logo.png ~48% radius
                  stroke="#4ade80"
                  strokeWidth="2.5"
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0, rotate: -120 }}
                  animate={{ pathLength: 1, opacity: 1, rotate: 90 }}
                  transition={{ duration: 1.8, ease: "easeInOut" }}
                  style={{ originX: "160px", originY: "160px" }}
                />
                <motion.circle
                  cx="160"
                  cy="160"
                  r="105" // Inner farmer ring matching logo.png ~34% radius
                  stroke="#fbbf24" // Subtle golden glow for inner ring
                  strokeWidth="1"
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0, rotate: 90 }}
                  animate={{ pathLength: 1, opacity: 0.6, rotate: -90 }}
                  transition={{ delay: 0.6, duration: 1.5, ease: "easeInOut" }}
                  style={{ originX: "160px", originY: "160px" }}
                />
              </svg>

              {/* 2 & 3. REVEAL: Farmer and field scene fades in */}
              {/* We use clip-path to isolate JUST the center of the original flat logo.png */}
              <motion.div
                className="absolute inset-0 z-20 flex items-center justify-center overflow-hidden"
                style={{ clipPath: "circle(34% at 50% 50%)" }} 
                initial={{ opacity: 0, scale: 0.85, filter: "brightness(1.5) blur(4px)" }}
                animate={{ opacity: 1, scale: 1, filter: "brightness(1) blur(0px)" }}
                transition={{ delay: 1.5, duration: 1.2, ease: "easeOut" }}
              >
                <img src="/logo.png" alt="Farmer Scene" className="w-full h-full object-contain" />
              </motion.div>

              {/* 4. TEXT APPEAR: "GO FARM WORK" and "FARMING LIFE" fades in */}
              {/* We reveal the outer ring of the flat logo.png using a slight rotation to simulate circular drawing */}
              <motion.div
                className="absolute inset-0 z-15 flex items-center justify-center overflow-hidden"
                style={{ clipPath: "circle(49% at 50% 50%)" }} // Perfect circle crop to remove any square JPEG background
                initial={{ opacity: 0, scale: 0.96, rotate: -15, filter: "blur(2px)" }}
                animate={{ opacity: 1, scale: 1, rotate: 0, filter: "blur(0px)" }}
                transition={{ delay: 2.5, duration: 1.2, ease: "easeOut" }}
              >
                <img src="/logo.png" alt="Brand Text" className="w-full h-full object-contain" />
              </motion.div>

              {/* 5 & 6. GLOW EFFECT: Add a subtle overlay highlight traveling across the badge */}
              <motion.div
                 className="absolute inset-0 z-30 overflow-hidden pointer-events-none rounded-full"
                 style={{ clipPath: "circle(49% at 50% 50%)" }}
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 transition={{ delay: 3.5, duration: 0.5 }}
              >
                 <motion.div 
                    className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent w-[200%] h-[200%] -left-[50%] -top-[50%]"
                    initial={{ x: "-100%", y: "-100%" }}
                    animate={{ x: "100%", y: "100%" }}
                    transition={{ delay: 3.8, duration: 1.5, ease: "easeInOut" }}
                 />
              </motion.div>

              {/* 7 & 8. NATURAL MOTION & SETTLE: Floating particles */}
              <FloatingParticles />

            </div>
          </motion.div>
        ) : (
          <motion.div
            key="onboarding"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex h-full flex-col px-6 pb-8 pt-12"
          >
            {/* Carousel Content */}
            <div className="flex flex-1 flex-col items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex w-full flex-col items-center text-center"
                >
                  {/* Large Icon Box */}
                  <div className="mb-10 flex aspect-square w-full max-w-[280px] items-center justify-center rounded-[2rem] bg-primary/10">
                    {onboardingSlides[currentSlide].icon}
                  </div>

                  {/* Text Content */}
                  <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground">
                    {onboardingSlides[currentSlide].title}
                  </h2>
                  <p className="max-w-[280px] text-base leading-relaxed text-muted-foreground">
                    {onboardingSlides[currentSlide].description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Bottom Controls */}
            <div className="flex w-full items-center justify-between pb-4 pt-8">
              {/* Pagination Dots */}
              <div className="flex items-center gap-2">
                {onboardingSlides.map((_, idx) => (
                  <motion.div
                    key={idx}
                    layout
                    className={`h-2 rounded-full transition-colors ${
                      idx === currentSlide ? "w-6 bg-primary" : "w-2 bg-primary/20"
                    }`}
                  />
                ))}
              </div>

              {/* Next Button */}
              <button
                onClick={handleNext}
                className="rounded-xl bg-primary px-8 py-3.5 text-base font-semibold text-primary-foreground shadow-sm active:scale-95 transition-transform"
              >
                {currentSlide === onboardingSlides.length - 1 ? "Get Started" : "Next"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
