import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroHook } from './components/HeroHook';
import { ProblemFraming } from './components/ProblemFraming';
import { InteractiveSandbox } from './components/InteractiveSandbox/InteractiveSandbox';
import { MathematicalDeepDive } from './components/MathematicalDeepDive';
import { BDHArchitectureModule } from './components/BDHArchitectureModule';
import { LimitationsAndTradeoffs } from './components/LimitationsAndTradeoffs';
import { KeyTakeaways } from './components/KeyTakeaways';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('hero');

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'bottleneck', 'sandbox', 'math', 'bdh', 'tradeoffs', 'takeaways'];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-stone-900 flex flex-col selection:bg-amber-200 selection:text-stone-900 font-sans">
      <Navbar
        activeSection={activeSection}
        onNavigate={scrollToSection}
      />

      <main className="flex-1">
        {/* Section 01: The Mystery / Hook */}
        <HeroHook onExploreClick={() => scrollToSection('sandbox')} />

        {/* Section 02: Autoregressive Decoding & The KV Tax */}
        <ProblemFraming />

        {/* Section 03: Interactive Experimental Bench */}
        <InteractiveSandbox />

        {/* Section 04: Chalkboard Mathematical Derivations */}
        <MathematicalDeepDive />

        {/* Section 05: Primary Literature on Dragon Hatchling (BDH) */}
        <BDHArchitectureModule />

        {/* Section 06: The Catch: Finite Rank & Interference */}
        <LimitationsAndTradeoffs />

        {/* Section 07: Key Takeaways Summary */}
        <KeyTakeaways />
      </main>

      <Footer />
    </div>
  );
};

export default App;
