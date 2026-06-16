import React, { useState, useEffect } from "react";
import { ArrowDown, BookOpen, Sparkles, Sliders, CheckCircle2, Ticket, Music } from "lucide-react";
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
  symbol: string;
  popped: boolean;
}

export default function Hero({ onLearnMore }: HeroProps) {
  // Bubbles pop simulator state
  const [particles, setParticles] = useState<Particle[]>([]);
  const [popScore, setPopScore] = useState(0);

  // Stats Breakdown Clicker State
  const [selectedStatFilter, setSelectedStatFilter] = useState<"all" | "exp" | "award">("all");

  const MUSIC_SYMBOLS = ["🎵", "🎸", "🥁", "⚡", "♬", "🎙️", "🎹", "✨"];

  // Generate background active bubbles on startup
  useEffect(() => {
    const BUBBLE_STYLES = [
      "bg-blue-500/10 border-blue-400/40 text-blue-500 hover:bg-blue-500/20 hover:border-blue-500",
      "bg-cyan-500/10 border-cyan-400/40 text-cyan-500 hover:bg-cyan-500/20 hover:border-cyan-500",
      "bg-indigo-500/15 border-indigo-400/40 text-indigo-500 hover:bg-indigo-500/20 hover:border-indigo-500",
      "bg-emerald-500/10 border-emerald-400/40 text-emerald-500 hover:bg-emerald-500/20 hover:border-emerald-500",
    ];

    const initialParticles = Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      x: Math.random() * 90 + 5, // percentage
      y: Math.random() * 80 + 10,
      size: Math.random() * 16 + 32, // Perfect bubble size: 32px to 48px
      speedY: Math.random() * 0.28 + 0.12,
      color: BUBBLE_STYLES[i % BUBBLE_STYLES.length],
      symbol: MUSIC_SYMBOLS[i % MUSIC_SYMBOLS.length],
      popped: false,
    }));
    setParticles(initialParticles);

    // Continuous float loop
    const interval = setInterval(() => {
      setParticles((prev) =>
        prev.map((p) => {
          if (p.popped) return p;
          let nextY = p.y - p.speedY;
          if (nextY < -10) {
            nextY = 110; // Wrap around to bottom
          }
          return { ...p, y: nextY };
        })
      );
    }, 45);

    return () => clearInterval(interval);
  }, []);

  // Pop interactive balloon
  const handlePop = (id: number) => {
    const BUBBLE_STYLES = [
      "bg-blue-500/10 border-blue-400/40 text-blue-500 hover:bg-blue-500/20 hover:border-blue-500",
      "bg-cyan-500/10 border-cyan-400/40 text-cyan-500 hover:bg-cyan-500/20 hover:border-cyan-500",
      "bg-indigo-500/15 border-indigo-400/40 text-indigo-500 hover:bg-indigo-500/20 hover:border-indigo-500",
      "bg-emerald-500/10 border-emerald-400/40 text-emerald-500 hover:bg-emerald-500/20 hover:border-emerald-500",
    ];

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
                y: 110,
                popped: false,
                x: Math.random() * 90 + 5,
                color: BUBBLE_STYLES[Math.floor(Math.random() * BUBBLE_STYLES.length)],
                symbol: MUSIC_SYMBOLS[Math.floor(Math.random() * MUSIC_SYMBOLS.length)],
              }
            : p
        )
      );
    }, 2000);
  };

  return (
    <section
      id="hero-section"
      className="relative min-h-screen pt-32 pb-24 flex flex-col justify-center items-center overflow-hidden bg-gradient-to-b from-[#eef2f6]/40 via-white/60 to-[#f8fafc]/45 select-none"
    >
      {/* Elegant Radial Background Backlights */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-gradient-to-tr from-blue-400/25 to-cyan-300/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-cyan-400/10 to-indigo-400/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col items-center">
        {/* Intro Badge */}
        <div
          id="hero-intro-badge"
          className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-emerald-50 border border-emerald-200/60 text-emerald-700 rounded-full text-xs font-mono tracking-wider mb-6"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          OFFICIAL WORKSPACE PORTFOLIO
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



        {/* Interactive Stats Grid counter */}
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

        {/* Academic Details - Re-themed as a Festival CREW VIP PASS Ticket */}
        <div
          id="profile-section"
          className="w-full max-w-2xl bg-white border border-slate-250/80 rounded-3xl p-6 sm:p-8 text-left shadow-sm mb-8 relative overflow-hidden group hover:border-blue-500/60 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300"
        >
          {/* Ticket Edge Circle Cutouts */}
          <div className="absolute -left-3 top-1/2 -mt-3 w-6 h-6 rounded-full bg-[#f8fafc] border-r border-slate-200/90 z-10" />
          <div className="absolute -right-3 top-1/2 -mt-3 w-6 h-6 rounded-full bg-[#f8fafc] border-l border-slate-200/90 z-10" />

          {/* Ticket Header Line */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600" />
          
          <div className="flex flex-col md:flex-row gap-6 justify-between relative">
            {/* Main Ticket Content */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Ticket className="w-5 h-5 text-blue-600 shrink-0 animate-pulse" />
                <span className="text-[10px] font-mono font-extrabold tracking-widest text-blue-600 uppercase bg-blue-50 px-2 py-0.5 rounded-md">
                  FESTIVAL CREW VIP PASS
                </span>
                <span className="text-[9px] font-mono font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                  SERIAL: HJY-2026-NEXUS
                </span>
              </div>

              <h3 id="edu-title" className="font-display font-black text-2xl text-slate-900 tracking-tight mb-2 uppercase">
                {PROFILE.education.university}
              </h3>

              <div className="flex items-center gap-1.5 mb-5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-xs font-mono font-bold text-slate-600">
                  {PROFILE.education.graduationState}
                </span>
              </div>

              {/* Majors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                {PROFILE.education.majors.map((major, index) => (
                  <div
                    key={index}
                    id={`major-item-${index}`}
                    className="p-3 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-blue-50/20 hover:border-blue-200/50 transition-all"
                  >
                    <span className="text-[9px] uppercase font-mono tracking-wider text-slate-400 block mb-0.5 font-bold">
                      {major.type}
                    </span>
                    <span className="text-xs font-bold text-slate-800 leading-tight block">
                      {major.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Vertical Tear-off Ticket Stub / Barcode representation */}
            <div className="md:w-32 border-t md:border-t-0 md:border-l border-dashed border-slate-200 pt-5 md:pt-0 md:pl-6 flex flex-col justify-between items-center md:items-start shrink-0">
              <div className="text-center md:text-left">
                <span className="text-[9px] font-mono font-bold text-slate-400 uppercase block">STAGE ACCESS</span>
                <span className="text-xs font-mono font-black text-blue-600 tracking-wider">ALL AREA PASS</span>
              </div>

              {/* Barcode representation */}
              <div className="my-4 flex flex-col items-center md:items-start gap-1">
                <div className="flex gap-[2px] h-9 items-end opacity-85">
                  <div className="w-[3px] h-full bg-slate-900" />
                  <div className="w-[1px] h-4/5 bg-slate-900" />
                  <div className="w-[4px] h-full bg-slate-900" />
                  <div className="w-[2px] h-5/6 bg-slate-900" />
                  <div className="w-[1px] h-full bg-slate-900" />
                  <div className="w-[3px] h-2/3 bg-slate-900" />
                  <div className="w-[1px] h-full bg-slate-900" />
                  <div className="w-[4px] h-4/5 bg-slate-900" />
                  <div className="w-[2px] h-full bg-slate-900" />
                  <div className="w-[1px] h-5/6 bg-slate-900" />
                  <div className="w-[3px] h-full bg-slate-900" />
                </div>
                <span className="text-[8px] font-mono tracking-widest text-slate-400">CONNECT-950724</span>
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
