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
    }, 2000);
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
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-primary"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="flex size-24 items-center justify-center rounded-3xl bg-white shadow-2xl">
                <Sprout className="size-12 text-primary" />
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight text-white">
                GO FARM WORK
              </h1>
            </motion.div>
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
