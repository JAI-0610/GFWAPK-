import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sprout, 
  CloudSun, 
  IndianRupee, 
  Lightbulb, 
  ArrowRight,
  ChevronRight,
  CheckCircle2
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: MobileOnboarding,
});

// --- DATA ---
type SlideType = 'fullscreen' | 'feature' | 'grid' | 'final';

const onboardingSlides = [
  {
    id: "welcome",
    type: "fullscreen" as SlideType,
    bgImage: "/assets/welcome_landscape.jpg",
    title: (
      <>
        Welcome to<br />
        <span className="text-[#4ade80]">Go Farm Work</span>
      </>
    ),
    description: "Everything you need for smarter farming.",
  },
  {
    id: "manage-crops",
    type: "feature" as SlideType,
    image: "/assets/crop_sprout.jpg",
    title: "Manage Your Crops",
    description: "Track, monitor and get better insights to grow healthy crops.",
    card: {
      icon: <Sprout className="size-5 text-[#4ade80]" />,
      title: "Smart Crop Monitoring",
      desc: "Monitor crop health and get useful farming insights."
    }
  },
  {
    id: "market-prices",
    type: "feature" as SlideType,
    title: "Know Market Prices",
    description: "Get updated market prices and sell your produce at the right time.",
    // Custom render for the chart visual
    isChart: true,
    card: {
      icon: <IndianRupee className="size-5 text-[#4ade80]" />,
      title: "Live Market Updates",
      desc: "Get daily price updates for your crops."
    }
  },
  {
    id: "overview",
    type: "grid" as SlideType,
    title: "Everything Farmers Need",
    features: [
      { icon: <Sprout className="size-6 text-[#4ade80]" />, title: "Crop Management", desc: "Plan, track and manage your crops easily." },
      { icon: <CloudSun className="size-6 text-[#fbbf24]" />, title: "Weather Updates", desc: "Get accurate weather information and forecasts." },
      { icon: <IndianRupee className="size-6 text-[#4ade80]" />, title: "Market Prices", desc: "Check current market prices before selling." },
      { icon: <Lightbulb className="size-6 text-[#fef08a]" />, title: "Farming Tips", desc: "Get useful farming knowledge and guidance." },
    ]
  },
  {
    id: "community",
    type: "fullscreen" as SlideType,
    bgImage: "/assets/farming_community.jpg",
    title: "Join Farming Community",
    description: "Connect with farmers, share knowledge and grow together.",
  },
  {
    id: "final",
    type: "final" as SlideType,
    bgImage: "/assets/get_started_landscape.jpg",
    title: (
      <>
        Let’s Grow<br />
        Together
      </>
    ),
    description: "Smart tools, real insights and a better tomorrow for farmers.",
  }
];

// --- SPLASH SCREEN PARTICLES ---
const FloatingParticles = () => {
  return (
    <div className="absolute inset-0 z-40 pointer-events-none">
      {[...Array(15)].map((_, i) => {
        const randomAngle = Math.random() * Math.PI * 2;
        const radius = 160 + Math.random() * 40;
        const startX = 150 + Math.cos(randomAngle) * radius;
        const startY = 150 + Math.sin(randomAngle) * radius;
        const randomDelay = Math.random() * 2 + 3.0;

        return (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{ 
              left: startX, 
              top: startY,
              width: Math.random() * 4 + 2,
              height: Math.random() * 4 + 2,
              backgroundColor: i % 3 === 0 ? "#fef08a" : "#4ade80",
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

// --- CUSTOM SVG PRICE CHART ---
const PriceChart = () => (
  <div className="relative w-full aspect-[4/3] bg-[#071d11] rounded-3xl overflow-hidden border border-white/5 shadow-2xl flex flex-col p-6">
    <div className="flex justify-between items-center mb-6">
      <div className="text-[#FDFBF7]/80 text-sm font-medium">Daily Trends</div>
      <div className="bg-[#4ade80]/20 text-[#4ade80] px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
        +2.4% <ArrowRight className="size-3 -rotate-45" />
      </div>
    </div>
    
    {/* Mock Data Points */}
    <div className="space-y-4 mb-4 z-10">
      <div className="flex justify-between items-center text-sm">
        <span className="text-white font-medium">Tomato</span>
        <span className="text-[#4ade80] font-semibold">₹25/kg</span>
      </div>
      <div className="flex justify-between items-center text-sm">
        <span className="text-white font-medium">Potato</span>
        <span className="text-[#FDFBF7]/60 font-semibold">₹18/kg</span>
      </div>
      <div className="flex justify-between items-center text-sm">
        <span className="text-white font-medium">Onion</span>
        <span className="text-[#fbbf24] font-semibold">₹20/kg</span>
      </div>
    </div>

    {/* SVG Chart Graphic */}
    <div className="absolute bottom-0 left-0 right-0 h-1/2 opacity-60">
       <svg viewBox="0 0 100 50" preserveAspectRatio="none" className="w-full h-full">
         <defs>
           <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
             <stop offset="0%" stopColor="#4ade80" stopOpacity="0.4" />
             <stop offset="100%" stopColor="#4ade80" stopOpacity="0.0" />
           </linearGradient>
         </defs>
         {/* Bars */}
         <rect x="10" y="30" width="8" height="20" fill="#0b2e1b" rx="2" />
         <rect x="25" y="20" width="8" height="30" fill="#0b2e1b" rx="2" />
         <rect x="40" y="35" width="8" height="15" fill="#0b2e1b" rx="2" />
         <rect x="55" y="15" width="8" height="35" fill="#4ade80" fillOpacity="0.8" rx="2" />
         <rect x="70" y="25" width="8" height="25" fill="#0b2e1b" rx="2" />
         <rect x="85" y="10" width="8" height="40" fill="#0b2e1b" rx="2" />
         
         {/* Line */}
         <polyline 
           points="0,40 14,30 29,20 44,35 59,10 74,25 89,5 100,20" 
           fill="none" 
           stroke="#4ade80" 
           strokeWidth="2" 
           strokeLinecap="round" 
           strokeLinejoin="round" 
         />
         <polygon 
           points="0,50 0,40 14,30 29,20 44,35 59,10 74,25 89,5 100,20 100,50" 
           fill="url(#chartGrad)" 
         />
       </svg>
    </div>
  </div>
);

// --- MAIN COMPONENT ---
export default function MobileOnboarding() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 5500); 
    return () => clearTimeout(timer);
  }, []);

  const slide = onboardingSlides[currentSlide];

  const handleNext = () => {
    if (currentSlide < onboardingSlides.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      navigate({ to: "/auth" });
    }
  };

  const handleSkip = () => {
    navigate({ to: "/auth" });
  };

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-[#041209] text-[#FDFBF7] font-sans">
      <AnimatePresence mode="wait">
        
        {/* --- SPLASH SCREEN --- */}
        {showSplash ? (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, filter: "blur(15px)", scale: 1.1 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#041209] overflow-hidden"
          >
            <motion.div 
              className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(74,222,128,0.15)_0%,transparent_60%)]"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2.5, duration: 2 }}
            />

            <div className="relative flex flex-col items-center justify-center">
              <div className="relative size-[300px]">
                <svg className="absolute inset-0 size-full z-10 drop-shadow-[0_0_12px_rgba(74,222,128,0.8)]" viewBox="0 0 320 320">
                  <motion.circle
                    cx="160"
                    cy="160"
                    r="145"
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
                    r="105"
                    stroke="#fbbf24"
                    strokeWidth="1"
                    fill="none"
                    initial={{ pathLength: 0, opacity: 0, rotate: 90 }}
                    animate={{ pathLength: 1, opacity: 0.6, rotate: -90 }}
                    transition={{ delay: 0.6, duration: 1.5, ease: "easeInOut" }}
                    style={{ originX: "160px", originY: "160px" }}
                  />
                </svg>

                <motion.div
                  className="absolute inset-0 z-20 flex items-center justify-center overflow-hidden"
                  style={{ clipPath: "circle(34% at 50% 50%)" }} 
                  initial={{ opacity: 0, scale: 0.85, filter: "brightness(1.5) blur(4px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "brightness(1) blur(0px)" }}
                  transition={{ delay: 1.5, duration: 1.2, ease: "easeOut" }}
                >
                  <img src="/logo.png" alt="Farmer Scene" className="w-full h-full object-contain" />
                </motion.div>

                <motion.div
                  className="absolute inset-0 z-15 flex items-center justify-center overflow-hidden"
                  style={{ clipPath: "circle(49% at 50% 50%)" }}
                  initial={{ opacity: 0, scale: 0.96, rotate: -15, filter: "blur(2px)" }}
                  animate={{ opacity: 1, scale: 1, rotate: 0, filter: "blur(0px)" }}
                  transition={{ delay: 2.5, duration: 1.2, ease: "easeOut" }}
                >
                  <img src="/logo.png" alt="Brand Text" className="w-full h-full object-contain" />
                </motion.div>

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
                <FloatingParticles />
              </div>

              {/* Brand Name & Tagline under Logo */}
              <motion.div 
                className="mt-8 flex flex-col items-center text-center z-40"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 3.5, duration: 1, ease: "easeOut" }}
              >
                <h1 className="text-3xl font-bold tracking-wide text-[#FDFBF7]">Go Farm Work</h1>
                <p className="mt-2 text-sm font-medium text-[#4ade80] tracking-wider uppercase">Farming Life, Better Life</p>
                <div className="mt-4"><Sprout className="size-5 text-[#4ade80]/60" /></div>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          
          /* --- ONBOARDING SLIDES --- */
          <motion.div
            key="onboarding"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 flex flex-col w-full h-full"
          >
            {/* Top Bar (Skip) */}
            <div className="absolute top-0 left-0 right-0 z-50 flex justify-between items-center p-6 pt-12">
              {currentSlide === 0 ? (
                <div className="flex items-center gap-2">
                  <Sprout className="size-5 text-[#4ade80]" />
                </div>
              ) : <div />}
              
              {currentSlide < onboardingSlides.length - 1 && (
                <button 
                  onClick={handleSkip}
                  className="text-sm font-medium text-[#FDFBF7]/60 hover:text-white transition-colors"
                >
                  Skip
                </button>
              )}
            </div>

            {/* Slide Content */}
            <div className="flex-1 relative overflow-hidden">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, x: 20, scale: 0.98 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -20, scale: 0.98 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="absolute inset-0 size-full flex flex-col"
                >
                  
                  {/* FULLSCREEN TYPE */}
                  {(slide.type === 'fullscreen' || slide.type === 'final') && (
                    <div className="absolute inset-0 size-full">
                      <motion.img 
                        src={slide.bgImage} 
                        className="w-full h-full object-cover"
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 8, ease: "easeOut" }}
                      />
                      {/* Heavy gradient mask for text readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#041209] via-[#041209]/80 to-transparent" />
                      
                      <div className="absolute bottom-[140px] left-0 right-0 p-8 text-center flex flex-col items-center">
                        {slide.type === 'fullscreen' && slide.id !== 'welcome' && (
                           <div className="mb-6 p-4 rounded-full bg-[#4ade80]/10 backdrop-blur-md border border-[#4ade80]/20">
                             <CheckCircle2 className="size-8 text-[#4ade80]" />
                           </div>
                        )}
                        <h2 className="text-3xl font-bold tracking-tight mb-4 leading-tight">
                          {slide.title}
                        </h2>
                        <p className="text-[#FDFBF7]/70 text-base max-w-[280px]">
                          {slide.description}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* FEATURE CARD TYPE */}
                  {slide.type === 'feature' && (
                    <div className="flex flex-col h-full px-6 pt-24 pb-[140px]">
                      <h2 className="text-3xl font-bold tracking-tight mb-3">
                        {slide.title.toString().split(' ').map((word, i, arr) => 
                           i === arr.length - 1 ? <span key={i} className="text-[#4ade80]">{word}</span> : word + " "
                        )}
                      </h2>
                      <p className="text-[#FDFBF7]/70 mb-10 max-w-[280px]">
                        {slide.description}
                      </p>

                      {/* Hero Image/Chart Area */}
                      {slide.isChart ? (
                        <PriceChart />
                      ) : (
                        <div className="relative w-full aspect-square rounded-3xl overflow-hidden mb-6 shadow-2xl">
                          <img src={slide.image} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#041209] to-transparent opacity-60" />
                        </div>
                      )}

                      {/* Feature Card */}
                      <div className="mt-auto bg-[#071d11] border border-white/5 p-4 rounded-2xl flex items-center gap-4 shadow-lg backdrop-blur-md">
                        <div className="bg-[#4ade80]/10 p-3 rounded-xl shrink-0">
                          {slide.card?.icon}
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm text-white">{slide.card?.title}</h4>
                          <p className="text-xs text-[#FDFBF7]/60 mt-0.5 leading-snug">{slide.card?.desc}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* GRID OVERVIEW TYPE */}
                  {slide.type === 'grid' && (
                    <div className="flex flex-col h-full px-6 pt-24 pb-[140px]">
                      <h2 className="text-3xl font-bold tracking-tight mb-8">
                        Why <span className="text-[#4ade80]">Go Farm Work?</span>
                      </h2>
                      
                      <div className="grid gap-4 w-full">
                        {slide.features?.map((feat, idx) => (
                          <motion.div 
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * idx }}
                            className="bg-[#071d11] border border-white/5 p-4 rounded-2xl flex items-center gap-4 shadow-sm"
                          >
                            <div className="bg-[#4ade80]/5 p-3 rounded-xl shrink-0">
                              {feat.icon}
                            </div>
                            <div>
                              <h4 className="font-semibold text-sm text-white">{feat.title}</h4>
                              <p className="text-xs text-[#FDFBF7]/60 mt-1 leading-snug">{feat.desc}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                </motion.div>
              </AnimatePresence>
            </div>

            {/* Bottom Navigation */}
            <div className="absolute bottom-0 left-0 right-0 p-6 pb-10 z-50">
              
              {/* If Final Slide */}
              {currentSlide === onboardingSlides.length - 1 ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full flex flex-col items-center gap-4"
                >
                  <button
                    onClick={handleNext}
                    className="w-full rounded-2xl bg-[#4ade80] px-8 py-4 text-base font-bold text-[#041209] shadow-[0_0_20px_rgba(74,222,128,0.3)] active:scale-95 transition-all"
                  >
                    Get Started
                  </button>
                  <p className="text-sm text-[#FDFBF7]/60">
                    Already have an account? <button onClick={handleSkip} className="text-[#4ade80] font-semibold hover:underline">Login</button>
                  </p>
                </motion.div>
              ) : (
                <div className="flex w-full items-center justify-between">
                  {/* Pagination Dots */}
                  <div className="flex items-center gap-2">
                    {onboardingSlides.slice(0, -1).map((_, idx) => (
                      <motion.div
                        key={idx}
                        layout
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          idx === currentSlide ? "w-6 bg-[#4ade80]" : "w-2 bg-white/20"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Next Arrow Button */}
                  <button
                    onClick={handleNext}
                    className="flex items-center justify-center size-14 rounded-full bg-[#4ade80] text-[#041209] shadow-lg active:scale-95 transition-transform"
                  >
                    <ChevronRight className="size-6" strokeWidth={2.5} />
                  </button>
                </div>
              )}
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

