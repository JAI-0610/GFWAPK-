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

function MobileOnboarding() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  // Handle splash screen timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 4500); // Extended for the full animation sequence
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
            exit={{ opacity: 0, filter: "blur(10px)" }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#FDFBF7]"
          >
            <div className="relative flex items-center justify-center size-[300px]">
              {/* 1. Circle Outline drawing in */}
              <svg className="absolute inset-0 size-full z-10" viewBox="0 0 300 300">
                <motion.circle
                  cx="150"
                  cy="150"
                  r="105"
                  stroke="#1E3F2D"
                  strokeWidth="3"
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0, rotate: -90 }}
                  animate={{ pathLength: 1, opacity: 1, rotate: -90 }}
                  transition={{ duration: 1.2, ease: "easeInOut" }}
                  style={{ originX: "50px", originY: "50px", transformOrigin: "150px 150px" }}
                />
              </svg>

              {/* 2. Reveal Farmer (Center of logo.png) */}
              <motion.div
                className="absolute inset-0 z-20 flex items-center justify-center overflow-hidden rounded-full"
                style={{ clipPath: "circle(68% at 50% 50%)" }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2, duration: 1, ease: "easeOut" }}
              >
                <img src="/logo.png" alt="Farmer Scene" className="w-full h-full object-contain" />
              </motion.div>

              {/* 3. Text & Full Logo Appear (Full logo.png unmasked) */}
              <motion.div
                className="absolute inset-0 z-30 flex items-center justify-center"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 2.2, duration: 1, ease: "easeOut" }}
              >
                <img 
                  src="/logo.png" 
                  alt="Go Farm Work Logo" 
                  className="w-full h-full object-contain" 
                  style={{ filter: "drop-shadow(0 0 20px rgba(30, 63, 45, 0.25))" }} 
                />
              </motion.div>
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
