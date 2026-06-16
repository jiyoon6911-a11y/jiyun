import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, Volume2, Music, Disc, Sparkles, Radio, Activity, HelpCircle } from "lucide-react";

interface Track {
  name: string;
  sub: string;
  genre: string;
  tempo: number;
  freqs: number[];
  baseNote: number;
}

const FESTIVAL_TRACKS: Track[] = [
  {
    name: "Incheon Pentaport Rock Live",
    sub: "2026 펜타 드리머 글로벌 메인 무대",
    genre: "Indie Rock / Post-Punk",
    tempo: 128,
    freqs: [130.81, 146.83, 164.81, 196.00, 220.00, 261.63], // C3, D3, E3, G3, A3, C4
    baseNote: 130.81,
  },
  {
    name: "Me+Youth Festival Concert",
    sub: "대한민국 청년의 날 메인 아티스트 크루",
    genre: "Synth-Pop / Dance",
    tempo: 115,
    freqs: [146.83, 174.61, 196.00, 220.00, 293.66, 329.63], // D3, F3, G3, A3, D4, E4
    baseNote: 146.83,
  },
  {
    name: "Chuncheon Puppetry Theme",
    sub: "춘천인형극제 코코미 월드 비트",
    genre: "Acoustic Folk / Dreamy",
    tempo: 96,
    freqs: [164.81, 196.00, 220.00, 246.94, 329.63, 392.00], // E3, G3, A3, B3, E4, G4
    baseNote: 164.81,
  },
];

export default function FestivalMixer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIdx, setCurrentTrackIdx] = useState(0);
  const [volume, setVolume] = useState(0.4);
  const [eqHeights, setEqHeights] = useState<number[]>([15, 30, 45, 20, 60, 40, 15, 35, 50, 20, 10]);
  const [drumMute, setDrumMute] = useState({ synth: false, bass: false, lead: false });
  const [synthPreset, setSynthPreset] = useState<"sawtooth" | "triangle" | "sine">("triangle");
  
  // Web Audio Context refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const playIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const beatCounterRef = useRef(0);

  const track = FESTIVAL_TRACKS[currentTrackIdx];

  // Start sound system safely on user interaction
  const initAudioCtx = () => {
    if (!audioCtxRef.current) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        audioCtxRef.current = new AudioContextClass();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
  };

  // Play synthesized note helper
  const playSynthNote = (freq: number, duration: number = 0.25, type: OscillatorType = "sine") => {
    initAudioCtx();
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      
      // Volume envelope
      gain.gain.setValueAtTime(volume * 0.45, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn("Audio Synthesizer Failed:", e);
    }
  };

  // Continuous auto loop beat scheduler
  useEffect(() => {
    if (isPlaying) {
      initAudioCtx();
      
      // Calculate beat step interval in ms based on tempo (quarter notes)
      const beatIntervalMs = (60 / track.tempo) * 500; // eighth notes

      playIntervalRef.current = setInterval(() => {
        const beatNum = beatCounterRef.current;
        const freqs = track.freqs;
        
        // Simple algorithmic arpeggio sequence based on beat
        const noteIndex = (beatNum * 3 + (beatNum % 4)) % freqs.length;
        const freq = freqs[noteIndex];

        // Drum tick synthesis simulation (Kick / Snare alternative)
        if (beatNum % 4 === 0 && !drumMute.bass) {
          // Deep Kick drum synthesis
          playSynthNote(55, 0.2, "sine");
        } else if (beatNum % 4 === 2 && !drumMute.synth) {
          // High-pass styled tick/snare (white noise simulation with short pulse)
          playSynthNote(450, 0.08, "triangle");
        }

        // Melodic synthesizer step
        if (!drumMute.lead && (beatNum % 8 !== 7)) {
          const shiftOctave = beatNum % 16 > 11 ? 2 : 1;
          playSynthNote(freq * shiftOctave, 0.18, synthPreset);
        }

        // Update equalizer animations dynamically reflecting actual note playing
        setEqHeights((prev) =>
          prev.map((val, idx) => {
            const harmonicRelation = (noteIndex + idx) % 5;
            const factor = harmonicRelation * 18 + 12;
            return Math.min(100, Math.max(10, factor + Math.floor(Math.random() * 25)));
          })
        );

        beatCounterRef.current = (beatCounterRef.current + 1) % 32;
      }, beatIntervalMs);
    } else {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
        playIntervalRef.current = null;
      }
    }

    return () => {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
      }
    };
  }, [isPlaying, currentTrackIdx, volume, drumMute, synthPreset]);

  // Toggle master audio
  const handlePlayToggle = () => {
    initAudioCtx();
    setIsPlaying(!isPlaying);
  };

  // Trigger local synth pads (Drum Machine style)
  const triggerDrumPad = (noteType: "kick" | "snare" | "hihat" | "synthbell") => {
    initAudioCtx();
    if (noteType === "kick") {
      playSynthNote(60, 0.25, "sine");
    } else if (noteType === "snare") {
      playSynthNote(350, 0.15, "triangle");
    } else if (noteType === "hihat") {
      playSynthNote(900, 0.04, "sine");
    } else if (noteType === "synthbell") {
      // Harmonic synth cord
      playSynthNote(track.baseNote * 2, 0.4, "triangle");
      setTimeout(() => playSynthNote(track.baseNote * 3, 0.3, "triangle"), 70);
    }

    // Bounce visualizer columns on manual tap
    setEqHeights((prev) => prev.map((h) => Math.min(100, h + 25)));
  };

  return (
    <div
      id="festival-sound-mixer"
      className="bg-slate-900 text-white rounded-3xl p-6 shadow-2xl border border-slate-800 relative overflow-hidden transition-all duration-300 hover:border-blue-500/50 hover:shadow-[0_8px_30px_rgb(29,78,216,0.15)] group"
    >
      {/* Tape visual decoration background glow */}
      <div className="absolute -right-16 -bottom-16 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-blue-500/15 transition-all" />

      {/* Decorative Festival Header tape */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[10px] font-mono tracking-widest text-slate-400 font-extrabold uppercase">
            LIVE DAH FEST_ MIXER V1.0
          </span>
        </div>
        <div className="flex items-center gap-1 bg-blue-950 px-2.5 py-1 rounded-md border border-blue-900/35">
          <Activity className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-[9px] font-mono tracking-wider text-blue-300 font-bold">
            {isPlaying ? "ACTIVE SYNC" : "STANDBY"}
          </span>
        </div>
      </div>

      {/* Center Layout: Main Screen */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mb-5">
        {/* Left 7 Columns - Now Playing, Equalizer, Controls */}
        <div className="md:col-span-8 space-y-4">
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 relative">
            <span className="text-[9px] font-mono text-cyan-400 block mb-1 uppercase tracking-wider font-bold">
              ★ {track.genre} (Tempo: {track.tempo} BPM)
            </span>
            <h4 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Disc className={`w-5 h-5 text-blue-500 ${isPlaying ? "animate-spin" : ""}`} />
              {track.name}
            </h4>
            <p className="text-xs text-slate-400 mt-1">{track.sub}</p>

            {/* Virtual Real Equalizer Graphic */}
            <div className="h-16 flex items-end gap-1.5 mt-5 px-1 pb-1 border-b border-slate-800/40">
              {eqHeights.map((height, i) => (
                <div
                  key={i}
                  style={{ height: `${isPlaying ? height : Math.max(10, (11 - i) * 6)}%` }}
                  className="flex-1 bg-gradient-to-t from-blue-600 via-cyan-400 to-blue-300 rounded-t-sm transition-all duration-100 ease-out min-h-[4px]"
                />
              ))}
            </div>
          </div>

          {/* Quick Track Select */}
          <div className="flex flex-wrap gap-2">
            {FESTIVAL_TRACKS.map((t, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentTrackIdx(index);
                  playSynthNote(t.baseNote, 0.4, "triangle");
                }}
                className={`text-[10px] font-semibold px-3 py-2 rounded-xl border transition-all cursor-pointer ${
                  currentTrackIdx === index
                    ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white border-blue-500 shadow-sm shadow-blue-500/20"
                    : "bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white"
                }`}
              >
                ST-0{index + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Right 4 Columns - Play controls, Mixer knobs */}
        <div className="md:col-span-4 bg-slate-950/40 border border-slate-800/50 rounded-2xl p-4 flex flex-col justify-between">
          <div>
            <span className="text-[9px] font-mono text-slate-400 block mb-2 font-bold uppercase tracking-wider">
              Synth Timbre
            </span>
            <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
              {(["sine", "triangle", "sawtooth"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setSynthPreset(type);
                    playSynthNote(track.baseNote, 0.2, type);
                  }}
                  className={`text-[9px] font-mono py-1 rounded-md uppercase transition-all font-bold cursor-pointer ${
                    synthPreset === type
                      ? "bg-slate-800 text-cyan-400 font-extrabold"
                      : "text-slate-500 hover:text-slate-350"
                  }`}
                >
                  {type.substring(0, 4)}
                </button>
              ))}
            </div>
          </div>

          {/* Volume Control */}
          <div className="my-4">
            <div className="flex justify-between items-center text-[10px] mb-1">
              <span className="text-slate-400 font-mono flex items-center gap-1.5 font-bold uppercase">
                <Volume2 className="w-3.5 h-3.5 text-blue-500" /> Web Synth Vol
              </span>
              <span className="font-mono text-cyan-400 font-bold">{Math.round(volume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          {/* Large Master Trigger Button */}
          <button
            onClick={handlePlayToggle}
            className={`w-full py-2.5 px-4 rounded-xl font-display font-medium text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer ${
              isPlaying
                ? "bg-red-600 hover:bg-red-700 text-white animate-pulse"
                : "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/10"
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-white" /> Live Stop
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" /> Live Mix Auto Sync
              </>
            )}
          </button>
        </div>
      </div>

      {/* Bottom Row: Interactive Drum & Melody Pads */}
      <div className="border-t border-slate-800/80 pt-5">
        <div className="flex justify-between items-center mb-3">
          <span className="text-[10px] font-mono text-slate-400 font-extrabold uppercase tracking-wide flex items-center gap-1.5">
            <Radio className="w-4 h-4 text-cyan-400 animate-pulse" /> Manual Live Sequencer Pads (직접 탭하여 사운드 연주!)
          </span>
          <span className="text-[9px] font-mono text-blue-400 font-bold">Latency: Realtime</span>
        </div>

        {/* 4 Pads Grid */}
        <div className="grid grid-cols-4 gap-2.5">
          <button
            onClick={() => triggerDrumPad("kick")}
            className="py-3 px-1.5 bg-slate-950 border border-slate-800 rounded-xl hover:border-blue-500 hover:bg-slate-900 active:scale-95 transition-all text-center cursor-pointer group"
          >
            <span className="block text-[10px] font-mono font-bold text-slate-400 group-hover:text-blue-400 transition-colors">
              KICK BASS
            </span>
            <span className="text-[8px] text-slate-600 font-mono uppercase font-bold block mt-0.5">PAD 01</span>
          </button>

          <button
            onClick={() => triggerDrumPad("snare")}
            className="py-3 px-1.5 bg-slate-950 border border-slate-800 rounded-xl hover:border-cyan-500 hover:bg-slate-900 active:scale-95 transition-all text-center cursor-pointer group"
          >
            <span className="block text-[10px] font-mono font-bold text-slate-400 group-hover:text-cyan-400 transition-colors">
              SNARE CRUNCH
            </span>
            <span className="text-[8px] text-slate-600 font-mono uppercase font-bold block mt-0.5">PAD 02</span>
          </button>

          <button
            onClick={() => triggerDrumPad("hihat")}
            className="py-3 px-1.5 bg-slate-950 border border-slate-800 rounded-xl hover:border-yellow-500 hover:bg-slate-900 active:scale-95 transition-all text-center cursor-pointer group"
          >
            <span className="block text-[10px] font-mono font-bold text-slate-400 group-hover:text-yellow-400 transition-colors">
              HI-HAT TICK
            </span>
            <span className="text-[8px] text-slate-600 font-mono uppercase font-bold block mt-0.5">PAD 03</span>
          </button>

          <button
            onClick={() => triggerDrumPad("synthbell")}
            className="py-3 px-1.5 bg-slate-950 border border-slate-800 rounded-xl hover:border-purple-500 hover:bg-slate-900 active:scale-95 transition-all text-center cursor-pointer group"
          >
            <span className="block text-[10px] font-mono font-bold text-slate-400 group-hover:text-purple-400 transition-colors">
              CHORD RING
            </span>
            <span className="text-[8px] text-slate-600 font-mono uppercase font-bold block mt-0.5">PAD 04</span>
          </button>
        </div>
      </div>
      
      {/* Help Note */}
      <div className="flex items-center gap-1.5 mt-4 text-[9px] text-slate-500 font-semibold leading-normal">
        <Sparkles className="w-3 h-3 text-blue-500 shrink-0" />
        <span>위 오토 믹서 혹은 패드를 탭하면 웹 오디오 합성 기법을 통해 실제 아날로그 신디사이저 음악이 재생됩니다.</span>
      </div>
    </div>
  );
}
