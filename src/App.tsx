import Header from "./components/Header";
import Hero from "./components/Hero";
import Skills from "./components/Skills";
import PortfolioGrid from "./components/PortfolioGrid";
import Footer from "./components/Footer";

export default function App() {
  const handleScrollTo = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div id="app-root-shell" className="min-h-screen flex flex-col font-sans select-none antialiased">
      {/* Sticky Header */}
      <Header onScrollTo={handleScrollTo} />

      {/* Main Single-View Component Content Area */}
      <main id="app-main-view" className="flex-1">
        {/* Section 1: Hero & academic profile cards */}
        <Hero onLearnMore={() => handleScrollTo("skills-section")} />

        {/* Section 2: Interactive skill metrics matrix */}
        <Skills />

        {/* Section 3: Filterable Bento dynamic database (Experiences & Awards) */}
        <PortfolioGrid />
      </main>

      {/* Section 4: Footer contact / networking channels */}
      <Footer />
    </div>
  );
}
