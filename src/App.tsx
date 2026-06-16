import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Skills from "./components/Skills";
import PortfolioGrid from "./components/PortfolioGrid";
import Footer from "./components/Footer";
import ScrollReveal from "./components/ScrollReveal";
import StarfieldBackground from "./components/StarfieldBackground";
import WalkieTalkieIntro from "./components/WalkieTalkieIntro";
import { ArrowUp } from "lucide-react";

interface FollowerBubble {
  size: number;
  delay: string;
  color: string;
  offsetX: number;
  offsetY: number;
}

interface DynamicRipple {
  id: number;
  x: number;
  y: number;
}

export default function App() {
  const [introConnected, setIntroConnected] = useState(false);
  const [mousePos, setMousePos] = useState({ x: -200, y: -200 });
  const [isMouseActive, setIsMouseActive] = useState(false);
  const [clickRipples, setClickRipples] = useState<DynamicRipple[]>([]);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Retro typewriter connected logger notifier system
  const [showSystemLog, setShowSystemLog] = useState(false);
  const [typedMessage, setTypedMessage] = useState("");

  useEffect(() => {
    if (introConnected) {
      setShowSystemLog(true);
      const fullText = "SYS_LOG: User 'JiYoon_Hong' connected to channel CH-0724... [ONLINE/SECURE]";
      let currentIndex = 0;
      setTypedMessage("");
      
      const interval = setInterval(() => {
        if (currentIndex < fullText.length) {
          setTypedMessage((prev) => prev + fullText.charAt(currentIndex));
          currentIndex++;
        } else {
          clearInterval(interval);
          // Auto-fade out retro system notification alert box
          setTimeout(() => {
            setShowSystemLog(false);
          }, 3800);
        }
      }, 48);

      return () => clearInterval(interval);
    }
  }, [introConnected]);

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      setIsMouseActive(true);
    };

    const handleGlobalMouseLeave = () => {
      setIsMouseActive(false);
    };

    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Do not spawn target sparkles on standard active forms, links, buttons to avoid blocking view
      if (
        target.closest("button") ||
        target.closest("a") ||
        target.closest("input") ||
        target.closest("textarea")
      ) {
        return;
      }
      const newRipple = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY,
      };
      setClickRipples((prev) => [...prev, newRipple]);

      setTimeout(() => {
        setClickRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, 900);
    };

    const handleScrollVisibility = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("mousemove", handleGlobalMouseMove);
    window.addEventListener("mouseleave", handleGlobalMouseLeave);
    window.addEventListener("click", handleGlobalClick);
    window.addEventListener("scroll", handleScrollVisibility);

    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove);
      window.removeEventListener("mouseleave", handleGlobalMouseLeave);
      window.removeEventListener("click", handleGlobalClick);
      window.removeEventListener("scroll", handleScrollVisibility);
    };
  }, []);

  const handleScrollTo = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const followerBubbles: FollowerBubble[] = [
    { size: 80, delay: "duration-150", color: "from-blue-400/20 to-cyan-300/10", offsetX: -40, offsetY: -40 },
    { size: 120, delay: "duration-350", color: "from-indigo-400/10 to-blue-500/10", offsetX: -60, offsetY: -60 },
    { size: 55, delay: "duration-200", color: "from-blue-500/25 to-sky-400/20", offsetX: -27, offsetY: -27 },
    { size: 100, delay: "duration-500", color: "from-cyan-400/15 to-indigo-500/15", offsetX: -50, offsetY: -50 },
    { size: 40, delay: "duration-100", color: "from-sky-300/30 to-blue-400/20", offsetX: -20, offsetY: -20 },
  ];

  if (!introConnected) {
    return (
      <div id="app-root-shell" className="min-h-screen bg-slate-950 flex flex-col font-sans select-none antialiased relative justify-center items-center overflow-hidden">
        <div className="fixed inset-0 z-0 pointer-events-none select-none overflow-hidden opacity-40">
          <StarfieldBackground />
        </div>
        <WalkieTalkieIntro onEnter={() => setIntroConnected(true)} />
      </div>
    );
  }

  return (
    <div id="app-root-shell" className="min-h-screen flex flex-col font-sans select-none antialiased relative animate-[fadeIn_0.8s_ease-out_forwards]">
      
      {/* Global Ambient Starfield Background (Deep Space layer) */}
      <div className="fixed inset-0 z-0 pointer-events-none select-none overflow-hidden opacity-80">
        <StarfieldBackground />
      </div>
      
      {/* 1. Global Mouse-following Translucent Blue Bubbles (Trailing Physics Overlay) */}
      <div className="fixed inset-0 z-40 pointer-events-none overflow-hidden select-none">
        {isMouseActive &&
          followerBubbles.map((bubble, i) => (
            <div
              key={i}
              style={{
                transform: `translate3d(${mousePos.x + bubble.offsetX}px, ${mousePos.y + bubble.offsetY}px, 0)`,
                width: `${bubble.size}px`,
                height: `${bubble.size}px`,
              }}
              className={`absolute rounded-full bg-gradient-to-tr ${bubble.color} backdrop-blur-3xs border border-blue-400/20 transition-transform ${bubble.delay} ease-out`}
            />
          ))}
      </div>

      {/* 2. Global Dynamic Click Concentric Ring Ripples */}
      <div className="fixed inset-0 z-40 pointer-events-none overflow-hidden select-none">
        {clickRipples.map((ripple) => (
          <div
            key={ripple.id}
            style={{
              left: `${ripple.x}px`,
              top: `${ripple.y}px`,
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2"
          >
            <div className="absolute w-20 h-20 -left-10 -top-10 rounded-full border-2 border-blue-500/40 animate-[ping_0.9s_ease-out_forwards]" />
            <div className="absolute w-12 h-12 -left-6 -top-6 rounded-full border border-cyan-400/50 animate-[ping_0.7s_ease-out_0.1s_forwards]" />
            <div className="absolute w-5 h-5 -left-2.5 -top-2.5 rounded-full bg-blue-500/5 animate-[ping_0.5s_ease-out_0.2s_forwards]" />
          </div>
        ))}
      </div>

      {/* Sticky Header */}
      <Header onScrollTo={handleScrollTo} />

      {/* Main Single-View Component Content Area */}
      <main id="app-main-view" className="flex-1">
        {/* Section 1: Hero & academic profile cards */}
        <ScrollReveal>
          <Hero onLearnMore={() => handleScrollTo("skills-section")} />
        </ScrollReveal>

        {/* Section 2: Interactive skill metrics matrix */}
        <ScrollReveal>
          <Skills />
        </ScrollReveal>

        {/* Section 3: Filterable Bento dynamic database (Experiences & Awards) */}
        <ScrollReveal>
          <PortfolioGrid />
        </ScrollReveal>
      </main>

      {/* Section 4: Footer contact / networking channels */}
      <Footer />

      {/* 8-Bit Ticker / System Connection Log Message Notification */}
      {showSystemLog && (
        <div 
          id="connection-sys-log"
          className="fixed bottom-6 left-6 z-50 bg-slate-905 border-4 border-emerald-500 p-4 font-mono text-xs text-emerald-400 pixel-shadow select-none max-w-xs sm:max-w-md"
        >
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-emerald-400 animate-ping rounded-none shrink-0" />
            <span className="tracking-tight">{typedMessage}</span>
            <span className="w-1.5 h-3.5 bg-emerald-400 animate-pulse inline-block" />
          </div>
        </div>
      )}

      {/* 5. Scroll to Top Floating Button */}
      {showScrollTop && (
        <button
          onClick={handleScrollToTop}
          className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white p-3.5 rounded-full shadow-lg hover:shadow-blue-500/20 hover:-translate-y-1 transition-all duration-300 animate-fade-in group cursor-pointer border border-blue-400/35"
          title="페이지 최상단으로 이동"
        >
          <ArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      )}
    </div>
  );
}
