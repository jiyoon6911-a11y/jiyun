import React, { useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { Search, Trophy, Calendar, MapPin, X, ArrowUpRight, Compass, Flag, Sparkles, Shuffle, Star, Milestone, Music, ArrowUpDown } from "lucide-react";
import { EXPERIENCES, AWARDS, Experience, Award as AwardType } from "../data";

type PortfolioItem = (Experience | AwardType) & { itemType: "experience" | "award" };

export default function PortfolioGrid() {
  const [activeTab, setActiveTab] = useState<"all" | "experience" | "award">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [animationClass, setAnimationClass] = useState("");
  const [sortBy, setSortBy] = useState<"recommend" | "newest" | "oldest">("recommend");

  // Auxiliary date parsing helper for robust sorting
  const parseDateForSorting = (item: any): number => {
    const dateStr = item.itemType === "award" ? item.date : item.period;
    if (!dateStr) return 0;
    
    const yearMatch = dateStr.match(/(\d{4})\s*년/);
    const monthMatch = dateStr.match(/(\d{1,2})\s*월/);
    const dayMatch = dateStr.match(/(\d{1,2})\s*일/);
    
    const year = yearMatch ? parseInt(yearMatch[1], 10) : 1970;
    const month = monthMatch ? parseInt(monthMatch[1], 10) : 1;
    const day = dayMatch ? parseInt(dayMatch[1], 10) : 1;
    
    return year * 10000 + month * 100 + day;
  };

  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [tilt, setTilt] = useState<{ [key: string]: { x: number; y: number } }>({});

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, id: string) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const midX = rect.width / 2;
    const midY = rect.height / 2;
    
    // Tilt angle (max 6 degrees)
    const rotateX = -((y - midY) / midY) * 6;
    const rotateY = ((x - midX) / midX) * 6;
    
    setTilt((prev) => ({
      ...prev,
      [id]: { x: rotateX, y: rotateY }
    }));
  };

  const handleMouseLeave = (id: string) => {
    setHoveredCard(null);
    setTilt((prev) => ({
      ...prev,
      [id]: { x: 0, y: 0 }
    }));
  };

  // Combine items into a unified collection
  const allItems = useMemo(() => {
    const exps = EXPERIENCES.map((e) => ({ ...e, itemType: "experience" as const }));
    const awds = AWARDS.map((a) => ({ ...a, itemType: "award" as const }));
    return [...exps, ...awds];
  }, []);

  // Preset quick tags categorized from original text
  const quickTags = [
    { label: "교내활동", value: "교내" },
    { label: "대외활동", value: "대외" },
    { label: "학술제", value: "학술" },
    { label: "현장실습", value: "실습" },
    { label: "동아리", value: "동아리" },
    { label: "전국대회/해커톤", value: "해커톤" },
    { label: "상장/상패", value: "우수" },
  ];

  // Filter based on selected tab, search query, and current active quickTag
  const filteredItems = useMemo(() => {
    const filtered = allItems.filter((item) => {
      // Tab filter
      if (activeTab !== "all" && item.itemType !== activeTab) {
        return false;
      }

      // Quick Tag filter
      if (selectedTag) {
        const titleMatch = item.title.includes(selectedTag);
        const descMatch = item.description.includes(selectedTag);
        const orgMatch = item.organization.includes(selectedTag);
        const catMatch = item.categoryKo.includes(selectedTag);
        if (!titleMatch && !descMatch && !orgMatch && !catMatch) {
          return false;
        }
      }

      // Search matching text
      if (searchQuery.trim() === "") return true;
      const query = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(query);
      const matchOrg = item.organization.toLowerCase().includes(query);
      const matchDesc = item.description.toLowerCase().includes(query);

      return matchTitle || matchOrg || matchDesc;
    });

    if (sortBy === "newest") {
      return [...filtered].sort((a, b) => parseDateForSorting(b) - parseDateForSorting(a));
    } else if (sortBy === "oldest") {
      return [...filtered].sort((a, b) => parseDateForSorting(a) - parseDateForSorting(b));
    }

    return filtered;
  }, [allItems, activeTab, searchQuery, selectedTag, sortBy]);

  // Fun generator trigger: randomly deal a card from the actual deck
  const handleRandomPick = () => {
    setAnimationClass("animate-pulse border-blue-500 scale-102");
    const randomIndex = Math.floor(Math.random() * allItems.length);
    const randomPick = allItems[randomIndex];
    
    // Smooth timing delay
    setTimeout(() => {
      setSelectedItem(randomPick);
      setAnimationClass("");
    }, 400);
  };

  return (
    <section
      id="portfolio-section"
      className="py-24 bg-[#f1f5f9]/30 backdrop-blur-3xs border-t border-blue-50/50 relative"
    >
      {/* Decorative Blueprint Lines Grid */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-xl">
            <span className="text-xs font-mono tracking-widest text-emerald-600 block mb-2 font-bold uppercase flex items-center gap-1.5 animate-pulse">
              <Music className="w-3.5 h-3.5 text-emerald-500" /> STAGE LINEUP & ACTIVITY TIMETABLE
            </span>
            <h2 id="portfolio-section-title" className="font-display font-bold text-3xl sm:text-4xl text-slate-900 tracking-tight">
              활동 셋리스트
            </h2>
            <p className="text-sm text-slate-500 mt-2 leading-relaxed">
              대학 생활 동안 주도해 온 페스티벌 기획 및 글로벌 펜타 드리머 대외활동, 동아리 리더십(CON:NECT), 
              산학 협력 실무(안녕하는사이), 최우수 학술제 등 <strong>홍지윤의 통합 누적 오리지널 스테이지 데이터베이스</strong>입니다.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Real-time search bar */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="portfolio-search-input"
                type="text"
                placeholder="행사명, 기획 내용 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 px-10 py-2.5 rounded-2xl text-xs font-medium focus:ring-1 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all shadow-3xs text-slate-900"
              />
              {searchQuery && (
                <button
                  id="search-clear-btn"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Date Sorting Dropdown Selector */}
            <div className="relative w-full sm:w-44">
              <select
                id="portfolio-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="appearance-none w-full bg-white border border-slate-200 pl-4 pr-10 py-2.5 rounded-2xl text-xs font-semibold focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-3xs text-slate-800 cursor-pointer"
              >
                <option value="recommend">추천 활동순</option>
                <option value="newest">최신 날짜순 📅</option>
                <option value="oldest">과거 날짜순 ⏳</option>
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              </div>
            </div>

            {/* Lucky Random Drawer Trigger! */}
            <button
              onClick={handleRandomPick}
              className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2.5 rounded-2xl text-xs font-semibold cursor-pointer shadow-xs active:scale-95 transition-all text-center whitespace-nowrap group"
              title="홍지윤의 역량 데이터베이스에서 임의의 기획 카드를 한 건 무작위로 추출하여 집중 상영합니다!"
            >
              <Shuffle className="w-3.5 h-3.5 group-hover:rotate-45 transition-transform text-white/90" />
              <span>랜덤 활동 쏙 뽑기 🎁</span>
            </button>
          </div>
        </div>

        {/* Tab Buttons Filter Console */}
        <div id="portfolio-filter-tabs" className="flex items-center gap-1.5 border-b border-slate-200/50 pb-6 mb-6 overflow-x-auto scroller-hidden">
          <button
            id="portfolio-tab-all"
            onClick={() => { setActiveTab("all"); setSelectedTag(null); }}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold cursor-pointer transition-all whitespace-nowrap ${
              activeTab === "all" && !selectedTag
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            전체 통합 기록 ({allItems.length})
          </button>
          <button
            id="portfolio-tab-experience"
            onClick={() => { setActiveTab("experience"); setSelectedTag(null); }}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold cursor-pointer transition-all whitespace-nowrap ${
              activeTab === "experience" && !selectedTag
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            기획 및 실습 활동 ({EXPERIENCES.length})
          </button>
          <button
            id="portfolio-tab-award"
            onClick={() => { setActiveTab("award"); setSelectedTag(null); }}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold cursor-pointer transition-all whitespace-nowrap ${
              activeTab === "award" && !selectedTag
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            수상 이력 ({AWARDS.length})
          </button>
        </div>

        {/* Brand New Quick Tag Clouds (Very playful interaction!) */}
        <div className="flex flex-wrap items-center gap-1.5 mb-8">
          <span className="text-[10px] font-mono tracking-wider font-extrabold text-blue-600 mr-2 flex items-center gap-1">
            <Milestone className="w-3.5 h-3.5" /> QUICK SHORTCUT TAGS:
          </span>
          {quickTags.map((tag) => {
            const isSelected = selectedTag === tag.value;
            return (
              <button
                key={tag.value}
                onClick={() => {
                  setSelectedTag(isSelected ? null : tag.value);
                  setSearchQuery(""); // Clear search to let tag lead
                }}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-bold cursor-pointer transition-all ${
                  isSelected
                    ? "bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-md ring-1 ring-blue-300"
                    : "bg-white border border-slate-100 hover:border-slate-300 text-slate-500"
                }`}
              >
                #{tag.label}
              </button>
            );
          })}
          {selectedTag && (
            <button
              onClick={() => setSelectedTag(null)}
              className="text-[10px] font-bold text-red-500 cursor-pointer hover:underline pl-1"
            >
              필터 해제
            </button>
          )}
        </div>

        {/* Dynamic Bento Grid of Cards */}
        {filteredItems.length === 0 ? (
          <div id="no-items-fallback" className="text-center py-20 bg-white border border-slate-100 rounded-3xl">
            <Compass className="w-8 h-8 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-900">찾으시는 기록 조건이 존재하지 않습니다.</p>
            <p className="text-xs text-slate-405 mt-1">다른 키워드로 검색하거나 선택한 태그 단추를 다시 눌러주세요.</p>
          </div>
        ) : (
          <div id="portfolio-cards-grid" className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${animationClass}`}>
            {filteredItems.map((item) => {
              const isAward = item.itemType === "award";
              const isHovered = hoveredCard === item.id;
              const cardTilt = tilt[item.id] || { x: 0, y: 0 };
              
              return (
                <div
                  key={item.id}
                  id={`item-card-${item.id}`}
                  onClick={() => setSelectedItem(item)}
                  onMouseEnter={() => setHoveredCard(item.id)}
                  onMouseMove={(e) => handleMouseMove(e, item.id)}
                  onMouseLeave={() => handleMouseLeave(item.id)}
                  style={{
                    transform: `perspective(1000px) rotateX(${cardTilt.x}deg) rotateY(${cardTilt.y}deg) scale(${isHovered ? 1.025 : 1})`,
                    transition: isHovered ? "none" : "transform 0.25s cubic-bezier(0.25, 0.8, 0.25, 1)",
                  }}
                  className="group bg-white border border-slate-200/90 hover:border-emerald-500/80 rounded-2xl p-6 cursor-pointer flex flex-col justify-between hover:shadow-[0_12px_28px_rgba(16,185,129,0.12)] transition-all duration-300 relative overflow-hidden"
                >
                  {/* Gentle gradient light backdrop glow on card hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-emerald-50/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                  <div>
                    {/* Header: Category Badge and Icon */}
                    <div className="flex items-center justify-between mb-4 relative z-10">
                      <span
                        id={`item-category-${item.id}`}
                        className={`text-[10px] font-mono font-bold tracking-tight px-2.5 py-1 rounded-full uppercase ${
                          isAward
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                        }`}
                      >
                        {item.categoryKo}
                      </span>
                      {isAward ? (
                        <Trophy className="w-4 h-4 text-amber-500 group-hover:scale-115 group-hover:rotate-12 transition-transform" />
                      ) : (
                        <Flag className="w-4 h-4 text-emerald-500 group-hover:scale-115 transition-transform" />
                      )}
                    </div>

                    {/* Title */}
                    <h3
                      id={`item-title-${item.id}`}
                      className="font-display font-bold text-base text-slate-900 tracking-tight mb-2 leading-tight group-hover:text-emerald-600 transition-colors relative z-10"
                    >
                      {item.title}
                    </h3>

                    {/* Short Description */}
                    {item.description && (
                      <p
                        id={`item-desc-${item.id}`}
                        className="text-xs text-slate-500 line-clamp-3 leading-relaxed mb-4 relative z-10 font-normal"
                      >
                        {item.description}
                      </p>
                    )}
                  </div>

                  {/* Metadata & Secondary Details */}
                  <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between relative z-10">
                    <div className="flex flex-col gap-0.5 max-w-[80%] font-mono">
                      <span className="text-[10px] tracking-tight text-slate-400 font-bold truncate flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-450 shrink-0" />
                        {item.organization}
                      </span>
                      <span className="text-[10px] tracking-tight text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-emerald-500 shrink-0" />
                        {isAward ? (item as AwardType).date : (item as Experience).period}
                      </span>
                    </div>
                    <div className="p-1.5 bg-slate-50 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-3xs">
                      <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Detail Inspection Modal Dialog with beautiful emerald Backdrop & Styling, rendered at document.body level using createPortal */}
        {selectedItem && createPortal(
          <div
            id="detail-modal-overlay"
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-[9999] animate-fade-in"
            onClick={() => setSelectedItem(null)}
          >
            <div
              id="detail-modal-board"
              className="relative bg-white w-full max-w-2xl rounded-3xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl border border-emerald-500/10 animate-pop-out"
              onClick={(e) => e.stopPropagation()} // Prevent close on card click
            >
              {/* Close Button */}
              <button
                id="modal-close-btn"
                onClick={() => setSelectedItem(null)}
                className="absolute right-6 top-6 p-2 text-slate-400 hover:text-slate-950 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Tag indicator category */}
              <div className="flex items-center gap-2 mb-4">
                <span className={`text-[9px] font-mono font-black tracking-wider px-2.5 py-1 rounded-full uppercase ${
                  selectedItem.itemType === "award"
                    ? "bg-amber-100 text-amber-800"
                    : "bg-emerald-600 text-white"
                }`}>
                  {selectedItem.itemType === "award" ? "수상 (AWARD)" : "활동 (EXPERIENCE)"}
                </span>
                <span className="text-xs text-emerald-600 font-extrabold">{selectedItem.categoryKo}</span>
              </div>

              {/* Title */}
              <h2 id="modal-project-title" className="font-display font-extrabold text-xl sm:text-2xl text-slate-900 tracking-tight leading-tight pr-8 mb-4">
                {selectedItem.title}
              </h2>

              {/* Metadata strip */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gradient-to-tr from-slate-50 to-emerald-50/40 rounded-2xl border border-slate-200/50 mb-6 font-mono text-xs text-slate-600">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">진행 및 발급 기관</span>
                  <div className="font-bold text-slate-800 flex items-center gap-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    {selectedItem.organization}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">일정 / 기간</span>
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    {selectedItem.itemType === "award"
                      ? (selectedItem as AwardType).date
                      : (selectedItem as Experience).period}
                  </div>
                </div>
              </div>

              {/* Main Contents */}
              <div className="mb-2 space-y-4">
                {selectedItem.description ? (
                  <div>
                    <span className="text-[10px] font-mono text-emerald-600 font-bold block uppercase mb-2">상세 정보 요약 기록</span>
                    <p className="text-sm text-slate-800 leading-relaxed font-normal whitespace-pre-wrap bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                      {selectedItem.description}
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">상세 텍스트 설명 없음</p>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
      </div>
    </section>
  );
}
