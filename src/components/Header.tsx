import { useState, useEffect } from "react";
import { Menu, X, ArrowUpRight, Sparkles } from "lucide-react";

interface HeaderProps {
  onScrollTo: (sectionId: string) => void;
}

export default function Header({ onScrollTo }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "소속 및 소개", id: "profile-section" },
    { label: "보유 스킬", id: "skills-section" },
    { label: "기획 & 시상", id: "portfolio-section" },
    { label: "네트워킹", id: "contact-section" },
  ];

  const handleNavClick = (sectionId: string) => {
    setIsMenuOpen(false);
    onScrollTo(sectionId);
  };

  return (
    <header
      id="main-app-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/85 backdrop-blur-md shadow-xs border-b border-blue-100/80 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <div
          id="header-logo-container"
          className="flex items-center gap-2.5 cursor-pointer group"
          onClick={() => handleNavClick("hero-section")}
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white font-display font-bold text-sm tracking-wider shadow-sm group-hover:rotate-12 transition-all duration-300">
            場
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-sm tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
              Hong Jiyoon
            </span>
            <span className="text-[10px] text-blue-500 font-mono tracking-widest mt-[-2px] font-bold">
              CULTURAL PLANNER
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav id="desktop-navbar" className="hidden md:flex items-center gap-8">
          {navItems.map((item, idx) => (
            <button
              key={item.id}
              id={`nav-link-${idx}`}
              onClick={() => handleNavClick(item.id)}
              className="text-xs font-semibold text-slate-600 hover:text-blue-600 tracking-tight transition-colors cursor-pointer relative py-1 group"
            >
              {item.label}
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-blue-600 transition-all duration-300 group-hover:w-full" />
            </button>
          ))}
          <button
            id="nav-collaboration-cta"
            onClick={() => handleNavClick("contact-section")}
            className="flex items-center gap-1.5 text-[11px] font-mono uppercase bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-5 py-2.5 rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
          >
            LET'S CONNECT <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          </button>
        </nav>

        {/* Mobile Navigation Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <button
            id="mobile-menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-1.5 text-slate-900 hover:bg-blue-50/50 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMenuOpen && (
        <div
          id="mobile-drawer"
          className="fixed inset-0 top-[60px] bg-white z-40 flex flex-col px-6 py-8 md:hidden animate-fade-in"
        >
          <div className="flex flex-col gap-6">
            {navItems.map((item, idx) => (
              <button
                key={item.id}
                id={`mobile-nav-link-${idx}`}
                onClick={() => handleNavClick(item.id)}
                className="text-left text-lg font-medium text-slate-800 py-2 border-b border-slate-100 flex items-center justify-between hover:text-blue-600 hover:pl-2 transition-all"
              >
                <span>{item.label}</span>
                <ArrowUpRight className="w-4 h-4 text-slate-400" />
              </button>
            ))}
            <button
              id="mobile-drawer-cta"
              onClick={() => handleNavClick("contact-section")}
              className="w-full mt-4 text-center text-sm font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3.5 rounded-xl uppercase tracking-wider shadow-md hover:opacity-95"
            >
              협업 제안하기
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
