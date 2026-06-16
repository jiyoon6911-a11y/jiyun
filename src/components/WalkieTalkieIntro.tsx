import React, { useState, useEffect } from "react";
import { Radio, Volume2, VolumeX, Wifi, Sparkles } from "lucide-react";

interface WalkieTalkieIntroProps {
  onEnter: () => void;
}

export default function WalkieTalkieIntro({ onEnter }: WalkieTalkieIntroProps) {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [displayFreq, setDisplayFreq] = useState("87.50");

  // Audio Context refs for Walkie Talkie sounds
  const audioCtxRef = React.useRef<AudioContext | null>(null);

  // Play synthetic walkie talkie static and roger beep sounds
  const playSound = (type: "roger-beep" | "static-burst" | "tuning-beep") => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      if (type === "roger-beep") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "sine";
        osc.frequency.setValueAtTime(1100, ctx.currentTime);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.setValueAtTime(0.12, ctx.currentTime + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
        osc.start();
        osc.stop(ctx.currentTime + 0.18);
      } else if (type === "static-burst") {
        const bufferSize = ctx.sampleRate * 0.18;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.setValueAtTime(900, ctx.currentTime);
        filter.Q.setValueAtTime(1.5, ctx.currentTime);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
        
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        noise.start();
      } else if (type === "tuning-beep") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "square"; // Retro 8-bit sound
        osc.frequency.setValueAtTime(Math.random() * 600 + 400, ctx.currentTime);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
      }
    } catch (e) {
      console.warn("Audio Context error: ", e);
    }
  };

  // Initial load up beep
  useEffect(() => {
    const timer = setTimeout(() => {
      playSound("roger-beep");
      setDisplayFreq("95.07");
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  // Frequency auto-tuning feedback simulation on connection
  useEffect(() => {
    if (isConnecting) {
      let ticks = 0;
      const interval = setInterval(() => {
        // Fast random frequencies simulation
        const randomVal = (Math.random() * (108.0 - 87.5) + 87.5).toFixed(2);
        setDisplayFreq(randomVal);
        playSound("tuning-beep");
        ticks++;
        
        if (ticks > 12) {
          clearInterval(interval);
          setDisplayFreq("95.07"); // Lock correctly to Hong Jiyoon's channel
          playSound("roger-beep");
          
          // Complete and transition
          setTimeout(() => {
            setIsUnlocked(true);
            setTimeout(() => {
              onEnter();
            }, 550);
          }, 400);
        }
      }, 55);

      return () => clearInterval(interval);
    }
  }, [isConnecting]);

  const handleEnterTransmission = () => {
    if (isConnecting) return;
    setIsConnecting(true);
    playSound("static-burst");
  };

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-950 px-4 transition-all duration-700 select-none ${
        isUnlocked ? "opacity-0 scale-105 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* 8-bit visual background style */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from- emerald-950/20 via-slate-950 to-black pointer-events-none z-0" />
      
      {/* Dynamic 8bit Scanline Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_50%,_rgba(0,0,0,0.4)_50%)] bg-[length:100%_8px] pointer-events-none z-10 crt-effect" />

      {/* Main Pixel Art Transceiver Unit (Beveled solid borders) */}
      <div className="w-full max-w-[340px] bg-slate-800 border-[6px] border-slate-950 p-5 shadow-[12px_12px_0px_0px_#000] relative z-20 flex flex-col gap-4 font-mono">
        
        {/* Pixel style Antennas */}
        <div className="absolute -top-7 left-8 flex flex-col items-center pointer-events-none select-none">
          <div className="w-5 h-2 bg-slate-950" />
          <div className="w-3 h-5 bg-slate-600 border-x-[3px] border-slate-950" />
          <div className="w-1.5 h-3 bg-emerald-500 animate-pulse border-x-[1.5px] border-slate-950" />
        </div>
        <div className="absolute -top-11 left-22 flex flex-col items-center pointer-events-none select-none">
          <div className="w-4 h-2 bg-slate-950" />
          <div className="w-2 h-9 bg-slate-500 border-x-[2px] border-slate-950" />
        </div>

        {/* Dynamic Side PTT Bumper style decorators */}
        <div className="absolute -left-[18px] top-12 w-[12px] h-14 bg-slate-900 border-[4px] border-r-0 border-slate-950" />
        <div className="absolute -right-[18px] top-1/3 w-[12px] h-10 bg-slate-900 border-[4px] border-l-0 border-slate-950" />

        {/* Head Bar: Power Indicator & Volume Sound Toggle Button */}
        <div className="flex items-center justify-between text-slate-400 select-none border-b-4 border-slate-950 pb-2">
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-bold text-emerald-400 tracking-tight">
              [HJY_NXS26]
            </span>
          </div>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1 px-2.5 bg-slate-950 border-[3px] border-slate-900 text-[8px] font-bold flex items-center gap-1 hover:border-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer text-slate-300 active:translate-y-0.5"
            style={{ imageRendering: "pixelated" }}
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                <span>SOUND UNMUTE</span>
              </>
            ) : (
              <>
                <VolumeX className="w-2.5 h-2.5 text-slate-450 shrink-0" />
                <span>SOUND MUTE</span>
              </>
            )}
          </button>
        </div>

        {/* LCD Glowing Green screen */}
        <div className="bg-emerald-950 border-[4px] border-slate-950 p-3.5 shadow-[inset_4px_4px_0px_#000000] relative overflow-hidden">
          {/* Glass glint / 8bit overlay dots */}
          <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(#fff_1px,transparent_1px)] bg-[size:3px_3px] pointer-events-none" />

          <div className="flex items-center justify-between border-b-2 border-dashed border-emerald-900/40 pb-1.5 mb-1.5">
            <div className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 bg-emerald-400 rounded-none shrink-0 ${isConnecting ? "animate-ping" : "animate-pulse"}`} />
              <span className="text-[9px] font-black text-emerald-400 tracking-wider">
                {isConnecting ? "TUNING_FREQ..." : "FREQ_ONLINE"}
              </span>
            </div>
            
            <div className="flex gap-[3px] items-end h-3">
              <div className="w-[3px] h-1 bg-emerald-400" />
              <div className="w-[3px] h-2 bg-emerald-400" />
              <div className="w-[3px] h-1.5 bg-emerald-400" />
              <div className="w-[3px] h-3 bg-emerald-400 animate-pulse" />
            </div>
          </div>

          {/* Central Big Frequency display screen */}
          <div className="text-center py-1 select-none">
            <span className="text-[8px] font-bold text-emerald-500 block tracking-widest uppercase">
              {isConnecting ? "[ TUNING DIAL ]" : "[ CO-CREATOR DEV ]"}
            </span>

            <div className="my-1.5 flex items-center justify-center gap-1.5">
              <span className="text-3xl font-bold text-emerald-400 tracking-tighter pixel-outline-text-emerald">
                {displayFreq}
              </span>
              <span className="text-[10px] font-bold text-emerald-500">MHz</span>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[8.5px] text-emerald-400/80">
              <span>RX: -41dBm</span>
              <span>•</span>
              <span>CH:0724</span>
            </div>
          </div>
        </div>

        {/* Speaker matrix layout using retro stripes */}
        <div className="bg-slate-950 border-[3px] border-slate-900 p-2.5 flex flex-col gap-1.5 opacity-90 select-none">
          <div className="h-1 bg-slate-800 w-full" />
          <div className="h-1 bg-slate-800 w-11/12 mx-auto" />
          <div className="h-1 bg-slate-800 w-4/5 mx-auto" />
          <div className="h-1 bg-slate-800 w-2/3 mx-auto" />
        </div>

        {/* Clean concise Walkie Talkie information */}
        <div className="bg-slate-950 p-3 border-[3px] border-slate-900 text-[10px] text-emerald-400 flex flex-col gap-1 shadow-inner select-none">
          <div className="flex items-center gap-1.5">
            <span className="text-emerald-500">▶</span>
            <span>TARGET: 기획자 홍지윤 무전</span>
          </div>
          <div className="flex items-center gap-1.5 text-zinc-400">
            <span className="text-zinc-600">▶</span>
            <span>STATUS: 무전대기완료</span>
          </div>
          <div className="flex items-center gap-1.5 text-amber-400 animate-pulse">
            <span className="text-amber-500">▶</span>
            <span>입장 버튼을 클릭하시오</span>
          </div>
        </div>

        {/* Big Retro Action Connect Button */}
        <div>
          <button
            onClick={handleEnterTransmission}
            disabled={isConnecting}
            className={`w-full py-4 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-900 text-slate-950 font-black text-xs tracking-widest uppercase transition-all border-b-[5px] border-emerald-700 active:border-b-0 active:mt-[5px] cursor-pointer shadow-[4px_4px_0_0_#000] flex items-center justify-center gap-1.5 ${
              isConnecting ? "border-b-0 mt-[5px]" : ""
            }`}
          >
            <Wifi className={`w-3.5 h-3.5 text-slate-950 ${isConnecting ? "animate-spin" : ""}`} />
            <span>{isConnecting ? "주파수 매칭 중..." : "무전 연결 & 입장_"}</span>
          </button>
        </div>

      </div>

      {/* Styled pixel metadata caption */}
      <div className="mt-6 text-center max-w-xs relative z-10 text-slate-450 px-4">
        <p className="text-xs font-bold leading-normal text-slate-300 flex items-center justify-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>기획자 홍지윤의 오피셜 스테이지</span>
        </p>
        <span className="text-[10px] font-mono text-slate-600 mt-1 block">
          [ MODEL_HJY_NXS26 ]
        </span>
      </div>
    </div>
  );
}
