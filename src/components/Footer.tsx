import React, { useEffect, useState, useRef } from "react";
import { Terminal, Send, Sparkles, AlertCircle, User, MessageSquare, Clock } from "lucide-react";
import { collection, query, orderBy, limit, addDoc, onSnapshot } from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../firebase";

interface GuestbookMessage {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

export default function Footer() {
  const [messages, setMessages] = useState<GuestbookMessage[]>([]);
  const [authorName, setAuthorName] = useState("");
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  const logEndRef = useRef<HTMLDivElement>(null);

  // Subscribe to Firestore live messages on component mount
  useEffect(() => {
    let unsubscribe = () => {};
    try {
      const q = query(
        collection(db, "guestbook"),
        orderBy("createdAt", "asc"),
        limit(80)
      );
      
      unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const loaded: GuestbookMessage[] = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            loaded.push({
              id: doc.id,
              author: data.author || "익명",
              text: data.text || "",
              createdAt: data.createdAt || new Date().toISOString(),
            });
          });
          setMessages(loaded);
          setLoading(false);
          
          // Smoother scrolling to bottom
          setTimeout(() => {
            logEndRef.current?.scrollIntoView({ behavior: "smooth" });
          }, 100);
        },
        (err) => {
          setErrorStatus("방명록 로딩 중 오류가 발생했습니다.");
          handleFirestoreError(err, OperationType.LIST, "guestbook");
        }
      );
    } catch (err) {
      setErrorStatus("Firebase 실시간 연결에 실패했습니다.");
      setLoading(false);
    }

    return () => unsubscribe();
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalAuthor = authorName.trim() || "익명의 관객";
    const finalTxt = messageText.trim();
    if (!finalTxt) return;

    setIsSending(true);
    setErrorStatus(null);

    const payload = {
      author: finalAuthor.substring(0, 80),
      text: finalTxt.substring(0, 450),
      createdAt: new Date().toISOString(),
    };

    try {
      await addDoc(collection(db, "guestbook"), payload);
      setMessageText("");
      // Reset input state but keep author name for easier repeated chats
    } catch (err) {
      setErrorStatus("메시지 저장 중 오류가 발생했습니다. (보안 규칙 위반 또는 네트워크 지연)");
    } finally {
      setIsSending(false);
    }
  };

  const formatTime = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
    } catch {
      return "00:00:00";
    }
  };

  return (
    <footer
      id="contact-section"
      className="bg-slate-950 text-slate-200 pt-16 pb-12 border-t border-blue-900/40 relative overflow-hidden"
    >
      {/* Decorative ambient radial lighting in the footer background */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        
        {/* Upper Header: System Status & Live Logs Introduction */}
        <div className="mb-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 rounded-full text-[10px] font-mono mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            LIVE GUESTBOOK SERVER: ONLINE
          </div>
          <h3 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight leading-snug">
            실시간 라이브 방명록 시스템 💬
          </h3>
          <p className="text-xs text-slate-400 mt-2 max-w-xl leading-relaxed">
            페스티벌 콘서트와 밴드 음악을 아끼는 분들과의 공유를 위해 구축한 <strong>진짜 방명록 시스템</strong>입니다. 
            남겨주신 소중한 피드백과 기록은 <strong>Firebase Firestore 실시간 데이터베이스</strong>에 저장되어 언제든 계속해서 확인하실 수 있습니다.
          </p>
        </div>

        {/* Grand Terminal / System Console Board */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Column 1 & 2: Real-time scrolling terminal output panel */}
          <div className="lg:col-span-2 flex flex-col bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl h-[380px] hover:border-blue-500/40 transition-colors">
            {/* Terminal Tab Header bar */}
            <div className="bg-slate-950/80 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400 select-none">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-blue-500" />
                <span>guestbook_stream.log</span>
              </div>
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/45" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/45" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/45" />
              </div>
            </div>

            {/* Terminal Body Screen Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-xs text-slate-300">
              {loading ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-2 font-mono">
                  <div className="w-5 h-5 rounded-full border-2 border-slate-700 border-t-blue-500 animate-spin" />
                  <span>INITIALIZING DATABASE CONNECTION...</span>
                </div>
              ) : messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 text-center p-6 gap-2">
                  <MessageSquare className="w-8 h-8 text-slate-700 mb-1" />
                  <span className="text-slate-400 font-bold">[!] NO RECORDS IN LOG</span>
                  <span className="text-[11px] text-slate-500">첫 번째 라이브 방명록 메시지를 기록해주세요.</span>
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className="p-3 bg-slate-950/70 border border-slate-850/60 rounded-xl hover:border-slate-800 transition-colors group"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1 text-[10px] text-slate-500">
                        <div className="flex items-center gap-1.5 font-bold">
                          <User className="w-3 h-3 text-blue-400/80" />
                          <span className="text-blue-300">{msg.author}</span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-500">
                          <Clock className="w-3 h-3 text-slate-600" />
                          <span>{formatTime(msg.createdAt)}</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-wrap break-all pl-4 border-l-2 border-blue-500/40">
                        {msg.text}
                      </p>
                    </div>
                  ))}
                  <div ref={logEndRef} />
                </div>
              )}
            </div>
          </div>

          {/* Column 3: Live Input Panel */}
          <div className="flex flex-col justify-between bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-2xl h-[380px]">
            <div>
              <span className="text-[9px] font-mono tracking-widest font-extrabold text-blue-400 uppercase block mb-1">
                SYSTEM REGISTER TERMINAL
              </span>
              <h4 className="font-display font-bold text-sm text-white tracking-tight mb-3 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" /> 방명록 등록하기
              </h4>

              <div className="text-xs text-slate-400 font-sans leading-relaxed mb-4">
                홍지윤 기획자에게 따뜻한 응원의 한마디나 관람 소감을 실시간으로 등록해 보세요!
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSendMessage} className="space-y-2">
              <div className="flex flex-col gap-2">
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder="작성자 이름 / 닉네임"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-600 outline-none focus:border-blue-500 transition-all"
                  />
                </div>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="올릴 내용을 입력하세요..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 outline-none focus:border-blue-500 pr-10 transition-all"
                  />
                  <button
                    type="submit"
                    disabled={!messageText.trim() || isSending}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-850 disabled:hover:bg-slate-850 text-white rounded-lg transition-colors cursor-pointer flex items-center justify-center shrink-0 w-7 h-7"
                    title="기록 추가"
                  >
                    <Send className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {errorStatus && (
                <div className="text-[9px] text-red-400 bg-red-950/20 border border-red-900/30 p-2 rounded-lg flex items-start gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                  <span>{errorStatus}</span>
                </div>
              )}
            </form>
          </div>

        </div>

        {/* Bottom Credits row (Removed any Mail, Phone or Instagram links completely) */}
        <div className="mt-16 pt-8 border-t border-slate-900/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono text-slate-600">
          <span>© 2026 HONG JIYOON. ALL RIGHTS RESERVED.</span>
          <span className="font-bold text-blue-500">CULTURAL PLANNER BLUE NEXUS PORTFOLIO</span>
        </div>
      </div>
    </footer>
  );
}
