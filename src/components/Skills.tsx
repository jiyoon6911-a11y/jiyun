import { Video, Paintbrush, Users, Award, Brain } from "lucide-react";
import { SKILLS } from "../data";

export default function Skills() {
  const getCategoryIcon = (categoryStr: string) => {
    switch (categoryStr) {
      case "영상":
        return <Video className="w-5 h-5 text-blue-600" />;
      case "디자인":
        return <Paintbrush className="w-5 h-5 text-indigo-600" />;
      case "협업":
        return <Users className="w-5 h-5 text-cyan-600" />;
      case "AI":
        return <Brain className="w-5 h-5 text-blue-700" />;
      case "자격증":
        return <Award className="w-5 h-5 text-sky-600" />;
      default:
        return <Award className="w-5 h-5 text-blue-500" />;
    }
  };

  const getLevelBadgeMarkup = (level: string) => {
    switch (level) {
      case "상":
        return {
          label: "상 (전문 활용)",
          width: "w-full",
          colorClass: "bg-blue-600",
          textClass: "text-blue-700 bg-blue-50 border-blue-200",
          score: 3,
        };
      case "중":
        return {
          label: "중 (운영 수준)",
          width: "w-2/3",
          colorClass: "bg-cyan-500",
          textClass: "text-cyan-700 bg-cyan-50 border-cyan-200",
          score: 2,
        };
      default:
        return {
          label: "하 (기초 운용)",
          width: "w-1/3",
          colorClass: "bg-slate-400",
          textClass: "text-slate-600 bg-slate-50 border-slate-200",
          score: 1,
        };
    }
  };

  return (
    <section
      id="skills-section"
      className="py-24 bg-white/40 backdrop-blur-3xs border-t border-slate-100/50"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="max-w-2xl mb-16">
          <span className="text-xs font-mono tracking-widest text-emerald-600 block mb-2 font-bold uppercase">
            SKILLSET MATRIX
          </span>
          <h2 id="skills-section-title" className="font-display font-bold text-3xl sm:text-4xl text-slate-900 tracking-tight">
            보유 스킬
          </h2>
          <p className="text-sm text-slate-500 mt-2 leading-relaxed">
            영상 편집, 그래픽 디자인, 기획 전략 수립, 협업 마인드 및 최신 AI 기획 툴 숙련도 기준입니다.
          </p>
        </div>

        {/* Skills Board */}
        <div
          id="skills-cards-grid"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in"
        >
          {SKILLS.map((skill, idx) => {
            const levelInfo = getLevelBadgeMarkup(skill.level);
            return (
              <div
                key={`${skill.category}-${skill.name}`}
                id={`skill-card-${idx}`}
                className="group p-6 bg-slate-50/50 hover:bg-white border border-slate-200-rgba hover:border-blue-500 rounded-2xl flex flex-col justify-between hover:shadow-md transition-all duration-300 relative overflow-hidden"
              >
                {/* Decorative border accent */}
                <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-blue-500/0 via-blue-500/30 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />

                <div>
                  {/* Category and Title */}
                  <div className="flex items-start gap-4 mb-5">
                    <div className="p-2.5 bg-white border border-slate-100 rounded-xl group-hover:scale-110 group-hover:bg-blue-50 transition-all shadow-3xs">
                      {getCategoryIcon(skill.category)}
                    </div>
                    <div>
                      <span className="text-[9px] font-mono font-black text-blue-500 block uppercase tracking-wider">
                        {skill.category}
                      </span>
                      <h4
                        id={`skill-name-${idx}`}
                        className="font-display font-bold text-base text-slate-900 tracking-tight mt-0.5"
                      >
                        {skill.name}
                      </h4>
                    </div>
                  </div>
                </div>

                {/* Level indicators directly inside the card */}
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">숙련 기준</span>
                    <span
                      id={`skill-badge-${idx}`}
                      className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${levelInfo.textClass}`}
                    >
                      {levelInfo.label}
                    </span>
                  </div>

                  {/* Level Progress Gauge Bar (상: 3 segments, 중: 2 segments, 하: 1 segment) */}
                  <div className="flex gap-1 h-2 w-full mt-1.5" aria-hidden="true">
                    {[1, 2, 3].map((val) => (
                      <div
                        key={val}
                        className={`h-full flex-1 rounded-sm transition-all duration-300 ${
                          val <= levelInfo.score
                            ? `${levelInfo.colorClass} opacity-80 group-hover:opacity-100`
                            : "bg-slate-200"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
