import React from 'react';

interface NavbarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  onNavigate,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-[#FAF9F5]/90 backdrop-blur-md border-b border-stone-200 px-4 sm:px-8 py-3.5 transition-all">
      <div className="max-w-3xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <div className="cursor-pointer" onClick={() => onNavigate('hero')}>
          <span className="font-serif font-bold text-lg text-stone-900 tracking-tight">
            Frontier AI Lab
          </span>
        </div>

        {/* Section links */}
        <nav className="flex items-center space-x-2 sm:space-x-4 font-sans text-xs">
          <button
            onClick={() => onNavigate('bottleneck')}
            className="text-stone-600 hover:text-stone-900 transition-colors"
          >
            The Dilemma
          </button>
          <button
            onClick={() => onNavigate('sandbox')}
            className="text-stone-600 hover:text-stone-900 transition-colors font-medium"
          >
            Interactive Bench
          </button>
          <button
            onClick={() => onNavigate('math')}
            className="text-stone-600 hover:text-stone-900 transition-colors"
          >
            The Math
          </button>
          <button
            onClick={() => onNavigate('bdh')}
            className="text-stone-600 hover:text-stone-900 transition-colors"
          >
            Dragon Hatchling
          </button>
          <a
            href="https://arxiv.org/abs/2509.26507"
            target="_blank"
            rel="noreferrer"
            className="text-stone-500 hover:text-stone-800 transition-colors underline decoration-stone-300 underline-offset-4 font-mono text-[11px]"
          >
            Paper ↗
          </a>
        </nav>
      </div>
    </header>
  );
};
