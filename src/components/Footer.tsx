import { useState } from "react";
import { Mail, Phone, Instagram, Youtube, BookOpen, MapPin, Send, Sparkles, AlertCircle } from "lucide-react";
import { PROFILE } from "../data";

export default function Footer() {
  const [customMsg, setCustomMsg] = useState("");
  const [sentStatus, setSentStatus] = useState<string | null>(null);

  const presetMessages = [
    "💙 지윤님의 에듀테크 해커톤 가뭄 극복 서비스 수상이 인상 깊습니다!",
    "🎓 주전공 디지털인문예술 x 디지털미디어콘텐츠 복합 설계 역량에 큰 감명을 받았습니다.",
    "🚀 영상 기획 및 공모전 28선에 대한 대외 협업 제안하고 싶습니다!",
  ];

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;
    setSentStatus("sending");
    
    setTimeout(() => {
      setSentStatus("success");
      setCustomMsg("");
      
      // Hide status after 3 seconds
      setTimeout(() => {
        setSentStatus(null);
      }, 5000);
    }, 800);
  };

  return (
    <footer
      id="contact-section"
      className="bg-slate-950 text-slate-205 pt-20 pb-12 border-t border-blue-900/40 relative overflow-hidden text-slate-200"
    >
      {/* Decorative abstract cosmic/blue light vector in footer background */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Upper Grid: Contact badge + Interactive Suggestion Box */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pb-16 border-b border-slate-800">
          <div>
            <span className="text-xs font-mono tracking-widest text-blue-400 uppercase font-extrabold block mb-1">
              CONTACT & NETWORKING
            </span>
            <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight leading-snug">
              연락처 및 소셜 미디어 채널
            </h3>
            <p className="text-xs text-slate-400 mt-2 max-w-md leading-relaxed">
              대학 및 기반을 넘나들며 적극적인 인스퍼레이션을 나누고자 합니다. 
              궁금한 사항이 있으시다면 언제든 아래의 채널로 편하게 기여 제안을 부탁드립니다.
            </p>

            {/* Social Links List */}
            <div className="flex flex-wrap gap-3 mt-6">
              <a
                id="footer-insta-link"
                href={PROFILE.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs bg-white/5 border border-white/10 hover:border-pink-500 hover:bg-pink-500/10 px-4 py-2.5 rounded-xl text-slate-300 hover:text-white transition-all cursor-pointer font-semibold shadow-3xs"
              >
                <Instagram className="w-4 h-4 text-pink-400" />
                <span>Instagram (@jithemax.404)</span>
              </a>
              <div
                id="footer-youtube-link"
                className="flex items-center gap-2 text-xs bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-slate-300 font-semibold"
              >
                <Youtube className="w-4 h-4 text-red-500" />
                <span>YouTube ({PROFILE.youtube})</span>
              </div>
              <div
                id="footer-blog-link"
                className="flex items-center gap-2 text-xs bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-slate-300 font-semibold"
              >
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span>Blog ({PROFILE.blog})</span>
              </div>
            </div>
          </div>

          {/* Fully Interactive Message Simulator Engine (재밌는 요소!) */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl backdrop-blur-xs">
            <span className="text-[10px] font-mono tracking-wider font-extrabold text-blue-400 uppercase block mb-1">
              INTERACTIVE GREETING SIMULATOR
            </span>
            <h4 className="font-display font-bold text-sm text-white mb-2 tracking-tight">
              가상 전송 방명록 시뮬레이터 💬
            </h4>
            
            {/* Quick Text suggestion list */}
            <div className="space-y-1.5 mb-4">
              {presetMessages.map((pText, pi) => (
                <button
                  key={pi}
                  onClick={() => setCustomMsg(pText)}
                  className="w-full text-left text-[11px] bg-slate-950/40 hover:bg-slate-950 hover:text-blue-300 px-3 py-1.5 rounded-lg border border-slate-800 text-slate-400 transition-all font-medium truncate"
                >
                  {pText}
                </button>
              ))}
            </div>

            {/* Form Input row */}
            <div className="relative">
              <input
                type="text"
                placeholder="지윤님에게 가상 메시지를 작성하세요..."
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500 pr-12 transition-all"
              />
              <button
                onClick={() => handleSendMessage(customMsg)}
                disabled={!customMsg.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 disabled:bg-slate-800 text-white rounded-lg transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Notification system */}
            {sentStatus === "sending" && (
              <p className="text-[11px] text-blue-400 mt-2 animate-pulse font-mono">가상 전송 위젯 처리 중...</p>
            )}
            {sentStatus === "success" && (
              <div className="mt-3 p-3 bg-blue-900/40 border border-blue-500/20 text-blue-200 rounded-xl text-[11px] leading-relaxed flex items-start gap-2 animate-fade-in shadow-inner">
                <Sparkles className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5 animate-spin" />
                <div>
                  <span className="font-extrabold block mb-0.5">시뮬레이터 전송 테스트 성공! 🎉</span>
                  방명록이 정상적으로 시뮬레이트되었습니다. 실제 홍지윤 기획자님께 정식 협업 메일을 제안하고 싶으시다면, 아래 공식 이메일 링크를 확인하세요!
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Detailed Contacts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 pt-12 text-slate-400">
          <div className="group">
            <span className="text-[10px] uppercase font-bold text-slate-600 block mb-2 font-mono">공식 비즈니스 회신</span>
            <a
              id="footer-email-link"
              href={`mailto:${PROFILE.email}`}
              className="font-display font-bold text-sm text-slate-300 hover:text-blue-400 transition-colors flex items-center gap-2 group-hover:scale-101 duration-200"
            >
              <Mail className="w-4 h-4 shrink-0 text-blue-500" />
              {PROFILE.email}
            </a>
          </div>

          <div className="group">
            <span className="text-[10px] uppercase font-bold text-slate-600 block mb-2 font-mono">전화 회선</span>
            <a
              id="footer-phone-link"
              href={`tel:${PROFILE.phone}`}
              className="font-display font-bold text-sm text-slate-300 hover:text-amber-500 transition-colors flex items-center gap-2 group-hover:scale-101 duration-200"
            >
              <Phone className="w-4 h-4 shrink-0 text-amber-500" />
              {PROFILE.phone}
            </a>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-600 block mb-2 font-mono">캠퍼스 소속 소망</span>
            <div className="font-display font-bold text-sm text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 shrink-0 text-indigo-400" />
              {PROFILE.education.university} ({PROFILE.education.graduationState})
            </div>
          </div>
        </div>

        {/* Bottom Credits row */}
        <div className="mt-16 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono text-slate-600">
          <span>© 2026 HONG JIYOON. ALL RIGHTS RESERVED.</span>
          <span className="font-bold text-blue-500">CULTURAL PLANNER BLUE NEXUS PORTFOLIO</span>
        </div>
      </div>
    </footer>
  );
}
