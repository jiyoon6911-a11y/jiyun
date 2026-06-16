import { useState } from "react";
import { Video, Paintbrush, Users, Award, Brain, Zap, Sparkles, Plus, ThumbsUp } from "lucide-react";
import { SKILLS } from "../data";

export default function Skills() {
  // Combo list of selected skills
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const getCategoryIcon = (categoryStr: string) => {
    switch (categoryStr) {
      case "영상":
        return <Video className="w-5 h-5 text-blue-600 animate-pulse" />;
      case "디자인":
        return <Paintbrush className="w-5 h-5 text-indigo-600" />;
      case "협업":
        return <Users className="w-5 h-5 text-cyan-600" />;
      case "AI":
        return <Brain className="w-5 h-5 text-blue-700 font-bold" />;
      case "자격증":
        return <Award className="w-5 h-5 text-sky-600" />;
      default:
        return <Award className="w-5 h-5 text-blue-500" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "상":
        return "bg-blue-600 text-white border-blue-500 shadow-3xs";
      case "중":
        return "bg-cyan-50 text-cyan-800 border-cyan-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-250";
    }
  };

  // Toggle skills selected state
  const handleToggleSkill = (skillName: string) => {
    if (selectedSkills.includes(skillName)) {
      setSelectedSkills((prev) => prev.filter((name) => name !== skillName));
    } else {
      setSelectedSkills((prev) => [...prev, skillName]);
    }
  };

  // Multi-skill combination logic (completely procedural from client data!)
  const comboAnalysis = () => {
    const size = selectedSkills.length;
    if (size === 0) {
      return {
        percent: 0,
        title: "스킬 카드를 클릭하세요!",
        desc: "역량 카드들을 터치하여 시너지 시뮬레이션을 돌려보세요! 홍지윤의 융복합 시너지 분석 지수가 실시간으로 계산됩니다.",
        colorClass: "bg-slate-50 border-slate-200 text-slate-500",
        badge: "대기",
      };
    }
    if (size <= 2) {
      return {
        percent: 30,
        title: "창의적 융합의 발아 단계",
        desc: "선택하신 주요 도구들이 유기적으로 연결되어, 아이디어를 시각 콘텐츠로 매끄럽게 번역해내는 크리에이티브 시너지가 나타납니다.",
        colorClass: "bg-blue-50/50 border-blue-200 text-blue-800",
        badge: "BASIC COMBINATION",
      };
    }
    if (size <= 4) {
      return {
        percent: 75,
        title: "다기능 기획 크리에이터 포텐셜",
        desc: "디지털 툴 설계 능력과 탄탄한 협업 역량이 만나 복잡한 문화 행사의 비계획적 위기를 정구조적으로 제어하는 고차원 기획력이 발산됩니다.",
        colorClass: "bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200 text-blue-900",
        badge: "ADVANCED MULTITASKER",
      };
    }
    return {
      percent: 100,
      title: "올라운더 문화 기획 디렉터 스키마",
      desc: "영상, 디자인, 바이브 코딩, AI, 자격증, 협업의 완전한 결합! 어떤 낯선 공간에서도 기어이 고품격 로컬 가치를 창조하는 전천후 기획력의 최고조입니다.",
      colorClass: "bg-gradient-to-r from-blue-600 to-indigo-700 border-blue-600 text-white",
      badge: "ULTIMATE MASTER COMBINATION! ⚡️",
    };
  };

  const currentAnalysis = comboAnalysis();

  return (
    <section
      id="skills-section"
      className="py-24 bg-white border-t border-slate-100"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="max-w-2xl mb-12">
          <span className="text-xs font-mono tracking-widest text-blue-600 block mb-2 font-bold uppercase">
            SKILLSET MATRIX & INTERACTIVE SIMULATION
          </span>
          <h2 id="skills-section-title" className="font-display font-bold text-3xl sm:text-4xl text-slate-900 tracking-tight">
            보유 역량 및 시너지 시뮬레이터
          </h2>
          <p className="text-sm text-slate-500 mt-2 leading-relaxed">
            영상 편집, 그래픽, 프레젠테이션 설계, AI 활용 등의 실무형 툴 라인업입니다. 
            <strong> 카드들을 조립하여</strong> 실시간 문화 기획 시너지 지수를 테스트해 보세요!
          </p>
        </div>

        {/* Skills Board */}
        <div
          id="skills-cards-grid"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12 animate-pop-out"
        >
          {SKILLS.map((skill, idx) => {
            const isSelected = selectedSkills.includes(skill.name);
            return (
              <div
                key={`${skill.category}-${skill.name}`}
                id={`skill-card-${idx}`}
                onClick={() => handleToggleSkill(skill.name)}
                className={`group p-5 rounded-2xl flex flex-col justify-between cursor-pointer border transition-all duration-300 relative select-none ${
                  isSelected
                    ? "bg-blue-50/70 border-blue-600 shadow-sm ring-1 ring-blue-600/30 scale-102"
                    : "bg-slate-50/65 hover:bg-slate-55 border-slate-250 hover:border-blue-400"
                }`}
              >
                {/* Active check indicator */}
                <div className="absolute top-2.5 right-2.5">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isSelected ? "bg-blue-600 text-white" : "bg-slate-200/50 text-slate-400 group-hover:bg-slate-300/60"
                  }`}>
                    {isSelected ? "ON" : <Plus className="w-3 h-3" />}
                  </span>
                </div>

                <div className="flex items-start gap-4">
                  <div className={`p-2.5 rounded-xl border transition-all ${
                    isSelected ? "bg-white border-blue-300" : "bg-white border-slate-200"
                  }`}>
                    {getCategoryIcon(skill.category)}
                  </div>
                  <div>
                    <span className="text-[9px] font-mono font-bold text-slate-400 block uppercase tracking-wider">
                      {skill.category}
                    </span>
                    <h4
                      id={`skill-name-${idx}`}
                      className="font-display font-bold text-sm text-slate-900 tracking-tight mt-0.5"
                    >
                      {skill.name}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-5 pt-3 border-t border-slate-200/50">
                  <span className="text-[10px] text-slate-400 font-mono">숙련 기준</span>
                  <span
                    id={`skill-badge-${idx}`}
                    className={`text-[10px] font-bold font-sans px-2.5 py-0.5 rounded-full border ${getLevelColor(
                      skill.level
                    )}`}
                  >
                    {skill.level === "상" ? "전문 활용" : skill.level === "중" ? "운영 수준" : "기초 운용"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Combo Analyzer Console Panel */}
        <div className={`rounded-3xl p-6 sm:p-8 border transition-all duration-300 ${currentAnalysis.colorClass}`}>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex-1">
              <span className="text-[10px] font-mono tracking-widest font-bold uppercase block mb-1.5 opacity-80">
                {currentAnalysis.badge}
              </span>
              <h3 className="font-display font-extrabold text-lg sm:text-xl tracking-tight flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500 animate-bounce" />
                {currentAnalysis.title}
              </h3>
              <p className="text-xs sm:text-sm mt-2 leading-relaxed opacity-90 max-w-2xl font-medium">
                {currentAnalysis.desc}
              </p>
              {selectedSkills.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5 items-center">
                  <span className="text-[10px] uppercase font-mono tracking-wider opacity-70 mr-1.5">조합된 스킬:</span>
                  {selectedSkills.map((name) => (
                    <span key={name} className="px-2.5 py-0.5 bg-white/20 text-xs font-bold rounded-lg backdrop-blur-xs border border-white/10 text-white hover:bg-white/40">
                      {name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Simulated circular/box progress gauge */}
            <div className="w-full md:w-auto flex flex-col items-center justify-center bg-white/10 p-5 rounded-2xl border border-white/15 shrink-0 text-center min-w-[200px]">
              <span className="text-[10px] uppercase tracking-wider font-mono opacity-80 block mb-1.5 font-bold">융합 기획 시너지 지수</span>
              <div className="relative w-28 h-28 flex items-center justify-center">
                {/* SVG circular track */}
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="56" cy="56" r="48" className="stroke-slate-300" strokeWidth="6" fill="transparent" />
                  <circle
                    cx="56"
                    cy="56"
                    r="48"
                    className="stroke-blue-500 transition-all duration-550"
                    strokeWidth="8"
                    strokeDasharray={301.6}
                    strokeDashoffset={301.6 - (301.6 * currentAnalysis.percent) / 100}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-2xl font-black">{currentAnalysis.percent}%</span>
                  <span className="text-[9px] font-mono font-bold tracking-tight uppercase">POWER INDEX</span>
                </div>
              </div>
              {selectedSkills.length > 0 && (
                <button
                  onClick={() => setSelectedSkills([])}
                  className="mt-3 text-[10px] underline font-mono text-center hover:opacity-80 cursor-pointer"
                >
                  초기화하기
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
