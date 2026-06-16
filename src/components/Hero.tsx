import React, { useState, useEffect } from "react";
import { ArrowDown, Mail, Phone, Instagram, BookOpen, Star, Sparkles, Sliders, CheckCircle2 } from "lucide-react";
import { PROFILE, EXPERIENCES, AWARDS } from "../data";

interface HeroProps {
  onLearnMore: () => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speedY: number;
  color: string;
  popped: boolean;
}

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

export default function Hero({ onLearnMore }: HeroProps) {
  // Bubbles pop simulator state
  const [particles, setParticles] = useState<Particle[]>([]);
  const [popScore, setPopScore] = useState(0);

  // Mouse trajectory following coordinates
  const [mousePos, setMousePos] = useState({ x: -200, y: -200 });
  const [isMouseActive, setIsMouseActive] = useState(false);

  // Concentric click ripples list
  const [clickRipples, setClickRipples] = useState<DynamicRipple[]>([]);

  // Stats Breakdown Clicker State
  const [selectedStatFilter, setSelectedStatFilter] = useState<"all" | "exp" | "award">("all");

  // Generate background active bubbles on startup
  useEffect(() => {
    const initialParticles = Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      x: Math.random() * 90 + 5, // percentage
      y: Math.random() * 80 + 10,
      size: Math.random() * 25 + 15,
      speedY: Math.random() * 0.35 + 0.15,
      color: [
        "bg-blue-500/10 border-blue-400/40",
        "bg-cyan-500/10 border-cyan-400/40",
        "bg-indigo-500/15 border-indigo-400/40",
      ][Math.floor(Math.random() * 3)],
      popped: false,
    }));
    setParticles(initialParticles);

    // Continuous float loop
    const interval = setInterval(() => {
      setParticles((prev) =>
        prev.map((p) => {
          if (p.popped) return p;
          let nextY = p.y - p.speedY;
          if (nextY < -5) {
            nextY = 105; // Wrap around to bottom
          }
          return { ...p, y: nextY };
        })
      );
    }, 45);

    return () => clearInterval(interval);
  }, []);

  // Pop interactive balloon
  const handlePop = (id: number) => {
    setParticles((prev) =>
      prev.map((p) => (p.id === id ? { ...p, popped: true } : p))
    );
    setPopScore((s) => s + 1);

    // Respawn after 2 seconds at the base bottom
    setTimeout(() => {
      setParticles((prev) =>
        prev.map((p) =>
          p.id === id
            ? {
                ...p,
                y: 105,
                popped: false,
                x: Math.random() * 90 + 5,
              }
            : p
        )
      );
    }, 2000);
  };

  // Mouse trajectory listener
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });
    setIsMouseActive(true);
  };

  // Turn off follower circles when cursor exits Hero area
  const handleMouseLeave = () => {
    setIsMouseActive(false);
  };

  // Spawn concentric ripples upon clicking space
  const handleHeroClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    // Prevent interfering with actual buttons, links, or pop tabs
    if (target.closest("button") || target.closest("a")) {
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newRipple = { id: Date.now() + Math.random(), x, y };
    setClickRipples((prev) => [...prev, newRipple]);

    // Cleanup ripple after animation finishes (0.9s duration)
    setTimeout(() => {
      setClickRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 900);
  };

  // Custom lagging configurations for fluid physics-like visual feedback
  const followerBubbles: FollowerBubble[] = [
    { size: 90, delay: "duration-150", color: "from-blue-400/20 to-cyan-300/10", offsetX: -45, offsetY: -45 },
    { size: 140, delay: "duration-300", color: "from-indigo-400/10 to-blue-500/10", offsetX: -70, offsetY: -70 },
    { size: 60, delay: "duration-200", color: "from-blue-500/25 to-sky-400/20", offsetX: -30, offsetY: -30 },
    { size: 110, delay: "duration-500", color: "from-cyan-400/15 to-indigo-500/15", offsetX: -55, offsetY: -55 },
    { size: 45, delay: "duration-100", color: "from-sky-300/30 to-blue-400/20", offsetX: -22, offsetY: -22 },
    { size: 185, delay: "duration-700", color: "from-blue-600/5 to-cyan-500/5", offsetX: -92, offsetY: -92 },
  ];

  return (
    <section
      id="hero-section"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleHeroClick}
      className="relative min-h-screen pt-32 pb-24 flex flex-col justify-center items-center overflow-hidden bg-gradient-to-b from-[#eef2f6] via-white to-[#f8fafc] cursor-crosshair select-none"
    >
      {/* 1. Mouse-following translucent blue bubbles (Trailing Physics effect) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {isMouseActive &&
          followerBubbles.map((bubble, i) => (
            <div
              key={i}
              style={{
                transform: `translate3d(${mousePos.x + bubble.offsetX}px, ${mousePos.y + bubble.offsetY}px, 0)`,
                width: `${bubble.size}px`,
                height: `${bubble.size}px`,
              }}
              className={`absolute rounded-full bg-gradient-to-tr ${bubble.color} backdrop-blur-3xs border border-blue-400/20 transition-transform ${bubble.delay} ease-out pointer-events-none`}
            />
          ))}
      </div>

      {/* 2. Dynamic Concentric Click Blue Ring Ripples */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {clickRipples.map((ripple) => (
          <div
            key={ripple.id}
            style={{
              left: `${ripple.x}px`,
              top: `${ripple.y}px`,
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2"
          >
            <div className="absolute w-24 h-24 -left-12 -top-12 rounded-full border-2 border-blue-500/50 animate-[ping_0.9s_ease-out_forwards]" />
            <div className="absolute w-14 h-14 -left-7 -top-7 rounded-full border border-cyan-400/60 animate-[ping_0.7s_ease-out_0.1s_forwards]" />
            <div className="absolute w-6 h-6 -left-3 -top-3 rounded-full bg-blue-500/10 animate-[ping_0.5s_ease-out_0.2s_forwards]" />
          </div>
        ))}
      </div>

      {/* 3. Pop Bubble Game Score Bar */}
      <div className="absolute inset-0 z-0 pointer-events-auto">
        <div className="absolute top-6 right-6 px-3.5 py-2 bg-blue-600/10 border border-blue-200/50 rounded-full text-[10px] font-mono text-blue-700 backdrop-blur-xs flex items-center gap-1.5 shadow-3xs animate-bounce">
          <Sparkles className="w-3.5 h-3.5 animate-spin text-blue-500" />
          <span>BLUE BUBBLE POP SCORE: {popScore}</span>
        </div>

        {/* Float bubble buttons */}
        {particles.map((p) => (
          <button
            key={p.id}
            onClick={() => handlePop(p.id)}
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
            }}
            className={`absolute rounded-full border transition-all duration-200 hover:scale-130 active:scale-90 cursor-pointer z-10 ${
              p.popped ? "scale-0 opacity-0 bg-transparent border-transparent" : p.color
            } flex items-center justify-center`}
            title="Click to pop!"
          >
            <span className="w-1.5 h-1.5 bg-blue-400/40 rounded-full animate-ping" />
          </button>
        ))}
      </div>

      {/* Elegant Radial Background Backlights */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-gradient-to-tr from-blue-400/25 to-cyan-300/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-cyan-400/10 to-indigo-400/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col items-center">
        {/* Intro Badge */}
        <div
          id="hero-intro-badge"
          className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-blue-50 border border-blue-200/60 text-blue-700 rounded-full text-xs font-mono tracking-wider mb-6 animate-sparkle"
        >
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
          BLUE CONNECTIVE PORTFOLIO
        </div>

        {/* Name Title */}
        <h1
          id="hero-title"
          className="font-display font-extrabold text-5xl sm:text-6xl md:text-7xl text-slate-900 tracking-tight leading-[1.12] max-w-4xl mb-6"
        >
          {PROFILE.name}
        </h1>

        {/* Small Tagline */}
        <p
          id="hero-tagline"
          className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed mb-8 font-normal"
        >
          {PROFILE.tagline}
        </p>

        {/* Contacts row */}
        <div id="hero-social-grid" className="flex flex-wrap justify-center gap-3 mb-10">
          <a
            id="link-mail"
            href={`mailto:${PROFILE.email}`}
            className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 hover:border-blue-500 hover:text-blue-600 hover:shadow-md text-xs font-semibold text-slate-800 rounded-xl transition-all shadow-3xs"
          >
            <Mail className="w-4 h-4 text-blue-500" />
            {PROFILE.email}
          </a>
          <a
            id="link-phone"
            href={`tel:${PROFILE.phone}`}
            className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 hover:border-amber-500 hover:text-amber-600 hover:shadow-md text-xs font-semibold text-slate-800 rounded-xl transition-all shadow-3xs"
          >
            <Phone className="w-4 h-4 text-amber-500" />
            {PROFILE.phone}
          </a>
          <a
            id="link-instagram"
            href={PROFILE.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 hover:border-pink-500 hover:text-pink-600 hover:shadow-md text-xs font-semibold text-slate-800 rounded-xl transition-all shadow-3xs"
          >
            <Instagram className="w-4 h-4 text-pink-500" />
            {PROFILE.instagram}
          </a>
        </div>

        {/* Interactive Interactive Stats Grid counter */}
        <div className="w-full max-w-2xl mb-12 bg-white/75 backdrop-blur-xs border border-slate-200/80 rounded-2xl p-4 shadow-3xs grid grid-cols-3 gap-2">
          <button
            onClick={() => setSelectedStatFilter("all")}
            className={`py-3 px-2 rounded-xl text-center transition-all cursor-pointer ${
              selectedStatFilter === "all"
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-slate-50 hover:bg-slate-100 text-slate-700"
            }`}
          >
            <span className="block text-[10px] font-mono tracking-widest uppercase opacity-80">전체 기록</span>
            <span className="text-xl sm:text-2xl font-bold font-display">{EXPERIENCES.length + AWARDS.length}건</span>
          </button>
          <button
            onClick={() => setSelectedStatFilter("exp")}
            className={`py-3 px-2 rounded-xl text-center transition-all cursor-pointer ${
              selectedStatFilter === "exp"
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-slate-50 hover:bg-slate-100 text-slate-700"
            }`}
          >
            <span className="block text-[10px] font-mono tracking-widest uppercase opacity-80">기획 및 실습</span>
            <span className="text-xl sm:text-2xl font-bold font-display">{EXPERIENCES.length}건</span>
          </button>
          <button
            onClick={() => setSelectedStatFilter("award")}
            className={`py-3 px-2 rounded-xl text-center transition-all cursor-pointer ${
              selectedStatFilter === "award"
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-slate-50 hover:bg-slate-100 text-slate-700"
            }`}
          >
            <span className="block text-[10px] font-mono tracking-widest uppercase opacity-80">수상 이력</span>
            <span className="text-xl sm:text-2xl font-bold font-display">{AWARDS.length}건</span>
          </button>
        </div>

        {/* Current Stat filter dynamic preview popup block (shows her real data but stylized beautifully) */}
        <div className="w-full max-w-2xl text-left bg-gradient-to-r from-blue-900 to-indigo-950 text-white mb-16 rounded-2xl p-6 sm:p-8 shadow-md border border-blue-900/40 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-blue-500/20 text-blue-300 text-[9px] font-mono tracking-widest uppercase px-3 py-1 rounded-bl-xl border-l border-b border-blue-700/30">
            SYSTEM COUNTER ACTIVE
          </div>
          <h4 className="text-xs font-mono tracking-widest text-blue-300 font-bold uppercase mb-4 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5" />
            {selectedStatFilter === "all"
              ? "통합 포트폴리오 기여 지표"
              : selectedStatFilter === "exp"
              ? "기획 전문가 도약 여정"
              : "공식 어워드 라인업"}
          </h4>

          {selectedStatFilter === "all" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs border-b border-white/10 pb-2">
                <span className="text-slate-300">총 기획&활동 항목</span>
                <span className="font-mono font-bold text-blue-300">{EXPERIENCES.length}개 교내외 활동 기획</span>
              </div>
              <div className="flex items-center justify-between text-xs border-b border-white/10 pb-2">
                <span className="text-slate-300">총 어워드 수상</span>
                <span className="font-mono font-bold text-blue-300">{AWARDS.length}개 공식 대회 수상</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300">융합 학사 과정 주·복수전공</span>
                <span className="font-mono font-bold text-blue-300">2개 전공 융합</span>
              </div>
            </div>
          )}

          {selectedStatFilter === "exp" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs border-b border-white/10 pb-2">
                <span className="text-slate-300">동아리 기획 회장/부회장단 활동</span>
                <span className="font-semibold text-blue-300">CON:NECT 및 DS4H 리더십</span>
              </div>
              <div className="flex items-center justify-between text-xs border-b border-white/10 pb-2">
                <span className="text-slate-300">지자체 밀착 로컬 실무 프로젝트</span>
                <span className="font-semibold text-blue-300">안녕하는사이 현장 실습</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300">글로벌 지산학 리더십 실천</span>
                <span className="font-semibold text-blue-300">한림대 & 달랏대 국제 워크숍</span>
              </div>
            </div>
          )}

          {selectedStatFilter === "award" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs border-b border-white/10 pb-2">
                <span className="text-slate-300">교육부 주최 전국 에듀테크 해커톤</span>
                <span className="font-semibold text-blue-300">대상 수상 (강릉 가뭄 서비스)</span>
              </div>
              <div className="flex items-center justify-between text-xs border-b border-white/10 pb-2">
                <span className="text-slate-300">덕업일치 덕후양성소 직업창직대회</span>
                <span className="font-semibold text-blue-300">3위 달성 (유니버셜 디자인 컨설턴트)</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300">기말 학술대회 우수 전시 프로젝트</span>
                <span className="font-semibold text-blue-300">최우수상 및 다수 우수상 석권</span>
              </div>
            </div>
          )}
        </div>

        {/* Academic Details Card */}
        <div
          id="profile-section"
          className="w-full max-w-2xl bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 text-left shadow-sm mb-16 relative overflow-hidden group hover:border-blue-400/60 hover:shadow-md transition-all duration-300"
        >
          <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-600" />
          <div className="flex items-start gap-4 flex-col sm:flex-row">
            <div className="bg-blue-50 text-blue-600 p-3 rounded-2xl shrink-0 group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6 border-transparent" />
            </div>
            <div className="flex-1 w-full">
              <h3 id="edu-title" className="font-display font-bold text-xs text-blue-600 mb-2 uppercase tracking-wider flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> EDUCATION (학력)
              </h3>
              <p className="text-sm font-semibold text-slate-750 mb-4 flex flex-wrap items-center gap-2">
                <span className="text-base text-slate-900 font-bold">{PROFILE.education.university}</span>
                <span className="text-xs font-mono bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-full text-blue-600 font-bold">
                  {PROFILE.education.graduationState}
                </span>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PROFILE.education.majors.map((major, index) => (
                  <div
                    key={index}
                    id={`major-item-${index}`}
                    className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-blue-50/20 hover:border-blue-200/50 transition-all shadow-3xs"
                  >
                    <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block mb-0.5 font-bold">
                      {major.type}
                    </span>
                    <span className="text-xs font-bold text-slate-800 leading-tight block">
                      {major.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Explore Button */}
        <button
          id="btn-trigger-learn-more"
          onClick={onLearnMore}
          className="flex flex-col items-center gap-1.5 text-xs font-mono tracking-widest text-slate-450 py-2 hover:text-blue-600 transition-colors cursor-pointer group"
        >
          <span className="font-bold">자세히 보기</span>
          <ArrowDown className="w-4 h-4 animate-bounce group-hover:translate-y-0.5 transition-transform text-blue-500" />
        </button>
      </div>
    </section>
  );
}
